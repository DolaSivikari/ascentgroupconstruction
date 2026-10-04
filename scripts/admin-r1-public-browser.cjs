const fs = require("node:fs");
const assert = require("node:assert/strict");
const path = require("node:path");
const root = path.resolve(__dirname, "..");
const puppeteer = require(process.env.PUPPETEER_CORE_PATH || "puppeteer-core");
const base = process.env.R1_PREVIEW_ORIGIN || "http://127.0.0.1:4176";
assert(
  ["127.0.0.1", "localhost", "[::1]"].includes(new URL(base).hostname),
  "Run only against a local production preview.",
);
const phase = process.argv[2] || "before";
const out =
  process.env.R1_QA_OUTPUT ||
  path.join(root, `node_modules/.cache/r1-${phase}`);
fs.mkdirSync(out, { recursive: true });
const hero = fs
  .readdirSync(path.join(root, "dist/assets"))
  .find((name) => /eifs.*\.(jpg|png|webp)$/.test(name));
const project = {
  id: "r1-project",
  title: "Preview verification project",
  slug: "r1-fixture",
  summary: "Synthetic browser verification content.",
  description: "<p>Saved project content for browser verification.</p>",
  featured_image: hero ? "/assets/" + hero : null,
  publish_state: "published",
  content_blocks: [],
  before_images: [],
  after_images: [],
  team_credits: [],
  trades_coordinated: null,
  peak_workforce: null,
  on_time_completion: null,
  on_budget: null,
  safety_incidents: null,
  tags: [],
};
let browser, activePage;
(async () => {
  browser = await puppeteer.launch({
    executablePath: process.env.CHROMIUM_PATH || "/usr/bin/chromium",
    headless: true,
    args: [
      "--no-sandbox",
      "--disable-dev-shm-usage",
      "--host-resolver-rules=MAP *.supabase.co 127.0.0.1",
      "--proxy-server=direct://",
    ],
  });
  const page = await browser.newPage();
  activePage = page;
  const errors = [];
  const requests = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.setRequestInterception(true);
  page.on("request", (request) => {
    const url = new URL(request.url());
    if (url.origin === base || url.protocol === "data:")
      return request.continue();
    if (request.method() === "OPTIONS")
      return request.respond({
        status: 204,
        headers: {
          "access-control-allow-origin": "*",
          "access-control-allow-methods": "GET,POST,PATCH,DELETE,HEAD,OPTIONS",
          "access-control-allow-headers":
            request.headers()["access-control-request-headers"] || "*",
        },
        body: "",
      });
    if (url.pathname.startsWith("/rest/v1/")) {
      const table = url.pathname.split("/").pop();
      requests.push({ table, select: url.searchParams.get("select") });
      let data = [];
      if (
        table === "projects" &&
        url.searchParams.get("slug") === "eq.r1-fixture"
      )
        data = project;
      if (table === "contact_page_settings")
        data = {
          id: "contact-settings",
          office_address: "2 Jody Ave, North York, ON M3N 1H1",
          weekday_hours: "Monday to Friday: 8:00 AM – 5:00 PM",
          saturday_hours: "By appointment",
          sunday_hours: "Closed",
          map_embed_url: null,
          is_active: true,
        };
      if (table === "about_page_settings")
        data = {
          licenses: [],
          memberships: [],
          certifications: [],
          insurance: {},
        };
      if (table === "site_settings" || table === "footer_settings") data = null;
      return request.respond({
        status: 200,
        contentType: "application/json",
        headers: {
          "access-control-allow-origin": "*",
          "content-range": "0-0/0",
        },
        body: JSON.stringify(data),
      });
    }
    if (url.pathname.startsWith("/auth/"))
      return request.respond({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ user: null }),
      });
    return request.respond({ status: 404, body: "" });
  });
  await page.evaluateOnNewDocument(() => {
    localStorage.setItem("cookie-consent", "rejected");
  });
  const pages = [
    ["project", "/projects/r1-fixture"],
    ["certifications", "/company/certifications-insurance"],
    ["contact", "/contact"],
    ["about", "/about"],
    ["privacy", "/privacy"],
  ];
  const results = [];
  for (const width of [1440, 390]) {
    await page.setViewport({ width, height: 900 });
    for (const [name, path] of pages) {
      await page.goto(base + path, { waitUntil: "networkidle0" });
      await page.evaluate(() => {
        const style = document.createElement("style");
        style.textContent =
          "*{animation:none!important;transition:none!important}";
        document.head.append(style);
        document.querySelectorAll("video").forEach((v) => v.pause());
      });
      if (name === "project")
        await page.waitForFunction(() =>
          document.body.textContent.includes(
            "Synthetic browser verification content.",
          ),
        );
      await page.screenshot({
        path: `${out}/${name}-${width}.png`,
        fullPage: true,
      });
      const state = await page.evaluate(() => ({
        width: innerWidth,
        scrollWidth: document.documentElement.scrollWidth,
        performanceCard: [...document.querySelectorAll("h3")].some(
          (n) => n.textContent === "Performance",
        ),
        text: document.body.innerText,
      }));
      assert(
        state.scrollWidth <= width,
        `${name} overflow ${state.scrollWidth}`,
      );
      if (name === "project")
        assert.equal(state.performanceCard, phase === "before");
      fs.writeFileSync(`${out}/${name}-${width}.txt`, state.text);
      results.push({
        name,
        width,
        scrollWidth: state.scrollWidth,
        performanceCard: state.performanceCard,
      });
    }
  }
  assert.deepEqual(errors, []);
  fs.writeFileSync(
    out + "/results.json",
    JSON.stringify({ phase, results, errors, requests }, null, 2),
  );
  console.log(
    JSON.stringify({ phase, pages: results.length, errors: errors.length }),
  );
  await browser.close();
})().catch(async (e) => {
  console.error(e.stack);
  if (activePage) {
    console.error(
      await activePage.evaluate(() => ({
        url: location.href,
        text: document.body.innerText.slice(0, 1800),
      })),
    );
    await activePage.screenshot({ path: out + "/failure.png", fullPage: true });
  }
  if (browser) await browser.close();
  process.exit(1);
});
