import { supabase } from "@/integrations/supabase/client";
import { generatePreviewToken } from "@/utils/previewToken";
import { getPreviewUrl } from "@/utils/routeHelpers";

export async function savePreviewLink(
  table: "blog_posts" | "projects" | "services",
  id: string,
  slug: string,
): Promise<string> {
  if (!id || id === "new" || !slug)
    throw new Error("Save this content before previewing it.");
  const token = generatePreviewToken();
  const { data, error } = await supabase
    .from(table)
    .update({
      preview_token: token,
      preview_token_expires_at: new Date(
        Date.now() + 24 * 60 * 60 * 1000,
      ).toISOString(),
    })
    .eq("id", id)
    .select("id, slug")
    .single();
  if (error) throw error;
  if (!data) throw new Error("The preview link could not be saved. Try again.");
  return getPreviewUrl(
    table === "projects"
      ? "project"
      : table === "services"
        ? "service"
        : "blog",
    data.slug,
    token,
  );
}
