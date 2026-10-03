import { readFile, writeFile, rename } from "node:fs/promises";
import { execFileSync } from "node:child_process";
import { resolve } from "node:path";
import { loadEnv } from "vite";
import { serviceAreaCities, getServiceAreaPath } from "../src/data/service-area-cities";
import { createSitemapXml, extractSitemapRoutes, publishedContentPath, type SitemapEntry } from "../src/utils/seo/sitemap";

// Public read credentials only. This command does not modify the database.
const root = process.cwd();
const env = { ...loadEnv("production", root, "VITE_"), ...process.env };
const apiUrl = env.VITE_SUPABASE_URL;
const publicKey = env.VITE_SUPABASE_PUBLISHABLE_KEY || env.VITE_SUPABASE_ANON_KEY;
if (!apiUrl || !publicKey) throw new Error("Missing public Supabase environment bindings");

type PublishedRow = { slug: string; updated_at: string | null; published_at?: string | null };
async function publishedRows(table: "services" | "projects" | "blog_posts"): Promise<PublishedRow[]> {
  const result: PublishedRow[] = [];
  for (let offset = 0; ; offset += 1000) {
    const url = new URL(`/rest/v1/${table}`, apiUrl);
    url.searchParams.set("select", table === "blog_posts" ? "slug,updated_at,published_at" : "slug,updated_at");
    url.searchParams.set("publish_state", "eq.published");
    if (table === "blog_posts") url.searchParams.set("published_at", `lte.${new Date().toISOString()}`);
    url.searchParams.set("order", "slug.asc");
    url.searchParams.set("limit", "1000");
    url.searchParams.set("offset", String(offset));
    const response = await fetch(url, {
      headers: { apikey: publicKey!, Authorization: `Bearer ${publicKey}` },
      signal: AbortSignal.timeout(30_000),
    });
    if (!response.ok) throw new Error(`Cannot read published ${table}: HTTP ${response.status}`);
    const rows: PublishedRow[] = await response.json();
    // Preserve existing URLs, including historical double/trailing hyphens.
    if (!Array.isArray(rows) || rows.some(row => typeof row.slug !== "string" || !/^[a-z0-9][a-z0-9-]*$/.test(row.slug))) {
      throw new Error(`Invalid published ${table} response`);
    }
    result.push(...rows);
    if (rows.length < 1000) break;
  }
  // Avoid accidentally deleting coverage after a misconfigured environment or read policy.
  if (!result.length) throw new Error(`No published ${table} returned; sitemap was not changed`);
  return result;
}

function sourceDate(file?: string): string | undefined {
  if (!file) return undefined;
  try {
    return execFileSync("git", ["log", "-1", "--format=%cs", "--", file], { cwd: root, encoding: "utf8" }).trim() || undefined;
  } catch { return undefined; }
}

const routesSource = await readFile(resolve(root, "src/routes/AppRoutes.tsx"), "utf8");
const componentFiles = new Map<string, string>();
for (const [, component, file] of routesSource.matchAll(/const (\w+) = lazyWithFallback\(\(\) => import\("@\/([^"]+)"\)/g)) {
  componentFiles.set(component, `src/${file}.tsx`);
}
componentFiles.set("Index", "src/pages/Index.tsx");
const entries: SitemapEntry[] = extractSitemapRoutes(routesSource).map(({ path, component }) => ({
  path, lastmod: sourceDate(componentFiles.get(component)),
}));
const cityDate = sourceDate("src/pages/resources/LocationPage.tsx");
for (const city of serviceAreaCities) entries.push({ path: getServiceAreaPath(city)!, lastmod: cityDate });

const tables = ["services", "projects", "blog_posts"] as const;
const published = await Promise.all(tables.map(publishedRows));
published.forEach((rows, index) => {
  rows.forEach(row => {
    const path = publishedContentPath(tables[index], row.slug);
    if (path) entries.push({ path, lastmod: row.updated_at || row.published_at });
  });
});
const xml = createSitemapXml(env.VITE_SITE_URL || "https://www.ascentgroupconstruction.com", entries);
const target = resolve(root, "public/sitemap.xml");
// All reads must succeed before replacing the checked-in artifact.
await writeFile(`${target}.tmp`, xml);
await rename(`${target}.tmp`, target);
console.log(`Generated sitemap: ${new Set(entries.map(entry => entry.path)).size} public content URLs`);
