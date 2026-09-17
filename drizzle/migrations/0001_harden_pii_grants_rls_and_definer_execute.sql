-- 1. Restrict public bulk-harvesting of contact details (column-level grants)
REVOKE SELECT ON public.site_settings FROM PUBLIC, anon;
GRANT SELECT ON public.site_settings TO authenticated;
GRANT ALL ON public.site_settings TO service_role;
GRANT SELECT (id, company_name, company_tagline, address, business_hours, social_links,
  certifications, google_analytics_id, meta_title, meta_description, og_image, is_active,
  created_at, updated_at, admin_quick_actions, robots_txt, service_areas, knows_about,
  founded_year) ON public.site_settings TO anon;

REVOKE SELECT ON public.contact_page_settings FROM PUBLIC, anon;
GRANT SELECT ON public.contact_page_settings TO authenticated;
GRANT ALL ON public.contact_page_settings TO service_role;
GRANT SELECT (id, office_address, weekday_hours, saturday_hours, sunday_hours, map_embed_url,
  is_active, created_at, updated_at) ON public.contact_page_settings TO anon;

-- 2. Google OAuth tokens: no client-side access to token material
DROP POLICY IF EXISTS "Users can insert their own tokens" ON public.google_auth_tokens;
DROP POLICY IF EXISTS "Users can update their own tokens" ON public.google_auth_tokens;
REVOKE ALL ON public.google_auth_tokens FROM PUBLIC, anon, authenticated;
GRANT ALL ON public.google_auth_tokens TO service_role;
GRANT SELECT (id, user_id, token_expiry, scope, created_at, updated_at), DELETE
  ON public.google_auth_tokens TO authenticated;

-- 3. Admin visibility for email operations tables
DROP POLICY IF EXISTS "Admins can view suppressed emails" ON public.suppressed_emails;
CREATE POLICY "Admins can view suppressed emails"
ON public.suppressed_emails FOR SELECT TO authenticated
USING (public.is_admin(auth.uid()));
GRANT SELECT ON public.suppressed_emails TO authenticated;
GRANT SELECT ON public.email_send_log TO authenticated;

DROP POLICY IF EXISTS "Admins can view unsubscribe records" ON public.email_unsubscribe_tokens;
CREATE POLICY "Admins can view unsubscribe records"
ON public.email_unsubscribe_tokens FOR SELECT TO authenticated
USING (public.is_admin(auth.uid()));
REVOKE SELECT ON public.email_unsubscribe_tokens FROM PUBLIC, anon, authenticated;
GRANT SELECT (id, email, created_at, used_at) ON public.email_unsubscribe_tokens TO authenticated;

-- 4. Replace always-true write policies with validated ones
DROP POLICY IF EXISTS "Anyone can submit contact forms" ON public.contact_submissions;
CREATE POLICY "Anyone can submit contact forms"
ON public.contact_submissions FOR INSERT TO anon, authenticated
WITH CHECK (
  length(btrim(name)) BETWEEN 1 AND 200
  AND email ~* '^[^@[:space:]]+@[^@[:space:]]+\.[^@[:space:]]+$' AND length(email) <= 255
  AND length(COALESCE(message, '')) <= 5000
  AND length(COALESCE(phone, '')) <= 40
  AND length(COALESCE(company, '')) <= 200
);

DROP POLICY IF EXISTS "Public can insert quote requests" ON public.quote_requests;
DROP POLICY IF EXISTS "Anyone can submit quote requests" ON public.quote_requests;
CREATE POLICY "Anyone can submit quote requests"
ON public.quote_requests FOR INSERT TO anon, authenticated
WITH CHECK (
  length(btrim(name)) BETWEEN 1 AND 200
  AND email ~* '^[^@[:space:]]+@[^@[:space:]]+\.[^@[:space:]]+$' AND length(email) <= 255
  AND length(COALESCE(additional_notes, '')) <= 5000
  AND length(COALESCE(phone, '')) <= 40
  AND COALESCE(array_length(uploaded_files, 1), 0) <= 20
);

DROP POLICY IF EXISTS "Anyone can submit rfp" ON public.rfp_submissions;
DROP POLICY IF EXISTS "Anyone can submit RFPs" ON public.rfp_submissions;
CREATE POLICY "Anyone can submit RFPs"
ON public.rfp_submissions FOR INSERT TO anon, authenticated
WITH CHECK (
  length(btrim(contact_name)) BETWEEN 1 AND 200
  AND email ~* '^[^@[:space:]]+@[^@[:space:]]+\.[^@[:space:]]+$' AND length(email) <= 255
  AND length(COALESCE(project_description, '')) <= 10000
  AND length(COALESCE(phone, '')) <= 40
  AND COALESCE(array_length(attachment_urls, 1), 0) <= 20
);

DROP POLICY IF EXISTS "Anyone can submit resumes" ON public.resume_submissions;
CREATE POLICY "Anyone can submit resumes"
ON public.resume_submissions FOR INSERT TO anon, authenticated
WITH CHECK (
  length(btrim(applicant_name)) BETWEEN 1 AND 200
  AND email ~* '^[^@[:space:]]+@[^@[:space:]]+\.[^@[:space:]]+$' AND length(email) <= 255
  AND length(COALESCE(cover_letter, '')) <= 10000
  AND length(COALESCE(phone, '')) <= 40
);

