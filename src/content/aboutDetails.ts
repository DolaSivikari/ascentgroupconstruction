import { ABOUT_DEFAULTS, type AboutContent } from "@/lib/aboutContent";
import { structuredContent, restoreStructured } from "./structured";
import { defineContent } from "./types";
import { useResolvedContent } from "@/lib/content/store";
const original = structuredContent("about-details", ABOUT_DEFAULTS);
export function aboutDetailsModule(base: AboutContent = ABOUT_DEFAULTS) {
  const module = structuredContent("about-details", base);
  for (const [key, field] of Object.entries(module.meta)) {
    // Keep protected credentials and company facts locked even if a saved default was edited.
    field.locked =
      field.locked ||
      original.meta[key]?.locked ||
      key.startsWith("stats_") ||
      ["founder_name", "founder_title", "founder_image_url"].includes(key);
  }
  return defineContent(module.id, module.defaults, module.meta);
}
export function useAboutDetails(base: AboutContent) {
  const values = useResolvedContent(aboutDetailsModule(base));
  return restoreStructured(base, values);
}
