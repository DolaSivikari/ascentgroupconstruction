import {
  INBOX_SOURCES,
  inboxDate,
  inboxText,
  type InboxItem,
} from "@/lib/inbox/model";

export const LEAD_SOURCES = ["rfp", "contact", "quote", "prequal"] as const;
export type LeadSource = (typeof LEAD_SOURCES)[number];
export type LeadType = "general" | "estimate" | "quote" | "rfp" | "prequal";
export type LeadTypeFilter = "all" | "commercial" | LeadType;
export const LEAD_TYPE_LABELS: Record<LeadType, string> = {
  general: "General inquiry",
  estimate: "Estimate",
  quote: "Service quote",
  rfp: "RFP",
  prequal: "Prequalification",
};
// These are the request types written by the current estimate wizard. Its source
// contains UTM JSON, so source === 'estimator' alone misses actual wizard leads.
export const ESTIMATOR_QUOTE_TYPES = [
  "specialty_prime",
  "trade_package",
  "emergency",
  "general",
];
export const CLOSED_LEAD_STATUSES = ["completed", "resolved", "won", "lost"];
export const LEAD_PAGE_SIZE = 50;
export interface LeadFilters {
  search: string;
  type: LeadTypeFilter;
  status: string;
  source?: LeadSource;
}
export const isLeadStatus = (value: string | null): value is string =>
  value !== null &&
  [
    "all",
    "open",
    "closed",
    "new",
    "in_progress",
    "contacted",
    "completed",
    "resolved",
    "quoted",
    "won",
    "lost",
  ].includes(value);
export interface LeadRef {
  id: string;
  source: LeadSource;
}
export interface LeadCursor {
  id: string;
  table: string;
  createdAt: string | null;
}

export function isLeadSource(value: string | null): value is LeadSource {
  return LEAD_SOURCES.some((source) => source === value);
}
export function leadSource(item: InboxItem): LeadSource {
  const source = LEAD_SOURCES.find(
    (key) => INBOX_SOURCES[key].table === item.table,
  );
  if (!source) throw new Error("Unsupported lead source");
  return source;
}
export function leadType(item: InboxItem): LeadType {
  if (item.table === "rfp_submissions") return "rfp";
  if (item.table === "prequalification_downloads") return "prequal";
  if (item.table === "quote_requests")
    return item.source === "estimator" ||
      ESTIMATOR_QUOTE_TYPES.includes(inboxText(item, "quote_type"))
      ? "estimate"
      : "quote";
  if (item.submission_type === "estimate") return "estimate";
  if (
    item.submission_type === "quote" ||
    item.submission_type === "quote_request"
  )
    return "quote";
  return "general";
}
export function leadPreview(item: InboxItem): string {
  return (
    inboxText(item, "scope_of_work") ||
    inboxText(item, "message") ||
    inboxText(item, "additional_notes") ||
    "No message provided"
  );
}
function fractionalMicroseconds(value: string | null): number {
  return Number(
    (value?.match(/\.(\d+)/)?.[1] || "").padEnd(6, "0").slice(3, 6),
  );
}
export function compareLeads(a: InboxItem, b: InboxItem): number {
  const first = inboxDate(a.created_at)?.getTime() ?? -Infinity;
  const second = inboxDate(b.created_at)?.getTime() ?? -Infinity;
  if (first !== second) return first > second ? -1 : 1;
  // Date truncates PostgreSQL's microseconds. Preserve that remaining precision
  // before breaking ties by table and id.
  const remainder =
    fractionalMicroseconds(b.created_at) - fractionalMicroseconds(a.created_at);
  if (remainder) return remainder;
  return a.table.localeCompare(b.table) || a.id.localeCompare(b.id);
}
export function leadCursor(item: InboxItem): LeadCursor {
  return {
    id: item.id,
    table: item.table,
    createdAt: inboxDate(item.created_at) ? item.created_at : null,
  };
}
export function formatLeadReceived(value: string | null): string {
  const date = inboxDate(value);
  return date
    ? new Intl.DateTimeFormat("en-CA", {
        timeZone: "America/Toronto",
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
        timeZoneName: "short",
      }).format(date)
    : "Date unavailable";
}
