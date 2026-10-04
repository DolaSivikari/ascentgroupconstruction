/** Read-only production capture; replay never uses a live backend. */
import { createHash } from "node:crypto";
import { createRequire } from "node:module";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { resolve, join } from "node:path";
import { execFileSync } from "node:child_process";
import { PUBLIC_ROUTE_PATTERNS } from "../../src/routes/registry";
import {
  CRAWLER_USER_AGENT,
  blockedHost,
  inventory,
  publicBackendRead,
  type Snapshot,
} from "../../src/lib/baseline/policy";

const require = createRequire(import.meta.url);
// Browser tooling is provided by the execution environment/CI tools directory;
// it is intentionally absent from the application package and lockfile.
const { chromium } = require(process.env.BASELINE_PLAYWRIGHT || "playwright");
const args = Object.fromEntries(
  process.argv.slice(2).map((arg) => {
    const index = arg.indexOf("=");
    return [arg.slice(2, index), arg.slice(index + 1)];
  }),
);
const mode = args.mode || "production";
if (!["production", "replay"].includes(mode))
  throw new Error("Use --mode=production or --mode=replay.");
const origin = new URL(
  args.origin ||
    (mode === "production"
      ? "https://www.ascentgroupconstruction.com"
      : "http://127.0.0.1:4176"),
).origin;
if (
  mode === "production" &&
  origin !== "https://www.ascentgroupconstruction.com"
)
  throw new Error(
    "Production capture is restricted to the public production origin.",
  );
if (
  mode === "replay" &&
  !["127.0.0.1", "localhost", "[::1]"].includes(new URL(origin).hostname)
)
  throw new Error("Replay only against a local production build.");
const out = resolve(args.out || `node_modules/.cache/baseline-${mode}`);
const baselineRoot = resolve(args.baseline || out);
await mkdir(join(out, "screenshots"), { recursive: true });
await mkdir(join(out, "fixtures"), { recursive: true });
const hash = (value: string | Buffer) =>
  createHash("sha256").update(value).digest("hex");
interface Fixture {
  file: string;
  status: number;
  headers: Record<string, string>;
}
interface Manifest {
  version: 1;
  origin: string;
  capturedAt: string;
  toolingSha: string;
  publishedSha: string | null;
  paths: string[];
  fixtures: Record<string, Fixture>;
  snapshots: Snapshot[];
  blocked: string[];
}
const previous: Manifest | null =
  mode === "replay"
    ? JSON.parse(await readFile(join(baselineRoot, "manifest.json"), "utf8"))
    : null;
if (
  previous &&
  (previous.version !== 1 ||
    !previous.paths.length ||
    !previous.snapshots.length)
)
  throw new Error("Baseline manifest is incomplete.");
const capturedAt = previous?.capturedAt || new Date().toISOString();
const manifest: Manifest = {
  version: 1,
  origin,
  capturedAt,
  toolingSha: execFileSync("git", ["rev-parse", "HEAD"], {
    encoding: "utf8",
  }).trim(),
  publishedSha: previous?.publishedSha || args["published-sha"] || null,
  paths: [],
  fixtures: previous?.fixtures || {},
  snapshots: [],
  blocked: [],
};
const normalizeError = (message: string) =>
  message
    .replaceAll(origin, "<origin>")
    .replaceAll("https://www.ascentgroupconstruction.com", "<origin>");
const proxyUrl =
  mode === "production" &&
  (process.env.BASELINE_PROXY ||
    process.env.HTTPS_PROXY ||
    process.env.HTTP_PROXY);
