import { inquiryDb } from "./types";
import { missingOptionalSchema } from "@/lib/admin/optionalDatabase";
import { leadSearchFilter } from "@/lib/leads/api";
import type { LeadFilters, LeadCursor } from "@/lib/leads/model";
import type { InboxItem } from "@/lib/inbox/model";
export function inquiryInboxItem(row: Record<string, unknown>): InboxItem {
  return {
    ...row,
    id: String(row.id),
    table: "inquiries",
    type: "Inquiry",
    email: String(row.email),
    created_at: String(row.created_at),
    status: String(row.status),
  };
}
export async function loadInquiryPage(
  filters: LeadFilters,
  cursor: LeadCursor | null,
  signal: AbortSignal | undefined,
  pageSize: number,
) {
  if (
    (filters.source && filters.source !== "inquiry") ||
    filters.type === "quote"
  )
    return {
      items: [] as InboxItem[],
      failed: [],
      inquiryAvailable: undefined,
    };
  let query = inquiryDb
    .from("inquiries")
    .select("*")
    .order("created_at", { ascending: false })
    .order("id", { ascending: true });
  if (filters.type === "commercial")
    query = query.in("inquiry_type", ["estimate", "rfp", "bid_invitation"]);
  else if (filters.type !== "all")
    query = query.eq(
      "inquiry_type",
      { prequal: "prequal_request", bid: "bid_invitation" }[filters.type] ||
        filters.type,
    );
  if (filters.status === "archived")
    query = query.not("archived_at", "is", null);
  else query = query.is("archived_at", null);
  if (filters.status === "open")
    query = query.in("status", ["new", "reviewing", "bidding", "submitted"]);
  else if (filters.status === "closed")
    query = query.in("status", ["won", "lost", "no_bid"]);
  else if (!["all", "archived"].includes(filters.status))
    query = query.eq(
      "status",
      {
        in_progress: "reviewing",
        contacted: "reviewing",
        quoted: "submitted",
        completed: "won",
        resolved: "won",
      }[filters.status] || filters.status,
    );
  if (filters.attention === "unassigned") query = query.is("assigned_to", null);
  if (filters.attention === "overdue")
    query = query
      .lt("bid_due_at", new Date().toISOString())
      .in("status", ["new", "reviewing", "bidding"]);
  if (filters.attention === "due")
    query = query
      .gte("bid_due_at", new Date().toISOString())
      .lt("bid_due_at", new Date(Date.now() + 7 * 86400000).toISOString())
      .in("status", ["new", "reviewing", "bidding"]);
  if (filters.attention === "alerts")
    query = query.or(
      `alert_status.in.(failed,partial),and(alert_status.eq.pending,created_at.lt.${new Date(Date.now() - 600000).toISOString()},or(alert_lease_until.is.null,alert_lease_until.lt.${new Date().toISOString()}))`,
    );
  if (filters.search.trim())
    query = query.or(
      leadSearchFilter(
        [
          "contact_name",
          "company",
          "email",
          "phone",
          "project_name",
          "project_location",
          "message",
          "reference_code",
        ],
        filters.search,
      ),
    );
  if (cursor) {
    if (cursor.createdAt === null)
      return { items: [], failed: [], inquiryAvailable: true };
    const tie =
      "inquiries".localeCompare(cursor.table) === 0
        ? `and(created_at.eq.${cursor.createdAt},id.gt.${cursor.id})`
        : "inquiries".localeCompare(cursor.table) > 0
          ? `created_at.eq.${cursor.createdAt}`
          : "";
    query = query.or(
      [`created_at.lt.${cursor.createdAt}`, tie].filter(Boolean).join(","),
    );
  }
  if (signal) query = query.abortSignal(signal);
  const { data, error } = await query.limit(pageSize + 1);
  if (missingOptionalSchema(error))
    return { items: [], failed: [], inquiryAvailable: false };
  if (error) {
    if (signal?.aborted) throw error;
    return { items: [], failed: ["New inquiries"], inquiryAvailable: true };
  }
  return {
    items: (data || []).map(inquiryInboxItem),
    failed: [],
    inquiryAvailable: true,
  };
}
