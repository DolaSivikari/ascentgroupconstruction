import { beforeEach, describe, expect, it, vi } from "vitest";
import { adminSearchFilter, searchAdmin } from "./adminSearch";

const mock = vi.hoisted(() => ({ from: vi.fn() }));
vi.mock("@/integrations/supabase/client", () => ({ supabase: mock }));

const inquiries = [
  ["contact_submissions", "contact", { name: "Fixture Contact" }],
  ["rfp_submissions", "rfp", { project_name: "Fixture Tower", contact_name: "Fixture Client" }],
  ["quote_requests", "quote", { name: "Fixture Estimator" }],
  ["resume_submissions", "resume", { applicant_name: "Fixture Applicant", position_applied: "Site Supervisor" }],
  ["prequalification_downloads", "prequal", { contact_name: "Fixture Contractor", company_name: "Fixture GC" }],
  ["newsletter_subscribers", "newsletter", {}],
] as const;

function requests(rows: Record<string, Record<string, unknown>[]> = {}, errors: string[] = []) {
  const calls: Record<string, { selected: string; filter: string; signal?: AbortSignal; limit?: number }> = {};
  mock.from.mockImplementation((table: string) => {
    calls[table] = { selected: "", filter: "" };
    const request = {
      select: (value: string) => { calls[table].selected = value; return request; },
      or: (value: string) => { calls[table].filter = value; return request; },
      order: () => request,
      limit: (value: number) => { calls[table].limit = value; return request; },
      abortSignal: (value: AbortSignal) => { calls[table].signal = value; return request; },
      then: (resolve: (value: unknown) => void) => Promise.resolve({
        data: errors.includes(table) ? null : rows[table] || [],
        error: errors.includes(table) ? { message: "Source unavailable" } : null,
      }).then(resolve),
    };
    return request;
  });
  return calls;
}

beforeEach(() => vi.clearAllMocks());

describe("admin search", () => {
  it("finds each inquiry type and opens its exact inbox tab and record", async () => {
    const id = "00000000-0000-4000-8000-000000000001";
    const fixtures = Object.fromEntries(inquiries.map(([table, , fields]) => [table, [{ id, email: "fixture@example.test", ...fields }]]));
    const calls = requests(fixtures);
    const result = await searchAdmin("Fixture");
    expect(result.failedSources).toEqual([]);
    expect(result.results).toHaveLength(6);
    for (const [, kind] of inquiries) {
      expect(result.results.find((row) => row.kind === kind)?.url).toBe(`/admin/inbox?tab=${kind}&highlight=${id}`);
    }
    expect(result.results.find((row) => row.kind === "resume")).toMatchObject({ title: "Fixture Applicant", description: "Site Supervisor · fixture@example.test" });
    expect(calls.resume_submissions.selected).toContain("applicant_name");
    expect(calls.resume_submissions.selected).not.toContain("full_name");
    expect(Object.values(calls).every((call) => call.limit === 5)).toBe(true);
  });

  it("opens the real editor routes and keeps nullable titles usable", async () => {
    requests({
      services: [{ id: "service", name: "Masonry", short_description: null }],
      projects: [{ id: "project", title: "Restoration" }],
      blog_posts: [{ id: "post", title: "Guide" }],
      profiles: [{ id: "user", full_name: null, email: "staff@example.test" }],
      testimonials: [{ id: "testimonial", author_name: "Fixture", company_name: null }],
    });
    const { results } = await searchAdmin("Fixture");
    expect(results.map((row) => row.url)).toEqual(["/admin/services/service", "/admin/projects/project", "/admin/blog/post", "/admin/users", "/admin/testimonials"]);
    expect(results.find((row) => row.kind === "user")?.title).toBe("staff@example.test");
  });

  it("retains partial results and explicitly reports rejected source reads", async () => {
    requests({ services: [{ id: "service", name: "Fixture service" }] }, ["rfp_submissions", "resume_submissions"]);
    const result = await searchAdmin("Fixture");
    expect(result.results).toHaveLength(1);
    expect(result.failedSources).toEqual(["RFP", "Resume"]);
  });

  it("keeps commas, parentheses, quotes and LIKE wildcards inside a literal filter", () => {
    expect(adminSearchFilter(["name", "email"], 'Doe, (O"Connor) 100%_')).toBe('name.ilike."%Doe, (O\\"Connor) 100\\\\%\\\\_%",email.ilike."%Doe, (O\\"Connor) 100\\\\%\\\\_%"');
    expect(adminSearchFilter(["name"], "path\\file")).toBe('name.ilike."%path\\\\\\\\file%"');
  });

  it("avoids empty searches and cancels a search without turning cancellation into failures", async () => {
    requests();
    expect(await searchAdmin(" a ")).toEqual({ results: [], failedSources: [] });
    expect(mock.from).not.toHaveBeenCalled();
    const controller = new AbortController();
    controller.abort();
    await expect(searchAdmin("Fixture", controller.signal)).rejects.toMatchObject({ name: "AbortError" });
    expect(mock.from).not.toHaveBeenCalled();
  });

  it("passes the same cancellation signal to every authorized query", async () => {
    const calls = requests();
    const controller = new AbortController();
    await searchAdmin("Fixture", controller.signal);
    expect(Object.values(calls)).toHaveLength(11);
    expect(Object.values(calls).every((call) => call.signal === controller.signal)).toBe(true);
  });
});
