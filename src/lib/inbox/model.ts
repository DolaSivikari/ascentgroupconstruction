export const INBOX_SOURCES = {
  rfp: { table: "rfp_submissions", label: "RFP", date: "created_at" },
  contact: {
    table: "contact_submissions",
    label: "Contact",
    date: "created_at",
  },
  resume: { table: "resume_submissions", label: "Resume", date: "created_at" },
  prequal: {
    table: "prequalification_downloads",
    label: "Prequal",
    date: "downloaded_at",
  },
  quote: { table: "quote_requests", label: "Quote", date: "created_at" },
  newsletter: {
    table: "newsletter_subscribers",
    label: "Newsletter",
    date: "created_at",
  },
} as const;

export type InboxKind = keyof typeof INBOX_SOURCES;
export type InboxFilter = "all" | "work" | InboxKind;
export type InboxTableName =
  | (typeof INBOX_SOURCES)[InboxKind]["table"]
  | "inquiries";
export interface InboxItem extends Record<string, unknown> {
  id: string;
  table: InboxTableName;
  type: (typeof INBOX_SOURCES)[InboxKind]["label"] | "Inquiry";
  email: string;
  created_at: string | null;
  status: string | null;
}

const GENERAL_STATUSES = [
  "new",
  "in_progress",
  "contacted",
  "completed",
  "resolved",
];
const QUOTE_STATUSES = ["new", "contacted", "quoted", "won", "lost"];
export const STATUS_LABELS: Record<string, string> = {
  new: "New",
  reviewing: "Reviewing",
  bidding: "Bidding",
  submitted: "Submitted",
  no_bid: "No bid",
  in_progress: "In Progress",
  contacted: "Contacted",
  completed: "Completed",
  resolved: "Resolved",
  quoted: "Quoted",
  won: "Won",
  lost: "Lost",
};

export const inboxText = (
  item: Record<string, unknown>,
  field: string,
): string => (typeof item[field] === "string" ? (item[field] as string) : "");
export const inboxStrings = (
  item: Record<string, unknown>,
  field: string,
): string[] =>
  Array.isArray(item[field])
    ? (item[field] as unknown[]).filter(
        (value): value is string => typeof value === "string" && !!value.trim(),
      )
    : [];

export function normalizeInboxItem(
  kind: InboxKind,
  row: Record<string, unknown>,
): InboxItem {
  if (typeof row.id !== "string" || typeof row.email !== "string")
    throw new Error("Invalid inbox record");
  const source = INBOX_SOURCES[kind];
  return {
    ...row,
    id: row.id,
    email: row.email,
    table: source.table,
    type: source.label,
    created_at: inboxText(row, source.date) || null,
    status: inboxText(row, "status") || null,
  };
}

export function inboxStatuses(table: InboxTableName): string[] {
  return table === "newsletter_subscribers"
    ? []
    : table === "quote_requests"
      ? QUOTE_STATUSES
      : GENERAL_STATUSES;
}
export function filterStatuses(kind: InboxFilter): string[] {
  return kind === "all" || kind === "work"
    ? [...new Set([...GENERAL_STATUSES, ...QUOTE_STATUSES])]
    : inboxStatuses(INBOX_SOURCES[kind].table);
}
export function inboxKinds(filter: InboxFilter): InboxKind[] {
  if (filter === "all") return Object.keys(INBOX_SOURCES) as InboxKind[];
  if (filter === "work") return ["rfp", "quote"];
  return [filter];
}
export const supportsAdminNotes = (item: InboxItem) =>
  ["rfp_submissions", "contact_submissions", "resume_submissions"].includes(
    item.table,
  ) && Object.prototype.hasOwnProperty.call(item, "admin_notes");

/** Preserve submitted notes; never send nonexistent columns or incompatible statuses. */
export function inboxUpdate(
  item: InboxItem,
  status: string,
  notes: string,
): { status?: string; admin_notes?: string } {
  const patch: { status?: string; admin_notes?: string } = {};
  if (status !== (item.status || "new")) {
    if (!inboxStatuses(item.table).includes(status))
      throw new Error("Choose a supported status for this request type.");
    patch.status = status;
  }
  if (supportsAdminNotes(item) && notes !== inboxText(item, "admin_notes"))
    patch.admin_notes = notes;
  return patch;
}

export function matchesInboxSearch(item: InboxItem, query: string): boolean {
  const haystack = [
    "contact_name",
    "name",
    "applicant_name",
    "company",
    "company_name",
    "email",
    "phone",
    "project_name",
    "project_location",
    "scope_of_work",
    "message",
    "additional_notes",
    "position_applied",
  ]
    .map((field) => inboxText(item, field))
    .concat(inboxStrings(item, "scope_categories"))
    .join(" ")
    .toLowerCase();
  return haystack.includes(query.trim().toLowerCase());
}

export const inboxName = (item: InboxItem): string =>
  ["contact_name", "name", "applicant_name", "company_name"]
    .map((field) => inboxText(item, field))
    .find(Boolean) || item.email;
export const inboxDate = (value: string | null | undefined): Date | null => {
  if (!value) return null;
  const date = new Date(value);
  return Number.isFinite(date.getTime()) ? date : null;
};

/** Existing legacy attachment URLs must resolve to the private RFP bucket. */
export function rfpAttachmentPath(value: string, backendUrl: string): string {
  let path = value;
  if (/^https?:\/\//i.test(value)) {
    const url = new URL(value);
    if (url.origin !== new URL(backendUrl).origin)
      throw new Error("Unsupported attachment location.");
    const match = url.pathname.match(
      /^\/storage\/v1\/object\/(?:public|sign)\/rfp-attachments\/(.+)$/,
    );
    if (!match) throw new Error("Unsupported attachment location.");
    path = decodeURIComponent(match[1]);
  }
  if (
    !path ||
    path.startsWith("/") ||
    /[\\?#:]/.test(path) ||
    [...path].some(
      (char) => char.charCodeAt(0) < 32 || char.charCodeAt(0) === 127,
    ) ||
    path.split("/").some((part) => !part || part === "." || part === "..")
  ) {
    throw new Error("Invalid attachment path.");
  }
  return path;
}
