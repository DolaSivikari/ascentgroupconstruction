import { createClient } from "npm:@supabase/supabase-js@2";
import { handleCors, jsonResponse } from "../_shared/http.ts";
Deno.serve(async (req) => {
  const cors = handleCors(req);
  if (cors) return cors;
  const url = Deno.env.get("SUPABASE_URL");
  const key = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (Deno.env.get("INTAKE_V2_ENABLED") !== "true" || !url || !key)
    return jsonResponse({ enabled: false });
  const db = createClient(url, key);
  const [inquiries, recipients] = await Promise.all([
    db.from("inquiries").select("id", { head: true }).limit(1),
    db
      .from("notification_recipients")
      .select("id", { count: "exact", head: true })
      .eq("is_active", true),
  ]);
  return jsonResponse({
    enabled:
      !inquiries.error && !recipients.error && (recipients.count || 0) >= 2,
  });
});
