export const CRAWLER_USER_AGENT = "AscentSiteHealth/1.0";
export const PUBLIC_TABLES = new Set([
  "site_settings",
  "footer_settings",
  "contact_page_settings",
  "about_page_settings",
  "services",
  "projects",
  "project_images",
  "project_services",
  "blog_posts",
  "hero_slides",
  "homepage_settings",
  "value_pillars",
  "why_choose_us_items",
  "certifications",
  "testimonials",
  "documents_library",
  "company_overview_sections",
  "company_overview_items",
]);
export function publicPath(value: string): boolean {
  return (
    value.startsWith("/") &&
    !value.startsWith("//") &&
    !/[?:#]/.test(value) &&
    !value.split("/").includes("..") &&
    !value.startsWith("/admin") &&
    !["/tekev", "/404", "/unsubscribe"].includes(value)
  );
}
export function inventory(
  sitemapUrls: string[],
  registry: readonly string[],
  origin: string,
): string[] {
  const paths = sitemapUrls.map((value) => {
    const url = new URL(value, origin);
    if (url.origin !== new URL(origin).origin)
      throw new Error("Sitemap includes another origin.");
    return url.pathname;
  });
  return [...new Set([...paths, ...registry].filter(publicPath))].sort();
}
export function blockedHost(url: URL): boolean {
  const domains = [
    "ipapi.co",
    "google-analytics.com",
    "googletagmanager.com",
    "analytics.google.com",
    "maps.googleapis.com",
    "maps.gstatic.com",
    "maps.google.com",
  ];
  return (
    domains.some(
      (host) => url.hostname === host || url.hostname.endsWith("." + host),
    ) ||
    (/^(www\.)?google\.com$/.test(url.hostname) &&
      url.pathname.startsWith("/maps"))
  );
}
export function publicBackendRead(url: URL, method: string): boolean {
  if (!["GET", "HEAD", "OPTIONS"].includes(method)) return false;
  if (!url.hostname.endsWith(".supabase.co")) return false;
  if (
    url.pathname.startsWith("/storage/v1/object/public/") ||
    url.pathname.startsWith("/storage/v1/render/image/public/")
  )
    return true;
  const table = /^\/rest\/v1\/([a-z_]+)$/.exec(url.pathname)?.[1];
  return !!table && PUBLIC_TABLES.has(table);
}
export function forbiddenSource(source: string): boolean {
  return /(?:^|\/)node_modules\/(?:@tiptap\/|recharts\/|@visx\/|chart\.js\/)/.test(
    source.replace(/\\/g, "/"),
  );
}
export interface Snapshot {
  path: string;
  width: number;
  status: number;
  finalPath: string;
  visibleText: string;
  title: string;
  h1: string[];
  canonical: string | null;
  jsonLdHash: string;
  screenshot: string;
  pageErrors: string[];
  consoleErrors: string[];
  scripts: string[];
}
export type ComparableField =
  | "visibleText"
  | "title"
  | "h1"
  | "canonical"
  | "jsonLdHash"
  | "status"
  | "finalPath"
  | "screenshot"
  | "pageErrors"
  | "consoleErrors";
export function completeSnapshots(
  paths: string[],
  snapshots: Snapshot[],
): boolean {
  return (
    paths.length > 0 &&
    new Set(paths).size === paths.length &&
    snapshots.length === paths.length * 2 &&
    paths.every((path) =>
      [1440, 390].every(
        (width) =>
          snapshots.filter((page) => page.path === path && page.width === width)
            .length === 1,
      ),
    )
  );
}
export const FIELDS: ComparableField[] = [
  "visibleText",
  "title",
  "h1",
  "canonical",
  "jsonLdHash",
  "status",
  "finalPath",
];
export function metadataDifferences(
  before: Snapshot,
  after: Snapshot,
): ComparableField[] {
  const changed: ComparableField[] = FIELDS.filter(
    (field) => JSON.stringify(before[field]) !== JSON.stringify(after[field]),
  );
  for (const field of ["pageErrors", "consoleErrors"] as const) {
    if (after[field].some((error) => !before[field].includes(error)))
      changed.push(field);
  }
  return changed;
}
export function pixelRatio(
  before: { width: number; height: number; data: Uint8Array },
  after: { width: number; height: number; data: Uint8Array },
): number {
  if (before.width !== after.width || before.height !== after.height) return 1;
  const count = before.width * before.height;
  if (
    !count ||
    before.data.length !== count * 4 ||
    after.data.length !== count * 4
  )
    throw new Error("Invalid PNG data.");
  let changed = 0;
  for (let offset = 0; offset < before.data.length; offset += 4) {
    // Exact pixel comparison, deliberately stricter than an antialiasing filter.
    if (
      [0, 1, 2, 3].some(
        (channel) =>
          before.data[offset + channel] !== after.data[offset + channel],
      )
    )
      changed++;
  }
  return changed / count;
}
