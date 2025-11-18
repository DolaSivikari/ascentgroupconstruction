-- Update content table RLS policies to use granular permissions

-- Update blog_posts policies
DROP POLICY IF EXISTS "Blog posts manageable by content editors" ON public.blog_posts;

CREATE POLICY "Admins and editors can manage blog posts"
ON public.blog_posts
FOR ALL
TO authenticated
USING (
  is_admin(auth.uid()) OR 
  can_edit_content(auth.uid())
)
WITH CHECK (
  is_admin(auth.uid()) OR 
  can_edit_content(auth.uid())
);

-- Update projects policies
DROP POLICY IF EXISTS "Projects manageable by content editors" ON public.projects;

CREATE POLICY "Admins and editors can manage projects"
ON public.projects
FOR ALL
TO authenticated
USING (
  is_admin(auth.uid()) OR 
  can_edit_content(auth.uid())
)
WITH CHECK (
  is_admin(auth.uid()) OR 
  can_edit_content(auth.uid())
);

-- Update services table policies if they exist
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'services') THEN
    EXECUTE 'DROP POLICY IF EXISTS "Services manageable by content editors" ON public.services';
    
    EXECUTE 'CREATE POLICY "Admins and editors can manage services"
    ON public.services
    FOR ALL
    TO authenticated
    USING (
      is_admin(auth.uid()) OR 
      can_edit_content(auth.uid())
    )
    WITH CHECK (
      is_admin(auth.uid()) OR 
      can_edit_content(auth.uid())
    )';
  END IF;
END $$;

-- Update homepage settings to require admin permissions
DROP POLICY IF EXISTS "Homepage settings manageable by admins" ON public.homepage_settings;

CREATE POLICY "Admins can manage homepage settings"
ON public.homepage_settings
FOR ALL
TO authenticated
USING (can_manage_settings(auth.uid()))
WITH CHECK (can_manage_settings(auth.uid()));

-- Update navigation menu items
DROP POLICY IF EXISTS "Admins can manage navigation" ON public.navigation_menu_items;

CREATE POLICY "Admins can manage navigation"
ON public.navigation_menu_items
FOR ALL
TO authenticated
USING (can_manage_settings(auth.uid()))
WITH CHECK (can_manage_settings(auth.uid()));