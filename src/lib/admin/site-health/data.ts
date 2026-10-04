import type { SupabaseClient } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import {
  healthResultSchema,
  missingHealthSchema,
  type HealthResult,
  type IssueState,
} from "./contract";
import type { HealthDatabase } from "./types";

const health = supabase as unknown as SupabaseClient<HealthDatabase>;
export async function loadHealthOverview() {
  const prerequisites = await Promise.all([
    health.from("site_health_results").select("id", { head: true }).limit(1),
    health
      .from("site_health_issue_states")
      .select("fingerprint", { head: true })
      .limit(1),
  ]);
  if (prerequisites.some((result) => missingHealthSchema(result.error)))
    return { available: false as const, runs: [] };
  for (const result of prerequisites) if (result.error) throw result.error;
  const { data, error } = await health
    .from("site_health_runs")
    .select("*")
    .order("started_at", { ascending: false })
    .limit(32);
  if (missingHealthSchema(error))
    return { available: false as const, runs: [] };
  if (error) throw error;
  return { available: true as const, runs: data || [] };
}
export async function loadHealthResults(
  runId: string,
): Promise<HealthResult[]> {
  const rows: HealthResult[] = [];
  for (let start = 0; start < 5000; start += 1000) {
    const { data, error } = await health
      .from("site_health_results")
      .select("*")
      .eq("run_id", runId)
      .order("path")
      .order("viewport")
      .range(start, start + 999);
    if (error) throw error;
    for (const row of data || [])
      rows.push({ ...healthResultSchema.parse(row), run_id: runId });
    if (!data || data.length < 1000) return rows;
  }
  throw new Error("This run exceeds the supported result limit.");
}
export async function loadIssueStates(): Promise<IssueState[]> {
  const rows: IssueState[] = [];
  for (let start = 0; start < 10000; start += 1000) {
    const { data, error } = await health
      .from("site_health_issue_states")
      .select("*")
      .order("fingerprint")
      .range(start, start + 999);
    if (error) throw error;
    rows.push(...(data || []));
    if (!data || data.length < 1000) return rows;
  }
  throw new Error("Too many issue decisions to load safely.");
}
export async function saveIssueState(
  fingerprint: string,
  state: "fixed" | "ignored",
  reason: string,
) {
  if (!reason.trim() || reason.trim().length > 500)
    throw new Error("Add a reason between 1 and 500 characters.");
  const user = await supabase.auth.getUser();
  if (user.error) throw user.error;
  if (!user.data.user)
    throw new Error("Sign in again before saving an issue decision.");
  const { error } = await health.from("site_health_issue_states").upsert({
    fingerprint,
    state,
    reason: reason.trim(),
    updated_at: new Date().toISOString(),
    updated_by: user.data.user.id,
  });
  if (error) throw error;
}
export async function resetIssueState(fingerprint: string) {
  const { error } = await health
    .from("site_health_issue_states")
    .delete()
    .eq("fingerprint", fingerprint);
  if (error) throw error;
}
export async function loadVisitorErrors() {
  const { data, error } = await supabase
    .from("error_logs")
    .select("id,url,message,created_at")
    .gte("created_at", new Date(Date.now() - 86400000).toISOString())
    .order("created_at", { ascending: false })
    .limit(500);
  if (error) throw error;
  const groups = new Map<
    string,
    { path: string; message: string; count: number; latest: string }
  >();
  for (const row of data || []) {
    let path = "Unknown page";
    try {
      path = new URL(row.url || "").pathname;
    } catch {
      /* Do not expose URL queries or fragments. */
    }
    const key = `${path}:${row.message}`;
    const group = groups.get(key);
    if (group) group.count++;
    else
      groups.set(key, {
        path,
        message: row.message,
        count: 1,
        latest: row.created_at,
      });
  }
  return { groups: [...groups.values()], limited: data?.length === 500 };
}
