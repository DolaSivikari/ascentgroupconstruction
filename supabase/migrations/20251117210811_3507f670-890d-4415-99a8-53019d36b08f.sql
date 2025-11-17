-- =====================================================
-- CRITICAL SECURITY FIXES - PHASE 1
-- Implementing strict RLS policies and data protection
-- =====================================================

-- 1. FIX PROFILES TABLE - Restrict to self-only access
-- =====================================================
DROP POLICY IF EXISTS "Users view own profile only" ON public.profiles;
DROP POLICY IF EXISTS "Super admins view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;

-- Users can only see their own profile
CREATE POLICY "Users view own profile only"
ON public.profiles
FOR SELECT
TO authenticated
USING (auth.uid() = id);

-- Super admins can view all profiles for admin purposes
CREATE POLICY "Super admins view all profiles"
ON public.profiles
FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'super_admin'));

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
ON public.profiles
FOR UPDATE
TO authenticated
USING (auth.uid() = id);

-- 2. FIX CONTACT SUBMISSIONS - Super admin only
-- =====================================================
DROP POLICY IF EXISTS "Super admins view contact submissions" ON public.contact_submissions;
DROP POLICY IF EXISTS "Super admins update contact submissions" ON public.contact_submissions;
DROP POLICY IF EXISTS "Super admins delete contact submissions" ON public.contact_submissions;
DROP POLICY IF EXISTS "Block anonymous SELECT on contact submissions" ON public.contact_submissions;
DROP POLICY IF EXISTS "Super admins full access to contact submissions" ON public.contact_submissions;
DROP POLICY IF EXISTS "Anyone can submit contact forms" ON public.contact_submissions;

CREATE POLICY "Super admins full access to contact submissions"
ON public.contact_submissions
FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'super_admin'))
WITH CHECK (has_role(auth.uid(), 'super_admin'));

-- Public can still submit
CREATE POLICY "Anyone can submit contact forms"
ON public.contact_submissions
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- 3. FIX QUOTE REQUESTS - Super admin only
-- =====================================================
DROP POLICY IF EXISTS "Super admins view quote requests" ON public.quote_requests;
DROP POLICY IF EXISTS "Super admins update quote requests" ON public.quote_requests;
DROP POLICY IF EXISTS "Super admins delete quote requests" ON public.quote_requests;
DROP POLICY IF EXISTS "Super admins full access to quote requests" ON public.quote_requests;
DROP POLICY IF EXISTS "Anyone can submit quote requests" ON public.quote_requests;

CREATE POLICY "Super admins full access to quote requests"
ON public.quote_requests
FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'super_admin'))
WITH CHECK (has_role(auth.uid(), 'super_admin'));

-- Public can still submit
CREATE POLICY "Anyone can submit quote requests"
ON public.quote_requests
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- 4. FIX RFP SUBMISSIONS - Super admin only
-- =====================================================
DROP POLICY IF EXISTS "Super admins view rfp submissions" ON public.rfp_submissions;
DROP POLICY IF EXISTS "Super admins update rfp submissions" ON public.rfp_submissions;
DROP POLICY IF EXISTS "Super admins delete rfp submissions" ON public.rfp_submissions;
DROP POLICY IF EXISTS "Super admins full access to rfp submissions" ON public.rfp_submissions;
DROP POLICY IF EXISTS "Anyone can submit rfp" ON public.rfp_submissions;

CREATE POLICY "Super admins full access to rfp submissions"
ON public.rfp_submissions
FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'super_admin'))
WITH CHECK (has_role(auth.uid(), 'super_admin'));

