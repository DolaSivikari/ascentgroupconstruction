-- 1. Remove the unconditional preview-token branch from public SELECT policies
DROP POLICY IF EXISTS "Published projects viewable by everyone" ON public.projects;
CREATE POLICY "Published projects viewable by everyone"
ON public.projects FOR SELECT
USING (
  publish_state = 'published'::publish_state
  OR is_admin(auth.uid())
  OR can_edit_content(auth.uid())
);

DROP POLICY IF EXISTS "Published services viewable by everyone" ON public.services;
CREATE POLICY "Published services viewable by everyone"
ON public.services FOR SELECT
USING (
  publish_state = 'published'::publish_state
  OR is_admin(auth.uid())
  OR can_edit_content(auth.uid())
);

DROP POLICY IF EXISTS "Published blog posts viewable by everyone" ON public.blog_posts;
CREATE POLICY "Published blog posts viewable by everyone"
ON public.blog_posts FOR SELECT
USING (
  publish_state = 'published'::publish_state
  OR is_admin(auth.uid())
  OR can_edit_content(auth.uid())
);

-- 2. Token-validating preview accessors (token must be presented and matched)
CREATE OR REPLACE FUNCTION public.get_preview_blog_post(p_slug text, p_token text)
RETURNS SETOF public.blog_posts
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public', 'pg_temp'
AS $$
  SELECT *
  FROM public.blog_posts b
  WHERE b.slug = lower(trim(p_slug))
    AND p_token IS NOT NULL
    AND length(p_token) > 16
    AND b.preview_token IS NOT NULL
    AND b.preview_token <> ''
    AND b.preview_token = p_token
    AND (b.preview_token_expires_at IS NULL OR b.preview_token_expires_at > now())
  LIMIT 1;
$$;

CREATE OR REPLACE FUNCTION public.get_preview_project(p_slug text, p_token text)
RETURNS SETOF public.projects
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public', 'pg_temp'
AS $$
  SELECT *
  FROM public.projects p
  WHERE p.slug = lower(trim(p_slug))
    AND p_token IS NOT NULL
    AND length(p_token) > 16
    AND p.preview_token IS NOT NULL
    AND p.preview_token <> ''
    AND p.preview_token = p_token
    AND (p.preview_token_expires_at IS NULL OR p.preview_token_expires_at > now())
  LIMIT 1;
$$;

CREATE OR REPLACE FUNCTION public.get_preview_service(p_slug text, p_token text)
RETURNS SETOF public.services
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public', 'pg_temp'
AS $$
  SELECT *
  FROM public.services s
  WHERE s.slug = lower(trim(p_slug))
    AND p_token IS NOT NULL
    AND length(p_token) > 16
    AND s.preview_token IS NOT NULL
    AND s.preview_token <> ''
    AND s.preview_token = p_token
    AND (s.preview_token_expires_at IS NULL OR s.preview_token_expires_at > now())
  LIMIT 1;
$$;

GRANT EXECUTE ON FUNCTION public.get_preview_blog_post(text, text) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_preview_project(text, text) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_preview_service(text, text) TO anon, authenticated;

-- 3. content_versions: only editors/admins may insert, and only as themselves
DROP POLICY IF EXISTS "System can create versions" ON public.content_versions;
CREATE POLICY "Editors can create versions"
ON public.content_versions FOR INSERT
TO authenticated
WITH CHECK (
  (is_admin(auth.uid()) OR can_edit_content(auth.uid()))
  AND (changed_by IS NULL OR changed_by = auth.uid())
);

-- 4. Policies for the private restricted-documents bucket
DROP POLICY IF EXISTS "Authenticated users can read restricted documents" ON storage.objects;
CREATE POLICY "Authenticated users can read restricted documents"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'documents-restricted' AND auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Admins can upload restricted documents" ON storage.objects;
CREATE POLICY "Admins can upload restricted documents"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'documents-restricted' AND is_admin(auth.uid()));

DROP POLICY IF EXISTS "Admins can update restricted documents" ON storage.objects;
CREATE POLICY "Admins can update restricted documents"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'documents-restricted' AND is_admin(auth.uid()));

DROP POLICY IF EXISTS "Admins can delete restricted documents" ON storage.objects;
CREATE POLICY "Admins can delete restricted documents"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'documents-restricted' AND is_admin(auth.uid()));