-- READ ONLY. Run after identity confirmation, and only if the three tables exist.
-- Missing rows in this contract query must block activation; never apply full 0003.
begin transaction read only;
set local statement_timeout = '15s';
set local timezone = 'UTC';
with expected(table_name, column_name, expected_type, required) as (values
  ('site_health_runs','id','uuid',true),
  ('site_health_runs','started_at','timestamp with time zone',true),
  ('site_health_runs','finished_at','timestamp with time zone',false),
  ('site_health_runs','kind','text',true),
  ('site_health_runs','target_origin','text',true),
  ('site_health_runs','commit_ref','text',false),
  ('site_health_runs','pages_checked','integer',true),
  ('site_health_runs','errors','integer',true),
  ('site_health_runs','warnings','integer',true),
  ('site_health_runs','status','text',true),
  ('site_health_results','id','uuid',true),
  ('site_health_results','run_id','uuid',true),
  ('site_health_results','path','text',true),
  ('site_health_results','viewport','text',true),
  ('site_health_results','http_status','integer',false),
  ('site_health_results','load_ms','integer',false),
  ('site_health_results','title','text',false),
  ('site_health_results','h1','text',false),
  ('site_health_results','canonical','text',false),
  ('site_health_results','text_hash','text',false),
  ('site_health_results','console_errors','integer',true),
  ('site_health_results','failed_requests','integer',true),
  ('site_health_results','issues','jsonb',true),
  ('site_health_results','checked_at','timestamp with time zone',true),
  ('site_health_issue_states','fingerprint','text',true),
  ('site_health_issue_states','state','text',true),
  ('site_health_issue_states','reason','text',false),
  ('site_health_issue_states','updated_at','timestamp with time zone',true),
  ('site_health_issue_states','updated_by','uuid',false)
)
select e.*, format_type(a.atttypid,a.atttypmod) as actual_type,
       a.attnotnull as actual_required
from expected e left join pg_attribute a
  on a.attrelid = to_regclass('public.' || e.table_name)
  and a.attname = e.column_name and not a.attisdropped
where a.attname is null or format_type(a.atttypid,a.atttypmod) <> e.expected_type
  or a.attnotnull <> e.required;

select c.relname, c.relrowsecurity, c.relforcerowsecurity,
       has_table_privilege('anon', c.oid, 'SELECT') as anon_read,
       has_table_privilege('authenticated', c.oid, 'SELECT') as authenticated_read,
       has_table_privilege('authenticated', c.oid, 'INSERT') as authenticated_insert,
       has_table_privilege('authenticated', c.oid, 'UPDATE') as authenticated_update,
       has_table_privilege('authenticated', c.oid, 'DELETE') as authenticated_delete,
       has_table_privilege('authenticated', c.oid, 'TRUNCATE') as authenticated_truncate,
       has_table_privilege('service_role', c.oid, 'SELECT,INSERT,UPDATE,DELETE') as server_has_any_dml
from pg_class c where c.oid in (to_regclass('public.site_health_runs'),
  to_regclass('public.site_health_results'),to_regclass('public.site_health_issue_states'));
-- has_table_privilege with a comma list means ANY; check EACH server permission below.
select c.relname, p.privilege, has_table_privilege('service_role',c.oid,p.privilege) as allowed
from pg_class c cross join unnest(array['SELECT','INSERT','UPDATE','DELETE']) p(privilege)
where c.oid in (to_regclass('public.site_health_runs'),to_regclass('public.site_health_results'),
  to_regclass('public.site_health_issue_states'));

select tablename, policyname, roles, cmd,
       md5(coalesce(qual,'')) as using_md5, md5(coalesce(with_check,'')) as check_md5
from pg_policies where schemaname='public' and tablename in
  ('site_health_runs','site_health_results','site_health_issue_states');
select k.conrelid::regclass::text as relation, k.conname,
       pg_get_constraintdef(k.oid) as definition, k.convalidated
from pg_constraint k where k.conrelid in (to_regclass('public.site_health_runs'),
  to_regclass('public.site_health_results'),to_regclass('public.site_health_issue_states'));
select tablename,indexname,indexdef from pg_indexes where schemaname='public'
  and tablename in ('site_health_runs','site_health_results','site_health_issue_states');
select count(*) as recorded_runs, max(finished_at) as latest_finish,
       count(*) filter (where kind='manual' and finished_at is not null) as finished_manual_runs,
       count(distinct started_at::date) filter (where kind in ('baseline','full_crawl')
         and finished_at is not null and status in ('passed','warnings','failed')) as complete_nightly_dates
from public.site_health_runs;
select count(*) as recorded_results from public.site_health_results;
select count(*) as recorded_decisions from public.site_health_issue_states;
commit;
