// Run with the isolated Playwright fixture harness against a local production build.
// The harness owns network interception; this check never submits a form.
const assert = require("node:assert/strict");
const path = require("node:path");
const fs = require("node:fs");

module.exports = async ({ page, output, width }) => {
  const guide = page.locator('section[aria-labelledby="repair-guide-heading"]');
  const docs = page.locator(
    'section[aria-labelledby="documentation-preview-heading"]',
  );
  await guide.scrollIntoViewIfNeeded();
  assert.equal(await guide.locator("details").count(), 4);
  for (const detail of await guide.locator("details").all()) {
    const summary = detail.locator("summary");
    await summary.focus();
    await page.keyboard.press("Enter");
    assert.equal(await detail.evaluate((node) => node.open), true);
    assert.equal(
      await detail
        .getByRole("heading", { name: "What needs checking" })
        .isVisible(),
      true,
    );
    await page.keyboard.press("Enter");
    assert.equal(await detail.evaluate((node) => node.open), false);
  }
  const links = await guide
    .locator("a")
    .evaluateAll((nodes) => nodes.map((node) => node.getAttribute("href")));
  assert.deepEqual(links, [
    "/contact",
    "/submit-rfp",
    "/services/sealant-programs",
    "/services/facade-remediation",
    "/services/parking-garage-restoration",
    "/our-process",
  ]);
  await guide.screenshot({
    path: path.join(output, `repair-guide-${width}.png`),
  });

  await docs.scrollIntoViewIfNeeded();
  assert.equal(
    await docs
      .getByText("Illustrative sample — not a completed project", {
        exact: true,
      })
      .isVisible(),
    true,
  );
  const before = docs.getByRole("tab", { name: "Before work", exact: true });
  await before.focus();
  assert.equal(await before.getAttribute("aria-selected"), "true");
  await page.keyboard.press("ArrowRight");
  await page.waitForFunction(
    () =>
      document.querySelector('[role="tab"][data-state="active"]')
        .textContent === "During work",
  );
  assert.equal(
    await docs
      .getByRole("heading", { name: "A progress record you can follow" })
      .isVisible(),
    true,
  );
  await docs.screenshot({
    path: path.join(output, `documentation-during-${width}.png`),
  });
  await page.keyboard.press("ArrowRight");
  await page.waitForFunction(
    () =>
      document.querySelector('[role="tab"][data-state="active"]')
        .textContent === "At completion",
  );
  assert.equal(
    await docs
      .getByRole("heading", { name: "An organized handover" })
      .isVisible(),
    true,
  );
  await docs.screenshot({
    path: path.join(output, `documentation-completion-${width}.png`),
  });
  await before.click();
  assert.equal(
    await docs
      .getByRole("heading", { name: "A scope you can review" })
      .isVisible(),
    true,
  );
  await docs.screenshot({
    path: path.join(output, `documentation-before-${width}.png`),
  });

  const intro = page
    .locator("details")
    .filter({
      has: page.locator("summary", { hasText: "About our team and approach" }),
    });
  await intro.locator("summary").focus();
  await page.keyboard.press("Space");
  assert.equal(await intro.evaluate((node) => node.open), true);
  await page.keyboard.press("Space");
  assert.equal(await intro.evaluate((node) => node.open), false);
  assert.equal(await page.locator("h1").count(), 1);
  assert.equal(
    await page.evaluate(
      () => document.documentElement.scrollWidth > innerWidth,
    ),
    false,
  );

  await guide.getByRole("link", { name: "Discuss a building repair" }).click();
  await page.waitForURL("**/contact");
  await page.locator("h1").waitFor();
  await page.goBack();
  await guide.waitFor();
  assert.equal(await before.getAttribute("aria-selected"), "true");
  return {
    width,
    problemKeyboardToggles: 4,
    documentationKeyboardTabs: 3,
    existingRoutes: links,
    expandableIntroduction: true,
    contactNavigationAndReturn: true,
    overflow: false,
  };
};

