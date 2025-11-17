-- =====================================================
-- CRITICAL SECURITY FIX: RLS Policy Updates
-- Restricting sensitive data access to super_admin only
-- =====================================================

-- 1. FIX PROFILES TABLE - Remove blanket admin access
DROP POLICY IF EXISTS "Admins view all profiles" ON public.profiles;

-- Add super_admin only policy for viewing all profiles
CREATE POLICY "Super admins view all profiles"
ON public.profiles
FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'super_admin'));

-- 2. FIX CONTACT SUBMISSIONS - Change from is_admin to super_admin only
DROP POLICY IF EXISTS "Admins can view contact submissions" ON public.contact_submissions;
DROP POLICY IF EXISTS "Admins can update contact submissions" ON public.contact_submissions;
DROP POLICY IF EXISTS "Admins can delete contact submissions" ON public.contact_submissions;

CREATE POLICY "Super admins view contact submissions"
ON public.contact_submissions
FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'super_admin'));

CREATE POLICY "Super admins update contact submissions"
ON public.contact_submissions
FOR UPDATE
TO authenticated
USING (has_role(auth.uid(), 'super_admin'))
WITH CHECK (has_role(auth.uid(), 'super_admin'));

CREATE POLICY "Super admins delete contact submissions"
ON public.contact_submissions
FOR DELETE
TO authenticated
USING (has_role(auth.uid(), 'super_admin'));

-- 3. FIX QUOTE REQUESTS - Change from is_admin to super_admin
DROP POLICY IF EXISTS "Admins can manage quote requests" ON public.quote_requests;
DROP POLICY IF EXISTS "Admins can view all quote requests" ON public.quote_requests;

CREATE POLICY "Super admins manage quote requests"
ON public.quote_requests
FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'super_admin'))
WITH CHECK (has_role(auth.uid(), 'super_admin'));

-- 4. FIX RFP SUBMISSIONS - Change from is_admin to super_admin
DROP POLICY IF EXISTS "Admins can manage rfp submissions" ON public.rfp_submissions;

CREATE POLICY "Super admins manage rfp submissions"
ON public.rfp_submissions
FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'super_admin'))
WITH CHECK (has_role(auth.uid(), 'super_admin'));

-- 5. FIX PREQUALIFICATION DOWNLOADS - Change from is_admin to super_admin
DROP POLICY IF EXISTS "Admins can view prequalification downloads" ON public.prequalification_downloads;
DROP POLICY IF EXISTS "Admins can update prequalification downloads" ON public.prequalification_downloads;
DROP POLICY IF EXISTS "Admins can delete prequalification downloads" ON public.prequalification_downloads;

CREATE POLICY "Super admins view prequalification downloads"
ON public.prequalification_downloads
FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'super_admin'));

CREATE POLICY "Super admins update prequalification downloads"
ON public.prequalification_downloads
FOR UPDATE
TO authenticated
USING (has_role(auth.uid(), 'super_admin'))
WITH CHECK (has_role(auth.uid(), 'super_admin'));

CREATE POLICY "Super admins delete prequalification downloads"
ON public.prequalification_downloads
FOR DELETE
TO authenticated
USING (has_role(auth.uid(), 'super_admin'));

-- 6. FIX NEWSLETTER SUBSCRIBERS - Change from is_admin to super_admin
DROP POLICY IF EXISTS "Admins can view newsletter subscribers" ON public.newsletter_subscribers;
DROP POLICY IF EXISTS "Admins can update newsletter subscribers" ON public.newsletter_subscribers;

CREATE POLICY "Super admins view newsletter subscribers"
ON public.newsletter_subscribers
FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'super_admin'));

CREATE POLICY "Super admins update newsletter subscribers"
ON public.newsletter_subscribers
FOR UPDATE
TO authenticated
USING (has_role(auth.uid(), 'super_admin'))
WITH CHECK (has_role(auth.uid(), 'super_admin'));

-- 7. PROTECT AUDIT LOG - Block direct user inserts
DROP POLICY IF EXISTS "Audit log insertable by authenticated users" ON public.audit_log;

-- Audit logs should only be created via triggers, not direct user inserts
COMMENT ON TABLE public.audit_log IS 'Audit logs are created automatically via triggers. Direct inserts are blocked for security.';

-- 8. PROTECT ANALYTICS - Require authentication
DROP POLICY IF EXISTS "Anyone can log analytics events" ON public.popular_services_analytics;
DROP POLICY IF EXISTS "Admins can view all analytics" ON public.popular_services_analytics;

CREATE POLICY "Authenticated users log analytics"
ON public.popular_services_analytics
FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Super admins view all analytics"
ON public.popular_services_analytics
FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'super_admin'));

-- 9. PROTECT A/B TEST ASSIGNMENTS
DROP POLICY IF EXISTS "Anyone can insert A/B assignments" ON public.ab_test_assignments;

CREATE POLICY "Authenticated users create A/B assignments"
ON public.ab_test_assignments
FOR INSERT
TO authenticated
WITH CHECK (true);

-- Add rate limiting comments for edge function implementation
COMMENT ON TABLE public.popular_services_analytics IS 'Rate limit: 100 events per minute per user. Implement in edge functions.';
COMMENT ON TABLE public.ab_test_assignments IS 'Rate limit: 10 assignments per minute per user. Implement in edge functions.';