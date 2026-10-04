import { beforeEach, describe, expect, it, vi } from "vitest";
import { removeSavedGalleryFiles } from "./projectPersistence";
import type { ProjectImage } from "./projectEditor";
const mock = vi.hoisted(() => ({
  remove: vi.fn(),
  referenced: false,
  failedRead: false,
}));
vi.mock("@/integrations/supabase/client", () => ({
  supabase: {
    storage: {
      from: () => ({
        getPublicUrl: () => ({
          data: {
            publicUrl:
              "https://storage.example.test/storage/v1/object/public/project-images/",
          },
        }),
        remove: mock.remove,
      }),
    },
    from: () => ({
      select: () => ({
        eq: () => ({
          limit: async () => ({
            data: mock.referenced ? [{ id: "still-used" }] : [],
            error: mock.failedRead ? { message: "Read denied" } : null,
          }),
        }),
      }),
    }),
  },
}));
const removed: ProjectImage = {
  id: "old",
  url: "https://storage.example.test/storage/v1/object/public/project-images/project-1/gallery/image.jpg",
  category: "gallery",
  order: 0,
  featured: false,
};
beforeEach(() => {
  vi.clearAllMocks();
  mock.referenced = false;
  mock.failedRead = false;
  mock.remove.mockResolvedValue({ error: null });
});
describe("post-save storage cleanup", () => {
  it("removes only unreferenced files in the project's storage bucket", async () => {
    expect(
      await removeSavedGalleryFiles([
        removed,
        { ...removed, url: "https://external.example.test/retained.jpg" },
      ]),
    ).toBeNull();
    expect(mock.remove).toHaveBeenCalledWith(["project-1/gallery/image.jpg"]);
  });
  it("retains files still used by a gallery or featured image", async () => {
    mock.referenced = true;
    expect(await removeSavedGalleryFiles([removed])).toBeNull();
    expect(mock.remove).not.toHaveBeenCalled();
  });
  it("retains storage files if reference checks fail", async () => {
    mock.failedRead = true;
    expect(await removeSavedGalleryFiles([removed])).toContain(
      "retained in storage",
    );
    expect(mock.remove).not.toHaveBeenCalled();
  });
  it("reports failed cleanup separately from a completed database save", async () => {
    mock.remove.mockResolvedValue({ error: { message: "Storage denied" } });
    expect(await removeSavedGalleryFiles([removed])).toContain(
      "Storage denied",
    );
  });
});
