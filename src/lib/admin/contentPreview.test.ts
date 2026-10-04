import { beforeEach, describe, expect, it, vi } from "vitest";
import { savePreviewLink } from "./contentPreview";
const mock = vi.hoisted(() => ({
  save: vi.fn(),
  payload: null as Record<string, unknown> | null,
  table: "",
  id: "",
}));
vi.mock("@/integrations/supabase/client", () => ({
  supabase: {
    from: (table: string) => {
      mock.table = table;
      return {
        update: (payload: Record<string, unknown>) => {
          mock.payload = payload;
          return {
            eq: (_key: string, id: string) => {
              mock.id = id;
              return { select: () => ({ single: mock.save }) };
            },
          };
        },
      };
    },
  },
}));
beforeEach(() => {
  vi.clearAllMocks();
  mock.save.mockResolvedValue({
    data: { id: "saved-id", slug: "stored-slug" },
    error: null,
  });
});
describe("saved draft previews", () => {
  it.each(["blog_posts", "projects"] as const)(
    "persists the token before returning a %s link using the stored slug",
    async (table) => {
      const url = await savePreviewLink(table, "saved-id", "unsaved-slug");
      expect(mock.table).toBe(table);
      expect(mock.id).toBe("saved-id");
      const params = new URL(url, "https://site.test").searchParams;
      expect(params.get("preview")).toBe("true");
      expect(params.get("token")).toBe(mock.payload?.preview_token);
      expect(url).toContain("/stored-slug?");
      expect(
        Date.parse(String(mock.payload?.preview_token_expires_at)),
      ).toBeGreaterThan(Date.now());
    },
  );
  it("does not produce a link when permission is denied", async () => {
    mock.save.mockResolvedValue({
      data: null,
      error: { code: "42501", message: "Denied" },
    });
    await expect(
      savePreviewLink("projects", "saved-id", "slug"),
    ).rejects.toMatchObject({ code: "42501" });
  });
  it("rejects new content and a zero-row write", async () => {
    await expect(savePreviewLink("blog_posts", "new", "slug")).rejects.toThrow(
      "Save this content",
    );
    expect(mock.save).not.toHaveBeenCalled();
    mock.save.mockResolvedValue({ data: null, error: null });
    await expect(
      savePreviewLink("projects", "saved-id", "slug"),
    ).rejects.toThrow("could not be saved");
  });
});
