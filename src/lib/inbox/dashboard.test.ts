import { beforeEach, describe, expect, it, vi } from "vitest";
import { activityDestination, loadDashboardStats, loadHomepageContentStatus, loadRecentInboxActivity } from "./dashboard";
import { inboxName, normalizeInboxItem, type InboxKind } from "./model";

const mock = vi.hoisted(() => ({ from: vi.fn() }));
vi.mock("@/integrations/supabase/client", () => ({ supabase: { from: mock.from } }));

interface Request {
  table: string;
  fields: string;
  options?: { count?: string; head?: boolean };
  filters: Array<[string, string, unknown]>;
  orders: Array<[string, { ascending?: boolean } | undefined]>;
  limit?: number;
}
interface Result {
  data?: Array<Record<string, unknown>> | null;
  count?: number | null;
  error: Error | null;
}
interface Query extends PromiseLike<Result> {
  select: (fields: string, options?: Request["options"]) => Query;
  eq: (field: string, value: unknown) => Query;
  neq: (field: string, value: unknown) => Query;
  order: (field: string, options?: { ascending?: boolean }) => Query;
  limit: (limit: number) => Promise<Result>;
}
function fakeQueries(answer: (request: Request) => Result | Promise<Result>) {
  const requests: Request[] = [];
  mock.from.mockImplementation((table: string) => {
    const request: Request = { table, fields: "", filters: [], orders: [] };
    requests.push(request);
    const query: Query = {
      select: (fields, options) => { request.fields = fields; request.options = options; return query; },
      eq: (field, value) => { request.filters.push(["eq", field, value]); return query; },
      neq: (field, value) => { request.filters.push(["neq", field, value]); return query; },
      order: (field, options) => { request.orders.push([field, options]); return query; },
      limit: async limit => { request.limit = limit; return answer(request); },
      then: (fulfilled, rejected) => Promise.resolve().then(() => answer(request)).then(fulfilled, rejected),
    };
    return query;
  });
  return requests;
}

beforeEach(() => { vi.clearAllMocks(); });

describe("dashboard totals", () => {
  it("loads all five inquiry totals as well as publication totals", async () => {
    const counts: Record<string, number> = {
      "projects:published": 10, "projects:draft": 11, services: 12,
      "blog_posts:published": 13, "blog_posts:unpublished": 14,
      contact_submissions: 15, prequalification_downloads: 16,
      rfp_submissions: 17, quote_requests: 18, resume_submissions: 19,
    };
    const requests = fakeQueries(request => {
      const filter = request.filters[0];
      const key = filter ? `${request.table}:${filter[0] === "neq" ? "unpublished" : filter[2]}` : request.table;
      return { count: counts[key], error: null };
    });
    expect(await loadDashboardStats()).toEqual({
      projectsPublished: 10, projectsDraft: 11, services: 12,
      blogPublished: 13, blogDraft: 14, contactTotal: 15, prequalTotal: 16,
      rfpTotal: 17, quoteTotal: 18, resumeTotal: 19,
    });
    expect(requests).toHaveLength(10);
    for (const request of requests) {
      expect(request.fields).toBe("id");
      expect(request.options).toEqual({ count: "exact", head: true });
    }
    expect(requests.filter(request => request.table.endsWith("submissions") || request.table === "quote_requests" || request.table === "prequalification_downloads").map(request => request.table).sort()).toEqual([
      "contact_submissions", "prequalification_downloads", "quote_requests", "resume_submissions", "rfp_submissions",
    ]);
  });

  it.each(["error", "missing count"])("reports %s instead of presenting an unavailable inquiry total as zero", async failure => {
    fakeQueries(request => request.table === "rfp_submissions"
      ? { count: null, error: failure === "error" ? new Error("Forbidden") : null }
      : { count: 3, error: null });
    await expect(loadDashboardStats()).rejects.toThrow("Dashboard counts unavailable");
  });

  it("preserves real zero totals", async () => {
    fakeQueries(() => ({ count: 0, error: null }));
    expect(Object.values(await loadDashboardStats())).toEqual(Array(10).fill(0));
  });

  it("counts only active homepage content and surfaces a missing count", async () => {
    const requests = fakeQueries(() => ({ count: 2, error: null }));
    expect(await loadHomepageContentStatus()).toEqual({ heroSlides: 2, whyChooseUs: 2, testimonials: 2, valuePillars: 2 });
    expect(requests.map(request => request.table)).toEqual(["hero_slides", "why_choose_us_items", "testimonials", "value_pillars"]);
    for (const request of requests) {
      expect(request.filters).toEqual(request.table === "testimonials"
        ? [["eq", "publish_state", "published"], ["eq", "is_featured", true]]
        : [["eq", "is_active", true]]);
    }
    fakeQueries(request => ({ count: request.table === "testimonials" ? null : 2, error: null }));
    await expect(loadHomepageContentStatus()).rejects.toThrow("Homepage status unavailable");
  });
});

