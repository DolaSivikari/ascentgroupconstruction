import { afterEach, describe, expect, it, vi } from "vitest";
import { readCrawlerFile, summarizeSitemap } from "./crawlerFiles";
afterEach(() => vi.unstubAllGlobals());
describe("served crawler files", () => {
  it("counts URL entries with namespace declarations and recognizes sitemap indexes", () => {
    expect(
      summarizeSitemap(
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>https://site.test/a</loc></url><url><loc>https://site.test/b</loc></url></urlset>',
      ),
    ).toEqual({ kind: "urlset", count: 2 });
    expect(
      summarizeSitemap(
        "<sitemapindex><sitemap><loc>https://site.test/child.xml</loc></sitemap></sitemapindex>",
      ),
    ).toEqual({ kind: "sitemapindex", count: 1 });
  });
  it.each(["<html><body>app fallback</body></html>", "<urlset><url>"])(
    "rejects malformed XML and the SPA fallback",
    (xml) =>
      expect(() => summarizeSitemap(xml)).toThrow("not valid sitemap XML"),
  );
  it("reads the current origin without caching and reports HTTP failures", async () => {
    const fetch = vi
      .fn()
      .mockResolvedValue(new Response("Forbidden", { status: 403 }));
    vi.stubGlobal("fetch", fetch);
    await expect(readCrawlerFile("/sitemap.xml")).rejects.toThrow("HTTP 403");
    expect(String(fetch.mock.calls[0][0])).toBe(
      `${window.location.origin}/sitemap.xml`,
    );
    expect(fetch.mock.calls[0][1]).toEqual({ cache: "no-store" });
  });
  it("rejects an HTML response masquerading as robots.txt", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(new Response("<html>app</html>")),
    );
    await expect(readCrawlerFile("/robots.txt")).rejects.toThrow(
      "not a robots file",
    );
  });
});
