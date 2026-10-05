import { inquiryDb } from "@/lib/inquiry/types";
import { missingOptionalSchema } from "@/lib/admin/optionalDatabase";
import { buildPageHeaders } from "@/data/page-headers";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import type { InboxKind } from "@/lib/inbox/model";

type Table = keyof Database["public"]["Tables"];
type Column<T extends Table> = keyof Database["public"]["Tables"][T]["Row"] &
  string;
export type AdminSearchKind =
  | "inquiry"
  | "page"
  | InboxKind
  | "service"
  | "project"
  | "blog"
  | "user"
  | "testimonial";

export interface AdminSearchResult {
  id: string;
  kind: AdminSearchKind;
  label: string;
  title: string;
  description: string;
  url: string;
}

interface SearchSource {
  table: Table;
  kind: AdminSearchKind;
  label: string;
  columns: readonly string[];
  search: readonly string[];
  title: readonly string[];
  description: readonly string[];
  route: string;
}

function source<T extends Table>(
  definition: Omit<
    SearchSource,
    "table" | "columns" | "search" | "title" | "description"
  > & {
    table: T;
    columns: readonly Column<T>[];
    search: readonly Column<T>[];
    title: readonly Column<T>[];
    description: readonly Column<T>[];
  },
): SearchSource {
  return definition;
}

const SOURCES: readonly SearchSource[] = [
  source({
    table: "services",
    kind: "service",
    label: "Service",
    columns: ["id", "name", "short_description"],
    search: ["name", "short_description"],
    title: ["name"],
    description: ["short_description"],
    route: "/admin/services/",
  }),
  source({
    table: "projects",
    kind: "project",
    label: "Project",
    columns: ["id", "title", "summary"],
    search: ["title", "summary"],
    title: ["title"],
    description: ["summary"],
    route: "/admin/projects/",
  }),
  source({
    table: "blog_posts",
    kind: "blog",
    label: "Blog Post",
    columns: ["id", "title", "summary"],
    search: ["title", "summary"],
    title: ["title"],
    description: ["summary"],
    route: "/admin/blog/",
  }),
  source({
    table: "contact_submissions",
    kind: "contact",
    label: "Contact",
    columns: ["id", "name", "email", "company", "message"],
    search: ["name", "email", "company", "message"],
    title: ["name", "email"],
    description: ["email", "company"],
    route: "/admin/inbox",
  }),
  source({
    table: "rfp_submissions",
    kind: "rfp",
    label: "RFP",
    columns: [
      "id",
      "project_name",
      "contact_name",
      "email",
      "company_name",
      "scope_of_work",
    ],
    search: [
      "project_name",
      "contact_name",
      "email",
      "company_name",
      "scope_of_work",
    ],
    title: ["project_name", "contact_name", "email"],
    description: ["contact_name", "email", "company_name"],
    route: "/admin/inbox",
  }),
  source({
    table: "quote_requests",
    kind: "quote",
    label: "Quote Request",
    columns: [
      "id",
      "name",
      "email",
      "company",
      "project_address",
      "additional_notes",
    ],
    search: ["name", "email", "company", "project_address", "additional_notes"],
    title: ["name", "email"],
    description: ["email", "company", "project_address"],
    route: "/admin/inbox",
  }),
  source({
    table: "resume_submissions",
    kind: "resume",
    label: "Resume",
    columns: ["id", "applicant_name", "email", "position_applied"],
    search: ["applicant_name", "email", "position_applied"],
    title: ["applicant_name", "email"],
    description: ["position_applied", "email"],
    route: "/admin/inbox",
  }),
  source({
    table: "prequalification_downloads",
    kind: "prequal",
    label: "Prequalification",
    columns: ["id", "contact_name", "email", "company_name", "message"],
    search: ["contact_name", "email", "company_name", "message"],
    title: ["contact_name", "company_name", "email"],
    description: ["email", "company_name"],
    route: "/admin/inbox",
  }),
  source({
    table: "newsletter_subscribers",
    kind: "newsletter",
    label: "Newsletter",
    columns: ["id", "email", "source"],
    search: ["email"],
    title: ["email"],
    description: ["source"],
    route: "/admin/inbox",
  }),
  source({
    table: "profiles",
    kind: "user",
    label: "User",
    columns: ["id", "full_name", "email"],
    search: ["full_name", "email"],
    title: ["full_name", "email"],
    description: ["email"],
    route: "/admin/users",
  }),
];

