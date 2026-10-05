import { z } from "zod";
import { inquiryDb } from "./types";
import { missingOptionalSchema } from "@/lib/admin/optionalDatabase";
import { loadLegacyLeadSummary } from "@/lib/inbox/dashboard-v2";
import { inquiryInboxItem } from "./list";
import { compareLeads } from "@/lib/leads/model";
const count = z.number().int().nonnegative();
export const inquirySummarySchema = z.object({
  unopened: count,
  needs_action: count,
  awaiting_decision: count,
  due_next_7_days: count,
  overdue: count,
  unassigned: count,
  alerts_needing_attention: count,
  by_status: z.record(z.string(), count),
  by_type_open: z.record(z.string(), count),
  submitted_value_open: z.number().nonnegative(),
  closed_last_90_days: z.object({ won: count, lost: count, no_bid: count }),
});
export async function loadCombinedLeadSummary(signal?: AbortSignal) {
  const legacyPromise = loadLegacyLeadSummary(signal);
  const { data, error } = await inquiryDb.rpc("admin_inquiry_summary", {});
  const legacy = await legacyPromise;
  if (missingOptionalSchema(error))
    return { ...legacy, inquiry: null, inquiryAvailable: false };
  if (error)
    return {
      ...legacy,
      inquiry: null,
      inquiryAvailable: true,
      failed: [...legacy.failed, "New inquiries"],
    };
  const parsed = inquirySummarySchema.safeParse(data);
  if (!parsed.success)
    return {
      ...legacy,
      inquiry: null,
      inquiryAvailable: true,
      failed: [...legacy.failed, "Inquiry summary"],
    };
  const summary = parsed.data;
  let recent = inquiryDb
    .from("inquiries")
    .select("*")
    .is("archived_at", null)
    .order("created_at", { ascending: false })
    .order("id")
    .limit(10);
  if (signal) recent = recent.abortSignal(signal);
  const activity = await recent;
  const byStatus = legacy.byStatus ? { ...legacy.byStatus } : null;
  if (byStatus)
    for (const [status, total] of Object.entries(summary.by_status))
      byStatus[status] = (byStatus[status] || 0) + total;
  return {
    ...legacy,
    inquiry: summary,
    inquiryAvailable: true,
    newTotal:
      legacy.newTotal === null
        ? null
        : legacy.newTotal + (summary.by_status.new || 0),
    total:
      legacy.total === null
        ? null
        : legacy.total +
          Object.values(summary.by_status).reduce((a, b) => a + b, 0),
    byStatus,
    activity: {
      items: [
        ...legacy.activity.items,
        ...(activity.data || []).map(inquiryInboxItem),
      ]
        .sort(compareLeads)
        .slice(0, 10),
      failed: [
        ...legacy.activity.failed,
        ...(activity.error ? ["New inquiries"] : []),
      ],
    },
    failed: [
      ...legacy.failed,
      ...(activity.error ? ["New inquiry activity"] : []),
    ],
  };
}
