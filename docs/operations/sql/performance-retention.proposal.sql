-- PROPOSAL C ONLY: NOT APPROVED / NOT EXECUTED. No recurring retention job.
-- Fixed 90-day cutoff relative to 2026-10-13 00:00 UTC: 2026-07-15 00:00 UTC.
-- NULL recorded_at is retained. Snapshot's 2,149 old rows is NOT a verified count
-- for this exact midnight boundary. Freeze the rechecked count after approval.
-- Confirm managed backup/point-in-time recovery AND a tested protected export first.
begin;
set local lock_timeout = '2s';
set local statement_timeout = '15s';
set local timezone = 'UTC';
lock table public.performance_metrics in share row exclusive mode;
do $guard$
declare
  approved_rows constant bigint := -1; -- replace only after exact-set approval
  approved_set_md5 constant text := 'PENDING_RECHECK_AND_APPROVAL';
  eligible bigint;
  actual_set_md5 text;
begin
  if approved_rows < 0 then raise exception 'Retention is not approved'; end if;
  if exists (select 1 from pg_constraint where contype = 'f'
    and confrelid = 'public.performance_metrics'::regclass) then
    raise exception 'Referencing foreign key found; investigate before deleting';
  end if;
  if exists (select 1 from pg_trigger where tgrelid = 'public.performance_metrics'::regclass
    and not tgisinternal and tgenabled <> 'D') then
    raise exception 'Metrics trigger found; investigate its effects before deleting';
  end if;
  select count(*), md5(coalesce(string_agg(to_jsonb(metrics)::text, E'\n' order by id), ''))
    into eligible, actual_set_md5 from public.performance_metrics metrics
    where recorded_at < '2026-07-15 00:00:00+00'::timestamptz;
  if eligible <> approved_rows or actual_set_md5 is distinct from approved_set_md5 then
    raise exception 'Eligible count or set drifted; re-review';
  end if;
end $guard$;

create temporary table agc_retention_before on commit drop as
select count(*) as eligible from public.performance_metrics
where recorded_at < '2026-07-15 00:00:00+00'::timestamptz;
-- Separate restricted archive; not in the public API schema. Refuse collisions.
create schema agc_metrics_archive_20261013;
revoke all on schema agc_metrics_archive_20261013 from PUBLIC, anon, authenticated;
create table agc_metrics_archive_20261013.performance_metrics as
  select * from public.performance_metrics with no data;
alter table agc_metrics_archive_20261013.performance_metrics add primary key (id);
revoke all on agc_metrics_archive_20261013.performance_metrics from PUBLIC, anon, authenticated;
alter table agc_metrics_archive_20261013.performance_metrics enable row level security;

-- Every deleted row must enter the archive in the same transaction. Any insert,
-- constraint or timeout failure rolls back the DELETE and archive creation.
with removed as (
  delete from public.performance_metrics
  where recorded_at < '2026-07-15 00:00:00+00'::timestamptz returning *
)
insert into agc_metrics_archive_20261013.performance_metrics select * from removed;
do $verify$
begin
  if (select count(*) from agc_metrics_archive_20261013.performance_metrics)
      <> (select eligible from pg_temp.agc_retention_before)
    or exists (select 1 from public.performance_metrics
      where recorded_at < '2026-07-15 00:00:00+00'::timestamptz) then
    raise exception 'Retention verification mismatch; transaction aborted';
  end if;
end $verify$;
select count(*) as archived_rows from agc_metrics_archive_20261013.performance_metrics;
select count(*) filter (where recorded_at < '2026-07-15 00:00:00+00'::timestamptz) as old_rows_remaining,
       count(*) filter (where recorded_at is null) as unknown_age_retained
from public.performance_metrics;
commit;

-- No error_logs, audit_log, content_versions, inquiries, media or accounts changed.
-- DELETE usually makes space reusable; it does not shrink relation files immediately.
-- This protected in-database archive can increase total allocated size. Exporting it
-- elsewhere and eventually removing it require separate approval; no DROP or VACUUM FULL.
