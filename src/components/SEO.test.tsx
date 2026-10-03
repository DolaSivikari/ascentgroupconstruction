import { cleanup, render, waitFor } from "@testing-library/react";
import { act } from "react";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { MemoryRouter } from "react-router-dom";
import { afterEach, describe, expect, it, vi } from "vitest";
import SEO from "./SEO";
import Footer from "./Footer";
const mock = vi.hoisted(() => ({
  result: Promise.resolve({ data: null, error: null }),
}));
vi.mock("@/hooks/useAggregateRating", () => ({
  useAggregateRating: () => ({
    aggregateRating: { reviewCount: "0" },
    hasRatings: false,
  }),
}));
vi.mock("@/integrations/supabase/client", () => ({
  supabase: {
    from: () => {
      const query = {
        select: () => query,
        eq: () => query,
        single: () => mock.result,
        order: () => mock.result,
      };
      return query;
    },
  },
}));
afterEach(() => {
  cleanup();
  document.head.querySelectorAll("[data-rh]").forEach((node) => node.remove());
});
describe("head ownership", () => {
  it("keeps page metadata through both loading and loaded footer states", async () => {
    let resolve: (value: { data: null; error: null }) => void;
    mock.result = new Promise((done) => {
      resolve = done;
    });
    render(
      <HelmetProvider>
        <MemoryRouter>
          <SEO
            title="Services"
            description="Specific service page description"
            canonical="https://www.ascentgroupconstruction.com/services"
          />
          <Footer />
        </MemoryRouter>
      </HelmetProvider>,
    );
    await waitFor(() =>
      expect(document.title).toBe("Services | Ascent Group Construction"),
    );
    await act(async () => {
      resolve({ data: null, error: null });
    });
    await waitFor(() =>
      expect(
        document.querySelector('meta[name="description"]'),
      ).toHaveAttribute("content", "Specific service page description"),
    );
    expect(document.title).toBe("Services | Ascent Group Construction");
    expect(document.querySelectorAll('link[rel="canonical"]')).toHaveLength(1);
    expect(document.querySelector('link[rel="canonical"]')).toHaveAttribute(
      "href",
      "https://www.ascentgroupconstruction.com/services",
    );
  });
  it("replaces the managed HTML robots tag with login noindex", async () => {
    const fallback = document.createElement("meta");
    fallback.name = "robots";
    fallback.content = "index, follow";
    fallback.setAttribute("data-rh", "true");
    document.head.appendChild(fallback);
    render(
      <HelmetProvider>
        <Helmet>
          <meta name="robots" content="noindex, nofollow" />
        </Helmet>
      </HelmetProvider>,
    );
    await waitFor(() =>
      expect(document.querySelector('meta[name="robots"]')).toHaveAttribute(
        "content",
        "noindex, nofollow",
      ),
    );
    expect(document.querySelectorAll('meta[name="robots"]')).toHaveLength(1);
  });
  it("does not append a second company name to a branded title", async () => {
    render(
      <HelmetProvider>
        <SEO title="Services | Ascent Group Construction" />
      </HelmetProvider>,
    );
    await waitFor(() =>
      expect(document.title).toBe("Services | Ascent Group Construction"),
    );
  });
});
