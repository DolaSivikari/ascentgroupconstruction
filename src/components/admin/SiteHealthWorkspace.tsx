import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "@/ui/Button";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { adminErrorMessage } from "@/lib/admin/editorValues";
import {
  distinctIssues,
  HEALTH_ORIGIN,
  HEALTH_WORKFLOW_URL,
  healthTime,
  nightlyPilotDays,
  type HealthIssue,
} from "@/lib/admin/site-health/contract";
import {
  loadHealthOverview,
  loadHealthResults,
  loadIssueStates,
  loadVisitorErrors,
  resetIssueState,
  saveIssueState,
} from "@/lib/admin/site-health/data";

export function SiteHealthTile() {
  const query = useQuery({
    queryKey: ["site-health", "overview"],
    queryFn: loadHealthOverview,
    staleTime: 60000,
    retry: false,
  });
  const run = query.data?.runs[0];
  const value = query.isPending
    ? "Loading…"
    : query.error
      ? "Unavailable"
      : !query.data?.available
        ? "Setup required"
        : !run
          ? "No checks recorded"
          : ["running", "blocked", "aborted"].includes(run.status)
            ? run.status
            : `${run.errors} errors · ${run.warnings} warnings`;
  return (
    <a
      href="/admin/monitoring"
      className="business-glass-card block min-w-0 space-y-2 p-5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
    >
      <h3 className="text-sm font-semibold text-muted-foreground">
        Site health
      </h3>
      <p className="break-words text-xl font-bold">{value}</p>
      <p className="text-xs text-muted-foreground">
        {run
          ? `${run.pages_checked} URLs · ${healthTime(run.finished_at)} Toronto`
          : "Nightly visitor checks and recorded browser errors"}
      </p>
    </a>
  );
}

function VisitorErrors() {
  const query = useQuery({
    queryKey: ["site-health", "visitor-errors"],
    queryFn: loadVisitorErrors,
    staleTime: 60000,
    retry: false,
  });
  return (
    <section
      aria-label="Visitor browser errors"
      className="business-glass-card space-y-3 p-5"
    >
      <h2 className="text-lg font-semibold">Visitor browser errors</h2>
      <p className="text-sm text-muted-foreground">
        Recorded errors grouped by page and message from the last 24 hours.
        Counts represent log entries.
      </p>
      {query.isPending ? (
        <p>Loading recorded errors…</p>
      ) : query.error ? (
        <div role="alert">
          {adminErrorMessage(query.error)}{" "}
          <Button
            size="sm"
            variant="outline"
            onClick={() => void query.refetch()}
          >
            Retry errors
          </Button>
        </div>
      ) : (
        <>
          {query.data?.limited && (
            <p className="text-sm">
              Showing the latest 500 log entries; older entries may not be
              included.
            </p>
          )}
          {!query.data?.groups.length && (
            <p className="text-sm">
              No browser errors recorded in the last 24 hours.
            </p>
          )}
          {query.data?.groups.map((group) => (
            <article
              key={`${group.path}:${group.message}`}
              className="min-w-0 rounded border p-3 text-sm"
            >
              <p className="break-all font-semibold">
                {group.path} · {group.count}{" "}
                {group.count === 1 ? "entry" : "entries"}
              </p>
              <p className="break-words [overflow-wrap:anywhere]">
                {group.message}
              </p>
              <p className="text-xs text-muted-foreground">
                Latest: {healthTime(group.latest)}
              </p>
            </article>
          ))}
        </>
      )}
    </section>
  );
}

