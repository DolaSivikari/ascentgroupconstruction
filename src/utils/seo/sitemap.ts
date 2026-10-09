import { SERVICE_REDIRECTS } from "../../data/service-redirects";

export interface SitemapEntry {
  path: string;
  lastmod?: string | null;
}

/** A published historical service can still be a redirect rather than a content page. */
export function publishedContentPath(
  table: "services" | "projects" | "blog_posts",
  slug: string,
): string | null {
  if (
    table === "services" &&
    Object.prototype.hasOwnProperty.call(SERVICE_REDIRECTS, slug)
  )
    return null;
  return `/${table === "blog_posts" ? "blog" : table}/${slug}`;
}

const excludedComponents = new Set([
  "Navigate",
  "LegacyRouteRedirect",
  "Auth",
  "OAuthConsent",
  "Unsubscribe",
  "EmailUnsubscribe",
  "NotFound",
  "TokenPreview",
  "UnifiedAdminLayout",
]);

/** Canonical static content routes; dynamic destinations come from published records. */
export function extractSitemapRoutes(
  source: string,
): { path: string; component: string }[] {
  const routes = [
    ...source.matchAll(/<Route\s+path="([^"]+)"\s+element=\{<([A-Za-z]\w*)\b/g),
  ];
  return routes.flatMap(([, path, component]) => {
    if (
      !path.startsWith("/") ||
      path.includes(":") ||
      path.includes("*") ||
      /^\/(admin|dev)(\/|$)/.test(path) ||
      path === "/case-studies" ||
      excludedComponents.has(component)
    )
      return [];
    return [{ path, component }];
  });
}

/** Lazy imports can span lines after formatting; their source dates must survive it. */
export function extractRouteComponentFiles(
  source: string,
): Map<string, string> {
  const files = new Map<string, string>([["Index", "src/pages/Index.tsx"]]);
  const imports =
    /const\s+(\w+)\s*=\s*lazyWithFallback\(\s*\(\)\s*=>\s*import\("@\/([^"]+)"\)/g;
  for (const [, component, file] of source.matchAll(imports)) {
    files.set(component, `src/${file}.tsx`);
  }
  return files;
}

/** Listing pages change when their published content changes, not just their TSX. */
export function includeHubModificationDates(
  entries: SitemapEntry[],
): SitemapEntry[] {
  const result = [...entries];
  for (const hub of ["/blog", "/projects", "/services"]) {
    if (!entries.some((entry) => entry.path === hub)) continue;
    const dates = entries
      .filter((entry) => entry.path.startsWith(`${hub}/`))
      .flatMap((entry) =>
        entry.lastmod && Number.isFinite(Date.parse(entry.lastmod))
          ? [new Date(entry.lastmod).toISOString().slice(0, 10)]
          : [],
      );
    if (dates.length)
      result.push({ path: hub, lastmod: dates.sort()[dates.length - 1] });
  }
  return result;
}

const escapeXml = (value: string) =>
  value.replace(
    /[&<>"']/g,
    (character) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&apos;",
      })[character]!,
  );

/** Deduplicate canonical destinations and never invent a modification date. */
export function createSitemapXml(
  origin: string,
  entries: SitemapEntry[],
): string {
  const base = new URL(origin);
  if (!/^https?:$/.test(base.protocol))
    throw new Error("Sitemap origin must use HTTP or HTTPS");
  const unique = new Map<string, string | undefined>();
  for (const { path, lastmod } of entries) {
    if (!path.startsWith("/") || path.startsWith("//") || /[?#:*]/.test(path)) {
      throw new Error(`Invalid sitemap path: ${path}`);
    }
    const date =
      lastmod && Number.isFinite(Date.parse(lastmod))
        ? new Date(lastmod).toISOString().slice(0, 10)
        : undefined;
    const previous = unique.get(path);
    unique.set(path, date && (!previous || date > previous) ? date : previous);
  }
  const rows = [...unique.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(
      ([path, date]) =>
        `  <url>\n    <loc>${escapeXml(base.origin + path)}</loc>${date ? `\n    <lastmod>${date}</lastmod>` : ""}\n  </url>`,
    );
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${rows.join("\n")}\n</urlset>\n`;
}
