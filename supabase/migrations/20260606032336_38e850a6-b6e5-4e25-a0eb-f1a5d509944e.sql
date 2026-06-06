
-- 1) performance_metrics: admins only for SELECT
DROP POLICY IF EXISTS "Performance metrics viewable by authenticated users" ON public.performance_metrics;
CREATE POLICY "Performance metrics viewable by admins"
ON public.performance_metrics
FOR SELECT
TO authenticated
USING (is_admin(auth.uid()));

-- 2) seo_keywords: admins only for SELECT
DROP POLICY IF EXISTS "Public can view keywords" ON public.seo_keywords;
DROP POLICY IF EXISTS "Admins can manage SEO keywords" ON public.seo_keywords;
CREATE POLICY "Admins can view SEO keywords"
ON public.seo_keywords
FOR SELECT
TO authenticated
USING (is_admin(auth.uid()));
CREATE POLICY "Admins can manage SEO keywords"
ON public.seo_keywords
FOR ALL
TO authenticated
USING (is_admin(auth.uid()))
WITH CHECK (is_admin(auth.uid()));

-- 3) Re-scope ALL write policies from {public} to {authenticated}
-- ab_tests
DROP POLICY IF EXISTS "Admins can manage A/B tests" ON public.ab_tests;
CREATE POLICY "Admins can manage A/B tests" ON public.ab_tests FOR ALL TO authenticated USING (is_admin(auth.uid())) WITH CHECK (is_admin(auth.uid()));

-- about_page_settings
DROP POLICY IF EXISTS "Admin full access to about_page_settings" ON public.about_page_settings;
CREATE POLICY "Admin full access to about_page_settings" ON public.about_page_settings FOR ALL TO authenticated USING (is_admin(auth.uid())) WITH CHECK (is_admin(auth.uid()));

-- analytics_snapshots
DROP POLICY IF EXISTS "Admins can manage analytics snapshots" ON public.analytics_snapshots;
CREATE POLICY "Admins can manage analytics snapshots" ON public.analytics_snapshots FOR ALL TO authenticated USING (is_admin(auth.uid())) WITH CHECK (is_admin(auth.uid()));

-- certifications
DROP POLICY IF EXISTS "Certifications manageable by admins" ON public.certifications;
CREATE POLICY "Certifications manageable by admins" ON public.certifications FOR ALL TO authenticated USING (is_admin(auth.uid())) WITH CHECK (is_admin(auth.uid()));

-- company_overview_items
DROP POLICY IF EXISTS "Content editors can manage overview items" ON public.company_overview_items;
CREATE POLICY "Content editors can manage overview items" ON public.company_overview_items FOR ALL TO authenticated USING (can_edit_content(auth.uid())) WITH CHECK (can_edit_content(auth.uid()));

-- company_overview_sections
DROP POLICY IF EXISTS "Content editors can manage overview sections" ON public.company_overview_sections;
CREATE POLICY "Content editors can manage overview sections" ON public.company_overview_sections FOR ALL TO authenticated USING (can_edit_content(auth.uid())) WITH CHECK (can_edit_content(auth.uid()));

-- content_review_comments
DROP POLICY IF EXISTS "Admins manage all comments" ON public.content_review_comments;
CREATE POLICY "Admins manage all comments" ON public.content_review_comments FOR ALL TO authenticated USING (is_admin(auth.uid())) WITH CHECK (is_admin(auth.uid()));
DROP POLICY IF EXISTS "Editors and admins create comments" ON public.content_review_comments;
CREATE POLICY "Editors and admins create comments" ON public.content_review_comments FOR INSERT TO authenticated WITH CHECK (is_admin(auth.uid()) OR can_edit_content(auth.uid()));
DROP POLICY IF EXISTS "Editors and admins view comments" ON public.content_review_comments;
CREATE POLICY "Editors and admins view comments" ON public.content_review_comments FOR SELECT TO authenticated USING (is_admin(auth.uid()) OR can_edit_content(auth.uid()));

-- content_versions
DROP POLICY IF EXISTS "System can create versions" ON public.content_versions;
CREATE POLICY "System can create versions" ON public.content_versions FOR INSERT TO authenticated WITH CHECK (auth.uid() IS NOT NULL);
DROP POLICY IF EXISTS "Versions viewable by admins and editors" ON public.content_versions;
CREATE POLICY "Versions viewable by admins and editors" ON public.content_versions FOR SELECT TO authenticated USING (is_admin(auth.uid()) OR can_edit_content(auth.uid()));

-- documents_library
DROP POLICY IF EXISTS "Admins can manage all documents" ON public.documents_library;
CREATE POLICY "Admins can manage all documents" ON public.documents_library FOR ALL TO authenticated USING (is_admin(auth.uid())) WITH CHECK (is_admin(auth.uid()));

