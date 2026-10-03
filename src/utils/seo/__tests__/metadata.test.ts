import { describe, expect, it } from "vitest";
import { pageTitle, publicImageUrl } from "../metadata";

describe("public metadata", () => {
  it.each([
    "Services | Ascent Group",
    "Projects | Ascent Group Construction",
    "About Ascent",
  ])("does not duplicate the brand in %s", (title) => {
    expect(pageTitle(title)).toBe(title);
  });
  it("brands an unbranded title without truncating its meaning", () => {
    expect(pageTitle("Commercial Painting")).toBe(
      "Commercial Painting | Ascent Group Construction",
    );
  });
  it.each(["/assets/hero.webp", "assets/hero.webp"])(
    "resolves the relative image %s on the canonical domain",
    (image) => {
      expect(publicImageUrl(image)).toBe(
        "https://www.ascentgroupconstruction.com/assets/hero.webp",
      );
    },
  );
  it.each([
    "data:image/png;base64,not-a-public-url",
    "javascript:alert(1)",
    "https://user:password@example.com/image.png",
    undefined,
  ])("uses a public fallback for %s", (image) => {
    expect(publicImageUrl(image)).toBe(
      "https://www.ascentgroupconstruction.com/og-image.png",
    );
  });
});
