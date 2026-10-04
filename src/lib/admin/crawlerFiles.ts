export interface SitemapSummary {
  kind: "urlset" | "sitemapindex";
  count: number;
}
export function summarizeSitemap(xml: string): SitemapSummary {
  const document = new DOMParser().parseFromString(xml, "application/xml");
  const root = document.documentElement.localName;
  if (
    document.querySelector("parsererror") ||
    (root !== "urlset" && root !== "sitemapindex")
  ) {
    throw new Error("The served sitemap is not valid sitemap XML.");
  }
  return {
    kind: root,
    count: [...document.documentElement.children].filter(
      (child) =>
        child.localName === (root === "urlset" ? "url" : "sitemap") &&
        [...child.children].some(
          (node) => node.localName === "loc" && node.textContent?.trim(),
        ),
    ).length,
  };
}

export async function readCrawlerFile(path: "/robots.txt" | "/sitemap.xml") {
  const response = await fetch(new URL(path, window.location.origin), {
    cache: "no-store",
  });
  if (!response.ok)
    throw new Error(`${path} could not be read (HTTP ${response.status}).`);
  const text = await response.text();
  if (
    path === "/robots.txt" &&
    (!/^\s*User-agent\s*:/im.test(text) || /^\s*</.test(text))
  )
    throw new Error("The served robots.txt is not a robots file.");
  return text;
}
