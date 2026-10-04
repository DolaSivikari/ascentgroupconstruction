const fs = require("node:fs"),
  assert = require("node:assert/strict");
const path = require("node:path");
const root = path.resolve(__dirname, "..");
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
const base = process.env.R1_PREVIEW_ORIGIN || "http://127.0.0.1:4176",
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
  page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 1000 });
  await attach(page, true);
  await goto("/admin");
  await page.waitForSelector('a[href="/admin/projects"]');
  const sidebar = await page.$eval("aside", (node) => node.innerText);
  for (const hidden of ["Email Templates", "Media Library", "Testimonials"])
    assert(!sidebar.includes(hidden));
  assert(!(await page.$("[data-onboarding]")));
  await page.screenshot({
    path: out + "/dashboard-desktop.png",
    fullPage: false,
  });
  check("Unsupported sidebar items hidden; dashboard and leads still load");
  await goto("/admin/projects/new");
  await page.waitForSelector("#title");
  await fill("#title", "New browser fixture");
  await fill("#slug", "new-browser-fixture");
  await click("Save Project");
  await page.waitForFunction(() => location.pathname != "/admin/projects/new");
  const created = tables.projects.find((p) => p.slug === "new-browser-fixture");
  assert(created);
  assert.equal(created.start_date, null);
  assert.equal(created.completion_date, null);
  assert.equal(created.on_time_completion, null);
  assert.equal(created.on_budget, null);
  check("New project with blank dates and unset performance values saves");
  await goto("/admin/projects/" + project.id);
  await page.waitForSelector("#title");
  await fill("#title", "Unsaved browser edit");
  await page.waitForFunction(
    () =>
      localStorage.getItem(
        "project-draft-" +
          document.querySelector("#title").closest("form")?.dataset.id,
      ) || document.body.innerText.includes("Draft saved on this device"),
  );
  assert.equal(tables.projects[0].title, "Browser fixture project");
  assert.equal(tables.projects[0].publish_state, "published");
  check("Published project autosave remains local");
  const documentsBefore = documents.filter((r) => r.admin).length;
  await click("Back");
  await page.waitForSelector('[role="alertdialog"]');
  await click("Stay");
  assert.equal(
    await page.$eval("#title", (n) => n.value),
    "Unsaved browser edit",
  );
  await click("Back");
  await click("Leave");
  await page.waitForFunction(() => location.pathname === "/admin/projects");
  assert.equal(documents.filter((r) => r.admin).length, documentsBefore);
  check("Back guard retains edits on Stay and leaves through React Router");
  await goto("/admin/projects/" + project.id);
  await page.waitForSelector("#title");
  assert.equal(
    await page.$eval("#title", (n) => n.value),
    "Browser fixture project",
  );
  await click("Restore unsaved changes");
  assert.equal(
    await page.$eval("#title", (n) => n.value),
    "Unsaved browser edit",
  );
  failProject = true;
  await click("Save Project");
  await page.waitForFunction(() =>
    document
      .querySelector('[role="alert"]')
      ?.textContent.includes("permission"),
  );
  assert.equal(
    await page.$eval("#title", (n) => n.value),
    "Unsaved browser edit",
  );
  failProject = false;
  await click("Details", '[role="tab"]');
  await page.waitForSelector("#start_date");
  await fill("#start_date", "");
  await fill("#completion_date", "");
  await click("Save Project");
  await page.waitForFunction(
    () =>
      document.body.innerText.includes("Project updated") &&
      !document.body.innerText.includes("Saving..."),
  );
  assert.equal(tables.projects[0].start_date, null);
  assert.equal(tables.projects[0].completion_date, null);
  check("Failed save keeps edits; explicit save clears existing dates");
  await click("Images", '[role="tab"]');
  await page.waitForSelector('[title="Remove gallery image"]');
  await page.click('[title="Remove gallery image"]');
  await click("Stage removal");
  assert.equal(tables.project_images.length, 1);
  assert(!writes.some((w) => w.type === "storage-delete"));
  await click("Save Project");
  await page.waitForFunction(
    () => !document.body.innerText.includes("Saving..."),
  );
  await page.waitForFunction(() =>
    document.body.innerText.includes("Project updated"),
  );
  assert.equal(tables.project_images.length, 0);
  assert(writes.some((w) => w.type === "storage-delete"));
  check("Gallery files are deleted only after a successful full Save");
  await click("Basic Info", '[role="tab"]');
  await page.waitForSelector("#title");
  await page.evaluate(() => {
    window.__openedPreview = null;
    window.open = (url) => {
      window.__openedPreview = url;
      return null;
    };
  });
  failToken = true;
  await click("Preview");
  await page.waitForFunction(() =>
    document.body.innerText.includes("Preview unavailable"),
  );
  assert.equal(await page.evaluate(() => window.__openedPreview), null);
  failToken = false;
  await click("Preview");
  await page.waitForFunction(() => window.__openedPreview);
  const projectPreview = await page.evaluate(() => window.__openedPreview);
  assert(projectPreview.includes("?preview=true&token="));
  const visitorContext = await browser.createBrowserContext();
  const visitor = await visitorContext.newPage();
  await attach(visitor, false);
  await visitor.setViewport({ width: 1440, height: 1000 });
  await visitor.goto(base + projectPreview, { waitUntil: "networkidle0" });
  await visitor.waitForFunction(() =>
    document.body.innerText.includes("Unsaved browser edit"),
  );
  await visitor.waitForSelector('meta[name="robots"][content*="noindex"]');
  check(
    "Saved project preview uses the validating RPC in a fresh visitor context",
  );
  await goto("/admin/blog/new");
  await page.waitForSelector("#title");
  const preBlogWrites = writes.filter((w) => w.table === "blog_posts").length;
  await click("Save");
  assert.equal(
    writes.filter((w) => w.table === "blog_posts").length,
    preBlogWrites,
  );
  await fill("#title", "New browser article");
  await fill("#content", "<p>New browser article content.</p>");
  await fill("#slug", " Article / Slug?! ");
  await fill("#source", "Fixture attribution");
  await page.click("#is_pinned");
  await fill("#read_time", "");
  await click("Save");
  await page.waitForFunction(() => location.pathname === "/admin/blog");
  const blogSaved = tables.blog_posts.find(
    (p) => p.title === "New browser article",
  );
  assert(blogSaved);
  assert.equal(blogSaved.slug, "article-slug");
  assert.equal(blogSaved.source, "Fixture attribution");
  assert.equal(blogSaved.is_pinned, true);
  assert.equal(blogSaved.read_time_minutes, null);
  check(
    "Header Save validates required fields and persists blog metadata with sanitized slug",
  );
  await page.evaluate(() => {
    window.__openedPreview = null;
    window.open = (url) => {
      window.__openedPreview = url;
      return null;
    };
  });
  const draftPreviewButton = await page.waitForFunction(() =>
    [...document.querySelectorAll('[title="Preview draft"]')].find((node) =>
      node
        .closest(".business-glass-card")
        ?.innerText.includes("Browser fixture draft"),
    ),
  );
  await draftPreviewButton.click();
  await page.waitForFunction(() => window.__openedPreview);
  const blogPreview = await page.evaluate(() => window.__openedPreview);
  await visitor.goto(base + blogPreview, { waitUntil: "networkidle0" });
  await visitor.waitForFunction(() =>
    document.body.innerText.includes("Draft article content."),
  );
  check(
    "Blog list persists a draft token before opening a working visitor preview",
  );
  await goto("/admin/settings?tab=contact");
  await page.waitForSelector("#contact_page_settings-weekday_hours");
  await fill(
    "#contact_page_settings-weekday_hours",
    "Browser verified office hours",
  );
  await click("Save Changes");
  await page.waitForFunction(() =>
    document.body.innerText.includes(
      "Contact page settings saved successfully",
    ),
  );
  await visitor.goto(base + "/contact", { waitUntil: "networkidle0" });
  await visitor.waitForFunction(() =>
    document.body.innerText.includes("Browser verified office hours"),
  );
  assert(
    !requests
      .filter((r) => !r.admin && r.path.endsWith("/contact_page_settings"))
      .some((r) => r.select === "*"),
  );
  check(
    "Saved Contact hours appear in a fresh anonymous visitor session with restricted column grants",
  );
  await fill("#contact_page_settings-weekday_hours", "Discarded hours");
  await click("General", '[role="tab"]');
  await click("Stay");
  assert.equal(
    await page.$eval("#contact_page_settings-weekday_hours", (n) => n.value),
    "Discarded hours",
  );
  await click("General", '[role="tab"]');
  await click("Leave");
  await page.waitForSelector("#site_settings-address");
  check("Settings tab navigation warns and retains edits on Stay");
  await click("About", '[role="tab"]');
  await click("Create settings record");
  await page.waitForSelector("#about_page_settings-story_headline");
  assert.equal(tables.about_page_settings.length, 1);
  assert.equal(tables.about_page_settings[0].years_in_business, null);
  check(
    "Missing settings records offer Create without guessed business statistics",
  );
  await goto("/admin/homepage-builder");
  await page.waitForSelector('a[href="/admin"]');
  assert(!(await page.$('[role="tab"][data-state][value="overview"]')));
  const tabs = await page.$$eval('[role="tab"]', (ns) =>
    ns.map((n) => n.innerText),
  );
  assert(!tabs.includes("Company Overview"));
  await click("Add New Slide");
  await page.waitForSelector("#headline");
  await fill("#headline", "Unsaved slide");
  await click("Cancel");
  await click("Stay");
  assert.equal(await page.$eval("#headline", (n) => n.value), "Unsaved slide");
  await click("Cancel");
  await click("Leave");
  check(
    "Hero dialog Cancel preserves unsaved fields until discard is confirmed",
  );
  await goto("/admin/services-manager");
  const serviceTabs = await page.$$eval('[role="tab"]', (ns) =>
    ns.map((n) => n.innerText),
  );
  assert(!serviceTabs.includes("Featured"));
  assert(!serviceTabs.includes("Promotions"));
  await goto("/admin/seo-dashboard");
  await click("Settings", '[role="tab"]');
  await page.waitForFunction(() =>
    document.body.innerText.includes("URL count:"),
  );
  assert(!(await page.$("#robots")));
  assert(!(await text()).includes("Regenerate Sitemap"));
  await page.screenshot({
    path: out + "/crawler-files-desktop.png",
    fullPage: false,
  });
  check("SEO shows served crawler files and URL count without write controls");
  await goto("/admin/monitoring");
  await page.waitForFunction(() =>
    document.body.innerText.includes("No errors reported in 24 hours"),
  );
  assert(!(await text()).includes("0ms"));
  failMonitoring = true;
  await click("Refresh monitoring");
  await page.waitForFunction(() =>
    document.body.innerText.includes("Error monitoring is unavailable"),
  );
  assert(!(await text()).includes("No errors reported in 24 hours"));
  failMonitoring = false;
  await click("Refresh monitoring");
  await page.waitForFunction(() =>
    document.body.innerText.includes("No errors reported in 24 hours"),
  );
  check(
    "Monitoring derives the 24-hour status and shows failed reads as unavailable",
  );
  await goto("/admin/users");
  await page.waitForFunction(() =>
    document.body.innerText.includes("Fixture owner"),
  );
  assert(await page.$('[aria-label="Role for Fixture owner"][disabled]'));
  assert((await text()).includes("Invite User"));
  assert(!(await text()).includes("Permission Matrix"));
  assert(
    ![
      ...(await page.$$eval('[role="option"]', (ns) =>
        ns.map((n) => n.innerText),
      )),
    ].some((n) => ["Editor", "Contributor", "Viewer"].includes(n)),
  );
  role = "admin";
  await goto("/admin/users");
  await page.waitForFunction(() =>
    document.body.innerText.includes("Only a super admin"),
  );
  assert(!(await page.$('[role="combobox"]')));
  assert(!(await text()).includes("Invite User"));
  assert(!(await text()).includes("Active"));
  check(
    "Only verified super admins see invite and role controls; no invented active status",
  );
  role = "super_admin";
  await page.setViewport({ width: 390, height: 844 });
  for (const [name, path, ready] of [
    ["project", "/admin/projects/" + project.id, "#title"],
    ["blog", "/admin/blog/" + draftPost.id, "#title"],
    [
      "settings",
      "/admin/settings?tab=contact",
      "#contact_page_settings-weekday_hours",
    ],
    ["users", "/admin/users", '[aria-label="Role for Fixture owner"]'],
    ["monitoring", "/admin/monitoring", '[role="table"], .admin-page-shell'],
  ]) {
    await goto(path);
    await page.waitForSelector(ready);
    await assertNoOverflow(name);
    await page.screenshot({
      path: out + "/" + name + "-390.png",
      fullPage: false,
    });
  }
  await goto("/admin/projects/" + project.id);
  await page.waitForSelector("#title");
  await fill("#title", "Mobile guarded edit");
  await click("Back");
  await page.waitForSelector('[role="alertdialog"]');
  await assertNoOverflow("mobile guard");
  await page.screenshot({ path: out + "/guard-390.png", fullPage: false });
  await click("Stay");
  await page.click('[aria-label="Open admin navigation"]');
  await page.waitForFunction(() =>
    [...document.querySelectorAll('a[href="/admin/inbox"]')].some(
      (n) => n.getClientRects().length,
    ),
  );
  await assertNoOverflow("mobile sidebar");
  await page.screenshot({ path: out + "/sidebar-390.png", fullPage: false });
  check(
    "Editors, Settings, Users, Monitoring and the guard fit 390px without horizontal overflow",
  );
  assert.deepEqual(errors, []);
  const report = {
    status: "passed",
    checks,
    errors,
    requests,
    writes,
    notes: [
      "All auth and database responses are synthetic fixtures. External traffic was blocked. No real database, email, migration, merge or publishing action occurred.",
    ],
  };
  fs.writeFileSync(out + "/results.json", JSON.stringify(report, null, 2));
  console.log(
    JSON.stringify({
      status: report.status,
      checks: checks.length,
      runtimeErrors: errors.length,
    }),
  );
  await visitorContext.close();
  await browser.close();
})().catch(async (error) => {
  console.error(error.stack);
  console.error({ errors, requests: requests.slice(-10) });
  if (page) {
    console.error(
      await page.evaluate(() => ({
        url: location.href,
        alerts: [...document.querySelectorAll("[role=alert]")].map(
          (n) => n.textContent,
        ),
      })),
    );
    await page.screenshot({ path: out + "/failure.png", fullPage: false });
  }
  if (browser) await browser.close();
  process.exit(1);
});
