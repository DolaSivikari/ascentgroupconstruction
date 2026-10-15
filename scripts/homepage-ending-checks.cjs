// Optional hook in the offline fixture runner. Never submits forms.
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

module.exports = async ({ page, output, width }) => {
  const candidate = process.env.HERO_QA_ENDING_BEFORE !== "true";
  if (!candidate) {
    await page.evaluate(() => {
      const section = [...document.querySelectorAll("section")].find(
        (node) =>
          node.querySelector("h2")?.textContent ===
            "Ready to Start Your Project?" &&
          node.querySelector('a[href="/prequalification"]'),
      );
      if (!section) throw new Error("Missing original ending section");
      section.setAttribute("data-ending-reference", "");
    });
  }
  const selector = candidate
    ? "[data-homepage-ending]"
    : "[data-ending-reference]";
  await page.waitForSelector(selector);
  await page.$eval(selector, (node) =>
    node.scrollIntoView({ block: "start", behavior: "instant" }),
  );
  const snapshot = await page.$eval(selector, (section) => {
    const style = getComputedStyle(section);
    return {
      height: section.getBoundingClientRect().height,
      background: style.backgroundColor,
      backgroundImage: style.backgroundImage,
      links: [...section.querySelectorAll("a")].map((link) => ({
        name: link.textContent.trim(),
        href: link.getAttribute("href"),
      })),
      h2: section.querySelectorAll("h2").length,
      h3: section.querySelectorAll("h3").length,
      overflow: document.documentElement.scrollWidth > innerWidth,
    };
  });
  assert.equal(snapshot.overflow, false);
  assert.equal(snapshot.h2, 1);
  assert.equal(snapshot.h3, 3);
  assert.deepEqual(
    snapshot.links.map((link) => link.href),
    ["/contact", "/projects", "/prequalification"],
  );
  if (candidate) {
    assert.equal(snapshot.backgroundImage, "none");
    assert.deepEqual(
      snapshot.links.map((link) => link.name),
      ["Contact us", "See our work", "See prequalification details"],
    );
    assert.equal(
      await page.$$eval(
        `${selector} button, ${selector} input, ${selector} [tabindex]`,
        (nodes) => nodes.length,
      ),
      0,
    );
    // Tab into the section from the last interactive control in the preceding form band.
    const prior = await page.evaluateHandle((selector) => {
      const section = document.querySelector(selector);
      const focusable = [
        ...document.querySelectorAll(
          "a[href],button,input,textarea,select,[tabindex]",
        ),
      ].filter(
        (node) =>
          node.tabIndex >= 0 &&
          !node.disabled &&
          !node.closest("[inert]") &&
          node.getClientRects().length &&
          getComputedStyle(node).visibility !== "hidden" &&
          Boolean(
            node.compareDocumentPosition(section) &
              Node.DOCUMENT_POSITION_FOLLOWING,
          ),
      );
      return focusable.at(-1);
    }, selector);
    await prior.asElement().focus();
    for (const expected of snapshot.links) {
      await page.keyboard.press("Tab");
      const active = await page.evaluate(() => {
        const node = document.activeElement;
        const css = getComputedStyle(node);
        return {
          href: node.getAttribute("href"),
          text: node.textContent.trim(),
          ring: css.boxShadow,
          visible: node.getBoundingClientRect().width > 0,
        };
      });
      assert.equal(active.href, expected.href);
      assert.equal(active.text, expected.name);
      assert.equal(active.visible, true);
      assert.notEqual(active.ring, "none");
    }
    // At the page bottom the final destination remains above the fixed inquiry bar.
    await page.evaluate(() =>
      scrollTo(0, document.documentElement.scrollHeight),
    );
    const lastLink = await page.$eval(
      `${selector} ul > li:last-child a`,
      (node) => node.getBoundingClientRect().bottom,
    );
    assert.ok(lastLink < (await page.evaluate(() => innerHeight)) - 100);
    snapshot.keyboardOrder = "three links reached from preceding section";
    snapshot.lastLinkClearAtPageBottom = true;
  }
  await page.$eval(selector, (node) =>
    node.scrollIntoView({ block: "start", behavior: "instant" }),
  );
  await (
    await page.$(selector)
  ).screenshot({ path: path.join(output, `homepage-ending-${width}.png`) });
  fs.writeFileSync(
    path.join(output, `homepage-ending-${width}.json`),
    JSON.stringify(snapshot, null, 2),
  );
  await page.evaluate(() => scrollTo(0, 0));
};
