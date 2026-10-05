import { useMemo, useSyncExternalStore } from "react";
import type { SupabaseClient } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { visitorSupabase } from "@/lib/publicSettings";
import type { OptionalDatabase } from "@/lib/admin/optionalDatabase";
import { resolveContentValues, type ContentModule } from "@/content/types";
const publicDb = visitorSupabase as unknown as SupabaseClient<OptionalDatabase>;
const adminDb = supabase as unknown as SupabaseClient<OptionalDatabase>;
type Snapshot = { enabled: boolean; values: Record<string, unknown> };
let snapshot: Snapshot = { enabled: false, values: {} };
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((fn) => fn());
const previews = new Map<string, Record<string, unknown>>();
let generation = 0;
/** One bounded request; failed/missing flags turn everything off. No late hero swap. */
export async function refreshContentOverrides() {
  const request = ++generation;
  if (import.meta.env.VITE_PAGE_OVERRIDES_ENABLED !== "true") {
    snapshot = { enabled: false, values: {} };
    emit();
    return;
  }
  try {
    const { data: flags, error } = await publicDb
      .from("site_flags")
      .select("key,enabled");
    if (error || !flags?.find((f) => f.key === "content_overrides")?.enabled) {
      if (request === generation) {
        snapshot = { enabled: false, values: {} };
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
        snapshot = { enabled: false, values: {} };
        emit();
      }
      return;
    }
    const db = canary ? adminDb : publicDb;
    const rows: Array<{ key: string; published_value: unknown }> = [];
    for (let from = 0; from < 20000; from += 1000) {
      const { data, error: loadError } = await db
        .from("content_entries")
        .select("key,published_value")
        .not("published_value", "is", null)
        .order("key")
        .range(from, from + 999);
      if (loadError) throw loadError;
      rows.push(...(data || []));
      if ((data?.length || 0) < 1000) break;
      if (from === 19000) throw new Error("Content exceeds supported limit");
    }
    if (request === generation) {
      snapshot = {
        enabled: true,
        values: Object.fromEntries(rows.map((r) => [r.key, r.published_value])),
      };
      emit();
    }
  } catch {
    if (request === generation) {
      snapshot = { enabled: false, values: {} };
      emit();
    }
  }
}
export function disableContentOverrides() {
  ++generation;
  snapshot = { enabled: false, values: {} };
  emit();
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
  const preview = previews.get(module.id);
  const initial = useMemo(
    () => ({
      values: preview
        ? Object.fromEntries(
            Object.entries(preview).map(([key, value]) => [
              `${module.id}.${key}`,
              value,
            ]),
          )
        : state.values,
      enabled: !!preview || state.enabled,
    }),
    // Freeze published overrides for this route visit, while existing database fallbacks can resolve normally.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [module.id],
  );
  return resolveContentValues(
    module,
    initial.values,
    initial.enabled && (!!preview || state.enabled),
  ) as T;
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
  try {
    const item = JSON.parse(
      sessionStorage.getItem("ascent-content-preview") || "null",
    );
    if (!item || item.expires < Date.now()) return;
    await prepareContentPreview(item.moduleId, item.values);
    previews.set(item.moduleId, item.values);
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
