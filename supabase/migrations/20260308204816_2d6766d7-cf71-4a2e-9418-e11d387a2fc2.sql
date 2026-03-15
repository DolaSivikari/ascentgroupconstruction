
-- Add attachment column to rfp_submissions
ALTER TABLE public.rfp_submissions 
ADD COLUMN attachment_urls text[] DEFAULT '{}';

-- Create rfp-attachments storage bucket (private)
INSERT INTO storage.buckets (id, name, public) 
VALUES ('rfp-attachments', 'rfp-attachments', false);

-- Allow anonymous uploads to rfp-attachments
CREATE POLICY "Anyone can upload RFP attachments"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'rfp-attachments');

-- Allow authenticated admins to read RFP attachments
CREATE POLICY "Admins can read RFP attachments"
ON storage.objects FOR SELECT
USING (bucket_id = 'rfp-attachments' AND EXISTS (
  SELECT 1 FROM public.user_roles 
  WHERE user_id = auth.uid() AND role IN ('admin'::app_role, 'super_admin'::app_role)
));
