--
-- PostgreSQL database dump
--


-- Dumped from database version 17.6
-- Dumped by pg_dump version 17.7

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: -
--



--
-- Name: app_role; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.app_role AS ENUM (
    'super_admin',
    'admin',
    'editor',
    'contributor',
    'viewer'
);


--
-- Name: application_status; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.application_status AS ENUM (
    'new',
    'reviewed',
    'contacted',
    'rejected',
    'hired'
);


--
-- Name: business_client_type; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.business_client_type AS ENUM (
    'residential',
    'commercial'
);


--
-- Name: business_estimate_status; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.business_estimate_status AS ENUM (
    'draft',
    'sent',
    'viewed',
    'accepted',
    'rejected',
    'expired',
    'converted'
);


--
-- Name: business_invoice_status; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.business_invoice_status AS ENUM (
    'draft',
    'sent',
    'partially_paid',
    'paid',
    'overdue',
    'cancelled'
);


--
-- Name: business_invoice_type; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.business_invoice_type AS ENUM (
    'standard',
    'progress',
    'final',
    'deposit'
);


--
-- Name: business_payment_method; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.business_payment_method AS ENUM (
    'cash',
    'check',
    'credit_card',
    'e_transfer',
    'wire_transfer',
    'other'
);


--
-- Name: business_project_priority; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.business_project_priority AS ENUM (
    'low',
    'normal',
    'high',
    'urgent'
);


--
-- Name: business_project_status; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.business_project_status AS ENUM (
    'lead',
    'quoted',
    'scheduled',
    'in_progress',
    'completed',
    'cancelled'
);


--
-- Name: employment_type; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.employment_type AS ENUM (
    'full_time',
    'part_time',
    'contract',
    'internship'
);


--
-- Name: post_content_type; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.post_content_type AS ENUM (
    'article',
    'case_study',
    'insight',
    'case-study'
);


--
-- Name: publish_state; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.publish_state AS ENUM (
    'draft',
    'scheduled',
    'published',
    'archived',
    'review'
);


--
-- Name: auto_save_version(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.auto_save_version() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
BEGIN
  PERFORM public.save_content_version(
    TG_TABLE_NAME,
    NEW.id,
    to_jsonb(NEW),
    'Automatic version save'
  );
  RETURN NEW;
END;
$$;


SET default_table_access_method = heap;

--
-- Name: quote_requests; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.quote_requests (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    quote_type text NOT NULL,
    name text NOT NULL,
    email text NOT NULL,
    phone text,
    company text,
    role text,
    city text,
    project_address text,
    scope_categories text[],
    estimated_lf jsonb,
    estimated_sf jsonb,
    access_hours text,
    after_hours_required boolean DEFAULT false,
    target_deadline date,
    nte_budget numeric,
    uploaded_files text[],
    additional_notes text,
    lead_score integer,
    priority text,
    estimated_value numeric,
    source text,
    status text DEFAULT 'new'::text,
    assigned_to uuid,
    consent_given boolean DEFAULT false,
    consent_timestamp timestamp with time zone,
    consent_ip text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    CONSTRAINT quote_requests_priority_check CHECK ((priority = ANY (ARRAY['hot'::text, 'warm'::text, 'cold'::text]))),
    CONSTRAINT quote_requests_quote_type_check CHECK ((quote_type = ANY (ARRAY['specialty_prime'::text, 'trade_package'::text, 'emergency'::text, 'general'::text]))),
    CONSTRAINT quote_requests_role_check CHECK ((role = ANY (ARRAY['owner'::text, 'developer'::text, 'gc'::text, 'pm'::text, 'consultant'::text, 'other'::text]))),
    CONSTRAINT quote_requests_status_check CHECK ((status = ANY (ARRAY['new'::text, 'contacted'::text, 'quoted'::text, 'won'::text, 'lost'::text])))
);


--
-- Name: calculate_lead_score(public.quote_requests); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.calculate_lead_score(req public.quote_requests) RETURNS integer
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
DECLARE
  score INTEGER := 0;
BEGIN
  IF req.company IS NOT NULL AND req.company != '' THEN score := score + 20; END IF;
  IF req.role = 'owner' OR req.role = 'developer' THEN score := score + 30;
  ELSIF req.role = 'gc' THEN score := score + 25;
  ELSIF req.role = 'pm' THEN score := score + 20;
  END IF;
  IF req.nte_budget IS NOT NULL THEN score := score + 15; END IF;
  IF array_length(req.uploaded_files, 1) > 0 THEN score := score + 10; END IF;
  IF req.after_hours_required THEN score := score + 10; END IF;
  IF array_length(req.scope_categories, 1) >= 2 THEN score := score + 15; END IF;
  RETURN LEAST(score, 100);
END;
$$;


--
-- Name: can_edit_content(uuid); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.can_edit_content(_user_id uuid) RETURNS boolean
    LANGUAGE sql STABLE SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id 
    AND role IN ('super_admin', 'admin', 'editor', 'contributor')
  )
$$;


--
-- Name: check_and_update_rate_limit(text, text, integer, integer); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.check_and_update_rate_limit(p_identifier text, p_endpoint text, p_limit integer DEFAULT 50, p_window_minutes integer DEFAULT 1) RETURNS jsonb
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
DECLARE
  v_now timestamptz := now();
  v_window_start timestamptz := v_now - (p_window_minutes || ' minutes')::interval;
  v_existing_limit record;
  v_result jsonb;
BEGIN
  -- Try to get existing rate limit entry
  SELECT * INTO v_existing_limit
  FROM public.rate_limits
  WHERE user_identifier = p_identifier
    AND endpoint = p_endpoint
  FOR UPDATE;

  IF NOT FOUND THEN
    -- Create new rate limit entry
    INSERT INTO public.rate_limits (
      user_identifier,
      endpoint,
      request_count,
      window_start
    ) VALUES (
      p_identifier,
      p_endpoint,
      1,
      v_now
    );
    
    RETURN jsonb_build_object(
      'allowed', true,
      'request_count', 1,
      'limit', p_limit
    );
  END IF;

  -- Check if we're still in the same window
  IF v_existing_limit.window_start > v_window_start THEN
    -- Same window - check count
    IF v_existing_limit.request_count >= p_limit THEN
      RETURN jsonb_build_object(
        'allowed', false,
        'request_count', v_existing_limit.request_count,
        'limit', p_limit,
        'retry_after_seconds', EXTRACT(EPOCH FROM (v_existing_limit.window_start + (p_window_minutes || ' minutes')::interval - v_now))::int
      );
    END IF;
    
    -- Increment count
    UPDATE public.rate_limits
    SET request_count = request_count + 1
    WHERE user_identifier = p_identifier
      AND endpoint = p_endpoint;
    
    RETURN jsonb_build_object(
      'allowed', true,
      'request_count', v_existing_limit.request_count + 1,
      'limit', p_limit
    );
  ELSE
    -- New window - reset count
    UPDATE public.rate_limits
    SET request_count = 1,
        window_start = v_now
    WHERE user_identifier = p_identifier
      AND endpoint = p_endpoint;
    
    RETURN jsonb_build_object(
      'allowed', true,
      'request_count', 1,
      'limit', p_limit
    );
  END IF;
END;
$$;


