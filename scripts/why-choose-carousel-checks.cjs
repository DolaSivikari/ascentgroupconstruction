// Runs inside the existing offline browser fixture; never submits forms or writes data.
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

module.exports = async ({ page, output, width }) => {
  const selector = "[data-why-carousel]";
  await page.waitForSelector(selector);
  await page.$eval(selector, (node) =>
    node.scrollIntoView({ block: "start", behavior: "instant" }),
  );
  await page.mouse.move(-10, -10);
  const snapshot = () =>
    page.$eval(selector, (node) => {
      const active = node.querySelector(
        '[aria-roledescription="slide"][data-active="true"]',
      );
      const stage = node.querySelector(".why-carousel-stage");
      return {
        label: active.getAttribute("aria-label"),
        activeIds: [...active.querySelectorAll("[data-benefit-id]")].map(
          (item) => item.dataset.benefitId,
        ),
        count: node.querySelectorAll('[aria-roledescription="slide"]').length,
        stageHeight: stage.getBoundingClientRect().height,
        sectionHeight: node.getBoundingClientRect().height,
        safeHiddenSlides: [
          ...node.querySelectorAll(
            '[aria-roledescription="slide"][data-active="false"]',
          ),
        ].every(
          (slide) =>
            slide.inert && slide.getAttribute("aria-hidden") === "true",
        ),
        overflow: document.documentElement.scrollWidth > innerWidth,
        actions: [
          ...node.querySelectorAll(
            '.why-carousel-actions [data-active="true"] a',
          ),
        ].map((link) => link.getAttribute("href")),
        reduced: matchMedia("(prefers-reduced-motion: reduce)").matches,
      };
    });
  const settle = () =>
    page.waitForFunction(
      (selector) => {
        const nodes = [
          ...document
            .querySelector(selector)
            .querySelectorAll(".why-carousel-panel"),
        ];
        return nodes.every(
          (node) =>
            Number(getComputedStyle(node).opacity) ===
            (node.dataset.active === "true" ? 1 : 0),
        );
      },
      {},
      selector,
    );
  const start = await snapshot();
  assert.equal(start.count, width >= 1024 ? 5 : width >= 640 ? 7 : 13);
  assert.equal(
    start.activeIds.length,
    width >= 1024 ? 3 : width >= 640 ? 2 : 1,
  );
  let autoRotation = "disabled for reduced motion";
  if (!start.reduced) {
    await page.waitForFunction(
      ({ selector, label }) =>
        document
          .querySelector(selector)
          .querySelector('[aria-roledescription="slide"][data-active="true"]')
          .getAttribute("aria-label") !== label,
      { timeout: 18000 },
      { selector, label: start.label },
    );
    await settle();
    autoRotation = "observed real 12-second rotation";
  }

  const audienceButtons = await page.$$(`${selector} button[aria-pressed]`);
  await audienceButtons[0].click();
  await settle();
  const region = await page.$(selector);
  await region.screenshot({
    path: path.join(output, "screenshots", `why-clients-${width}.png`),
  });
  await audienceButtons[1].click();
  await settle();
  const owner = await snapshot();
  assert.deepEqual(owner.actions, ["/contact", "/projects"]);
  await region.screenshot({
    path: path.join(output, "screenshots", `why-owners-${width}.png`),
  });
  const seen = new Set();
  const states = [];
  for (let i = 0; i < start.count; i++) {
    const state = await snapshot();
    assert.equal(state.safeHiddenSlides, true);
    assert.equal(state.overflow, false);
    assert.ok(
      Math.abs(state.stageHeight - start.stageHeight) <= 1,
      "Carousel stage changed height",
    );
    assert.ok(
      Math.abs(state.sectionHeight - start.sectionHeight) <= 1,
      "Carousel section changed height",
    );
    state.activeIds.forEach((id) => seen.add(id));
    states.push(state);
    await page.click(`${selector} button[aria-label="Next benefits"]`);
    await settle();
  }
  assert.equal(seen.size, 13, "Some existing benefits cannot be reached");
  assert.equal(
    await page.$eval('[href="/for-general-contractors"]', (node) => !!node),
    true,
  );

  await page.click(`${selector} summary`);
  await page.waitForFunction(
    (selector) =>
      document.querySelector(selector).querySelector("details").open,
    {},
    selector,
  );
  const expandedText = await page.$eval(
    `${selector} details`,
    (node) => node.innerText,
  );
  assert.ok(
    expandedText.includes("applicable manufacturer and workmanship warranties"),
  );
  assert.ok(expandedText.includes("Ready to Start Your Project?"));
  await page.click(`${selector} summary`);
  await audienceButtons[0].click();
  await settle();
  // Restore deterministic initial state for the public capture.
  await page.evaluate(() => scrollTo({ top: 0, behavior: "instant" }));
  fs.writeFileSync(
    path.join(output, `why-carousel-checks-${width}.json`),
    JSON.stringify(
      {
        scope:
          "offline fixture, all 13 fallback benefits; existing live content sources retained",
        width,
        autoRotation,
        start,
        owner,
        states,
        visibleBenefits: [...seen],
        expandedCopy: "protected warranties and proposal copy verified",
      },
      null,
      2,
    ) + "\n",
  );
};
