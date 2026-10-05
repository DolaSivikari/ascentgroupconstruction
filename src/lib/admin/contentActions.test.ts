import { beforeEach, describe, expect, it, vi } from "vitest";
import { duplicateContent } from "./contentActions";
const mock = vi.hoisted(() => ({
  insert: vi.fn(),
  relationships: vi.fn(),
  saveRelationships: vi.fn(),
}));
vi.mock("./projectPersistence", () => ({
  loadProjectRelationships: mock.relationships,
  saveProjectRelationships: mock.saveRelationships,
}));
vi.mock("@/integrations/supabase/client", () => ({
  supabase: {
    auth: { getUser: async () => ({ data: { user: { id: "admin" } } }) },
    from: () => ({
      select: () => ({
        eq: () => ({
          single: async () => ({
            data: {
              id: "source",
              title: "Published project",
              slug: "published-project",
              publish_state: "published",
              preview_token: "secret",
              featured: true,
              updated_at: "yesterday",
            },
            error: null,
          }),
        }),
      }),
      insert: (payload: unknown) => ({
        select: () => ({ single: () => mock.insert(payload) }),
      }),
    }),
  },
}));
beforeEach(() => {
  vi.clearAllMocks();
  mock.insert.mockResolvedValue({ data: { id: "copy" }, error: null });
  mock.relationships.mockResolvedValue({ images: [], serviceIds: ["service"] });
  mock.saveRelationships.mockResolvedValue({
    images: [],
    serviceIds: ["service"],
  });
});
describe("draft content copies", () => {
  it("creates a hidden copy with a new slug, no preview credentials, and preserved service relations", async () => {
    expect(await duplicateContent("projects", "source")).toBe("copy");
    const payload = mock.insert.mock.calls[0][0];
    expect(payload).toMatchObject({
      title: "Published project (copy)",
      publish_state: "draft",
      featured: false,
      created_by: "admin",
    });
    expect(payload.slug).toMatch(/^published-project-copy-/);
    expect(payload).not.toHaveProperty("id");
    expect(payload).not.toHaveProperty("preview_token");
    expect(mock.saveRelationships).toHaveBeenCalledWith(
      "copy",
      { images: [], serviceIds: ["service"] },
      { images: [], serviceIds: [] },
    );
  });
  it("does not insert an incomplete project copy when source relationships fail to load", async () => {
    mock.relationships.mockRejectedValue(new Error("Read denied"));
    await expect(duplicateContent("projects", "source")).rejects.toThrow(
      "Read denied",
    );
    expect(mock.insert).not.toHaveBeenCalled();
  });
  it("reports a partially created hidden copy without claiming full success", async () => {
    mock.saveRelationships.mockRejectedValue(new Error("Write denied"));
    await expect(duplicateContent("projects", "source")).rejects.toThrow(
      "draft copy was created (copy)",
    );
  });
});
