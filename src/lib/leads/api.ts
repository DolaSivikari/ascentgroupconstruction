import { loadInquiryPage, inquiryInboxItem } from "@/lib/inquiry/list";
import { loadInquiryDetail } from "@/lib/inquiry/api";
import { supabase } from "@/integrations/supabase/client";
import {
  INBOX_SOURCES,
  STATUS_LABELS,
  normalizeInboxItem,
  type InboxItem,
} from "@/lib/inbox/model";
import {
  CLOSED_LEAD_STATUSES,
  ESTIMATOR_QUOTE_TYPES,
  LEAD_PAGE_SIZE,
  LEAD_SOURCES,
  compareLeads,
  leadCursor,
  type LeadCursor,
  type LeadFilters,
  type LeadRef,
  type LeadSource,
  type LegacyLeadSource,
} from "./model";

const SEARCH_FIELDS: Record<LegacyLeadSource, string[]> = {
  rfp: [
    "contact_name",
    "company_name",
    "email",
    "phone",
    "project_name",
    "project_location",
    "scope_of_work",
  ],
  contact: ["name", "company", "email", "phone", "message"],
  quote: [
    "name",
    "company",
    "email",
    "phone",
    "project_address",
    "city",
    "additional_notes",
  ],
  prequal: [
    "contact_name",
    "company_name",
    "email",
    "phone",
    "message",
    "project_type",
  ],
};
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const TIMESTAMP =
  /^\d{4}-\d{2}-\d{2}[T ]\d{2}:\d{2}:\d{2}(?:\.\d{1,6})?(?:Z|[+-]\d{2}:\d{2})$/i;

// A quoted PostgREST value keeps commas/parentheses from becoming filter syntax.
// Escape SQL LIKE metacharacters first, then PostgREST's quoting layer.
export function leadSearchFilter(fields: string[], search: string): string {
  const pattern = `%${search
    .trim()
    .slice(0, 120)
    .replace(/[\\%_]/g, "\\$&")}%`;
  const value = pattern.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
  return fields.map((field) => `${field}.ilike."${value}"`).join(",");
}

function sourcesForType(type: LeadFilters["type"]): LegacyLeadSource[] {
  if (type === "bid") return [];
  if (type === "rfp") return ["rfp"];
  if (type === "prequal") return ["prequal"];
  if (type === "general") return ["contact"];
  if (type === "estimate" || type === "quote") return ["contact", "quote"];
  if (type === "commercial") return ["rfp", "contact", "quote"];
  return [...LEAD_SOURCES];
}

export interface LeadPage {
  items: InboxItem[];
  failed: string[];
  nextCursor: LeadCursor | null;
  inquiryAvailable?: boolean;
}

/** Merge bounded, identically ordered keyset reads. No OFFSET into a combined
 * feed: new arrivals cannot shift older pages and cause skipped records. */
