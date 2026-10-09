import { cleanup, render, waitFor } from "@testing-library/react";
import { act } from "react";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { MemoryRouter } from "react-router-dom";
import { afterEach, describe, expect, it, vi } from "vitest";
import SEO from "./SEO";
import Footer from "./Footer";
const mock = vi.hoisted(() => ({
  result: Promise.resolve({ data: null, error: null }),
  site: null as null | {
    meta_title?: string;
    meta_description?: string;
    social_links?: Record<string, string>;
  },
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
  mock.site = null;
  cleanup();
  document.head.querySelectorAll("[data-rh]").forEach((node) => node.remove());
});
describe("head ownership", () => {
  it("handles a nullable description from a content record", async () => {
    render(
      <HelmetProvider>
        <MemoryRouter>
          <SEO title="Article" description={null} />
        </MemoryRouter>
      </HelmetProvider>,
    );
    await waitFor(() => expect(document.title).toContain("Article"));
    expect(
      document
        .querySelector('meta[name="description"]')
        ?.getAttribute("content"),
    ).toContain("Self-performing specialty contractor");
  });
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
        <MemoryRouter>
          <Helmet>
            <meta name="robots" content="noindex, nofollow" />
          </Helmet>
        </MemoryRouter>
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
        <MemoryRouter>
          <SEO title="Services | Ascent Group Construction" />
        </MemoryRouter>
      </HelmetProvider>,
    );
    await waitFor(() =>
      expect(document.title).toBe("Services | Ascent Group Construction"),
    );
  });
  it("preserves a short-brand title and complete social title with an absolute image", async () => {
    const title =
      "Building Envelope Contractor in Richmond Hill | Ascent Group";
    const image = "https://images.example.com/public/project.webp";
    render(
      <HelmetProvider>
        <MemoryRouter>
          <SEO title={title} ogImage={image} keywords="obsolete keyword" />
        </MemoryRouter>
      </HelmetProvider>,
    );
    await waitFor(() => expect(document.title).toBe(title));
    expect(document.querySelector('meta[property="og:title"]')).toHaveAttribute(
      "content",
      title,
    );
    expect(document.querySelector('meta[property="og:image"]')).toHaveAttribute(
      "content",
      image,
    );
    expect(
      document.querySelector('meta[name="twitter:image"]'),
    ).toHaveAttribute("content", image);
    expect(document.querySelector('meta[name="keywords"]')).toBeNull();
  });
  it("does not turn a service description into the company's identity", async () => {
    render(
      <HelmetProvider>
        <MemoryRouter>
          <SEO title="Painting" description="Specific painting scope" />
        </MemoryRouter>
      </HelmetProvider>,
    );
    await waitFor(() => expect(document.title).toContain("Painting"));
    const business = JSON.parse(
      document.querySelector('script[type="application/ld+json"]')!
        .textContent!,
    );
    expect(business.description).not.toBe("Specific painting scope");
    expect(business["@id"]).toBe(
      "https://www.ascentgroupconstruction.com/#organization",
    );
    expect(document.querySelector('meta[name="description"]')).toHaveAttribute(
      "content",
      "Specific painting scope",
    );
  });
  it("keeps the existing city list aligned without self-serving business review stars", async () => {
    render(
      <HelmetProvider>
        <MemoryRouter>
          <SEO title="Home" includeRating />
        </MemoryRouter>
      </HelmetProvider>,
    );
    await waitFor(() => expect(document.title).toContain("Home"));
    const business = JSON.parse(
      document.querySelector('script[type="application/ld+json"]')!
        .textContent!,
    );
    expect(
      business.areaServed.filter(
        (area: { "@type": string }) => area["@type"] === "City",
      ),
    ).toHaveLength(17);
    expect(business.areaServed).toContainEqual({
      "@type": "City",
      name: "King City",
    });
    expect(business.aggregateRating).toBeUndefined();
    expect(business.geo).toBeUndefined();
  });
});

vi.mock("@/hooks/usePublicSettings", () => ({
  usePublicSettings: (table: string) => ({
    data: table === "site_settings" ? mock.site : null,
  }),
}));

describe("owner metadata defaults", () => {
  it("uses configured defaults only when the page supplies no metadata", async () => {
    mock.site = {
      meta_title: "Owner default title",
      meta_description: "Owner default description",
    };
    const { rerender } = render(
      <HelmetProvider>
        <MemoryRouter>
          <SEO />
        </MemoryRouter>
      </HelmetProvider>,
    );
    await waitFor(() =>
      expect(document.title).toContain("Owner default title"),
    );
    expect(document.querySelector('meta[name="description"]')).toHaveAttribute(
      "content",
      "Owner default description",
    );
    rerender(
      <HelmetProvider>
        <MemoryRouter>
          <SEO title="Page title" description="Page description" />
        </MemoryRouter>
      </HelmetProvider>,
    );
    await waitFor(() => expect(document.title).toContain("Page title"));
    expect(document.querySelector('meta[name="description"]')).toHaveAttribute(
      "content",
      "Page description",
    );
  });
  it("uses only valid HTTPS social profiles in organization structured data", async () => {
    mock.site = {
      social_links: {
        linkedin: "https://example.test/company",
        facebook: "javascript:alert(1)",
      },
    };
    render(
      <HelmetProvider>
        <MemoryRouter>
          <SEO />
        </MemoryRouter>
      </HelmetProvider>,
    );
    await waitFor(() =>
      expect(
        [...document.querySelectorAll('script[type="application/ld+json"]')]
          .map((n) => n.textContent)
          .join(),
      ).toContain("https://example.test/company"),
    );
    expect(
      [...document.querySelectorAll('script[type="application/ld+json"]')]
        .map((n) => n.textContent)
        .join(),
    ).not.toContain("javascript:");
  });
});
