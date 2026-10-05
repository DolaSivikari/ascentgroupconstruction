import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  deleteUnusedMedia,
  findMediaReferences,
  listMedia,
  validateMediaFile,
  type MediaAsset,
} from "./media";
const mock = vi.hoisted(() => ({
  rows: {} as Record<string, unknown[]>,
  denied: "",
  remove: vi.fn(),
  storageList: vi.fn(),
  tables: [] as string[],
}));
const root =
  "https://storage.example.test/storage/v1/object/public/project-images/";
vi.mock("@/integrations/supabase/client", () => ({
  supabase: {
    storage: {
      from: () => ({
        getPublicUrl: (path: string) => ({ data: { publicUrl: root + path } }),
        remove: mock.remove,
        list: mock.storageList,
      }),
    },
    from: (table: string) => {
      mock.tables.push(table);
      const q = {
        select: () => q,
        eq: () => q,
        in: () => q,
        order: () => q,
        delete: () => q,
        range: (from: number, to: number) =>
          Promise.resolve({
            data: (mock.rows[table] || []).slice(from, to + 1),
            error:
              mock.denied === table
                ? { code: "42501", message: "Denied" }
                : null,
          }),
        then: (done: (value: unknown) => unknown) =>
          Promise.resolve({
            data: mock.rows[table] || [],
            error:
              mock.denied === table
                ? { code: "42501", message: "Denied" }
                : null,
          }).then(done),
      };
      return q;
    },
  },
}));
const asset: MediaAsset = {
  name: "image.jpg",
  path: "project/gallery/image.jpg",
  url: root + "project/gallery/image.jpg",
  folder: false,
  size: 100,
  updatedAt: null,
  altText: "",
};
beforeEach(() => {
  vi.clearAllMocks();
  mock.rows = {};
  mock.denied = "";
  mock.tables = [];
  mock.remove.mockResolvedValue({ error: null });
});
describe("reference-checked media deletion", () => {
  it("finds draft rich text, nested gallery JSON and About image references", async () => {
    mock.rows.blog_posts = [
      {
        id: "draft",
        publish_state: "draft",
        content: `<p><img src="${asset.url}"></p>`,
      },
    ];
    mock.rows.projects = [{ id: "project", images: [{ url: asset.url }] }];
    mock.rows.about_page_settings = [
      { id: "about", founder_image_url: asset.url },
    ];
    expect(await findMediaReferences(asset.url)).toHaveLength(3);
    expect(mock.tables).toContain("hero_slides");
  });
  it("retains images referenced by page drafts and publication undo history", async () => {
    mock.rows.content_entries = [
      { id: "draft", draft_value: { url: asset.url } },
    ];
    mock.rows.content_entry_versions = [
      { id: "history", value: { image: asset.url } },
    ];
    await expect(deleteUnusedMedia(asset)).rejects.toThrow("used by 2");
    expect(mock.remove).not.toHaveBeenCalled();
  });
  it("rechecks references at deletion time and refuses a newly used file", async () => {
    expect(await findMediaReferences(asset.url)).toEqual([]);
    mock.rows.services = [{ id: "new-use", featured_image: asset.url }];
    await expect(deleteUnusedMedia(asset)).rejects.toThrow("used by 1");
    expect(mock.remove).not.toHaveBeenCalled();
  });
  it("retains files when any reference read fails", async () => {
    mock.denied = "hero_slides";
    await expect(deleteUnusedMedia(asset)).rejects.toThrow("File retained");
    expect(mock.remove).not.toHaveBeenCalled();
  });
  it("removes only a verified unused file in the correct bucket", async () => {
    expect(await deleteUnusedMedia(asset)).toBeNull();
    expect(mock.remove).toHaveBeenCalledExactlyOnceWith([asset.path]);
    await expect(
      deleteUnusedMedia({ ...asset, url: "https://external.test/image.jpg" }),
    ).rejects.toThrow("inside project-images");
    expect(mock.remove).toHaveBeenCalledTimes(1);
  });
  it("pages through all references rather than checking only the first 500", async () => {
    mock.rows.projects = [
      ...Array.from({ length: 500 }, (_, index) => ({ id: index })),
      { id: "late", featured_image: asset.url },
    ];
    expect(await findMediaReferences(asset.url)).toContainEqual({
      table: "projects",
      id: "late",
      title: "late",
    });
  });
  it("reports storage failures without claiming deletion succeeded", async () => {
    mock.remove.mockResolvedValue({ error: new Error("Storage denied") });
    await expect(deleteUnusedMedia(asset)).rejects.toThrow("Storage denied");
  });
});
describe("media uploads and listing", () => {
  it("rejects unsupported, empty and oversized files before upload", () => {
    for (const file of [
      new File(["x"], "script.svg", { type: "image/svg+xml" }),
      new File([], "empty.jpg", { type: "image/jpeg" }),
      new File([new Uint8Array(10 * 1024 * 1024 + 1)], "large.jpg", {
        type: "image/jpeg",
      }),
    ])
      expect(() => validateMediaFile(file)).toThrow();
    expect(() =>
      validateMediaFile(
        new File(["image"], "photo.webp", { type: "image/webp" }),
      ),
    ).not.toThrow();
  });
  it("browses real storage folders and applies saved alt text", async () => {
    mock.storageList.mockResolvedValue({
      data: [
        { name: "folder", id: null },
        { name: "photo.jpg", id: "file", metadata: { size: 50 } },
      ],
      error: null,
    });
    mock.rows.media_asset_metadata = [
      { path: "photo.jpg", alt_text: "Owner description" },
    ];
    const result = await listMedia();
    expect(result.files[0].folder).toBe(true);
    expect(result.files[1].altText).toBe("Owner description");
    expect(result.metadataReady).toBe(true);
  });
});
