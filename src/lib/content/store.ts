import { useEffect, useSyncExternalStore } from "react";
import type { SupabaseClient } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { visitorSupabase } from "@/lib/publicSettings";
import type { OptionalDatabase } from "@/lib/admin/optionalDatabase";
import { resolveContentValues, type ContentModule } from "@/content/types";
const publicDb = visitorSupabase as unknown as SupabaseClient<OptionalDatabase>;
const adminDb = supabase as unknown as SupabaseClient<OptionalDatabase>;
type Snapshot = {
  enabled: boolean;
  values: Record<string, unknown>;
  revision: number;
};
let generation = 0;
const loaded = new Set<string>();
const pending = new Map<string, Promise<void>>();
let snapshot: Snapshot = { enabled: false, values: {}, revision: generation };
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((fn) => fn());
const previews = new Map<string, Record<string, unknown>>();
/** Refresh capabilities; content is fetched only for mounted modules. */
export async function refreshContentOverrides() {
  const request = ++generation;
  loaded.clear();
  pending.clear();
  if (import.meta.env.VITE_PAGE_OVERRIDES_ENABLED !== "true") {
    snapshot = { enabled: false, values: {}, revision: generation };
    emit();
    return;
  }
  try {
    const { data: flags, error } = await publicDb
      .from("site_flags")
      .select("key,enabled");
    if (error || !flags?.find((f) => f.key === "content_overrides")?.enabled) {
      if (request === generation) {
        snapshot = { enabled: false, values: {}, revision: generation };
        emit();
      }
      return;
    }
    const canary =
      flags.find((f) => f.key === "content_overrides_admin_only")?.enabled !==
      false;
    const {
      data: { session },
    } = await supabase.auth.getSession();
    let allowed = !canary;
    if (session) {
      const { data, error: roleError } = await supabase.rpc("is_admin", {
        _user_id: session.user.id,
      });
      if (!roleError && data === true) allowed = true;
    }
    if (!allowed) {
      if (request === generation) {
        snapshot = { enabled: false, values: {}, revision: generation };
        emit();
      }
      return;
    }
    if (request === generation) {
      moduleDb = canary ? adminDb : publicDb;
      snapshot = { enabled: true, values: {}, revision: generation };
      emit();
    }
  } catch {
    if (request === generation) {
      snapshot = { enabled: false, values: {}, revision: generation };
      emit();
    }
  }
}
export function disableContentOverrides() {
  ++generation;
  loaded.clear();
  pending.clear();
  snapshot = { enabled: false, values: {}, revision: generation };
  emit();
}
let moduleDb = publicDb;
async function loadModule(id: string) {
  if (!snapshot.enabled || loaded.has(id)) return;
  if (pending.has(id)) return pending.get(id);
  const request = generation;
  const task = (async () => {
    try {
      const rows: Array<{ key: string; published_value: unknown }> = [];
      for (let start = 0; start < 2000; start += 1000) {
        const { data, error } = await moduleDb
          .from("content_entries")
          .select("key,published_value")
          .eq("page_id", id)
          .not("published_value", "is", null)
          .order("key")
          .range(start, start + 999);
        if (error) throw error;
        rows.push(...(data || []));
        if ((data?.length || 0) < 1000) break;
        if (start === 1000)
          throw new Error("Page content exceeds supported limit");
      }
      if (request !== generation) return;
      loaded.add(id);
      snapshot = {
        ...snapshot,
        values: {
          ...snapshot.values,
          ...Object.fromEntries(
            rows.map((row) => [row.key, row.published_value]),
          ),
        },
      };
      emit();
    } catch {
      // Keep code defaults on failure. A refresh or next mount can retry.
    } finally {
      if (request === generation) pending.delete(id);
    }
  })();
  pending.set(id, task);
  return task;
}
export function useResolvedContent<T extends Record<string, unknown>>(
  module: ContentModule,
): T {
  const state = useSyncExternalStore(
    (fn) => {
      listeners.add(fn);
      return () => {
        listeners.delete(fn);
      };
    },
    () => snapshot,
  );
  useEffect(() => {
    void loadModule(module.id);
  }, [module.id, state.enabled, state.revision]);
  const preview = previews.get(module.id);
  const values = preview
    ? Object.fromEntries(
        Object.entries(preview).map(([key, value]) => [
          `${module.id}.${key}`,
          value,
        ]),
      )
    : state.values;
  return resolveContentValues(module, values, !!preview || state.enabled) as T;
}
export async function prepareContentPreview(
  moduleId: string,
  values: Record<string, unknown>,
) {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  if (error || !user) throw new Error("Sign in to preview drafts");
  const { data: admin, error: roleError } = await supabase.rpc("is_admin", {
    _user_id: user.id,
  });
  if (roleError || !admin) throw new Error("Administrators only");
  sessionStorage.setItem(
    "ascent-content-preview",
    JSON.stringify({ moduleId, values, expires: Date.now() + 30 * 60000 }),
  );
}
export async function initializeContentPreview() {
  if (new URLSearchParams(location.search).get("content_preview") !== "1")
    return;
  const request = generation;
  try {
    const item = JSON.parse(
      sessionStorage.getItem("ascent-content-preview") || "null",
    );
    if (!item || item.expires < Date.now()) return;
    await prepareContentPreview(item.moduleId, item.values);
    if (request !== generation) return;
    previews.set(item.moduleId, item.values);
    snapshot = { ...snapshot };
    emit();
  } catch {
    sessionStorage.removeItem("ascent-content-preview");
  }
}
export async function bootstrapContent() {
  if (new URLSearchParams(location.search).get("content_preview") === "1")
    await Promise.race([
      initializeContentPreview(),
      new Promise((resolve) => setTimeout(resolve, 5000)),
    ]);
  await Promise.race([
    refreshContentOverrides(),
    new Promise((resolve) => setTimeout(resolve, 600)),
  ]);
}
supabase.auth?.onAuthStateChange((event) => {
  if (event === "SIGNED_OUT") {
    previews.clear();
    disableContentOverrides();
  }
});
