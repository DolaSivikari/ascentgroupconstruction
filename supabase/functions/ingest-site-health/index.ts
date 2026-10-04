import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import {
  EmailAPIError,
  sendLovableEmail,
} from "npm:@lovable.dev/email-js@0.1.0";
import {
  distinctIssues,
  healthPayloadSchema,
  nightlyPilotDays,
  newSeriousIssues,
  type HealthIssue,
  type HealthRun,
  type IssueState,
} from "../../../src/lib/admin/site-health/contract.ts";
import { healthJson, healthTokenMatches } from "../_shared/site-health-auth.ts";

const escapeHtml = (value: string) =>
  value.replace(
    /[&<>"']/g,
    (character) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        character
      ]!,
  );
Deno.serve(async (request) => {
  if (request.method !== "POST")
    return healthJson({ error: "method_not_allowed" }, 405);
  const token = Deno.env.get("SITE_HEALTH_INGEST_TOKEN");
  if (!token || token.length < 32)
    return healthJson({ error: "monitoring_not_configured" }, 503);
  if (!(await healthTokenMatches(request.headers.get("authorization"), token)))
    return healthJson({ error: "unauthorized" }, 401);
  const url = Deno.env.get("SUPABASE_URL"),
    key = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!url || !key)
    return healthJson({ error: "monitoring_not_configured" }, 503);
  // Stream with a hard byte limit before parsing; never log headers, tokens or bodies.
  const reader = request.body?.getReader();
  if (!reader) return healthJson({ error: "missing_report" }, 400);
  const chunks: Uint8Array[] = [];
  let bytes = 0;
  for (;;) {
    const { value, done } = await reader.read();
    if (done) break;
    bytes += value.byteLength;
    if (bytes > 5_000_000) {
      await reader.cancel();
      return healthJson({ error: "report_too_large" }, 413);
    }
    chunks.push(value);
  }
  const body = new Uint8Array(bytes);
  let offset = 0;
  for (const chunk of chunks) {
    body.set(chunk, offset);
    offset += chunk.byteLength;
  }
  let parsed;
  try {
    parsed = healthPayloadSchema.safeParse(
      JSON.parse(new TextDecoder().decode(body)),
    );
  } catch {
    return healthJson({ error: "invalid_json" }, 400);
  }
  if (!parsed.success)
    return healthJson({ error: "invalid_health_report" }, 400);
  const report = parsed.data;
  const client = createClient(url, key, { auth: { persistSession: false } });
  let ownsRun = false;
  try {
    const previousQuery = await client
      .from("site_health_runs")
      .select("*")
      .neq("id", report.id)
      .in("kind", ["baseline", "full_crawl"])
      .in("status", ["passed", "warnings", "failed"])
      .not("finished_at", "is", null)
      .lt("started_at", report.started_at)
      .order("started_at", { ascending: false })
      .limit(64);
    if (previousQuery.error) throw previousQuery.error;
    const previousRuns = (previousQuery.data || []) as HealthRun[];
    const pilotDays = nightlyPilotDays(previousRuns);
    const enabled = Deno.env.get("SITE_HEALTH_ALERTS_ENABLED") === "true";
    const all = distinctIssues(report.results);
    const errors = all.filter((issue) => issue.severity === "error").length;
    const warnings = all.filter((issue) => issue.severity === "warning").length;
    const status = report.blocked
      ? "blocked"
      : report.failure
        ? "aborted"
        : errors
          ? "failed"
          : warnings
            ? "warnings"
            : "passed";
    const kind =
      report.kind === "manual"
        ? "manual"
        : !enabled || pilotDays < 7
          ? "baseline"
          : "full_crawl";
    const insert = await client
      .from("site_health_runs")
      .insert({
        id: report.id,
        started_at: report.started_at,
        kind,
        target_origin: report.target_origin,
        commit_ref: report.commit_ref,
        status: "running",
      });
    if (insert.error?.code === "23505") {
      const existing = await client
        .from("site_health_runs")
        .select("status,commit_ref")
        .eq("id", report.id)
        .single();
      if (existing.error) throw existing.error;
      if (
        existing.data?.status === "running" ||
        existing.data?.commit_ref !== report.commit_ref
      )
        return healthJson(
          { error: "run_already_in_progress_or_conflicting" },
          409,
        );
      // Finished retries use the provider's same per-recipient idempotency key below.
    } else if (insert.error) throw insert.error;
    else {
      ownsRun = true;
      if (report.results.length) {
        const rows = report.results.map((row) => ({
          ...row,
          run_id: report.id,
        }));
        const result = await client.from("site_health_results").insert(rows);
        if (result.error) throw result.error;
      }
      const finished = await client
        .from("site_health_runs")
        .update({
          finished_at: report.finished_at,
          pages_checked: new Set(report.results.map((row) => row.path)).size,
          errors,
          warnings,
          status,
        })
        .eq("id", report.id);
      if (finished.error) throw finished.error;
      ownsRun = false;
    }
    if (
      !enabled ||
      pilotDays < 7 ||
      report.kind === "manual" ||
      ["blocked", "aborted"].includes(status)
    )
      return healthJson({
        status: "recorded",
        alerts: "pilot_or_disabled",
        pilot_nights: Math.min(
          7,
          pilotDays +
            (report.kind !== "manual" && !report.blocked && !report.failure
              ? 1
              : 0),
        ),
      });
    const last = previousRuns[0];
    const priorResults: Array<{ issues: HealthIssue[] }> = [];
    if (last)
      for (let start = 0; start < 5000; start += 1000) {
        const result = await client
          .from("site_health_results")
          .select("issues")
          .eq("run_id", last.id)
          .order("id")
          .range(start, start + 999);
        if (result.error) throw result.error;
        priorResults.push(...(result.data || []));
        if (!result.data || result.data.length < 1000) break;
      }
    const states: IssueState[] = [];
    for (let start = 0; start < 10000; start += 1000) {
      const result = await client
        .from("site_health_issue_states")
        .select("*")
        .order("fingerprint")
        .range(start, start + 999);
      if (result.error) throw result.error;
      states.push(...((result.data || []) as IssueState[]));
      if (!result.data || result.data.length < 1000) break;
    }
    const newErrors = newSeriousIssues(
      all,
      distinctIssues(priorResults),
      states,
    );
    const monday = new Date(report.started_at).getUTCDay() === 1;
    if (!newErrors.length && !monday)
      return healthJson({ status: "recorded", alerts: "no_new_errors" });
    const recipients = z
      .array(z.string().email())
      .min(1)
      .max(5)
      .safeParse(
        (Deno.env.get("SITE_HEALTH_ALERT_RECIPIENTS") || "")
          .split(",")
          .map((value) => value.trim())
          .filter(Boolean),
      );
    const apiKey = Deno.env.get("LOVABLE_API_KEY");
    if (!apiKey || !recipients.success)
      return healthJson({ status: "recorded", alerts: "email_not_configured" });
    const subject = newErrors.length
      ? `Ascent site health: ${newErrors.length} new errors`
      : "Ascent site health: Monday digest";
    const ignored = new Set(
      states
        .filter((state) => state.state === "ignored")
        .map((state) => state.fingerprint),
    );
    const listed = (
      newErrors.length
        ? newErrors
        : all.filter((issue) => !ignored.has(issue.fingerprint))
    ).slice(0, 30);
    const text = `${subject}\n${report.paths.length} URLs checked at desktop and phone widths. ${errors} errors, ${warnings} warnings.\n${listed.map((issue) => `${issue.code}: ${issue.message}${issue.target ? ` (${issue.target})` : ""}`).join("\n")}\nReview: https://www.ascentgroupconstruction.com/admin/monitoring`;
    let failed = 0,
      suppressed = 0;
    for (const recipient of [...new Set(recipients.data)]) {
      const digest = new Uint8Array(
        await crypto.subtle.digest(
          "SHA-256",
          new TextEncoder().encode(`site-health:${report.id}:${recipient}`),
        ),
      );
      const idempotencyKey = [...digest]
        .map((byte) => byte.toString(16).padStart(2, "0"))
        .join("");
      try {
        await sendLovableEmail(
          {
            to: recipient,
            from: "Ascent Group Construction <noreply@www.ascentgroupconstruction.com>",
            sender_domain: "notify.www.ascentgroupconstruction.com",
            subject,
            text,
            html: `<pre style="white-space:pre-wrap;font-family:Arial,sans-serif">${escapeHtml(text)}</pre>`,
            purpose: "transactional",
            label: "site-health",
            idempotency_key: idempotencyKey,
          },
          { apiKey, sendUrl: Deno.env.get("LOVABLE_SEND_URL") },
        );
      } catch (error) {
        if (
          error instanceof EmailAPIError &&
          error.code === "recipient_suppressed"
        )
          suppressed++;
        else {
          failed++;
          console.warn(
            "Site Health alert delivery failed; health results remain saved",
          );
        }
      }
    }
    return healthJson(
      {
        status: "recorded",
        alerts: failed
          ? "delivery_failed"
          : suppressed === new Set(recipients.data).size
            ? "suppressed"
            : "sent",
        suppressed,
      },
      failed ? 502 : 200,
    );
  } catch (error) {
    if (ownsRun)
      await client
        .from("site_health_runs")
        .update({ status: "aborted", finished_at: new Date().toISOString() })
        .eq("id", report.id);
    const code =
      error && typeof error === "object" && "code" in error
        ? String(error.code)
        : "unknown";
    console.warn("Site Health ingestion failed", code);
    return healthJson({ error: "health_ingestion_failed", code }, 503);
  }
});
