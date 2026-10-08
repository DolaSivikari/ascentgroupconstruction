DROP POLICY IF EXISTS "Featured services are viewable by everyone" ON public.featured_services;
CREATE POLICY "Active featured services are viewable by everyone"
ON public.featured_services FOR SELECT
USING (is_active = true OR public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "Project services viewable by everyone" ON public.project_services;
CREATE POLICY "Published project services are viewable by everyone"
ON public.project_services FOR SELECT
USING (
  public.can_edit_content(auth.uid())
  OR EXISTS (SELECT 1 FROM public.projects p WHERE p.id = project_services.project_id AND p.publish_state = 'published')
);

DROP POLICY IF EXISTS "Restricted public RFP attachment uploads" ON storage.objects;
CREATE POLICY "Restricted public RFP attachment uploads"
ON storage.objects FOR INSERT TO anon, authenticated
WITH CHECK (
  bucket_id = 'rfp-attachments'
  AND (owner_id IS NULL OR owner_id = (select auth.uid()::text))
  AND lower(storage.extension(name)) = ANY (ARRAY['pdf','doc','docx','xls','xlsx','jpg','jpeg','png','webp'])
  AND COALESCE((metadata->>'size')::bigint, 0) <= 20971520
);