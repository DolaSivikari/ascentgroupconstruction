import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
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
import { formatLeadReceived } from "@/lib/leads/model";
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
  const dirty =
    !!note.trim() ||
    form.status !== baseline.status ||
    form.priority !== baseline.priority ||
    form.assigned_to !== (baseline.assigned_to || "") ||
    form.due !== toTorontoInput(baseline.bid_due_at) ||
    form.amount !==
      (baseline.bid_amount === null ? "" : String(baseline.bid_amount));
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
    <Sheet
      open
      onOpenChange={(open) => {
        if (!open) close();
      }}
    >
      <SheetContent className="h-dvh w-full overflow-y-auto sm:max-w-2xl">
        <SheetHeader>
          <SheetTitle>
            {baseline.reference_code} · {baseline.contact_name}
          </SheetTitle>
          <SheetDescription>
            {baseline.company || "No company provided"} ·{" "}
            {formatLeadReceived(baseline.created_at)}
          </SheetDescription>
        </SheetHeader>
        <div className="mt-6 space-y-6">
          <section className="space-y-2">
            <h2 className="font-bold">Submitted request</h2>
            <p className="text-sm">
              {baseline.inquiry_type.replace(/_/g, " ")} ·{" "}
              {baseline.project_name || "No project name"}
            </p>
            <p className="text-sm">{baseline.project_location}</p>
            <p className="whitespace-pre-wrap text-sm">{baseline.message}</p>
            {baseline.details && typeof baseline.details === "object" && (
              <details>
                <summary className="text-sm underline">
                  Additional submitted details
                </summary>
                <dl className="mt-2 space-y-2 text-xs">
                  {Object.entries(baseline.details)
                    .filter(([key]) => key !== "submission_hash")
                    .map(([key, value]) => (
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
            <a
              className="block text-sm underline"
              href={`mailto:${baseline.email}`}
            >
              {baseline.email}
            </a>
            {baseline.phone && <p className="text-sm">{baseline.phone}</p>}
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
          </section>
          <section className="space-y-3 rounded-lg border p-4">
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
                  Daylight saving is handled automatically; repeated fall-back
                  hours use the earlier occurrence.
                </span>
              </label>
            </div>
            {assignees.error && (
              <p role="alert">
                Staff list is unavailable. Existing assignment is retained.
              </p>
            )}
            <div className="flex flex-wrap gap-2">
              <Button disabled={busy} onClick={save}>
                Save changes
              </Button>
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
          <section className="space-y-3">
            <h2 className="font-bold">Notes</h2>
            {thread.error ? (
              <p role="alert">
                Notes, history and alert results could not be loaded.{" "}
                <Button onClick={() => void thread.refetch()}>Retry</Button>
              </p>
            ) : thread.isPending ? (
              <p>Loading notes…</p>
            ) : thread.data?.notes.length ? (
              thread.data.notes.map((n) => (
                <article key={n.id} className="rounded border p-3">
                  <p className="text-xs text-muted-foreground">
                    {actor(n.author_id)} · {formatLeadReceived(n.created_at)}
                  </p>
                  <p className="mt-2 whitespace-pre-wrap text-sm">{n.body}</p>
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
          <section className="space-y-3 rounded-lg border p-4">
            <div className="flex justify-between gap-3">
              <h2 className="font-bold">Alert delivery</h2>
              <Button variant="outline" onClick={() => setReveal(!reveal)}>
                {reveal ? "Mask recipients" : "Reveal recipients"}
              </Button>
            </div>
            <p className="text-sm">
              {baseline.alert_status} · {baseline.alert_attempts} attempts.
              “Sent” means the provider accepted the email; it does not prove
              inbox delivery.
            </p>
            {baseline.alert_last_error && (
              <p role="alert" className="text-sm">
                {baseline.alert_last_error}
              </p>
            )}
            {thread.data?.deliveries.map((d) => (
              <p key={d.id} className="text-xs">
                Attempt {d.attempt} ·{" "}
                {reveal ? d.recipient : maskedEmail(d.recipient)} · {d.status}
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
          <section className="space-y-2">
            <h2 className="font-bold">History</h2>
            {thread.data?.events.map((event) => (
              <p key={event.id} className="border-b py-2 text-sm">
                {formatLeadReceived(event.created_at)} · {actor(event.actor_id)}{" "}
                · {event.event_type.replace(/_/g, " ")}
                {event.from_value || event.to_value
                  ? `: ${event.from_value || "—"} → ${event.to_value || "—"}`
                  : ""}
              </p>
            ))}
          </section>
        </div>
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
                setBaseline(
                  await archiveInquiry(baseline, action === "archive"),
                );
            }, "Lead action completed");
          }}
        />
      </SheetContent>
    </Sheet>
  );
}
