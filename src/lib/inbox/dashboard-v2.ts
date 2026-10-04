import { supabase } from "@/integrations/supabase/client";
import { loadNewInboxCount } from "./api";
import { loadRecentInboxActivity } from "./dashboard";
import { INBOX_SOURCES, type InboxItem } from "./model";
import { LEAD_SOURCES, type LeadSource } from "@/lib/leads/model";

// P4a does not enable the future RPC, even if a schema was applied independently.
// P4b must explicitly opt in and add the inquiry contribution to legacy totals.
type SummaryRpc = {
  rpc(name: "admin_inquiry_summary"): PromiseLike<{
    data: unknown;
    error: { code?: string } | null;
  }>;
};
export async function loadInquirySummaryCapability(enabled = false) {
  if (!enabled) return { available: false as const, reason: "disabled" };
  const { data, error } = await (supabase as unknown as SummaryRpc).rpc(
    "admin_inquiry_summary",
  );
  if (error?.code === "PGRST202" || error?.code === "42883")
    return { available: false as const, reason: "missing" };
  if (error) throw new Error("Inquiry summary unavailable");
  return { available: true as const, data };
}

export interface LegacyLeadSummary {
  newBySource: Record<LeadSource, number | null>;
  newTotal: number | null;
  byStatus: Record<string, number> | null;
  total: number | null;
  activity: { items: InboxItem[]; failed: string[] };
  failed: string[];
}

async function loadStatusCounts(source: LeadSource, signal?: AbortSignal) {
  const counts = Object.create(null) as Record<string, number>;
  let cursor: string | null = null;
  // Minimal projection; count headers detect a REST row cap smaller than our
  // requested page size. Never mistake a truncated response for a complete total.
  for (;;) {
    let query = supabase
      .from(INBOX_SOURCES[source].table)
      .select("id,status", { count: "exact" })
      .order("id", { ascending: true })
      .limit(1000);
    if (cursor) query = query.gt("id", cursor);
    if (signal) query = query.abortSignal(signal);
    const { data, count, error } = await query;
    if (
      error ||
      count === null ||
      !Number.isSafeInteger(count) ||
      count < 0 ||
      !data
    )
      throw new Error("Pipeline unavailable");
    if (data.length > count || (!data.length && count))
      throw new Error("Incomplete pipeline");
    for (const row of data) {
      if (
        typeof row.id !== "string" ||
        (row.status !== null && typeof row.status !== "string")
      )
        throw new Error("Invalid pipeline record");
      const status = row.status === null ? "new" : row.status;
      counts[status] = (counts[status] || 0) + 1;
    }
    if (data.length === count) return counts;
    const next = data[data.length - 1]?.id;
    if (!next || (cursor && next <= cursor))
      throw new Error("Pipeline paging did not advance");
    cursor = next;
  }
}

export async function loadLegacyLeadSummary(
  signal?: AbortSignal,
): Promise<LegacyLeadSummary> {
  const results = await Promise.all(
    LEAD_SOURCES.map(async (source) => {
      const [newCount, pipeline] = await Promise.allSettled([
        loadNewInboxCount(source, signal),
        loadStatusCounts(source, signal),
      ]);
      if (signal?.aborted) throw new Error("Dashboard request cancelled");
      return { source, newCount, pipeline };
    }),
  );
  const newBySource = Object.fromEntries(
    results.map((result) => [
      result.source,
      result.newCount.status === "fulfilled" ? result.newCount.value : null,
    ]),
  ) as LegacyLeadSummary["newBySource"];
  const counts = Object.values(newBySource);
  const newTotal = counts.some((count) => count === null)
    ? null
    : counts.reduce<number>((sum, count) => sum + (count ?? 0), 0);
  const pipelineFailed = results.some(
    (result) => result.pipeline.status === "rejected",
  );
  const byStatus: Record<string, number> | null = pipelineFailed
    ? null
    : (Object.create(null) as Record<string, number>);
  if (byStatus)
    for (const result of results) {
      if (result.pipeline.status === "fulfilled")
        for (const [status, count] of Object.entries(result.pipeline.value))
          byStatus[status] = (byStatus[status] || 0) + count;
    }
  const activity = await loadRecentInboxActivity(LEAD_SOURCES, 10, signal);
  return {
    newBySource,
    newTotal,
    byStatus,
    total: byStatus
      ? Object.values(byStatus).reduce((sum, count) => sum + count, 0)
      : null,
    activity,
    failed: [
      ...new Set([
        ...results
          .filter(
            (result) =>
              result.newCount.status === "rejected" ||
              result.pipeline.status === "rejected",
          )
          .map((result) => INBOX_SOURCES[result.source].label),
        ...activity.failed,
      ]),
    ],
  };
}

const CONTENT_READS = [
  {
    key: "projectsPublished",
    table: "projects",
    filters: [["publish_state", "published"]],
  },
  {
    key: "projectsDraft",
    table: "projects",
    filters: [["publish_state", "draft"]],
  },
  { key: "services", table: "services", filters: [] },
  {
    key: "blogPublished",
    table: "blog_posts",
    filters: [["publish_state", "published"]],
  },
  {
    key: "blogDraft",
    table: "blog_posts",
    filters: [["publish_state", "published"]],
    unpublished: true,
  },
  { key: "heroSlides", table: "hero_slides", filters: [["is_active", true]] },
  {
    key: "whyChooseUs",
    table: "why_choose_us_items",
    filters: [["is_active", true]],
  },
  {
    key: "testimonials",
    table: "testimonials",
    filters: [
      ["publish_state", "published"],
      ["is_featured", true],
    ],
  },
  {
    key: "valuePillars",
    table: "value_pillars",
    filters: [["is_active", true]],
  },
] as const;
export type DashboardContentKey = (typeof CONTENT_READS)[number]["key"];
export type DashboardContent = Record<DashboardContentKey, number | null>;
export async function loadDashboardContent(
  signal?: AbortSignal,
): Promise<DashboardContent> {
  const entries = await Promise.all(
    CONTENT_READS.map(async (item) => {
      try {
        let query = supabase
          .from(item.table)
          .select("id", { count: "exact", head: true });
        for (const [field, value] of item.filters)
          query = query.filter(
            field,
            "unpublished" in item ? "neq" : "eq",
            value,
          );
        if (signal) query = query.abortSignal(signal);
        const { count, error } = await query;
        if (
          error ||
          count === null ||
          !Number.isSafeInteger(count) ||
          count < 0
        )
          throw new Error("Content count unavailable");
        return [item.key, count] as const;
      } catch (error) {
        if (signal?.aborted) throw error;
        return [item.key, null] as const;
      }
    }),
  );
  return Object.fromEntries(entries) as DashboardContent;
}

export function dashboardLeadDestination(status: string, source?: LeadSource) {
  const params = new URLSearchParams({ tab: "leads", status });
  if (source) params.set("lead_source", source);
  return `/admin/inbox?${params}`;
}
