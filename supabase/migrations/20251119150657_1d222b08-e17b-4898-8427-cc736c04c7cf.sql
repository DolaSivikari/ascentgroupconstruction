-- Add index to speed up user_roles queries
CREATE INDEX IF NOT EXISTS idx_user_roles_lookup 
ON public.user_roles(user_id, role);

-- Add index for faster admin checks
CREATE INDEX IF NOT EXISTS idx_user_roles_admin_check 
ON public.user_roles(user_id) 
WHERE role IN ('admin', 'super_admin');