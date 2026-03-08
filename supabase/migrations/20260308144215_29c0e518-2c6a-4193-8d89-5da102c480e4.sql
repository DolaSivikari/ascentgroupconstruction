-- Fix 1: Tighten service_recommendations_cache RLS policies
DROP POLICY IF EXISTS "System can manage recommendation cache" ON public.service_recommendations_cache;
DROP POLICY IF EXISTS "Users can view their own recommendations" ON public.service_recommendations_cache;

-- Only admins can directly read/manage cache
CREATE POLICY "Admins can manage recommendation cache"
ON public.service_recommendations_cache
FOR ALL
TO authenticated
USING (public.is_admin(auth.uid()))
WITH CHECK (public.is_admin(auth.uid()));

-- Fix 2: Replace get_personalized_recommendations with SECURITY INVOKER and input validation
CREATE OR REPLACE FUNCTION public.get_personalized_recommendations(p_user_identifier text, p_limit integer DEFAULT 4)
 RETURNS TABLE(service_link text, service_name text, recommendation_score double precision, reason text)
 LANGUAGE plpgsql
 STABLE
 SECURITY INVOKER
 SET search_path TO 'public'
AS $function$
BEGIN
  IF p_user_identifier IS NULL OR length(trim(p_user_identifier)) = 0 THEN
    RETURN;
  END IF;
  
  IF p_limit < 1 OR p_limit > 20 THEN
    p_limit := 4;
  END IF;

  RETURN QUERY
  WITH popular_now AS (
    SELECT 
      clicked_result_link as svc_link,
      COUNT(*) as search_count
    FROM public.search_analytics
    WHERE searched_at >= now() - INTERVAL '7 days'
      AND clicked_result_link IS NOT NULL
    GROUP BY clicked_result_link
    ORDER BY search_count DESC
    LIMIT 20
  )
  SELECT 
    p.svc_link::TEXT,
    INITCAP(REPLACE(SPLIT_PART(p.svc_link, '/', -1), '-', ' '))::TEXT as svc_name,
    (p.search_count)::FLOAT as score,
    'Trending now'::TEXT as rec_reason
  FROM popular_now p
  ORDER BY score DESC
  LIMIT p_limit;
END;
$function$;