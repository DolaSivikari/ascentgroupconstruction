-- DISPOSABLE LOCAL POSTGRES ONLY. Never run against Lovable/Supabase.
do $$ begin
  if exists (select 1 from pg_class c join pg_namespace n on n.oid = c.relnamespace
    where n.nspname = 'public' and c.relkind in ('r','p'))
    or exists (select 1 from pg_roles where rolname in ('anon','authenticated','service_role')) then
    raise exception 'Fixture requires a fresh disposable database';
  end if;
end $$;
create role anon;
create role authenticated;
create role service_role;
create table public.performance_metrics (
  id uuid primary key default gen_random_uuid(), metric_type text not null,
  metric_name text not null, value numeric not null, unit text,
  metadata jsonb default '{}'::jsonb, recorded_at timestamptz default now()
);
create table public.error_logs (id integer primary key, created_at timestamptz);
create table public.audit_log (id integer primary key);
create table public.content_versions (id integer primary key);
create table public.service_recommendations_cache (id integer primary key);
alter table public.performance_metrics enable row level security;
alter table public.error_logs enable row level security;
alter table public.audit_log enable row level security;
alter table public.content_versions enable row level security;
alter table public.service_recommendations_cache enable row level security;
grant select, insert, update, delete, references, trigger, truncate on all tables in schema public to PUBLIC, anon, authenticated;
grant all on all tables in schema public to service_role;
insert into public.performance_metrics (metric_type, metric_name, value, recorded_at) values
  ('fixture','LCP',1,'2026-07-14T23:59:59Z'), ('fixture','LCP',2,'2026-01-01T00:00:00Z'),
  ('fixture','LCP',3,'2026-07-15T00:00:00Z'), ('fixture','LCP',4,'2026-10-13T00:00:00Z'),
  ('fixture','LCP',5,null);
insert into public.error_logs values (1,'2020-01-01T00:00:00Z');
insert into public.audit_log values (1);
insert into public.content_versions values (1);
