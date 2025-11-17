import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

/**
 * Lightweight hook to check if the current user has admin privileges
 * Does NOT redirect - just returns the admin status
 * Safe to use in Navigation components
 */
export const useAdminRoleCheck = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAdminRole();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      checkAdminRole();
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkAdminRole = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        setIsAdmin(false);
        setIsLoading(false);
        return;
      }

      // Check if user has admin or super_admin role
      const { data: roleData, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", session.user.id)
        .in("role", ["admin", "super_admin"])
        .maybeSingle();

      if (error) {
        if (import.meta.env.DEV) {
          console.error("Error checking admin role:", error);
        }
        setIsAdmin(false);
      } else {
        setIsAdmin(!!roleData);
      }
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error("Admin role check failed:", error);
      }
      setIsAdmin(false);
    } finally {
      setIsLoading(false);
    }
  };

  return { isAdmin, isLoading };
};