export function SiteHealthWorkspace() {
  const cache = useQueryClient();
  const [selectedId, setSelectedId] = useState("");
  const [includeIgnored, setIncludeIgnored] = useState(false);
  const [decision, setDecision] = useState<{
    issue: HealthIssue;
    state: "fixed" | "ignored";
  } | null>(null);
  const [reason, setReason] = useState("");
  const [saving, setSaving] = useState(false);
  const [decisionError, setDecisionError] = useState("");
  const [reset, setReset] = useState<string | null>(null);
  const [ping, setPing] = useState<string | null>(null);
  const [pingBusy, setPingBusy] = useState(false);
  const overview = useQuery({
    queryKey: ["site-health", "overview"],
    queryFn: loadHealthOverview,
    staleTime: 60000,
    retry: false,
  });
  const runs = overview.data?.runs || [];
  const run = runs.find((item) => item.id === selectedId) || runs[0];
  const previous = runs.find(
    (item) =>
      run &&
      item.started_at < run.started_at &&
      item.finished_at &&
      ["passed", "warnings", "failed"].includes(item.status) &&
      item.kind !== "manual",
  );
  const results = useQuery({
    queryKey: ["site-health", "results", run?.id],
    queryFn: () => loadHealthResults(run!.id),
    enabled: !!run,
    retry: false,
  });
  const priorResults = useQuery({
    queryKey: ["site-health", "results", previous?.id],
    queryFn: () => loadHealthResults(previous!.id),
    enabled: !!previous,
    retry: false,
  });
  const states = useQuery({
    queryKey: ["site-health", "states"],
    queryFn: loadIssueStates,
    enabled: overview.data?.available === true,
    retry: false,
  });
  const issues = distinctIssues(results.data || []);
  const prior = new Set(
    distinctIssues(priorResults.data || []).map((issue) => issue.fingerprint),
  );
  const decisions = new Map(
    (states.data || []).map((item) => [item.fingerprint, item]),
  );
  const visible = issues.filter(
    (issue) =>
      includeIgnored || decisions.get(issue.fingerprint)?.state !== "ignored",
  );
  const codes = [...new Set(visible.map((issue) => issue.code))];
  const refresh = () =>
    void cache.invalidateQueries({ queryKey: ["site-health"] });
  const save = async () => {
    if (!decision) return;
    setSaving(true);
    setDecisionError("");
    try {
      await saveIssueState(decision.issue.fingerprint, decision.state, reason);
      setDecision(null);
      await cache.invalidateQueries({ queryKey: ["site-health", "states"] });
      toast.success("Issue decision saved");
    } catch (error) {
      setDecisionError(adminErrorMessage(error));
    } finally {
      setSaving(false);
    }
  };
  const checkDatabase = async () => {
    setPingBusy(true);
    try {
      const { data, error } = await supabase.functions.invoke("health-ping");
      if (error)
        throw new Error(
          "The database check is unavailable. Deploy health-ping before using this check.",
        );
      if (!data || data.status !== "ok" || !Number.isInteger(data.latency_ms))
        throw new Error("The database did not confirm readiness.");
      setPing(
        `Database answered in ${data.latency_ms} ms. Checked ${healthTime(data.checked_at)} Toronto.`,
      );
    } catch (error) {
      setPing(
        error instanceof Error
          ? error.message
          : "The database check is unavailable.",
      );
    } finally {
      setPingBusy(false);
    }
  };
  return (
    <div className="min-w-0 space-y-5">
      <section
        aria-label="Nightly site health"
        className="business-glass-card min-w-0 space-y-4 p-5"
      >
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-lg font-semibold">Nightly visitor checks</h2>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" onClick={refresh}>
              Refresh health
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={checkDatabase}
              disabled={pingBusy}
            >
              {pingBusy ? "Checking…" : "Check database"}
            </Button>
            <a
              className="rounded border px-3 py-2 text-sm font-semibold underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
              href={HEALTH_WORKFLOW_URL}
              target="_blank"
              rel="noopener noreferrer"
            >
              Run check in GitHub
            </a>
          </div>
        </div>
        <p className="text-sm text-muted-foreground">
          Public pages checked at desktop and phone widths, daily at 07:00 UTC
          (3am Toronto in summer, 2am in winter). Forms are never submitted.
        </p>
        {ping && (
          <p role="status" className="text-sm">
            {ping}
          </p>
        )}
        {overview.isPending ? (
          <p>Loading check history…</p>
        ) : overview.error ? (
          <p role="alert">
            Site Health is unavailable: {adminErrorMessage(overview.error)}
          </p>
        ) : !overview.data?.available ? (
          <div className="rounded border p-4">
            <h3 className="font-semibold">Site Health needs setup</h3>
            <p className="mt-2 text-sm">
              The monitoring tables are not available yet. Follow the Phase 2
              setup checklist to connect nightly results. Existing error and
              performance monitoring remains available below.
            </p>
          </div>
        ) : !run ? (
          <p>
            No nightly checks recorded yet. Run the workflow in GitHub after
            completing setup.
          </p>
        ) : (
          <>
            <label className="block text-sm font-semibold" htmlFor="health-run">
              Check history (latest 32 runs)
            </label>
            <select
              id="health-run"
              value={run.id}
              onChange={(event) => setSelectedId(event.target.value)}
              className="max-w-full rounded border bg-background p-2 text-sm"
            >
              {runs.map((item) => (
                <option value={item.id} key={item.id}>
                  {healthTime(item.started_at)} · {item.kind} · {item.status}
                </option>
              ))}
            </select>
            <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
              {[
                ["URLs checked", run.pages_checked],
                ["Errors", run.errors],
                ["Warnings", run.warnings],
                ["Run status", run.status],
              ].map(([label, value]) => (
                <div key={label} className="rounded border p-3">
                  <p className="text-xs text-muted-foreground">{label}</p>
                  <p className="break-words text-xl font-semibold">{value}</p>
                </div>
              ))}
            </div>
            <p className="text-xs text-muted-foreground">
              Finished: {healthTime(run.finished_at)} Toronto. Pilot:{" "}
              {Math.min(7, nightlyPilotDays(runs))}/7 distinct nightly baselines
              recorded. Alerts require explicit server activation after the
              pilot.
            </p>
            {["blocked", "aborted", "running"].includes(run.status) && (
              <p
                role="alert"
                className="rounded border border-destructive/50 p-3 text-sm"
              >
                This run is {run.status}; its coverage is incomplete and does
                not establish that the website is healthy.
              </p>
            )}
            {results.error && (
              <p role="alert">
                Could not load page results: {adminErrorMessage(results.error)}
              </p>
            )}
            {states.error && (
              <p role="alert">
                Issue decisions are unavailable:{" "}
                {adminErrorMessage(states.error)}. Issues remain visible.
              </p>
            )}
            {priorResults.error && (
              <p role="alert">
                The previous nightly results are unavailable. New-issue labels
                cannot be determined.
              </p>
            )}
            {results.isPending ? (
              <p>Loading page results…</p>
            ) : (
              <>
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={includeIgnored}
                    onChange={(event) =>
                      setIncludeIgnored(event.target.checked)
                    }
                  />
                  Show ignored issues
                </label>
                {!visible.length && (
                  <p className="text-sm">
                    {issues.length
                      ? "All detected issues are ignored. Enable Show ignored issues to review them."
                      : "No issues detected in the recorded page results."}
                  </p>
                )}
                {codes.map((code) => (
                  <section key={code} aria-label={code} className="space-y-2">
                    <h3 className="font-semibold capitalize">
                      {code.replace(/_/g, " ")} ·{" "}
                      {visible.filter((issue) => issue.code === code).length}
                    </h3>
                    {visible
                      .filter((issue) => issue.code === code)
                      .map((issue) => {
                        const rows = (results.data || []).filter((row) =>
                          row.issues.some(
                            (item) => item.fingerprint === issue.fingerprint,
                          ),
                        );
                        const state = decisions.get(issue.fingerprint);
                        const isNew =
                          !!previous &&
                          priorResults.isSuccess &&
                          !prior.has(issue.fingerprint);
                        return (
                          <article
                            className="min-w-0 space-y-2 rounded border p-3 text-sm"
                            key={issue.fingerprint}
                          >
                            <div className="flex flex-wrap gap-2">
                              <strong className="capitalize">
                                {issue.severity}
                              </strong>
                              {isNew && (
                                <span className="font-semibold text-primary">
                                  New since previous night
                                </span>
                              )}
                              {state && (
                                <span>
                                  {state.state === "fixed"
                                    ? "Still detected · marked fixed"
                                    : "Ignored"}
                                </span>
                              )}
                            </div>
                            <p className="break-words [overflow-wrap:anywhere]">
                              {issue.message}
                            </p>
                            {rows.map((row) => (
                              <p key={row.id}>
                                <a
                                  className="break-all underline"
                                  href={HEALTH_ORIGIN + row.path}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  {row.path}
                                </a>{" "}
                                · {row.viewport}
                              </p>
                            ))}
                            {issue.target && (
                              <p className="break-all text-xs text-muted-foreground">
                                Target: {issue.target}
                              </p>
                            )}
                            {state?.reason && (
                              <p className="break-words text-xs">
                                Reason: {state.reason}
                              </p>
                            )}
                            <div className="flex flex-wrap gap-2">
                              {(["fixed", "ignored"] as const).map((option) => (
                                <Button
                                  key={option}
                                  size="sm"
                                  variant="outline"
                                  disabled={!!states.error || saving}
                                  onClick={() => {
                                    setDecision({ issue, state: option });
                                    setReason(state?.reason || "");
                                    setDecisionError("");
                                  }}
                                >
                                  Mark {option}
                                </Button>
                              ))}
                              {state && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => setReset(issue.fingerprint)}
                                >
                                  Clear decision
                                </Button>
                              )}
                            </div>
                          </article>
                        );
                      })}
                  </section>
                ))}
                <details className="rounded border p-3">
                  <summary className="cursor-pointer text-sm font-semibold">
                    All page results · {results.data?.length || 0} desktop/phone
                    checks
                  </summary>
                  <div className="mt-3 space-y-2">
                    {results.data?.map((row) => (
                      <div
                        key={row.id}
                        className="min-w-0 rounded border p-2 text-sm"
                      >
                        <a
                          className="break-all underline"
                          href={HEALTH_ORIGIN + row.path}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {row.path}
                        </a>
                        <p>
                          {row.viewport} · HTTP{" "}
                          {row.http_status ?? "unavailable"} ·{" "}
                          {row.load_ms == null
                            ? "Timing unavailable"
                            : `${row.load_ms} ms`}{" "}
                          · {row.issues.length} findings
                        </p>
                      </div>
                    ))}
                  </div>
                </details>
              </>
            )}
          </>
        )}
      </section>
      <VisitorErrors />
      <Dialog
        open={!!decision}
        onOpenChange={(open) => {
          if (!open && !saving) setDecision(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Mark issue {decision?.state}</DialogTitle>
            <DialogDescription>
              Fixed records your action; a finding stays visible if the next
              crawler run still detects it. Ignored findings are suppressed
              until you clear the decision.
            </DialogDescription>
          </DialogHeader>
          <label htmlFor="health-reason" className="text-sm font-semibold">
            Reason
          </label>
          <textarea
            id="health-reason"
            maxLength={500}
            value={reason}
            onChange={(event) => setReason(event.target.value)}
            className="min-h-24 w-full rounded border bg-background p-2"
            disabled={saving}
          />
          {decisionError && (
            <p role="alert" className="text-sm text-destructive">
              {decisionError}
            </p>
          )}
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              disabled={saving}
              onClick={() => setDecision(null)}
            >
              Cancel
            </Button>
            <Button
              disabled={saving || !reason.trim()}
              onClick={() => void save()}
            >
              {saving ? "Saving…" : "Save decision"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      <ConfirmDialog
        open={!!reset}
        onOpenChange={(open) => {
          if (!open) setReset(null);
        }}
        title="Clear this issue decision?"
        description="The issue will be included in future reviews and eligible new-error alerts."
        onConfirm={() => {
          if (reset)
            void resetIssueState(reset)
              .then(() => {
                refresh();
                toast.success("Decision cleared");
              })
              .catch((error) => toast.error(adminErrorMessage(error)));
        }}
      />
    </div>
  );
}
