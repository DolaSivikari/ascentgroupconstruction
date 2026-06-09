
-- ============================================================================
-- BATCH 2: Critical Security Hardening
-- ============================================================================

-- 1. Standardize search_path on all SECURITY DEFINER functions in public
DO $$
DECLARE
  rec record;
BEGIN
  FOR rec IN
    SELECT n.nspname || '.' || p.proname || '(' ||
           pg_get_function_identity_arguments(p.oid) || ')' AS sig
      FROM pg_proc p
      JOIN pg_namespace n ON n.oid = p.pronamespace
     WHERE n.nspname = 'public'
       AND p.prosecdef = true
  LOOP
    EXECUTE format('ALTER FUNCTION %s SET search_path = public, pg_temp', rec.sig);
  END LOOP;
END
$$;

-- 2. Create missing auth_account_lockouts table (referenced by check-login-attempt edge fn)
CREATE TABLE IF NOT EXISTS public.auth_account_lockouts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_identifier text NOT NULL,
  locked_at timestamptz NOT NULL DEFAULT now(),
  locked_until timestamptz NOT NULL,
  unlocked_at timestamptz,
  reason text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_auth_account_lockouts_identifier
  ON public.auth_account_lockouts(user_identifier, locked_until DESC)
  WHERE unlocked_at IS NULL;

GRANT ALL ON public.auth_account_lockouts TO service_role;

ALTER TABLE public.auth_account_lockouts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Service role manages lockouts" ON public.auth_account_lockouts;
CREATE POLICY "Service role manages lockouts"
  ON public.auth_account_lockouts
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "Admins can view lockouts" ON public.auth_account_lockouts;
CREATE POLICY "Admins can view lockouts"
  ON public.auth_account_lockouts
  FOR SELECT
  TO authenticated
  USING (public.is_admin(auth.uid()));

-- 2b. Create security_alerts if missing (also referenced by check-login-attempt)
CREATE TABLE IF NOT EXISTS public.security_alerts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  alert_type text NOT NULL,
  severity text NOT NULL CHECK (severity IN ('low','medium','high','critical')),
  description text,
  metadata jsonb DEFAULT '{}'::jsonb,
  resolved boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT ALL ON public.security_alerts TO service_role;
GRANT SELECT ON public.security_alerts TO authenticated;

ALTER TABLE public.security_alerts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Service role manages security alerts" ON public.security_alerts;
CREATE POLICY "Service role manages security alerts"
  ON public.security_alerts FOR ALL TO service_role
  USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Admins can view security alerts" ON public.security_alerts;
CREATE POLICY "Admins can view security alerts"
  ON public.security_alerts FOR SELECT TO authenticated
  USING (public.is_admin(auth.uid()));

-- 3. Tighten wide-open INSERT policies

-- document_access_log: was WITH CHECK true to public; restrict to authenticated users logging their own access
DROP POLICY IF EXISTS "Anyone can log document access" ON public.document_access_log;
CREATE POLICY "Authenticated users can log document access"
  ON public.document_access_log
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- error_logs: was WITH CHECK true to public; restrict to service_role + authenticated
DROP POLICY IF EXISTS "Anyone can insert error logs" ON public.error_logs;
CREATE POLICY "Authenticated users can insert error logs"
  ON public.error_logs
  FOR INSERT
  TO authenticated
  WITH CHECK (true);
CREATE POLICY "Service role can insert error logs"
  ON public.error_logs
  FOR INSERT
  TO service_role
  WITH CHECK (true);

-- Re-scope role-only policies from 'public' to the correct narrow role (no WITH CHECK change)
DROP POLICY IF EXISTS "Service role can insert suppressed emails" ON public.suppressed_emails;
CREATE POLICY "Service role can insert suppressed emails"
  ON public.suppressed_emails FOR INSERT TO service_role
  WITH CHECK (true);

DROP POLICY IF EXISTS "Service role can insert tokens" ON public.email_unsubscribe_tokens;
CREATE POLICY "Service role can insert tokens"
  ON public.email_unsubscribe_tokens FOR INSERT TO service_role
  WITH CHECK (true);

DROP POLICY IF EXISTS "Admins can insert review requests" ON public.review_requests;
CREATE POLICY "Admins can insert review requests"
  ON public.review_requests FOR INSERT TO authenticated
  WITH CHECK (public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "System can insert search console data" ON public.search_console_data;
CREATE POLICY "Service role can insert search console data"
  ON public.search_console_data FOR INSERT TO service_role
  WITH CHECK (true);

DROP POLICY IF EXISTS "Users can insert their own tokens" ON public.google_auth_tokens;
CREATE POLICY "Users can insert their own tokens"
  ON public.google_auth_tokens FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);