export async function loadLeadPage(
  filters: LeadFilters,
  cursor: LeadCursor | null = null,
  signal?: AbortSignal,
  pageSize = LEAD_PAGE_SIZE,
  includeInquiries = false,
): Promise<LeadPage> {
  if (!Number.isInteger(pageSize) || pageSize < 1 || pageSize > LEAD_PAGE_SIZE)
    throw new Error("Invalid page size");
  if (
    cursor &&
    (!UUID.test(cursor.id) ||
      !(
        cursor.table === "inquiries" ||
        LEAD_SOURCES.some((key) => INBOX_SOURCES[key].table === cursor.table)
      ) ||
      (cursor.createdAt !== null &&
        (!TIMESTAMP.test(cursor.createdAt) ||
          !Number.isFinite(Date.parse(cursor.createdAt)))))
  )
    throw new Error("Invalid page cursor");
  if (
    ![
      "all",
      "open",
      "closed",
      "archived",
      ...Object.keys(STATUS_LABELS),
    ].includes(filters.status)
  )
    throw new Error("Invalid lead status");

  const sources = sourcesForType(filters.type).filter(
    (key) =>
      !filters.attention &&
      filters.status !== "archived" &&
      (!filters.source || filters.source === key),
  );
  const results: { items: InboxItem[]; failed: string[] }[] = await Promise.all(
    sources.map(async (key) => {
      const source = INBOX_SOURCES[key];
      try {
        let query = supabase
          .from(source.table)
          .select("*")
          .order(source.date, { ascending: false, nullsFirst: false })
          .order("id", { ascending: true });
        if (filters.type === "estimate") {
          query =
            key === "contact"
              ? query.or("submission_type.eq.estimate")
              : query.or(
                  `source.eq.estimator,quote_type.in.(${ESTIMATOR_QUOTE_TYPES.join(",")})`,
                );
        } else if (filters.type === "quote") {
          query =
            key === "contact"
              ? query.or("submission_type.in.(quote,quote_request)")
              : query
                  .or("source.is.null,source.neq.estimator")
                  .or(
                    `quote_type.is.null,quote_type.not.in.(${ESTIMATOR_QUOTE_TYPES.join(",")})`,
                  );
        } else if (filters.type === "general") {
          query = query.or(
            "submission_type.is.null,submission_type.not.in.(estimate,quote,quote_request)",
          );
        } else if (filters.type === "commercial" && key === "contact") {
          query = query.or("submission_type.in.(estimate,quote,quote_request)");
        }
        if (filters.status === "open")
          query = query.or(
            `status.is.null,status.not.in.(${CLOSED_LEAD_STATUSES.join(",")})`,
          );
        else if (filters.status === "closed")
          query = query.in("status", CLOSED_LEAD_STATUSES);
        else if (filters.status === "new")
          query = query.or("status.is.null,status.eq.new");
        else if (filters.status !== "all")
          query = query.eq("status", filters.status);
        if (filters.search.trim())
          query = query.or(
            leadSearchFilter(SEARCH_FIELDS[key], filters.search),
          );
        if (cursor) {
          const tableOrder = source.table.localeCompare(cursor.table);
          if (cursor.createdAt === null) {
            if (tableOrder < 0) return { items: [], failed: [] };
            query = query.is(source.date, null);
            if (tableOrder === 0) query = query.gt("id", cursor.id);
          } else {
            const time = cursor.createdAt;
            const tie =
              tableOrder === 0
                ? `and(${source.date}.eq.${time},id.gt.${cursor.id})`
                : tableOrder > 0
                  ? `${source.date}.eq.${time}`
                  : "";
            query = query.or(
              [`${source.date}.lt.${time}`, tie, `${source.date}.is.null`]
                .filter(Boolean)
                .join(","),
            );
          }
        }
        if (signal) query = query.abortSignal(signal);
        const { data, error } = await query.limit(pageSize + 1);
        if (error) throw error;
        return {
          items: (data || []).map((row) => normalizeInboxItem(key, row)),
          failed: [],
        };
      } catch (error) {
        if (signal?.aborted) throw error;
        return { items: [] as InboxItem[], failed: [source.label] };
      }
    }),
  );
  const inquiries = includeInquiries
    ? await loadInquiryPage(filters, cursor, signal, pageSize)
    : null;
  if (inquiries) results.push(inquiries);
  const merged = results.flatMap((result) => result.items).sort(compareLeads);
  const items = merged.slice(0, pageSize);
  const failed = results.flatMap((result) => result.failed);
  // Never advance beyond an unavailable source: it could contain newer leads.
  return {
    items,
    failed,
    inquiryAvailable: inquiries?.inquiryAvailable,
    nextCursor:
      !failed.length && merged.length > pageSize
        ? leadCursor(items[items.length - 1])
        : null,
  };
}

/** Resolve notification links independently of the current page and filters. */
export async function loadLeadDetail(
  ref: Pick<LeadRef, "id"> & { source?: LeadSource },
  signal?: AbortSignal,
): Promise<InboxItem> {
  if (!UUID.test(ref.id)) throw new Error("This request link is invalid.");
  if (ref.source === "inquiry")
    return inquiryInboxItem(await loadInquiryDetail(ref.id));
  const results = await Promise.all(
    (ref.source ? [ref.source] : LEAD_SOURCES).map(async (key) => {
      let query = supabase
        .from(INBOX_SOURCES[key].table)
        .select("*")
        .eq("id", ref.id);
      if (signal) query = query.abortSignal(signal);
      const { data, error } = await query.maybeSingle();
      return {
        item: data && !error ? normalizeInboxItem(key, data) : null,
        error,
      };
    }),
  );
  const found = results.flatMap((result) => (result.item ? [result.item] : []));
  if (found.length > 1)
    throw new Error(
      "More than one request matches this link. Open the request from the Leads list.",
    );
  if (found.length === 1) return found[0];
  if (results.some((result) => result.error))
    throw new Error("Could not load this request. Please retry.");
  throw new Error(
    "This request was not found or is no longer available to your account.",
  );
}
