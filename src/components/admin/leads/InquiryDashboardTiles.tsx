import { Link } from "react-router-dom";
import type { z } from "zod";
import type { inquirySummarySchema } from "@/lib/inquiry/summary";
export function InquiryDashboardTiles({
  summary,
}: {
  summary: z.infer<typeof inquirySummarySchema>;
}) {
  const cards = [
    ["Unopened inquiries", summary.unopened, "status=new"],
    ["Bids due within 7 days", summary.due_next_7_days, "attention=due"],
    ["Overdue bids", summary.overdue, "attention=overdue"],
    ["Unassigned inquiries", summary.unassigned, "attention=unassigned"],
    [
      "Inquiry alerts needing attention",
      summary.alerts_needing_attention,
      "attention=alerts",
    ],
    ["Awaiting award decision", summary.awaiting_decision, "status=submitted"],
  ] as const;
  return (
    <section
      aria-label="Inquiry workflow summary"
      className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3"
    >
      {cards.map(([label, count, filter]) => (
        <Link
          key={label}
          to={`/admin/inbox?tab=leads&lead_source=inquiry&${filter}`}
          className="rounded-xl border bg-background p-4 hover:bg-muted/50"
        >
          <p className="text-sm text-muted-foreground">{label}</p>
          <strong className="text-3xl">{count}</strong>
        </Link>
      ))}
    </section>
  );
}
