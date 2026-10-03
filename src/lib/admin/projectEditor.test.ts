import { describe, expect, it } from "vitest";
import { projectSavePayload, type ProjectFormData } from "./projectEditor";

const form: ProjectFormData = { slug: "fixture", title: "Fixture project", project_images: [], service_ids: [], trades_coordinated: "", peak_workforce: "", safety_incidents: "", team_credits: [{ role: "Fixture role", name: "Fixture person" }] };
describe("project editor persistence contract", () => {
  it("normalizes blank integer metrics to null and keeps zero", () => {
    expect(projectSavePayload({ ...form, safety_incidents: "0" })).toMatchObject({ trades_coordinated: null, peak_workforce: null, safety_incidents: 0 });
  });
  it("preserves existing project fields and omits editor-only relationships", () => {
    const result = projectSavePayload({ ...form, description: "Existing description", peak_workforce: "42", trades_coordinated: 7 });
    expect(result).toMatchObject({ description: "Existing description", peak_workforce: 42, trades_coordinated: 7, team_credits: form.team_credits });
    expect(result).not.toHaveProperty("project_images"); expect(result).not.toHaveProperty("service_ids");
  });
  it.each(["2.5", "-1", "not-a-number"])("rejects an invalid whole-number metric (%s) before save", (value) => {
    expect(() => projectSavePayload({ ...form, peak_workforce: value })).toThrow("Peak workforce must be a non-negative whole number");
  });
});
