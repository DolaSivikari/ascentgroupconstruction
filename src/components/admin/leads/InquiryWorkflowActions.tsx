import { useState } from "react";
import {
  DndContext,
  useDraggable,
  useDroppable,
  type DragEndEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { Button } from "@/ui/Button";
import type { InboxItem } from "@/lib/inbox/model";
import { inboxName } from "@/lib/inbox/model";
import { INQUIRY_STATUSES } from "@/lib/inquiry/schema";
import type { Inquiry } from "@/lib/inquiry/types";
import { saveInquiry } from "@/lib/inquiry/api";
import { useToast } from "@/hooks/use-toast";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
function LeadCard({
  item,
  disabled,
  onMove,
  onOpen,
}: {
  item: InboxItem;
  disabled: boolean;
  onMove: (id: string, status: string) => void;
  onOpen: (item: InboxItem) => void;
}) {
  const drag = useDraggable({ id: item.id, disabled });
  return (
    <article
      ref={drag.setNodeRef}
      className="space-y-2 rounded-lg border bg-background p-3"
      style={{
        transform: drag.transform
          ? `translate3d(${drag.transform.x}px,${drag.transform.y}px,0)`
          : undefined,
        zIndex: drag.isDragging ? 10 : undefined,
      }}
    >
      <button
        type="button"
        className="w-full text-left font-semibold"
        onClick={() => onOpen(item)}
      >
        {inboxName(item)}
      </button>
      <p className="text-xs">{String(item.reference_code || "")}</p>
      <button
        type="button"
        className="cursor-grab touch-none text-xs underline"
        disabled={disabled}
        {...drag.listeners}
        {...drag.attributes}
      >
        Drag to another status
      </button>
      <select
        aria-label={`Move ${inboxName(item)} to status`}
        className="w-full rounded border bg-background p-2 text-xs"
        disabled={disabled}
        value={item.status || "new"}
        onChange={(e) => onMove(item.id, e.target.value)}
      >
        {INQUIRY_STATUSES.map((s) => (
          <option key={s} value={s}>
            {s.replace(/_/g, " ")}
          </option>
        ))}
      </select>
    </article>
  );
}
function StatusColumn({
  status,
  items,
  busy,
  onMove,
  onOpen,
}: {
  status: string;
  items: InboxItem[];
  busy: boolean;
  onMove: (id: string, status: string) => void;
  onOpen: (item: InboxItem) => void;
}) {
  const drop = useDroppable({ id: status });
  return (
    <section
      ref={drop.setNodeRef}
      className={`min-h-[180px] space-y-3 rounded-lg border p-3 ${drop.isOver ? "bg-primary/10" : "bg-muted/20"}`}
    >
      <h3 className="font-bold capitalize">
        {status.replace(/_/g, " ")} ({items.length})
      </h3>
      {items.map((item) => (
        <LeadCard
          key={item.id}
          item={item}
          disabled={busy}
          onMove={onMove}
          onOpen={onOpen}
        />
      ))}
    </section>
  );
}
export function InquiryWorkflowActions({
  items,
  onRefresh,
  onOpen,
}: {
  items: InboxItem[];
  onRefresh: () => void;
  onOpen: (item: InboxItem) => void;
}) {
  const [board, setBoard] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);
  const [status, setStatus] = useState("reviewing");
  const [confirm, setConfirm] = useState(false);
  const [busy, setBusy] = useState(false);
  const [failures, setFailures] = useState<string[]>([]);
  const { toast } = useToast();
  const inquiries = items.filter((item) => item.table === "inquiries");
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
  );
  async function move(ids: string[], next: string) {
    if (busy) return;
    setBusy(true);
    const failed: string[] = [];
    for (const id of ids) {
      const item = inquiries.find((i) => i.id === id);
      if (!item) {
        failed.push(id);
        continue;
      }
      const lead = item as unknown as Inquiry;
      try {
        await saveInquiry(lead, {
          status: next,
          priority: lead.priority,
          assigned_to: lead.assigned_to,
          bid_due_at: lead.bid_due_at,
          bid_amount: lead.bid_amount,
        });
      } catch {
        failed.push(String(lead.reference_code || id));
      }
    }
    setFailures(failed);
    setSelected([]);
    setBusy(false);
    onRefresh();
    toast({
      title: failed.length
        ? `${ids.length - failed.length} updated; ${failed.length} need review`
        : "Inquiry statuses updated",
      description: failed.length
        ? "Conflicting leads were not overwritten. Reload and review them individually."
        : undefined,
      variant: failed.length ? "destructive" : "default",
    });
  }
  const dragged = (event: DragEndEvent) => {
    if (
      !event.over ||
      !INQUIRY_STATUSES.includes(
        String(event.over.id) as (typeof INQUIRY_STATUSES)[number],
      )
    )
      return;
    const item = inquiries.find((i) => i.id === event.active.id);
    if (item && item.status !== event.over.id)
      void move([item.id], String(event.over.id));
  };
  if (!inquiries.length) return null;
  return (
    <section
      className="space-y-3 rounded-xl border p-4"
      aria-label="Optional inquiry workflow tools"
    >
      <div className="flex flex-wrap items-center gap-3">
        <Button
          variant="outline"
          disabled={busy}
          onClick={() => setBoard(!board)}
        >
          {board ? "Hide board" : "Show optional board"}
        </Button>
        <label className="flex gap-2 text-sm">
          <input
            type="checkbox"
            disabled={busy}
            checked={selected.length === inquiries.length}
            onChange={(e) =>
              setSelected(e.target.checked ? inquiries.map((i) => i.id) : [])
            }
          />
          Select new inquiries on this page
        </label>
        <select
          aria-label="Bulk status"
          className="rounded border bg-background p-2 text-sm"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          {INQUIRY_STATUSES.map((s) => (
            <option key={s} value={s}>
              {s.replace(/_/g, " ")}
            </option>
          ))}
        </select>
        <Button
          disabled={busy || !selected.length}
          onClick={() => setConfirm(true)}
        >
          Update selected ({selected.length})
        </Button>
      </div>
      <p className="text-xs text-muted-foreground">
        These tools use new inquiries on the currently loaded page. The main
        list below also contains all legacy sources; filters and paging still
        apply.
      </p>
      {!!selected.length && (
        <div className="flex flex-wrap gap-3">
          {inquiries.map((i) => (
            <label key={i.id} className="flex gap-1 text-xs">
              <input
                type="checkbox"
                checked={selected.includes(i.id)}
                disabled={busy}
                onChange={(e) =>
                  setSelected((old) =>
                    e.target.checked
                      ? [...old, i.id]
                      : old.filter((id) => id !== i.id),
                  )
                }
              />
              {String(i.reference_code)}
            </label>
          ))}
        </div>
      )}
      {failures.length > 0 && (
        <p role="alert" className="text-sm">
          Not updated: {failures.join(", ")}
        </p>
      )}
      {board && (
        <DndContext sensors={sensors} onDragEnd={dragged}>
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            {INQUIRY_STATUSES.map((s) => (
              <StatusColumn
                key={s}
                status={s}
                items={inquiries.filter((i) => i.status === s)}
                busy={busy}
                onMove={(id, next) => void move([id], next)}
                onOpen={onOpen}
              />
            ))}
          </div>
        </DndContext>
      )}
      <ConfirmDialog
        open={confirm}
        onOpenChange={setConfirm}
        title={`Update ${selected.length} inquiry statuses?`}
        description={`Each lead will move to ${status.replace(/_/g, " ")}. Conflicting saves are skipped and reported individually.`}
        onConfirm={() => void move(selected, status)}
      />
    </section>
  );
}
