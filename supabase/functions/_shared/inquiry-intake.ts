import type { SupabaseClient } from "npm:@supabase/supabase-js@2";
import { inquirySchema } from "./inquiry-schema.ts";
import {
  checkRateLimit,
  getClientIdentifier,
  createRateLimitResponse,
} from "./rateLimiter.ts";
import { corsHeaders, jsonResponse } from "./http.ts";
import {
  sendInquiryAlerts,
  sendInquiryConfirmation,
} from "./inquiry-alerts.ts";
type IntakePayload = { data?: unknown; honeypot?: string; startedAt?: number };
export async function handleInquiryIntake(
  req: Request,
  payload: IntakePayload,
  db: SupabaseClient,
) {
  if (Deno.env.get("INTAKE_V2_ENABLED") !== "true")
    return jsonResponse({ success: false, error: "intake_not_enabled" }, 503);
  const rate = await checkRateLimit(
    db,
    getClientIdentifier(req),
    "submit-form:inquiry",
    5,
    15,
  );
  if (!rate.allowed)
    return createRateLimitResponse(
      rate.retry_after_seconds || 900,
      corsHeaders,
    );
  if (
    (typeof payload.honeypot === "string" && payload.honeypot.trim()) ||
    (typeof payload.startedAt === "number" &&
      (Date.now() - payload.startedAt < 2000 || payload.startedAt > Date.now()))
  )
    return jsonResponse({ success: false, status: "blocked" }, 202);
  const parsed = inquirySchema.safeParse(payload.data);
  if (parsed.success === false)
    return jsonResponse(
      {
        success: false,
        error: "invalid_request",
        fields: parsed.error.issues.map((i) => i.path.join(".")),
      },
      400,
    );
  const submission = parsed.data;
  if ((submission.message.match(/https?:\/\/|www\./gi)?.length || 0) >= 3)
    return jsonResponse({ success: false, status: "blocked" }, 202);
  if (
    submission.bid_due_at &&
    Date.parse(submission.bid_due_at) < Date.now() - 60000
  )
    return jsonResponse({ success: false, error: "bid_due_in_past" }, 400);
  const fingerprintBytes = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(JSON.stringify(submission)),
  );
  const fingerprint = [...new Uint8Array(fingerprintBytes)]
    .map((v) => v.toString(16).padStart(2, "0"))
    .join("");
  const { consent_text_version, ...fields } = submission;
  const inserted = await db
    .from("inquiries")
    .insert({
      ...fields,
      consent_text_version,
      consent_at: new Date().toISOString(),
      details: { ...submission.details, submission_hash: fingerprint },
    })
    .select("*")
    .single();
  if (inserted.error?.code === "23505") {
    const existing = await db
      .from("inquiries")
      .select("id,reference_code,email,details")
      .eq("submission_key", submission.submission_key)
      .maybeSingle();
    // A submission key is an unguessable capability; also require the original email.
    if (
      existing.error ||
      !existing.data ||
      existing.data.email.toLowerCase() !== submission.email.toLowerCase() ||
      existing.data.details?.submission_hash !== fingerprint
    )
      return jsonResponse(
        { success: false, error: "submission_conflict" },
        409,
      );
    return jsonResponse({
      success: true,
      id: existing.data.id,
      reference_code: existing.data.reference_code,
      duplicate: true,
    });
  }
  if (inserted.error || !inserted.data) {
    console.error("Inquiry save failed", { code: inserted.error?.code });
    return jsonResponse({ success: false, error: "save_failed" }, 500);
  }
  const lead = inserted.data;
  const sending = (async () => {
    try {
      await sendInquiryAlerts(db, lead.id);
    } catch {
      /* Saved lead remains pending/retryable. */
    }
    try {
      await sendInquiryConfirmation(db, lead);
    } catch {
      console.warn("Inquiry confirmation incomplete");
    }
  })();
  // Continue completion after returning a bounded response when the runtime supports it.
  const runtime = (
    globalThis as unknown as {
      EdgeRuntime?: { waitUntil: (promise: Promise<unknown>) => void };
    }
  ).EdgeRuntime;
  runtime?.waitUntil(sending);
  let timer: ReturnType<typeof setTimeout> | undefined;
  await Promise.race([
    sending,
    new Promise((resolve) => {
      timer = setTimeout(resolve, 8000);
    }),
  ]);
  clearTimeout(timer);
  return jsonResponse({
    success: true,
    id: lead.id,
    reference_code: lead.reference_code,
    duplicate: false,
  });
}
