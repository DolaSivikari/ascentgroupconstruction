import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export type UserRole = "super_admin" | "admin" | "editor" | "contributor" | "viewer";

interface PermissionCheck {
  canManageUsers: boolean;
  canEditContent: boolean;
  canPublishContent: boolean;
  canViewAnalytics: boolean;
  canManageSettings: boolean;
  canViewInbox: boolean;
  role: UserRole | null;
}

export const usePermissions = () => {
  const [permissions, setPermissions] = useState<PermissionCheck>({
    canManageUsers: false,
    canEditContent: false,
    canPublishContent: false,
    canViewAnalytics: false,
    canManageSettings: false,
    canViewInbox: false,
    role: null,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkPermissions();
  }, []);

  const checkPermissions = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setIsLoading(false);
        return;
      }

      const { data: roleData } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .maybeSingle();

      if (!roleData) {
        setIsLoading(false);
        return;
      }

      const role = roleData.role as UserRole;

      // Define permissions based on role
      const permissionMap: Record<UserRole, PermissionCheck> = {
        super_admin: {
          canManageUsers: true,
          canEditContent: true,
          canPublishContent: true,
          canViewAnalytics: true,
          canManageSettings: true,
          canViewInbox: true,
          role: "super_admin",
        },
        admin: {
          canManageUsers: false,
          canEditContent: true,
          canPublishContent: true,
          canViewAnalytics: true,
          canManageSettings: true,
          canViewInbox: true,
          role: "admin",
        },
        editor: {
          canManageUsers: false,
          canEditContent: true,
          canPublishContent: false,
          canViewAnalytics: false,
          canManageSettings: false,
          canViewInbox: false,
          role: "editor",
        },
        contributor: {
          canManageUsers: false,
          canEditContent: false,
          canPublishContent: false,
          canViewAnalytics: false,
          canManageSettings: false,
          canViewInbox: false,
          role: "contributor",
        },
        viewer: {
          canManageUsers: false,
          canEditContent: false,
          canPublishContent: false,
          canViewAnalytics: true,
          canManageSettings: false,
          canViewInbox: false,
          role: "viewer",
        },
      };

      setPermissions(permissionMap[role]);
    } catch (error) {
      console.error("Error checking permissions:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return { permissions, isLoading };
};