/** Quote PostgREST syntax and escape LIKE wildcards so user input stays a literal search. */
export function adminSearchFilter(
  columns: readonly string[],
  query: string,
): string {
  const literal = query.replace(/[\\%_]/g, "\\$&");
  const pattern = `%${literal}%`.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
  return columns.map((column) => `${column}.ilike."${pattern}"`).join(",");
}

function text(row: Record<string, unknown>, field: string): string {
  return typeof row[field] === "string" ? row[field].trim() : "";
}

function resultFor(
  definition: SearchSource,
  row: Record<string, unknown>,
): AdminSearchResult | null {
  if (typeof row.id !== "string" || !row.id) return null;
  const url =
    definition.route === "/admin/inbox"
      ? `${definition.route}?${new URLSearchParams({ tab: definition.kind, highlight: row.id })}`
      : definition.route.endsWith("/")
        ? definition.route + encodeURIComponent(row.id)
        : definition.route;
  return {
    id: row.id,
    kind: definition.kind,
    label: definition.label,
    title:
      definition.title.map((field) => text(row, field)).find(Boolean) ||
      definition.label,
    description: definition.description
      .map((field) => text(row, field))
      .filter(Boolean)
      .join(" · "),
    url,
  };
}

export async function searchAdmin(
  query: string,
  signal?: AbortSignal,
): Promise<{
  results: AdminSearchResult[];
  failedSources: string[];
}> {
  const normalized = query.trim().slice(0, 200);
  if (normalized.length < 2) return { results: [], failedSources: [] };
  if (signal?.aborted) throw new DOMException("Search cancelled", "AbortError");

  const responses = await Promise.all(
    SOURCES.map(async (definition) => {
      try {
        let request = supabase
          .from(definition.table)
          .select(definition.columns.join(","))
          .or(adminSearchFilter(definition.search, normalized))
          .order("id")
          .limit(5);
        if (signal) request = request.abortSignal(signal);
        const { data, error } = await request;
        if (signal?.aborted)
          throw new DOMException("Search cancelled", "AbortError");
        if (error) throw error;
        const rows = (data || []) as unknown as Record<string, unknown>[];
        return {
          results: rows
            .map((row) => resultFor(definition, row))
            .filter((result): result is AdminSearchResult => result !== null),
          failed: "",
        };
      } catch {
        if (signal?.aborted)
          throw new DOMException("Search cancelled", "AbortError");
        return { results: [], failed: definition.label };
      }
    }),
  );
  let inquiry = inquiryDb
    .from("inquiries")
    .select("id,reference_code,contact_name,company,email,project_name")
    .or(
      adminSearchFilter(
        ["reference_code", "contact_name", "company", "email", "project_name"],
        normalized,
      ),
    )
    .order("created_at", { ascending: false })
    .limit(5);
  if (signal) inquiry = inquiry.abortSignal(signal);
  const newRequests = await inquiry;
  const newResults: AdminSearchResult[] = (newRequests.data || []).map(
    (row) => ({
      id: row.id,
      kind: "inquiry",
      label: "Inquiry",
      title: row.project_name || row.contact_name,
      description: `${row.reference_code} · ${row.company || row.email}`,
      url: `/admin/inbox?tab=leads&source=inquiry&highlight=${encodeURIComponent(row.id)}`,
    }),
  );
  const pages = buildPageHeaders({
    services: [],
    projects: [],
    articles: [],
    slides: [],
    failed: [],
  })
    .filter((row) =>
      `${row.title} ${row.path}`
        .toLowerCase()
        .includes(normalized.toLowerCase()),
    )
    .slice(0, 5)
    .map((row) => ({
      id: row.path,
      kind: "page" as const,
      label: "Page",
      title: row.title,
      description: row.path,
      url: `/admin/pages?${new URLSearchParams({ page: row.path })}`,
    }));
  if (newRequests.error && !missingOptionalSchema(newRequests.error))
    responses.push({ results: [], failed: "New inquiries" });
  return {
    results: [
      ...newResults,
      ...pages,
      ...responses.flatMap((response) => response.results),
    ],
    failedSources: responses.map((response) => response.failed).filter(Boolean),
  };
}
