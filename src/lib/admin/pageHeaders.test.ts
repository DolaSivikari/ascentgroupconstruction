import { beforeEach, describe, expect, it, vi } from "vitest";
import { loadHeaderMetadata } from "./pageHeaders";

const mock = vi.hoisted(() => ({ from: vi.fn() }));
vi.mock("@/integrations/supabase/client", () => ({ supabase: { from: mock.from } }));
interface Request { table: string; fields: string; filters: Array<[string, unknown]>; order?: string }
interface Result { data: unknown; error: Error | null }
interface Query extends PromiseLike<Result> {
  select: (fields: string) => Query;
  eq: (field: string, value: unknown) => Query;
  order: (field: string) => Query;
}
function fakeSources(answer: (request: Request) => Result | Promise<Result>) {
  const requests: Request[] = [];
  mock.from.mockImplementation((table: string) => {
    const request: Request = { table, fields: "", filters: [] };
    requests.push(request);
    const query: Query = {
      select: fields => { request.fields = fields; return query; },
      eq: (field, value) => { request.filters.push([field, value]); return query; },
      order: field => { request.order = field; return query; },
      then: (fulfilled, rejected) => Promise.resolve().then(() => answer(request)).then(fulfilled, rejected),
    };
    return query;
  });
  return requests;
}
const fixtures: Record<string, unknown[]> = {
  services: [{ id: "service", slug: "building-envelope-solutions", name: "Envelope", featured_image: "/media/envelope.jpg", category: "Building Envelope" }],
  projects: [{ id: "project", slug: "published-project", title: "Published project", featured_image: "/media/project.jpg" }],
  blog_posts: [{ id: "article", slug: "published-article", title: "Published article", featured_image: null }],
  hero_slides: [{ poster_url: "/media/slide.webp" }],
};

beforeEach(() => { vi.clearAllMocks(); });
describe("page-header metadata loading", () => {
  it("loads only published page images and active homepage slides, without fetching inquiry or article body data", async () => {
    const requests = fakeSources(request => ({ data: fixtures[request.table], error: null }));
    const metadata = await loadHeaderMetadata();
    expect(metadata).toEqual({ services: fixtures.services, projects: fixtures.projects, articles: fixtures.blog_posts, slides: fixtures.hero_slides, failed: [] });
    expect(requests).toEqual([
      { table: "services", fields: "id,slug,name,featured_image,category", filters: [["publish_state", "published"]] },
      { table: "projects", fields: "id,slug,title,featured_image", filters: [["publish_state", "published"]] },
      { table: "blog_posts", fields: "id,slug,title,featured_image", filters: [["publish_state", "published"]] },
      { table: "hero_slides", fields: "poster_url", filters: [["is_active", true]], order: "display_order" },
    ]);
  });

  it("retains successful metadata when one source returns an error and another rejects", async () => {
    fakeSources(request => {
      if (request.table === "projects") return { data: null, error: new Error("Forbidden") };
      if (request.table === "hero_slides") throw new Error("Offline");
      return { data: fixtures[request.table], error: null };
    });
    expect(await loadHeaderMetadata()).toEqual({ services: fixtures.services, projects: [], articles: fixtures.blog_posts, slides: [], failed: ["Published projects", "Homepage slides"] });
  });

  it.each([null, { id: "wrong response shape" }])("flags malformed source data %s while retaining the other sources", async malformed => {
    fakeSources(request => ({ data: request.table === "blog_posts" ? malformed : fixtures[request.table], error: null }));
    expect(await loadHeaderMetadata()).toEqual({ services: fixtures.services, projects: fixtures.projects, articles: [], slides: fixtures.hero_slides, failed: ["Published articles"] });
  });

  it("treats a successful empty result as legitimate, rather than an unavailable source", async () => {
    fakeSources(() => ({ data: [], error: null }));
    expect(await loadHeaderMetadata()).toEqual({ services: [], projects: [], articles: [], slides: [], failed: [] });
  });

  it("does not expose rows from a source that returned an error alongside data", async () => {
    fakeSources(request => ({ data: fixtures[request.table], error: request.table === "services" ? new Error("Denied") : null }));
    const result = await loadHeaderMetadata();
    expect(result.services).toEqual([]);
    expect(result.failed).toEqual(["Published services"]);
    expect(result.projects).toEqual(fixtures.projects);
  });
});
