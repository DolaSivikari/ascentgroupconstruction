-- Drop existing permissive storage policies for project-images bucket
DROP POLICY IF EXISTS "Allow public read access" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated uploads" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated updates" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated deletes" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can view project images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload project images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update project images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete project images" ON storage.objects;

-- Create new restrictive policies - only admins can modify, anyone can view
CREATE POLICY "Public can view project images"
ON storage.objects FOR SELECT
USING (bucket_id = 'project-images');

CREATE POLICY "Admins can upload project images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'project-images' AND public.is_admin(auth.uid()));

CREATE POLICY "Admins can update project images"
ON storage.objects FOR UPDATE
USING (bucket_id = 'project-images' AND public.is_admin(auth.uid()));

CREATE POLICY "Admins can delete project images"
ON storage.objects FOR DELETE
USING (bucket_id = 'project-images' AND public.is_admin(auth.uid()));