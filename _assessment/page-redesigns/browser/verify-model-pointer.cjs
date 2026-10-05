// Offline comparison against the user's supplied design previews. Browser tooling stays outside app dependencies.
const { chromium } = require(
  process.env.REDESIGN_PLAYWRIGHT_MODULE ||
    "/workspace/.design-tools/browser/node_modules/playwright",
);
const assert = require("assert/strict");
const fs = require("fs");
const { fixture } = require("./fixtures.cjs");
(async () => {
  const b = await chromium.launch({
    executablePath: "/usr/bin/chromium",
    args: ["--no-sandbox"],
  });
  const p = await b.newPage({ viewport: { width: 1440, height: 1000 } });
  await p.route("**/*", (r) =>
    new URL(r.request().url()).hostname === "127.0.0.1"
      ? r.continue()
      : r.request().url().includes("supabase.co")
        ? r.fulfill(fixture(r.request()))
        : r.abort(),
  );
  await p.addInitScript(() =>
    localStorage.setItem("cookie-consent", "rejected"),
  );
  await p.goto("http://127.0.0.1:4179/company/technology");
  await p.getByRole("tab", { name: "Stucco & EIFS wall section" }).click();
  const viewer = p.locator(".tech-viewer"),
    world = p.locator(".tech-world");
  await viewer.evaluate((el) =>
    scrollTo(0, el.getBoundingClientRect().top + scrollY - 130),
  );
  await p.waitForTimeout(100);
  const target = p.getByRole("button", {
    name: "Select 3D layer: Textured finish",
    exact: true,
  });
  const face = target.locator(".tech-face").nth(4);
  await face.click();
  assert.equal(await target.getAttribute("aria-pressed"), "true");
  const box = await face.boundingBox();
  let transform = await world.getAttribute("style");
  await p.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await p.mouse.down();
  await p.mouse.move(box.x + box.width / 2 + 60, box.y + box.height / 2 + 10, {
    steps: 6,
  });
  await p.mouse.up();
  assert.notEqual(await world.getAttribute("style"), transform);
  await p.getByRole("button", { name: "Auto-turn", exact: true }).click();
  transform = await world.getAttribute("style");
  await p.waitForTimeout(220);
  assert.notEqual(await world.getAttribute("style"), transform);
  await p.evaluate(() => scrollTo(0, 0));
  await p.waitForTimeout(220);
  transform = await world.getAttribute("style");
  await p.waitForTimeout(220);
  assert.equal(await world.getAttribute("style"), transform);
  assert.equal(
    await p
      .getByRole("button", { name: "Auto-turn", exact: true })
      .getAttribute("aria-pressed"),
    "false",
  );
  await p.getByRole("tab", { name: "Project record" }).click();
  await viewer.evaluate((el) =>
    scrollTo(0, el.getBoundingClientRect().top + scrollY - 130),
  );
  await p.waitForTimeout(100);
  const record = p.getByRole("button", {
    name: "Open Closeout package",
    exact: true,
  });
  await record.locator(".tech-model-sheet").click();
  assert.equal(await record.getAttribute("aria-pressed"), "true");
  const result = {
    surfaceClick: "passed",
    surfaceDrag: "passed",
    documentClick: "passed",
    autoTurn: "passed",
    offscreenPause: "passed",
  };
  fs.writeFileSync(
    "/workspace/design-evidence/model-pointer.json",
    JSON.stringify(result, null, 2),
  );
  console.log(result);
  await b.close();
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
