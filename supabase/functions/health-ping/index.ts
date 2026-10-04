import { createClient } from "@supabase/supabase-js";
import { healthJson, healthTokenMatches } from "../_shared/site-health-auth.ts";

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") return healthJson({}, 200, true);
  if (!["GET", "POST"].includes(request.method))
    return healthJson({ error: "method_not_allowed" }, 405, true);
  const url = Deno.env.get("SUPABASE_URL"),
    key = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!url || !key) return healthJson({ status: "unavailable" }, 503, true);
  const client = createClient(url, key, {
    auth: { persistSession: false },
    global: {
      fetch: (input, init) =>
        fetch(input, { ...init, signal: AbortSignal.timeout(5000) }),
    },
  });
  const header = request.headers.get("authorization");
  let authorized = await healthTokenMatches(
    header,
    Deno.env.get("SITE_HEALTH_INGEST_TOKEN"),
  );
  try {
    if (!authorized && header?.startsWith("Bearer ")) {
      const { data, error } = await client.auth.getUser(header.slice(7));
      if (!error && data.user) {
        const result = await client.rpc("is_admin", { _user_id: data.user.id });
        authorized = !result.error && result.data === true;
      }
    }
  } catch {
    return healthJson({ status: "unavailable" }, 503, true);
  }
  if (!authorized) return healthJson({ error: "unauthorized" }, 401, true);
  const begin = Date.now();
  try {
    const { error } = await client
      .from("site_settings")
      .select("id", { head: true })
      .limit(1);
    if (error)
      return healthJson(
        { status: "unavailable", checked_at: new Date().toISOString() },
        503,
        true,
      );
    return healthJson(
      {
        status: "ok",
        checked_at: new Date().toISOString(),
        latency_ms: Date.now() - begin,
      },
      200,
      true,
    );
  } catch {
    return healthJson(
      { status: "unavailable", checked_at: new Date().toISOString() },
      503,
      true,
    );
  }
});
