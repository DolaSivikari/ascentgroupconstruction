import { supabase } from "@/integrations/supabase/client";
import {
  INBOX_SOURCES,
  inboxDate,
  normalizeInboxItem,
  type InboxItem,
  type InboxKind,
} from "./model";
import { isLeadSource } from "@/lib/leads/model";

export const EMPTY_DASHBOARD_STATS = {
  projectsPublished: 0,
  projectsDraft: 0,
  services: 0,
  blogPublished: 0,
  blogDraft: 0,
  contactTotal: 0,
  prequalTotal: 0,
  rfpTotal: 0,
  quoteTotal: 0,
  resumeTotal: 0,
};
export async function loadDashboardStats() {
  const results = await Promise.all([
    supabase
      .from("projects")
      .select("id", { count: "exact", head: true })
      .eq("publish_state", "published"),
    supabase
      .from("projects")
      .select("id", { count: "exact", head: true })
      .eq("publish_state", "draft"),
    supabase.from("services").select("id", { count: "exact", head: true }),
    supabase
      .from("blog_posts")
      .select("id", { count: "exact", head: true })
      .eq("publish_state", "published"),
    supabase
      .from("blog_posts")
      .select("id", { count: "exact", head: true })
      .neq("publish_state", "published"),
    supabase
      .from("contact_submissions")
      .select("id", { count: "exact", head: true }),
    supabase
      .from("prequalification_downloads")
      .select("id", { count: "exact", head: true }),
    supabase
      .from("rfp_submissions")
      .select("id", { count: "exact", head: true }),
    supabase
      .from("quote_requests")
      .select("id", { count: "exact", head: true }),
    supabase
      .from("resume_submissions")
      .select("id", { count: "exact", head: true }),
  ]);
  if (results.some((result) => result.error || result.count === null))
    throw new Error("Dashboard counts unavailable");
  return Object.fromEntries(
    Object.keys(EMPTY_DASHBOARD_STATS).map((key, index) => [
      key,
      results[index].count,
    ]),
  ) as typeof EMPTY_DASHBOARD_STATS;
}
export async function loadHomepageContentStatus() {
  const results = await Promise.all([
    supabase
      .from("hero_slides")
      .select("id", { count: "exact", head: true })
      .eq("is_active", true),
    supabase
      .from("why_choose_us_items")
      .select("id", { count: "exact", head: true })
      .eq("is_active", true),
    supabase
      .from("testimonials")
      .select("id", { count: "exact", head: true })
      .eq("publish_state", "published")
      .eq("is_featured", true),
    supabase
      .from("value_pillars")
      .select("id", { count: "exact", head: true })
      .eq("is_active", true),
  ]);
  if (results.some((result) => result.error || result.count === null))
    throw new Error("Homepage status unavailable");
  return {
    heroSlides: results[0].count!,
    whyChooseUs: results[1].count!,
    testimonials: results[2].count!,
    valuePillars: results[3].count!,
  };
}
export async function loadRecentInboxActivity(): Promise<{
  items: InboxItem[];
  failed: string[];
}> {
  const kinds: InboxKind[] = ["contact", "rfp", "quote", "prequal", "resume"];
  const results = await Promise.all(
    kinds.map(async (kind) => {
      const source = INBOX_SOURCES[kind];
      try {
        const { data, error } = await supabase
          .from(source.table)
          .select("*")
          .order(source.date, { ascending: false })
          .order("id")
          .limit(5);
        if (error) throw error;
        return {
          items: (data || []).map((row) => normalizeInboxItem(kind, row)),
          failed: [] as string[],
        };
      } catch {
        return { items: [] as InboxItem[], failed: [source.label] };
      }
    }),
  );
  return {
    items: results
      .flatMap((result) => result.items)
      .sort(
        (a, b) =>
          (inboxDate(b.created_at)?.getTime() || 0) -
          (inboxDate(a.created_at)?.getTime() || 0),
      )
      .slice(0, 5),
    failed: results.flatMap((result) => result.failed),
  };
}
export function activityDestination(item: InboxItem): string {
  const kind =
    (Object.keys(INBOX_SOURCES) as InboxKind[]).find(
      (key) => INBOX_SOURCES[key].table === item.table,
    ) || "all";
  const params = new URLSearchParams({
    tab: isLeadSource(kind) ? "leads" : kind,
    highlight: item.id,
  });
  if (isLeadSource(kind)) params.set("source", kind);
  return `/admin/inbox?${params}`;
}
