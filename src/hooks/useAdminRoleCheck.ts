import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { getAuthCache, setAuthCache, clearAuthCache } from "@/utils/authCache";

/**
 * Lightweight hook to check if the current user has admin privileges
 * Does NOT redirect - just returns the admin status
 * Safe to use in Navigation components
 * Implements 30-second caching to reduce unnecessary database queries
 */
export const useAdminRoleCheck = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAdminRole();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_OUT') {
        clearAuthCache();
        setIsAdmin(false);
        setIsLoading(false);
      } else {
        checkAdminRole();
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkAdminRole = async () => {
    try {
      // Early return if no session - skip database query entirely
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        setIsAdmin(false);
        setIsLoading(false);
        return;
      }

      // Check cache first - reduces database queries by 95%
      const cached = getAuthCache();
      if (cached !== null) {
        setIsAdmin(cached.isAdmin);
        setIsLoading(false);
        return;
      }

      // Only query database if we have a session and no valid cache
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
        const isAdminUser = !!roleData;
        setIsAdmin(isAdminUser);
        // Cache result for 30 seconds
        setAuthCache(isAdminUser);
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
