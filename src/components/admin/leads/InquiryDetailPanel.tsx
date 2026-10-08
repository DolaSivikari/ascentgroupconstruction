import {
  RequestDetailShell,
  RequestDetailCard,
  RequestDetailField,
} from "@/components/admin/requests/RequestDetailShell";
import {
  AdminSectionWorkspace,
  AdminSectionScreen,
} from "@/components/admin/AdminSectionWorkspace";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

import { Button } from "@/ui/Button";
import { Input } from "@/ui/Input";
import { Textarea } from "@/components/ui/textarea";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { useToast } from "@/hooks/use-toast";
import type { Inquiry } from "@/lib/inquiry/types";
import {
  INQUIRY_STATUSES,
  PRIORITIES,
  toTorontoInput,
  torontoDateTime,
  safeDrawingsUrl,
} from "@/lib/inquiry/schema";
import {
  loadInquiryDetail,
  saveInquiry,
  archiveInquiry,
  inquiryThread,
  addInquiryNote,
  loadAssignees,
  resendInquiryAlert,
  maskedEmail,
} from "@/lib/inquiry/api";
import { LEAD_TYPE_LABELS, formatLeadReceived } from "@/lib/leads/model";
import { signRfpAttachment } from "@/lib/inbox/api";
export function InquiryDetailPanel({
  inquiry,
  onClose,
  onUpdate,
}: {
  inquiry: Inquiry;
  onClose: () => void;
  onUpdate: () => void;
}) {
  const [baseline, setBaseline] = useState(inquiry);
  const [form, setForm] = useState({
    status: inquiry.status,
    priority: inquiry.priority,
    assigned_to: inquiry.assigned_to || "",
    due: toTorontoInput(inquiry.bid_due_at),
    amount: inquiry.bid_amount === null ? "" : String(inquiry.bid_amount),
  });
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);
  const [reveal, setReveal] = useState(false);
  const [confirm, setConfirm] = useState<
    "archive" | "restore" | "all" | "reload" | "close" | null
  >(null);
  const { toast } = useToast();
  const thread = useQuery({
    queryKey: ["inquiry-thread", inquiry.id],
    queryFn: () => inquiryThread(inquiry.id),
    refetchInterval: 15000,
  });
  const assignees = useQuery({
    queryKey: ["inquiry-assignees"],
    queryFn: loadAssignees,
  });
  const names = new Map(
    (assignees.data || []).map((p) => [p.id, p.full_name || p.email || p.id]),
  );
  const actor = (id: string | null) =>
    id ? names.get(id) || "Former or unavailable staff member" : "System";
  const typeLabel =
    LEAD_TYPE_LABELS[
      (
        { bid_invitation: "bid", prequal_request: "prequal" } as Record<
          string,
          string
        >
      )[baseline.inquiry_type] || baseline.inquiry_type
    ] || baseline.inquiry_type.replace(/_/g, " ");
  const workflowDirty =
    form.status !== baseline.status ||
    form.priority !== baseline.priority ||
    form.assigned_to !== (baseline.assigned_to || "") ||
    form.due !== toTorontoInput(baseline.bid_due_at) ||
    form.amount !==
      (baseline.bid_amount === null ? "" : String(baseline.bid_amount));
  const dirty = workflowDirty || !!note.trim();
  const submittedDetails =
    baseline.details && typeof baseline.details === "object"
      ? Object.entries(baseline.details).filter(
          ([key]) => key !== "submission_hash",
        )
      : [];
  const close = () => {
    if (busy) return;
    if (dirty) setConfirm("close");
    else onClose();
  };
  const lease =
    baseline.alert_lease_until &&
    Date.parse(baseline.alert_lease_until) > Date.now();
  const act = async (fn: () => Promise<void>, success: string) => {
    setBusy(true);
    try {
      await fn();
      onUpdate();
      void thread.refetch();
      toast({ title: success });
    } catch (error) {
      toast({
        title: "Action could not be completed",
        description:
          error instanceof Error
            ? error.message
            : "Your edits are preserved. Please retry.",
        variant: "destructive",
      });
    } finally {
      setBusy(false);
    }
  };
  const save = () =>
    act(async () => {
      setBaseline(
        await saveInquiry(baseline, {
          status: form.status,
          priority: form.priority,
          assigned_to: form.assigned_to || null,
          bid_due_at: torontoDateTime(form.due),
          bid_amount: form.amount.trim() ? Number(form.amount) : null,
        }),
      );
    }, "Lead updated");
  const resend = (all: boolean) =>
    act(async () => {
      await resendInquiryAlert(inquiry.id, all);
      setBaseline(await loadInquiryDetail(inquiry.id));
    }, "Alert attempt recorded. Review the recipient results below.");
  return (
    <>
      {" "}
      <RequestDetailShell
        onClose={close}
        name={baseline.contact_name}
        type={typeLabel}
        status={baseline.status}
        reference={baseline.reference_code}
        receivedAt={baseline.created_at}
        email={baseline.email}
        phone={baseline.phone}
        company={baseline.company}
        dirty={dirty}
        footer={
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-xs text-muted-foreground">
              {baseline.archived_at
                ? "Archived request"
                : "Changes apply to this lead only"}
            </p>
            <div className="flex gap-2">
              <Button variant="outline" onClick={close} disabled={busy}>
                Close
              </Button>
              <Button disabled={busy || !workflowDirty} onClick={save}>
                Save changes
              </Button>
            </div>
          </div>
        }
      >
        <div className="space-y-5">
          {thread.error && (
            <p
              role="alert"
              className="mt-4 rounded-lg border border-destructive/40 bg-card p-3 text-sm"
            >
              Notes, history and alert results could not be loaded.{" "}
              <Button
                size="sm"
                variant="outline"
                onClick={() => void thread.refetch()}
              >
                Retry details
              </Button>
            </p>
          )}
          <AdminSectionWorkspace
            queryKey="lead-section"
            label="Lead sections"
            items={[
              { id: "request", title: "Submitted request" },
              { id: "workflow", title: "Workflow" },
              { id: "notes", title: "Notes" },
              { id: "delivery", title: "Alert delivery" },
              { id: "history", title: "History" },
            ]}
          >
            <AdminSectionScreen id="request">
              <RequestDetailCard title="Project overview">
                <dl className="grid gap-4 sm:grid-cols-2">
                  <RequestDetailField label="Request type" value={typeLabel} />
                  <RequestDetailField
                    label="Project"
                    value={baseline.project_name}
                  />
                  <RequestDetailField
                    label="Location"
                    value={baseline.project_location}
                  />
                  <RequestDetailField
                    label="Company"
                    value={baseline.company}
                  />
                  <RequestDetailField
                    label="Email"
                    value={baseline.email}
                    link={`mailto:${baseline.email}`}
                  />
                  {baseline.phone && (
                    <RequestDetailField
                      label="Phone"
                      value={baseline.phone}
                      link={`tel:${baseline.phone}`}
                    />
                  )}
                </dl>
              </RequestDetailCard>
              <RequestDetailCard title="Client message">
                <p className="whitespace-pre-wrap text-sm leading-relaxed">
                  {baseline.message || "No message provided."}
                </p>
              </RequestDetailCard>
              <RequestDetailCard title="Additional details & files">
                {!submittedDetails.length &&
                  !baseline.drawings_url &&
                  !baseline.attachment_paths?.length && (
                    <p className="text-sm text-muted-foreground">
                      No additional details or files were submitted.
                    </p>
                  )}
                {!!submittedDetails.length && (
                  <details>
                    <summary className="text-sm underline">
                      Additional submitted details
                    </summary>
                    <dl className="mt-2 space-y-2 text-xs">
                      {submittedDetails.map(([key, value]) => (
                        <div key={key}>
                          <dt className="font-semibold">
                            {key.replace(/_/g, " ")}
                          </dt>
                          <dd className="whitespace-pre-wrap break-words">
                            {typeof value === "string"
                              ? value
                              : JSON.stringify(value)}
                          </dd>
                        </div>
                      ))}
                    </dl>
                  </details>
                )}

                {baseline.drawings_url &&
                  safeDrawingsUrl(baseline.drawings_url) && (
                    <a
                      href={baseline.drawings_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block underline"
                    >
                      Open drawings link
                    </a>
                  )}
                {baseline.attachment_paths?.map((path, i) => (
                  <Button
                    variant="outline"
                    key={path}
                    onClick={() =>
                      void act(async () => {
                        const url = await signRfpAttachment(path);
                        window.open(url, "_blank", "noopener,noreferrer");
                      }, "Attachment link opened")
                    }
                  >
                    Open attachment {i + 1}
                  </Button>
                ))}
              </RequestDetailCard>
            </AdminSectionScreen>
            <AdminSectionScreen id="workflow">
              <section className="request-detail-card space-y-4 rounded-xl border bg-card p-5">
                <h2 className="font-bold">Workflow</h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="space-y-1 text-sm">
                    Status
                    <select
                      className="block w-full rounded border bg-background p-2"
                      value={form.status}
                      disabled={busy}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, status: e.target.value }))
                      }
                    >
                      {INQUIRY_STATUSES.map((s) => (
                        <option key={s} value={s}>
                          {s.replace(/_/g, " ")}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="space-y-1 text-sm">
                    Priority
                    <select
                      className="block w-full rounded border bg-background p-2"
                      value={form.priority}
                      disabled={busy}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, priority: e.target.value }))
                      }
                    >
                      {PRIORITIES.map((p) => (
                        <option key={p}>{p}</option>
                      ))}
                    </select>
                  </label>
                  <label className="space-y-1 text-sm">
                    Assigned to
                    <select
                      className="block w-full rounded border bg-background p-2"
                      value={form.assigned_to}
                      disabled={busy || !!assignees.error}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, assigned_to: e.target.value }))
                      }
                    >
                      <option value="">Unassigned</option>
                      {form.assigned_to && !names.has(form.assigned_to) && (
                        <option value={form.assigned_to}>
                          Current assignee (unavailable)
                        </option>
                      )}
                      {assignees.data?.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.full_name || p.email}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="space-y-1 text-sm">
                    Bid amount (CAD)
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      value={form.amount}
                      disabled={busy}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, amount: e.target.value }))
                      }
                    />
                  </label>
                  <label className="space-y-1 text-sm sm:col-span-2">
                    Bid due (Toronto time)
                    <Input
                      type="datetime-local"
                      value={form.due}
                      disabled={busy}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, due: e.target.value }))
                      }
                    />
                    <span className="text-xs text-muted-foreground">
                      Daylight saving is handled automatically; repeated
                      fall-back hours use the earlier occurrence.
                    </span>
                  </label>
                </div>
                {assignees.error && (
                  <p role="alert">
                    Staff list is unavailable. Existing assignment is retained.
                  </p>
                )}
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant="outline"
                    disabled={busy}
                    onClick={() => setConfirm("reload")}
                  >
                    Reload saved lead
                  </Button>
                  <Button
                    variant="outline"
                    disabled={busy}
                    onClick={() =>
                      setConfirm(baseline.archived_at ? "restore" : "archive")
                    }
                  >
                    {baseline.archived_at ? "Restore lead" : "Archive lead"}
                  </Button>
                </div>
              </section>
            </AdminSectionScreen>
            <AdminSectionScreen id="notes">
              <section className="request-detail-card space-y-4 rounded-xl border bg-card p-5">
                <h2 className="font-bold">Notes</h2>
                {thread.error ? (
                  <p role="alert">
                    Notes could not be loaded.{" "}
                    <Button onClick={() => void thread.refetch()}>Retry</Button>
                  </p>
                ) : thread.isPending ? (
                  <p>Loading notes…</p>
                ) : thread.data?.notes.length ? (
                  thread.data.notes.map((n) => (
                    <article key={n.id} className="rounded border p-3">
                      <p className="text-xs text-muted-foreground">
                        {actor(n.author_id)} ·{" "}
                        {formatLeadReceived(n.created_at)}
                      </p>
                      <p className="mt-2 whitespace-pre-wrap text-sm">
                        {n.body}
                      </p>
                    </article>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">No notes yet.</p>
                )}
                <Textarea
                  aria-label="New lead note"
                  value={note}
                  maxLength={5000}
                  onChange={(e) => setNote(e.target.value)}
                />
                <Button
                  disabled={busy || !note.trim()}
                  onClick={() =>
                    void act(async () => {
                      await addInquiryNote(inquiry.id, note);
                      setNote("");
                    }, "Note added")
                  }
                >
                  Add note
                </Button>
              </section>
            </AdminSectionScreen>
            <AdminSectionScreen id="delivery">
              <section className="request-detail-card space-y-4 rounded-xl border bg-card p-5">
                <div className="flex justify-between gap-3">
                  <h2 className="font-bold">Alert delivery</h2>
                  <Button variant="outline" onClick={() => setReveal(!reveal)}>
                    {reveal ? "Mask recipients" : "Reveal recipients"}
                  </Button>
                </div>
                <p className="text-sm">
                  {baseline.alert_status} · {baseline.alert_attempts} attempts.
                  “Sent” means the provider accepted the email; it does not
                  prove inbox delivery.
                </p>
                {baseline.alert_last_error && (
                  <p role="alert" className="text-sm">
                    {baseline.alert_last_error}
                  </p>
                )}
                {thread.error ? (
                  <p className="text-sm text-muted-foreground">
                    Recipient results are unavailable.
                  </p>
                ) : thread.isPending ? (
                  <p className="text-sm">Loading recipient results…</p>
                ) : (
                  !thread.data?.deliveries.length && (
                    <p className="text-sm text-muted-foreground">
                      No recipient delivery results recorded yet.
                    </p>
                  )
                )}
                {thread.data?.deliveries.map((d) => (
                  <p
                    key={d.id}
                    className="rounded-lg border bg-background p-3 text-sm"
                  >
                    Attempt {d.attempt} ·{" "}
                    {reveal ? d.recipient : maskedEmail(d.recipient)} ·{" "}
                    {d.status}
                    {d.error ? ` · ${d.error}` : ""}
                  </p>
                ))}
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant="outline"
                    disabled={
                      busy ||
                      !!lease ||
                      ["sent", "suppressed"].includes(baseline.alert_status)
                    }
                    onClick={() => void resend(false)}
                  >
                    {lease ? "Sending…" : "Resend to failed recipients"}
                  </Button>
                  <Button
                    variant="outline"
                    disabled={busy || !!lease}
                    onClick={() => setConfirm("all")}
                  >
                    Resend to all
                  </Button>
                  <Button
                    variant="outline"
                    disabled={busy}
                    onClick={() =>
                      void act(
                        async () =>
                          setBaseline(await loadInquiryDetail(inquiry.id)),
                        "Delivery status refreshed",
                      )
                    }
                  >
                    Refresh status
                  </Button>
                </div>
              </section>
            </AdminSectionScreen>
            <AdminSectionScreen id="history">
              <section className="request-detail-card space-y-4 rounded-xl border bg-card p-5">
                <h2 className="font-bold">History</h2>
                {thread.error ? (
                  <p className="text-sm text-muted-foreground">
                    History is unavailable. Retry details to load it.
                  </p>
                ) : thread.isPending ? (
                  <p className="text-sm">Loading history…</p>
                ) : !thread.data?.events.length ? (
                  <p className="text-sm text-muted-foreground">
                    No history recorded yet.
                  </p>
                ) : (
                  <ol className="space-y-4">
                    {thread.data.events.map((event) => (
                      <li
                        key={event.id}
                        className="relative border-l-2 border-primary/20 pl-4"
                      >
                        <span
                          className="absolute -left-[5px] top-1 h-2 w-2 rounded-full bg-primary"
                          aria-hidden="true"
                        />
                        <p className="text-sm font-medium capitalize">
                          {event.event_type.replace(/_/g, " ")}
                        </p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {formatLeadReceived(event.created_at)} ·{" "}
                          {actor(event.actor_id)}
                        </p>
                        {(event.from_value || event.to_value) && (
                          <p className="mt-2 break-words text-sm">
                            {event.from_value || "—"} → {event.to_value || "—"}
                          </p>
                        )}
                      </li>
                    ))}
                  </ol>
                )}
              </section>
            </AdminSectionScreen>
          </AdminSectionWorkspace>
        </div>
      </RequestDetailShell>
      <ConfirmDialog
        open={!!confirm}
        onOpenChange={(open) => {
          if (!open) setConfirm(null);
        }}
        title={
          confirm === "close"
            ? "Discard unsaved lead edits?"
            : confirm === "all"
              ? "Send alerts to every active recipient?"
              : confirm === "reload"
                ? "Reload and discard local workflow edits?"
                : `${confirm === "restore" ? "Restore" : "Archive"} this lead?`
        }
        description={
          confirm === "close"
            ? "Your workflow edits and unsent note will be discarded. The saved lead remains unchanged."
            : confirm === "all"
              ? "Recipients who already received an alert will get another one."
              : confirm === "reload"
                ? "Saved data replaces your current workflow fields. Your unsent note stays here."
                : "The lead and its history are retained."
        }
        onConfirm={() => {
          const action = confirm;
          if (action === "close") {
            onClose();
            return;
          }
          void act(async () => {
            if (action === "all") {
              await resendInquiryAlert(inquiry.id, true);
              setBaseline(await loadInquiryDetail(inquiry.id));
            } else if (action === "reload") {
              const fresh = await loadInquiryDetail(inquiry.id);
              setBaseline(fresh);
              setForm({
                status: fresh.status,
                priority: fresh.priority,
                assigned_to: fresh.assigned_to || "",
                due: toTorontoInput(fresh.bid_due_at),
                amount:
                  fresh.bid_amount === null ? "" : String(fresh.bid_amount),
              });
            } else
              setBaseline(await archiveInquiry(baseline, action === "archive"));
          }, "Lead action completed");
        }}
      />
    </>
  );
}
