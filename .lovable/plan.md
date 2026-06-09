# BATCH 2 — Critical Security (Database + Edge Functions)

Single migration + edge function fixes. Approve to run.

## 1. Migration — `SET search_path` on all 37 SECURITY DEFINER functions

For every function in `public`, run `ALTER FUNCTION ... SET search_path = public, pg_temp`. Covers: `is_admin`, `has_role`, `get_user_role`, `can_edit_content`, `can_manage_settings`, `can_manage_users`, `can_view_analytics`, `handle_new_user`, `check_and_update_rate_limit`, `enforce_public_form_rate_limit`, `enqueue_email`, `read_email_batch`, `move_to_dlq`, `delete_email`, `create_notification`, `notify_admins`, `notify_new_contact`, `notify_new_quote`, `notify_new_rfp`, `notify_new_resume`, `notify_new_prequal`, `get_admin_dashboard_stats`, `get_security_audit_log`, `save_content_version`, `auto_save_version`, `get_active_featured_services`, `get_active_promotions`, `generate_unsubscribe_token`, `generate_preview_token_with_expiry`, `log_sensitive_access`, `log_project_save_attempt`, `track_service_interaction`, `set_lead_score_and_priority`, `calculate_lead_score`, `cleanup_old_error_logs`, `update_updated_at_column`, `normalize_slug`.

(Note: most already have `SET search_path = 'public'`. The migration is idempotent — re-running `ALTER FUNCTION ... SET search_path = public, pg_temp` is safe and standardizes `pg_temp` inclusion across all of them.)

## 2. Migration — Tighten wide-open RLS INSERT policies

| Table | Current | New |
|---|---|---|
| `suppressed_emails` | INSERT to `public`, no CHECK | INSERT restricted to `service_role` |
| `google_auth_tokens` | INSERT to `public`, no CHECK | INSERT to `authenticated` with `WITH CHECK (auth.uid() = user_id)` |
| `error_logs` | INSERT to `public`, no CHECK | INSERT to `service_role` only (client error logging routes through edge fn) |
| `document_access_log` | INSERT to `public`, no CHECK | INSERT to `authenticated` only |
| `search_console_data` | INSERT to `public`, no CHECK | INSERT to `service_role` only |
| `email_unsubscribe_tokens` | INSERT to `public`, no CHECK | INSERT to `service_role` only |
| `review_requests` | INSERT to `public`, no CHECK | INSERT to `service_role` only |
| `ab_test_assignments` | INSERT to anon | Keep but add `WITH CHECK (true)` and rate-limit downstream |
| `project-images` storage INSERT | `public`, no CHECK | `WITH CHECK (public.is_admin(auth.uid()))` |

## 3. Migration — Storage hardening

- Add `file_size_limit` to all three buckets: `project-images` 5 MB, `rfp-attachments` 25 MB, `documents` 25 MB (done via `storage_update_bucket` after migration).
- Flip `documents` bucket to private; add a `documents_signed_url(p_id uuid)` SECURITY DEFINER helper that returns a signed URL only when the row's `requires_authentication = false` OR caller is authenticated.

## 4. Edge function — fix broken brute-force lockout

`check-login-attempt` currently queries non-existent `auth_account_lockouts`. Two options:

- **Option A (recommended)**: Create `auth_account_lockouts` table (columns: `email text primary key`, `locked_until timestamptz`, `failure_count int`, `updated_at`) with service-role-only RLS, then keep the existing edge function logic.
- **Option B**: Rewrite the edge function to use the existing `auth_failed_attempts` table (compute lockout from row count in window).

Plan defaults to **Option A** — minimal code change, cleaner separation. Confirm if you prefer B.

## 5. Edge function — strip PII from logs

Edit `supabase/functions/check-login-attempt/index.ts` and `supabase/functions/invite-user/index.ts` to remove email addresses from `console.log` / `console.error` calls. Replace with hashed identifiers or generic strings.

## 6. `supabase/config.toml` — explicit `verify_jwt` per function

Add explicit `[functions.<name>] verify_jwt = ...` blocks for the 18 functions currently relying on the implicit default, so platform changes can't silently flip auth enforcement. Default `true` everywhere except `submit-form`, `google-oauth-callback`, `generate-sitemap` (public-facing → `false`).

---

## What I won't touch in this batch
- App code that calls these tables (no breakage expected; only INSERT policies tighten and those callsites already use service-role keys via edge functions).
- Sitemap / SEO / perf / standards work — those are BATCH 3+.

## Verification after migration runs
- Run `supabase--linter` to confirm zero "function_search_path_mutable" warnings.
- Spot-check `/contact` and `/rfp` forms still submit (they go through `submit-form` edge function which uses service-role).
- Confirm admin login still works.

Approve to run the migration.
