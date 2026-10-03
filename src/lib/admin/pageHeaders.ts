import { supabase } from "@/integrations/supabase/client";
import type { HeaderMetadata } from "@/data/page-headers";

/** Presentation metadata only; failed sources stay visible instead of looking empty. */
export async function loadHeaderMetadata(): Promise<HeaderMetadata> {
  const results = await Promise.allSettled([
    supabase
      .from("services")
      .select("id,slug,name,featured_image,category")
      .eq("publish_state", "published"),
    supabase
      .from("projects")
      .select("id,slug,title,featured_image")
      .eq("publish_state", "published"),
    supabase
      .from("blog_posts")
      .select("id,slug,title,featured_image")
      .eq("publish_state", "published"),
    supabase
      .from("hero_slides")
      .select("poster_url")
      .eq("is_active", true)
      .order("display_order"),
  ]);
  function readSource<T>(
    result: PromiseSettledResult<{ data: T[] | null; error: unknown }>,
    label: string,
  ): { data: T[]; failed: string[] } {
    return result.status === "fulfilled" &&
      !result.value.error &&
      Array.isArray(result.value.data)
      ? { data: result.value.data, failed: [] }
      : { data: [], failed: [label] };
  }
  const services = readSource(results[0], "Published services");
  const projects = readSource(results[1], "Published projects");
  const articles = readSource(results[2], "Published articles");
  const slides = readSource(results[3], "Homepage slides");
  return {
    services: services.data,
    projects: projects.data,
    articles: articles.data,
    slides: slides.data,
    failed: [
      ...services.failed,
      ...projects.failed,
      ...articles.failed,
      ...slides.failed,
    ],
  };
}
