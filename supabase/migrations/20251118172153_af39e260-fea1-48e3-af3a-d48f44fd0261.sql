-- Update RLS policies for inbox tables to allow both admin and super_admin access

-- Fix contact_submissions policies
DROP POLICY IF EXISTS "Super admins full access to contact submissions" ON public.contact_submissions;

CREATE POLICY "Admins can view contact submissions"
ON public.contact_submissions
FOR SELECT
TO authenticated
USING (is_admin(auth.uid()));

CREATE POLICY "Admins can update contact submissions"
ON public.contact_submissions
FOR UPDATE
TO authenticated
USING (is_admin(auth.uid()))
WITH CHECK (is_admin(auth.uid()));

-- Fix newsletter_subscribers policies
DROP POLICY IF EXISTS "Super admins full access to newsletter subscribers" ON public.newsletter_subscribers;

CREATE POLICY "Admins can manage newsletter subscribers"
ON public.newsletter_subscribers
FOR ALL
TO authenticated
USING (is_admin(auth.uid()))
WITH CHECK (is_admin(auth.uid()));

-- Fix prequalification_downloads policies
DROP POLICY IF EXISTS "Super admins full access to prequalification downloads" ON public.prequalification_downloads;

CREATE POLICY "Admins can manage prequalification downloads"
ON public.prequalification_downloads
FOR ALL
TO authenticated
USING (is_admin(auth.uid()))
WITH CHECK (is_admin(auth.uid()));

-- Check and update rfp_submissions if needed
DROP POLICY IF EXISTS "Super admins full access to rfp submissions" ON public.rfp_submissions;

CREATE POLICY "Admins can manage rfp submissions"
ON public.rfp_submissions
FOR ALL
TO authenticated
USING (is_admin(auth.uid()))
WITH CHECK (is_admin(auth.uid()));

-- Check and update quote_requests if needed
DROP POLICY IF EXISTS "Super admins full access to quote requests" ON public.quote_requests;

CREATE POLICY "Admins can manage quote requests"
ON public.quote_requests
FOR ALL
TO authenticated
USING (is_admin(auth.uid()))
WITH CHECK (is_admin(auth.uid()));