-- email_templates
DROP POLICY IF EXISTS "Admins can manage email templates" ON public.email_templates;
CREATE POLICY "Admins can manage email templates" ON public.email_templates FOR ALL TO authenticated USING (is_admin(auth.uid())) WITH CHECK (is_admin(auth.uid()));

-- hero_slides
DROP POLICY IF EXISTS "Hero slides manageable by admins" ON public.hero_slides;
CREATE POLICY "Hero slides manageable by admins" ON public.hero_slides FOR ALL TO authenticated USING (is_admin(auth.uid())) WITH CHECK (is_admin(auth.uid()));

-- optimization_recommendations
DROP POLICY IF EXISTS "Optimization recommendations manageable by admins" ON public.optimization_recommendations;
CREATE POLICY "Optimization recommendations manageable by admins" ON public.optimization_recommendations FOR ALL TO authenticated USING (is_admin(auth.uid())) WITH CHECK (is_admin(auth.uid()));
DROP POLICY IF EXISTS "Optimization recommendations viewable by admins" ON public.optimization_recommendations;
CREATE POLICY "Optimization recommendations viewable by admins" ON public.optimization_recommendations FOR SELECT TO authenticated USING (is_admin(auth.uid()));

-- redirects
DROP POLICY IF EXISTS "Admins manage redirects" ON public.redirects;
CREATE POLICY "Admins manage redirects" ON public.redirects FOR ALL TO authenticated USING (is_admin(auth.uid())) WITH CHECK (is_admin(auth.uid()));

-- security_settings
DROP POLICY IF EXISTS "Admins can manage security settings" ON public.security_settings;
CREATE POLICY "Admins can manage security settings" ON public.security_settings FOR ALL TO authenticated USING (is_admin(auth.uid())) WITH CHECK (is_admin(auth.uid()));
DROP POLICY IF EXISTS "Active security settings viewable by admins" ON public.security_settings;
CREATE POLICY "Active security settings viewable by admins" ON public.security_settings FOR SELECT TO authenticated USING ((is_active = true) AND is_admin(auth.uid()));

-- service_promotions
DROP POLICY IF EXISTS "Admins can manage promotions" ON public.service_promotions;
CREATE POLICY "Admins can manage promotions" ON public.service_promotions FOR ALL TO authenticated USING (is_admin(auth.uid())) WITH CHECK (is_admin(auth.uid()));

-- specialty_pages
DROP POLICY IF EXISTS "Admins can manage specialty pages" ON public.specialty_pages;
CREATE POLICY "Admins can manage specialty pages" ON public.specialty_pages FOR ALL TO authenticated USING (is_admin(auth.uid())) WITH CHECK (is_admin(auth.uid()));

-- stats
DROP POLICY IF EXISTS "Stats manageable by content editors" ON public.stats;
CREATE POLICY "Stats manageable by content editors" ON public.stats FOR ALL TO authenticated USING (can_edit_content(auth.uid())) WITH CHECK (can_edit_content(auth.uid()));

-- testimonials
DROP POLICY IF EXISTS "Testimonials manageable by content editors" ON public.testimonials;
CREATE POLICY "Testimonials manageable by content editors" ON public.testimonials FOR ALL TO authenticated USING (can_edit_content(auth.uid())) WITH CHECK (can_edit_content(auth.uid()));

-- value_pillars
DROP POLICY IF EXISTS "Admins can manage value pillars" ON public.value_pillars;
CREATE POLICY "Admins can manage value pillars" ON public.value_pillars FOR ALL TO authenticated USING (is_admin(auth.uid())) WITH CHECK (is_admin(auth.uid()));

-- why_choose_us_items
DROP POLICY IF EXISTS "Content editors can manage why choose us items" ON public.why_choose_us_items;
CREATE POLICY "Content editors can manage why choose us items" ON public.why_choose_us_items FOR ALL TO authenticated USING (can_edit_content(auth.uid())) WITH CHECK (can_edit_content(auth.uid()));

-- 4) Google OAuth state nonces (CSRF protection)
CREATE TABLE IF NOT EXISTS public.google_oauth_states (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  state text NOT NULL UNIQUE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  expires_at timestamptz NOT NULL DEFAULT (now() + interval '10 minutes'),
  consumed_at timestamptz
);

CREATE INDEX IF NOT EXISTS idx_google_oauth_states_state ON public.google_oauth_states(state);
CREATE INDEX IF NOT EXISTS idx_google_oauth_states_expires ON public.google_oauth_states(expires_at);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.google_oauth_states TO authenticated;
GRANT ALL ON public.google_oauth_states TO service_role;

ALTER TABLE public.google_oauth_states ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage their own oauth states"
ON public.google_oauth_states
FOR ALL
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());
