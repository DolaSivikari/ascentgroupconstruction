// Offline hero/route verification. External requests never reach a backend.
const fs = require("node:fs"),
  path = require("node:path"),
  assert = require("node:assert/strict"),
  crypto = require("node:crypto");
const ts = require("typescript");
const puppeteer = require(process.env.PUPPETEER_CORE_PATH || "puppeteer-core");
const root = path.resolve(__dirname, "..");
const origin = process.env.HERO_QA_ORIGIN || "http://127.0.0.1:4194";
const dist = process.env.HERO_QA_DIST || path.join(root, "dist");
const output =
  process.env.HERO_QA_OUTPUT ||
  path.join(root, "node_modules/.cache/hero-headers");
assert.equal(new URL(origin).hostname, "127.0.0.1");
const loadData = (file) => {
  const exports = {};
  new Function(
    "exports",
    ts.transpileModule(fs.readFileSync(path.join(root, file), "utf8"), {
      compilerOptions: { module: ts.ModuleKind.CommonJS },
    }).outputText,
  )(exports);
  return exports;
};
const { SERVICE_REGISTRY } = loadData("src/data/service-registry.ts");
const { serviceAreaCities } = loadData("src/data/service-area-cities.ts");
const mainSource = fs
  .readFileSync(path.join(root, "src/data/page-headers.test.ts"), "utf8")
  .match(/const mainPaths = \[([\s\S]*?)\];/)[1];
const main = [...mainSource.matchAll(/"(\/[^"\n]*)"/g)].map(
  (match) => match[1],
);
const projectSlugs = [
  "65-westmount-avenue",
  "67-edgecroft-rd-etobicoke",
  "blackhurst-cultural-centre-",
  "caf-luka",
  "comfort-inn-suites",
  "dunnville-secondary-school",
  "innisfil-catholic-school",
  "kw-habilitation-affordable-housing",
  "oakley-ridge",
  "queensland-condos",
  "york-region-warehouse",
];
const articleSlugs = [
  "early-signs-your-building-envelope-needs-attention",
  "eifs-vs-stucco-what-building-owners-need-to-know",
  "how-general-contractors-should-evaluate-specialty-trade-partner",
  "toronto-property-manager-maintenance-guide",
  "what-property-managers-should-prepare-before-envelope-restoration",
  "why-self-performed-work-changes-quality-cost-accountability",
];
const paths = [
  ...main,
  ...SERVICE_REGISTRY.map((s) => s.path),
  ...serviceAreaCities.map(
    (city) => "/service-areas/" + city.toLowerCase().replace(/ /g, "-"),
  ),
  ...projectSlugs.map((slug) => "/projects/" + slug),
  ...articleSlugs.map((slug) => "/blog/" + slug),
].sort();
assert.equal(paths.length, 85);
assert.equal(new Set(paths).size, 85);
const id = (n) => `00000000-0000-4000-8000-${String(n).padStart(12, "0")}`;
const title = (slug) => slug.replace(/-/g, " ");
const stamp = "2026-10-01T12:00:00Z";
const tables = {
  services: SERVICE_REGISTRY.filter((s) => s.source === "db").map((s, i) => ({
    id: id(i + 1),
    slug: s.slug,
    name: s.navLabel,
    description:
      "<p>Synthetic service details for offline header verification.</p>",
    service_overview: "Synthetic service overview.",
    category: s.category,
    publish_state: "published",
    is_visible: true,
    featured_image: "/src/assets/heroes/legacy.jpg",
    process_steps: [],
    what_we_provide: [],
    typical_applications: [],
    key_benefits: [],
    faq_items: [],
    seo_keywords: [],
    created_at: stamp,
  })),
  projects: projectSlugs.map((slug, i) => ({
    id: id(i + 100),
    slug,
    title: title(slug),
    publish_state: "published",
    is_visible: true,
    featured_image: "/brand/icon-monument.png",
    description: "<p>Synthetic project details.</p>",
    summary: "Synthetic portfolio fixture.",
    category: "Commercial",
    location: "Toronto",
    created_at: stamp,
    updated_at: stamp,
    content_blocks: [],
    team_credits: [],
  })),
  blog_posts: articleSlugs.map((slug, i) => ({
    id: id(i + 200),
    slug,
    title: title(slug),
    publish_state: "published",
    featured_image: "/src/assets/heroes/legacy.jpg",
    content: "<p>Synthetic article content.</p>",
    summary: "Synthetic editorial fixture.",
    category: "Building Envelope",
    content_type: "article",
    tags: [],
    created_at: stamp,
    updated_at: stamp,
    published_at: stamp,
  })),
};
const matches = (row, params) =>
  [...params].every(([key, value]) => {
    if (["select", "order", "limit", "offset", "or"].includes(key)) return true;
    if (value.startsWith("eq.")) return String(row[key]) === value.slice(3);
    if (value.startsWith("neq.")) return String(row[key]) !== value.slice(4);
    if (value.startsWith("in.("))
      return value.slice(4, -1).split(",").includes(String(row[key]));
    return true;
  });
