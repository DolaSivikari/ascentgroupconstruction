-- Update app_role enum to include all necessary roles
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'editor';
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'contributor';
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'viewer';

-- Create helper functions for granular permissions

-- Check if user can manage other users
CREATE OR REPLACE FUNCTION public.can_manage_users(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id 
    AND role IN ('super_admin')
  )
$$;

-- Check if user can view analytics
CREATE OR REPLACE FUNCTION public.can_view_analytics(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id 
    AND role IN ('super_admin', 'admin')
  )
$$;

-- Check if user can manage settings
CREATE OR REPLACE FUNCTION public.can_manage_settings(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id 
    AND role IN ('super_admin', 'admin')
  )
$$;

-- Get user's highest role (for display purposes)
CREATE OR REPLACE FUNCTION public.get_user_role(_user_id uuid)
RETURNS text
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role::text
  FROM public.user_roles
  WHERE user_id = _user_id
  ORDER BY 
    CASE role
      WHEN 'super_admin' THEN 1
      WHEN 'admin' THEN 2
      WHEN 'editor' THEN 3
      WHEN 'contributor' THEN 4
      WHEN 'viewer' THEN 5
    END
  LIMIT 1
$$;