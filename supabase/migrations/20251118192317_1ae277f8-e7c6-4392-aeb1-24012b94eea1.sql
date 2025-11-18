
-- Create storage bucket for project images
INSERT INTO storage.buckets (id, name, public)
VALUES ('project-images', 'project-images', true);

-- Create RLS policies for project-images bucket
CREATE POLICY "Anyone can view project images"
ON storage.objects
FOR SELECT
USING (bucket_id = 'project-images');

CREATE POLICY "Authenticated users can upload project images"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'project-images');

CREATE POLICY "Authenticated users can update project images"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'project-images');

CREATE POLICY "Authenticated users can delete project images"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'project-images');
