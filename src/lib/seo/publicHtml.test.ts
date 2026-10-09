import { expect, it } from "vitest";
import { inspectPublicDocument, markSharedShells } from "./publicHtml";

const inspect = (path: string, html: string, status = 200) =>
  inspectPublicDocument(
    new DOMParser().parseFromString(html, "text/html"),
    new URL(path, "https://www.ascentgroupconstruction.com"),
    status,
  );
const page = (path: string, title: string) =>
  `<html><head><title>${title}</title><meta name="description" content="A specific page description"><link rel="canonical" href="https://www.ascentgroupconstruction.com${path}"><meta property="og:url" content="https://www.ascentgroupconstruction.com${path}"><meta property="og:image" content="/og-image.png"><script type="application/ld+json">{"@type":"WebPage"}</script></head><body><main><h1>${title}</h1><p>This is readable page content for visitors who do not run JavaScript in their browser or fetcher.</p></main></body></html>`;
it("accepts distinct page HTML without executing scripts", () => {
  const pages = markSharedShells([
    inspect("/services", page("/services", "Services")),
    inspect("/about", page("/about", "About")),
  ]);
  expect(pages.every((item) => item.issues.length === 0)).toBe(true);
});
it("rejects a shared shell even when it carries a route-specific canonical", () => {
  const findings = markSharedShells([
    inspect("/services", page("/services", "Home")),
    inspect("/about", page("/about", "Home")),
  ]);
  expect(
    findings.every((item) =>
      item.issues.some((issue) => issue.includes("Same initial page")),
    ),
  ).toBe(true);
});
it("rejects script-only content, invalid schema, wrong canonicals and noindex", () => {
  const finding = inspect(
    "/services",
    '<html><head><title>Home</title><meta name="robots" content="noindex"><script type="application/ld+json">broken</script></head><body><div id="root"><script>document.write("many words of invented content inside a script are not readable HTML content")</script></div></body></html>',
  );
  expect(finding.contentWords).toBe(0);
  expect(finding.issues).toEqual(
    expect.arrayContaining([
      expect.stringContaining("canonical"),
      expect.stringContaining("noindex"),
      "Invalid JSON-LD in initial HTML.",
    ]),
  );
});
it("does not treat an HTML error response as a valid public page", () => {
  expect(inspect("/about", page("/about", "About"), 404).issues).toContain(
    "Expected HTTP 200, received 404.",
  );
});

it("checks a preview against its declared production canonical origin", () => {
  const document = new DOMParser().parseFromString(page("/about", "About"), "text/html");
  const url = new URL("https://preview.example.com/about");
  expect(inspectPublicDocument(document, url, 200, "https://www.ascentgroupconstruction.com").issues).toEqual([]);
  expect(inspectPublicDocument(document, url, 200).issues).toContain("Initial canonical must be https://preview.example.com/about.");
});
