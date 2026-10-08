// Offline production-preview checks; all backend requests use synthetic fixtures.
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const puppeteer = require(process.env.PUPPETEER_CORE_PATH || "puppeteer-core");
const base = process.env.ADMIN_SECTIONS_ORIGIN || "http://127.0.0.1:4188";
const mode = process.argv[2] || "before";
assert.equal(new URL(base).hostname, "127.0.0.1");
const out =
  process.env.ADMIN_SECTIONS_OUTPUT ||
  path.resolve("node_modules/.cache/admin-section-pages");
fs.mkdirSync(out, { recursive: true });
const projectId = "00000000-0000-4000-8000-000000000001";
const uid = "00000000-0000-4000-8000-000000000999";
const project = {
  id: projectId,
  title: "Offline section fixture",
  slug: "offline-section-fixture",
  summary: "Offline fixture summary",
  description: "<p>Existing description.</p>",
  publish_state: "draft",
  project_status: "Completed",
  featured_image: "",
  tags: [],
  team_credits: [],
  content_blocks: [],
  start_date: "",
  completion_date: "",
  created_at: "2026-10-08T00:00:00Z",
};
(async () => {
  const browser = await puppeteer.launch({
    executablePath: process.env.CHROMIUM_PATH || "/usr/bin/chromium",
    args: ["--no-sandbox", "--disable-dev-shm-usage"],
  });
  const results = [];
  try {
    for (const width of [1440, 1024, 390]) {
      const page = await browser.newPage();
      const errors = [],
        warnings = [],
        writes = [];
      page.on("pageerror", (error) => errors.push(error.message));
      page.on("console", (message) => {
        if (message.type() === "warn") warnings.push(message.text());
      });
      await page.setViewport({ width, height: 900 });
      await page.evaluateOnNewDocument(
        (base, uid) => {
          if (location.origin !== base) return;
          localStorage.clear();
          localStorage.setItem("cookie-consent", "rejected");
          localStorage.setItem("admin-theme", "light");
          sessionStorage.setItem("deployment-check-done", "true");
          const token =
            btoa(JSON.stringify({ alg: "HS256", typ: "JWT" })) +
            "." +
            btoa(
              JSON.stringify({
                sub: uid,
                exp: 4102444800,
                aud: "authenticated",
              }),
            ) +
            ".fixture";
          localStorage.setItem(
            "sb-fixture-auth-token",
            JSON.stringify({
              access_token: token,
              refresh_token: "offline-fixture",
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
          // Prevent any realtime network connection; HTTP is intercepted separately.
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
        },
        base,
        uid,
      );
      await page.setRequestInterception(true);
      page.on("request", async (request) => {
        try {
          const url = new URL(request.url());
          if (
            url.origin === base ||
            url.protocol === "data:" ||
            url.protocol === "blob:"
          )
            return request.continue();
          const headers = {
            "access-control-allow-origin": base,
            "access-control-allow-headers": "*",
            "access-control-allow-methods": "*",
            "access-control-expose-headers": "content-range",
            "content-range": "0-0/1",
            "content-type": "application/json",
          };
          const respond = (status, value) =>
            request.respond({ status, headers, body: JSON.stringify(value) });
          if (url.origin !== "https://fixture.supabase.co")
            return request.respond({ status: 404, body: "" });
          if (request.method() === "OPTIONS") return respond(200, {});
          if (!["GET", "HEAD"].includes(request.method())) {
            writes.push({ path: url.pathname, method: request.method() });
            return respond(400, { message: "No writes allowed in this check" });
          }
          if (url.pathname === "/auth/v1/user")
            return respond(200, {
              id: uid,
              email: "admin@example.test",
              aud: "authenticated",
              role: "authenticated",
            });
          const table = url.pathname.split("/").pop();
          const rows =
            table === "projects"
              ? [project]
              : table === "user_roles"
                ? [{ user_id: uid, role: "super_admin" }]
                : table === "profiles"
                  ? [
                      {
                        id: uid,
                        email: "admin@example.test",
                        full_name: "Offline owner",
                      },
                    ]
                  : [];
          if (request.headers().accept?.includes("vnd.pgrst.object"))
            return rows.length
              ? respond(200, rows[0])
              : respond(406, { code: "PGRST116", message: "No fixture row" });
          return respond(200, rows);
        } catch (error) {
          errors.push(error.message);
        }
      });
      await page.goto(base + "/admin/projects/" + projectId, {
        waitUntil: "networkidle0",
      });
      await page.waitForSelector("#project-editor-form");
      const metrics = () =>
        page.evaluate(() => {
          const rect = (selector) => {
            const e = document.querySelector(selector);
            const r = e?.getBoundingClientRect();
            return {
              top: r?.top,
              bottom: r?.bottom,
              position: e && getComputedStyle(e).position,
            };
          };
          const scroller = document.querySelector(".business-page-content");
          return {
            sidebar: rect(".admin-sidebar"),
            topbar: rect(".admin-topbar"),
            actions: rect(".admin-editor-actions"),
            viewport: innerHeight,
            bodyScroll: scrollY,
            contentScroll: scroller.scrollTop,
            contentHeight: scroller.clientHeight,
            scrollHeight: scroller.scrollHeight,
            overflow: document.documentElement.scrollWidth > innerWidth,
            visibleSections: [
              ...document.querySelectorAll("[data-editor-section-path]"),
            ]
              .filter((e) => !e.hidden)
              .map((e) => e.dataset.editorSectionPath),
          };
        });
      const before = await metrics();
      await page.screenshot({
        path: path.join(out, mode + "-" + width + "-overview.png"),
      });
      await page.evaluate(() => {
        const el = document.querySelector(".business-page-content");
        el.scrollTop = el.scrollHeight;
        window.scrollTo(0, document.body.scrollHeight);
      });
      await new Promise((resolve) => setTimeout(resolve, 300));
      const scrolled = await metrics();
      if (mode === "after") {
        assert(
          Math.abs(scrolled.sidebar.top) <= 1,
          "Sidebar left the viewport",
        );
        assert(
          scrolled.topbar.top >= 0 && scrolled.topbar.bottom < 180,
          "Top bar disappeared",
        );
        assert(
          scrolled.actions.top >= scrolled.topbar.bottom - 1 &&
            scrolled.actions.bottom < 450,
          "Editor actions disappeared",
        );
        assert.equal(scrolled.overflow, false);
        assert.equal(before.visibleSections.length, 1);
        await page.evaluate(() => {
          document.querySelector(".business-page-content").scrollTop = 0;
        });
        const title = await page.$("#title");
        await title.click({ clickCount: 3 });
        await title.type("Unsaved section fixture");
        if (width >= 1024) await page.click('a[href$="/content"]');
        else await page.select("select[id]", "content");
        await page.waitForFunction(() =>
          location.pathname.endsWith("/content"),
        );
        assert.equal(
          await page.$eval("#project-content", (e) => e.hidden),
          false,
        );
        assert.equal(
          await page.$eval("#project-basics", (e) => e.hidden),
          true,
        );
        assert.equal(
          await page.$eval("#title", (e) => e.value),
          "Unsaved section fixture",
        );
        assert.equal(
          await page.$('div[role="alertdialog"]'),
          null,
          "Section navigation incorrectly discards edits",
        );
        const rich = await page.$("#description");
        await rich.click();
        await page.keyboard.type(" Draft text.");
        if (width >= 1024) await page.click('a[href$="/images"]');
        else await page.select("select[id]", "images");
        await page.waitForFunction(() => location.pathname.endsWith("/images"));
        await page.goBack();
        await page.waitForFunction(() =>
          location.pathname.endsWith("/content"),
        );
        assert(
          (await page.$eval("#description", (e) => e.textContent)).includes(
            "Draft text.",
          ),
        );
        await page.goBack();
        await page.waitForFunction(
          () => !location.pathname.endsWith("/content"),
        );
        assert.equal(
          await page.$eval("#title", (e) => e.value),
          "Unsaved section fixture",
        );
        // Required fields on a hidden screen still block saving and reveal that screen.
        await page.$eval("#title", (e) => {
          const setter = Object.getOwnPropertyDescriptor(
            HTMLInputElement.prototype,
            "value",
          ).set;
          setter.call(e, "");
          e.dispatchEvent(new Event("input", { bubbles: true }));
        });
        if (width >= 1024) await page.click('a[href$="/images"]');
        else await page.select("select[id]", "images");
        await page.waitForFunction(() => location.pathname.endsWith("/images"));
        await page.click('button[form="project-editor-form"]');
        await page.waitForFunction(() =>
          location.pathname.endsWith("/overview"),
        );
        await page.waitForFunction(
          () => document.activeElement?.id === "title",
        );
        assert.equal(writes.length, 0, "Validation allowed a backend write");
        assert.equal(errors.length, 0, JSON.stringify(errors));
        assert(
          !warnings.some((w) => /duplicate extension/i.test(w)),
          "Duplicate Tiptap extension",
        );
        if (width === 390) {
          await page.evaluate(() => {
            document.querySelector(".business-page-content").scrollTop = 99999;
          });
          await page.click('button[aria-label="Open admin navigation"]');
          assert.equal(
            await page.$eval(".admin-sidebar", (e) =>
              Math.round(e.getBoundingClientRect().top),
            ),
            0,
          );
          await page.keyboard.press("Escape");
          assert.equal(
            await page.$eval(".admin-sidebar", (e) =>
              e.classList.contains("is-mobile-open"),
            ),
            false,
          );
        }
      }
      await page.screenshot({
        path: path.join(out, mode + "-" + width + "-validation.png"),
      });
      results.push({
        width,
        before,
        scrolled,
        errors,
        writes,
        duplicateWarnings: warnings.filter((w) =>
          /duplicate extension/i.test(w),
        ),
      });
      await page.close();
    }
    fs.writeFileSync(
      path.join(out, mode + ".json"),
      JSON.stringify(results, null, 2),
    );
    console.log(JSON.stringify(results));
  } finally {
    await browser.close();
  }
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
