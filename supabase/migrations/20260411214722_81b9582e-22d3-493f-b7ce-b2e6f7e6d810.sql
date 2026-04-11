INSERT INTO storage.buckets (id, name, public) VALUES ('documents', 'documents', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Documents are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'documents');

CREATE POLICY "Authenticated users can upload documents"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'documents');

CREATE POLICY "Authenticated users can update documents"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'documents');

CREATE POLICY "Authenticated users can delete documents"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'documents');