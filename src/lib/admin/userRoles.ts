import { supabase } from "@/integrations/supabase/client";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";
export type SupportedAdminRole = Extract<
  Database["public"]["Enums"]["app_role"],
  "admin" | "super_admin"
>;
/** No multi-request fallback: the reviewed RPC and table guard are prerequisites. */
export async function replaceAdminRole(
  userId: string,
  role: SupportedAdminRole,
) {
  const { error } = await (supabase as SupabaseClient).rpc("set_user_role", {
    _user_id: userId,
    _role: role,
  });
  if (!error) return;
  if (["PGRST202", "42883"].includes(error.code))
    throw new Error(
      "Role changes need the reviewed set_user_role function and last-super-admin table guards from the reviewed 0005_admin_role_guard.sql draft. No roles were changed.",
    );
  if (error.code === "23514")
    throw new Error("At least one super admin must remain.");
  throw error;
}
