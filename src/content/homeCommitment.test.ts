import { describe, expect, it } from "vitest";
import { loadContentModules, relatedModulesForPath } from "./registry";
import contentModule, { homeCommitment } from "./pages/home-commitment";
import { restoreStructured } from "./structured";

describe("homepage commitment editing contract", () => {
  it("registers the supplied statement in the homepage's existing Pages modules", async () => {
    const modules = await loadContentModules();
    expect(modules.get("home-commitment")).toEqual(contentModule);
    expect(relatedModulesForPath(modules, "/")).toContainEqual(contentModule);
    expect(contentModule.meta.title.locked).toBe(false);
    expect(contentModule.defaults.title).toBe("Built to be documented");
  });
  it("resolves existing admin field values without changing the remaining defaults", () => {
    expect(
      restoreStructured(homeCommitment, {
        title: "Reviewed statement",
        points_1: "Reviewed reporting",
      }),
    ).toEqual({
      ...homeCommitment,
      title: "Reviewed statement",
      points: [
        homeCommitment.points[0],
        "Reviewed reporting",
        homeCommitment.points[2],
      ],
    });
  });
});
