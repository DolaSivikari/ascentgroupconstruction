import { describe, it, expect } from "vitest";
import { calculateSEOScore } from "../scoring";

describe("calculateSEOScore", () => {
  it("returns 0 with all recommendations when input is empty", () => {
    const r = calculateSEOScore({}, "blog");
    expect(r.score).toBe(0);
    expect(r.recommendations.length).toBeGreaterThanOrEqual(4);
  });

  it("awards full points for an ideal blog post", () => {
    const r = calculateSEOScore(
      {
        seo_title: "Toronto Building Envelope Restoration Services Guide", // 51 chars
        seo_description:
          "Comprehensive overview of building envelope restoration services across the GTA — facade, masonry, EIFS and waterproofing for commercial owners.", // ~146 chars
        seo_keywords: ["envelope", "restoration", "toronto"],
        featured_image: "https://example.com/img.jpg",
        content: "x".repeat(1500),
      },
      "blog",
    );
    expect(r.score).toBe(100);
    expect(r.recommendations).toEqual([]);
  });

  it("partial credit when title length is out of range", () => {
    const r = calculateSEOScore({ seo_title: "Too short" }, "service");
    expect(r.score).toBeGreaterThanOrEqual(15);
    expect(r.score).toBeLessThan(30);
    expect(r.recommendations.some((m) => /title/i.test(m))).toBe(true);
  });

  it("flags missing featured image", () => {
    const r = calculateSEOScore(
      {
        seo_title: "Toronto Building Envelope Restoration Services Guide",
        seo_description:
          "Comprehensive overview of building envelope restoration services across the GTA — facade, masonry, EIFS and waterproofing for commercial owners.",
        seo_keywords: ["envelope"],
        content: "x".repeat(1500),
      },
      "project",
    );
    expect(r.score).toBeLessThan(100);
    expect(r.recommendations.some((m) => /image/i.test(m))).toBe(true);
  });

  it("score never exceeds 100", () => {
    const r = calculateSEOScore(
      {
        seo_title: "Toronto Building Envelope Restoration Services Guide",
        seo_description:
          "Comprehensive overview of building envelope restoration services across the GTA — facade, masonry, EIFS and waterproofing for commercial owners.",
        seo_keywords: ["a", "b", "c", "d", "e", "f"],
        featured_image: "x",
        content: "x".repeat(5000),
        long_description: "x".repeat(5000),
      },
      "blog",
    );
    expect(r.score).toBeLessThanOrEqual(100);
  });
});
