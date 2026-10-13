// Called by the existing offline fixture browser harness; no backend requests.
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { PNG } = require("pngjs");

module.exports = async ({ page, output, width }) => {
  const wrapper = ".homepage-hero-scroll-frame";
  const hero = `${wrapper} > section`;
  const video = `${wrapper} .homepage-hero-media-frame video`;
  await page.waitForSelector(video);
  // Space pauses the existing carousel timer, leaving the looping video playing.
  await page.focus(hero);
  await page.keyboard.press("Space");
  await page.waitForFunction(
    (selector) => {
      const element = document.querySelector(selector);
      return element.readyState >= 2 && !element.paused;
    },
    { timeout: 15000 },
    video,
  );
  await page.evaluate((selector) => {
    const element = document.querySelector(selector);
    window.__scrollFrameCheck = {
      element,
      source: element.currentSrc,
      loads: 0,
      text: document.querySelector("h1").textContent,
    };
    element.addEventListener(
      "loadstart",
      () => window.__scrollFrameCheck.loads++,
    );
    element.addEventListener(
      "emptied",
      () => window.__scrollFrameCheck.loads++,
    );
  }, video);
  const settleScroll = async (y) => {
    await page.evaluate(async (y) => {
      scrollTo({ top: y, behavior: "instant" });
      await new Promise((resolve) =>
        requestAnimationFrame(() => requestAnimationFrame(resolve)),
      );
    }, y);
  };
  const state = () =>
    page.evaluate(
      ({ wrapper, video, hero }) => {
        const frame = document.querySelector(wrapper);
        const media = document.querySelector(
          `${wrapper} .homepage-hero-media-frame`,
        );
        const scene = document.querySelector(hero);
        const movie = document.querySelector(video);
        const actions = [...scene.querySelectorAll("a, button")];
        const check = window.__scrollFrameCheck;
        return {
          mode: frame.dataset.frameMode,
          progress: Number(
            frame.style.getPropertyValue("--hero-frame-progress"),
          ),
          extraHeight:
            frame.getBoundingClientRect().height -
            scene.getBoundingClientRect().height,
          position: getComputedStyle(scene).position,
          heroTop: scene.getBoundingClientRect().top,
          clip: getComputedStyle(media).clipPath,
          paused: movie.paused,
          sameVideo: movie === check.element,
          sameSource: movie.currentSrc === check.source,
          loads: check.loads,
          sameText: document.querySelector("h1").textContent === check.text,
          controlsVisible: actions.every(
            (action) =>
              getComputedStyle(action).visibility === "visible" &&
              getComputedStyle(action).pointerEvents !== "none",
          ),
          overflow: document.documentElement.scrollWidth > innerWidth,
          contentTransform: getComputedStyle(scene.querySelector("h1"))
            .transform,
          statement: document.body.innerText.includes("Built to be documented"),
        };
      },
      { wrapper, hero, video },
    );
  const checks = [];
  const verify = (result) => {
    assert.equal(result.paused, false, "Video paused during scroll");
    assert.equal(result.sameVideo, true, "Video was replaced");
    assert.equal(result.sameSource, true, "Video source changed during scroll");
    assert.equal(result.loads, 0, "Scroll reloaded the video");
    assert.equal(result.sameText, true);
    assert.equal(result.controlsVisible, true);
    assert.equal(result.overflow, false);
    assert.equal(result.statement, false);
    assert.ok(
      ["none", "matrix(1, 0, 0, 1, 0, 0)"].includes(result.contentTransform),
      "Headline was scaled or moved",
    );
    checks.push(result);
  };
  await settleScroll(0);
  const initial = await state();
  verify(initial);
  assert.equal(initial.progress, 0);
  assert.equal(initial.mode, "pinned");
  const height = page.viewport().height;
  assert.equal(initial.extraHeight, height * 0.5);
  for (const [name, y] of [
    ["initial", 0],
    ["midpoint", height * 0.25],
    ["framed", height * 0.5],
  ]) {
    await settleScroll(y);
    const result = await state();
    verify(result);
    assert.ok(
      Math.abs(result.heroTop) < 1,
      "Hero moved before pin ended: " + JSON.stringify(result),
    );
    if (name === "framed") {
      assert.equal(result.progress, 1);
      assert.equal(
        result.clip,
        width < 768
          ? "inset(32px 16px round 12px)"
          : "inset(13% 9% round 14px)",
      );
    }
    const screenshot = await page.screenshot({
      path: path.join(
        output,
        "screenshots",
        `scroll-frame-${name}-${width}.png`,
      ),
    });
    if (name === "framed") {
      const label = await page.$eval(`${hero} a span.relative.z-10`, (node) => {
        const rect = node.getBoundingClientRect();
        return {
          x: rect.x,
          y: rect.y,
          width: rect.width,
          height: rect.height,
          color: getComputedStyle(node)
            .color.match(/\d+/g)
            .slice(0, 3)
            .map(Number),
        };
      });
      const pixels = PNG.sync.read(Buffer.from(screenshot));
      let ink = 0;
      for (
        let y = Math.ceil(label.y);
        y < Math.floor(label.y + label.height);
        y++
      ) {
        for (
          let x = Math.ceil(label.x);
          x < Math.floor(label.x + label.width);
          x++
        ) {
          const offset = (y * pixels.width + x) * 4;
          if (
            label.color.every(
              (value, channel) =>
                Math.abs(pixels.data[offset + channel] - value) < 60,
            )
          )
            ink++;
        }
      }
      assert.ok(
        ink > 10,
        "Primary action label disappeared from the rendered frame",
      );
    }
  }
  const time = await page.$eval(video, (movie) => movie.currentTime);
  await page.waitForFunction(
    // The source loops every 12.9 seconds; crossing its end still proves playback.
    ({ video, time }) =>
      Math.abs(document.querySelector(video).currentTime - time) > 0.2,
    { timeout: 3000 },
    { video, time },
  );
  await settleScroll(height * 0.5 + 120);
  const released = await state();
  verify(released);
  assert.ok(
    released.heroTop < -100,
    "Hero failed to release into normal page flow",
  );
  await settleScroll(0);
  const reversed = await state();
  verify(reversed);
  assert.equal(reversed.progress, 0);

  await page.setViewport({ width, height: 400 });
  await page.waitForFunction(
    (selector) => document.querySelector(selector).dataset.frameMode === "flow",
    {},
    wrapper,
  );
  const short = await state();
  verify(short);
  assert.equal(short.extraHeight, 0);
  assert.equal(short.position, "relative");
  await page.setViewport({ width, height });
  await settleScroll(height * 0.5);
  // Exercise the actual hit targets while framed, without submitting an inquiry.
  await page.click(`${hero} button[aria-label="Go to slide 2"]`);
  await page.waitForFunction(
    ({ video, text }) =>
      document.querySelector("h1").textContent !== text &&
      document.querySelectorAll(video).length === 1 &&
      document.querySelector(video).parentElement.style.transition === "",
    {},
    {
      video,
      text: await page.evaluate(() => window.__scrollFrameCheck.text),
    },
  );
  const secondHeadline = await page.$eval("h1", (node) => node.textContent);
  await page.focus(hero);
  await page.keyboard.press("ArrowRight");
  await page.waitForFunction(
    ({ video, text }) =>
      document.querySelector("h1").textContent !== text &&
      document.querySelectorAll(video).length === 1 &&
      document.querySelector(video).parentElement.style.transition === "",
    {},
    { video, text: secondHeadline },
  );
  await page.waitForFunction(
    (selector) =>
      !document.querySelector(selector).paused &&
      document.querySelector(selector).readyState >= 2,
    {},
    video,
  );
  await page.emulateMediaFeatures([
    { name: "prefers-reduced-motion", value: "reduce" },
  ]);
  await page.waitForFunction(
    (selector) => document.querySelector(selector).dataset.frameMode === "off",
    {},
    wrapper,
  );
  const reduced = await page.$eval(wrapper, (node) => ({
    padding: parseFloat(getComputedStyle(node).paddingBottom),
    clip: getComputedStyle(node.querySelector(".homepage-hero-media-frame"))
      .clipPath,
    videos: node.querySelectorAll("video").length,
  }));
  assert.deepEqual(reduced, { padding: 0, clip: "none", videos: 0 });
  await page.evaluate(() =>
    Object.defineProperty(navigator, "connection", {
      configurable: true,
      value: { saveData: true },
    }),
  );
  await page.emulateMediaFeatures([
    { name: "prefers-reduced-motion", value: "no-preference" },
  ]);
  await page.waitForFunction(
    (selector) =>
      document.querySelector(selector).dataset.frameMode === "pinned",
    {},
    wrapper,
  );
  const dataSaver = await page.$eval(wrapper, (node) => ({
    videos: node.querySelectorAll("video").length,
    posterLoaded: [...node.querySelectorAll("img")].some(
      (image) => image.complete && image.naturalWidth > 0,
    ),
  }));
  assert.deepEqual(dataSaver, { videos: 0, posterLoaded: true });
  await settleScroll(0);
  fs.writeFileSync(
    path.join(output, `scroll-frame-checks-${width}.json`),
    JSON.stringify(
      {
        scope: "offline fixture, real local MP4 playback",
        width,
        checks,
        reduced,
        controls: { click: true, keyboard: true },
        dataSaver,
      },
      null,
      2,
    ) + "\n",
  );
};
