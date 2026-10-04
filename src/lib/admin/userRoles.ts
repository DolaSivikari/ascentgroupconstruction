import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

export type SupportedAdminRole = Extract<
  Database["public"]["Enums"]["app_role"],
  "admin" | "super_admin"
>;

/** Preserve existing access if adding its replacement fails. The atomic,
 * table-level last-super-admin guard is a later schema phase (R6/P1). */
export async function replaceAdminRole(
  userId: string,
  role: SupportedAdminRole,
) {
  const added = await supabase
    .from("user_roles")
    .upsert(
      { user_id: userId, role },
      { onConflict: "user_id,role", ignoreDuplicates: true },
    );
  if (added.error) throw added.error;
  const removed = await supabase
    .from("user_roles")
    .delete()
    .eq("user_id", userId)
    .neq("role", role);
  if (removed.error)
    throw new Error(
      `The replacement role was added, but previous roles were retained. ${removed.error.message}`,
    );
}
