import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { HelmetProvider } from "react-helmet-async";
import {
  MemoryRouter,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import BlogPost from "./BlogPost";
import ProjectDetail from "./ProjectDetail";
import { LegacyArticleRedirect } from "@/components/blog/LegacyArticleRedirect";

const mock = vi.hoisted(() => ({
  read: vi.fn(),
  preview: vi.fn(),
  filter: vi.fn(),
}));
vi.mock("@/integrations/supabase/client", () => ({
  supabase: {
    rpc: mock.preview,
    from: (table: string) => {
      let slug: string | undefined;
      const result = () => mock.read(table, slug);
      const query = {
        select: () => query,
        eq: (field: string, value: string) => {
          mock.filter(table, field, value);
          if (field === "slug") slug = value;
          return query;
        },
        maybeSingle: result,
        order: result,
        then: (resolve: (value: unknown) => unknown) =>
          Promise.resolve(result()).then(resolve),
      };
      return query;
    },
  },
}));
vi.mock("@/components/Navigation", () => ({ default: () => null }));
vi.mock("@/components/Footer", () => ({ default: () => null }));
vi.mock("@/components/ProjectSidebar", () => ({ ProjectSidebar: () => null }));
vi.mock("@/design-system/components/RelatedLinksGrid", () => ({
  RelatedLinksGrid: () => null,
}));
vi.mock("@/components/shared/PageHero", () => ({
  PageHero: ({ title }: { title: string }) => <h1>{title}</h1>,
}));
vi.mock("@/hooks/useScrollReveal", () => ({
  useScrollReveal: () => ({ ref: null, isVisible: true, skipAnimation: true }),
}));

vi.mock("@/utils/relatedLinks", () => ({
  getRelatedForBlogPost: async () => [],
  getRelatedForProject: async () => [],
}));

function Controls({ destination }: { destination: string }) {
  const navigate = useNavigate();
  const location = useLocation();
  return (
    <>
      <output data-testid="route">
        {location.pathname}
        {location.search}
        {location.hash}
      </output>
      <button onClick={() => navigate(destination)}>Next route</button>
    </>
  );
}
function mount(path: string, destination = "/blog/missing") {
  render(
    <HelmetProvider>
      <MemoryRouter initialEntries={[path]}>
        <Controls destination={destination} />
        <Routes>
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="/projects/:slug" element={<ProjectDetail />} />
          <Route path="/case-study/:slug" element={<LegacyArticleRedirect />} />
        </Routes>
      </MemoryRouter>
    </HelmetProvider>,
  );
}
beforeEach(() => {
  vi.clearAllMocks();
  mock.read.mockImplementation(async (table: string) => ({
    data: table === "blog_posts" || table === "projects" ? null : [],
    error: null,
  }));
});
afterEach(() => {
  cleanup();
  document.head.querySelectorAll("[data-rh]").forEach((node) => node.remove());
});

describe("dynamic content indexing", () => {
  it.each([
    ["blog", "Article"],
    ["projects", "Project"],
  ])(
    "keeps missing %s at its requested URL with noindex",
    async (section, kind) => {
      mount(`/${section}/missing`);
      await screen.findByRole("heading", { name: `${kind} Not Found` });
      await waitFor(() =>
        expect(document.querySelector('meta[name="robots"]')).toHaveAttribute(
          "content",
          "noindex, nofollow",
        ),
      );
      expect(screen.getByTestId("route")).toHaveTextContent(
        `/${section}/missing`,
      );
      expect(mock.filter).toHaveBeenCalledWith(
        section === "blog" ? "blog_posts" : "projects",
        "publish_state",
        "published",
      );
    },
  );
  it.each([
    ["blog", "Article"],
    ["projects", "Project"],
  ])(
    "distinguishes a failed %s read from a missing record",
    async (section, kind) => {
      mock.read.mockResolvedValue({
        data: null,
        error: { message: "Fixture network failure" },
      });
      mount(`/${section}/existing`);
      await screen.findByRole("heading", { name: `${kind} Unavailable` });
      expect(
        screen.getByRole("button", { name: "Try Again" }),
      ).toBeInTheDocument();
      expect(screen.getByTestId("route")).toHaveTextContent(
        `/${section}/existing`,
      );
    },
  );
  it.each([
    ["blog", "Article"],
    ["projects", "Project"],
  ])(
    "ignores a late %s response after the slug changes",
    async (section, kind) => {
      let resolve: (value: unknown) => void;
      const oldResponse = new Promise((done) => {
        resolve = done;
      });
      mock.read.mockImplementation((table: string, slug?: string) =>
        slug === "old"
          ? oldResponse
          : Promise.resolve({ data: null, error: null }),
      );
      mount(`/${section}/old`, `/${section}/missing`);
      fireEvent.click(screen.getByRole("button", { name: "Next route" }));
      await screen.findByRole("heading", { name: `${kind} Not Found` });
      await act(async () =>
        resolve({
          data: {
            id: "fixture",
            slug: "old",
            title: "Stale title",
            created_at: "2026-10-01",
          },
          error: null,
        }),
      );
      expect(
        screen.getByRole("heading", { name: `${kind} Not Found` }),
      ).toBeInTheDocument();
      expect(screen.queryByText("Stale title")).not.toBeInTheDocument();
    },
  );
  it("excludes token previews from indexing and canonical metadata", async () => {
    mock.preview.mockResolvedValue({
      data: [
        {
          slug: "draft",
          title: "Draft article",
          content: "Fixture content",
          created_at: "2026-10-01",
          category: "Fixture",
        },
      ],
      error: null,
    });
    mount("/blog/draft?preview=true&token=fixture-token");
    await screen.findByRole("heading", { name: "Draft article" });
    await waitFor(() =>
      expect(document.querySelector('meta[name="robots"]')).toHaveAttribute(
        "content",
        "noindex, nofollow",
      ),
    );
    expect(document.querySelector('link[rel="canonical"]')).toHaveAttribute(
      "href",
      "https://www.ascentgroupconstruction.com/blog/draft",
    );
    expect(
      [...document.querySelectorAll('script[type="application/ld+json"]')]
        .map((node) => node.textContent)
        .join(),
    ).not.toContain("fixture-token");
    expect(mock.read).not.toHaveBeenCalled();
  });
  it("redirects a legacy article link while retaining its preview parameters and anchor", async () => {
    mount("/case-study/example?preview=true&token=fixture#section");
    await waitFor(() =>
      expect(screen.getByTestId("route")).toHaveTextContent(
        "/blog/example?preview=true&token=fixture#section",
      ),
    );
  });
});

vi.mock("@/hooks/usePublicSettings", () => ({
  usePublicSettings: () => ({ data: null }),
}));

describe("editable case study content", () => {
  it("renders legacy case_study sections with rich formatting and sanitizes stored HTML", async () => {
    mock.preview.mockResolvedValue({
      data: [
        {
          slug: "draft-case",
          title: "Fixture case",
          content: "Body",
          created_at: "2026-10-01",
          category: "Fixture",
          content_type: "case_study",
          challenge:
            '<h3>Existing challenge</h3><p onclick="alert(1)">Challenge detail</p>',
          solution: "First line\nSecond line",
          results: "Fixture result",
        },
      ],
      error: null,
    });
    mount("/blog/draft-case?preview=true&token=fixture");
    expect(
      await screen.findByRole("heading", { name: "Existing challenge" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Solution" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Fixture result")).toBeInTheDocument();
    expect(document.querySelector("[onclick]")).toBeNull();
  });
});
