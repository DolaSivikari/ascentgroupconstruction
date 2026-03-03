-- Remove SECURITY DEFINER from public read functions
CREATE OR REPLACE FUNCTION public.get_active_featured_services()
RETURNS TABLE(id uuid, service_name text, service_link text, icon_name text, category text, description text, promotion_badge text)
LANGUAGE sql
STABLE
SET search_path TO 'public'
AS $$
  SELECT 
    id,
    service_name,
    service_link,
    icon_name,
    category,
    description,
    promotion_badge
  FROM public.featured_services
  WHERE is_active = true
    AND (start_date IS NULL OR start_date <= now())
    AND (end_date IS NULL OR end_date >= now())
  ORDER BY display_order ASC, created_at DESC
  LIMIT 10;
$$;

CREATE OR REPLACE FUNCTION public.get_active_promotions()
RETURNS TABLE(id uuid, title text, service_link text, promotion_type text, badge_text text, badge_color text, promotion_message text, discount_percentage integer)
LANGUAGE sql
STABLE
SET search_path TO 'public'
AS $$
  SELECT 
    id,
    title,
    service_link,
    promotion_type,
    badge_text,
    badge_color,
    promotion_message,
    discount_percentage
  FROM public.service_promotions
  WHERE is_active = true
    AND now() BETWEEN start_date AND end_date
  ORDER BY priority DESC, created_at DESC;
$$;

CREATE OR REPLACE FUNCTION public.track_service_interaction(
  p_user_identifier text,
  p_service_link text,
  p_time_spent integer DEFAULT 0,
  p_from_popular boolean DEFAULT false
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  IF p_user_identifier IS NULL OR length(trim(p_user_identifier)) = 0 THEN
    RAISE EXCEPTION 'Invalid user identifier';
  END IF;

  IF p_service_link IS NULL OR length(trim(p_service_link)) = 0 THEN
    RAISE EXCEPTION 'Invalid service link';
  END IF;

  IF p_time_spent < 0 THEN
    RAISE EXCEPTION 'Invalid time_spent value';
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM public.services
    WHERE publish_state = 'published'
      AND ('/services/' || slug = p_service_link OR slug = p_service_link)
  ) THEN
    RAISE EXCEPTION 'Service not found or not published';
  END IF;

  INSERT INTO public.user_service_preferences (
    user_identifier,
    service_link,
    interaction_count,
    last_viewed_at,
    time_spent_seconds,
    clicked_from_popular
  ) VALUES (
    p_user_identifier,
    p_service_link,
    1,
    now(),
    p_time_spent,
    p_from_popular
  )
  ON CONFLICT (user_identifier, service_link)
  DO UPDATE SET
    interaction_count = user_service_preferences.interaction_count + 1,
    last_viewed_at = now(),
    time_spent_seconds = user_service_preferences.time_spent_seconds + p_time_spent,
    clicked_from_popular = p_from_popular OR user_service_preferences.clicked_from_popular,
    updated_at = now();
END;
$$;
