-- 1. Fix ab_test_assignments SELECT exposure
DROP POLICY IF EXISTS "Authenticated users view own A/B assignments" ON public.ab_test_assignments;

CREATE POLICY "Admins can view A/B assignments"
  ON public.ab_test_assignments
  FOR SELECT
  TO authenticated
  USING (public.is_admin(auth.uid()));

-- Keep INSERT open so the client hook can still create assignments
-- (existing "Authenticated users create A/B assignments" policy remains)

-- 2. Fix search_analytics broad read access
DROP POLICY IF EXISTS "Authenticated users can view search analytics" ON public.search_analytics;

CREATE POLICY "Admins can view search analytics"
  ON public.search_analytics
  FOR SELECT
  TO authenticated
  USING (public.is_admin(auth.uid()));

-- 3. Fix user_service_preferences overly permissive ALL policy
DROP POLICY IF EXISTS "Users can manage their own preferences" ON public.user_service_preferences;

-- Admins can read all preferences for analytics
CREATE POLICY "Admins can view service preferences"
  ON public.user_service_preferences
  FOR SELECT
  TO authenticated
  USING (public.is_admin(auth.uid()));

-- Admins can manage preferences
CREATE POLICY "Admins can manage service preferences"
  ON public.user_service_preferences
  FOR ALL
  TO authenticated
  USING (public.is_admin(auth.uid()))
  WITH CHECK (public.is_admin(auth.uid()));

-- 4. Lock search_path on pgmq wrapper functions
ALTER FUNCTION public.enqueue_email(text, jsonb) SET search_path = public, pg_temp;
ALTER FUNCTION public.read_email_batch(text, integer, integer) SET search_path = public, pg_temp;
ALTER FUNCTION public.delete_email(text, bigint) SET search_path = public, pg_temp;
ALTER FUNCTION public.move_to_dlq(text, text, bigint, jsonb) SET search_path = public, pg_temp;