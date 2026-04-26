# Fix: All forms (Contact, Estimate, RFP, Resume, Prequal) failing with 500

## Root cause (confirmed from edge function logs)

The `submit-form` edge function logs show **every submission since the spam-filter rollout has crashed** with:

```
ERROR code 42P01: relation "public.rate_limits" does not exist
```

The "repeat-content" spam filter calls the `check_and_update_rate_limit` RPC, which tries to read/write the `public.rate_limits` table. That table was never created in this project — only the function exists. The exception is thrown inside a `try/catch` that *should* swallow infra errors, but the throw happens during JSON-deserialization of the RPC response, after the catch has already returned. The result: the outer handler's `catch` returns a 500, and the row is never inserted.

I also confirmed `contact_submissions` is currently **empty** (0 rows) — no form has succeeded since the filter shipped, which matches your report that nothing is working.

This is one bug breaking five form paths: `/` Quick Contact, `/contact`, `/estimate`, `/submit-rfp`, careers Resume, prequalification.

---

## The fix (two parts, both required)

### 1. Create the missing `rate_limits` table (database migration)

```sql
CREATE TABLE public.rate_limits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_identifier text NOT NULL,
  endpoint text NOT NULL,
  request_count integer NOT NULL DEFAULT 1,
  window_start timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_identifier, endpoint)
);

CREATE INDEX idx_rate_limits_lookup
  ON public.rate_limits (user_identifier, endpoint);

CREATE INDEX idx_rate_limits_window_start
  ON public.rate_limits (window_start);

ALTER TABLE public.rate_limits ENABLE ROW LEVEL SECURITY;

-- Only service-role writes (edge functions). No public read/write.
CREATE POLICY "service_role_manages_rate_limits"
  ON public.rate_limits
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);
```

This matches what `check_and_update_rate_limit` (already in the DB) expects.

### 2. Harden `submit-form` so a future infra hiccup can never break submissions again

In `supabase/functions/submit-form/index.ts`, the existing try/catch around the repeat-content filter doesn't actually catch the failure mode that's biting you. Tighten it so **any** spam-filter exception just logs and continues to the insert — it's a "nice to have" guard, not a gate:

- Wrap the repeat-content RPC call in a self-contained `async` IIFE that **always** returns `{ allowed: true }` on any error.
- Log the failure to console as a warning, never re-throw.
- Same belt-and-suspenders for the honeypot/time/link checks (they're already pure, but I'll defensively try/catch them too).

This means: even if `rate_limits` ever disappears again, gets renamed, has perms revoked — submissions still go through. The spam filter degrades gracefully instead of taking the whole form down.

### 3. Verification after the migration runs

I'll redeploy `submit-form` and then test each form path with `supabase--curl_edge_functions` to confirm:

- Contact submission → row inserted in `contact_submissions`
- RFP submission → row inserted in `rfp_submissions` with a returned `id`
- Honeypot submission → silently "succeeds" (no row inserted)
- Repeat content within 10 min → silently "succeeds" (no duplicate row)

I'll also tail `submit-form` logs to confirm no more 42P01 errors.

---

## What's NOT changing

- No frontend changes — `InteractiveCTA.tsx`, `Contact.tsx`, `SubmitRFPNew.tsx`, `Estimate.tsx` are all calling the function correctly. The bug is server-side only.
- No changes to the spam-filter logic itself — honeypot, time-gate, link spam, and repeat-content all stay. They just become non-fatal.
- No new tables besides `rate_limits` (which the existing RPC already expects).
- No changes to `quote_requests`, RLS on existing tables, or auth.

---

## Files touched

1. **New migration** — creates `public.rate_limits` with proper indexes + RLS.
2. **`supabase/functions/submit-form/index.ts`** — wrap spam-filter calls in fail-open guards; redeploy.

After approval I'll run the migration, redeploy the function, and curl-test each form path so you have proof every channel is live before you publish.
