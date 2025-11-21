-- Fix missing RLS policy on resume_submissions table
-- This prevents non-admins from reading job applicant PII data
CREATE POLICY "Block non-admin SELECT on resume submissions"
ON public.resume_submissions 
FOR SELECT 
USING (false);