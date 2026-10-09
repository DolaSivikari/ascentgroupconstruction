/** Read-only acceptance checks for Lovable's published HTML and edge routing. */
import { readFile, mkdir, writeFile } from "node:fs/promises";
import { createRequire } from "node:module";
import { dirname, resolve } from "node:path";
import {
  inspectPublicDocument,
  markSharedShells,
  type HtmlFinding,
} from "../src/lib/seo/publicHtml";
import { SERVICE_REDIRECTS } from "../src/data/service-redirects";

const [originArgument, outputArgument, canonicalOriginArgument] = process.argv.slice(2);
if (!originArgument)
  throw new Error(
    "Usage: tsx scripts/verify-public-html.ts <origin> [report.json] [canonical-origin]",
  );
const origin = new URL(originArgument);
if (
  origin.pathname !== "/" ||
  origin.search ||
  origin.hash ||
  origin.username ||
  origin.password ||
  !(
    origin.protocol === "https:" ||
    (origin.protocol === "http:" &&
      ["127.0.0.1", "localhost"].includes(origin.hostname))
  )
)
  throw new Error(
    "Use an HTTPS origin, or a local loopback test server, without credentials or query strings.",
  );
const canonicalOrigin = new URL(canonicalOriginArgument || origin.origin);
if (
  canonicalOrigin.pathname !== "/" || canonicalOrigin.search || canonicalOrigin.hash ||
  canonicalOrigin.username || canonicalOrigin.password ||
  !(canonicalOrigin.protocol === "https:" ||
    (canonicalOrigin.protocol === "http:" && ["127.0.0.1", "localhost"].includes(canonicalOrigin.hostname)))
) throw new Error("Canonical origin must be an HTTPS origin, or local loopback HTTP, without credentials or query strings.");
const output = resolve(
  outputArgument || "node_modules/.cache/public-html/report.json",
);
const { JSDOM } = createRequire(import.meta.url)("jsdom");
const sitemap = await readFile("public/sitemap.xml", "utf8");
const paths = [
  ...new Set(
    [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(
      (match) => new URL(match[1]).pathname,
    ),
  ),
].sort();
if (!paths.length) throw new Error("No sitemap URLs found.");
const response = (path: string) =>
  fetch(new URL(path, origin), {
    redirect: "manual",
    signal: AbortSignal.timeout(15_000),
    headers: { "User-Agent": "AscentPublicHtmlAudit/1.0", Accept: "text/html" },
  });
const findings: HtmlFinding[] = [];
const queue = [...paths];
await Promise.all(
  Array.from({ length: 3 }, async () => {
    while (queue.length) {
      const path = queue.shift()!;
      try {
        const result = await response(path);
        const document = new JSDOM(await result.text()).window
          .document as Document;
        findings.push(
          inspectPublicDocument(document, new URL(path, origin), result.status, canonicalOrigin.origin),
        );
      } catch (error) {
        findings.push({
          path,
          status: 0,
          title: "",
          h1: [],
          canonical: null,
          contentWords: 0,
          signature: path,
          issues: [
            `Fetch failed: ${error instanceof Error ? error.message : "unknown error"}`,
          ],
        });
      }
    }
  }),
);
markSharedShells(findings);
const edge: Array<{ path: string; status: number; issues: string[] }> = [];
try {
  const path = "/audit-does-not-exist-7bb23e",
    result = await response(path);
  edge.push({
    path,
    status: result.status,
    issues:
      result.status === 404
        ? []
        : [`Unknown URL returned HTTP ${result.status}; expected 404.`],
  });
} catch (error) {
  edge.push({ path: "unknown-url", status: 0, issues: [String(error)] });
}
for (const [slug, target] of Object.entries(SERVICE_REDIRECTS)) {
  const suffix = "?utm_source=audit&tag=a&tag=b",
    path = `/services/${slug}${suffix}`;
  try {
    const result = await response(path),
      location = result.headers.get("location");
    const issues: string[] = [];
    if (result.status !== 301)
      issues.push(`Alias returned HTTP ${result.status}; expected 301.`);
    if (
      !location ||
      new URL(location, origin).href !== new URL(target + suffix, origin).href
    )
      issues.push(
        "Redirect destination or preserved query parameters do not match.",
      );
    edge.push({ path, status: result.status, issues });
  } catch (error) {
    edge.push({ path, status: 0, issues: [String(error)] });
  }
}
try {
  const path = "/tekev",
    result = await response(path);
  const document = new JSDOM(await result.text()).window.document as Document;
  const robots = [
    result.headers.get("x-robots-tag"),
    document.querySelector('meta[name="robots"]')?.getAttribute("content"),
  ].join(" ");
  edge.push({
    path,
    status: result.status,
    issues: /noindex/i.test(robots)
      ? []
      : ["Sign-in page needs noindex in received HTML or X-Robots-Tag."],
  });
} catch (error) {
  edge.push({ path: "/tekev", status: 0, issues: [String(error)] });
}
findings.sort((a, b) => a.path.localeCompare(b.path));
const failedPages = findings.filter((finding) => finding.issues.length).length;
const failedEdgeChecks = edge.filter((finding) => finding.issues.length).length;
const report = {
  status: failedPages || failedEdgeChecks ? "failed" : "passed",
  origin: origin.origin,
  canonicalOrigin: canonicalOrigin.origin,
  noJavaScript: true,
  userAgent: "AscentPublicHtmlAudit/1.0",
  checkedAt: new Date().toISOString(),
  urls: paths.length,
  failedPages,
  failedEdgeChecks,
  findings,
  edge,
};
await mkdir(dirname(output), { recursive: true });
await writeFile(output, JSON.stringify(report, null, 2) + "\n");
console.log(
  JSON.stringify({ ...report, findings: undefined, edge: undefined, output }),
);
if (report.status === "failed") process.exitCode = 1;
