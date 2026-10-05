import { createClient } from "npm:@supabase/supabase-js@2";
import { handleCors, jsonResponse, corsHeaders } from "../_shared/http.ts";
import {
  checkRateLimit,
  createRateLimitResponse,
} from "../_shared/rateLimiter.ts";
import {
  sendInquiryAlerts,
  loggedInquiryEmail,
} from "../_shared/inquiry-alerts.ts";
Deno.serve(async (req) => {
  const cors = handleCors(req);
  if (cors) return cors;
  if (req.method !== "POST")
    return jsonResponse({ error: "method_not_allowed" }, 405);
  const url = Deno.env.get("SUPABASE_URL");
  const service = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  const anon = Deno.env.get("SUPABASE_ANON_KEY");
  if (!url || !service || !anon)
    return jsonResponse({ error: "server_not_configured" }, 503);
  const token = req.headers.get("Authorization") || "";
  const auth = createClient(url, anon, {
    global: { headers: { Authorization: token } },
  });
  const user = await auth.auth.getUser();
  if (user.error || !user.data.user)
    return jsonResponse({ error: "sign_in_required" }, 401);
  const db = createClient(url, service);
  const role = await db.rpc("is_admin", { _user_id: user.data.user.id });
  if (role.error || !role.data)
    return jsonResponse({ error: "admins_only" }, 403);
  const rate = await checkRateLimit(
    db,
    user.data.user.id,
    "inquiry-alert-resend",
    5,
    15,
  );
  if (!rate.allowed)
    return createRateLimitResponse(
      rate.retry_after_seconds || 900,
      corsHeaders,
    );
  try {
    const body = await req.json();
    if (body.test_recipient) {
      if (
        typeof body.test_recipient !== "string" ||
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.test_recipient) ||
        body.test_recipient.length > 320
      )
        return jsonResponse({ error: "invalid_recipient" }, 400);
      const result = await loggedInquiryEmail(
        db,
        "inquiry-alert",
        body.test_recipient,
        { test: "true" },
        `inquiry-alert-test-${crypto.randomUUID()}`,
      );
      return jsonResponse({
        success: result.status === "sent",
        status: result.status,
      });
    }
    if (
      typeof body.inquiry_id !== "string" ||
      !/^[a-f0-9-]{36}$/i.test(body.inquiry_id) ||
      (body.all_recipients !== undefined &&
        typeof body.all_recipients !== "boolean")
    )
      return jsonResponse({ error: "invalid_request" }, 400);
    const result = await sendInquiryAlerts(
      db,
      body.inquiry_id,
      body.all_recipients === true,
    );
    return jsonResponse({ success: true, ...result });
  } catch {
    return jsonResponse(
      { success: false, error: "alert_attempt_incomplete" },
      500,
    );
  }
});
