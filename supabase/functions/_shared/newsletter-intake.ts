import type { SupabaseClient } from "npm:@supabase/supabase-js@2";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";
import {
  checkRateLimit,
  getClientIdentifier,
  createRateLimitResponse,
} from "./rateLimiter.ts";
import { corsHeaders, jsonResponse } from "./http.ts";
export async function handleNewsletterIntake(
  req: Request,
  payload: { data?: unknown; honeypot?: string; startedAt?: number },
  db: SupabaseClient,
) {
  const rate = await checkRateLimit(
    db,
    getClientIdentifier(req),
    "submit-form:newsletter",
    5,
    15,
  );
  if (!rate.allowed)
    return createRateLimitResponse(
      rate.retry_after_seconds || 900,
      corsHeaders,
    );
  if (
    payload.honeypot?.trim() ||
    (typeof payload.startedAt === "number" &&
      Date.now() - payload.startedAt < 2000)
  )
    return jsonResponse({ success: false, status: "blocked" }, 202);
  const parsed = z
    .object({
      email: z.string().trim().email().max(255),
      source: z.enum(["footer", "blog"]),
      consent: z.literal(true),
    })
    .strict()
    .safeParse(payload.data);
  if (!parsed.success)
    return jsonResponse({ success: false, error: "invalid_subscription" }, 400);
  const result = await db.from("newsletter_subscribers").upsert(
    {
      email: parsed.data.email.toLowerCase(),
      source: parsed.data.source,
      subscribed_at: new Date().toISOString(),
      consent_timestamp: new Date().toISOString(),
      consent_method: parsed.data.source,
      is_active: true,
      unsubscribed_at: null,
    },
    { onConflict: "email" },
  );
  if (result.error && result.error.code !== "23505")
    return jsonResponse({ success: false, error: "save_failed" }, 500);
  // Identical response for existing addresses; do not expose subscriber membership.
  return jsonResponse({ success: true, persisted: true });
}
