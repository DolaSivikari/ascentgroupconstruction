import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  isSafeEditorLink,
  plainTextToHtml,
  sanitizeRichText,
} from "./richText";
beforeEach(() => vi.stubEnv("VITE_SUPABASE_URL", "https://media.fixture.supabase.co"));
afterEach(() => vi.unstubAllEnvs());
describe("public rich text", () => {
  it("preserves legacy paragraphs and single line breaks while escaping text", () => {
    expect(plainTextToHtml("One & two\nLine two\n\nNext <literal>")).toBe(
      "<p>One &amp; two<br>Line two</p><p>Next &lt;literal&gt;</p>",
    );
    expect(sanitizeRichText("First\nsecond\n\nThird")).toBe(
      "<p>First<br>second</p><p>Third</p>",
    );
  });
  it("keeps headings, formatting, lists and approved images but removes executable markup and Word styles", () => {
    const html = sanitizeRichText(
      '<h2 style="color:red" onclick="alert(1)">Heading</h2><ul><li><strong>Item</strong></li></ul><script>alert(1)</script><img src="https://media.fixture.supabase.co/storage/v1/object/public/project-images/image.jpg" alt="Building" onerror="alert(1)"><iframe src="https://bad.test"></iframe>',
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
it("blocks remote tracking images and signed/private storage links in public rich text", () => {
  const html = sanitizeRichText(
    '<img src="https://tracker.example.test/pixel"><img src="https://media.fixture.supabase.co/storage/v1/object/sign/project-images/private.jpg?token=secret"><img src="data:image/svg+xml,bad">',
  );
  expect(html).not.toContain("<img");
});
