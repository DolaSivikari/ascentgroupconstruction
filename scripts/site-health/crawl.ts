/** Anonymous, read-only health crawl. No forms, logins, RPCs or storage writes. */
import { createHash } from "node:crypto";
import { createRequire } from "node:module";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join, resolve } from "node:path";
import { execFileSync } from "node:child_process";
import { lookup } from "node:dns/promises";
import { PUBLIC_ROUTE_PATTERNS } from "../../src/routes/registry";
import {
  blockedHost,
  CRAWLER_USER_AGENT,
  inventory,
  publicBackendRead,
} from "../../src/lib/baseline/policy";
import {
  HEALTH_ORIGIN,
  distinctIssues,
  healthPayloadSchema,
  type HealthIssue,
  type HealthPayload,
} from "../../src/lib/admin/site-health/contract";

const require = createRequire(import.meta.url);
const { chromium } = require(process.env.BASELINE_PLAYWRIGHT || "playwright");
const args = Object.fromEntries(
  process.argv.slice(2).map((value) => {
    const [key, ...rest] = value.replace(/^--/, "").split("=");
    return [key, rest.join("=") || "true"];
  }),
);
const out = resolve(args.out || "node_modules/.cache/site-health");
await mkdir(out, { recursive: true });
const hash = (text: string) => createHash("sha256").update(text).digest("hex");
const uuid = (text: string) => {
  const h = hash(text);
  return `${h.slice(0, 8)}-${h.slice(8, 12)}-4${h.slice(13, 16)}-a${h.slice(17, 20)}-${h.slice(20, 32)}`;
};
const runId = uuid(
  `${process.env.GITHUB_REPOSITORY || "local"}:${process.env.GITHUB_RUN_ID || crypto.randomUUID()}:${process.env.GITHUB_RUN_ATTEMPT || "1"}`,
);
const started = new Date().toISOString();
const payload: HealthPayload = {
  version: 1,
  id: runId,
  kind: process.env.GITHUB_EVENT_NAME === "schedule" ? "full_crawl" : "manual",
  target_origin: HEALTH_ORIGIN,
  commit_ref: execFileSync("git", ["rev-parse", "HEAD"], {
    encoding: "utf8",
  }).trim(),
  started_at: started,
  finished_at: started,
  paths: [],
  results: [],
  blocked: false,
  failure: null,
};
const safeUrl = (value: string) => {
  try {
    const url = new URL(value, HEALTH_ORIGIN);
    return `${url.origin === HEALTH_ORIGIN ? "" : url.origin}${url.pathname}`.slice(
      0,
      500,
    );
  } catch {
    return "Invalid URL";
  }
};
const safeMessage = (value: string) =>
  value
    .replace(/https?:\/\/[^\s"'<>]+/g, safeUrl)
    .replace(/\b(?:Bearer|apikey|token|password)\s*[:=]\s*\S+/gi, "[redacted]")
    .slice(0, 500);
const issue = (
  path: string,
  code: string,
  severity: HealthIssue["severity"],
  message: string,
  target = "",
): HealthIssue => ({
  code,
  severity,
  message: safeMessage(message),
  ...(target ? { target: target.slice(0, 500) } : {}),
  fingerprint: hash(`${code}\n${path}\n${target || safeMessage(message)}`),
});
const boundedIssues = (path: string, findings: HealthIssue[]) => {
  const rank = { error: 0, warning: 1, info: 2 };
  const unique = distinctIssues([{ issues: findings }]).sort(
    (a, b) =>
      rank[a.severity] - rank[b.severity] ||
      a.fingerprint.localeCompare(b.fingerprint),
  );
  return unique.length <= 100
    ? unique
    : [
        ...unique.slice(0, 99),
        issue(
          path,
          "finding_limit",
          "warning",
          "More than 100 findings were detected; errors were prioritised and the report is truncated",
        ),
      ];
};
const proxyText =
  process.env.BASELINE_PROXY ||
  process.env.HTTPS_PROXY ||
  process.env.HTTP_PROXY;
const proxy = proxyText ? new URL(proxyText) : null;
const browser = await chromium.launch({
  headless: true,
  executablePath: process.env.CHROMIUM_PATH || undefined,
  ...(proxy
    ? {
        proxy: {
          server: proxy.origin,
          username: decodeURIComponent(proxy.username),
          password: decodeURIComponent(proxy.password),
        },
      }
    : {}),
});
const links = new Map<string, Set<string>>();
const sitemapPaths = new Set<string>();
try {
  const discovery = await browser.newContext({ userAgent: CRAWLER_USER_AGENT });
  const seen = new Set<string>();
  const sitemap = async (url: string, depth = 0): Promise<string[]> => {
    if (depth > 3 || new URL(url).origin !== HEALTH_ORIGIN || seen.has(url))
      throw new Error("Invalid sitemap recursion");
    seen.add(url);
    const response = await discovery.request.get(url, { timeout: 30000 });
    if (response.status() === 403) {
      payload.blocked = true;
      throw new Error("Production blocked the monitoring crawler (HTTP 403)");
    }
    if (!response.ok())
      throw new Error(`Sitemap returned HTTP ${response.status()}`);
    const xml = await response.text();
    const page = await discovery.newPage();
    const parsed = await page.evaluate((text: string) => {
      const document = new DOMParser().parseFromString(text, "application/xml");
      if (document.querySelector("parsererror"))
        throw new Error("Invalid sitemap XML");
      return {
        kind: document.documentElement.localName,
        urls: [...document.getElementsByTagNameNS("*", "loc")].map(
          (node) => node.textContent?.trim() || "",
        ),
      };
    }, xml);
    await page.close();
    if (parsed.kind === "sitemapindex") {
      const urls: string[] = [];
      for (const child of parsed.urls)
        urls.push(...(await sitemap(child, depth + 1)));
      return urls;
    }
    if (parsed.kind !== "urlset" || !parsed.urls.length)
      throw new Error("Empty or invalid sitemap");
    return parsed.urls;
  };
  const urls = await sitemap(HEALTH_ORIGIN + "/sitemap.xml");
  urls.forEach((value) => sitemapPaths.add(new URL(value).pathname));
  const known = JSON.parse(
    await readFile("_assessment/baseline/inventory.json", "utf8"),
  ) as { pages: Array<{ path: string }> };
  payload.paths = inventory(
    urls,
    [...PUBLIC_ROUTE_PATTERNS, ...known.pages.map((page) => page.path)],
    HEALTH_ORIGIN,
  );
  if (payload.paths.length > 500)
    throw new Error("Inventory exceeds the supported 500-URL limit");
  await discovery.close();
  for (const width of [1440, 390]) {
    const context = await browser.newContext({
      viewport: { width, height: 900 },
      locale: "en-CA",
      timezoneId: "America/Toronto",
      userAgent: CRAWLER_USER_AGENT,
      reducedMotion: "reduce",
      serviceWorkers: "block",
    });
    await context.addCookies([
      { name: "cookie-consent", value: "rejected", url: HEALTH_ORIGIN },
    ]);
    await context.addInitScript(() => {
      localStorage.setItem("cookie-consent", "rejected");
      sessionStorage.setItem("deployment-check-done", "true");
    });
    await context.routeWebSocket("**/*", (socket) => socket.close());
    const denied = new Set<string>();
    await context.route("**/*", (route) => {
      const request = route.request(),
        url = new URL(request.url());
      if (
        !["GET", "HEAD", "OPTIONS"].includes(request.method()) ||
        blockedHost(url) ||
        (url.hostname.endsWith(".supabase.co") &&
          !publicBackendRead(url, request.method())) ||
        !["https:", "data:", "blob:"].includes(url.protocol)
      ) {
        denied.add(request.url());
        return route.abort("blockedbyclient");
      }
      return route.continue();
    });
    for (const path of payload.paths) {
      const page = await context.newPage();
      const findings: HealthIssue[] = [];
      const consoleErrors: string[] = [];
      let requests = 0;
      page.on("pageerror", (error) =>
        findings.push(issue(path, "javascript_error", "error", error.message)),
      );
      page.on("console", (message) => {
        if (message.type() === "error" && !denied.has(message.location().url)) {
          consoleErrors.push(message.text());
          if (!/^Failed to load resource/.test(message.text()))
            findings.push(
              issue(path, "console_error", "error", message.text()),
            );
        }
      });
      page.on("requestfailed", (request) => {
        if (!denied.has(request.url())) {
          requests++;
          findings.push(
            issue(
              path,
              "failed_resource",
              "error",
              "A page resource failed to load",
              safeUrl(request.url()),
            ),
          );
        }
      });
      page.on("response", (response) => {
        if (response.status() >= 400 && !denied.has(response.url())) {
          requests++;
          findings.push(
            issue(
              path,
              "failed_resource",
              "error",
              `A page resource returned HTTP ${response.status()}`,
              safeUrl(response.url()),
            ),
          );
        }
        if (response.request().resourceType() === "image")
          void response
            .headerValue("content-length")
            .then((value) => {
              if (Number(value) > 500000)
                findings.push(
                  issue(
                    path,
                    "large_image",
                    "warning",
                    "An image exceeds 500 KB",
                    safeUrl(response.url()),
                  ),
                );
            })
            .catch(() => {});
      });
      const begin = Date.now();
      let status: number | null = null;
      let loadMs: number | null = null;
      let pageData: {
        title: string;
        description: string | null;
        headings: string[];
        canonicals: string[];
        text: string;
        overflow: boolean;
        images: Array<{ src: string; alt: string | null; broken: boolean }>;
        links: string[];
      } | null = null;
      try {
        const response = await page.goto(HEALTH_ORIGIN + path, {
          waitUntil: "networkidle",
          timeout: 30000,
        });
        status = response?.status() || null;
        if (status === 403) {
          payload.blocked = true;
          throw new Error(
            "Production blocked the monitoring crawler (HTTP 403)",
          );
        }
        await page
          .locator("h1")
          .first()
          .waitFor({ state: "attached", timeout: 8000 })
          .catch(() => {});
        loadMs = Date.now() - begin;
        await page.evaluate(async () => {
          for (let y = 0; y < document.body.scrollHeight; y += 700) {
            window.scrollTo(0, y);
            await new Promise((resolve) => setTimeout(resolve, 60));
          }
          window.scrollTo(0, 0);
        });
        await page.waitForTimeout(300);
        pageData = await page.evaluate(() => ({
          title: document.title,
          description:
            document
              .querySelector('meta[name="description"]')
              ?.getAttribute("content") || null,
          headings: [...document.querySelectorAll("h1")].map(
            (node) => node.textContent?.trim() || "",
          ),
          canonicals: [
            ...document.querySelectorAll('link[rel="canonical"]'),
          ].map((node) => node.getAttribute("href") || ""),
          text: document.body.innerText,
          overflow: document.documentElement.scrollWidth > innerWidth + 2,
          images: [...document.images]
            .filter((image) => !image.closest('[aria-hidden="true"]'))
            .map((image) => ({
              src: image.currentSrc || image.src,
              alt: image.getAttribute("alt"),
              broken: image.complete && image.naturalWidth === 0 && !!image.src,
            })),
          links: [
            ...document.querySelectorAll<HTMLAnchorElement>("a[href]"),
          ].map((link) => link.href),
        }));
        if (!status || status >= 400)
          findings.push(
            issue(
              path,
              "page_http_error",
              "error",
              `Page returned HTTP ${status || "unavailable"}`,
            ),
          );
        if (
          /\b(404\s*[-–:]?\s*page not found|page not found|something went wrong|failed to load (location|service detail))\b/i.test(
            pageData.headings.join(" "),
          )
        )
          findings.push(
            issue(
              path,
              "error_view",
              "error",
              "The page renders an error or not-found heading",
            ),
          );
        if (!pageData.title.trim())
          findings.push(
            issue(path, "missing_title", "error", "The page has no title"),
          );
        if (!pageData.headings.some((value) => value.trim()))
          findings.push(
            issue(path, "missing_h1", "error", "The page has no H1 heading"),
          );
        if (pageData.headings.length > 1)
          findings.push(
            issue(
              path,
              "multiple_h1",
              "warning",
              "The page has more than one H1 heading",
            ),
          );
        if (pageData.canonicals.length !== 1)
          findings.push(
            issue(
              path,
              "canonical",
              "error",
              `Expected one canonical link; found ${pageData.canonicals.length}`,
            ),
          );
        else {
          const canonical = new URL(pageData.canonicals[0], HEALTH_ORIGIN);
          if (
            canonical.origin !== HEALTH_ORIGIN ||
            canonical.pathname !== new URL(page.url()).pathname
          )
            findings.push(
              issue(
                path,
                "canonical",
                "error",
                "The canonical points to another page",
                safeUrl(canonical.href),
              ),
            );
        }
        if (pageData.title.length > 60)
          findings.push(
            issue(
              path,
              "long_title",
              "warning",
              "The title exceeds 60 characters",
            ),
          );
        if (!pageData.description || pageData.description.length > 160)
          findings.push(
            issue(
              path,
              "description",
              "warning",
              !pageData.description
                ? "Meta description is missing"
                : "Meta description exceeds 160 characters",
            ),
          );
        if (width === 390 && pageData.overflow)
          findings.push(
            issue(
              path,
              "mobile_overflow",
              "warning",
              "The page has horizontal overflow at 390px",
            ),
          );
        if (width === 390 && loadMs > 4000)
          findings.push(
            issue(
              path,
              "slow_mobile",
              "warning",
              "Navigation and heading readiness exceeded 4 seconds on the monitoring runner",
            ),
          );
        for (const image of pageData.images) {
          if (image.broken)
            findings.push(
              issue(
                path,
                "broken_image",
                "error",
                "An image failed to display",
                safeUrl(image.src),
              ),
            );
          if (image.alt === null)
            findings.push(
              issue(
                path,
                "missing_alt",
                "warning",
                "An image is missing its alt attribute",
                safeUrl(image.src),
              ),
            );
        }
        if (!sitemapPaths.has(path) && path !== "/case-studies")
          findings.push(
            issue(
              path,
              "missing_sitemap",
              "warning",
              "This public route is absent from the live sitemap",
            ),
          );
        if (/\b(lorem ipsum|TBD|John Smith|123-4567)\b/i.test(pageData.text))
          findings.push(
            issue(
              path,
              "placeholder_copy",
              "info",
              "Review possible placeholder copy",
            ),
          );
        for (const word of [
          "24/7",
          "certified",
          "bonded",
          "factory-certified",
          "licensed",
          "warranty",
        ])
          if (pageData.text.toLowerCase().includes(word))
            findings.push(
              issue(
                path,
                "claim_review",
                "info",
                `Credential wording includes “${word}”. Document validation awaits the credentials vault; no claim is judged invalid.`,
                word,
              ),
            );
        for (const value of pageData.links) {
          try {
            const url = new URL(value);
            if (
              url.protocol !== "https:" ||
              blockedHost(url) ||
              url.hostname.endsWith(".supabase.co")
            )
              continue;
            const clean = safeUrl(url.href);
            if (
              url.origin === HEALTH_ORIGIN &&
              url.pathname.startsWith("/admin")
            )
              continue;
            if (!links.has(clean)) links.set(clean, new Set());
            links.get(clean)!.add(path);
          } catch {
            /* Invalid links are not followed. */
          }
        }
      } catch (error) {
        findings.push(
          issue(
            path,
            "page_load",
            "error",
            error instanceof Error
              ? error.message
              : "Page could not be inspected",
          ),
        );
      }
      payload.results.push({
        id: uuid(`${runId}:${path}:${width}`),
        path,
        viewport: width === 1440 ? "desktop" : "mobile",
        http_status: status,
        load_ms: loadMs,
        title: pageData?.title.slice(0, 300) || null,
        h1: pageData?.headings[0]?.slice(0, 300) || null,
        canonical: pageData?.canonicals[0]?.slice(0, 500) || null,
        text_hash: pageData ? hash(pageData.text) : null,
        console_errors: consoleErrors.length,
        failed_requests: requests,
        issues: boundedIssues(path, findings),
        checked_at: new Date().toISOString(),
      });
      await page.close();
      if (payload.blocked)
        throw new Error("Production blocked the monitoring crawler (HTTP 403)");
      console.log(
        `Checked ${payload.results.length}/${payload.paths.length * 2}: ${path} (${width}px)`,
      );
    }
    await context.close();
  }
  // Duplicate titles and internal destinations are checked across the discovered graph.
  const desktop = payload.results.filter((row) => row.viewport === "desktop");
  for (const row of payload.results)
    if (
      row.title &&
      desktop.some(
        (other) =>
          other.path !== row.path &&
          other.title === row.title &&
          other.path !== "/case-studies" &&
          row.path !== "/case-studies",
      )
    )
      row.issues.push(
        issue(
          row.path,
          "duplicate_title",
          "warning",
          "Another public page has the same title",
        ),
      );
  const probes = await browser.newContext({ userAgent: CRAWLER_USER_AGENT });
  let probed = 0;
  for (const [target, sources] of links) {
    const url = new URL(target, HEALTH_ORIGIN);
    const existing = desktop.find(
      (row) => row.path === url.pathname && url.origin === HEALTH_ORIGIN,
    );
    if (existing) {
      if (
        !existing.http_status ||
        existing.http_status >= 400 ||
        existing.issues.some((finding) =>
          ["error_view", "page_load"].includes(finding.code),
        )
      )
        for (const row of payload.results.filter((row) =>
          sources.has(row.path),
        ))
          row.issues.push(
            issue(
              row.path,
              "broken_link",
              "error",
              "An internal link leads to a failing page",
              target,
            ),
          );
      continue;
    }
    if (probed++ >= 100) {
      for (const row of payload.results.filter((row) => sources.has(row.path)))
        row.issues.push(
          issue(
            row.path,
            "link_not_checked",
            "info",
            "Link probe limit reached; this destination was not verified",
            target,
          ),
        );
      continue;
    }
    try {
      const addresses = await lookup(url.hostname, { all: true });
      if (
        !addresses.length ||
        addresses.some(({ address }) =>
          /^(127\.|10\.|0\.|169\.254\.|192\.168\.|172\.(1[6-9]|2\d|3[01])\.|::1$|f[cd]|fe80)/i.test(
            address,
          ),
        )
      )
        throw new Error("Private or unresolved destination");
      const response = await probes.request.head(url.href, {
        timeout: 8000,
        maxRedirects: 0,
      });
      if (response.status() >= 400)
        for (const row of payload.results.filter((row) =>
          sources.has(row.path),
        ))
          row.issues.push(
            issue(
              row.path,
              url.origin === HEALTH_ORIGIN ? "broken_link" : "external_link",
              url.origin === HEALTH_ORIGIN ? "error" : "warning",
              `Linked destination returned HTTP ${response.status()}`,
              target,
            ),
          );
      else if (response.status() >= 300 || url.origin === HEALTH_ORIGIN)
        for (const row of payload.results.filter((row) =>
          sources.has(row.path),
        ))
          row.issues.push(
            issue(
              row.path,
              "link_review",
              "info",
              "Destination redirects or is outside the page inventory; its rendered view was not verified",
              target,
            ),
          );
    } catch {
      for (const row of payload.results.filter((row) => sources.has(row.path)))
        row.issues.push(
          issue(
            row.path,
            "link_not_checked",
            "info",
            "Link probe was inconclusive; review manually",
            target,
          ),
        );
    }
  }
  await probes.close();
} catch (error) {
  payload.failure = safeMessage(
    error instanceof Error ? error.message : "Crawler aborted",
  );
} finally {
  await browser.close();
  payload.finished_at = new Date().toISOString();
  for (const row of payload.results)
    row.issues = boundedIssues(row.path, row.issues);
  await writeFile(join(out, "report.json"), JSON.stringify(payload, null, 2));
}
// Blocked discovery is stored as blocked with zero coverage, never as a healthy run.
{
  const valid = healthPayloadSchema.parse(payload);
  const all = distinctIssues(valid.results);
  console.log(
    JSON.stringify({
      urls: valid.paths.length,
      captures: valid.results.length,
      blocked: valid.blocked,
      aborted: !!valid.failure,
      errors: all.filter((item) => item.severity === "error").length,
      warnings: all.filter((item) => item.severity === "warning").length,
    }),
  );
  if (args.upload === "true") {
    const token = process.env.SITE_HEALTH_INGEST_TOKEN;
    if (!token)
      throw new Error(
        "Configure SITE_HEALTH_INGEST_TOKEN before uploading health results",
      );
    const response = await fetch(
      "https://dinliarttwuzzozyvuiu.supabase.co/functions/v1/ingest-site-health",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(valid),
        signal: AbortSignal.timeout(60000),
        redirect: "error",
      },
    );
    if (!response.ok)
      throw new Error(
        `Health ingestion returned HTTP ${response.status()}; report.json is preserved`,
      );
    const result = (await response.json()) as {
      status?: string;
      alerts?: string;
    };
    console.log(
      JSON.stringify({ ingestion: result.status, alerts: result.alerts }),
    );
  }
  if (valid.blocked || valid.failure) process.exitCode = 1;
}
