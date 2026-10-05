import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/ui/Button";
import { useToast } from "@/hooks/use-toast";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { InviteUserDialog } from "@/components/admin/InviteUserDialog";
import { AdminPageLayout } from "@/components/admin/AdminPageLayout";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { adminErrorMessage } from "@/lib/admin/editorValues";
import {
  replaceAdminRole,
  type SupportedAdminRole,
} from "@/lib/admin/userRoles";
import type { Database } from "@/integrations/supabase/types";

type TeamUser = Pick<
  Database["public"]["Tables"]["profiles"]["Row"],
  "id" | "email" | "full_name"
> & { roles: string[] };
const Users = () => {
  const { toast } = useToast();
  const { isLoading: authLoading, isAdmin, user: currentUser } = useAdminAuth();
  const [users, setUsers] = useState<TeamUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [pendingRole, setPendingRole] = useState<{
    userId: string;
    role: SupportedAdminRole;
  } | null>(null);
  const isSuperAdmin =
    !loadError &&
    users.some(
      (user) =>
        user.id === currentUser?.id && user.roles.includes("super_admin"),
    );
  const superAdminCount = users.filter((user) =>
    user.roles.includes("super_admin"),
  ).length;

  const loadUsers = async () => {
    setIsLoading(true);
    setLoadError(null);
    try {
      const [profiles, roles] = await Promise.all([
        supabase.from("profiles").select("id, email, full_name"),
        supabase.from("user_roles").select("user_id, role"),
      ]);
      if (profiles.error) throw profiles.error;
      if (roles.error) throw roles.error;
      setUsers(
        (profiles.data || []).map((profile) => ({
          ...profile,
          roles: (roles.data || [])
            .filter((role) => role.user_id === profile.id)
            .map((role) => role.role),
        })),
      );
    } catch (error) {
      setUsers([]);
      setLoadError(adminErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    if (isAdmin) void loadUsers();
  }, [isAdmin, currentUser?.id]);

  const changeRole = async () => {
    if (!pendingRole || !isSuperAdmin || saving) return;
    const member = users.find((user) => user.id === pendingRole.userId);
    if (
      !member ||
      (member.roles.includes("super_admin") &&
        pendingRole.role !== "super_admin" &&
        superAdminCount <= 1)
    )
      return;
    setSaving(true);
    try {
      await replaceAdminRole(pendingRole.userId, pendingRole.role);
      toast({
        title: "Role updated",
        description: "The saved role has been updated.",
      });
    } catch (error) {
      toast({
        title: "Role change incomplete",
        description: adminErrorMessage(error),
        variant: "destructive",
      });
    } finally {
      setSaving(false);
      setPendingRole(null);
      await loadUsers();
    }
  };
  if (authLoading) return <p>Verifying admin access…</p>;
  if (!isAdmin) return null;
  return (
    <AdminPageLayout
      title="User Management"
      description="Team accounts and saved roles"
      actions={
        isSuperAdmin && !isLoading ? (
          <InviteUserDialog onUserCreated={() => void loadUsers()} />
        ) : undefined
      }
    >
      {!isLoading && !isSuperAdmin && !loadError && (
        <p className="text-sm text-muted-foreground">
          Only a super admin can invite users or change roles.
        </p>
      )}
      {loadError ? (
        <div role="alert" className="rounded-lg border p-4 space-y-3">
          <p>Could not load team accounts. {loadError}</p>
          <Button variant="outline" onClick={() => void loadUsers()}>
            Retry loading users
          </Button>
        </div>
      ) : isLoading ? (
        <p>Loading users…</p>
      ) : (
        <div className="business-glass-card p-4 sm:p-6 space-y-4">
          <h2 className="business-section-title">
            Team Members ({users.length})
          </h2>
          {users.map((user) => (
            <div
              key={user.id}
              className="flex flex-wrap items-center justify-between gap-3 p-4 border rounded-lg"
            >
              <div className="min-w-0">
                <p className="font-medium break-words">
                  {user.full_name || "No name"}
                </p>
                <p className="text-sm text-muted-foreground break-all">
                  {user.email}
                </p>
              </div>
              {isSuperAdmin ? (
                <div className="space-y-1">
                  <Select
                    disabled={
                      saving ||
                      (user.roles.includes("super_admin") &&
                        superAdminCount <= 1)
                    }
                    value={
                      user.roles.includes("super_admin")
                        ? "super_admin"
                        : user.roles.includes("admin")
                          ? "admin"
                          : ""
                    }
                    onValueChange={(value) => {
                      if (value === "admin" || value === "super_admin")
                        setPendingRole({ userId: user.id, role: value });
                    }}
                  >
                    <SelectTrigger
                      className="w-[160px]"
                      aria-label={`Role for ${user.full_name || user.email}`}
                    >
                      <SelectValue
                        placeholder={user.roles.join(", ") || "No role"}
                      />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="super_admin">Super Admin</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                  {user.roles.includes("super_admin") &&
                    superAdminCount <= 1 && (
                      <p className="text-xs text-muted-foreground">
                        At least one super admin must remain.
                      </p>
                    )}
                </div>
              ) : (
                <div className="flex flex-wrap gap-1">
                  {user.roles.length ? (
                    user.roles.map((role) => (
                      <Badge key={role} variant="outline">
                        {role}
                      </Badge>
                    ))
                  ) : (
                    <Badge variant="secondary">No role</Badge>
                  )}
                </div>
              )}
            </div>
          ))}
          {!users.length && <p>No team accounts found.</p>}
        </div>
      )}
      <ConfirmDialog
        open={!!pendingRole}
        onOpenChange={(open) => {
          if (!open && !saving) setPendingRole(null);
        }}
        title="Change saved role?"
        description={`Assign ${pendingRole?.role === "super_admin" ? "Super Admin" : "Admin"} to this account?`}
        confirmText="Change role"
        onConfirm={() => void changeRole()}
      />
    </AdminPageLayout>
  );
};
export default Users;
