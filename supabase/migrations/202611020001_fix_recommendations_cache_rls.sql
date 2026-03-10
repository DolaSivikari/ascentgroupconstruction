-- Tighten overly-permissive RLS on recommendation cache
DROP POLICY IF EXISTS "System can manage recommendation cache" ON public.service_recommendations_cache;
DROP POLICY IF EXISTS "Users can view their own recommendations" ON public.service_recommendations_cache;

CREATE POLICY "Users can read own recommendations"
ON public.service_recommendations_cache
FOR SELECT
USING (
  auth.uid()::text = user_identifier
  OR auth.role() = 'service_role'
);

CREATE POLICY "Service role can manage recommendations"
ON public.service_recommendations_cache
FOR ALL
USING (auth.role() = 'service_role')
WITH CHECK (auth.role() = 'service_role');
