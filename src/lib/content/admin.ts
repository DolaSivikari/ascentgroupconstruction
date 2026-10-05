import {
  contentDatabase as db,
  missingOptionalSchema,
  type ContentEntry,
} from "@/lib/admin/optionalDatabase";
import { defaultHash, fieldSchema, type ContentModule } from "@/content/types";
import type { Json } from "@/integrations/supabase/types";
export async function loadContentWorkspace() {
  const flags = await db.from("site_flags").select("key,enabled");
  if (missingOptionalSchema(flags.error))
    return { available: false as const, entries: [], flags: [] };
  if (flags.error) throw flags.error;
  const entries: ContentEntry[] = [];
  for (let start = 0; start < 20000; start += 1000) {
    const { data, error } = await db
      .from("content_entries")
      .select("*")
      .order("key")
      .range(start, start + 999);
    if (missingOptionalSchema(error))
      return { available: false as const, entries: [], flags: [] };
    if (error) throw error;
    entries.push(...(data || []));
    if ((data?.length || 0) < 1000)
      return { available: true as const, entries, flags: flags.data || [] };
  }
  throw new Error("The content inventory exceeds the supported limit.");
}
export async function saveContentDraft(
  module: ContentModule,
  field: string,
  value: unknown,
  baseline?: ContentEntry,
) {
  const meta = module.meta[field];
  if (!meta || meta.locked) throw new Error("This field is protected.");
  const validated =
    value === null ? null : (fieldSchema(meta).parse(value) as Json);
  if (
    field === "seo" &&
    typeof validated === "object" &&
    validated &&
    !Array.isArray(validated) &&
    validated.noindex === true &&
    module.meta.hidden?.locked
  )
    throw new Error("This key page must remain indexed.");
  if (baseline) {
    const { data, error } = await db
      .from("content_entries")
      .update({ draft_value: validated, updated_at: new Date().toISOString() })
      .eq("id", baseline.id)
      .eq("updated_at", baseline.updated_at)
      .select("*")
      .maybeSingle();
    if (error) throw error;
    if (!data)
      throw new Error(
        "Another administrator changed this field. Your draft is preserved; reload before saving.",
      );
    return data;
  }
  const { data, error } = await db
    .from("content_entries")
    .insert({
      key: `${module.id}.${field}`,
      page_id: module.id,
      kind: meta.kind,
      draft_value: validated,
    })
    .select("*")
    .single();
  if (error) throw error;
  return data;
}
export async function publishPageDrafts(
  module: ContentModule,
  entries: ContentEntry[],
) {
  const changed = entries.filter(
    (e) =>
      e.key.startsWith(`${module.id}.`) &&
      JSON.stringify(e.draft_value) !== JSON.stringify(e.published_value),
  );
  if (!changed.length)
    throw new Error("There are no saved changes to publish.");
  const hashes = await Promise.all(
    changed.map(async (entry) => {
      const key = entry.key.slice(module.id.length + 1);
      const meta = module.meta[key];
      if (!meta || meta.locked)
        throw new Error("A protected or orphaned draft cannot be published.");
      if (entry.draft_value !== null)
        fieldSchema(meta).parse(entry.draft_value);
      const hash = await defaultHash(module.defaults[key]);
      if (
        entry.default_hash &&
        entry.default_hash !== hash &&
        entry.draft_value !== null
      )
        throw new Error(
          `Code changed for ${meta.label}. Restore that field to its code default first, then review a new draft.`,
        );
      return hash;
    }),
  );
  if (changed.length > 200)
    throw new Error("Publish at most 200 fields in one batch.");
  const { error } = await db.rpc("publish_content_entries_checked", {
    _ids: changed.map((e) => e.id),
    _default_hashes: hashes,
    _expected_updated_ats: changed.map((e) => e.updated_at),
  });
  if (error) throw error;
}
export async function contentHistory(entryId: string) {
  const { data, error } = await db
    .from("content_entry_versions")
    .select("*")
    .eq("entry_id", entryId)
    .order("published_at", { ascending: false })
    .limit(100);
  if (error) throw error;
  return data || [];
}
export async function restoreContentVersion(
  versionId: string,
  baseline: ContentEntry,
) {
  const { error } = await db.rpc("rollback_content_entry_checked", {
    _version_id: versionId,
    _entry_id: baseline.id,
    _expected_updated_at: baseline.updated_at,
  });
  if (error) throw error;
}
export async function setContentFlag(
  key: "content_overrides" | "content_overrides_admin_only",
  enabled: boolean,
) {
  const { error } = await db.rpc("set_site_flag", {
    _key: key,
    _enabled: enabled,
  });
  if (error) throw error;
}
export function importContentDraft(module: ContentModule, json: string) {
  const payload = JSON.parse(json);
  if (
    payload.version !== 1 ||
    payload.module !== module.id ||
    !payload.values ||
    typeof payload.values !== "object" ||
    Array.isArray(payload.values)
  )
    throw new Error("Import a version 1 export for this page.");
  const result: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(payload.values)) {
    const meta = module.meta[key];
    if (!meta || meta.locked)
      throw new Error(`Unknown or protected field: ${key}`);
    result[key] = value === null ? null : fieldSchema(meta).parse(value);
  }
  return result;
}