// Optional standalone runner. Browser packages remain outside application dependencies.
if (require.main === module) {
  (async () => {
    const { chromium } = require(
      process.env.BASELINE_PLAYWRIGHT || "playwright",
    );
    const origin = new URL(process.argv[2] || "http://127.0.0.1:4176").origin;
    const baseline = process.argv[4] ? new URL(process.argv[4]).origin : null;
    for (const address of [origin, baseline].filter(Boolean)) {
      assert.ok(
        ["127.0.0.1", "localhost", "[::1]"].includes(new URL(address).hostname),
        "Only local fixture builds may be tested",
      );
    }
    const output = path.resolve(
      process.argv[3] || "/tmp/homepage-repair-guidance",
    );
    fs.mkdirSync(output, { recursive: true });
    const browser = await chromium.launch({
      headless: true,
      executablePath: process.env.CHROMIUM_PATH || undefined,
      args: ["--no-sandbox"],
    });
    const errors = [],
      mutations = [],
      results = [];
    async function createPage(width, theme = "light") {
      const context = await browser.newContext({
        viewport: { width, height: 900 },
        reducedMotion: "reduce",
        userAgent: "AscentSiteHealth/1.0",
        serviceWorkers: "block",
      });
      await context.addInitScript((theme) => {
        localStorage.setItem("cookie-consent", "rejected");
        localStorage.setItem("cookie-consent-date", new Date().toISOString());
        localStorage.setItem("theme", theme);
        window.setInterval = () => 0;
      }, theme);
      await context.routeWebSocket("**/*", (socket) => socket.close());
      await context.route("**/*", (route) => {
        const request = route.request(),
          url = new URL(request.url());
        if ([origin, baseline].includes(url.origin)) return route.continue();
        if (request.method() !== "GET")
          mutations.push({ method: request.method(), path: url.pathname });
        if (
          request.method() === "GET" &&
          url.hostname.endsWith(".supabase.co")
        ) {
          const single = (request.headers().accept || "").includes(
            "application/vnd.pgrst.object+json",
          );
          return route.fulfill({
            status: single ? 406 : 200,
            contentType: "application/json",
            body: single
              ? JSON.stringify({
                  code: "PGRST116",
                  message: "No row in offline fixture",
                  details: "0 rows",
                })
              : "[]",
          });
        }
        return route.abort();
      });
      const page = await context.newPage();
      page.on("pageerror", (error) => errors.push(error.message));
      return { context, page };
    }
    async function load(page, address) {
      await page.goto(address);
      await page.locator("h1").waitFor();
      await page.evaluate(() => document.fonts.ready);
      for (
        let y = 0;
        y < (await page.evaluate(() => document.body.scrollHeight));
        y += 800
      ) {
        await page.evaluate((y) => scrollTo(0, y), y);
        await page.waitForTimeout(80);
      }
      await page.evaluate(() => scrollTo(0, 0));
    }
    async function formControls(page) {
      return page
        .locator("form")
        .evaluateAll((forms) =>
          forms.map((form) =>
            [
              ...form.querySelectorAll(
                "input,textarea,select,button[type=submit]",
              ),
            ].map((node) => ({
              tag: node.tagName,
              type: node.type,
              name: node.name,
              placeholder: node.placeholder || "",
              required: node.required || false,
              maxLength: node.maxLength,
              labels: node.labels
                ? [...node.labels].map((label) => label.innerText)
                : [],
            })),
          ),
        );
    }
    let originalForms;
    try {
      if (baseline) {
        const { context, page } = await createPage(1440);
        await load(page, baseline);
        originalForms = await formControls(page);
        await context.close();
      }
      for (const width of [1440, 390, 320]) {
        const { context, page } = await createPage(width);
        await load(page, origin);
        if (originalForms)
          assert.deepEqual(
            await formControls(page),
            originalForms,
            "Existing form controls changed",
          );
        results.push(await module.exports({ page, output, width }));
        await context.close();
      }
      const dark = await createPage(390, "dark");
      await load(dark.page, origin);
      assert.equal(
        await dark.page.evaluate(
          () => document.documentElement.scrollWidth > innerWidth,
        ),
        false,
      );
      await dark.page
        .locator('section[aria-labelledby="documentation-preview-heading"]')
        .screenshot({ path: path.join(output, "documentation-dark-390.png") });
      await dark.context.close();
      assert.deepEqual(errors, []);
      assert.deepEqual(mutations, []);
      fs.writeFileSync(
        path.join(output, "interactions.json"),
        JSON.stringify(
          {
            status: "passed",
            fixturePolicy:
              "Empty lists and no-row responses; all external mutations and non-fixture requests blocked; no form submissions",
            results,
            existingFormControlsUnchanged: baseline
              ? true
              : "not checked without baseline argument",
            errors,
            mutations,
          },
          null,
          2,
        ),
      );
      console.log(
        "Homepage guidance interactions passed with offline fixtures.",
      );
    } finally {
      await browser.close();
    }
  })().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
}
