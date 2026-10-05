import { supabase } from "@/integrations/supabase/client";
import type { SupabaseClient } from "@supabase/supabase-js";
import { normalizeSlug } from "./editorValues";
import {
  loadProjectRelationships,
  saveProjectRelationships,
} from "./projectPersistence";
export type ContentTable =
  | "projects"
  | "services"
  | "blog_posts"
  | "documents_library";
export function duplicatePayload(
  table: ContentTable,
  original: Record<string, unknown>,
  suffix: string,
): Record<string, unknown> {
  const copy = { ...original };
  for (const key of [
    "id",
    "created_at",
    "updated_at",
    "created_by",
    "updated_by",
    "preview_token",
    "preview_token_expires_at",
    "preview_token_created_by",
    "published_at",
    "scheduled_publish_at",
    "download_count",
    "services",
  ])
    delete copy[key];
  const nameKey = table === "services" ? "name" : "title";
  copy[nameKey] = `${String(original[nameKey] || "Untitled")} (copy)`;
  if (table === "documents_library") copy.is_active = false;
  else {
    copy.slug = `${normalizeSlug(String(original.slug || original[nameKey] || "content"))}-copy-${suffix}`;
    copy.publish_state = "draft";
    copy.featured = false;
    if (table === "blog_posts") {
      delete copy.featured;
      copy.is_pinned = false;
    }
  }
  return copy;
}
export async function duplicateContent(
  table: ContentTable,
  id: string,
): Promise<string> {
  const { data, error } = await supabase
    .from(table)
    .select("*")
    .eq("id", id)
    .single();
  if (error) throw error;
  if (!data) throw new Error("Could not load the complete source record.");
  // Load relationships before writing anything, so failed reads cannot make an incomplete copy.
  const relationships =
    table === "projects" ? await loadProjectRelationships(id) : null;
  const payload = duplicatePayload(
    table,
    data as unknown as Record<string, unknown>,
    crypto.randomUUID().slice(0, 8),
  );
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) throw new Error("Sign in again to duplicate content.");
  const result = await (supabase as SupabaseClient)
    .from(table)
    .insert({
      ...payload,
      created_by: userData.user.id,
      updated_by: userData.user.id,
    })
    .select("id")
    .single();
  if (result.error) throw result.error;
  if (!result.data) throw new Error("Could not verify the duplicate.");
  if (relationships)
    try {
      await saveProjectRelationships(
        result.data.id,
        {
          serviceIds: relationships.serviceIds,
          images: relationships.images.map((image) => ({
            ...image,
            id: crypto.randomUUID(),
          })),
        },
        { serviceIds: [], images: [] },
      );
    } catch {
      throw new Error(
        `The draft copy was created (${result.data.id}), but its relationships did not finish saving. Review it before publishing; the source is unchanged.`,
      );
    }
  return result.data.id;
}