DROP POLICY IF EXISTS "Anyone can subscribe to newsletter" ON public.newsletter_subscribers;
CREATE POLICY "Anyone can subscribe to newsletter"
ON public.newsletter_subscribers FOR INSERT TO anon, authenticated
WITH CHECK (
  email ~* '^[^@[:space:]]+@[^@[:space:]]+\.[^@[:space:]]+$' AND length(email) <= 255
  AND length(COALESCE(source, '')) <= 100
);

DROP POLICY IF EXISTS "Anyone can submit prequalification request" ON public.prequalification_downloads;
CREATE POLICY "Anyone can submit prequalification request"
ON public.prequalification_downloads FOR INSERT TO anon, authenticated
WITH CHECK (
  length(btrim(contact_name)) BETWEEN 1 AND 200
  AND length(btrim(company_name)) BETWEEN 1 AND 200
  AND email ~* '^[^@[:space:]]+@[^@[:space:]]+\.[^@[:space:]]+$' AND length(email) <= 255
  AND length(COALESCE(message, '')) <= 5000
);

DROP POLICY IF EXISTS "Anyone can insert error logs" ON public.error_logs;
CREATE POLICY "Anyone can insert error logs"
ON public.error_logs FOR INSERT TO anon, authenticated
WITH CHECK (
  length(COALESCE(message, '')) <= 2000
  AND length(COALESCE(stack, '')) <= 10000
  AND length(COALESCE(url, '')) <= 500
  AND length(COALESCE(user_agent, '')) <= 500
);

DROP POLICY IF EXISTS "Allow anonymous search tracking" ON public.search_analytics;
CREATE POLICY "Allow anonymous search tracking"
ON public.search_analytics FOR INSERT TO anon, authenticated
WITH CHECK (
  length(COALESCE(search_query, '')) <= 200
  AND length(COALESCE(clicked_result_name, '')) <= 200
  AND length(COALESCE(clicked_result_link, '')) <= 500
  AND length(COALESCE(user_session_id, '')) <= 100
);

DROP POLICY IF EXISTS "Authenticated users can log document access" ON public.document_access_log;
CREATE POLICY "Authenticated users can log document access"
ON public.document_access_log FOR INSERT TO authenticated
WITH CHECK (
  EXISTS (SELECT 1 FROM public.documents_library d WHERE d.id = document_id)
  AND length(COALESCE(user_agent, '')) <= 500
);

DROP POLICY IF EXISTS "Authenticated users log service analytics" ON public.popular_services_analytics;
CREATE POLICY "Authenticated users log service analytics"
ON public.popular_services_analytics FOR INSERT TO authenticated
WITH CHECK (
  length(COALESCE(service_link, '')) BETWEEN 1 AND 500
  AND length(COALESCE(service_name, '')) <= 200
  AND length(COALESCE(event_type, '')) <= 50
  AND length(COALESCE(user_identifier, '')) <= 100
  AND length(COALESCE(session_id, '')) <= 100
  AND length(COALESCE(source, '')) <= 100
);

-- 5. Storage: stop public listing of public buckets; add admin write control on rfp-attachments
DROP POLICY IF EXISTS "Documents are publicly accessible" ON storage.objects;
CREATE POLICY "Admins can list documents"
ON storage.objects FOR SELECT TO authenticated
USING (bucket_id = 'documents' AND public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "Public can view project images" ON storage.objects;
CREATE POLICY "Admins can list project images"
ON storage.objects FOR SELECT TO authenticated
USING (bucket_id = 'project-images' AND public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "Admins can update RFP attachments" ON storage.objects;
CREATE POLICY "Admins can update RFP attachments"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'rfp-attachments' AND public.is_admin(auth.uid()))
WITH CHECK (bucket_id = 'rfp-attachments' AND public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "Admins can delete RFP attachments" ON storage.objects;
CREATE POLICY "Admins can delete RFP attachments"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'rfp-attachments' AND public.is_admin(auth.uid()));

-- 6. SECURITY DEFINER functions: only client-facing ones remain executable by anon/authenticated
DO $$
DECLARE
  fn record;
  keep text[] := ARRAY[
    'is_admin', 'has_role', 'can_edit_content', 'can_manage_settings', 'can_manage_users',
    'can_view_analytics', 'get_active_featured_services', 'get_active_promotions',
    'get_preview_blog_post', 'get_preview_project', 'get_preview_service',
    'track_service_interaction', 'get_admin_dashboard_stats', 'get_security_audit_log'
  ];
BEGIN
  FOR fn IN
    SELECT p.oid::regprocedure AS sig
    FROM pg_proc p
    JOIN pg_namespace n ON n.oid = p.pronamespace
    WHERE n.nspname = 'public'
      AND p.prosecdef
      AND NOT (p.proname = ANY (keep))
  LOOP
    EXECUTE format('REVOKE ALL ON FUNCTION %s FROM PUBLIC, anon, authenticated', fn.sig);
  END LOOP;
END $$;