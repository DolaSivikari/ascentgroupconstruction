
-- 1. PROJECTS: Restrict drafts to admins/editors
DROP POLICY IF EXISTS "Published projects viewable by everyone" ON public.projects;
CREATE POLICY "Published projects viewable by everyone"
ON public.projects
FOR SELECT
USING (
  publish_state = 'published'::publish_state
  OR is_admin(auth.uid())
  OR can_edit_content(auth.uid())
  OR (
    preview_token IS NOT NULL
    AND preview_token <> ''
    AND length(preview_token) > 16
    AND (preview_token_expires_at IS NULL OR preview_token_expires_at > now())
  )
);

-- 2. SERVICES: Restrict drafts to admins/editors
DROP POLICY IF EXISTS "Published services viewable by everyone" ON public.services;
CREATE POLICY "Published services viewable by everyone"
ON public.services
FOR SELECT
USING (
  publish_state = 'published'::publish_state
  OR is_admin(auth.uid())
  OR can_edit_content(auth.uid())
  OR (
    preview_token IS NOT NULL
    AND preview_token <> ''
    AND length(preview_token) > 16
    AND (preview_token_expires_at IS NULL OR preview_token_expires_at > now())
  )
);

-- 3. BLOG_POSTS: Restrict drafts to admins/editors
DROP POLICY IF EXISTS "Published blog posts viewable by everyone" ON public.blog_posts;
CREATE POLICY "Published blog posts viewable by everyone"
ON public.blog_posts
FOR SELECT
USING (
  publish_state = 'published'::publish_state
  OR is_admin(auth.uid())
  OR can_edit_content(auth.uid())
  OR (
    preview_token IS NOT NULL
    AND preview_token <> ''
    AND length(preview_token) > 16
    AND (preview_token_expires_at IS NULL OR preview_token_expires_at > now())
  )
);

-- 4. CONTENT_VERSIONS: Restrict to admins/editors only
DROP POLICY IF EXISTS "Versions viewable by authenticated users" ON public.content_versions;
CREATE POLICY "Versions viewable by admins and editors"
ON public.content_versions
FOR SELECT
USING (is_admin(auth.uid()) OR can_edit_content(auth.uid()));

-- 5. CONTENT_REVIEW_COMMENTS: Restrict to admins/editors only
DROP POLICY IF EXISTS "Authenticated users view comments" ON public.content_review_comments;
CREATE POLICY "Editors and admins view comments"
ON public.content_review_comments
FOR SELECT
USING (is_admin(auth.uid()) OR can_edit_content(auth.uid()));

DROP POLICY IF EXISTS "Authenticated users create comments" ON public.content_review_comments;
CREATE POLICY "Editors and admins create comments"
ON public.content_review_comments
FOR INSERT
WITH CHECK (
  auth.uid() = created_by
  AND (is_admin(auth.uid()) OR can_edit_content(auth.uid()))
);

-- 6. OPTIMIZATION_RECOMMENDATIONS: Admins only
DROP POLICY IF EXISTS "Optimization recommendations viewable by authenticated users" ON public.optimization_recommendations;
CREATE POLICY "Optimization recommendations viewable by admins"
ON public.optimization_recommendations
FOR SELECT
USING (is_admin(auth.uid()));

-- 7. AB_TEST_ASSIGNMENTS: Allow anonymous insert
DROP POLICY IF EXISTS "Authenticated users create A/B assignments" ON public.ab_test_assignments;
CREATE POLICY "Anyone can create A/B assignments"
ON public.ab_test_assignments
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- 8. DOCUMENTS STORAGE BUCKET: Admin-only writes
DROP POLICY IF EXISTS "Authenticated users can upload documents" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update documents" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete documents" ON storage.objects;

CREATE POLICY "Admins can upload documents"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'documents' AND is_admin(auth.uid()));

CREATE POLICY "Admins can update documents"
ON storage.objects
FOR UPDATE
USING (bucket_id = 'documents' AND is_admin(auth.uid()));

CREATE POLICY "Admins can delete documents"
ON storage.objects
FOR DELETE
USING (bucket_id = 'documents' AND is_admin(auth.uid()));
