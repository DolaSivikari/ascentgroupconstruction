// All authentication, request data and updates are intercepted offline.
const assert = require("node:assert/strict"),
  fs = require("node:fs"),
  path = require("node:path");
const puppeteer = require(process.env.PUPPETEER_CORE_PATH || "puppeteer-core");
const base = process.env.REQUEST_DETAILS_ORIGIN || "http://127.0.0.1:4192";
assert.equal(new URL(base).hostname, "127.0.0.1");
const out =
  process.env.REQUEST_DETAILS_OUTPUT ||
  path.resolve("node_modules/.cache/request-details");
fs.mkdirSync(out, { recursive: true });
const uid = "00000000-0000-4000-8000-000000000999",
  legacyId = "00000000-0000-4000-8000-000000000101",
  inquiryId = "00000000-0000-4000-8000-000000000102";
const message =
  "Please review this submitted request, including the exterior repair scope and access requirements. ".repeat(
    35,
  );
const inquiry = {
  id: inquiryId,
  reference_code: "AGC-FIXTURE",
  submission_key: null,
  created_at: "2026-10-08T16:00:00Z",
  updated_at: "2026-10-08T16:00:00Z",
  inquiry_type: "bid_invitation",
  status: "new",
  priority: "normal",
  contact_name: "New workflow fixture",
  email: "workflow@example.test",
  phone: "555-0102",
  company: "Fixture GC",
  project_name: "Envelope repair",
  project_location: "Toronto",
  message,
  bid_due_at: null,
  drawings_url: null,
  attachment_paths: [],
  assigned_to: null,
  bid_amount: null,
  first_viewed_at: null,
  archived_at: null,
  archived_by: null,
  alert_status: "pending",
  alert_attempts: 0,
  alert_last_error: null,
  alert_sent_at: null,
  alert_lease_until: null,
  confirmation_status: "pending",
  source_path: "/contact",
};
const fixtures = {
  contact_submissions: [
    {
      id: legacyId,
      name: "Legacy estimate fixture",
      email: "owner@example.test",
      phone: "555-0101",
      company: "Fixture property",
      submission_type: "estimate",
      message,
      status: "new",
      admin_notes: "Stored follow-up",
      created_at: "2026-10-08T15:00:00Z",
    },
  ],
  inquiries: [inquiry],
  user_roles: [{ user_id: uid, role: "super_admin" }],
  profiles: [
    { id: uid, email: "admin@example.test", full_name: "Offline owner" },
  ],
};
(async () => {
  const browser = await puppeteer.launch({
    executablePath: process.env.CHROMIUM_PATH || "/usr/bin/chromium",
    args: ["--no-sandbox", "--disable-dev-shm-usage"],
  });
  const results = [];
  try {
    for (const width of [1440, 1024, 390]) {
      const page = await browser.newPage(),
        errors = [],
        writes = [];
      let viewedUpdates = 0;
      page.on("pageerror", (error) => errors.push(error.message));
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
          if (
            request.method() === "PATCH" &&
            url.pathname === "/rest/v1/inquiries" &&
            Object.keys(JSON.parse(request.postData() || "{}")).join() ===
              "first_viewed_at"
          ) {
            viewedUpdates++;
            return respond(200, []);
          }
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
          const rows = fixtures[table] || [];
          if (request.headers().accept?.includes("vnd.pgrst.object"))
            return rows.length
              ? respond(200, rows[0])
              : respond(406, { code: "PGRST116", message: "No fixture row" });
          return respond(200, rows);
        } catch (error) {
          errors.push(error.message);
        }
      });

      const openCell = async (name) => {
        await page.waitForFunction(
          (name) =>
            [
              ...document.querySelectorAll(
                '[aria-label="Open request from ' + name + '"]',
              ),
            ].some((el) => el.getBoundingClientRect().height > 0),
          {},
          name,
        );
        await page.evaluate((name) => {
          const row = [
            ...document.querySelectorAll(
              '[aria-label="Open request from ' + name + '"]',
            ),
          ].find((el) => el.getBoundingClientRect().height > 0);
          (
            row.querySelector("td:nth-child(3) p") ||
            row.querySelector("p") ||
            row.querySelector("td") ||
            row
          ).click();
        }, name);
        await page.waitForSelector(".request-detail-shell");
      };
      const choose = async (value) => {
        await page.select(".request-detail-shell nav select", value);
        await page.waitForFunction(
          (value) =>
            new URLSearchParams(location.search).get("lead-section") === value,
          {},
          value,
        );
      };
      const close = async () => {
        await page.evaluate(() =>
          [...document.querySelectorAll(".request-detail-footer button")]
            .find((button) => button.textContent.trim() === "Close")
            .click(),
        );
        await page.waitForFunction(
          () => !document.querySelector(".request-detail-shell"),
        );
      };
      const layout = async () =>
        page.evaluate(() => {
          const shell = document.querySelector(".request-detail-shell"),
            body = shell.querySelector("[data-request-detail-scroll]"),
            header = shell.querySelector(".request-detail-header"),
            footer = shell.querySelector(".request-detail-footer");
          body.scrollTop = body.scrollHeight;
          const h = header.getBoundingClientRect(),
            f = footer.getBoundingClientRect(),
            r = shell.getBoundingClientRect();
          return {
            headerTop: h.top,
            footerBottom: f.bottom,
            panelWidth: r.width,
            viewportWidth: innerWidth,
            viewportHeight: innerHeight,
            overflow: shell.scrollWidth > shell.clientWidth,
            bodyScroll: body.scrollTop,
          };
        });
      await page.goto(base + "/admin/inbox", { waitUntil: "networkidle0" });
      await openCell("Legacy estimate fixture");
      await page.waitForFunction(() =>
        document
          .querySelector(".request-detail-card")
          ?.textContent.includes("owner@example.test"),
      );
      const legacy = await layout();
      assert.equal(legacy.headerTop, 0);
      assert(legacy.footerBottom <= 900);
      assert.equal(legacy.overflow, false);
      assert(legacy.bodyScroll > 0);
      await page.screenshot({
        path: path.join(out, "legacy-request-" + width + ".png"),
      });
      await choose("workflow");
      await page.click("#inbox-admin-notes");
      await page.keyboard.type(" Unsaved fixture note.");
      await choose("request");
      await choose("workflow");
      assert(
        (await page.$eval("#inbox-admin-notes", (el) => el.value)).includes(
          "Unsaved fixture note.",
        ),
      );
      await page.evaluate(() =>
        [...document.querySelectorAll(".request-detail-footer button")]
          .find((button) => button.textContent.trim() === "Close")
          .click(),
      );
      await page.waitForSelector('[role="alertdialog"]');
      await page.evaluate(() =>
        [...document.querySelectorAll('[role="alertdialog"] button')]
          .find((button) => button.textContent.trim() === "Keep editing")
          .click(),
      );
      await page.waitForFunction(
        () => !document.querySelector('[role="alertdialog"]'),
      );
      assert(
        (await page.$eval("#inbox-admin-notes", (el) => el.value)).includes(
          "Unsaved fixture note.",
        ),
      );
      // Reload the local fixture to avoid saving or discarding any backend data.
      await page.goto(base + "/admin/inbox?tab=all", {
        waitUntil: "networkidle0",
      });
      await openCell("Legacy estimate fixture");
      assert.equal(
        await page.$eval(
          '.request-detail-shell [data-admin-section="request"]',
          (el) => el.hidden,
        ),
        false,
      );
      await close();
      await page.goto(base + "/admin/inbox", { waitUntil: "networkidle0" });
      await openCell("New workflow fixture");
      await page.waitForSelector('[aria-label="Lead sections"]');
      const modern = await layout();
      assert.equal(modern.headerTop, 0);
      assert(modern.footerBottom <= 900);
      assert.equal(modern.overflow, false);
      await page.screenshot({
        path: path.join(out, "workflow-request-" + width + ".png"),
      });
      await choose("notes");
      await page.click('[aria-label="New lead note"]');
      await page.keyboard.type("Keep this unsent note");
      await choose("request");
      await choose("notes");
      assert.equal(
        await page.$eval('[aria-label="New lead note"]', (el) => el.value),
        "Keep this unsent note",
      );
      await page.evaluate(() =>
        [...document.querySelectorAll(".request-detail-footer button")]
          .find((button) => button.textContent.trim() === "Close")
          .click(),
      );
      await page.waitForSelector('[role="alertdialog"]');
      assert(
        (
          await page.$eval('[role="alertdialog"]', (el) => el.textContent)
        ).includes("Discard unsaved lead edits?"),
      );
      assert.equal(errors.length, 0, JSON.stringify(errors));
      assert.equal(writes.length, 0, JSON.stringify(writes));
      assert.equal(viewedUpdates, 1);
      results.push({
        width,
        legacy,
        modern,
        openedFromLeads: true,
        openedFromAll: true,
        legacyNotesRetained: true,
        unsentInquiryNoteRetained: true,
        runtimeErrors: errors,
        unexpectedFixtureWrites: writes,
        interceptedExistingFirstViewedUpdates: viewedUpdates,
      });
      await page.close();
    }
    fs.writeFileSync(
      path.join(out, "report.json"),
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
