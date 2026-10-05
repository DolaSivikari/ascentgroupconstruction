import { createClient } from "@supabase/supabase-js";
import {
  PUBLIC_SITE_SETTINGS_COLUMNS,
  PUBLIC_CONTACT_PAGE_SETTINGS_COLUMNS,
} from "@/constants/siteSettingsColumns";

// A distinct client that never reads the signed-in administrator's session.
export const visitorSupabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
      storageKey: "ascent-visitor-only",
    },
  },
);
export const PUBLIC_FOOTER_COLUMNS = "id,social_media,contact_info,is_active";
export const PUBLIC_ABOUT_COLUMNS =
  "id,is_active,hero_headline,hero_intro,story_headline,story_content,founder_name,founder_title,founder_bio,founder_quote,founder_image_url,stats";
export const PUBLIC_SETTINGS_PROJECTIONS = {
  site_settings: PUBLIC_SITE_SETTINGS_COLUMNS,
  footer_settings: PUBLIC_FOOTER_COLUMNS,
  contact_page_settings: PUBLIC_CONTACT_PAGE_SETTINGS_COLUMNS,
  about_page_settings: PUBLIC_ABOUT_COLUMNS,
};
export function httpsSocialLinks(value: unknown): Record<string, string> {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  return Object.fromEntries(
    Object.entries(value)
      .filter((entry): entry is [string, string] => {
        if (typeof entry[1] !== "string" || !entry[1].trim()) return false;
        try {
          return new URL(entry[1]).protocol === "https:";
        } catch {
          return false;
        }
      })
      .map(([name, url]) => [name, url.trim()]),
  );
}
export function validateSocialLinks(value: Record<string, string>) {
  for (const [name, url] of Object.entries(value))
    if (url.trim() && !httpsSocialLinks({ [name]: url })[name])
      throw new Error(`${name}: use a complete HTTPS URL.`);
}
export function notifySettingsSaved(table: string) {
  window.dispatchEvent(
    new CustomEvent("ascent-settings-updated", { detail: table }),
  );
}
