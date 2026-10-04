import { beforeEach, describe, expect, it, vi } from "vitest";
import { replaceAdminRole } from "./userRoles";
const mock = vi.hoisted(() => ({
  add: vi.fn(),
  remove: vi.fn(),
  actions: [] as string[],
}));
vi.mock("@/integrations/supabase/client", () => ({
  supabase: {
    from: () => ({
      upsert: async (payload: unknown, options: unknown) => {
        mock.actions.push("add");
        return mock.add(payload, options);
      },
      delete: () => {
        mock.actions.push("remove");
        return { eq: () => ({ neq: mock.remove }) };
      },
    }),
  },
}));
beforeEach(() => {
  vi.clearAllMocks();
  mock.actions = [];
  mock.add.mockResolvedValue({ error: null });
  mock.remove.mockResolvedValue({ error: null });
});
describe("role change failure preservation", () => {
  it("adds the replacement before removing only other roles", async () => {
    await replaceAdminRole("member", "admin");
    expect(mock.actions).toEqual(["add", "remove"]);
    expect(mock.add).toHaveBeenCalledWith(
      { user_id: "member", role: "admin" },
      { onConflict: "user_id,role", ignoreDuplicates: true },
    );
    expect(mock.remove).toHaveBeenCalledWith("role", "admin");
  });
  it("never removes access when adding the replacement fails", async () => {
    mock.add.mockResolvedValue({ error: { code: "42501", message: "Denied" } });
    await expect(replaceAdminRole("member", "admin")).rejects.toMatchObject({
      code: "42501",
    });
    expect(mock.actions).toEqual(["add"]);
    expect(mock.remove).not.toHaveBeenCalled();
  });
  it("reports the retained old roles instead of claiming a partial change succeeded", async () => {
    mock.remove.mockResolvedValue({ error: { message: "Delete denied" } });
    await expect(replaceAdminRole("member", "admin")).rejects.toThrow(
      "previous roles were retained",
    );
  });
});
