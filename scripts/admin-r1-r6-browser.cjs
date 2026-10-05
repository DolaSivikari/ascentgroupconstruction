const fs = require("node:fs"),
  assert = require("node:assert/strict");
const path = require("node:path");
const root = process.env.QA_SOURCE_ROOT || path.resolve(__dirname, "..");
const puppeteer = require(process.env.PUPPETEER_CORE_PATH || "puppeteer-core");
const ts = require("typescript");
const filterSource = fs.readFileSync(
  path.join(root, "src/lib/leads/api.test.ts"),
  "utf8",
);
const filterHelpers = filterSource.slice(
  filterSource.indexOf("function split("),
  filterSource.indexOf("beforeEach(()"),
);
const matches = new Function(
  ts.transpileModule(filterHelpers, {
    compilerOptions: { target: ts.ScriptTarget.ES2022 },
  }).outputText + ";return matches;",
)();
const base = process.env.R1_PREVIEW_ORIGIN || "http://127.0.0.1:4182",
  out =
    process.env.R1_QA_OUTPUT || path.join(root, "node_modules/.cache/r1-admin");
assert(
  ["127.0.0.1", "localhost", "[::1]"].includes(new URL(base).hostname),
  "Run only against a local production preview.",
);
fs.mkdirSync(out, { recursive: true });
const env = fs.readFileSync(path.join(root, ".env"), "utf8");
const backend = /VITE_SUPABASE_URL=["']?([^"'\n]+)/.exec(env)[1],
  ref = new URL(backend).hostname.split(".")[0];
const id = (n) => `00000000-0000-4000-8000-${String(n).padStart(12, "0")}`,
  uid = id(999);
const hero = fs
  .readdirSync(path.join(root, "dist/assets"))
  .find((name) => /eifs.*\.(jpg|png|webp)$/.test(name));
const project = {
  id: id(1),
  title: "Browser fixture project",
  slug: "browser-fixture-project",
  publish_state: "published",
  summary: "Synthetic project verification.",
  description: "<p>Saved project content.</p>",
  featured_image: "/assets/" + hero,
  start_date: "2026-10-01",
  completion_date: "2026-10-02",
  trades_coordinated: null,
  peak_workforce: null,
  on_time_completion: null,
  on_budget: null,
  safety_incidents: null,
  team_credits: [],
  content_blocks: [],
  created_at: "2026-10-04T00:00:00Z",
};
const draftPost = {
  id: id(2),
  title: "Browser fixture draft",
  slug: "browser-fixture-draft",
  content: "<p>Draft article content.</p>",
  summary: "Synthetic draft verification.",
  sector: "Buildings",
  source: "Fixture source",
  is_pinned: true,
  read_time_minutes: 7,
  publish_state: "draft",
  content_type: "article",
  created_at: "2026-10-04T00:00:00Z",
  tags: [],
};
const tables = {
  projects: [project],
  blog_posts: [draftPost],
  project_images: [
    {
      id: id(3),
      project_id: project.id,
      url:
        backend +
        "/storage/v1/object/public/project-images/" +
        project.id +
        "/gallery/fixture.jpg",
      category: "gallery",
      display_order: 0,
      featured: false,
      caption: "Gallery fixture",
    },
  ],
  project_services: [],
  services: [],
  hero_slides: [
    {
      id: id(4),
      display_order: 1,
      is_active: true,
      headline: "Fixture hero",
      subheadline: "Fixture hero subtitle",
      primary_cta_text: "Submit RFP",
      primary_cta_url: "/submit-rfp",
      poster_url: "/assets/" + hero,
    },
  ],
  why_choose_us_items: [],
  site_settings: [
    {
      id: id(10),
      is_active: true,
      company_name: "Ascent Group Construction",
      company_tagline: null,
      phone: "647-528-6804",
      email: "info@ascentgroupconstruction.com",
      address: "2 Jody Ave, North York, ON M3N 1H1",
      founded_year: null,
      social_links: {},
    },
  ],
  contact_page_settings: [
    {
      id: id(11),
      is_active: true,
      office_address: "2 Jody Ave, North York, ON M3N 1H1",
      weekday_hours: "Saved weekday hours",
      saturday_hours: "By appointment",
      sunday_hours: "Closed",
      map_embed_url: null,
    },
  ],
  about_page_settings: [],
  footer_settings: [],
  user_roles: [
    { id: id(20), user_id: uid, role: "super_admin" },
    { id: id(21), user_id: id(998), role: "admin" },
  ],
  profiles: [
    { id: uid, email: "admin@example.test", full_name: "Fixture owner" },
    {
      id: id(998),
      email: "team@example.test",
      full_name: "Fixture team member",
    },
  ],
  error_logs: [],
  performance_metrics: [],
  contact_submissions: [],
  quote_requests: [],
  rfp_submissions: [],
  prequalification_downloads: [],
  resume_submissions: [],
  newsletter_subscribers: [],
  admin_notifications: [],
  analytics_snapshots: [],
  google_auth_tokens: [],
  search_console_data: [],
};
let browser,
  page,
  sequence = 500,
  failProject = false,
  failMonitoring = false,
  failToken = false,
  role = "super_admin";
const requests = [],
  writes = [],
  errors = [],
  checks = [],
  documents = [];
const check = (label) => {
  checks.push(label);
  console.log(label);
};
const publicProjection = [
  "office_address",
  "weekday_hours",
  "saturday_hours",
  "sunday_hours",
  "map_embed_url",
  "is_active",
  "id",
];
function filtered(rows, url) {
  return rows.filter((row) =>
    [...url.searchParams].every(
      ([field, value]) =>
        [
          "select",
          "order",
          "limit",
          "offset",
          "on_conflict",
          "columns",
        ].includes(field) ||
        matches(row, field === "or" ? `or${value}` : `${field}.${value}`),
    ),
  );
}
async function attach(p, admin) {
  p.on("pageerror", (e) => errors.push(e.message));
  await p.evaluateOnNewDocument(
    (base, ref, uid, admin) => {
      if (location.origin !== base) return;
      localStorage.setItem("cookie-consent", "rejected");
      sessionStorage.setItem("deployment-check-done", "true");
      if (admin) {
        const token =
          btoa(JSON.stringify({ alg: "HS256", typ: "JWT" })) +
          "." +
          btoa(
            JSON.stringify({ sub: uid, exp: 4102444800, aud: "authenticated" }),
          ) +
          ".fixture";
        localStorage.setItem(
          `sb-${ref}-auth-token`,
          JSON.stringify({
            access_token: token,
            refresh_token: "fixture-refresh",
            expires_at: 4102444800,
            expires_in: 3600,
            token_type: "bearer",
            user: {
              id: uid,
              email: "admin@example.test",
              aud: "authenticated",
              role: "authenticated",
            },
          }),
        );
      }
    },
    base,
    ref,
    uid,
    admin,
  );
  await p.setRequestInterception(true);
  p.on("request", async (request) => {
    try {
      const url = new URL(request.url()),
        method = request.method();
      if (url.origin === base || url.protocol === "data:") {
        if (request.isNavigationRequest() && request.frame() === p.mainFrame())
          documents.push({ admin, path: url.pathname });
        return request.continue();
      }
      if (!url.hostname.endsWith(".supabase.co"))
        return request.respond({ status: 404, body: "" });
      const headers = {
        "access-control-allow-origin": base,
        "access-control-allow-headers": "*",
        "access-control-allow-methods": "GET,HEAD,POST,PATCH,DELETE,OPTIONS",
        "access-control-expose-headers": "content-range",
        "content-type": "application/json",
      };
      const respond = (status, body) =>
        request.respond({ status, headers, body: JSON.stringify(body) });
      if (method === "OPTIONS") return respond(200, {});
      requests.push({
        method,
        path: url.pathname,
        select: url.searchParams.get("select"),
        admin,
      });
      if (url.pathname === "/auth/v1/user")
        return respond(200, {
          id: uid,
          email: "admin@example.test",
          role: "authenticated",
          aud: "authenticated",
        });
      if (url.pathname.startsWith("/storage/v1/object/list/")) {
        const opts = JSON.parse(request.postData() || "{}");
        const files = opts.prefix
          ? [
              {
                id: "image",
                name: "fixture.jpg",
                updated_at: "2026-10-04T00:00:00Z",
                metadata: { size: 10000 },
              },
            ]
          : [
              { id: null, name: project.id },
              {
                id: "image",
                name: "fixture-cover.jpg",
                updated_at: "2026-10-04T00:00:00Z",
                metadata: { size: 10000 },
              },
            ];
        return respond(
          200,
          files.filter(
            (file) => !opts.search || file.name.includes(opts.search),
          ),
        );
      }
      if (url.pathname.startsWith("/storage/")) {
        if (method === "DELETE") {
          writes.push({
            type: "storage-delete",
            body: JSON.parse(request.postData()),
          });
          return respond(200, []);
        }
        return request.respond({
          status: 200,
          headers: { ...headers, "content-type": "image/png" },
          body: fs.readFileSync(
            path.join(root, "public/brand/icon-monument.png"),
          ),
        });
      }
      if (!url.pathname.startsWith("/rest/v1/")) return respond(404, {});
      const table = url.pathname.split("/").pop();
      if (url.pathname.includes("/rpc/")) {
        const args = JSON.parse(request.postData() || "{}");
        const rows =
          table === "get_preview_project"
            ? tables.projects
            : table === "get_preview_blog_post"
              ? tables.blog_posts
              : table === "get_preview_service"
                ? tables.services
                : [];
        return respond(
          200,
          rows.filter(
            (row) =>
              row.slug === args.p_slug && row.preview_token === args.p_token,
          ),
        );
      }
      if (!admin && table === "contact_page_settings") {
        const cols = (url.searchParams.get("select") || "")
          .split(",")
          .map((c) => c.trim());
        if (
          cols.includes("*") ||
          cols.some((c) => !publicProjection.includes(c))
        )
          return respond(403, {
            code: "42501",
            message: "Private contact columns are not granted to visitors",
          });
      }
      if (table === "error_logs" && failMonitoring)
        return respond(403, {
          code: "42501",
          message: "Fixture monitoring denied",
        });
      tables.user_roles[0].role = role;
      let source = tables[table] || [];
      let rows = filtered(source, url);
      if (method === "HEAD") {
        headers["content-range"] = `0-0/${rows.length}`;
        return request.respond({ status: 200, headers, body: "" });
      }
      if (method === "PATCH") {
        const patch = JSON.parse(request.postData());
        writes.push({
          method,
          table,
          fields: Object.keys(patch),
          payload: patch,
        });
        if (
          (table === "projects" && failProject) ||
          (Object.hasOwn(patch, "preview_token") && failToken)
        )
          return respond(403, {
            code: "42501",
            message: "Fixture write denied",
          });
        if (!rows.length)
          return respond(406, {
            code: "PGRST116",
            message: "No matching writable row",
          });
        rows.forEach((row) => Object.assign(row, patch));
      } else if (method === "DELETE") {
        writes.push({ method, table, ids: rows.map((r) => r.id) });
        tables[table] = source.filter((row) => !rows.includes(row));
      } else if (method === "POST") {
        const payload = JSON.parse(request.postData());
        writes.push({ method, table, payload });
        rows = (Array.isArray(payload) ? payload : [payload]).map((row) => ({
          ...row,
          id: row.id || id(++sequence),
          created_at: new Date().toISOString(),
        }));
        tables[table] = [...source, ...rows];
      } else if (method !== "GET")
        throw new Error(`Unexpected method ${method}`);
      headers["content-range"] =
        `0-${Math.max(rows.length - 1, 0)}/${rows.length}`;
      const order = url.searchParams.get("order");
      if (order)
        rows = [...rows].sort((a, b) => {
          const [field, direction] = order.split(".");
          return direction === "desc"
            ? String(b[field]).localeCompare(String(a[field]))
            : String(a[field]).localeCompare(String(b[field]));
        });
      rows = rows.slice(
        Number(url.searchParams.get("offset") || 0),
        Number(url.searchParams.get("offset") || 0) +
          Number(url.searchParams.get("limit") || rows.length),
      );
      if ((request.headers().accept || "").includes("vnd.pgrst.object"))
        return rows.length
          ? respond(200, rows[0])
          : respond(406, { code: "PGRST116", message: "No row" });
      return respond(200, rows);
    } catch (error) {
      errors.push(error.message);
      await request.abort();
    }
  });
}
const text = () => page.$eval("body", (n) => n.innerText);
const click = async (label, selector = "button") => {
  const handle = await page.waitForFunction(
    (label, selector) =>
      [...document.querySelectorAll(selector)].find(
        (node) =>
          node.getClientRects().length && node.textContent.trim() === label,
      ),
    {},
    label,
    selector,
  );
  await handle.click();
};
const fill = async (selector, value) =>
  page.$eval(
    selector,
    (node, value) => {
      const proto =
        node instanceof HTMLTextAreaElement
          ? HTMLTextAreaElement.prototype
          : HTMLInputElement.prototype;
      Object.getOwnPropertyDescriptor(proto, "value").set.call(node, value);
      node.dispatchEvent(new Event("input", { bubbles: true }));
    },
    value,
  );
const assertNoOverflow = async (label) => {
  const value = await page.evaluate(() => ({
    viewport: innerWidth,
    width: document.documentElement.scrollWidth,
  }));
  assert(value.width <= value.viewport, label + JSON.stringify(value));
};
async function goto(path) {
  await page.goto(base + path, { waitUntil: "networkidle0" });
}

const stamp = "2026-10-04T00:00:00Z";
project.scope = "<p>Fixture scope.</p>";
project.challenge = "<p>Fixture challenge.</p>";
project.results = "<p>Fixture result.</p>";
project.project_status = "completed";
project.tags = [];
project.updated_at = stamp;
const service = {
  id: id(60),
  name: "Fixture service",
  slug: "browser-fixture-service",
  publish_state: "published",
  category: "Building Envelope",
  short_description: "Fixture service description",
  long_description: "First line\nSecond line\n\nNew paragraph",
  service_overview: "<h2>Fixture overview</h2><p>Service text.</p>",
  featured_image: "/assets/" + hero,
  process_steps: [],
  key_benefits: [],
  faq_items: [],
  what_we_provide: [],
  typical_applications: [],
  seo_keywords: [],
  created_at: stamp,
  updated_at: stamp,
};
tables.services = [service];
tables.about_page_settings = [{ id: id(12), is_active: true }];
tables.footer_settings = [
  { id: id(13), is_active: true, social_media: {}, contact_info: {} },
];
tables.homepage_settings = [];
tables.media_asset_metadata = [];
tables.audit_log = [
  {
    id: id(70),
    object_type: "projects",
    object_id: project.id,
    action: "UPDATE",
    user_id: uid,
    created_at: stamp,
    before_state: { title: "Old fixture title" },
    after_state: { title: project.title },
  },
];
tables.email_send_log = [
  {
    id: id(71),
    created_at: stamp,
    status: "failed",
    template_name: "rfp-notification",
    recipient_email: "recipient@example.test",
    error_message: "Synthetic delivery error for recipient@example.test",
    metadata: { rfp_id: id(80) },
  },
];
tables.suppressed_emails = [];
tables.contact_submissions = [
  {
    id: id(81),
    name: "Fixture contact",
    email: "contact@example.test",
    phone: "",
    subject: "Estimate",
    message: "Fixture inquiry details",
    status: "new",
    is_read: false,
    created_at: stamp,
    updated_at: stamp,
  },
];
tables.quote_requests = [
  {
    id: id(82),
    name: "Fixture quote",
    email: "quote@example.test",
    quote_type: "estimate",
    status: "new",
    is_read: false,
    created_at: stamp,
    updated_at: stamp,
    scope_description: "Fixture quote scope",
    estimated_budget: 1000,
  },
];
tables.rfp_submissions = [
  {
    id: id(80),
    company_name: "Fixture organization",
    contact_name: "Fixture contact",
    email: "rfp@example.test",
    project_name: "Fixture bid",
    status: "new",
    is_read: false,
    created_at: stamp,
    updated_at: stamp,
  },
];
tables.documents_library = [];
draftPost.updated_at = stamp;
const adminRoutes = [
  ["dashboard", "/admin"],
  ["leads", "/admin/inbox"],
  ["projects", "/admin/projects"],
  ["project-editor", "/admin/projects/" + project.id],
  ["new-project", "/admin/projects/new"],
  ["blog", "/admin/blog"],
  ["blog-editor", "/admin/blog/" + draftPost.id],
  ["new-blog", "/admin/blog/new"],
  ["services", "/admin/services-manager"],
  ["service-editor", "/admin/services/" + service.id],
  ["new-service", "/admin/services/new"],
  ["documents", "/admin/documents-library"],
  ["media", "/admin/media"],
  ["users", "/admin/users"],
  ["settings-general", "/admin/settings?tab=general"],
  ["settings-about", "/admin/settings?tab=about"],
  ["settings-contact", "/admin/settings?tab=contact"],
  ["settings-footer", "/admin/settings?tab=footer"],
  ["settings-health", "/admin/settings?tab=health"],
  ["homepage", "/admin/homepage-builder"],
  ["homepage-why", "/admin/homepage-builder?tab=why-choose"],
  ["hero-editor", "/admin/hero-images"],
  ["seo", "/admin/seo-dashboard"],
  ["page-headers", "/admin/page-headers"],
  ["audit", "/admin/audit"],
  ["monitoring", "/admin/monitoring"],
  ["email-delivery", "/admin/email-delivery"],
];
const publicRoutes = [
  ["home", "/"],
  ["about", "/about"],
  ["project", "/projects/" + project.slug],
  ["blog", "/blog/" + draftPost.slug],
  ["service", "/services/" + service.slug],
  ["contact", "/contact"],
  ["certifications", "/company/certifications-insurance"],
];
async function capture(p, label, pathname, width, theme, admin) {
  await p.setViewport({ width, height: 950, deviceScaleFactor: 1 });
  await p.goto(base + pathname, { waitUntil: "domcontentloaded" });
  await p.waitForFunction(
    admin
      ? () => !!document.querySelector(".business-admin-container")
      : () => document.body.innerText.length > 300,
    { timeout: 15000 },
  );
  await new Promise((done) => setTimeout(done, admin ? 450 : 1200));
  await p.evaluate(() => document.fonts.ready);
  const info = await p.evaluate(() => ({
    width: innerWidth,
    scroll: document.documentElement.scrollWidth,
    text: document.body.innerText,
    title: document.title,
    h1: [...document.querySelectorAll("h1")].map((node) => node.textContent),
    canonical:
      document.querySelector('link[rel="canonical"]')?.getAttribute("href") ||
      null,
    jsonLd: [...document.querySelectorAll('script[type="application/ld+json"]')]
      .map((node) => node.textContent)
      .sort()
      .join("\n"),
    theme: document.body.dataset.adminTheme,
    scripts: performance
      .getEntriesByType("resource")
      .filter((r) => r.initiatorType === "script")
      .map((r) => new URL(r.name).pathname),
  }));
  assert(
    !info.text.includes("Failed to load ") &&
      !info.text.includes("Something went wrong"),
    label + ": route failure",
  );
  if (admin) assert(info.theme === theme, label + ": theme not applied");
  if (info.scroll > width) info.overflow = info.scroll - width;
  const filename = `${label}-${width}-${theme}.${admin ? "jpg" : "png"}`;
  await p.screenshot({
    path: path.join(out, filename),
    ...(admin ? { type: "jpeg", quality: 75 } : { type: "png" }),
    fullPage: true,
  });
  checks.push({ label, path: pathname, width, theme, filename, ...info });
  console.log(
    `${label} ${width} ${theme}${info.overflow ? " OVERFLOW " + info.overflow : ""}`,
  );
}
(async () => {
  browser = await puppeteer.launch({
    executablePath: process.env.CHROMIUM_PATH || "/usr/bin/chromium",
    headless: true,
    args: ["--no-sandbox", "--disable-dev-shm-usage", "--disable-gpu"],
  });
  if (process.argv.includes("--interact")) {
    page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 950 });
    await attach(page, true);
    await goto("/admin/inbox");
    await page.waitForFunction(() =>
      document.body.innerText.includes("Fixture contact"),
    );
    await page.$eval('section[aria-label="Leads workspace"] button', () => {});
    const leadButton = await page.waitForFunction(() =>
      [
        ...document.querySelectorAll(
          'section[aria-label="Leads workspace"] button',
        ),
      ].find((n) => n.textContent.trim() === "Fixture contact"),
    );
    await leadButton.click();
    await page.waitForSelector('[role="dialog"]');
    assert(
      (await text()).includes("Fixture inquiry details"),
      "Lead detail lost its fields",
    );
    await page.screenshot({
      path: path.join(out, "lead-detail.jpg"),
      type: "jpeg",
      quality: 80,
    });
    await page.keyboard.press("Escape");
    await page.keyboard.down("Control");
    await page.keyboard.press("k");
    await page.keyboard.up("Control");
    await page.waitForSelector('[role="dialog"]');
    assert.equal(
      (await page.$$('[role="dialog"]')).length,
      1,
      "Search mounted twice",
    );
    await page.keyboard.press("Escape");
    await page.setViewport({ width: 390, height: 950 });
    await page.click('[aria-label="Open admin navigation"]');
    await page.waitForFunction(
      () =>
        document.querySelector(".admin-sidebar")?.getBoundingClientRect()
          .left >= 0,
    );
    await assertNoOverflow("mobile navigation");
    await page.keyboard.press("Escape");
    await page.click('[aria-label="Switch to dark theme"]');
    await page.waitForFunction(
      () => document.body.dataset.adminTheme === "dark",
    );
    await page.reload({ waitUntil: "networkidle0" });
    assert.equal(
      await page.evaluate(() => document.body.dataset.adminTheme),
      "dark",
      "Theme not remembered",
    );
    await page.setViewport({ width: 1440, height: 950 });
    await goto("/admin/projects/" + project.id);
    await page.waitForSelector("#description");
    await page.$eval("#description", (node) =>
      node.closest(".admin-rich-editor").scrollIntoView({ block: "center" }),
    );
    await page.click("#description");
    await page.keyboard.down("Control");
    await page.keyboard.press("a");
    await page.keyboard.up("Control");
    await page.keyboard.type("Fixture formatted content.");
    const heading = await page.waitForFunction(() =>
      [
        ...document
          .querySelector("#description")
          .closest(".admin-rich-editor")
          .querySelectorAll("button"),
      ].find((n) => n.textContent.trim() === "H2"),
    );
    await page.$eval("#description", (node) =>
      node.closest(".admin-rich-editor").scrollIntoView({ block: "center" }),
    );
    await heading.click();
    await page.waitForSelector("#description h2");
    assert.equal(
      writes.length,
      0,
      "Editing or opening a lead performed a server write",
    );
    await click("Save & publish");
    await page.waitForFunction(() =>
      document.body.innerText.includes("Saved to website at"),
    );
    assert(
      writes.some(
        (w) =>
          w.table === "projects" &&
          w.payload?.description?.includes(
            "<h2>Fixture formatted content.</h2>",
          ),
      ),
      "Tiptap HTML did not reach the save payload",
    );
    const beforePicker = writes.length;
    await click("Choose from library");
    await page.waitForSelector('[role="dialog"]');
    await click("Choose");
    await page.waitForFunction(
      () => !document.querySelector('[role="dialog"]'),
    );
    assert.equal(
      writes.length,
      beforePicker,
      "Choosing an image must only stage a change",
    );
    // Navigation has an unsaved-change guard; save before leaving the fixture editor.
    await click("Save & publish");
    await page.waitForFunction(() =>
      [...document.querySelectorAll("button")].some(
        (n) => n.textContent.trim() === "Save & publish" && !n.disabled,
      ),
    );
    await goto("/admin/blog/" + draftPost.id);
    await page.waitForSelector("#blog-content");
    await page.click("#blog-content");
    await page.keyboard.type(" Fixture browser edit.");
    await click("Save draft");
    await page.waitForFunction(() =>
      [...document.querySelectorAll("button")].some(
        (n) => n.textContent.trim() === "Save draft" && !n.disabled,
      ),
    );
    assert(
      writes.some(
        (w) =>
          w.table === "blog_posts" &&
          w.payload?.content?.includes("Fixture browser edit"),
      ),
      "Blog edits did not save",
    );
    await goto("/admin/email-delivery");
    await page.waitForFunction(() =>
      document.body.innerText.includes("rfp-notification"),
    );
    assert(
      !(await text()).includes("recipient@example.test"),
      "Recipient leaked while masked",
    );
    await click("Reveal recipients");
    assert(
      (await text()).includes("recipient@example.test"),
      "Reveal did not work",
    );
    assert(
      !writes.some((w) => w.type === "storage-delete"),
      "Editor deleted a storage file",
    );
    assert.equal(errors.length, 0, JSON.stringify(errors));
    fs.writeFileSync(
      path.join(out, "interactions.json"),
      JSON.stringify(
        {
          scope: "All requests intercepted; synthetic writes only",
          checks: [
            "existing lead detail",
            "single Ctrl+K search",
            "mobile drawer",
            "remembered dark theme",
            "Tiptap H2 save",
            "staged library selection",
            "blog save",
            "masked and revealed delivery details",
          ],
          writes,
          errors,
        },
        null,
        2,
      ) + "\n",
    );
    console.log(
      "PASS 8 interaction checks; all writes synthetic; no storage deletion.",
    );
    await browser.close();
    return;
  }

  const isPublic = process.argv.includes("--public");
  await Promise.all(
    (isPublic
      ? [
          { width: 1440, theme: "public" },
          { width: 390, theme: "public" },
        ]
      : [
          { width: 1440, theme: "light" },
          { width: 1440, theme: "dark" },
          { width: 390, theme: "light" },
          { width: 390, theme: "dark" },
        ]
    ).map(async ({ width, theme }) => {
      const context = await browser.createBrowserContext();
      const p = await context.newPage();
      await attach(p, !isPublic);
      if (isPublic)
        await p.emulateMediaFeatures([
          { name: "prefers-reduced-motion", value: "reduce" },
        ]);
      await p.evaluateOnNewDocument((theme) => {
        localStorage.setItem("admin-theme", theme);
        localStorage.setItem("admin-sidebar-collapsed", "false");
      }, theme);
      if (isPublic) {
        tables.blog_posts[0].publish_state = "published";
        tables.about_page_settings = [];
      }
      for (const [label, pathname] of isPublic ? publicRoutes : adminRoutes)
        await capture(p, label, pathname, width, theme, !isPublic);
      await context.close();
    }),
  );
  const report = {
    scope:
      "Offline production build; every external request intercepted; synthetic backend only",
    screenshots: checks.length,
    checks,
    errors,
    writes,
    requests,
  };
  fs.writeFileSync(
    path.join(out, "report.json"),
    JSON.stringify(report, null, 2) + "\n",
  );
  if (isPublic) {
    const snapshots = checks.map((c) => ({
      path: c.path,
      width: c.width,
      status: 200,
      finalPath: c.path,
      visibleText: c.text,
      title: c.title,
      h1: c.h1,
      canonical: c.canonical,
      jsonLdHash: require("node:crypto")
        .createHash("sha256")
        .update(c.jsonLd)
        .digest("hex"),
      screenshot: c.filename,
      pageErrors: [],
      consoleErrors: [],
      scripts: c.scripts,
    }));
    fs.writeFileSync(
      path.join(out, "manifest.json"),
      JSON.stringify(
        { paths: [...new Set(snapshots.map((c) => c.path))].sort(), snapshots },
        null,
        2,
      ) + "\n",
    );
  }
  await browser.close();
  assert.equal(
    errors.length,
    0,
    "Browser runtime errors: " + JSON.stringify(errors),
  );
  assert.equal(
    writes.length,
    0,
    "Route capture must not mutate data, even fixtures",
  );
  assert(
    checks.every((c) => !c.overflow),
    "Horizontal overflow: " +
      JSON.stringify(
        checks
          .filter((c) => c.overflow)
          .map((c) => ({ path: c.path, width: c.width, overflow: c.overflow })),
      ),
  );
  console.log(
    `PASS ${checks.length} captures; zero runtime errors, mutations or horizontal overflow.`,
  );
})().catch(async (error) => {
  console.error(error);
  if (browser) await browser.close();
  process.exit(1);
});
