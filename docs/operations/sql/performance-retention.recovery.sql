-- SEPARATE RECOVERY DRAFT: NOT APPROVED / NOT EXECUTED. Never append to activation.
-- Review current column compatibility, triggers and identity/backup status first.
begin;
set local lock_timeout = '2s';
set local statement_timeout = '15s';
lock table public.performance_metrics in share row exclusive mode;
do $guard$
begin
  raise exception 'Recovery requires a separate reviewed approval; remove this guard only then';
end $guard$;

-- Stop if any archived ID already exists. Do not silently skip or overwrite rows.
do $verify$
begin
  if exists (select 1 from public.performance_metrics live
    join agc_metrics_archive_20261013.performance_metrics archived using (id)) then
    raise exception 'Recovery ID collision; stop and investigate';
  end if;
end $verify$;
insert into public.performance_metrics (id, metric_type, metric_name, value, unit, metadata, recorded_at)
select id, metric_type, metric_name, value, unit, metadata, recorded_at
from agc_metrics_archive_20261013.performance_metrics;
do $verify$
begin
  if exists (select 1 from agc_metrics_archive_20261013.performance_metrics archived
    left join public.performance_metrics live using (id)
    where live.id is null or to_jsonb(live) is distinct from to_jsonb(archived)) then
    raise exception 'Recovered rows differ from the archive; transaction aborted';
  end if;
end $verify$;
select count(*) as mismatches from agc_metrics_archive_20261013.performance_metrics archived
left join public.performance_metrics live using (id)
where live.id is null or to_jsonb(live) is distinct from to_jsonb(archived);
-- Expected zero. Keep the archive and backup; do not drop either in this recovery.
commit;
