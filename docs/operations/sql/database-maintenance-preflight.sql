-- READ ONLY. Call get_database_status and verify the Lovable/backend identity first.
-- Return catalog metadata and aggregates only. Do not fetch customer/telemetry rows.
begin transaction read only;
set local statement_timeout = '15s';
set local lock_timeout = '2s';
set local timezone = 'UTC';

select current_database() as database_name, current_user as executor,
       current_setting('server_version') as postgres_version;

select count(*) as public_tables,
       count(*) filter (where c.relrowsecurity) as rls_enabled,
       count(*) filter (where exists (select 1 from pg_constraint k
         where k.conrelid = c.oid and k.contype = 'p')) as with_primary_key,
       sum(pg_total_relation_size(c.oid)) as table_and_index_bytes
from pg_class c join pg_namespace n on n.oid = c.relnamespace
where n.nspname = 'public' and c.relkind in ('r', 'p');

select c.relname, c.relkind, pg_get_userbyid(c.relowner) as owner,
       c.relrowsecurity, c.relforcerowsecurity,
       pg_total_relation_size(c.oid) as bytes,
       has_table_privilege('anon', c.oid, 'TRUNCATE') as anon_truncate,
       has_table_privilege('authenticated', c.oid, 'TRUNCATE') as authenticated_truncate,
       has_table_privilege('service_role', c.oid, 'TRUNCATE') as server_truncate
from pg_class c join pg_namespace n on n.oid = c.relnamespace
where n.nspname = 'public' and c.relkind in ('r', 'p') order by c.relname;

-- Direct grants, grant options and grantors (PUBLIC has OID zero).
select c.relname, pg_get_userbyid(a.grantor) as grantor,
       case when a.grantee = 0 then 'PUBLIC' else pg_get_userbyid(a.grantee) end as grantee,
       a.privilege_type, a.is_grantable
from pg_class c join pg_namespace n on n.oid = c.relnamespace
cross join lateral aclexplode(coalesce(c.relacl, acldefault('r', c.relowner))) a
where n.nspname = 'public' and c.relkind in ('r', 'p') order by 1, 3, 4;

-- Exact recovery statements for pre-change explicit TRUNCATE grants.
-- Save privately with the approval record; execute only as a separately approved rollback.
select format('SET LOCAL ROLE %I; GRANT TRUNCATE ON TABLE %I.%I TO %s%s; RESET ROLE;',
       pg_get_userbyid(a.grantor), n.nspname, c.relname,
       case when a.grantee = 0 then 'PUBLIC' else quote_ident(pg_get_userbyid(a.grantee)) end,
       case when a.is_grantable then ' WITH GRANT OPTION' else '' end) as rollback_statement
from pg_class c join pg_namespace n on n.oid = c.relnamespace
cross join lateral aclexplode(coalesce(c.relacl, acldefault('r', c.relowner))) a
where n.nspname = 'public' and c.relkind in ('r', 'p') and a.privilege_type = 'TRUNCATE'
  and (a.grantee = 0 or a.grantee in (select oid from pg_roles where rolname in ('anon', 'authenticated')))
order by c.relname, a.grantor, a.grantee;

select r.rolname as browser_role, inherited.rolname as reachable_role,
       inherited.rolsuper, inherited.rolinherit
from pg_roles r cross join pg_roles inherited
where r.rolname in ('anon', 'authenticated') and pg_has_role(r.oid, inherited.oid, 'MEMBER')
order by 1, 2;
select pg_get_userbyid(d.defaclrole) as creator,
       coalesce(n.nspname, '(all schemas)') as schema_scope, d.defaclobjtype,
       case when a.grantee = 0 then 'PUBLIC' else pg_get_userbyid(a.grantee) end as grantee,
       a.privilege_type, a.is_grantable
from pg_default_acl d left join pg_namespace n on n.oid = d.defaclnamespace
cross join lateral aclexplode(d.defaclacl) a
where d.defaclobjtype = 'r' and (n.nspname = 'public' or d.defaclnamespace = 0)
order by 1, 2, 4, 5;

-- Freeze this fingerprint in A only after identity, backup and exact-set approval.
select md5(jsonb_build_object(
  'tables', (select jsonb_agg(jsonb_build_array(c.oid, c.relname, c.relowner, c.relacl::text) order by c.oid)
    from pg_class c join pg_namespace n on n.oid = c.relnamespace
    where n.nspname = 'public' and c.relkind in ('r', 'p')),
  'roles', (select jsonb_agg(jsonb_build_array(oid, rolname, rolsuper, rolinherit) order by oid) from pg_roles),
  'memberships', (select jsonb_agg(to_jsonb(m) order by roleid, member, grantor) from pg_auth_members m)
)::text) as catalog_md5;

