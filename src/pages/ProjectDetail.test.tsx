import { cleanup, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import ProjectDetail from "./ProjectDetail";
const mock = vi.hoisted(() => ({
  project: {} as Record<string, unknown>,
  preview: vi.fn(),
  publicRead: vi.fn(),
  seo: vi.fn(),
  previewError: false,
}));
vi.mock("@/components/Navigation", () => ({ default: () => null }));
vi.mock("@/components/Footer", () => ({ default: () => null }));
vi.mock("@/components/SEO", () => ({
  default: (props: unknown) => {
    mock.seo(props);
    return null;
  },
}));
vi.mock("@/utils/relatedLinks", () => ({
  getRelatedForProject: async () => [],
}));
vi.mock("@/integrations/supabase/client", () => ({
  supabase: {
    rpc: async (name: string, args: unknown) => {
      mock.preview(name, args);
      return mock.previewError
        ? { data: null, error: { message: "Invalid token" } }
        : { data: [mock.project], error: null };
    },
    from: (table: string) => {
      const query = {
        select: () => query,
        eq: () => query,
        order: () => query,
        maybeSingle: async () => {
          mock.publicRead();
          return { data: mock.project, error: null };
        },
        then: (resolve: (result: unknown) => unknown) =>
          Promise.resolve({
            data: table === "project_images" ? [] : [],
            error: null,
          }).then(resolve),
      };
      return query;
    },
  },
}));
beforeEach(() => {
  vi.stubGlobal(
    "IntersectionObserver",
    class {
      observe() {}
      unobserve() {}
      disconnect() {}
    },
  );
  vi.clearAllMocks();
  mock.previewError = false;
  mock.project = {
    id: "project",
    slug: "fixture-project",
    title: "Fixture project",
    summary: "Fixture summary",
    description: "Fixture description",
    featured_image: null,
    trades_coordinated: null,
    peak_workforce: null,
    on_time_completion: null,
    on_budget: null,
    safety_incidents: null,
  };
});
afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});
const open = (query = "") =>
  render(
    <HelmetProvider>
      <MemoryRouter initialEntries={[`/projects/fixture-project${query}`]}>
        <Routes>
          <Route path="/projects/:slug" element={<ProjectDetail />} />
        </Routes>
      </MemoryRouter>
    </HelmetProvider>,
  );
describe("project visitor and preview contract", () => {
  it("hides unknown performance values instead of displaying false No badges", async () => {
    open();
    await screen.findByText("Fixture summary");
    expect(screen.queryByRole("heading", { name: "Performance" })).toBeNull();
    expect(screen.queryByText("No")).toBeNull();
  });
  it("retains explicitly saved zero and false values", async () => {
    mock.project = {
      ...mock.project,
      on_time_completion: false,
      safety_incidents: 0,
      trades_coordinated: 0,
    };
    open();
    expect(
      await screen.findByRole("heading", { name: "Performance" }),
    ).toBeInTheDocument();
    expect(screen.getByText("No")).toBeInTheDocument();
    expect(screen.getByText("Trades Coordinated")).toBeInTheDocument();
    expect(screen.getByText("Safety Incidents")).toBeInTheDocument();
  });
  it("loads a draft only through the existing validating preview RPC", async () => {
    open("?preview=true&token=fixture-token");
    await screen.findByText("Fixture summary");
    expect(mock.preview).toHaveBeenCalledWith("get_preview_project", {
      p_slug: "fixture-project",
      p_token: "fixture-token",
    });
    expect(mock.publicRead).not.toHaveBeenCalled();
    expect(mock.seo).toHaveBeenCalledWith(
      expect.objectContaining({ noindex: true }),
    );
  });
  it("does not bypass a rejected preview token by performing a public read", async () => {
    mock.previewError = true;
    open("?preview=true&token=rejected");
    await waitFor(() =>
      expect(screen.getByText("Project Unavailable")).toBeInTheDocument(),
    );
    expect(mock.publicRead).not.toHaveBeenCalled();
  });
});
