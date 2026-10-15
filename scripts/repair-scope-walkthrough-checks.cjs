// Optional hook in the offline public fixture harness. No form submissions.
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

module.exports = async ({ page, output, width }) => {
  const section = "[data-repair-walkthrough]";
  await page.waitForSelector(section);
  await page.$eval(section, (node) =>
    node.scrollIntoView({ block: "start", behavior: "instant" }),
  );
  const image = await page.$(`${section} img`);
  await image.evaluate((node) => node.decode());
  assert.equal(await image.evaluate((node) => node.naturalWidth > 1000), true);
  assert.match(
    await page.$eval(section, (node) => node.innerText),
    /AI-generated reference image/,
  );
  const expected = [
    "Scope outline",
    "Field record outline",
    "Closeout index outline",
  ];
  const tabs = await page.$$(`${section} [role="tab"]`);
  assert.equal(tabs.length, 3);
  await tabs[0].focus();
  for (let index = 0; index < tabs.length; index++) {
    if (index) await page.keyboard.press("ArrowRight");
    await page.waitForFunction(
      (title) =>
        document
          .querySelector(
            '[data-repair-walkthrough] [role="tabpanel"][data-state="active"]',
          )
          .textContent.includes(title),
      {},
      expected[index],
    );
    const panel = await page.$eval(
      `${section} [role="tabpanel"][data-state="active"]`,
      (node) => node.innerText,
    );
    assert.match(panel, /W-01/);
    assert.match(panel, /What this helps you decide/);
    const details = await page.$(
      `${section} [role="tabpanel"][data-state="active"] details`,
    );
    assert.equal(await details.evaluate((node) => node.open), false);
    const summary = await details.$("summary");
    await summary.focus();
    await page.keyboard.press("Enter");
    assert.equal(await details.evaluate((node) => node.open), true);
    await page.keyboard.press("Enter");
    await tabs[index].focus();
  }
  await page.keyboard.press("Home");
  await page.waitForFunction(
    () =>
      document
        .querySelector('[data-repair-walkthrough] [role="tab"]')
        .getAttribute("aria-selected") === "true",
  );
  const links = await page.$$eval(`${section} a`, (nodes) =>
    nodes.map((node) => node.getAttribute("href")),
  );
  assert.deepEqual(links, ["/contact", "/company/technology", "/our-process"]);
  const allDetails = await page.$$(`${section} details`);
  const process = allDetails.at(-1);
  const processSummary = await process.$("summary");
  await processSummary.focus();
  await page.keyboard.press("Enter");
  assert.equal(await process.evaluate((node) => node.open), true);
  assert.equal(await process.$$eval("li", (nodes) => nodes.length), 4);
  await page.keyboard.press("Enter");
  assert.equal(await process.evaluate((node) => node.open), false);
  assert.equal(
    await page.evaluate(
      () => document.documentElement.scrollWidth > innerWidth,
    ),
    false,
  );
  const photoBox = await image.boundingBox();
  assert.ok(Math.abs(photoBox.width / photoBox.height - 1.5) < 0.02);
  await page.$eval(section, (node) =>
    node.scrollIntoView({ block: "start", behavior: "instant" }),
  );
  const node = await page.$(section);
  const sectionHeight = await node.evaluate(
    (element) => element.getBoundingClientRect().height,
  );
  await node.screenshot({
    path: path.join(output, `repair-scope-${width}.png`),
  });
  fs.writeFileSync(
    path.join(output, `repair-scope-${width}.json`),
    JSON.stringify(
      {
        width,
        loadedImage: true,
        sectionHeight,
        keyboardStages: expected,
        links,
        overflow: false,
      },
      null,
      2,
    ),
  );
  await page.evaluate(() => scrollTo(0, 0));
};
