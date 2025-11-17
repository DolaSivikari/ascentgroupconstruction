-- =====================================================
-- RLS POLICY AUDIT SCRIPT
-- Comprehensive security audit for Row Level Security
-- =====================================================

-- 1. Check for tables without RLS enabled
SELECT 
  schemaname, 
  tablename,
  '⚠️ RLS NOT ENABLED' as issue
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename NOT IN ('schema_migrations')
  AND NOT EXISTS (
    SELECT 1 
    FROM pg_policies
    WHERE schemaname = pg_tables.schemaname
      AND tablename = pg_tables.tablename
  )
ORDER BY tablename;

-- 2. Check for tables with RLS enabled but no policies
SELECT 
  t.schemaname,
  t.tablename,
  '⚠️ RLS ENABLED BUT NO POLICIES' as issue
FROM pg_tables t
WHERE t.schemaname = 'public'
  AND t.tablename NOT IN ('schema_migrations')
  AND NOT EXISTS (
    SELECT 1 
    FROM pg_policies p
    WHERE p.schemaname = t.schemaname
      AND p.tablename = t.tablename
  );

-- 3. Check for overly permissive policies (allow all with 'true')
SELECT 
  schemaname,
  tablename,
  policyname,
  cmd as operation,
  '⚠️ OVERLY PERMISSIVE - allows everything' as issue
FROM pg_policies
WHERE schemaname = 'public'
  AND qual = 'true'
  AND cmd != 'SELECT' -- SELECT with 'true' might be intentional for public data
ORDER BY tablename, policyname;

-- 4. Check for policies that reference the same table (potential recursion)
SELECT 
  p.schemaname,
  p.tablename,
  p.policyname,
  p.qual,
  '⚠️ POTENTIAL RECURSIVE POLICY' as issue
FROM pg_policies p
WHERE p.schemaname = 'public'
  AND p.qual LIKE '%' || p.tablename || '%'
ORDER BY p.tablename, p.policyname;

-- 5. List all policies for review
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd as operation,
  qual as using_expression,
  with_check as with_check_expression
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- 6. Check for tables with sensitive data but weak policies
SELECT 
  t.tablename,
  COUNT(p.policyname) as policy_count,
  CASE 
    WHEN COUNT(p.policyname) = 0 THEN '🔴 CRITICAL - No policies'
    WHEN COUNT(p.policyname) < 2 THEN '⚠️ WARNING - Only one policy'
    ELSE '✅ OK'
  END as status
FROM pg_tables t
LEFT JOIN pg_policies p ON t.tablename = p.tablename AND p.schemaname = 'public'
WHERE t.schemaname = 'public'
  AND t.tablename IN (
    'profiles', 'contact_submissions', 'resume_submissions',
    'user_roles', 'audit_log', 'error_logs', 'auth_failed_attempts',
    'auth_account_lockouts', 'security_alerts'
  )
GROUP BY t.tablename
ORDER BY 
  CASE 
    WHEN COUNT(p.policyname) = 0 THEN 1
    WHEN COUNT(p.policyname) < 2 THEN 2
    ELSE 3
  END,
  t.tablename;

-- 7. Check for anonymous access to sensitive tables
SELECT 
  schemaname,
  tablename,
  policyname,
  '⚠️ ANONYMOUS ACCESS ALLOWED' as issue
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename IN (
    'profiles', 'contact_submissions', 'resume_submissions',
    'user_roles', 'audit_log'
  )
  AND (
    qual LIKE '%anon%' 
    OR qual = 'true'
    OR roles::text LIKE '%anon%'
  )
ORDER BY tablename, policyname;

-- 8. Generate summary report
SELECT 
  'Total Tables' as metric,
  COUNT(DISTINCT tablename)::text as count
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename NOT IN ('schema_migrations')
UNION ALL
SELECT 
  'Tables with RLS',
  COUNT(DISTINCT tablename)::text
FROM pg_policies
WHERE schemaname = 'public'
UNION ALL
SELECT 
  'Total Policies',
  COUNT(*)::text
FROM pg_policies
WHERE schemaname = 'public'
UNION ALL
SELECT 
  'Permissive Policies',
  COUNT(*)::text
FROM pg_policies
WHERE schemaname = 'public'
  AND qual = 'true';
