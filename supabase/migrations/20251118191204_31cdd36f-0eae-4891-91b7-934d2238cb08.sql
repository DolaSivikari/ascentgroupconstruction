
-- Phase 1: Add better error logging and ensure RLS policies work correctly

-- Create a function to log project save attempts for debugging
CREATE OR REPLACE FUNCTION log_project_save_attempt()
RETURNS TRIGGER AS $$
BEGIN
  -- Log to audit_log table for debugging
  INSERT INTO audit_log (
    object_type,
    object_id,
    action,
    user_id,
    before_state,
    after_state
  ) VALUES (
    'projects',
    COALESCE(NEW.id, OLD.id),
    TG_OP,
    auth.uid(),
    CASE WHEN TG_OP IN ('UPDATE', 'DELETE') THEN to_jsonb(OLD) ELSE NULL END,
    CASE WHEN TG_OP IN ('INSERT', 'UPDATE') THEN to_jsonb(NEW) ELSE NULL END
  );
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Add trigger for project saves
DROP TRIGGER IF EXISTS log_project_operations ON projects;
CREATE TRIGGER log_project_operations
  AFTER INSERT OR UPDATE OR DELETE ON projects
  FOR EACH ROW
  EXECUTE FUNCTION log_project_save_attempt();

-- Ensure the can_edit_content function is working properly
-- (recreate it to be sure it's correct)
CREATE OR REPLACE FUNCTION can_edit_content(_user_id uuid)
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
    AND role IN ('super_admin', 'admin', 'editor', 'contributor')
  )
$$;

-- Verify RLS policy is correct (drop and recreate to be sure)
DROP POLICY IF EXISTS "Admins and editors can manage projects" ON projects;
CREATE POLICY "Admins and editors can manage projects"
ON projects
FOR ALL
TO authenticated
USING (is_admin(auth.uid()) OR can_edit_content(auth.uid()))
WITH CHECK (is_admin(auth.uid()) OR can_edit_content(auth.uid()));

-- Add a helpful comment
COMMENT ON POLICY "Admins and editors can manage projects" ON projects IS 
'Allows users with super_admin, admin, editor, or contributor roles to manage projects';
