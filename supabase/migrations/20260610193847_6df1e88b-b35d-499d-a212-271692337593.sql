
-- 1) error_logs: allow client inserts with rate limit
CREATE POLICY "Anyone can insert error logs"
ON public.error_logs
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

DROP TRIGGER IF EXISTS error_logs_rate_limit ON public.error_logs;
CREATE TRIGGER error_logs_rate_limit
BEFORE INSERT ON public.error_logs
FOR EACH ROW EXECUTE FUNCTION public.enforce_public_form_rate_limit();

-- 2) ab_test_assignments: rate-limit anon inserts
DROP TRIGGER IF EXISTS ab_test_assignments_rate_limit ON public.ab_test_assignments;
CREATE TRIGGER ab_test_assignments_rate_limit
BEFORE INSERT ON public.ab_test_assignments
FOR EACH ROW EXECUTE FUNCTION public.enforce_public_form_rate_limit();

-- 3) storage.objects: tighten RFP attachments upload policy
DROP POLICY IF EXISTS "Anyone can upload RFP attachments" ON storage.objects;

CREATE POLICY "Restricted public RFP attachment uploads"
ON storage.objects
FOR INSERT
TO anon, authenticated
WITH CHECK (
  bucket_id = 'rfp-attachments'
  AND lower(storage.extension(name)) IN ('pdf','doc','docx','xls','xlsx','jpg','jpeg','png','webp')
  AND COALESCE((metadata->>'size')::bigint, 0) <= 20971520
);
