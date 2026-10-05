import { beforeEach, describe, expect, it, vi } from "vitest";
import { replaceAdminRole } from "./userRoles";
const mock = vi.hoisted(() => ({ rpc: vi.fn(), from: vi.fn() }));
vi.mock("@/integrations/supabase/client", () => ({ supabase: mock }));
beforeEach(() => {
  vi.clearAllMocks();
  mock.rpc.mockResolvedValue({ error: null });
});
describe("atomic role changes", () => {
  it("uses a single atomic RPC and never deletes roles through REST", async () => {
    await replaceAdminRole("member", "admin");
    expect(mock.rpc).toHaveBeenCalledExactlyOnceWith("set_user_role", {
      _user_id: "member",
      _role: "admin",
    });
    expect(mock.from).not.toHaveBeenCalled();
  });
  it.each(["PGRST202", "42883"])(
    "fails closed when the RPC is missing (%s)",
    async (code) => {
      mock.rpc.mockResolvedValue({ error: { code } });
      await expect(replaceAdminRole("member", "admin")).rejects.toThrow(
        "No roles were changed",
      );
      expect(mock.from).not.toHaveBeenCalled();
    },
  );
  it("reports the last-super-admin guard without a fallback", async () => {
    mock.rpc.mockResolvedValue({ error: { code: "23514" } });
    await expect(replaceAdminRole("member", "admin")).rejects.toThrow(
      "At least one super admin must remain",
    );
    expect(mock.from).not.toHaveBeenCalled();
  });
  it("preserves the permission error", async () => {
    mock.rpc.mockResolvedValue({ error: { code: "42501", message: "Denied" } });
    await expect(replaceAdminRole("member", "admin")).rejects.toMatchObject({
      code: "42501",
    });
    expect(mock.from).not.toHaveBeenCalled();
  });
});
