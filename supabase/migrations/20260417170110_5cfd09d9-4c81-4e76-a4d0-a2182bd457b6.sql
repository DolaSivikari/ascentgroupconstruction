
-- Helper: enforce per-IP rate limit on public form inserts
CREATE OR REPLACE FUNCTION public.enforce_public_form_rate_limit()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_ip text;
  v_result jsonb;
BEGIN
  -- Skip enforcement for service_role / admin contexts (edge fns use service key)
  IF current_setting('request.jwt.claim.role', true) = 'service_role' THEN
    RETURN NEW;
  END IF;

  -- Extract IP from request headers (best-effort)
  BEGIN
    v_ip := COALESCE(
      NULLIF(split_part(current_setting('request.headers', true)::jsonb->>'x-forwarded-for', ',', 1), ''),
      NULLIF(current_setting('request.headers', true)::jsonb->>'cf-connecting-ip', ''),
      NULLIF(current_setting('request.headers', true)::jsonb->>'x-real-ip', ''),
      'unknown'
    );
  EXCEPTION WHEN OTHERS THEN
    v_ip := 'unknown';
  END;

  -- Allow 10 submissions per IP per hour per table
  v_result := public.check_and_update_rate_limit(
    v_ip,
    'form:' || TG_TABLE_NAME,
    10,
    60
  );

  IF (v_result->>'allowed')::boolean = false THEN
    RAISE EXCEPTION 'Rate limit exceeded. Please try again later.'
      USING ERRCODE = 'check_violation';
  END IF;

  RETURN NEW;
END;
$$;

-- Attach to four public form tables
DROP TRIGGER IF EXISTS rate_limit_contact_submissions ON public.contact_submissions;
CREATE TRIGGER rate_limit_contact_submissions
  BEFORE INSERT ON public.contact_submissions
  FOR EACH ROW EXECUTE FUNCTION public.enforce_public_form_rate_limit();

DROP TRIGGER IF EXISTS rate_limit_quote_requests ON public.quote_requests;
CREATE TRIGGER rate_limit_quote_requests
  BEFORE INSERT ON public.quote_requests
  FOR EACH ROW EXECUTE FUNCTION public.enforce_public_form_rate_limit();

DROP TRIGGER IF EXISTS rate_limit_rfp_submissions ON public.rfp_submissions;
CREATE TRIGGER rate_limit_rfp_submissions
  BEFORE INSERT ON public.rfp_submissions
  FOR EACH ROW EXECUTE FUNCTION public.enforce_public_form_rate_limit();

DROP TRIGGER IF EXISTS rate_limit_newsletter_subscribers ON public.newsletter_subscribers;
CREATE TRIGGER rate_limit_newsletter_subscribers
  BEFORE INSERT ON public.newsletter_subscribers
  FOR EACH ROW EXECUTE FUNCTION public.enforce_public_form_rate_limit();
