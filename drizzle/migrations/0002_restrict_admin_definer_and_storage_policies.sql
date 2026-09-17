-- 1. Restricted documents bucket: admins / content editors only
DROP POLICY IF EXISTS "Authenticated users can read restricted documents" ON storage.objects;
CREATE POLICY "Admins can read restricted documents"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'documents-restricted'
  AND (public.is_admin(auth.uid()) OR public.can_edit_content(auth.uid()))
);

-- 2. project_images: no blanket authenticated read of unpublished projects
DROP POLICY IF EXISTS "Authenticated users can view all project images" ON public.project_images;
CREATE POLICY "Staff can view all project images"
ON public.project_images FOR SELECT
TO authenticated
USING (public.is_admin(auth.uid()) OR public.can_edit_content(auth.uid()));

-- 3. Admin-only SECURITY DEFINER functions should not be callable anonymously
REVOKE EXECUTE ON FUNCTION public.get_admin_dashboard_stats() FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.get_security_audit_log(integer) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.get_admin_dashboard_stats() TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_security_audit_log(integer) TO authenticated;