--
-- Name: cleanup_old_error_logs(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.cleanup_old_error_logs() RETURNS void
    LANGUAGE sql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
  DELETE FROM public.error_logs
  WHERE created_at < now() - interval '30 days';
$$;


--
-- Name: create_notification(uuid, text, text, text, text, jsonb); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.create_notification(p_user_id uuid, p_type text, p_title text, p_message text, p_link text DEFAULT NULL::text, p_metadata jsonb DEFAULT '{}'::jsonb) RETURNS uuid
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
DECLARE
  v_notification_id uuid;
BEGIN
  INSERT INTO public.notifications (user_id, type, title, message, link, metadata)
  VALUES (p_user_id, p_type, p_title, p_message, p_link, p_metadata)
  RETURNING id INTO v_notification_id;
  
  RETURN v_notification_id;
END;
$$;


--
-- Name: generate_preview_token_with_expiry(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.generate_preview_token_with_expiry() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
BEGIN
  -- Only set expiration if preview_token is being set/updated
  IF NEW.preview_token IS NOT NULL AND NEW.preview_token <> '' THEN
    -- Set expiration to 24 hours from now if not already set
    IF NEW.preview_token_expires_at IS NULL THEN
      NEW.preview_token_expires_at := now() + interval '24 hours';
    END IF;
    
    -- Track who created the token
    IF NEW.preview_token_created_by IS NULL THEN
      NEW.preview_token_created_by := auth.uid();
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$;


--
-- Name: generate_unsubscribe_token(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.generate_unsubscribe_token() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
BEGIN
  IF NEW.unsubscribe_token IS NULL THEN
    NEW.unsubscribe_token := encode(gen_random_bytes(32), 'hex');
  END IF;
  RETURN NEW;
END;
$$;


--
-- Name: get_active_featured_services(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.get_active_featured_services() RETURNS TABLE(id uuid, service_name text, service_link text, icon_name text, category text, description text, promotion_badge text)
    LANGUAGE sql STABLE SECURITY DEFINER
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


--
-- Name: get_active_promotions(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.get_active_promotions() RETURNS TABLE(id uuid, title text, service_link text, promotion_type text, badge_text text, badge_color text, promotion_message text, discount_percentage integer)
    LANGUAGE sql STABLE SECURITY DEFINER
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


--
-- Name: get_admin_dashboard_stats(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.get_admin_dashboard_stats() RETURNS jsonb
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
DECLARE
  result jsonb;
BEGIN
  -- Verify user is admin
  IF NOT is_admin(auth.uid()) THEN
    RAISE EXCEPTION 'Access denied: admin privileges required';
  END IF;

  -- Build stats object (removed resume_submissions references)
  SELECT jsonb_build_object(
    'projects_published', (SELECT COUNT(*) FROM projects WHERE publish_state = 'published'),
    'projects_draft', (SELECT COUNT(*) FROM projects WHERE publish_state = 'draft'),
    'projects_total', (SELECT COUNT(*) FROM projects),
    'blog_posts_published', (SELECT COUNT(*) FROM blog_posts WHERE publish_state = 'published'),
    'blog_posts_draft', (SELECT COUNT(*) FROM blog_posts WHERE publish_state = 'draft'),
    'blog_posts_total', (SELECT COUNT(*) FROM blog_posts),
    'services_total', (SELECT COUNT(*) FROM services),
    'contact_submissions_total', (SELECT COUNT(*) FROM contact_submissions),
    'contact_submissions_new', (SELECT COUNT(*) FROM contact_submissions WHERE status = 'new'),
    'rfp_submissions_total', (SELECT COUNT(*) FROM rfp_submissions),
    'rfp_submissions_new', (SELECT COUNT(*) FROM rfp_submissions WHERE status = 'new'),
    'quote_requests_total', (SELECT COUNT(*) FROM quote_requests),
    'quote_requests_new', (SELECT COUNT(*) FROM quote_requests WHERE status = 'new')
  ) INTO result;

  RETURN result;
END;
$$;


--
-- Name: get_personalized_recommendations(text, integer); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.get_personalized_recommendations(p_user_identifier text, p_limit integer DEFAULT 4) RETURNS TABLE(service_link text, service_name text, recommendation_score double precision, reason text)
    LANGUAGE plpgsql STABLE SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
DECLARE
  v_cached_recs JSONB;
  v_cache_expires TIMESTAMPTZ;
BEGIN
  -- Check cache first
  SELECT recommended_services, expires_at
  INTO v_cached_recs, v_cache_expires
  FROM public.service_recommendations_cache
  WHERE user_identifier = p_user_identifier
    AND expires_at > now();
  
  IF v_cached_recs IS NOT NULL THEN
    -- Return cached recommendations
    RETURN QUERY
    SELECT 
      (rec->>'service_link')::TEXT,
      (rec->>'service_name')::TEXT,
      (rec->>'score')::FLOAT,
      (rec->>'reason')::TEXT
    FROM jsonb_array_elements(v_cached_recs) AS rec
    LIMIT p_limit;
  ELSE
    -- Generate new recommendations based on user preferences and popular services
    RETURN QUERY
    WITH user_prefs AS (
      SELECT service_link, interaction_count, last_viewed_at
      FROM public.user_service_preferences
      WHERE user_identifier = p_user_identifier
      ORDER BY last_viewed_at DESC
      LIMIT 10
    ),
    popular_now AS (
      SELECT 
        clicked_result_link as service_link,
        COUNT(*) as search_count
      FROM public.search_analytics
      WHERE searched_at >= now() - INTERVAL '7 days'
        AND clicked_result_link IS NOT NULL
      GROUP BY clicked_result_link
      ORDER BY search_count DESC
      LIMIT 20
    )
    SELECT 
      p.service_link::TEXT,
      INITCAP(REPLACE(SPLIT_PART(p.service_link, '/', -1), '-', ' '))::TEXT as service_name,
      (p.search_count * 0.7 + COALESCE(up.interaction_count, 0) * 0.3)::FLOAT as score,
      CASE 
        WHEN up.interaction_count > 0 THEN 'Based on your interests'
        ELSE 'Trending now'
      END::TEXT as reason
    FROM popular_now p
    LEFT JOIN user_prefs up ON up.service_link = p.service_link
    WHERE p.service_link NOT IN (
      SELECT service_link FROM user_prefs ORDER BY last_viewed_at DESC LIMIT 3
    )
    ORDER BY score DESC
    LIMIT p_limit;
  END IF;
END;
$$;


--
-- Name: get_security_audit_log(integer); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.get_security_audit_log(limit_count integer DEFAULT 100) RETURNS TABLE(id uuid, object_type text, object_id uuid, action text, user_id uuid, created_at timestamp with time zone, ip_address text, user_agent text, accessed_by_email text, accessed_email text)
    LANGUAGE sql STABLE SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
  SELECT 
    al.id,
    al.object_type,
    al.object_id,
    al.action,
    al.user_id,
    al.created_at,
    al.ip_address,
    al.user_agent,
    p.email as accessed_by_email,
    CASE 
      WHEN al.object_type = 'profiles' THEN (al.after_state->>'email')
      WHEN al.object_type = 'contact_submissions' THEN (al.after_state->>'email')
      WHEN al.object_type = 'resume_submissions' THEN (al.after_state->>'email')
    END as accessed_email
  FROM public.audit_log al
  LEFT JOIN public.profiles p ON p.id = al.user_id
  WHERE al.object_type IN ('profiles', 'contact_submissions', 'resume_submissions')
    AND is_admin(auth.uid())
  ORDER BY al.created_at DESC
  LIMIT limit_count;
$$;


--
-- Name: handle_new_user(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.handle_new_user() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', '')
  );
  RETURN NEW;
END;
$$;


--
-- Name: has_role(uuid, public.app_role); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.has_role(_user_id uuid, _role public.app_role) RETURNS boolean
    LANGUAGE sql STABLE SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;


--
-- Name: is_admin(uuid); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.is_admin(_user_id uuid) RETURNS boolean
    LANGUAGE sql STABLE SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id 
    AND role IN ('super_admin', 'admin')
  )
$$;


--
-- Name: log_sensitive_access(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.log_sensitive_access() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
BEGIN
  INSERT INTO public.audit_log (
    object_type,
    object_id,
    action,
    user_id,
    before_state,
    after_state
  ) VALUES (
    TG_TABLE_NAME,
    COALESCE(NEW.id, OLD.id),
    TG_OP,
    auth.uid(),
    CASE WHEN TG_OP IN ('UPDATE', 'DELETE') THEN to_jsonb(OLD) ELSE NULL END,
    CASE WHEN TG_OP IN ('INSERT', 'UPDATE') THEN to_jsonb(NEW) ELSE NULL END
  );
  RETURN COALESCE(NEW, OLD);
END;
$$;


--
-- Name: normalize_slug(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.normalize_slug() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
BEGIN
  NEW.slug = lower(trim(NEW.slug));
  RETURN NEW;
END;
$$;


--
-- Name: notify_admins(text, uuid, text, text); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.notify_admins(p_type text, p_ref_id uuid, p_title text, p_message text) RETURNS void
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
DECLARE
  admin_record RECORD;
BEGIN
  -- Insert notification for each admin user
  FOR admin_record IN 
    SELECT DISTINCT ur.user_id
    FROM public.user_roles ur
    WHERE ur.role IN ('admin', 'super_admin')
  LOOP
    INSERT INTO public.admin_notifications (
      user_id,
      notification_type,
      reference_id,
      title,
      message
    ) VALUES (
      admin_record.user_id,
      p_type,
      p_ref_id,
      p_title,
      p_message
    );
  END LOOP;
END;
$$;


--
-- Name: notify_new_contact(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.notify_new_contact() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
BEGIN
  PERFORM notify_admins(
    'contact',
    NEW.id,
    'New Contact Submission',
    'New contact from ' || NEW.name || ' - ' || COALESCE(NEW.submission_type, 'general')
  );
  RETURN NEW;
END;
$$;


--
-- Name: notify_new_prequal(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.notify_new_prequal() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
BEGIN
  PERFORM notify_admins(
    'prequal',
    NEW.id,
    'New Prequalification Request',
    'New prequal from ' || NEW.contact_name || ' (' || NEW.company_name || ')'
  );
  RETURN NEW;
END;
$$;


--
-- Name: notify_new_quote(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.notify_new_quote() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
BEGIN
  PERFORM notify_admins(
    'quote',
    NEW.id,
    'New Quote Request',
    'New quote request from ' || NEW.name || ' - ' || NEW.quote_type
  );
  RETURN NEW;
END;
$$;


--
-- Name: notify_new_rfp(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.notify_new_rfp() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
BEGIN
  PERFORM notify_admins(
    'rfp',
    NEW.id,
    'New RFP Submission',
    'New RFP from ' || NEW.contact_name || ' (' || NEW.company_name || ') - ' || NEW.project_name
  );
  RETURN NEW;
END;
$$;


--
-- Name: save_content_version(text, uuid, jsonb, text); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.save_content_version(p_entity_type text, p_entity_id uuid, p_content_snapshot jsonb, p_change_summary text) RETURNS void
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
DECLARE
  v_next_version integer;
BEGIN
  -- Get next version number
  SELECT COALESCE(MAX(version_number), 0) + 1
  INTO v_next_version
  FROM public.content_versions
  WHERE entity_type = p_entity_type AND entity_id = p_entity_id;
  
  -- Insert new version
  INSERT INTO public.content_versions (
    entity_type,
    entity_id,
    version_number,
    content_snapshot,
    changed_by,
    change_summary
  ) VALUES (
    p_entity_type,
    p_entity_id,
    v_next_version,
    p_content_snapshot,
    auth.uid(),
    p_change_summary
  );
END;
$$;


--
-- Name: set_lead_score_and_priority(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.set_lead_score_and_priority() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
BEGIN
  NEW.lead_score := calculate_lead_score(NEW);
  IF NEW.lead_score >= 70 THEN NEW.priority := 'hot';
  ELSIF NEW.lead_score >= 40 THEN NEW.priority := 'warm';
  ELSE NEW.priority := 'cold';
  END IF;
  RETURN NEW;
END;
$$;


--
-- Name: track_service_interaction(text, text, integer, boolean); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.track_service_interaction(p_user_identifier text, p_service_link text, p_time_spent integer DEFAULT 0, p_from_popular boolean DEFAULT false) RETURNS void
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
BEGIN
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


--
-- Name: update_updated_at_column(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.update_updated_at_column() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;


--
-- Name: ab_test_assignments; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.ab_test_assignments (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    test_name text NOT NULL,
    variant text NOT NULL,
    user_identifier text NOT NULL,
    assigned_at timestamp with time zone DEFAULT now(),
    converted_at timestamp with time zone,
    conversion_value numeric
);


--
-- Name: ab_tests; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.ab_tests (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    test_name text NOT NULL,
    description text,
    is_active boolean DEFAULT true,
    variants jsonb DEFAULT '[]'::jsonb NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


--
-- Name: about_page_settings; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.about_page_settings (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    years_in_business integer DEFAULT 15,
    total_projects integer DEFAULT 500,
    satisfaction_rate integer DEFAULT 98,
    story_headline text DEFAULT 'Our Story'::text,
    story_content jsonb DEFAULT '[]'::jsonb,
    story_image_url text,
    story_promise_title text DEFAULT 'Our Promise'::text,
    story_promise_text text,
    "values" jsonb DEFAULT '[]'::jsonb,
    sustainability_headline text DEFAULT 'Sustainability Commitment'::text,
    sustainability_commitment text,
    sustainability_initiatives jsonb DEFAULT '[]'::jsonb,
    safety_headline text DEFAULT 'Safety First, Always'::text,
    safety_commitment text,
    safety_stats jsonb DEFAULT '[]'::jsonb,
    safety_programs jsonb DEFAULT '[]'::jsonb,
    faq_items jsonb DEFAULT '[]'::jsonb,
    cta_headline text DEFAULT 'Ready to Work with Us?'::text,
    cta_subheadline text,
    is_active boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    created_by uuid,
    updated_by uuid,
    licenses jsonb DEFAULT '[]'::jsonb,
    memberships text[] DEFAULT '{}'::text[],
    insurance jsonb DEFAULT '{}'::jsonb,
    credentials_cta_headline text DEFAULT 'Our Credentials'::text,
    credentials_cta_text text DEFAULT 'View our complete certifications and insurance coverage'::text
);


--
-- Name: admin_notifications; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.admin_notifications (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid,
    notification_type text NOT NULL,
    reference_id uuid NOT NULL,
    title text NOT NULL,
    message text NOT NULL,
    is_read boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT now(),
    CONSTRAINT admin_notifications_notification_type_check CHECK ((notification_type = ANY (ARRAY['rfp'::text, 'contact'::text, 'resume'::text, 'prequal'::text, 'quote'::text, 'newsletter'::text])))
);


--
-- Name: analytics_snapshots; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.analytics_snapshots (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    page_path text NOT NULL,
    page_views integer DEFAULT 0,
    unique_visitors integer DEFAULT 0,
    avg_time_on_page numeric(10,2) DEFAULT 0,
    bounce_rate numeric(5,2) DEFAULT 0,
    snapshot_date date DEFAULT CURRENT_DATE NOT NULL,
    created_at timestamp with time zone DEFAULT now()
);


--
-- Name: audit_log; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.audit_log (
    id uuid DEFAULT extensions.uuid_generate_v4() NOT NULL,
    user_id uuid,
    action text NOT NULL,
    object_type text NOT NULL,
    object_id uuid,
    before_state jsonb,
    after_state jsonb,
    ip_address text,
    user_agent text,
    created_at timestamp with time zone DEFAULT now()
);


--
-- Name: auth_failed_attempts; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.auth_failed_attempts (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_identifier text NOT NULL,
    ip_address text,
    user_agent text,
    attempt_time timestamp with time zone DEFAULT now(),
    created_at timestamp with time zone DEFAULT now()
);


--
-- Name: blog_posts; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.blog_posts (
    id uuid DEFAULT extensions.uuid_generate_v4() NOT NULL,
    slug text NOT NULL,
    title text NOT NULL,
    summary text,
    content text,
    featured_image text,
    author_id uuid,
    category text,
    tags text[],
    read_time_minutes integer,
    publish_state public.publish_state DEFAULT 'draft'::public.publish_state,
    published_at timestamp with time zone,
    scheduled_publish timestamp with time zone,
    seo_title text,
    seo_description text,
    seo_keywords text[],
    canonical_url text,
    created_by uuid,
    updated_by uuid,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    preview_token text,
    scheduled_publish_at timestamp with time zone,
    content_type public.post_content_type DEFAULT 'article'::public.post_content_type,
    project_location text,
    project_size text,
    project_duration text,
    challenge text,
    solution text,
    results text,
    before_images jsonb DEFAULT '[]'::jsonb,
    after_images jsonb DEFAULT '[]'::jsonb,
    process_steps jsonb DEFAULT '[]'::jsonb,
    client_name text,
    budget_range text,
    preview_token_expires_at timestamp with time zone,
    preview_token_created_by uuid,
    og_image_url text,
    sector text DEFAULT 'General'::text,
    source text,
    is_pinned boolean DEFAULT false,
    CONSTRAINT blog_posts_content_length_check CHECK ((length(content) <= 50000)),
    CONSTRAINT blog_posts_sector_check CHECK ((sector = ANY (ARRAY['Infrastructure'::text, 'Buildings'::text, 'Both'::text, 'General'::text]))),
    CONSTRAINT blog_posts_summary_length_check CHECK ((length(summary) <= 500))
);


--
-- Name: certifications; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.certifications (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name text NOT NULL,
    logo_url text,
    description text,
    issued_by text,
    expiry_date date,
    display_order integer DEFAULT 0,
    is_active boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


--
-- Name: company_overview_items; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.company_overview_items (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    section_id uuid NOT NULL,
    title text,
    content text NOT NULL,
    icon_name text,
    display_order integer DEFAULT 0,
    is_active boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    created_by uuid,
    updated_by uuid
);


--
-- Name: company_overview_sections; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.company_overview_sections (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    section_type text NOT NULL,
    title text NOT NULL,
    description text,
    display_order integer DEFAULT 0,
    is_active boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    created_by uuid,
    updated_by uuid,
    CONSTRAINT company_overview_sections_section_type_check CHECK ((section_type = ANY (ARRAY['approach'::text, 'values'::text, 'promise'::text])))
);


--
-- Name: contact_page_settings; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.contact_page_settings (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    office_address text,
    main_phone text,
    toll_free_phone text,
    general_email text,
    projects_email text,
    careers_email text,
    weekday_hours text,
    saturday_hours text,
    sunday_hours text,
    map_embed_url text,
    is_active boolean DEFAULT true,
    created_by uuid,
    updated_by uuid,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    rfp_email text
);


--
-- Name: contact_submissions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.contact_submissions (
    id uuid DEFAULT extensions.uuid_generate_v4() NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    name text NOT NULL,
    email text NOT NULL,
    phone text,
    company text,
    message text NOT NULL,
    submission_type text DEFAULT 'general'::text,
    status text DEFAULT 'new'::text,
    admin_notes text,
    consent_timestamp timestamp with time zone,
    consent_ip text,
    newsletter_consent boolean DEFAULT false,
    CONSTRAINT contact_submissions_email_not_empty CHECK (((email IS NOT NULL) AND (length(TRIM(BOTH FROM email)) > 0))),
    CONSTRAINT contact_submissions_name_not_empty CHECK (((name IS NOT NULL) AND (length(TRIM(BOTH FROM name)) > 0)))
);


--
-- Name: content_review_comments; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.content_review_comments (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    entity_type text NOT NULL,
    entity_id uuid NOT NULL,
    comment text NOT NULL,
    created_by uuid NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    status text
);


--
-- Name: content_versions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.content_versions (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    entity_type text NOT NULL,
    entity_id uuid NOT NULL,
    version_number integer NOT NULL,
    content_snapshot jsonb NOT NULL,
    changed_by uuid NOT NULL,
    change_summary text,
    created_at timestamp with time zone DEFAULT now()
);


--
-- Name: document_access_log; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.document_access_log (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    document_id uuid,
    ip_address text,
    user_agent text,
    created_at timestamp with time zone DEFAULT now()
);


--
-- Name: documents_library; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.documents_library (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    title text NOT NULL,
    description text,
    category text NOT NULL,
    file_url text NOT NULL,
    file_name text NOT NULL,
    file_size bigint,
    file_type text,
    version text DEFAULT '1.0'::text,
    is_active boolean DEFAULT true,
    requires_authentication boolean DEFAULT false,
    expiry_date date,
    display_order integer DEFAULT 0,
    download_count integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    created_by uuid,
    updated_by uuid,
    focal_point_x numeric DEFAULT 0.5,
    focal_point_y numeric DEFAULT 0.5,
    alt_text text,
    crop_presets jsonb DEFAULT '[]'::jsonb
);


--
-- Name: email_templates; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.email_templates (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name text NOT NULL,
    subject text NOT NULL,
    body_html text NOT NULL,
    body_text text NOT NULL,
    category text DEFAULT 'transactional'::text NOT NULL,
    is_active boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


--
-- Name: error_logs; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.error_logs (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    message text NOT NULL,
    stack text,
    context jsonb,
    url text,
    user_agent text,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: featured_services; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.featured_services (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    service_name text NOT NULL,
    service_link text NOT NULL,
    icon_name text NOT NULL,
    display_order integer DEFAULT 0 NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    category text,
    description text,
    promotion_badge text,
    start_date timestamp with time zone,
    end_date timestamp with time zone,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    created_by uuid,
    updated_by uuid
);


--
-- Name: footer_settings; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.footer_settings (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    quick_links jsonb DEFAULT '[]'::jsonb,
    sectors_links jsonb DEFAULT '[]'::jsonb,
    contact_info jsonb DEFAULT '{}'::jsonb,
    social_media jsonb DEFAULT '{}'::jsonb,
    trust_bar_items jsonb DEFAULT '[]'::jsonb,
    is_active boolean DEFAULT true,
    created_by uuid,
    updated_by uuid,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


--
-- Name: google_auth_tokens; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.google_auth_tokens (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    access_token text NOT NULL,
    refresh_token text,
    token_expiry timestamp with time zone NOT NULL,
    scope text NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


--
-- Name: hero_slides; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.hero_slides (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    display_order integer DEFAULT 0 NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    headline text NOT NULL,
    subheadline text NOT NULL,
    description text,
    stat_number text,
    stat_label text,
    primary_cta_text text DEFAULT 'Submit RFP'::text NOT NULL,
    primary_cta_url text DEFAULT '/submit-rfp'::text NOT NULL,
    primary_cta_icon text DEFAULT 'FileText'::text,
    secondary_cta_text text,
    secondary_cta_url text,
    video_url text,
    poster_url text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    created_by uuid,
    updated_by uuid
);


--
-- Name: homepage_settings; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.homepage_settings (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    headline text DEFAULT 'Ontario''s Trusted General Contractor'::text NOT NULL,
    subheadline text DEFAULT 'Delivering commercial, multi-family, and institutional projects on-time and on-budget since 2009'::text NOT NULL,
    hero_description text DEFAULT 'With 15+ years of construction management expertise across Ontario, Ascent Group Construction specializes in design-build, general contracting, and construction management for commercial, institutional, and multi-family projects. We deliver quality results through transparent project management and proven construction methodologies.'::text,
    cta_primary_text text DEFAULT 'Submit RFP'::text,
    cta_primary_url text DEFAULT '/submit-rfp'::text,
    cta_secondary_text text DEFAULT 'Request Proposal'::text,
    cta_secondary_url text DEFAULT '/contact'::text,
    cta_tertiary_text text DEFAULT 'View Projects'::text,
    cta_tertiary_url text DEFAULT '/projects'::text,
    value_prop_1 text DEFAULT 'Licensed & Bonded'::text,
    value_prop_2 text DEFAULT '500+ Projects Completed'::text,
    value_prop_3 text DEFAULT '98% Client Satisfaction'::text,
    is_active boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    created_by uuid,
    updated_by uuid
);


--
-- Name: navigation_menu_items; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.navigation_menu_items (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    menu_type text DEFAULT 'primary'::text NOT NULL,
    parent_id uuid,
    label text NOT NULL,
    url text NOT NULL,
    description text,
    badge text,
    icon_name text,
    display_order integer DEFAULT 0,
    is_active boolean DEFAULT true,
    is_mega_menu boolean DEFAULT false,
    mega_menu_section_title text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    created_by uuid,
    updated_by uuid
);


--
-- Name: newsletter_subscribers; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.newsletter_subscribers (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    email text NOT NULL,
    source text DEFAULT 'footer'::text,
    subscribed_at timestamp with time zone DEFAULT now(),
    is_active boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    consent_timestamp timestamp with time zone DEFAULT now(),
    consent_ip text,
    consent_method text DEFAULT 'footer'::text,
    unsubscribed_at timestamp with time zone,
    unsubscribe_token text
);


--
-- Name: notifications; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.notifications (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    type text NOT NULL,
    title text NOT NULL,
    message text NOT NULL,
    link text,
    read boolean DEFAULT false,
    metadata jsonb DEFAULT '{}'::jsonb,
    created_at timestamp with time zone DEFAULT now()
);


--
-- Name: optimization_recommendations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.optimization_recommendations (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    category text NOT NULL,
    title text NOT NULL,
    description text NOT NULL,
    priority text,
    status text DEFAULT 'pending'::text,
    resolved_by uuid,
    resolved_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT now(),
    CONSTRAINT optimization_recommendations_priority_check CHECK ((priority = ANY (ARRAY['low'::text, 'medium'::text, 'high'::text, 'critical'::text]))),
    CONSTRAINT optimization_recommendations_status_check CHECK ((status = ANY (ARRAY['pending'::text, 'in_progress'::text, 'completed'::text, 'dismissed'::text])))
);


--
-- Name: performance_metrics; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.performance_metrics (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    metric_type text NOT NULL,
    metric_name text NOT NULL,
    value numeric NOT NULL,
    unit text,
    metadata jsonb DEFAULT '{}'::jsonb,
    recorded_at timestamp with time zone DEFAULT now()
);


--
-- Name: popular_services_analytics; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.popular_services_analytics (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    service_link text NOT NULL,
    service_name text NOT NULL,
    event_type text NOT NULL,
    user_identifier text NOT NULL,
    session_id text,
    source text DEFAULT 'mobile_nav'::text NOT NULL,
    "position" integer,
    variant text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT popular_services_analytics_event_type_check CHECK ((event_type = ANY (ARRAY['impression'::text, 'click'::text, 'conversion'::text])))
);


--
-- Name: prequalification_downloads; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.prequalification_downloads (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    downloaded_at timestamp with time zone DEFAULT now(),
    company_name text NOT NULL,
    contact_name text NOT NULL,
    email text NOT NULL,
    phone text,
    project_type text,
    project_value_range text,
    message text,
    status text DEFAULT 'new'::text,
    consent_timestamp timestamp with time zone,
    consent_ip text
);


--
-- Name: profiles; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.profiles (
    id uuid NOT NULL,
    email text,
    full_name text,
    avatar_url text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


--
-- Name: project_images; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.project_images (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    project_id uuid NOT NULL,
    url text NOT NULL,
    category character varying(20) NOT NULL,
    caption text,
    display_order integer DEFAULT 0 NOT NULL,
    featured boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    CONSTRAINT project_images_category_check CHECK (((category)::text = ANY ((ARRAY['before'::character varying, 'after'::character varying, 'process'::character varying, 'gallery'::character varying])::text[])))
);


--
-- Name: project_services; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.project_services (
    id uuid DEFAULT extensions.uuid_generate_v4() NOT NULL,
    project_id uuid,
    service_id uuid
);


--
-- Name: projects; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.projects (
    id uuid DEFAULT extensions.uuid_generate_v4() NOT NULL,
    slug text NOT NULL,
    title text NOT NULL,
    subtitle text,
    summary text,
    description text,
    featured_image text,
    gallery jsonb DEFAULT '[]'::jsonb,
    client_name text,
    location text,
    category text,
    tags text[],
    project_size text,
    budget_range text,
    start_date date,
    completion_date date,
    project_status text,
    process_notes text,
    publish_state public.publish_state DEFAULT 'draft'::public.publish_state,
    seo_title text,
    seo_description text,
    seo_keywords text[],
    created_by uuid,
    updated_by uuid,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    content_blocks jsonb DEFAULT '[]'::jsonb,
    version integer DEFAULT 1,
    draft_content jsonb,
    preview_token text,
    scheduled_publish_at timestamp with time zone,
    featured boolean DEFAULT false,
    year text,
    duration text,
    before_images jsonb DEFAULT '[]'::jsonb,
    after_images jsonb DEFAULT '[]'::jsonb,
    preview_token_expires_at timestamp with time zone,
    preview_token_created_by uuid,
    project_value text,
    square_footage text,
    your_role text,
    delivery_method text,
    client_type text,
    trades_coordinated integer,
    peak_workforce integer,
    on_time_completion boolean DEFAULT true,
    on_budget boolean DEFAULT true,
    safety_incidents integer DEFAULT 0,
    scope_of_work text,
    team_credits jsonb DEFAULT '[]'::jsonb,
    og_image_url text,
    canonical_url text,
    challenge text,
    solution text,
    results text
);


--
-- Name: redirects; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.redirects (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    source_path text NOT NULL,
    destination_path text NOT NULL,
    redirect_type integer DEFAULT 301,
    is_active boolean DEFAULT true,
    hit_count integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    created_by uuid,
    notes text
);


--
-- Name: review_requests; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.review_requests (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    email text NOT NULL,
    client_name text NOT NULL,
    project_id uuid,
    status text DEFAULT 'pending'::text NOT NULL,
    sent_at timestamp with time zone DEFAULT now(),
    responded_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: rfp_submissions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.rfp_submissions (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    company_name text NOT NULL,
    contact_name text NOT NULL,
    email text NOT NULL,
    phone text,
    project_name text NOT NULL,
    project_type text,
    project_location text,
    estimated_value_range text,
    estimated_start_date date,
    project_description text,
    special_requirements text,
    status text DEFAULT 'new'::text,
    admin_notes text,
    estimated_timeline text,
    project_start_date text,
    scope_of_work text DEFAULT ''::text NOT NULL,
    delivery_method text,
    bonding_required boolean DEFAULT false,
    prequalification_complete boolean DEFAULT false,
    additional_requirements text,
    consent_timestamp timestamp with time zone,
    consent_ip text,
    title text,
    plans_available boolean DEFAULT false,
    site_visit_required boolean DEFAULT false
);


--
-- Name: search_analytics; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.search_analytics (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    search_query text NOT NULL,
    results_count integer DEFAULT 0 NOT NULL,
    clicked_result_name text,
    clicked_result_link text,
    section_distribution jsonb,
    searched_at timestamp with time zone DEFAULT now() NOT NULL,
    user_session_id text,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: search_console_data; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.search_console_data (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    site_url text NOT NULL,
    date date NOT NULL,
    clicks integer DEFAULT 0,
    impressions integer DEFAULT 0,
    ctr numeric DEFAULT 0,
    "position" numeric DEFAULT 0,
    page_path text,
    query text,
    device text,
    country text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


--
-- Name: security_settings; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.security_settings (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    mfa_required boolean DEFAULT false,
    session_timeout_minutes integer DEFAULT 120,
    ip_whitelist text[] DEFAULT '{}'::text[],
    audit_retention_days integer DEFAULT 90,
    max_failed_login_attempts integer DEFAULT 5,
    password_min_length integer DEFAULT 8,
    password_require_uppercase boolean DEFAULT true,
    password_require_lowercase boolean DEFAULT true,
    password_require_numbers boolean DEFAULT true,
    password_require_special boolean DEFAULT true,
    is_active boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    created_by uuid,
    updated_by uuid
);


--
-- Name: service_promotions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.service_promotions (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    title text NOT NULL,
    service_link text NOT NULL,
    promotion_type text NOT NULL,
    badge_text text,
    badge_color text,
    priority integer DEFAULT 0 NOT NULL,
    start_date timestamp with time zone NOT NULL,
    end_date timestamp with time zone NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    target_audience text[],
    discount_percentage integer,
    promotion_message text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    created_by uuid,
    CONSTRAINT service_promotions_promotion_type_check CHECK ((promotion_type = ANY (ARRAY['seasonal'::text, 'campaign'::text, 'urgent'::text, 'new'::text])))
);


--
-- Name: service_recommendations_cache; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.service_recommendations_cache (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_identifier text NOT NULL,
    recommended_services jsonb NOT NULL,
    recommendation_score double precision,
    algorithm_version text DEFAULT 'v1'::text NOT NULL,
    expires_at timestamp with time zone NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: services; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.services (
    id uuid DEFAULT extensions.uuid_generate_v4() NOT NULL,
    slug text NOT NULL,
    name text NOT NULL,
    short_description text,
    long_description text,
    icon_name text,
    featured_image text,
    scope_template text,
    publish_state public.publish_state DEFAULT 'draft'::public.publish_state,
    seo_title text,
    seo_description text,
    seo_keywords text[],
    created_by uuid,
    updated_by uuid,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    preview_token text,
    scheduled_publish_at timestamp with time zone,
    category text,
    category_description text,
    category_icon text,
    category_color text,
    service_overview text,
    process_steps jsonb DEFAULT '[]'::jsonb,
    what_we_provide jsonb DEFAULT '[]'::jsonb,
    typical_applications jsonb DEFAULT '[]'::jsonb,
    key_benefits jsonb DEFAULT '[]'::jsonb,
    faq_items jsonb DEFAULT '[]'::jsonb,
    featured boolean DEFAULT false,
    typical_timeline text,
    project_types text[] DEFAULT ARRAY['commercial'::text, 'residential'::text],
    preview_token_expires_at timestamp with time zone,
    preview_token_created_by uuid,
    service_tier text,
    og_image_url text,
    canonical_url text,
    challenge_tags text[] DEFAULT '{}'::text[],
    video_url text,
    thumbnail_url text,
    CONSTRAINT services_long_description_length_check CHECK ((length(long_description) <= 20000)),
    CONSTRAINT services_service_tier_check CHECK ((service_tier = ANY (ARRAY['primary_delivery'::text, 'self_perform'::text, 'PRIME_SPECIALTY'::text, 'TRADE_PACKAGE'::text]))),
    CONSTRAINT services_short_description_length_check CHECK ((length(short_description) <= 500))
);


--
-- Name: site_settings; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.site_settings (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    company_name text DEFAULT 'Ascent Group Construction'::text NOT NULL,
    phone text NOT NULL,
    email text NOT NULL,
    address text,
    business_hours jsonb DEFAULT '{"sunday": "Closed", "weekday": "Mon-Fri: 8AM-6PM", "saturday": "Sat: 9AM-4PM"}'::jsonb,
    social_links jsonb DEFAULT '{"twitter": "", "facebook": "", "linkedin": "", "instagram": ""}'::jsonb,
    certifications text[] DEFAULT ARRAY['Fully Insured & Licensed'::text, 'WSIB Compliant'::text],
    google_analytics_id text,
    meta_title text,
    meta_description text,
    og_image text,
    is_active boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    updated_by uuid,
    admin_quick_actions jsonb DEFAULT '[]'::jsonb,
    robots_txt text,
    service_areas text[] DEFAULT '{}'::text[],
    knows_about text[] DEFAULT '{}'::text[],
    founded_year integer DEFAULT 2009,
    company_tagline text DEFAULT 'Your Complete Construction Partner Across Ontario'::text
);


--
-- Name: sitemap_logs; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.sitemap_logs (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    url_count integer DEFAULT 0,
    status text NOT NULL,
    error_message text,
    created_at timestamp with time zone DEFAULT now()
);


--
-- Name: specialty_pages; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.specialty_pages (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    slug text NOT NULL,
    title text NOT NULL,
    subtitle text,
    content_blocks jsonb DEFAULT '[]'::jsonb NOT NULL,
    meta_title text,
    meta_description text,
    og_image_url text,
    is_active boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    created_by uuid,
    updated_by uuid
);


--
-- Name: stats; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.stats (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    label text NOT NULL,
    value integer NOT NULL,
    suffix text,
    description text,
    icon_name text,
    display_order integer DEFAULT 0,
    is_active boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    created_by uuid,
    updated_by uuid
);


--
-- Name: testimonials; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.testimonials (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    quote text NOT NULL,
    author_name text NOT NULL,
    author_position text,
    company_name text,
    project_name text,
    rating numeric DEFAULT 5.0,
    date_published date DEFAULT CURRENT_DATE,
    is_featured boolean DEFAULT false,
    display_order integer DEFAULT 0,
    publish_state public.publish_state DEFAULT 'published'::public.publish_state,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    created_by uuid,
    updated_by uuid,
    CONSTRAINT testimonials_rating_check CHECK (((rating >= (0)::numeric) AND (rating <= (5)::numeric)))
);


--
-- Name: user_roles; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.user_roles (
    id uuid DEFAULT extensions.uuid_generate_v4() NOT NULL,
    user_id uuid NOT NULL,
    role public.app_role NOT NULL,
    created_at timestamp with time zone DEFAULT now()
);


--
-- Name: user_service_preferences; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.user_service_preferences (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_identifier text NOT NULL,
    service_link text NOT NULL,
    interaction_count integer DEFAULT 1 NOT NULL,
    last_viewed_at timestamp with time zone DEFAULT now() NOT NULL,
    time_spent_seconds integer DEFAULT 0,
    clicked_from_popular boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: value_pillars; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.value_pillars (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    title text NOT NULL,
    description text NOT NULL,
    icon_name text,
    display_order integer NOT NULL,
    is_active boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    created_by uuid,
    updated_by uuid
);


--
-- Name: why_choose_us_items; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.why_choose_us_items (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    title text NOT NULL,
    description text NOT NULL,
    stats_badge text,
    icon_name text,
    display_order integer DEFAULT 0,
    is_active boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    created_by uuid,
    updated_by uuid
);


--
-- Name: ab_test_assignments ab_test_assignments_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ab_test_assignments
    ADD CONSTRAINT ab_test_assignments_pkey PRIMARY KEY (id);


--
-- Name: ab_test_assignments ab_test_assignments_test_name_user_identifier_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ab_test_assignments
    ADD CONSTRAINT ab_test_assignments_test_name_user_identifier_key UNIQUE (test_name, user_identifier);


--
-- Name: ab_tests ab_tests_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ab_tests
    ADD CONSTRAINT ab_tests_pkey PRIMARY KEY (id);


--
-- Name: ab_tests ab_tests_test_name_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ab_tests
    ADD CONSTRAINT ab_tests_test_name_key UNIQUE (test_name);


--
-- Name: about_page_settings about_page_settings_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.about_page_settings
    ADD CONSTRAINT about_page_settings_pkey PRIMARY KEY (id);


--
-- Name: admin_notifications admin_notifications_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.admin_notifications
    ADD CONSTRAINT admin_notifications_pkey PRIMARY KEY (id);


--
-- Name: analytics_snapshots analytics_snapshots_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.analytics_snapshots
    ADD CONSTRAINT analytics_snapshots_pkey PRIMARY KEY (id);


--
-- Name: audit_log audit_log_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.audit_log
    ADD CONSTRAINT audit_log_pkey PRIMARY KEY (id);


--
-- Name: auth_failed_attempts auth_failed_attempts_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.auth_failed_attempts
    ADD CONSTRAINT auth_failed_attempts_pkey PRIMARY KEY (id);


--
-- Name: blog_posts blog_posts_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.blog_posts
    ADD CONSTRAINT blog_posts_pkey PRIMARY KEY (id);


--
-- Name: blog_posts blog_posts_preview_token_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.blog_posts
    ADD CONSTRAINT blog_posts_preview_token_key UNIQUE (preview_token);


--
-- Name: blog_posts blog_posts_slug_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.blog_posts
    ADD CONSTRAINT blog_posts_slug_key UNIQUE (slug);


--
-- Name: certifications certifications_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.certifications
    ADD CONSTRAINT certifications_pkey PRIMARY KEY (id);


--
-- Name: company_overview_items company_overview_items_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.company_overview_items
    ADD CONSTRAINT company_overview_items_pkey PRIMARY KEY (id);


--
-- Name: company_overview_sections company_overview_sections_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.company_overview_sections
    ADD CONSTRAINT company_overview_sections_pkey PRIMARY KEY (id);


--
-- Name: contact_page_settings contact_page_settings_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.contact_page_settings
    ADD CONSTRAINT contact_page_settings_pkey PRIMARY KEY (id);


--
-- Name: contact_submissions contact_submissions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.contact_submissions
    ADD CONSTRAINT contact_submissions_pkey PRIMARY KEY (id);


--
-- Name: content_review_comments content_review_comments_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.content_review_comments
    ADD CONSTRAINT content_review_comments_pkey PRIMARY KEY (id);


--
-- Name: content_versions content_versions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.content_versions
    ADD CONSTRAINT content_versions_pkey PRIMARY KEY (id);


--
-- Name: document_access_log document_access_log_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.document_access_log
    ADD CONSTRAINT document_access_log_pkey PRIMARY KEY (id);


--
-- Name: documents_library documents_library_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.documents_library
    ADD CONSTRAINT documents_library_pkey PRIMARY KEY (id);


--
-- Name: email_templates email_templates_name_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.email_templates
    ADD CONSTRAINT email_templates_name_key UNIQUE (name);


--
-- Name: email_templates email_templates_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.email_templates
    ADD CONSTRAINT email_templates_pkey PRIMARY KEY (id);


--
-- Name: error_logs error_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.error_logs
    ADD CONSTRAINT error_logs_pkey PRIMARY KEY (id);


--
-- Name: featured_services featured_services_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.featured_services
    ADD CONSTRAINT featured_services_pkey PRIMARY KEY (id);


--
-- Name: footer_settings footer_settings_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.footer_settings
    ADD CONSTRAINT footer_settings_pkey PRIMARY KEY (id);


--
-- Name: google_auth_tokens google_auth_tokens_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.google_auth_tokens
    ADD CONSTRAINT google_auth_tokens_pkey PRIMARY KEY (id);


--
-- Name: hero_slides hero_slides_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.hero_slides
    ADD CONSTRAINT hero_slides_pkey PRIMARY KEY (id);


--
-- Name: homepage_settings homepage_settings_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.homepage_settings
    ADD CONSTRAINT homepage_settings_pkey PRIMARY KEY (id);


--
-- Name: navigation_menu_items navigation_menu_items_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.navigation_menu_items
    ADD CONSTRAINT navigation_menu_items_pkey PRIMARY KEY (id);


--
-- Name: newsletter_subscribers newsletter_subscribers_email_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.newsletter_subscribers
    ADD CONSTRAINT newsletter_subscribers_email_key UNIQUE (email);


--
-- Name: newsletter_subscribers newsletter_subscribers_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.newsletter_subscribers
    ADD CONSTRAINT newsletter_subscribers_pkey PRIMARY KEY (id);


--
-- Name: newsletter_subscribers newsletter_subscribers_unsubscribe_token_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.newsletter_subscribers
    ADD CONSTRAINT newsletter_subscribers_unsubscribe_token_key UNIQUE (unsubscribe_token);


--
-- Name: notifications notifications_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_pkey PRIMARY KEY (id);


--
-- Name: optimization_recommendations optimization_recommendations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.optimization_recommendations
    ADD CONSTRAINT optimization_recommendations_pkey PRIMARY KEY (id);


--
-- Name: performance_metrics performance_metrics_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.performance_metrics
    ADD CONSTRAINT performance_metrics_pkey PRIMARY KEY (id);


--
-- Name: popular_services_analytics popular_services_analytics_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.popular_services_analytics
    ADD CONSTRAINT popular_services_analytics_pkey PRIMARY KEY (id);


--
-- Name: prequalification_downloads prequalification_downloads_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.prequalification_downloads
    ADD CONSTRAINT prequalification_downloads_pkey PRIMARY KEY (id);


--
-- Name: profiles profiles_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.profiles
    ADD CONSTRAINT profiles_pkey PRIMARY KEY (id);


--
-- Name: project_images project_images_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.project_images
    ADD CONSTRAINT project_images_pkey PRIMARY KEY (id);


--
-- Name: project_services project_services_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.project_services
    ADD CONSTRAINT project_services_pkey PRIMARY KEY (id);


--
-- Name: project_services project_services_project_id_service_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.project_services
    ADD CONSTRAINT project_services_project_id_service_id_key UNIQUE (project_id, service_id);


--
-- Name: projects projects_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.projects
    ADD CONSTRAINT projects_pkey PRIMARY KEY (id);


--
-- Name: projects projects_preview_token_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.projects
    ADD CONSTRAINT projects_preview_token_key UNIQUE (preview_token);


--
-- Name: projects projects_slug_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.projects
    ADD CONSTRAINT projects_slug_key UNIQUE (slug);


--
-- Name: quote_requests quote_requests_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.quote_requests
    ADD CONSTRAINT quote_requests_pkey PRIMARY KEY (id);


--
-- Name: redirects redirects_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.redirects
    ADD CONSTRAINT redirects_pkey PRIMARY KEY (id);


--
-- Name: redirects redirects_source_path_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.redirects
    ADD CONSTRAINT redirects_source_path_key UNIQUE (source_path);


--
-- Name: review_requests review_requests_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.review_requests
    ADD CONSTRAINT review_requests_pkey PRIMARY KEY (id);


--
-- Name: rfp_submissions rfp_submissions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.rfp_submissions
    ADD CONSTRAINT rfp_submissions_pkey PRIMARY KEY (id);


--
-- Name: search_analytics search_analytics_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.search_analytics
    ADD CONSTRAINT search_analytics_pkey PRIMARY KEY (id);


--
-- Name: search_console_data search_console_data_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.search_console_data
    ADD CONSTRAINT search_console_data_pkey PRIMARY KEY (id);


--
-- Name: search_console_data search_console_data_unique_record; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.search_console_data
    ADD CONSTRAINT search_console_data_unique_record UNIQUE (user_id, site_url, page_path, query, date);


--
-- Name: security_settings security_settings_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.security_settings
    ADD CONSTRAINT security_settings_pkey PRIMARY KEY (id);


--
-- Name: service_promotions service_promotions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.service_promotions
    ADD CONSTRAINT service_promotions_pkey PRIMARY KEY (id);


--
-- Name: service_recommendations_cache service_recommendations_cache_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.service_recommendations_cache
    ADD CONSTRAINT service_recommendations_cache_pkey PRIMARY KEY (id);


--
-- Name: service_recommendations_cache service_recommendations_cache_user_identifier_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.service_recommendations_cache
    ADD CONSTRAINT service_recommendations_cache_user_identifier_key UNIQUE (user_identifier);


--
-- Name: services services_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.services
    ADD CONSTRAINT services_pkey PRIMARY KEY (id);


--
-- Name: services services_preview_token_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.services
    ADD CONSTRAINT services_preview_token_key UNIQUE (preview_token);


--
-- Name: services services_slug_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.services
    ADD CONSTRAINT services_slug_key UNIQUE (slug);


--
-- Name: site_settings site_settings_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.site_settings
    ADD CONSTRAINT site_settings_pkey PRIMARY KEY (id);


--
-- Name: sitemap_logs sitemap_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sitemap_logs
    ADD CONSTRAINT sitemap_logs_pkey PRIMARY KEY (id);


--
-- Name: specialty_pages specialty_pages_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.specialty_pages
    ADD CONSTRAINT specialty_pages_pkey PRIMARY KEY (id);


--
-- Name: specialty_pages specialty_pages_slug_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.specialty_pages
    ADD CONSTRAINT specialty_pages_slug_key UNIQUE (slug);


--
-- Name: stats stats_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.stats
    ADD CONSTRAINT stats_pkey PRIMARY KEY (id);


--
-- Name: testimonials testimonials_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.testimonials
    ADD CONSTRAINT testimonials_pkey PRIMARY KEY (id);


--
-- Name: google_auth_tokens unique_user_token; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.google_auth_tokens
    ADD CONSTRAINT unique_user_token UNIQUE (user_id);


--
-- Name: user_roles user_roles_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT user_roles_pkey PRIMARY KEY (id);


--
-- Name: user_roles user_roles_user_id_role_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT user_roles_user_id_role_key UNIQUE (user_id, role);


--
-- Name: user_service_preferences user_service_preferences_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_service_preferences
    ADD CONSTRAINT user_service_preferences_pkey PRIMARY KEY (id);


--
-- Name: user_service_preferences user_service_preferences_user_identifier_service_link_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_service_preferences
    ADD CONSTRAINT user_service_preferences_user_identifier_service_link_key UNIQUE (user_identifier, service_link);


--
-- Name: value_pillars value_pillars_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.value_pillars
    ADD CONSTRAINT value_pillars_pkey PRIMARY KEY (id);


--
-- Name: why_choose_us_items why_choose_us_items_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.why_choose_us_items
    ADD CONSTRAINT why_choose_us_items_pkey PRIMARY KEY (id);


--
-- Name: idx_admin_notifications_created_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_admin_notifications_created_at ON public.admin_notifications USING btree (created_at DESC);


--
-- Name: idx_admin_notifications_is_read; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_admin_notifications_is_read ON public.admin_notifications USING btree (is_read);


--
-- Name: idx_admin_notifications_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_admin_notifications_user_id ON public.admin_notifications USING btree (user_id);


--
-- Name: idx_auth_failed_attempts_identifier; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_auth_failed_attempts_identifier ON public.auth_failed_attempts USING btree (user_identifier);


--
-- Name: idx_auth_failed_attempts_time; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_auth_failed_attempts_time ON public.auth_failed_attempts USING btree (attempt_time);


--
-- Name: idx_blog_posts_category; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_blog_posts_category ON public.blog_posts USING btree (category);


--
-- Name: idx_blog_posts_content_type; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_blog_posts_content_type ON public.blog_posts USING btree (content_type);


--
-- Name: idx_blog_posts_pinned; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_blog_posts_pinned ON public.blog_posts USING btree (is_pinned, published_at DESC);


--
-- Name: idx_blog_posts_sector; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_blog_posts_sector ON public.blog_posts USING btree (sector);


--
-- Name: idx_blog_posts_slug; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX idx_blog_posts_slug ON public.blog_posts USING btree (lower(slug));


--
-- Name: idx_blog_posts_source; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_blog_posts_source ON public.blog_posts USING btree (source) WHERE (source IS NOT NULL);


--
-- Name: idx_company_overview_items_section; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_company_overview_items_section ON public.company_overview_items USING btree (section_id, display_order);


--
-- Name: idx_company_overview_sections_type; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_company_overview_sections_type ON public.company_overview_sections USING btree (section_type);


--
-- Name: idx_error_logs_created_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_error_logs_created_at ON public.error_logs USING btree (created_at DESC);


--
-- Name: idx_error_logs_date; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_error_logs_date ON public.error_logs USING btree (created_at DESC);


--
-- Name: idx_error_logs_message; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_error_logs_message ON public.error_logs USING btree (message);


--
-- Name: idx_featured_services_active; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_featured_services_active ON public.featured_services USING btree (is_active, display_order);


--
-- Name: idx_hero_slides_active; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_hero_slides_active ON public.hero_slides USING btree (is_active);


--
-- Name: idx_hero_slides_display_order; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_hero_slides_display_order ON public.hero_slides USING btree (display_order);


--
-- Name: idx_navigation_menu_items_active; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_navigation_menu_items_active ON public.navigation_menu_items USING btree (is_active, display_order);


--
-- Name: idx_navigation_menu_items_parent; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_navigation_menu_items_parent ON public.navigation_menu_items USING btree (parent_id);


--
-- Name: idx_navigation_menu_items_type; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_navigation_menu_items_type ON public.navigation_menu_items USING btree (menu_type, display_order);


--
-- Name: idx_newsletter_unsubscribe_token; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_newsletter_unsubscribe_token ON public.newsletter_subscribers USING btree (unsubscribe_token) WHERE (unsubscribe_token IS NOT NULL);


--
-- Name: idx_notifications_user; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_notifications_user ON public.notifications USING btree (user_id, read, created_at DESC);


--
-- Name: idx_performance_date; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_performance_date ON public.performance_metrics USING btree (recorded_at DESC);


--
-- Name: idx_performance_metrics_date; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_performance_metrics_date ON public.performance_metrics USING btree (recorded_at DESC);


--
-- Name: idx_performance_type; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_performance_type ON public.performance_metrics USING btree (metric_type);


--
-- Name: idx_popular_services_analytics_created; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_popular_services_analytics_created ON public.popular_services_analytics USING btree (created_at DESC);


--
-- Name: idx_popular_services_analytics_service; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_popular_services_analytics_service ON public.popular_services_analytics USING btree (service_link, event_type, created_at);


--
-- Name: idx_project_images_category; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_project_images_category ON public.project_images USING btree (category);


--
-- Name: idx_project_images_featured; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_project_images_featured ON public.project_images USING btree (featured);


--
-- Name: idx_project_images_order; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_project_images_order ON public.project_images USING btree (display_order);


--
-- Name: idx_project_images_project_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_project_images_project_id ON public.project_images USING btree (project_id);


--
-- Name: idx_projects_slug; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX idx_projects_slug ON public.projects USING btree (lower(slug));


--
-- Name: idx_recommendations_cache_user; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_recommendations_cache_user ON public.service_recommendations_cache USING btree (user_identifier, expires_at);


--
-- Name: idx_search_analytics_query; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_search_analytics_query ON public.search_analytics USING btree (search_query);


--
-- Name: idx_search_analytics_searched_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_search_analytics_searched_at ON public.search_analytics USING btree (searched_at DESC);


--
-- Name: idx_search_analytics_session; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_search_analytics_session ON public.search_analytics USING btree (user_session_id);


--
-- Name: idx_search_console_data_date; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_search_console_data_date ON public.search_console_data USING btree (date);


--
-- Name: idx_search_console_data_lookup; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_search_console_data_lookup ON public.search_console_data USING btree (user_id, site_url, date DESC);


--
-- Name: idx_search_console_data_pages; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_search_console_data_pages ON public.search_console_data USING btree (user_id, site_url, page_path, date DESC);


--
-- Name: idx_search_console_data_queries; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_search_console_data_queries ON public.search_console_data USING btree (user_id, site_url, query, date DESC);


--
-- Name: idx_search_console_data_site_url; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_search_console_data_site_url ON public.search_console_data USING btree (site_url);


--
-- Name: idx_search_console_data_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_search_console_data_user_id ON public.search_console_data USING btree (user_id);


--
-- Name: idx_service_promotions_active_dates; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_service_promotions_active_dates ON public.service_promotions USING btree (is_active, start_date, end_date);


--
-- Name: idx_services_slug; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX idx_services_slug ON public.services USING btree (lower(slug));


--
-- Name: idx_services_tier; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_services_tier ON public.services USING btree (service_tier) WHERE (publish_state = 'published'::public.publish_state);


--
-- Name: idx_user_service_preferences_user; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_user_service_preferences_user ON public.user_service_preferences USING btree (user_identifier, last_viewed_at DESC);


--
-- Name: idx_versions_entity; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_versions_entity ON public.content_versions USING btree (entity_type, entity_id, version_number DESC);


--
-- Name: idx_why_choose_us_items_active_order; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_why_choose_us_items_active_order ON public.why_choose_us_items USING btree (is_active, display_order);


--
-- Name: uniq_about_page_settings_active; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX uniq_about_page_settings_active ON public.about_page_settings USING btree ((true)) WHERE (is_active = true);


--
-- Name: uniq_contact_page_settings_active; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX uniq_contact_page_settings_active ON public.contact_page_settings USING btree ((true)) WHERE (is_active = true);


--
-- Name: uniq_footer_settings_active; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX uniq_footer_settings_active ON public.footer_settings USING btree ((true)) WHERE (is_active = true);


--
-- Name: uniq_homepage_settings_active; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX uniq_homepage_settings_active ON public.homepage_settings USING btree ((true)) WHERE (is_active = true);


--
-- Name: uniq_site_settings_active; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX uniq_site_settings_active ON public.site_settings USING btree ((true)) WHERE (is_active = true);


--
-- Name: profiles audit_profiles; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER audit_profiles AFTER INSERT OR DELETE OR UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.log_sensitive_access();


--
-- Name: user_roles audit_user_roles; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER audit_user_roles AFTER INSERT OR DELETE OR UPDATE ON public.user_roles FOR EACH ROW EXECUTE FUNCTION public.log_sensitive_access();


--
-- Name: quote_requests calculate_lead_score_trigger; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER calculate_lead_score_trigger BEFORE INSERT OR UPDATE ON public.quote_requests FOR EACH ROW EXECUTE FUNCTION public.set_lead_score_and_priority();


--
-- Name: blog_posts normalize_blog_posts_slug; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER normalize_blog_posts_slug BEFORE INSERT OR UPDATE ON public.blog_posts FOR EACH ROW EXECUTE FUNCTION public.normalize_slug();


--
-- Name: projects normalize_projects_slug; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER normalize_projects_slug BEFORE INSERT OR UPDATE ON public.projects FOR EACH ROW EXECUTE FUNCTION public.normalize_slug();


--
-- Name: services normalize_services_slug; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER normalize_services_slug BEFORE INSERT OR UPDATE ON public.services FOR EACH ROW EXECUTE FUNCTION public.normalize_slug();


--
-- Name: newsletter_subscribers set_newsletter_unsubscribe_token; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER set_newsletter_unsubscribe_token BEFORE INSERT ON public.newsletter_subscribers FOR EACH ROW EXECUTE FUNCTION public.generate_unsubscribe_token();


--
-- Name: blog_posts set_preview_token_expiry; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER set_preview_token_expiry BEFORE INSERT OR UPDATE OF preview_token ON public.blog_posts FOR EACH ROW EXECUTE FUNCTION public.generate_preview_token_with_expiry();


--
-- Name: projects set_preview_token_expiry; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER set_preview_token_expiry BEFORE INSERT OR UPDATE OF preview_token ON public.projects FOR EACH ROW EXECUTE FUNCTION public.generate_preview_token_with_expiry();


--
-- Name: services set_preview_token_expiry; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER set_preview_token_expiry BEFORE INSERT OR UPDATE OF preview_token ON public.services FOR EACH ROW EXECUTE FUNCTION public.generate_preview_token_with_expiry();


--
-- Name: blog_posts trigger_blog_posts_version; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trigger_blog_posts_version AFTER UPDATE ON public.blog_posts FOR EACH ROW EXECUTE FUNCTION public.auto_save_version();


--
-- Name: contact_submissions trigger_notify_new_contact; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trigger_notify_new_contact AFTER INSERT ON public.contact_submissions FOR EACH ROW EXECUTE FUNCTION public.notify_new_contact();


--
-- Name: prequalification_downloads trigger_notify_new_prequal; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trigger_notify_new_prequal AFTER INSERT ON public.prequalification_downloads FOR EACH ROW EXECUTE FUNCTION public.notify_new_prequal();


--
-- Name: quote_requests trigger_notify_new_quote; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trigger_notify_new_quote AFTER INSERT ON public.quote_requests FOR EACH ROW EXECUTE FUNCTION public.notify_new_quote();


--
-- Name: rfp_submissions trigger_notify_new_rfp; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trigger_notify_new_rfp AFTER INSERT ON public.rfp_submissions FOR EACH ROW EXECUTE FUNCTION public.notify_new_rfp();


--
-- Name: projects trigger_projects_version; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trigger_projects_version AFTER UPDATE ON public.projects FOR EACH ROW EXECUTE FUNCTION public.auto_save_version();


--
-- Name: ab_tests update_ab_tests_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_ab_tests_updated_at BEFORE UPDATE ON public.ab_tests FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: about_page_settings update_about_page_settings_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_about_page_settings_updated_at BEFORE UPDATE ON public.about_page_settings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: blog_posts update_blog_posts_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_blog_posts_updated_at BEFORE UPDATE ON public.blog_posts FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: certifications update_certifications_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_certifications_updated_at BEFORE UPDATE ON public.certifications FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: company_overview_items update_company_overview_items_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_company_overview_items_updated_at BEFORE UPDATE ON public.company_overview_items FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: company_overview_sections update_company_overview_sections_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_company_overview_sections_updated_at BEFORE UPDATE ON public.company_overview_sections FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: contact_page_settings update_contact_page_settings_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_contact_page_settings_updated_at BEFORE UPDATE ON public.contact_page_settings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: documents_library update_documents_library_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_documents_library_updated_at BEFORE UPDATE ON public.documents_library FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: email_templates update_email_templates_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_email_templates_updated_at BEFORE UPDATE ON public.email_templates FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: featured_services update_featured_services_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_featured_services_updated_at BEFORE UPDATE ON public.featured_services FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: footer_settings update_footer_settings_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_footer_settings_updated_at BEFORE UPDATE ON public.footer_settings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: google_auth_tokens update_google_auth_tokens_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_google_auth_tokens_updated_at BEFORE UPDATE ON public.google_auth_tokens FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: hero_slides update_hero_slides_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_hero_slides_updated_at BEFORE UPDATE ON public.hero_slides FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: homepage_settings update_homepage_settings_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_homepage_settings_updated_at BEFORE UPDATE ON public.homepage_settings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: navigation_menu_items update_navigation_menu_items_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_navigation_menu_items_updated_at BEFORE UPDATE ON public.navigation_menu_items FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: newsletter_subscribers update_newsletter_subscribers_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_newsletter_subscribers_updated_at BEFORE UPDATE ON public.newsletter_subscribers FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: profiles update_profiles_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: project_images update_project_images_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_project_images_updated_at BEFORE UPDATE ON public.project_images FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: projects update_projects_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON public.projects FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: redirects update_redirects_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_redirects_updated_at BEFORE UPDATE ON public.redirects FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: review_requests update_review_requests_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_review_requests_updated_at BEFORE UPDATE ON public.review_requests FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: search_console_data update_search_console_data_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_search_console_data_updated_at BEFORE UPDATE ON public.search_console_data FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: security_settings update_security_settings_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_security_settings_updated_at BEFORE UPDATE ON public.security_settings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: service_promotions update_service_promotions_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_service_promotions_updated_at BEFORE UPDATE ON public.service_promotions FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: services update_services_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_services_updated_at BEFORE UPDATE ON public.services FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: site_settings update_site_settings_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_site_settings_updated_at BEFORE UPDATE ON public.site_settings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: specialty_pages update_specialty_pages_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_specialty_pages_updated_at BEFORE UPDATE ON public.specialty_pages FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: stats update_stats_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_stats_updated_at BEFORE UPDATE ON public.stats FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: testimonials update_testimonials_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_testimonials_updated_at BEFORE UPDATE ON public.testimonials FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: user_service_preferences update_user_service_preferences_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_user_service_preferences_updated_at BEFORE UPDATE ON public.user_service_preferences FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: why_choose_us_items update_why_choose_us_items_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_why_choose_us_items_updated_at BEFORE UPDATE ON public.why_choose_us_items FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: about_page_settings about_page_settings_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.about_page_settings
    ADD CONSTRAINT about_page_settings_created_by_fkey FOREIGN KEY (created_by) REFERENCES auth.users(id);


--
-- Name: about_page_settings about_page_settings_updated_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.about_page_settings
    ADD CONSTRAINT about_page_settings_updated_by_fkey FOREIGN KEY (updated_by) REFERENCES auth.users(id);


--
-- Name: admin_notifications admin_notifications_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.admin_notifications
    ADD CONSTRAINT admin_notifications_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;


--
-- Name: audit_log audit_log_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.audit_log
    ADD CONSTRAINT audit_log_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id);


--
-- Name: blog_posts blog_posts_author_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.blog_posts
    ADD CONSTRAINT blog_posts_author_id_fkey FOREIGN KEY (author_id) REFERENCES public.profiles(id);


--
-- Name: blog_posts blog_posts_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.blog_posts
    ADD CONSTRAINT blog_posts_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.profiles(id);


--
-- Name: blog_posts blog_posts_preview_token_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.blog_posts
    ADD CONSTRAINT blog_posts_preview_token_created_by_fkey FOREIGN KEY (preview_token_created_by) REFERENCES auth.users(id);


--
-- Name: blog_posts blog_posts_updated_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.blog_posts
    ADD CONSTRAINT blog_posts_updated_by_fkey FOREIGN KEY (updated_by) REFERENCES public.profiles(id);


--
-- Name: company_overview_items company_overview_items_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.company_overview_items
    ADD CONSTRAINT company_overview_items_created_by_fkey FOREIGN KEY (created_by) REFERENCES auth.users(id);


--
-- Name: company_overview_items company_overview_items_section_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.company_overview_items
    ADD CONSTRAINT company_overview_items_section_id_fkey FOREIGN KEY (section_id) REFERENCES public.company_overview_sections(id) ON DELETE CASCADE;


--
-- Name: company_overview_items company_overview_items_updated_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.company_overview_items
    ADD CONSTRAINT company_overview_items_updated_by_fkey FOREIGN KEY (updated_by) REFERENCES auth.users(id);


--
-- Name: company_overview_sections company_overview_sections_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.company_overview_sections
    ADD CONSTRAINT company_overview_sections_created_by_fkey FOREIGN KEY (created_by) REFERENCES auth.users(id);


--
-- Name: company_overview_sections company_overview_sections_updated_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.company_overview_sections
    ADD CONSTRAINT company_overview_sections_updated_by_fkey FOREIGN KEY (updated_by) REFERENCES auth.users(id);


--
-- Name: contact_page_settings contact_page_settings_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.contact_page_settings
    ADD CONSTRAINT contact_page_settings_created_by_fkey FOREIGN KEY (created_by) REFERENCES auth.users(id);


--
-- Name: contact_page_settings contact_page_settings_updated_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.contact_page_settings
    ADD CONSTRAINT contact_page_settings_updated_by_fkey FOREIGN KEY (updated_by) REFERENCES auth.users(id);


--
-- Name: content_versions content_versions_changed_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.content_versions
    ADD CONSTRAINT content_versions_changed_by_fkey FOREIGN KEY (changed_by) REFERENCES auth.users(id);


--
-- Name: document_access_log document_access_log_document_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.document_access_log
    ADD CONSTRAINT document_access_log_document_id_fkey FOREIGN KEY (document_id) REFERENCES public.documents_library(id) ON DELETE CASCADE;


--
-- Name: documents_library documents_library_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.documents_library
    ADD CONSTRAINT documents_library_created_by_fkey FOREIGN KEY (created_by) REFERENCES auth.users(id);


--
-- Name: documents_library documents_library_updated_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.documents_library
    ADD CONSTRAINT documents_library_updated_by_fkey FOREIGN KEY (updated_by) REFERENCES auth.users(id);


--
-- Name: featured_services featured_services_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.featured_services
    ADD CONSTRAINT featured_services_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.profiles(id);


--
-- Name: featured_services featured_services_updated_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.featured_services
    ADD CONSTRAINT featured_services_updated_by_fkey FOREIGN KEY (updated_by) REFERENCES public.profiles(id);


--
-- Name: footer_settings footer_settings_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.footer_settings
    ADD CONSTRAINT footer_settings_created_by_fkey FOREIGN KEY (created_by) REFERENCES auth.users(id);


--
-- Name: footer_settings footer_settings_updated_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.footer_settings
    ADD CONSTRAINT footer_settings_updated_by_fkey FOREIGN KEY (updated_by) REFERENCES auth.users(id);


--
-- Name: hero_slides hero_slides_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.hero_slides
    ADD CONSTRAINT hero_slides_created_by_fkey FOREIGN KEY (created_by) REFERENCES auth.users(id);


--
-- Name: hero_slides hero_slides_updated_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.hero_slides
    ADD CONSTRAINT hero_slides_updated_by_fkey FOREIGN KEY (updated_by) REFERENCES auth.users(id);


--
-- Name: navigation_menu_items navigation_menu_items_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.navigation_menu_items
    ADD CONSTRAINT navigation_menu_items_created_by_fkey FOREIGN KEY (created_by) REFERENCES auth.users(id);


--
-- Name: navigation_menu_items navigation_menu_items_parent_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.navigation_menu_items
    ADD CONSTRAINT navigation_menu_items_parent_id_fkey FOREIGN KEY (parent_id) REFERENCES public.navigation_menu_items(id) ON DELETE CASCADE;


--
-- Name: navigation_menu_items navigation_menu_items_updated_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.navigation_menu_items
    ADD CONSTRAINT navigation_menu_items_updated_by_fkey FOREIGN KEY (updated_by) REFERENCES auth.users(id);


--
-- Name: notifications notifications_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id);


--
-- Name: optimization_recommendations optimization_recommendations_resolved_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.optimization_recommendations
    ADD CONSTRAINT optimization_recommendations_resolved_by_fkey FOREIGN KEY (resolved_by) REFERENCES auth.users(id);


--
-- Name: profiles profiles_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.profiles
    ADD CONSTRAINT profiles_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: project_images project_images_project_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.project_images
    ADD CONSTRAINT project_images_project_id_fkey FOREIGN KEY (project_id) REFERENCES public.projects(id) ON DELETE CASCADE;


--
-- Name: project_services project_services_project_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.project_services
    ADD CONSTRAINT project_services_project_id_fkey FOREIGN KEY (project_id) REFERENCES public.projects(id) ON DELETE CASCADE;


--
-- Name: project_services project_services_service_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.project_services
    ADD CONSTRAINT project_services_service_id_fkey FOREIGN KEY (service_id) REFERENCES public.services(id) ON DELETE CASCADE;


--
-- Name: projects projects_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.projects
    ADD CONSTRAINT projects_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.profiles(id);


--
-- Name: projects projects_preview_token_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.projects
    ADD CONSTRAINT projects_preview_token_created_by_fkey FOREIGN KEY (preview_token_created_by) REFERENCES auth.users(id);


--
-- Name: projects projects_updated_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.projects
    ADD CONSTRAINT projects_updated_by_fkey FOREIGN KEY (updated_by) REFERENCES public.profiles(id);


--
-- Name: quote_requests quote_requests_assigned_to_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.quote_requests
    ADD CONSTRAINT quote_requests_assigned_to_fkey FOREIGN KEY (assigned_to) REFERENCES public.profiles(id);


--
-- Name: review_requests review_requests_project_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.review_requests
    ADD CONSTRAINT review_requests_project_id_fkey FOREIGN KEY (project_id) REFERENCES public.projects(id) ON DELETE SET NULL;


--
-- Name: security_settings security_settings_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.security_settings
    ADD CONSTRAINT security_settings_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.profiles(id);


--
-- Name: security_settings security_settings_updated_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.security_settings
    ADD CONSTRAINT security_settings_updated_by_fkey FOREIGN KEY (updated_by) REFERENCES public.profiles(id);


--
-- Name: service_promotions service_promotions_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.service_promotions
    ADD CONSTRAINT service_promotions_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.profiles(id);


--
-- Name: services services_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.services
    ADD CONSTRAINT services_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.profiles(id);


--
-- Name: services services_preview_token_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.services
    ADD CONSTRAINT services_preview_token_created_by_fkey FOREIGN KEY (preview_token_created_by) REFERENCES auth.users(id);


--
-- Name: services services_updated_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.services
    ADD CONSTRAINT services_updated_by_fkey FOREIGN KEY (updated_by) REFERENCES public.profiles(id);


--
-- Name: site_settings site_settings_updated_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.site_settings
    ADD CONSTRAINT site_settings_updated_by_fkey FOREIGN KEY (updated_by) REFERENCES auth.users(id);


--
-- Name: specialty_pages specialty_pages_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.specialty_pages
    ADD CONSTRAINT specialty_pages_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.profiles(id);


--
-- Name: specialty_pages specialty_pages_updated_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.specialty_pages
    ADD CONSTRAINT specialty_pages_updated_by_fkey FOREIGN KEY (updated_by) REFERENCES public.profiles(id);


--
-- Name: stats stats_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.stats
    ADD CONSTRAINT stats_created_by_fkey FOREIGN KEY (created_by) REFERENCES auth.users(id);


--
-- Name: stats stats_updated_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.stats
    ADD CONSTRAINT stats_updated_by_fkey FOREIGN KEY (updated_by) REFERENCES auth.users(id);


--
-- Name: testimonials testimonials_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.testimonials
    ADD CONSTRAINT testimonials_created_by_fkey FOREIGN KEY (created_by) REFERENCES auth.users(id);


--
-- Name: testimonials testimonials_updated_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.testimonials
    ADD CONSTRAINT testimonials_updated_by_fkey FOREIGN KEY (updated_by) REFERENCES auth.users(id);


--
-- Name: user_roles user_roles_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT user_roles_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;


--
-- Name: value_pillars value_pillars_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.value_pillars
    ADD CONSTRAINT value_pillars_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.profiles(id);


--
-- Name: value_pillars value_pillars_updated_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.value_pillars
    ADD CONSTRAINT value_pillars_updated_by_fkey FOREIGN KEY (updated_by) REFERENCES public.profiles(id);


--
-- Name: why_choose_us_items why_choose_us_items_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.why_choose_us_items
    ADD CONSTRAINT why_choose_us_items_created_by_fkey FOREIGN KEY (created_by) REFERENCES auth.users(id);


--
-- Name: why_choose_us_items why_choose_us_items_updated_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.why_choose_us_items
    ADD CONSTRAINT why_choose_us_items_updated_by_fkey FOREIGN KEY (updated_by) REFERENCES auth.users(id);


--
-- Name: documents_library Active authenticated documents viewable by logged in users; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Active authenticated documents viewable by logged in users" ON public.documents_library FOR SELECT USING (((is_active = true) AND (requires_authentication = true) AND (auth.uid() IS NOT NULL)));


--
-- Name: certifications Active certifications viewable by everyone; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Active certifications viewable by everyone" ON public.certifications FOR SELECT USING ((is_active = true));


--
-- Name: hero_slides Active hero slides viewable by everyone; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Active hero slides viewable by everyone" ON public.hero_slides FOR SELECT USING ((is_active = true));


--
-- Name: why_choose_us_items Active items viewable by everyone; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Active items viewable by everyone" ON public.why_choose_us_items FOR SELECT USING ((is_active = true));


--
-- Name: navigation_menu_items Active navigation items viewable by everyone; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Active navigation items viewable by everyone" ON public.navigation_menu_items FOR SELECT USING ((is_active = true));


--
-- Name: company_overview_items Active overview items viewable by everyone; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Active overview items viewable by everyone" ON public.company_overview_items FOR SELECT USING ((is_active = true));


--
-- Name: service_promotions Active promotions are viewable by everyone; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Active promotions are viewable by everyone" ON public.service_promotions FOR SELECT USING (((is_active = true) AND ((now() >= start_date) AND (now() <= end_date))));


--
-- Name: documents_library Active public documents viewable by everyone; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Active public documents viewable by everyone" ON public.documents_library FOR SELECT USING (((is_active = true) AND (requires_authentication = false)));


--
-- Name: company_overview_sections Active sections viewable by everyone; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Active sections viewable by everyone" ON public.company_overview_sections FOR SELECT USING ((is_active = true));


--
-- Name: security_settings Active security settings viewable by admins; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Active security settings viewable by admins" ON public.security_settings FOR SELECT USING (((is_active = true) AND public.is_admin(auth.uid())));


--
-- Name: stats Active stats viewable by everyone; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Active stats viewable by everyone" ON public.stats FOR SELECT USING ((is_active = true));


--
-- Name: about_page_settings Admin full access to about_page_settings; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admin full access to about_page_settings" ON public.about_page_settings USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));


--
-- Name: contact_page_settings Admin full access to contact_page_settings; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admin full access to contact_page_settings" ON public.contact_page_settings TO authenticated USING (public.is_admin(auth.uid()));


--
-- Name: footer_settings Admin full access to footer_settings; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admin full access to footer_settings" ON public.footer_settings TO authenticated USING (public.is_admin(auth.uid()));


--
-- Name: contact_submissions Admins can delete contact submissions; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can delete contact submissions" ON public.contact_submissions FOR DELETE USING (public.is_admin(auth.uid()));


--
-- Name: prequalification_downloads Admins can delete prequalification downloads; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can delete prequalification downloads" ON public.prequalification_downloads FOR DELETE USING (public.is_admin(auth.uid()));


--
-- Name: review_requests Admins can insert review requests; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can insert review requests" ON public.review_requests FOR INSERT WITH CHECK (public.is_admin(auth.uid()));


--
-- Name: ab_tests Admins can manage A/B tests; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can manage A/B tests" ON public.ab_tests USING (public.is_admin(auth.uid()));


--
-- Name: documents_library Admins can manage all documents; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can manage all documents" ON public.documents_library USING (public.is_admin(auth.uid()));


--
-- Name: analytics_snapshots Admins can manage analytics snapshots; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can manage analytics snapshots" ON public.analytics_snapshots USING (public.is_admin(auth.uid()));


--
-- Name: email_templates Admins can manage email templates; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can manage email templates" ON public.email_templates USING (public.is_admin(auth.uid()));


--
-- Name: featured_services Admins can manage featured services; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can manage featured services" ON public.featured_services USING (public.is_admin(auth.uid()));


--
-- Name: navigation_menu_items Admins can manage navigation; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can manage navigation" ON public.navigation_menu_items USING (public.is_admin(auth.uid()));


--
-- Name: service_promotions Admins can manage promotions; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can manage promotions" ON public.service_promotions USING (public.is_admin(auth.uid()));


--
-- Name: quote_requests Admins can manage quote requests; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can manage quote requests" ON public.quote_requests USING (public.is_admin(auth.uid()));


--
-- Name: rfp_submissions Admins can manage rfp submissions; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can manage rfp submissions" ON public.rfp_submissions USING (public.is_admin(auth.uid()));


--
-- Name: security_settings Admins can manage security settings; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can manage security settings" ON public.security_settings USING (public.is_admin(auth.uid()));


--
-- Name: specialty_pages Admins can manage specialty pages; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can manage specialty pages" ON public.specialty_pages USING (public.is_admin(auth.uid()));


--
-- Name: value_pillars Admins can manage value pillars; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can manage value pillars" ON public.value_pillars USING (public.is_admin(auth.uid()));


--
-- Name: contact_submissions Admins can update contact submissions; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can update contact submissions" ON public.contact_submissions FOR UPDATE USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));


--
-- Name: newsletter_subscribers Admins can update newsletter subscribers; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can update newsletter subscribers" ON public.newsletter_subscribers FOR UPDATE USING (public.is_admin(auth.uid()));


--
-- Name: prequalification_downloads Admins can update prequalification downloads; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can update prequalification downloads" ON public.prequalification_downloads FOR UPDATE USING (public.is_admin(auth.uid()));


--
-- Name: review_requests Admins can update review requests; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can update review requests" ON public.review_requests FOR UPDATE USING (public.is_admin(auth.uid()));


--
-- Name: admin_notifications Admins can update their notifications; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can update their notifications" ON public.admin_notifications FOR UPDATE TO authenticated USING (public.is_admin(auth.uid()));


--
-- Name: popular_services_analytics Admins can view all analytics; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can view all analytics" ON public.popular_services_analytics FOR SELECT USING (public.is_admin(auth.uid()));


--
-- Name: admin_notifications Admins can view all notifications; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can view all notifications" ON public.admin_notifications FOR SELECT TO authenticated USING (public.is_admin(auth.uid()));


--
-- Name: quote_requests Admins can view all quote requests; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can view all quote requests" ON public.quote_requests FOR SELECT USING (public.is_admin(auth.uid()));


--
-- Name: review_requests Admins can view all review requests; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can view all review requests" ON public.review_requests FOR SELECT USING (public.is_admin(auth.uid()));


--
-- Name: search_console_data Admins can view all search console data; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can view all search console data" ON public.search_console_data FOR SELECT USING (public.is_admin(auth.uid()));


--
-- Name: contact_submissions Admins can view contact submissions; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can view contact submissions" ON public.contact_submissions FOR SELECT USING (public.is_admin(auth.uid()));


--
-- Name: document_access_log Admins can view document access logs; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can view document access logs" ON public.document_access_log FOR SELECT USING (public.is_admin(auth.uid()));


--
-- Name: error_logs Admins can view error logs; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can view error logs" ON public.error_logs FOR SELECT USING (public.is_admin(auth.uid()));


--
-- Name: auth_failed_attempts Admins can view failed attempts; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can view failed attempts" ON public.auth_failed_attempts FOR SELECT USING (public.is_admin(auth.uid()));


--
-- Name: newsletter_subscribers Admins can view newsletter subscribers; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can view newsletter subscribers" ON public.newsletter_subscribers FOR SELECT USING (public.is_admin(auth.uid()));


--
-- Name: prequalification_downloads Admins can view prequalification downloads; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can view prequalification downloads" ON public.prequalification_downloads FOR SELECT USING (public.is_admin(auth.uid()));


--
-- Name: sitemap_logs Admins can view sitemap logs; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can view sitemap logs" ON public.sitemap_logs FOR SELECT USING (public.is_admin(auth.uid()));


--
-- Name: content_review_comments Admins manage all comments; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins manage all comments" ON public.content_review_comments USING (public.is_admin(auth.uid()));


--
-- Name: redirects Admins manage redirects; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins manage redirects" ON public.redirects USING (public.is_admin(auth.uid()));


--
-- Name: profiles Admins view all profiles; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins view all profiles" ON public.profiles FOR SELECT USING (public.is_admin(auth.uid()));


--
-- Name: search_analytics Allow anonymous search tracking; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Allow anonymous search tracking" ON public.search_analytics FOR INSERT TO authenticated, anon WITH CHECK (true);


--
-- Name: ab_test_assignments Anyone can insert A/B assignments; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anyone can insert A/B assignments" ON public.ab_test_assignments FOR INSERT WITH CHECK (true);


--
-- Name: error_logs Anyone can insert error logs; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anyone can insert error logs" ON public.error_logs FOR INSERT WITH CHECK (true);


--
-- Name: popular_services_analytics Anyone can log analytics events; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anyone can log analytics events" ON public.popular_services_analytics FOR INSERT WITH CHECK (true);


--
-- Name: document_access_log Anyone can log document access; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anyone can log document access" ON public.document_access_log FOR INSERT WITH CHECK (true);


--
-- Name: rfp_submissions Anyone can submit RFPs; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anyone can submit RFPs" ON public.rfp_submissions FOR INSERT WITH CHECK (true);


--
-- Name: contact_submissions Anyone can submit contact forms; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anyone can submit contact forms" ON public.contact_submissions FOR INSERT WITH CHECK (true);


--
-- Name: prequalification_downloads Anyone can submit prequalification request; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anyone can submit prequalification request" ON public.prequalification_downloads FOR INSERT WITH CHECK (true);


--
-- Name: newsletter_subscribers Anyone can subscribe to newsletter; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anyone can subscribe to newsletter" ON public.newsletter_subscribers FOR INSERT WITH CHECK (true);


--
-- Name: ab_tests Anyone can view active A/B tests; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anyone can view active A/B tests" ON public.ab_tests FOR SELECT USING ((is_active = true));


--
-- Name: project_images Anyone can view project images; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anyone can view project images" ON public.project_images FOR SELECT USING ((EXISTS ( SELECT 1
   FROM public.projects
  WHERE ((projects.id = project_images.project_id) AND (projects.publish_state = 'published'::public.publish_state)))));


--
-- Name: ab_test_assignments Anyone can view their own A/B assignments; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anyone can view their own A/B assignments" ON public.ab_test_assignments FOR SELECT USING (true);


--
-- Name: audit_log Audit log insertable by authenticated users; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Audit log insertable by authenticated users" ON public.audit_log FOR INSERT TO authenticated WITH CHECK ((auth.uid() = user_id));


--
-- Name: audit_log Audit log viewable by admins; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Audit log viewable by admins" ON public.audit_log FOR SELECT TO authenticated USING (public.is_admin(auth.uid()));


--
-- Name: project_images Authenticated users can view all project images; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Authenticated users can view all project images" ON public.project_images FOR SELECT USING ((auth.uid() IS NOT NULL));


--
-- Name: search_analytics Authenticated users can view search analytics; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Authenticated users can view search analytics" ON public.search_analytics FOR SELECT TO authenticated USING (true);


--
-- Name: content_review_comments Authenticated users create comments; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Authenticated users create comments" ON public.content_review_comments FOR INSERT WITH CHECK ((auth.uid() = created_by));


--
-- Name: content_review_comments Authenticated users view comments; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Authenticated users view comments" ON public.content_review_comments FOR SELECT USING ((auth.uid() IS NOT NULL));


--
-- Name: contact_submissions Block anonymous SELECT on contact submissions; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Block anonymous SELECT on contact submissions" ON public.contact_submissions FOR SELECT USING (false);


--
-- Name: blog_posts Blog posts manageable by content editors; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Blog posts manageable by content editors" ON public.blog_posts TO authenticated USING (public.can_edit_content(auth.uid()));


--
-- Name: certifications Certifications manageable by admins; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Certifications manageable by admins" ON public.certifications USING (public.is_admin(auth.uid()));


--
-- Name: company_overview_items Content editors can manage overview items; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Content editors can manage overview items" ON public.company_overview_items USING (public.can_edit_content(auth.uid()));


--
-- Name: company_overview_sections Content editors can manage overview sections; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Content editors can manage overview sections" ON public.company_overview_sections USING (public.can_edit_content(auth.uid()));


--
-- Name: project_images Content editors can manage project images; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Content editors can manage project images" ON public.project_images USING (public.can_edit_content(auth.uid()));


--
-- Name: why_choose_us_items Content editors can manage why choose us items; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Content editors can manage why choose us items" ON public.why_choose_us_items USING (public.can_edit_content(auth.uid()));


--
-- Name: featured_services Featured services are viewable by everyone; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Featured services are viewable by everyone" ON public.featured_services FOR SELECT USING (true);


--
-- Name: hero_slides Hero slides manageable by admins; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Hero slides manageable by admins" ON public.hero_slides USING (public.is_admin(auth.uid()));


--
-- Name: homepage_settings Homepage settings manageable by admins; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Homepage settings manageable by admins" ON public.homepage_settings USING (public.is_admin(auth.uid()));


--
-- Name: homepage_settings Homepage settings viewable by everyone; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Homepage settings viewable by everyone" ON public.homepage_settings FOR SELECT USING ((is_active = true));


--
-- Name: performance_metrics Only admins can insert metrics; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Only admins can insert metrics" ON public.performance_metrics FOR INSERT TO authenticated WITH CHECK (public.is_admin(auth.uid()));


--
-- Name: optimization_recommendations Optimization recommendations manageable by admins; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Optimization recommendations manageable by admins" ON public.optimization_recommendations USING (public.is_admin(auth.uid()));


--
-- Name: optimization_recommendations Optimization recommendations viewable by authenticated users; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Optimization recommendations viewable by authenticated users" ON public.optimization_recommendations FOR SELECT USING ((auth.uid() IS NOT NULL));


--
-- Name: performance_metrics Performance metrics viewable by authenticated users; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Performance metrics viewable by authenticated users" ON public.performance_metrics FOR SELECT USING ((auth.uid() IS NOT NULL));


--
-- Name: project_services Project services manageable by content editors; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Project services manageable by content editors" ON public.project_services TO authenticated USING (public.can_edit_content(auth.uid()));


--
-- Name: project_services Project services viewable by everyone; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Project services viewable by everyone" ON public.project_services FOR SELECT USING (true);


--
-- Name: projects Projects manageable by content editors; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Projects manageable by content editors" ON public.projects TO authenticated USING (public.can_edit_content(auth.uid()));


--
-- Name: quote_requests Public can insert quote requests; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Public can insert quote requests" ON public.quote_requests FOR INSERT WITH CHECK (true);


--
-- Name: redirects Public can view active redirects; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Public can view active redirects" ON public.redirects FOR SELECT USING ((is_active = true));


--
-- Name: specialty_pages Public can view active specialty pages; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Public can view active specialty pages" ON public.specialty_pages FOR SELECT USING ((is_active = true));


--
-- Name: value_pillars Public can view active value pillars; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Public can view active value pillars" ON public.value_pillars FOR SELECT USING ((is_active = true));


--
-- Name: about_page_settings Public read access to about_page_settings; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Public read access to about_page_settings" ON public.about_page_settings FOR SELECT USING ((is_active = true));


--
-- Name: contact_page_settings Public read access to contact_page_settings; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Public read access to contact_page_settings" ON public.contact_page_settings FOR SELECT TO authenticated, anon USING ((is_active = true));


--
-- Name: footer_settings Public read access to footer_settings; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Public read access to footer_settings" ON public.footer_settings FOR SELECT TO authenticated, anon USING ((is_active = true));


--
-- Name: blog_posts Published blog posts viewable by everyone; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Published blog posts viewable by everyone" ON public.blog_posts FOR SELECT USING (((publish_state = 'published'::public.publish_state) OR (auth.uid() IS NOT NULL) OR ((preview_token IS NOT NULL) AND (preview_token <> ''::text) AND (length(preview_token) > 16) AND ((preview_token_expires_at IS NULL) OR (preview_token_expires_at > now())))));


--
-- Name: projects Published projects viewable by everyone; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Published projects viewable by everyone" ON public.projects FOR SELECT USING (((publish_state = 'published'::public.publish_state) OR (auth.uid() IS NOT NULL) OR ((preview_token IS NOT NULL) AND (preview_token <> ''::text) AND (length(preview_token) > 16) AND ((preview_token_expires_at IS NULL) OR (preview_token_expires_at > now())))));


--
-- Name: services Published services viewable by everyone; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Published services viewable by everyone" ON public.services FOR SELECT USING (((publish_state = 'published'::public.publish_state) OR (auth.uid() IS NOT NULL) OR ((preview_token IS NOT NULL) AND (preview_token <> ''::text) AND (length(preview_token) > 16) AND ((preview_token_expires_at IS NULL) OR (preview_token_expires_at > now())))));


--
-- Name: testimonials Published testimonials viewable by everyone; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Published testimonials viewable by everyone" ON public.testimonials FOR SELECT USING ((publish_state = 'published'::public.publish_state));


--
-- Name: services Services manageable by content editors; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Services manageable by content editors" ON public.services TO authenticated USING (public.can_edit_content(auth.uid()));


--
-- Name: site_settings Site settings manageable by admins; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Site settings manageable by admins" ON public.site_settings USING (public.is_admin(auth.uid()));


--
-- Name: site_settings Site settings viewable by everyone; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Site settings viewable by everyone" ON public.site_settings FOR SELECT USING ((is_active = true));


--
-- Name: stats Stats manageable by content editors; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Stats manageable by content editors" ON public.stats USING (public.can_edit_content(auth.uid()));


--
-- Name: notifications System can create notifications; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "System can create notifications" ON public.notifications FOR INSERT WITH CHECK (true);


--
-- Name: content_versions System can create versions; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "System can create versions" ON public.content_versions FOR INSERT WITH CHECK ((auth.uid() = changed_by));


--
-- Name: admin_notifications System can insert notifications; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "System can insert notifications" ON public.admin_notifications FOR INSERT WITH CHECK (true);


--
-- Name: search_console_data System can insert search console data; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "System can insert search console data" ON public.search_console_data FOR INSERT WITH CHECK ((auth.uid() = user_id));


--
-- Name: sitemap_logs System can insert sitemap logs; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "System can insert sitemap logs" ON public.sitemap_logs FOR INSERT WITH CHECK (true);


--
-- Name: service_recommendations_cache System can manage recommendation cache; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "System can manage recommendation cache" ON public.service_recommendations_cache USING (true);


--
-- Name: testimonials Testimonials manageable by content editors; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Testimonials manageable by content editors" ON public.testimonials USING (public.can_edit_content(auth.uid()));


--
-- Name: user_roles User roles manageable by super admins; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "User roles manageable by super admins" ON public.user_roles TO authenticated USING (public.has_role(auth.uid(), 'super_admin'::public.app_role));


--
-- Name: user_roles User roles viewable by admins; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "User roles viewable by admins" ON public.user_roles FOR SELECT TO authenticated USING (public.is_admin(auth.uid()));


--
-- Name: google_auth_tokens Users can delete their own tokens; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can delete their own tokens" ON public.google_auth_tokens FOR DELETE USING ((auth.uid() = user_id));


--
-- Name: google_auth_tokens Users can insert their own tokens; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can insert their own tokens" ON public.google_auth_tokens FOR INSERT WITH CHECK ((auth.uid() = user_id));


--
-- Name: user_service_preferences Users can manage their own preferences; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can manage their own preferences" ON public.user_service_preferences USING (true);


--
-- Name: notifications Users can update own notifications; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can update own notifications" ON public.notifications FOR UPDATE USING ((auth.uid() = user_id));


--
-- Name: profiles Users can update own profile; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE TO authenticated USING ((auth.uid() = id));


--
-- Name: google_auth_tokens Users can update their own tokens; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can update their own tokens" ON public.google_auth_tokens FOR UPDATE USING ((auth.uid() = user_id));


--
-- Name: service_recommendations_cache Users can view their own recommendations; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view their own recommendations" ON public.service_recommendations_cache FOR SELECT USING (true);


--
-- Name: search_console_data Users can view their own search console data; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view their own search console data" ON public.search_console_data FOR SELECT USING ((auth.uid() = user_id));


--
-- Name: google_auth_tokens Users can view their own tokens; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view their own tokens" ON public.google_auth_tokens FOR SELECT USING ((auth.uid() = user_id));


--
-- Name: notifications Users view own notifications; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users view own notifications" ON public.notifications FOR SELECT USING ((auth.uid() = user_id));


--
-- Name: profiles Users view own profile only; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users view own profile only" ON public.profiles FOR SELECT USING ((auth.uid() = id));


--
-- Name: content_versions Versions viewable by authenticated users; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Versions viewable by authenticated users" ON public.content_versions FOR SELECT USING ((auth.uid() IS NOT NULL));


--
-- Name: ab_test_assignments; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.ab_test_assignments ENABLE ROW LEVEL SECURITY;

--
-- Name: ab_tests; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.ab_tests ENABLE ROW LEVEL SECURITY;

--
-- Name: about_page_settings; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.about_page_settings ENABLE ROW LEVEL SECURITY;

--
-- Name: admin_notifications; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.admin_notifications ENABLE ROW LEVEL SECURITY;

--
-- Name: analytics_snapshots; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.analytics_snapshots ENABLE ROW LEVEL SECURITY;

--
-- Name: audit_log; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.audit_log ENABLE ROW LEVEL SECURITY;

--
-- Name: auth_failed_attempts; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.auth_failed_attempts ENABLE ROW LEVEL SECURITY;

--
-- Name: blog_posts; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

--
-- Name: certifications; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.certifications ENABLE ROW LEVEL SECURITY;

--
-- Name: company_overview_items; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.company_overview_items ENABLE ROW LEVEL SECURITY;

--
-- Name: company_overview_sections; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.company_overview_sections ENABLE ROW LEVEL SECURITY;

--
-- Name: contact_page_settings; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.contact_page_settings ENABLE ROW LEVEL SECURITY;

--
-- Name: contact_submissions; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;

--
-- Name: content_review_comments; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.content_review_comments ENABLE ROW LEVEL SECURITY;

--
-- Name: content_versions; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.content_versions ENABLE ROW LEVEL SECURITY;

--
-- Name: document_access_log; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.document_access_log ENABLE ROW LEVEL SECURITY;

--
-- Name: documents_library; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.documents_library ENABLE ROW LEVEL SECURITY;

--
-- Name: email_templates; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.email_templates ENABLE ROW LEVEL SECURITY;

--
-- Name: error_logs; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.error_logs ENABLE ROW LEVEL SECURITY;

--
-- Name: featured_services; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.featured_services ENABLE ROW LEVEL SECURITY;

--
-- Name: footer_settings; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.footer_settings ENABLE ROW LEVEL SECURITY;

--
-- Name: google_auth_tokens; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.google_auth_tokens ENABLE ROW LEVEL SECURITY;

--
-- Name: hero_slides; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.hero_slides ENABLE ROW LEVEL SECURITY;

--
-- Name: homepage_settings; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.homepage_settings ENABLE ROW LEVEL SECURITY;

--
-- Name: navigation_menu_items; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.navigation_menu_items ENABLE ROW LEVEL SECURITY;

--
-- Name: newsletter_subscribers; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;

--
-- Name: notifications; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

--
-- Name: optimization_recommendations; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.optimization_recommendations ENABLE ROW LEVEL SECURITY;

--
-- Name: performance_metrics; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.performance_metrics ENABLE ROW LEVEL SECURITY;

--
-- Name: popular_services_analytics; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.popular_services_analytics ENABLE ROW LEVEL SECURITY;

--
-- Name: prequalification_downloads; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.prequalification_downloads ENABLE ROW LEVEL SECURITY;

--
-- Name: profiles; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

--
-- Name: project_images; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.project_images ENABLE ROW LEVEL SECURITY;

--
-- Name: project_services; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.project_services ENABLE ROW LEVEL SECURITY;

--
-- Name: projects; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

--
-- Name: quote_requests; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.quote_requests ENABLE ROW LEVEL SECURITY;

--
-- Name: redirects; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.redirects ENABLE ROW LEVEL SECURITY;

--
-- Name: review_requests; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.review_requests ENABLE ROW LEVEL SECURITY;

--
-- Name: rfp_submissions; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.rfp_submissions ENABLE ROW LEVEL SECURITY;

--
-- Name: search_analytics; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.search_analytics ENABLE ROW LEVEL SECURITY;

--
-- Name: search_console_data; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.search_console_data ENABLE ROW LEVEL SECURITY;

--
-- Name: security_settings; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.security_settings ENABLE ROW LEVEL SECURITY;

--
-- Name: service_promotions; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.service_promotions ENABLE ROW LEVEL SECURITY;

--
-- Name: service_recommendations_cache; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.service_recommendations_cache ENABLE ROW LEVEL SECURITY;

--
-- Name: services; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;

--
-- Name: site_settings; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

--
-- Name: sitemap_logs; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.sitemap_logs ENABLE ROW LEVEL SECURITY;

--
-- Name: specialty_pages; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.specialty_pages ENABLE ROW LEVEL SECURITY;

--
-- Name: stats; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.stats ENABLE ROW LEVEL SECURITY;

--
-- Name: testimonials; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;

--
-- Name: user_roles; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

--
-- Name: user_service_preferences; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.user_service_preferences ENABLE ROW LEVEL SECURITY;

--
-- Name: value_pillars; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.value_pillars ENABLE ROW LEVEL SECURITY;

--
-- Name: why_choose_us_items; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.why_choose_us_items ENABLE ROW LEVEL SECURITY;

--
-- PostgreSQL database dump complete
--