describe("recent activity", () => {
  const fixtures: Record<string, Array<Record<string, unknown>>> = {
    contact_submissions: [{ id: "contact", name: "Contact Owner", email: "contact@example.test", created_at: "2026-10-02T10:00:00Z", status: "new", message: "Contact message" }],
    rfp_submissions: [{ id: "rfp", contact_name: "Bid Contact", email: "bid@example.test", created_at: "2026-10-02T12:00:00Z", status: "new", scope_of_work: "Bid scope", attachment_urls: ["drawings.pdf"] }],
    quote_requests: [{ id: "estimate", name: "Estimate Owner", email: "estimate@example.test", created_at: "2026-10-02T11:00:00Z", source: "estimator", status: "new", additional_notes: "Estimate scope" }],
    prequalification_downloads: [{ id: "prequal", contact_name: "Prequal Contact", company_name: "Trade Company", email: "prequal@example.test", downloaded_at: "2026-10-02T14:00:00Z", created_at: "2099-01-01T00:00:00Z", status: "new" }],
    resume_submissions: [{ id: "resume", applicant_name: "Applicant Name", email: "resume@example.test", created_at: "2026-10-02T13:00:00Z", cover_letter: "Cover letter", status: "new" }],
  };

  it("reads complete activity from all five sources and sorts by the correct received dates", async () => {
    const requests = fakeQueries(request => ({ data: fixtures[request.table], error: null }));
    const result = await loadRecentInboxActivity();
    expect(result.failed).toEqual([]);
    expect(requests.map(request => request.table).sort()).toEqual(Object.keys(fixtures).sort());
    expect(result.items.map(item => item.id)).toEqual(["prequal", "resume", "rfp", "estimate", "contact"]);
    expect(result.items.map(inboxName)).toEqual(["Prequal Contact", "Applicant Name", "Bid Contact", "Estimate Owner", "Contact Owner"]);
    expect(result.items.find(item => item.id === "rfp")?.attachment_urls).toEqual(["drawings.pdf"]);
    expect(result.items.find(item => item.id === "resume")?.cover_letter).toBe("Cover letter");
    expect(result.items.find(item => item.id === "estimate")?.source).toBe("estimator");
    for (const request of requests) {
      expect(request.fields).toBe("*");
      expect(request.limit).toBe(5);
      expect(request.orders).toEqual([[request.table === "prequalification_downloads" ? "downloaded_at" : "created_at", { ascending: false, nullsFirst: false }], ["id", undefined]]);
    }
  });

  it("keeps healthy activity when one source fails and another rejects", async () => {
    fakeQueries(request => {
      if (request.table === "rfp_submissions") return { data: null, error: new Error("Forbidden") };
      if (request.table === "resume_submissions") throw new Error("Offline");
      return { data: fixtures[request.table], error: null };
    });
    const result = await loadRecentInboxActivity();
    expect(result.failed).toEqual(["RFP", "Resume"]);
    expect(result.items.map(item => item.id)).toEqual(["prequal", "estimate", "contact"]);
  });

  it("retains healthy tables if another source has a malformed record", async () => {
    fakeQueries(request => ({ data: request.table === "quote_requests" ? [{ id: "invalid", email: null }] : fixtures[request.table], error: null }));
    const result = await loadRecentInboxActivity();
    expect(result.failed).toEqual(["Quote"]);
    expect(result.items.map(item => item.id)).toEqual(["prequal", "resume", "rfp", "contact"]);
  });

  it("limits the combined feed to the five most recent records across tables", async () => {
    fakeQueries(request => ({
      data: request.table === "quote_requests" ? Array.from({ length: 5 }, (_, index) => ({
        id: `estimate-${index}`, name: "Owner", email: "owner@example.test", created_at: `2026-10-02T15:0${index}:00Z`, source: "estimator",
      })) : fixtures[request.table],
      error: null,
    }));
    const result = await loadRecentInboxActivity();
    expect(result.items.map(item => item.id)).toEqual(["estimate-4", "estimate-3", "estimate-2", "estimate-1", "estimate-0"]);
  });

  it("sorts missing and invalid received dates behind valid activity", async () => {
    fakeQueries(request => ({ data: request.table === "contact_submissions" ? [
      { id: "invalid-date", email: "owner@example.test", created_at: "not-a-date" },
      { id: "missing-date", email: "owner@example.test", created_at: null },
    ] : fixtures[request.table], error: null }));
    const result = await loadRecentInboxActivity();
    expect(result.items.slice(0, 4).map(item => item.id)).toEqual(["prequal", "resume", "rfp", "estimate"]);
    expect(["invalid-date", "missing-date"]).toContain(result.items[4].id);
  });
});

describe("activity navigation", () => {
  it.each(["rfp", "contact", "resume", "prequal", "quote"] as InboxKind[])("opens the %s tab with the exact record highlighted", kind => {
    const item = normalizeInboxItem(kind, {
      id: "6bb8eb6a-386c-4d88-aa26-b41b9dcb02a4", email: "owner@example.test", source: kind === "quote" ? "estimator" : undefined,
    });
    const destination = new URL(activityDestination(item), "https://site.example");
    expect(destination.pathname).toBe("/admin/inbox");
    expect(destination.searchParams.get("tab")).toBe(kind === "resume" ? "resume" : "leads");
    if (kind !== "resume") expect(destination.searchParams.get("source")).toBe(kind);
    expect(destination.searchParams.get("highlight")).toBe(item.id);
  });

  it("encodes record identifiers rather than allowing them to change the selected tab", () => {
    const item = normalizeInboxItem("quote", { id: "lead&tab=resume", email: "owner@example.test" });
    const params = new URL(activityDestination(item), "https://site.example").searchParams;
    expect(params.get("tab")).toBe("leads");
    expect(params.get("source")).toBe("quote");
    expect(params.get("highlight")).toBe("lead&tab=resume");
  });
});
