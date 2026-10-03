import {
  inboxDate,
  inboxName,
  inboxStrings,
  inboxText,
  STATUS_LABELS,
  type InboxFilter,
  type InboxItem,
} from "./model";

export type InboxSort = "received" | "deadline";
export type CommercialType = "all" | "rfp" | "estimate" | "quote";

const CLOSED_STATUSES = new Set(["completed", "resolved", "won", "lost"]);
export const isOpenInboxItem = (item: InboxItem): boolean =>
  !CLOSED_STATUSES.has(item.status || "new");

export function commercialType(
  item: InboxItem,
): Exclude<CommercialType, "all"> | null {
  if (item.table === "rfp_submissions") return "rfp";
  if (item.table === "quote_requests")
    return item.source === "estimator" ? "estimate" : "quote";
  return null;
}

export function inboxTypeLabel(item: InboxItem): string {
  return commercialType(item) === "estimate" ? "Estimate" : item.type;
}

/** PostgreSQL DATE values stay calendar dates; never infer a bid time or use RFP start dates. */
export function requestedDeadline(item: InboxItem): string | null {
  if (item.table !== "quote_requests") return null;
  const value = inboxText(item, "target_deadline");
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return null;
  const [, year, month, day] = match.map(Number);
  const leap = year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
  const days = [31, leap ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  if (year < 1 || month < 1 || month > 12 || day < 1 || day > days[month - 1])
    return null;
  return value;
}

export function torontoDate(now: Date = new Date()): string {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Toronto",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(now);
  return ["year", "month", "day"]
    .map((key) => parts.find((part) => part.type === key)?.value)
    .join("-");
}

export function deadlineCue(
  item: InboxItem,
  today: string,
): "overdue" | "today" | null {
  const deadline = requestedDeadline(item);
  if (!deadline || !isOpenInboxItem(item)) return null;
  if (deadline < today) return "overdue";
  return deadline === today ? "today" : null;
}

export function formatRequestedDeadline(value: string): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "UTC",
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(`${value}T12:00:00Z`));
}

/** Copy before sorting, keep missing dates last, and preserve input order for equal dates. */
export function sortInboxItems(
  items: readonly InboxItem[],
  sort: InboxSort,
): InboxItem[] {
  return [...items].sort((a, b) => {
    if (sort === "received")
      return (
        (inboxDate(b.created_at)?.getTime() || 0) -
        (inboxDate(a.created_at)?.getTime() || 0)
      );
    const first = requestedDeadline(a);
    const second = requestedDeadline(b);
    if (!first && !second) return 0;
    if (!first) return 1;
    if (!second) return -1;
    return first.localeCompare(second);
  });
}

function csvCell(value: string): string {
  // Spreadsheet programs can execute submitted values as formulas, including after whitespace.
  const safe =
    /^[\s\uFEFF]*[=+\-@]/u.test(value) || value.charCodeAt(0) < 32
      ? `'${value}`
      : value;
  return `"${safe.replace(/"/g, '""')}"`;
}

/** Explicit summary allowlist: private file URLs, IP/consent fields and internal notes never leave the inbox. */
export function inboxCsv(items: readonly InboxItem[]): string {
  const headers = [
    "Type",
    "Reference",
    "Received",
    "Contact",
    "Company",
    "Email",
    "Phone",
    "Project / property",
    "Scope",
    "Status",
    "Requested deadline",
  ];
  const rows = items.map((item) => [
    inboxTypeLabel(item),
    item.id,
    inboxText(item, "created_at"),
    inboxName(item),
    inboxText(item, "company_name") || inboxText(item, "company"),
    item.email,
    inboxText(item, "phone"),
    inboxText(item, "project_name") ||
      [inboxText(item, "project_address"), inboxText(item, "city")]
        .filter(Boolean)
        .join(", ") ||
      inboxText(item, "project_location"),
    inboxText(item, "scope_of_work") ||
      inboxStrings(item, "scope_categories").join(", ") ||
      inboxText(item, "quote_type"),
    item.table === "newsletter_subscribers"
      ? item.is_active
        ? "Active"
        : "Inactive"
      : STATUS_LABELS[item.status || "new"] || item.status || "New",
    requestedDeadline(item) || "",
  ]);
  return [headers, ...rows]
    .map((row) => row.map(csvCell).join(","))
    .join("\r\n");
}

export function downloadInboxCsv(
  items: readonly InboxItem[],
  filter: InboxFilter,
): void {
  const url = URL.createObjectURL(
    new Blob(["\uFEFF", inboxCsv(items)], { type: "text/csv;charset=utf-8" }),
  );
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `inbox-${filter}-${torontoDate()}.csv`;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}
