-- Fix contact_submissions RLS policies to be more explicit and restrictive
-- Drop existing potentially conflicting policies
DROP POLICY IF EXISTS "Block anonymous SELECT on contact submissions" ON public.contact_submissions;
DROP POLICY IF EXISTS "Admins can view contact submissions" ON public.contact_submissions;

-- Create explicit restrictive policies with proper role scoping
CREATE POLICY "Authenticated admins can view contact submissions"
ON public.contact_submissions
FOR SELECT
TO authenticated
USING (public.is_admin(auth.uid()));

-- Block all other SELECT access explicitly
CREATE POLICY "Block all other contact submission reads"
ON public.contact_submissions
FOR SELECT
USING (false);

-- Keep the existing insert policy (already correct)
-- "Anyone can submit contact forms" FOR INSERT WITH CHECK (true)

-- Add comment documenting the security model
COMMENT ON TABLE public.contact_submissions IS 'Contact form submissions - only admins can view, anyone can submit. RLS uses restrictive policies to prevent data leakage.';