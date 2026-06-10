
DROP POLICY IF EXISTS "Anyone can create A/B assignments" ON public.ab_test_assignments;
CREATE POLICY "Anyone can create A/B assignments"
ON public.ab_test_assignments
FOR INSERT
TO anon, authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.ab_tests t
    WHERE t.test_name = ab_test_assignments.test_name
      AND COALESCE(t.is_active, true) = true
  )
);

DROP POLICY IF EXISTS "Authenticated users can insert error logs" ON public.error_logs;

CREATE POLICY "Block non-admin reads of newsletter subscribers"
ON public.newsletter_subscribers
FOR SELECT
TO anon, authenticated
USING (is_admin(auth.uid()));

CREATE POLICY "Block non-admin reads of prequalification downloads"
ON public.prequalification_downloads
FOR SELECT
TO anon, authenticated
USING (is_admin(auth.uid()));

CREATE POLICY "Block non-admin reads of quote requests"
ON public.quote_requests
FOR SELECT
TO anon, authenticated
USING (is_admin(auth.uid()));

CREATE POLICY "Block non-admin reads of rfp submissions"
ON public.rfp_submissions
FOR SELECT
TO anon, authenticated
USING (is_admin(auth.uid()));

CREATE POLICY "Admins can view email send log"
ON public.email_send_log
FOR SELECT
TO authenticated
USING (is_admin(auth.uid()));

CREATE POLICY "Authenticated admins can view review requests"
ON public.review_requests
FOR SELECT
TO authenticated
USING (is_admin(auth.uid()));
