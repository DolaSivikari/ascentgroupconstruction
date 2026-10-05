import { describe, expect, it, vi } from "vitest";
import { removeSavedGalleryFiles } from "./projectPersistence";
const remove = vi.fn();
vi.mock("@/integrations/supabase/client", () => ({
  supabase: { storage: { from: () => ({ remove }) } },
}));
describe("post-save gallery files", () => {
  it("retains removed gallery files and directs the owner to reference-checked Media deletion", async () => {
    const result = await removeSavedGalleryFiles([
      {
        id: "old",
        url: "https://example.test/image.jpg",
        category: "gallery",
        order: 0,
        featured: false,
      },
    ]);
    expect(result).toContain("Delete checks all content references");
    expect(remove).not.toHaveBeenCalled();
  });
  it("has no cleanup message when no image was removed", async () => {
    expect(await removeSavedGalleryFiles([])).toBeNull();
    expect(remove).not.toHaveBeenCalled();
  });
});
