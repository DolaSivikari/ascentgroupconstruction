ALTER TABLE public.contact_submissions ADD COLUMN IF NOT EXISTS service_origin TEXT;
ALTER TABLE public.quote_requests ADD COLUMN IF NOT EXISTS service_origin TEXT;
COMMENT ON COLUMN public.contact_submissions.service_origin IS 'Slug of the service page that originated the lead (e.g. commercial-painting-gta). Used for AEO/GEO attribution.';
COMMENT ON COLUMN public.quote_requests.service_origin IS 'Slug of the service page that originated the lead (e.g. commercial-painting-gta). Used for AEO/GEO attribution.';