import {
  mainPageHeroes,
  serviceHeroes,
  audienceHeroes,
  sectorHeroes,
  companyHeroes,
  resourceHeroes,
  heroConfigs,
} from "@/data/hero-images";
import { supabase } from "@/integrations/supabase/client";
import type { SupabaseClient } from "@supabase/supabase-js";
export const MEDIA_BUCKET = "project-images";
export const MEDIA_PAGE_SIZE = 24;
export interface MediaAsset {
  name: string;
  path: string;
  url: string;
  folder: boolean;
  size: number;
  updatedAt: string | null;
  altText: string;
}
const metadataClient = supabase as SupabaseClient;
export function validateMediaFile(file: File) {
  if (
    ![
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/avif",
      "image/gif",
    ].includes(file.type)
  )
    throw new Error(`${file.name}: choose JPG, PNG, WebP, AVIF or GIF.`);
  if (file.size > 10 * 1024 * 1024 || file.size === 0)
    throw new Error(`${file.name}: file must be nonempty and under 10 MB.`);
}
export function mediaPath(url: string): string | null {
  const root = supabase.storage.from(MEDIA_BUCKET).getPublicUrl("")
    .data.publicUrl;
  if (!url.startsWith(root)) return null;
  try {
    const path = decodeURIComponent(url.slice(root.length)).replace(/^\/+/, "");
    return path && !path.split("/").includes("..") && !/[?#]/.test(path)
      ? path
      : null;
  } catch {
    return null;
  }
}
export async function listMedia(folder = "", page = 0, search = "") {
  const { data, error } = await supabase.storage
    .from(MEDIA_BUCKET)
    .list(folder, {
      limit: MEDIA_PAGE_SIZE,
      offset: page * MEDIA_PAGE_SIZE,
      search,
      sortBy: { column: "name", order: "asc" },
    });
  if (error) throw error;
  if (!Array.isArray(data))
    throw new Error("Could not verify the storage listing.");
  const files: MediaAsset[] = data.map((item) => {
    const path = [folder, item.name].filter(Boolean).join("/");
    return {
      name: item.name,
      path,
      url: supabase.storage.from(MEDIA_BUCKET).getPublicUrl(path).data
        .publicUrl,
      folder: !item.id,
      size: Number(item.metadata?.size || 0),
      updatedAt: item.updated_at,
      altText: String(item.metadata?.alt_text || ""),
    };
  });
  const paths = files.filter((file) => !file.folder).map((file) => file.path);
  const meta = await metadataClient
    .from("media_asset_metadata")
    .select("path,alt_text")
    .eq("bucket_id", MEDIA_BUCKET)
    .in("path", paths);
  if (meta.error && !["42P01", "PGRST205"].includes(meta.error.code || ""))
    throw new Error(`Image metadata is unavailable: ${meta.error.message}`);
  const altByPath = new Map(
    (meta.data || []).map((row: { path: string; alt_text: string }) => [
      row.path,
      row.alt_text,
    ]),
  );
  return {
    files: files.map((file) => ({
      ...file,
      altText: altByPath.get(file.path) || file.altText,
    })),
    metadataReady: !meta.error,
    hasNext: data.length === MEDIA_PAGE_SIZE,
  };
}
export async function uploadMedia(file: File, folder: string, altText: string) {
  validateMediaFile(file);
  const filename = `${crypto.randomUUID()}-${file.name.replace(/[^a-zA-Z0-9_.-]/g, "-")}`;
  const path = [folder, filename].filter(Boolean).join("/");
  const { error } = await supabase.storage
    .from(MEDIA_BUCKET)
    .upload(path, file, { upsert: false, metadata: { alt_text: altText } });
  if (error) throw error;
  return path;
}
export async function saveMediaAlt(path: string, altText: string) {
  const { error } = await metadataClient.from("media_asset_metadata").upsert(
    {
      bucket_id: MEDIA_BUCKET,
      path,
      alt_text: altText.slice(0, 500),
      updated_at: new Date().toISOString(),
    },
    { onConflict: "bucket_id,path" },
  );
  if (error) throw error;
}
export interface MediaReference {
  table: string;
  id: string;
  title: string;
}
/** Fail closed: check drafts, published content, nested JSON and embedded rich text. */
export async function findMediaReferences(
  url: string,
): Promise<MediaReference[]> {
  const tables = [
    "projects",
    "project_images",
    "services",
    "blog_posts",
    "hero_slides",
    "about_page_settings",
    "homepage_settings",
    "site_settings",
    "footer_settings",
  ] as const;
  const references: MediaReference[] = [];
  if (
    JSON.stringify([
      mainPageHeroes,
      serviceHeroes,
      audienceHeroes,
      sectorHeroes,
      companyHeroes,
      resourceHeroes,
      heroConfigs,
    ]).includes(url)
  )
    references.push({
      table: "code-managed heroes",
      id: "protected",
      title: "A public page header",
    });
  for (const table of tables) {
    for (let offset = 0; ; offset += 500) {
      if (offset >= 50_000)
        throw new Error(
          `Cannot confirm all references in ${table}; file retained.`,
        );
      const { data, error } = await supabase
        .from(table)
        .select("*")
        .order("id")
        .range(offset, offset + 499);
      if (error)
        throw new Error(
          `Cannot check ${table}: ${error.message}. File retained.`,
        );
      if (!Array.isArray(data))
        throw new Error(`Cannot verify ${table}; file retained.`);
      for (const row of data)
        if (JSON.stringify(row).includes(url)) {
          const record = row as unknown as Record<string, unknown>;
          references.push({
            table,
            id: String(record.id),
            title: String(
              record.title || record.name || record.project_id || record.id,
            ),
          });
        }
      if (data.length < 500) break;
    }
  }
  return references;
}
export async function deleteUnusedMedia(asset: MediaAsset) {
  if (asset.folder || mediaPath(asset.url) !== asset.path)
    throw new Error("Only files inside project-images can be removed.");
  const references = await findMediaReferences(asset.url);
  if (references.length)
    throw new Error(
      `This file is used by ${references.length} content record(s); it has been retained.`,
    );
  const { error } = await supabase.storage
    .from(MEDIA_BUCKET)
    .remove([asset.path]);
  if (error) throw error;
  // Stale metadata is inert; cleanup failure must not misreport successful storage deletion.
  const cleanup = await metadataClient
    .from("media_asset_metadata")
    .delete()
    .eq("bucket_id", MEDIA_BUCKET)
    .eq("path", asset.path);
  if (
    cleanup.error &&
    !["42P01", "PGRST205"].includes(cleanup.error.code || "")
  )
    return "File removed; its unused metadata could not be cleaned up.";
  return null;
}