const proxy = proxyUrl ? new URL(proxyUrl) : null;
const browser = await chromium.launch({
  ...(proxy
    ? {
        proxy: {
          server: proxy.origin,
          username: decodeURIComponent(proxy.username),
          password: decodeURIComponent(proxy.password),
          bypass: "127.0.0.1,localhost",
        },
      }
    : {}),
  executablePath: process.env.CHROMIUM_PATH || undefined,
  headless: true,
  args:
    mode === "replay"
      ? [
          "--host-resolver-rules=MAP *.supabase.co 127.0.0.1",
          "--proxy-server=direct://",
        ]
      : [],
});
let fatal: unknown;
try {
  const discovery = await browser.newContext({ userAgent: CRAWLER_USER_AGENT });
  if (previous)
    manifest.paths = inventory(previous.paths, PUBLIC_ROUTE_PATTERNS, origin);
  else {
    const seen = new Set<string>();
    const urls: string[] = [];
    const sitemap = async (url: string, depth = 0): Promise<void> => {
      if (depth > 3 || new URL(url).origin !== origin || seen.has(url))
        throw new Error("Invalid or recursive sitemap.");
      seen.add(url);
      const response = await discovery.request.get(url, { timeout: 30_000 });
      if (response.status() === 403)
        throw new Error(`BLOCKED: HTTP 403 at ${url}`);
      if (!response.ok())
        throw new Error(`Sitemap HTTP ${response.status()}: ${url}`);
      const xml = await response.text();
      const parser = await discovery.newPage();
      const parsed = await parser.evaluate((xml) => {
        const document = new DOMParser().parseFromString(
          xml,
          "application/xml",
        );
        if (document.querySelector("parsererror"))
          throw new Error("Invalid sitemap XML.");
        return {
          kind: document.documentElement.localName,
          urls: [...document.getElementsByTagNameNS("*", "loc")].map(
            (n) => n.textContent?.trim() || "",
          ),
        };
      }, xml);
      await parser.close();
      if (!parsed.urls.length) throw new Error("Empty sitemap.");
      if (parsed.kind === "sitemapindex")
        for (const child of parsed.urls) await sitemap(child, depth + 1);
      else if (parsed.kind === "urlset") urls.push(...parsed.urls);
      else throw new Error("Unknown sitemap root.");
    };
    await sitemap(origin + "/sitemap.xml");
    manifest.paths = inventory(urls, PUBLIC_ROUTE_PATTERNS, origin);
  }
  await discovery.close();
  if (args.paths)
    manifest.paths = manifest.paths.filter((path) =>
      args.paths.split(",").includes(path),
    );
  if (!manifest.paths.length) throw new Error("No public URLs discovered.");
  console.log(
    `Capture ${mode}: ${manifest.paths.length} URLs at 1440 and 390px.`,
  );
  for (const width of [1440, 390]) {
    const context = await browser.newContext({
      viewport: { width, height: 900 },
      deviceScaleFactor: 1,
      userAgent: CRAWLER_USER_AGENT,
      reducedMotion: "reduce",
      serviceWorkers: "block",
      locale: "en-CA",
      timezoneId: "America/Toronto",
    });
    await context.addCookies([
      {
        name: "cookie-consent",
        value: "rejected",
        url: origin,
        sameSite: "Lax",
      },
    ]);
    await context.addInitScript(
      ({ appOrigin, time }: { appOrigin: string; time: number }) => {
        if (location.origin !== appOrigin) return;
        // Mock Date alone. Playwright's clock installation also replaces timers,
        // which would undo the periodic-callback suppression below at navigation.
        const NativeDate = Date;
        window.Date = new Proxy(NativeDate, {
          construct(target, values, constructor) {
            return Reflect.construct(
              target,
              values.length ? values : [time],
              constructor,
            );
          },
          apply() {
            return new NativeDate(time).toString();
          },
          get(target, property, receiver) {
            return property === "now"
              ? () => time
              : Reflect.get(target, property, receiver);
          },
        });
        // The homepage deliberately samples projects randomly. Fix randomness in
        // the capture browser only, so a refresh cannot masquerade as a regression.
        Math.random = () => 0.3141592653589793;
        // Reduced motion does not stop every site's rotating statistic/gallery.
        // Keep interval IDs valid, but suppress periodic callbacks in this browser.
        const interval = window.setInterval.bind(window);
        window.setInterval = ((_handler: TimerHandler, delay?: number) =>
          interval(() => {}, delay)) as typeof window.setInterval;
        localStorage.setItem("cookie-consent", "rejected");
        sessionStorage.setItem("deployment-check-done", "true");
      },
      { appOrigin: origin, time: new Date(capturedAt).getTime() },
    );
    // Prevent all WebSocket activity, including Realtime, in both modes.
    await context.routeWebSocket("**/*", (socket) => socket.close());
    const missing = new Set<string>();
    await context.route("**/*", async (route) => {
      const request = route.request(),
        url = new URL(request.url()),
        method = request.method();
      if (url.protocol === "data:" || url.protocol === "blob:")
        return route.continue();
      const denied = async (reason: string) => {
        manifest.blocked.push(
          `${method} ${url.origin}${url.pathname}: ${reason}`,
        );
        return route.fulfill({
          status: 403,
          contentType: "text/plain",
          body: "Blocked by the read-only baseline crawler",
          headers: { "access-control-allow-origin": "*" },
        });
      };
      if (!["GET", "HEAD", "OPTIONS"].includes(method))
        return denied("mutations prohibited");
      if (blockedHost(url)) return denied("analytics/maps/geolocation");
      if (
        url.hostname.endsWith(".supabase.co") &&
        !publicBackendRead(url, method)
      )
        return denied("not a public content read");
      if (method === "OPTIONS")
        return route.fulfill({
          status: 204,
          headers: {
            "access-control-allow-origin": "*",
            "access-control-allow-headers": "*",
            "access-control-allow-methods": "GET,HEAD,OPTIONS",
          },
        });
      if (url.origin === origin) {
        // Local application assets must come from the PR, never from the baseline.
        if (mode === "replay") return route.continue();
        const response = await route.fetch();
        if (response.status() === 403)
          fatal = new Error(
            `BLOCKED: HTTP 403 at ${url.origin}${url.pathname}`,
          );
        return route.fulfill({ response });
      }
      const headers = request.headers();
      const key =
        method +
        " " +
        url.toString() +
        " " +
        (headers.accept || "") +
        " " +
        (headers.range || "");
      if (mode === "replay") {
        const fixture = manifest.fixtures[key];
        if (!fixture) {
          missing.add(`${method} ${url.origin}${url.pathname}`);
          return denied("missing recorded public fixture");
        }
        if (!/^[a-f0-9]{64}\.body$/.test(fixture.file))
          throw new Error("Invalid fixture filename.");
        return route.fulfill({
          status: fixture.status,
          headers: fixture.headers,
          body: await readFile(join(baselineRoot, "fixtures", fixture.file)),
        });
      }
      const response = await route.fetch();
      const body = await response.body(),
        file = hash(body) + ".body";
      await writeFile(join(out, "fixtures", file), body);
      const responseHeaders = response.headers();
      manifest.fixtures[key] = {
        file,
        status: response.status(),
        headers: {
          "content-type":
            responseHeaders["content-type"] || "application/octet-stream",
          ...(responseHeaders["content-range"]
            ? { "content-range": responseHeaders["content-range"] }
            : {}),
          "access-control-allow-origin": "*",
          "access-control-expose-headers": "content-range",
        },
      };
      return route.fulfill({ response });
    });
    for (const path of manifest.paths) {
      const page = await context.newPage();
      const pageErrors: string[] = [],
        consoleErrors: string[] = [],
        scripts = new Set<string>();
      page.on("pageerror", (error) =>
        pageErrors.push(normalizeError(error.message)),
      );
      page.on("console", (message) => {
        if (message.type() === "error")
          consoleErrors.push(normalizeError(message.text()));
      });
      page.on("request", (request) => {
        if (
          request.resourceType() === "script" &&
          new URL(request.url()).origin === origin
        )
          scripts.add(new URL(request.url()).pathname);
      });
      const response = await page.goto(origin + path, {
        waitUntil: "networkidle",
        timeout: 45_000,
      });
      if (response?.status() === 403 || fatal)
        throw fatal || new Error(`BLOCKED: HTTP 403 at ${path}`);
      await page.waitForSelector("h1", { timeout: 25_000 });
      await page.evaluate(async () => {
        await document.fonts.ready;
      });
      await page.addStyleTag({
        content:
          "*,*::before,*::after{animation:none!important;transition:none!important;caret-color:transparent!important;scroll-behavior:auto!important}",
      });
      // Reveal in-view/lazy sections before taking a full-page screenshot.
      await page.evaluate(async () => {
        for (
          let top = 0;
          top < Math.min(document.documentElement.scrollHeight, 30_000);
          top += innerHeight * 0.8
        ) {
          scrollTo(0, top);
          await new Promise((resolve) => setTimeout(resolve, 80));
        }
        scrollTo(0, 0);
        document.querySelectorAll("video").forEach((video) => {
          video.pause();
          video.currentTime = 0;
        });
        // A full-page screenshot can include lazy thumbnails that have never
        // entered a viewport. Load them explicitly rather than capture races.
        for (const image of document.images) {
          image.decoding = "sync";
          image.loading = "eager";
        }
      });
      await page.waitForLoadState("networkidle", { timeout: 30_000 });
      await page.waitForFunction(
        () => [...document.images].every((image) => image.complete),
        undefined,
        { timeout: 15_000 },
      );
      await page.evaluate(async () => {
        await Promise.all(
          [...document.images].map((image) => image.decode().catch(() => {})),
        );
        // Give every decoded image a real viewport paint before Chromium takes
        // the full-page bitmap, including galleries far below the fold.
        for (
          let top = 0;
          top < Math.min(document.documentElement.scrollHeight, 30_000);
          top += innerHeight * 0.8
        ) {
          scrollTo(0, top);
          await new Promise((resolve) => setTimeout(resolve, 80));
        }
        scrollTo(0, 0);
        await new Promise((resolve) =>
          requestAnimationFrame(() => requestAnimationFrame(resolve)),
        );
      });
      await page.waitForTimeout(250);
      if (args.debug)
        console.log(
          JSON.stringify(
            await page.evaluate(() => ({
              interval: window.setInterval.toString(),
              images: [...document.images]
                .filter(
                  (image) =>
                    image.getClientRects().length &&
                    getComputedStyle(image).opacity === "0",
                )
                .map((image) => ({
                  path: new URL(image.currentSrc || image.src).pathname,
                  complete: image.complete,
                  width: image.naturalWidth,
                })),
            })),
          ),
        );
      const metadata = await page.evaluate(() => ({
        visibleText: document.body.innerText,
        title: document.title,
        h1: [...document.querySelectorAll("h1")].map(
          (node) => node.textContent || "",
        ),
        canonical:
          document
            .querySelector('link[rel="canonical"]')
            ?.getAttribute("href") || null,
        jsonLd: [
          ...document.querySelectorAll('script[type="application/ld+json"]'),
        ]
          .map((node) => node.textContent)
          .join("\n"),
      }));
      const screenshot = `${hash(path).slice(0, 16)}-${width}.png`;
      await page.screenshot({
        path: join(out, "screenshots", screenshot),
        fullPage: true,
        animations: "disabled",
      });
      const final = new URL(page.url());
      manifest.snapshots.push({
        path,
        width,
        status: response?.status() || 0,
        finalPath: final.pathname + final.search,
        visibleText: metadata.visibleText,
        title: metadata.title,
        h1: metadata.h1,
        canonical: metadata.canonical,
        jsonLdHash: hash(metadata.jsonLd),
        screenshot,
        pageErrors: [...new Set(pageErrors)].sort(),
        consoleErrors: [...new Set(consoleErrors)].sort(),
        scripts: [...scripts].sort(),
      });
      await page.close();
      console.log(`${width}px ${path}: captured`);
    }
    await context.close();
    if (missing.size)
      throw new Error(
        `Replay is incomplete: ${missing.size} missing public response fixtures. Refresh or declare the changed data reads; never use a live fallback.`,
      );
  }
} catch (error) {
  fatal = error;
} finally {
  await browser.close();
  manifest.blocked = [...new Set(manifest.blocked)];
  await writeFile(
    join(out, "manifest.json"),
    JSON.stringify(manifest, null, 2) + "\n",
  );
  const summary = {
    mode,
    status: fatal ? "failed" : "captured",
    urls: manifest.paths.length,
    captures: manifest.snapshots.length,
    expectedCaptures: manifest.paths.length * 2,
    blockedRequests: manifest.blocked.length,
    existingPageErrors: manifest.snapshots.filter(
      (page) => page.pageErrors.length,
    ).length,
    existingConsoleErrors: manifest.snapshots.filter(
      (page) => page.consoleErrors.length,
    ).length,
    error:
      fatal instanceof Error ? fatal.message : fatal ? String(fatal) : null,
  };
  await writeFile(
    join(out, "summary.json"),
    JSON.stringify(summary, null, 2) + "\n",
  );
  console.log(JSON.stringify(summary));
}
if (fatal) throw fatal;