fs.mkdirSync(path.join(output, "screenshots"), { recursive: true });
const errors = [],
  writes = [],
  snapshots = [],
  checks = [];
(async () => {
  const browser = await puppeteer.launch({
    executablePath: process.env.CHROMIUM_PATH || "/usr/bin/chromium",
    args: ["--no-sandbox", "--disable-dev-shm-usage"],
  });
  try {
    await Promise.all(
      [1440, 390].map(async (width) => {
        const context = await browser.createBrowserContext();
        const page = await context.newPage();
        await page.setViewport({ width, height: 1000 });
        await page.emulateMediaFeatures([
          { name: "prefers-reduced-motion", value: "reduce" },
        ]);
        await page.evaluateOnNewDocument(() => {
          // Existing public project selections shuffle on mount. Hold their
          // selection constant so image changes cannot hide behind randomness.
          Math.random = () => 0.5;
          localStorage.setItem("cookie-consent", "rejected");
          sessionStorage.setItem("deployment-check-done", "true");
          window.WebSocket = class {
            static CONNECTING = 0;
            static OPEN = 1;
            static CLOSING = 2;
            static CLOSED = 3;
            readyState = 0;
            addEventListener() {}
            removeEventListener() {}
            send() {}
            close() {
              this.readyState = 3;
            }
          };
        });
        const pageErrors = [],
          consoleErrors = [];
        page.on("pageerror", (error) => pageErrors.push(error.message));
        page.on("console", (message) => {
          if (message.type() === "error") consoleErrors.push(message.text());
        });
        await page.setRequestInterception(true);
        page.on("request", async (request) => {
          try {
            const url = new URL(request.url()),
              method = request.method();
            if (
              url.origin === origin ||
              ["data:", "blob:"].includes(url.protocol)
            )
              return request.continue();
            const headers = {
              "access-control-allow-origin": origin,
              "access-control-allow-headers": "*",
              "access-control-allow-methods": "*",
              "access-control-expose-headers": "content-range",
              "content-type": "application/json",
            };
            const respond = (body, status = 200, extra = {}) =>
              request.respond({
                status,
                headers: { ...headers, ...extra },
                body: method === "HEAD" ? "" : JSON.stringify(body),
              });
            if (method === "OPTIONS") return respond({});
            if (
              method === "POST" &&
              /\/rpc\/(get_active_featured_services|get_active_promotions)$/.test(
                url.pathname,
              )
            )
              return respond([]);
            if (!["GET", "HEAD"].includes(method)) {
              writes.push({ path: url.pathname, method });
              return respond({}, 405);
            }
            if (url.pathname.startsWith("/rest/v1/")) {
              const table = url.pathname.split("/").pop();
              let rows = (tables[table] || []).filter((row) =>
                matches(row, url.searchParams),
              );
              const count = rows.length;
              const offset = Number(url.searchParams.get("offset") || 0),
                limit = Number(url.searchParams.get("limit") || count);
              rows = rows.slice(offset, offset + limit);
              return respond(
                request.headers().accept?.includes("vnd.pgrst.object")
                  ? rows[0] || null
                  : rows,
                200,
                { "content-range": count ? `0-${count - 1}/${count}` : "*/0" },
              );
            }
            if (request.resourceType() === "image")
              return request.respond({
                status: 200,
                contentType: "image/png",
                body: fs.readFileSync(
                  path.join(root, "public/brand/icon-monument.png"),
                ),
              });
            return request.respond({ status: 200, body: "" });
          } catch (error) {
            errors.push(error.message);
            await request.abort().catch(() => {});
          }
        });
        for (const pathname of paths) {
          pageErrors.length = 0;
          consoleErrors.length = 0;
          const response = await page.goto(origin + pathname, {
            waitUntil: "domcontentloaded",
          });
          await page.waitForSelector("h1");
          // The old city build has a confirmed repeated-read loop. Record network
          // readiness rather than requiring that buggy baseline to become idle.
          const networkSettled = await page
            .waitForNetworkIdle({ idleTime: 150, timeout: 1500 })
            .then(
              () => true,
              () => false,
            );
          if (pathname === "/") {
            // Wait for the existing lazy sections and 1.2-second stat counter.
            await page.waitForFunction(() => {
              const text = document.body.innerText;
              return (
                !text.includes("Loading projects...") &&
                !text.includes("Loading...") &&
                /15\+\s*YEARS EXPERIENCE/.test(text)
              );
            });
          }
          await page.evaluate(async () => {
            await document.fonts.ready;
            await Promise.all(
              [...document.images]
                .filter(
                  (image) => image.getBoundingClientRect().top < innerHeight,
                )
                .map((image) => image.decode().catch(() => {})),
            );
          });
          const result = await page.evaluate(() => {
            const hero = document.querySelector("[data-hero-image-state]");
            const image = hero?.querySelector("img");
            return {
              finalPath: location.pathname,
              visibleText: document.body.innerText.replace(/\s+/g, " ").trim(),
              title: document.title,
              h1: [...document.querySelectorAll("h1")].map((node) =>
                node.textContent.trim(),
              ),
              canonical:
                document.querySelector('link[rel="canonical"]')?.href || null,
              jsonLd: [
                ...document.querySelectorAll(
                  'script[type="application/ld+json"]',
                ),
              ]
                .map((node) => node.textContent)
                .join("\n"),
              scripts: performance
                .getEntriesByType("resource")
                .map((entry) => entry.name)
                .filter((value) => /\/assets\/[^/]+\.js$/.test(value))
                .map((value) => new URL(value).pathname),
              heroState: hero?.getAttribute("data-hero-image-state"),
              heroAlt: image?.alt,
              heroImage: image?.getAttribute("src"),
              overflow: document.documentElement.scrollWidth > innerWidth,
              brokenHero:
                !!hero && (!image || !image.complete || !image.naturalWidth),
            };
          });
          // A relative canonical resolves against the local preview port.
          // Normalize only that fixture origin; preserve production canonicals.
          if (result.canonical?.startsWith(origin + "/"))
            result.canonical = result.canonical.replace(
              origin,
              "http://127.0.0.1",
            );
          assert.equal(
            result.finalPath,
            pathname,
            "Unexpected redirect: " + pathname,
          );
          assert.equal(
            result.overflow,
            false,
            "Overflow: " + pathname + " at " + width,
          );
          assert.equal(result.brokenHero, false, "Broken hero: " + pathname);
          assert.equal(
            pageErrors.length,
            0,
            pathname + ": " + JSON.stringify(pageErrors),
          );
          const filename =
            (pathname === "/"
              ? "home"
              : pathname.slice(1).replace(/\//g, "--")) +
            "-" +
            width +
            ".png";
          await page.screenshot({
            path: path.join(output, "screenshots", filename),
          });
          snapshots.push({
            path: pathname,
            width,
            status: response.status(),
            finalPath: result.finalPath,
            visibleText: result.visibleText,
            title: result.title,
            h1: result.h1,
            canonical: result.canonical,
            jsonLdHash: crypto
              .createHash("sha256")
              .update(result.jsonLd)
              .digest("hex"),
            scripts: result.scripts,
            screenshot: filename,
            pageErrors: [...pageErrors],
            consoleErrors: [...consoleErrors],
            capturedAt: new Date().toISOString(),
          });
          checks.push({
            path: pathname,
            width,
            heroState: result.heroState,
            heroAlt: result.heroAlt,
            heroImage: result.heroImage,
            overflow: result.overflow,
            networkSettled,
          });
          console.log(width, pathname, result.heroState || "custom/plain");
        }
        await context.close();
      }),
    );
    assert.equal(errors.length, 0, JSON.stringify(errors));
    assert.equal(writes.length, 0, JSON.stringify(writes));
    fs.writeFileSync(
      path.join(output, "manifest.json"),
      JSON.stringify({ origin, paths, snapshots }, null, 2) + "\n",
    );
    fs.writeFileSync(
      path.join(output, "report.json"),
      JSON.stringify(
        {
          scope:
            "Offline synthetic public content; viewport/header screenshots, not full-page/live replay",
          paths: paths.length,
          captures: snapshots.length,
          widths: [1440, 390],
          errors,
          writes,
          checks,
          dist,
        },
        null,
        2,
      ) + "\n",
    );
    console.log(
      "PASS",
      snapshots.length,
      "route/header captures; no runtime errors, mutations or broken heroes.",
    );
  } finally {
    await browser.close();
  }
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