select c.relname as table_name, i.relname as index_name, x.indisvalid, x.indisready
from pg_index x join pg_class i on i.oid = x.indexrelid
join pg_class c on c.oid = x.indrelid join pg_namespace n on n.oid = c.relnamespace
where n.nspname = 'public' and (not x.indisvalid or not x.indisready);
select k.conname, k.conrelid::regclass::text as relation, k.contype
from pg_constraint k join pg_namespace n on n.oid = k.connamespace
where n.nspname = 'public' and not k.convalidated;

select schemaname, tablename, policyname, permissive, roles, cmd,
       md5(coalesce(qual, '')) as using_md5, md5(coalesce(with_check, '')) as check_md5
from pg_policies where schemaname = 'public' order by tablename, policyname;
select table_name, column_name, data_type, is_nullable, column_default
from information_schema.columns where table_schema = 'public'
  and table_name in ('site_health_runs', 'site_health_results', 'site_health_issue_states', 'performance_metrics')
order by table_name, ordinal_position;
select k.conname, k.conrelid::regclass::text as relation,
       nullif(k.confrelid, 0)::regclass::text as referenced_relation,
       k.contype, k.confdeltype, pg_get_constraintdef(k.oid) as definition
from pg_constraint k where k.conrelid in (
  to_regclass('public.performance_metrics'), to_regclass('public.site_health_runs'),
  to_regclass('public.site_health_results'), to_regclass('public.site_health_issue_states'))
  or k.confrelid = to_regclass('public.performance_metrics');

-- No routine bodies, cron commands, telemetry messages, tokens or credentials returned.
with routines as (
  select p.oid, p.pronamespace, p.proname, p.prosecdef, pg_get_functiondef(p.oid) as definition
  from pg_proc p where p.prokind in ('f', 'p')
)
select n.nspname, p.proname, pg_get_function_identity_arguments(p.oid) as arguments,
       p.prosecdef, md5(p.definition) as definition_md5,
       array(select t from unnest(array['performance_metrics', 'error_logs', 'audit_log',
         'content_versions', 'service_recommendations_cache', 'site_health_', 'TRUNCATE']) t
         where p.definition ilike '%' || t || '%') as referenced_names
from routines p join pg_namespace n on n.oid = p.pronamespace
where n.nspname = 'public' order by p.proname, arguments;
select c.relname, t.tgname, t.tgenabled, t.tgfoid::regprocedure::text as routine
from pg_trigger t join pg_class c on c.oid = t.tgrelid
join pg_namespace n on n.oid = c.relnamespace
where n.nspname = 'public' and not t.tgisinternal order by 1, 2;
select pg_describe_object(d.classid, d.objid, d.objsubid) as dependent_object,
       pg_describe_object(d.refclassid, d.refobjid, d.refobjsubid) as referenced_object, d.deptype
from pg_depend d where d.refclassid = 'pg_class'::regclass
  and d.refobjid in (to_regclass('public.performance_metrics'), to_regclass('public.service_recommendations_cache'));

select to_regclass('public.site_health_runs') is not null as runs_present,
       to_regclass('public.site_health_results') is not null as results_present,
       to_regclass('public.site_health_issue_states') is not null as decisions_present,
       to_regprocedure('public.is_admin(uuid)') is not null as admin_contract_present,
       to_regclass('public.profiles') is not null as profile_fk_present,
       to_regclass('cron.job') is not null as cron_catalog_present,
       to_regclass('storage.buckets') is not null as storage_catalog_present,
       to_regclass('supabase_migrations.schema_migrations') is not null as migration_history_present;

select '2026-07-15 00:00:00+00'::timestamptz as proposed_cutoff,
       count(*) as total, count(*) filter (where recorded_at < '2026-07-15 00:00:00+00'::timestamptz) as eligible,
       count(*) filter (where recorded_at is null) as unknown_age,
       min(recorded_at) as oldest, max(recorded_at) as newest,
       md5(coalesce(string_agg(to_jsonb(metrics)::text, E'\n' order by id)
         filter (where recorded_at < '2026-07-15 00:00:00+00'::timestamptz), '')) as eligible_set_md5
from public.performance_metrics metrics;
select 'error_logs' as relation, count(*) as total from public.error_logs
union all select 'audit_log', count(*) from public.audit_log
union all select 'content_versions', count(*) from public.content_versions
union all select 'service_recommendations_cache', count(*) from public.service_recommendations_cache;
commit;

-- Run these independently only when the corresponding catalog above is present:
-- SELECT jobid, schedule, active, md5(command) AS command_md5,
--   command ILIKE '%performance_metrics%' AS metrics_reference,
--   command ILIKE '%error_logs%' AS error_log_reference,
--   command ILIKE '%site_health%' AS health_reference FROM cron.job;
-- SELECT id, name, public FROM storage.buckets;
-- SELECT version FROM supabase_migrations.schema_migrations ORDER BY version;
-- SELECT count(*) AS total, max(finished_at) AS latest_finished FROM public.site_health_runs;
-- SELECT count(*) AS total FROM public.site_health_results;
-- SELECT count(*) AS total FROM public.site_health_issue_states;
