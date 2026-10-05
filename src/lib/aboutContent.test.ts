import { describe, expect, it } from "vitest";
import { ABOUT_DEFAULTS, resolveAboutContent } from "./aboutContent";
describe("About content fallbacks", () => {
  it("keeps exactly the existing text for missing, empty and invalid rows", () => {
    expect(resolveAboutContent(null)).toEqual(ABOUT_DEFAULTS);
    expect(
      resolveAboutContent({
        hero_headline: "",
        story_content: [],
        stats: [{ value: "", label: "" }],
      }),
    ).toEqual(ABOUT_DEFAULTS);
  });
  it("mixes configured fields with their original per-field fallbacks", () => {
    const result = resolveAboutContent({
      hero_headline: "Owner headline",
      founder_name: "",
      story_content: ["Owner paragraph", ""],
      founder_image_url: "javascript:alert(1)",
    });
    expect(result.hero_headline).toBe("Owner headline");
    expect(result.founder_name).toBe(ABOUT_DEFAULTS.founder_name);
    expect(result.hero_intro).toBe(ABOUT_DEFAULTS.hero_intro);
    expect(result.story_content).toEqual(["Owner paragraph"]);
    expect(result.founder_image_url).toBe("");
  });
  it("preserves credential wording and does not mistake a custom label for Sto", () => {
    const result = resolveAboutContent({
      stats: [
        { value: "12", label: "Customer feedback" },
        { value: "$9M", label: "CGL Coverage" },
      ],
    });
    expect(result.stats).toContainEqual({
      value: "12",
      label: "Customer feedback",
    });
    expect(result.stats).toContainEqual({
      value: "$2M",
      label: "CGL Coverage",
    });
    expect(result.stats).not.toContainEqual({
      value: "$9M",
      label: "CGL Coverage",
    });
  });
});
