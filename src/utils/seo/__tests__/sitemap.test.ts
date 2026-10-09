import { describe, expect, it } from "vitest";
import {
  createSitemapXml,
  extractSitemapRoutes,
  extractRouteComponentFiles,
  includeHubModificationDates,
  publishedContentPath,
} from "../sitemap";

describe("public sitemap", () => {
  it("keeps published content but excludes redirect-only service records", () => {
    expect(publishedContentPath("services", "painting")).toBeNull();
    expect(publishedContentPath("services", "painting-services")).toBe(
      "/services/painting-services",
    );
    expect(publishedContentPath("projects", "painting")).toBe(
      "/projects/painting",
    );
    expect(publishedContentPath("blog_posts", "restoration-guide")).toBe(
      "/blog/restoration-guide",
    );
  });
  it("excludes redirects, aliases, utilities, admin and dynamic route patterns", () => {
    const source = [
      ["/", "Index"],
      ["/for-architects", "ForArchitects"],
      ["/services/tile-installation-toronto", "Tile"],
      ["/old-page", "Navigate"],
      ["/old-service", "LegacyRouteRedirect"],
      ["/tekev", "Auth"],
      ["/.lovable/oauth/consent", "OAuthConsent"],
      ["/unsubscribe", "Unsubscribe"],
      ["/email-unsubscribe", "EmailUnsubscribe"],
      ["/case-studies", "Blog"],
      ["/blog/:slug", "BlogPost"],
      ["/404", "NotFound"],
      ["/admin", "UnifiedAdminLayout"],
      ["/admin/users", "Users"],
      ["/dev/tokens", "TokenPreview"],
      ["users", "Users"],
      ["*", "NotFound"],
    ]
      .map(
        ([path, component]) =>
          `<Route path="${path}" element={<${component} />} />`,
      )
      .join("\n");
    expect(extractSitemapRoutes(source).map((route) => route.path)).toEqual([
      "/",
      "/for-architects",
      "/services/tile-installation-toronto",
    ]);
  });

  it("finds source files after multiline formatting of lazy imports", () => {
    const source = `const About = lazyWithFallback(() => import("@/pages/About"), "About");
      const Blog = lazyWithFallback(
        () => import("@/pages/Blog"),
        "Blog",
      );`;
    const files = extractRouteComponentFiles(source);
    expect(files.get("Index")).toBe("src/pages/Index.tsx");
    expect(files.get("About")).toBe("src/pages/About.tsx");
    expect(files.get("Blog")).toBe("src/pages/Blog.tsx");
  });

  it("advances listing dates to the newest real content date without inventing dates", () => {
    const entries = [
      { path: "/blog", lastmod: "2026-03-09" },
      { path: "/blog/first", lastmod: "2026-05-01" },
      { path: "/blog/latest", lastmod: "2026-06-06T12:00:00Z" },
      { path: "/blog/unknown", lastmod: "invalid" },
      { path: "/projects", lastmod: "2026-10-03" },
      { path: "/projects/older", lastmod: "2026-06-25" },
      { path: "/services" },
      { path: "/services/unknown" },
    ];
    const xml = createSitemapXml(
      "https://example.com",
      includeHubModificationDates(entries),
    );
    const document = new DOMParser().parseFromString(xml, "application/xml");
    const dates = new Map(
      [...document.querySelectorAll("url")].map((node) => [
        node.querySelector("loc")?.textContent,
        node.querySelector("lastmod")?.textContent,
      ]),
    );
    expect(dates.get("https://example.com/blog")).toBe("2026-06-06");
    expect(dates.get("https://example.com/projects")).toBe("2026-10-03");
    expect(dates.get("https://example.com/services")).toBeUndefined();
    expect(entries).toHaveLength(8);
  });

  it("deduplicates entries, preserves the latest real date and escapes XML", () => {
    const xml = createSitemapXml("https://example.com/", [
      { path: "/projects/site", lastmod: "2026-09-10T14:32:00Z" },
      { path: "/projects/site", lastmod: "2026-09-11" },
      { path: "/projects/site", lastmod: "invalid" },
      { path: "/service-areas/toronto" },
      { path: "/a&b" },
    ]);
    const document = new DOMParser().parseFromString(xml, "application/xml");
    expect(document.querySelector("parsererror")).toBeNull();
    expect(
      [...document.querySelectorAll("loc")].map((node) => node.textContent),
    ).toEqual([
      "https://example.com/a&b",
      "https://example.com/projects/site",
      "https://example.com/service-areas/toronto",
    ]);
    expect(document.querySelectorAll("lastmod")).toHaveLength(1);
    expect(document.querySelector("lastmod")?.textContent).toBe("2026-09-11");
    expect(xml).toContain("/a&amp;b");
  });

  it.each([
    "//other-site.com",
    "/services/:slug",
    "/projects?draft=true",
    "/blog#heading",
  ])("rejects noncanonical path %s", (path) => {
    expect(() => createSitemapXml("https://example.com", [{ path }])).toThrow(
      "Invalid sitemap path",
    );
  });
});
