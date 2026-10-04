import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { ReactNode } from "react";
import Users from "./Users";
const mock = vi.hoisted(() => ({
  role: "admin",
  error: false,
  toast: vi.fn(),
}));
vi.mock("@/hooks/useAdminAuth", () => ({
  useAdminAuth: () => ({
    isAdmin: true,
    isLoading: false,
    user: { id: "current-user" },
  }),
}));
vi.mock("@/hooks/use-toast", () => ({
  useToast: () => ({ toast: mock.toast }),
}));
vi.mock("@/components/admin/AdminPageLayout", () => ({
  AdminPageLayout: ({
    children,
    actions,
  }: {
    children: ReactNode;
    actions?: ReactNode;
  }) => (
    <>
      {actions}
      {children}
    </>
  ),
}));
vi.mock("@/components/admin/InviteUserDialog", () => ({
  InviteUserDialog: () => <button>Invite User</button>,
}));
vi.mock("@/integrations/supabase/client", () => ({
  supabase: {
    from: (table: string) => ({
      select: async () =>
        mock.error
          ? { data: null, error: { code: "42501", message: "Denied" } }
          : {
              data:
                table === "profiles"
                  ? [
                      {
                        id: "current-user",
                        email: "fixture@example.test",
                        full_name: "Fixture Admin",
                      },
                    ]
                  : [{ user_id: "current-user", role: mock.role }],
              error: null,
            },
    }),
  },
}));
beforeEach(() => {
  mock.role = "admin";
  mock.error = false;
});
afterEach(cleanup);
describe("actual account roles", () => {
  it("shows read-only roles for regular admins without imaginary active status or permissions", async () => {
    render(<Users />);
    await screen.findByText("Fixture Admin");
    expect(screen.queryByText("Invite User")).toBeNull();
    expect(screen.queryByRole("combobox")).toBeNull();
    expect(screen.queryByText("Active")).toBeNull();
    expect(screen.queryByText("Role Definitions")).toBeNull();
    expect(screen.queryByText("Permission Matrix")).toBeNull();
  });
  it("allows invitations for verified super admins and protects the last super admin in this UI", async () => {
    mock.role = "super_admin";
    render(<Users />);
    await screen.findByText("Fixture Admin");
    expect(screen.getByText("Invite User")).toBeInTheDocument();
    expect(screen.getByRole("combobox")).toBeDisabled();
    expect(
      screen.getByText("Keep at least one super admin."),
    ).toBeInTheDocument();
  });
  it("does not show edit controls after a failed role read", async () => {
    mock.error = true;
    render(<Users />);
    expect(await screen.findByRole("alert")).toHaveTextContent("permission");
    expect(screen.queryByText("Invite User")).toBeNull();
  });
});
