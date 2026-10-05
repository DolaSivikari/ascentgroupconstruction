// Offline comparison against the user's supplied design previews. Browser tooling stays outside app dependencies.
const { chromium } = require(
  process.env.REDESIGN_PLAYWRIGHT_MODULE ||
    "/workspace/.design-tools/browser/node_modules/playwright",
);
const fs = require("fs");
const assert = require("assert/strict");
const { fixture } = require("./fixtures.cjs");
const out =
  process.env.REDESIGN_EVIDENCE_DIR ||
  "/workspace/design-evidence/model-fidelity";
fs.mkdirSync(out, { recursive: true });
(async () => {
  const b = await chromium.launch({
    executablePath: "/usr/bin/chromium",
    args: ["--no-sandbox"],
  });
  const report = {
    geometry: [],
    renderedStates: [],
    access: [],
    pageErrors: [],
  };
  for (const width of [1440, 390]) {
    const pages = {};
    for (const source of ["reference", "candidate"]) {
      const p = await b.newPage({
        viewport: { width, height: 1000 },
        reducedMotion: "reduce",
      });
      p.on("pageerror", (e) =>
        report.pageErrors.push({ source, width, error: e.message }),
      );
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
      await p.goto(
        source === "reference"
          ? "http://127.0.0.1:8099/technology/technology-preview.html"
          : "http://127.0.0.1:4179/company/technology",
      );
      pages[source] = p;
    }
    for (const [view, label] of [
      ["blueprint", "Blueprint to 3D"],
      ["wall", "Stucco & EIFS wall section"],
      ["stucco", "Stucco & EIFS wall section"],
      ["record", "Project record"],
    ]) {
      for (const [source, p] of Object.entries(pages)) {
        await p.getByRole("tab", { name: label, exact: true }).click();
        if (view === "stucco") {
          await p
            .getByRole("button", {
              name:
                source === "reference" ? "3-coat stucco" : "Three-coat stucco",
              exact: true,
            })
            .click();
          const exp = p.getByRole("button", {
            name: "Exploded view",
            exact: true,
          });
          if ((await exp.getAttribute("aria-pressed")) === "true")
            await exp.click();
        }
        if (view === "blueprint" && source === "candidate")
          await p
            .getByRole("button", { name: "Build it", exact: true })
            .click();
      }
      if (width === 1440) {
        const geometry = {};
        for (const [source, p] of Object.entries(pages))
          geometry[source] = await p
            .locator(
              source === "reference"
                ? "#world > .box"
                : ".tech-world .tech-box",
            )
            .evaluateAll(
              (boxes, source) =>
                boxes.map((box) => ({
                  position: [
                    ...new DOMMatrix(
                      source === "reference"
                        ? box.style.transform
                        : box.parentElement.classList.contains(
                              "tech-model-part",
                            )
                          ? box.parentElement.style.transform
                          : box.style.transform,
                    ).toFloat64Array(),
                  ],
                  faces: [...box.children]
                    .filter((_, i) => source === "reference" || i !== 1)
                    .map((face) => ({
                      width: parseFloat(face.style.width),
                      height: parseFloat(face.style.height),
                      transform: [
                        ...new DOMMatrix(face.style.transform).toFloat64Array(),
                      ],
                    })),
                })),
              source,
            );
        assert.equal(
          geometry.candidate.length,
          geometry.reference.length,
          view + " box count",
        );
        geometry.reference.forEach((box, i) => {
          assert.deepEqual(
            geometry.candidate[i].faces,
            box.faces,
            view + " face dimensions/transforms, box " + i,
          );
          const a = box.position,
            c = geometry.candidate[i].position;
          a.forEach((n, j) =>
            assert(Math.abs(n - c[j]) < 0.0001, view + " position box " + i),
          );
        });
        report.geometry.push({
          view,
          boxes: geometry.reference.length,
          faceTransforms: "match supplied preview",
          positions: "match supplied preview",
        });
      }
      for (const state of view === "blueprint"
        ? ["assembled", "rotated"]
        : ["assembled", "exploded", "rotated"]) {
        for (const [source, p] of Object.entries(pages)) {
          if (state === "exploded" && view !== "blueprint") {
            const button = p.getByRole("button", {
              name:
                view === "record" && source === "reference"
                  ? "Fan out"
                  : "Exploded view",
              exact: true,
            });
            const pressed = await button.getAttribute("aria-pressed");
            if (pressed !== "true") await button.click();
          }
          if (state === "rotated") {
            const viewer = p.locator(
              source === "reference" ? "#viewer" : ".tech-viewer",
            );
            await viewer.focus();
            await p.keyboard.press("ArrowRight");
            await p.keyboard.press("ArrowRight");
            await p.keyboard.press("ArrowUp");
          }
          const viewer = p.locator(
            source === "reference" ? "#viewer" : ".tech-viewer",
          );
          await viewer.evaluate((el) =>
            scrollTo(0, el.getBoundingClientRect().top + scrollY - 130),
          );
          await p.waitForTimeout(100);
          await viewer.screenshot({
            path: `${out}/${source}-${view}-${state}-${width}.png`,
          });
          if (source === "candidate") {
            const bounds = await viewer.evaluate((el) => {
              const v = el.getBoundingClientRect();
              const faces = [...el.querySelectorAll(".tech-face")].map((f) =>
                f.getBoundingClientRect(),
              );
              return {
                left: Math.min(...faces.map((f) => f.left)) - v.left,
                right: Math.max(...faces.map((f) => f.right)) - v.left,
                top: Math.min(...faces.map((f) => f.top)) - v.top,
                bottom: Math.max(...faces.map((f) => f.bottom)) - v.top,
                width: v.width,
                height: v.height,
              };
            });
            assert(
              bounds.left >= -1 &&
                bounds.right <= bounds.width + 1 &&
                bounds.top >= -1 &&
                bounds.bottom <= bounds.height + 1,
              JSON.stringify({ view, state, width, bounds }),
            );
            report.renderedStates.push({
              view,
              state,
              width,
              bounds,
              clipping: false,
            });
          }
        }
      }
    }
    for (const [source, p] of Object.entries(pages)) {
      await p.goto(
        source === "reference"
          ? "http://127.0.0.1:8099/capabilities/capabilities-preview.html"
          : "http://127.0.0.1:4179/capabilities",
      );
      if (source === "candidate")
        await p.locator("#access-planning").scrollIntoViewIfNeeded();
      const input = p.locator(
        source === "reference" ? "#hs" : "#building-storeys",
      );
      await input.scrollIntoViewIfNeeded();
      for (const storeys of [1, 3, 8, 12, 20, 30]) {
        await input.evaluate((el, n) => {
          Object.getOwnPropertyDescriptor(
            HTMLInputElement.prototype,
            "value",
          ).set.call(el, String(n));
          el.dispatchEvent(new Event("input", { bubbles: true }));
        }, storeys);
        for (const name of [
          "Ladders & platforms",
          "Boom lift",
          "Frame scaffold",
          "Mast climber",
          "Swing stage",
        ]) {
          const button =
            source === "reference"
              ? p.locator("#acclist button").filter({ hasText: name })
              : p.getByRole("button", { name: new RegExp("^" + name) });
          if (await button.isDisabled()) continue;
          await button.click();
          const svg = p.locator(
            source === "reference"
              ? "#accsvg"
              : 'svg[aria-label^="Sample ' + storeys + '-storey"]',
          );
          await svg.evaluate((el) =>
            scrollTo(0, el.getBoundingClientRect().top + scrollY - 130),
          );
          if (source === "candidate") {
            assert.equal(
              await p.evaluate(
                () => document.documentElement.scrollWidth > innerWidth,
              ),
              false,
            );
            report.access.push({
              width,
              storeys,
              method: name,
              status: "passed",
            });
          }
          if ([3, 12, 30].includes(storeys))
            await svg.screenshot({
              path: `${out}/${source}-access-${storeys}-${name.split(" ")[0]}-${width}.png`,
            });
        }
      }
      await p.close();
    }
  }
  assert.equal(report.pageErrors.length, 0);
  fs.writeFileSync(out + "/results.json", JSON.stringify(report, null, 2));
  await b.close();
  console.log({
    geometry: report.geometry,
    renderedStates: report.renderedStates.length,
    accessStates: report.access.length,
  });
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