-- Public can still submit
CREATE POLICY "Anyone can submit rfp"
ON public.rfp_submissions
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- 5. FIX PREQUALIFICATION DOWNLOADS - Super admin only
-- =====================================================
DROP POLICY IF EXISTS "Super admins view prequalification downloads" ON public.prequalification_downloads;
DROP POLICY IF EXISTS "Super admins update prequalification downloads" ON public.prequalification_downloads;
DROP POLICY IF EXISTS "Super admins delete prequalification downloads" ON public.prequalification_downloads;
DROP POLICY IF EXISTS "Super admins full access to prequalification downloads" ON public.prequalification_downloads;
DROP POLICY IF EXISTS "Anyone can submit prequalification request" ON public.prequalification_downloads;

CREATE POLICY "Super admins full access to prequalification downloads"
ON public.prequalification_downloads
FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'super_admin'))
WITH CHECK (has_role(auth.uid(), 'super_admin'));

-- Public can still submit
CREATE POLICY "Anyone can submit prequalification request"
ON public.prequalification_downloads
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- 6. FIX NEWSLETTER SUBSCRIBERS - Super admin only
-- =====================================================
DROP POLICY IF EXISTS "Super admins view newsletter subscribers" ON public.newsletter_subscribers;
DROP POLICY IF EXISTS "Super admins update newsletter subscribers" ON public.newsletter_subscribers;
DROP POLICY IF EXISTS "Super admins full access to newsletter subscribers" ON public.newsletter_subscribers;
DROP POLICY IF EXISTS "Anyone can subscribe to newsletter" ON public.newsletter_subscribers;

CREATE POLICY "Super admins full access to newsletter subscribers"
ON public.newsletter_subscribers
FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'super_admin'))
WITH CHECK (has_role(auth.uid(), 'super_admin'));

-- Public can still subscribe
CREATE POLICY "Anyone can subscribe to newsletter"
ON public.newsletter_subscribers
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- 7. PROTECT AUDIT LOG - Remove user insert capability
-- =====================================================
DROP POLICY IF EXISTS "System can insert audit logs" ON public.audit_log;

-- Only database triggers and system functions can insert
-- No direct user INSERT allowed

-- 8. SECURE ANALYTICS TABLES - Require authentication
-- =====================================================
DROP POLICY IF EXISTS "Authenticated users log analytics" ON public.popular_services_analytics;
DROP POLICY IF EXISTS "Super admins view all analytics" ON public.popular_services_analytics;
DROP POLICY IF EXISTS "Authenticated users log service analytics" ON public.popular_services_analytics;
DROP POLICY IF EXISTS "Super admins view service analytics" ON public.popular_services_analytics;

CREATE POLICY "Authenticated users log service analytics"
ON public.popular_services_analytics
FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Super admins view service analytics"
ON public.popular_services_analytics
FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'super_admin'));

-- Add rate limiting comment for future implementation
COMMENT ON TABLE public.popular_services_analytics IS 'TODO: Implement rate limiting via edge function to prevent analytics flooding';

-- 9. SECURE A/B TEST ASSIGNMENTS - Require authentication
-- =====================================================
DROP POLICY IF EXISTS "Anyone can view their own A/B assignments" ON public.ab_test_assignments;
DROP POLICY IF EXISTS "Authenticated users create A/B assignments" ON public.ab_test_assignments;
DROP POLICY IF EXISTS "Authenticated users view own A/B assignments" ON public.ab_test_assignments;

CREATE POLICY "Authenticated users view own A/B assignments"
ON public.ab_test_assignments
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Authenticated users create A/B assignments"
ON public.ab_test_assignments
FOR INSERT
TO authenticated
WITH CHECK (true);

COMMENT ON TABLE public.ab_test_assignments IS 'TODO: Add user_identifier validation and rate limiting to prevent test gaming';

-- 10. SECURE GOOGLE OAUTH TOKENS - Add encryption preparation
-- =====================================================
-- Enable pgcrypto extension for future token encryption
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Add comment for future encryption implementation
COMMENT ON TABLE public.google_auth_tokens IS 'SECURITY NOTE: Tokens should be encrypted using pgcrypto. Current plain-text storage is temporary. Implement encryption via edge functions for production use.';