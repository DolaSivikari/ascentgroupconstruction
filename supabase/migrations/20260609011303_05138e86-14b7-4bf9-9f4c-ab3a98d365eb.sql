
-- admin_notifications: only service_role may insert
DROP POLICY IF EXISTS "System can insert notifications" ON public.admin_notifications;
CREATE POLICY "Service role can insert admin notifications"
  ON public.admin_notifications
  FOR INSERT
  TO service_role
  WITH CHECK (true);

-- notifications: only service_role may insert
DROP POLICY IF EXISTS "System can create notifications" ON public.notifications;
CREATE POLICY "Service role can create notifications"
  ON public.notifications
  FOR INSERT
  TO service_role
  WITH CHECK (true);

-- sitemap_logs: only service_role may insert
DROP POLICY IF EXISTS "System can insert sitemap logs" ON public.sitemap_logs;
CREATE POLICY "Service role can insert sitemap logs"
  ON public.sitemap_logs
  FOR INSERT
  TO service_role
  WITH CHECK (true);
