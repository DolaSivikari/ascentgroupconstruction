-- Add DELETE policy for admins on contact_submissions
CREATE POLICY "Admins can delete contact submissions" 
ON public.contact_submissions
FOR DELETE
USING (is_admin(auth.uid()));