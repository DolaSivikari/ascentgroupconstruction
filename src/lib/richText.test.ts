import { describe, expect, it } from "vitest";
import {
  isSafeEditorLink,
  plainTextToHtml,
  sanitizeRichText,
} from "./richText";
describe("public rich text", () => {
  it("preserves legacy paragraphs and single line breaks while escaping text", () => {
    expect(plainTextToHtml("One & two\nLine two\n\nNext <literal>")).toBe(
      "<p>One &amp; two<br>Line two</p><p>Next &lt;literal&gt;</p>",
    );
    expect(sanitizeRichText("First\nsecond\n\nThird")).toBe(
      "<p>First<br>second</p><p>Third</p>",
    );
  });
  it("keeps headings, formatting, lists and legacy images but removes executable markup and Word styles", () => {
    const html = sanitizeRichText(
      '<h2 style="color:red" onclick="alert(1)">Heading</h2><ul><li><strong>Item</strong></li></ul><script>alert(1)</script><img src="/image.jpg" alt="Building" onerror="alert(1)"><iframe src="https://bad.test"></iframe>',
    );
    expect(html).toContain("<h2>Heading</h2>");
    expect(html).toContain("<strong>Item</strong>");
    expect(html).toContain('alt="Building"');
    expect(html).not.toMatch(/onclick|onerror|style=|script|iframe|alert/);
  });
  it("removes executable links and adds safe rel attributes", () => {
    const html = sanitizeRichText(
      '<a href="javascript:alert(1)">Bad</a><a href="https://example.test">Good</a><a href="/contact">Contact</a>',
    );
    expect(html).not.toContain("javascript:");
    expect(html).toContain(
      'href="https://example.test" rel="noopener noreferrer"',
    );
    expect(html).toContain('href="/contact"');
  });
  it.each([
    "javascript:alert(1)",
    "//example.test",
    "http://example.test",
    "https://",
    "mailto:",
    "https://user:pass@example.test",
  ])("rejects unsafe or incomplete editor links: %s", (value) =>
    expect(isSafeEditorLink(value)).toBe(false),
  );
  it.each(["https://example.test/path", "mailto:info@example.test"])(
    "allows supported editor links: %s",
    (value) => expect(isSafeEditorLink(value)).toBe(true),
  );
});
