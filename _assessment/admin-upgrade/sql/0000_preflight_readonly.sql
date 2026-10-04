-- 0000_preflight_readonly.sql
-- READ-ONLY. Run in Lovable Cloud (SQL editor or ask Lovable to run it) BEFORE applying 0001.
-- Every statement is a SELECT. Paste the results back to Claude/Codex. No personal data is returned.

-- 1. Legacy lead tables: row counts (decides whether a backfill is needed)
select 'contact_submissions' as t, count(*) from public.contact_submissions
union all select 'rfp_submissions', count(*) from public.rfp_submissions
union all select 'quote_requests', count(*) from public.quote_requests
union all select 'prequalification_downloads', count(*) from public.prequalification_downloads
union all select 'resume_submissions', count(*) from public.resume_submissions;

-- 2. Does an object called "inquiries" (or the other new names) already exist?
select table_name from information_schema.tables
where table_schema = 'public'
  and table_name in ('inquiries','inquiry_notes','inquiry_events','notification_recipients');

-- 3. Helper functions the migration depends on
select p.proname, pg_get_function_identity_arguments(p.oid) as args, p.prosecdef as security_definer
from pg_proc p join pg_namespace n on n.oid = p.pronamespace
where n.nspname = 'public'
  and p.proname in ('is_admin','has_role','notify_admins','update_updated_at_column');

-- 4. Who may EXECUTE is_admin / has_role (policies call them as "authenticated")
select p.proname, r.rolname,
       has_function_privilege(r.rolname, p.oid, 'EXECUTE') as can_execute
from pg_proc p join pg_namespace n on n.oid = p.pronamespace
cross join (values ('anon'),('authenticated'),('service_role')) as r(rolname)
where n.nspname = 'public' and p.proname in ('is_admin','has_role');

-- 5. The admin_notifications CHECK constraint as it is live
select conname, pg_get_constraintdef(oid)
from pg_constraint
where conrelid = 'public.admin_notifications'::regclass and contype = 'c';

-- 6. Realtime publication: which public tables are in it
select pubname, schemaname, tablename
from pg_publication_tables
where pubname = 'supabase_realtime' and schemaname = 'public'
order by tablename;

-- 7. user_roles shape (for the atomic role-change function)
select column_name, data_type, is_nullable
from information_schema.columns
where table_schema = 'public' and table_name = 'user_roles'
order by ordinal_position;
select conname, pg_get_constraintdef(oid)
from pg_constraint where conrelid = 'public.user_roles'::regclass;

-- 7b. profiles.id must be a primary/unique key (new foreign keys point at it)
select conname, pg_get_constraintdef(oid)
from pg_constraint where conrelid = 'public.profiles'::regclass and contype in ('p','u');

-- 8. Role counts (no emails)
select role, count(*) from public.user_roles group by role order by role;

-- 9. email_send_log columns (the admin Email Delivery page reads it)
select column_name, data_type
from information_schema.columns
where table_schema = 'public' and table_name = 'email_send_log'
order by ordinal_position;

-- 11. Live table privileges for lead tables, roles and notifications (who can insert/select/update/delete)
select table_name, grantee, string_agg(privilege_type, ', ' order by privilege_type) as privileges
from information_schema.role_table_grants
where table_schema = 'public'
  and grantee in ('anon','authenticated','service_role','PUBLIC')
  and table_name in ('contact_submissions','rfp_submissions','quote_requests','prequalification_downloads',
                     'resume_submissions','admin_notifications','user_roles','profiles','email_send_log',
                     'suppressed_emails')
group by table_name, grantee
order by table_name, grantee;

-- 12. Every RLS policy on those tables and on storage objects for rfp-attachments
select schemaname, tablename, policyname, cmd, roles, permissive, qual, with_check
from pg_policies
where (schemaname = 'public' and tablename in ('contact_submissions','rfp_submissions','quote_requests',
        'prequalification_downloads','resume_submissions','admin_notifications','user_roles','profiles',
        'email_send_log','suppressed_emails'))
   or (schemaname = 'storage' and tablename = 'objects'
       and (coalesce(qual,'') ilike '%rfp-attachments%' or coalesce(with_check,'') ilike '%rfp-attachments%'))
order by schemaname, tablename, policyname;

-- 13. Triggers on lead tables and user_roles (names, timing, function)
select event_object_table as table_name, trigger_name, action_timing, event_manipulation, action_statement
from information_schema.triggers
where event_object_schema = 'public'
  and event_object_table in ('contact_submissions','rfp_submissions','quote_requests',
                             'prequalification_downloads','resume_submissions','user_roles','admin_notifications')
order by event_object_table, trigger_name;

-- 14. EXECUTE privileges on SECURITY DEFINER functions the new code calls or depends on
select p.proname, r.rolname, has_function_privilege(r.rolname, p.oid, 'EXECUTE') as can_execute
from pg_proc p join pg_namespace n on n.oid = p.pronamespace
cross join (values ('anon'),('authenticated'),('service_role')) as r(rolname)
where n.nspname = 'public' and p.proname in ('notify_admins','check_and_update_rate_limit','log_sensitive_access')
order by p.proname, r.rolname;

-- 15. Transaction isolation default (the super-admin guard assumes READ COMMITTED)
show default_transaction_isolation;

-- 16. Leads written in the last 30 days per legacy table (shows which intake paths are live)
select 'contact_submissions' as t, submission_type as kind, count(*) from public.contact_submissions
  where created_at > now() - interval '30 days' group by submission_type
union all select 'quote_requests', quote_type, count(*) from public.quote_requests
  where created_at > now() - interval '30 days' group by quote_type
union all select 'rfp_submissions', null, count(*) from public.rfp_submissions
  where created_at > now() - interval '30 days';

-- 10. Applied migration history (last 10)
select version, name
from supabase_migrations.schema_migrations
order by version desc
limit 10;
