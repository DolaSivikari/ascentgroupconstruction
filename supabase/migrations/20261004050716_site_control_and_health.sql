-- 0003_site_control_and_health.sql  (v2, hardened after risk review — see file 16)
-- DRAFT FOR OWNER REVIEW. Not applied. Independent of 0001/0002.
--
-- v2 changes:
--   * page_settings table removed. Page SEO/hero/hidden settings are content entries of kind
--     'seo' / 'image' / 'flag', so they get the same draft -> preview -> publish -> history -> rollback
--     protection as text. Nothing an admin types goes live without an explicit Publish.
--   * site_flags: global kill switch + "admins only" canary mode for overrides, readable by visitors.
--   * default_hash on entries: detects when the code default changed after an override was published.
--   * Size/type checks on stored values; key namespace check; publish refuses empty drafts.
--   * site_health_issue_states: Fixed / Ignore decisions survive across runs (fingerprint-based).
--
-- Applying this changes nothing visible: no entries exist, and site_flags starts with overrides OFF.
--
begin;

-- ---------------------------------------------------------------------------
-- 1. Site flags (kill switch / canary). Read by every visitor at app start.
-- ---------------------------------------------------------------------------
create table public.site_flags (
  key         text primary key check (key in ('content_overrides', 'content_overrides_admin_only')),
  enabled     boolean not null,
  updated_at  timestamptz not null default now(),
  updated_by  uuid references public.profiles(id) on delete set null
);
insert into public.site_flags (key, enabled) values
  ('content_overrides', false),              -- master switch: false = every page shows code defaults
  ('content_overrides_admin_only', true);    -- canary: when true, only signed-in admins see overrides

-- ---------------------------------------------------------------------------
-- 2. Content entries: overrides for code-defined content (text, rich text, images, links, lists,
--    page SEO, page flags). The code module defines every key, its kind, schema and default.
-- ---------------------------------------------------------------------------
create table public.content_entries (
  id               uuid primary key default gen_random_uuid(),
  key              text not null unique
                     check (key ~ '^[a-z0-9-]+(\.[a-z0-9_-]+){1,6}$' and char_length(key) <= 150),
  page_id          text not null check (page_id ~ '^[a-z0-9-]+(:[a-z0-9-]+)?$' and char_length(page_id) <= 120),
  kind             text not null check (kind in ('text','richtext','image','link','list','seo','flag')),
  draft_value      jsonb check (draft_value is null or octet_length(draft_value::text) <= 20000),
  published_value  jsonb check (published_value is null or octet_length(published_value::text) <= 20000),
  default_hash     text check (default_hash is null or char_length(default_hash) <= 64),  -- hash of code default at publish time
  published_at     timestamptz,
  published_by     uuid references public.profiles(id) on delete set null,
  updated_at       timestamptz not null default now(),
  updated_by       uuid default auth.uid() references public.profiles(id) on delete set null
);
create index content_entries_page_idx on public.content_entries (page_id);

create table public.content_entry_versions (
  id            uuid primary key default gen_random_uuid(),
  entry_id      uuid not null references public.content_entries(id) on delete cascade,
  value         jsonb,          -- published value at that time; null = reverted to code default
  default_hash  text,
  published_at  timestamptz not null default now(),
  published_by  uuid references public.profiles(id) on delete set null
);
create index content_entry_versions_entry_idx on public.content_entry_versions (entry_id, published_at desc);

-- Publish several entries in one transaction (a whole page at once). _default_hashes aligns with _ids.
-- Passing a NULL draft publishes "revert to code default" for that entry.
create or replace function public.publish_content_entries(_ids uuid[], _default_hashes text[])
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  i int;
  n int := 0;
begin
  if not public.is_admin(auth.uid()) then
    raise exception 'Admins only' using errcode = '42501';
  end if;
  if _ids is null or array_length(_ids, 1) is null then
    return 0;
  end if;
  if array_length(_ids, 1) > 200 or array_length(_ids, 1) <> coalesce(array_length(_default_hashes, 1), -1) then
    raise exception 'Invalid publish batch' using errcode = '22023';
  end if;
  for i in 1 .. array_length(_ids, 1) loop
    update public.content_entries
       set published_value = draft_value,
           default_hash    = _default_hashes[i],
           published_at    = now(),
           published_by    = auth.uid(),
           updated_at      = now(),
           updated_by      = auth.uid()
     where id = _ids[i];
    if not found then
      raise exception 'Content entry % not found', _ids[i] using errcode = 'P0002';
    end if;
    insert into public.content_entry_versions (entry_id, value, default_hash, published_by)
    select id, published_value, default_hash, auth.uid() from public.content_entries where id = _ids[i];
    n := n + 1;
  end loop;
  return n;
end;
$$;

create or replace function public.rollback_content_entry(_version_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  e uuid; v jsonb; h text;
begin
  if not public.is_admin(auth.uid()) then
    raise exception 'Admins only' using errcode = '42501';
  end if;
  select entry_id, value, default_hash into e, v, h from public.content_entry_versions where id = _version_id;
  if not found then
    raise exception 'Version not found' using errcode = 'P0002';
  end if;
  update public.content_entries
     set draft_value = v, published_value = v, default_hash = h, published_at = now(),
         published_by = auth.uid(), updated_at = now(), updated_by = auth.uid()
   where id = e;
  insert into public.content_entry_versions (entry_id, value, default_hash, published_by)
  values (e, v, h, auth.uid());
end;
$$;

create or replace function public.set_site_flag(_key text, _enabled boolean)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_admin(auth.uid()) then
    raise exception 'Admins only' using errcode = '42501';
  end if;
  update public.site_flags set enabled = _enabled, updated_at = now(), updated_by = auth.uid() where key = _key;
  if not found then
    raise exception 'Unknown flag' using errcode = 'P0002';
  end if;
end;
$$;

revoke all on function public.publish_content_entries(uuid[], text[]) from public, anon;
revoke all on function public.rollback_content_entry(uuid)            from public, anon;
revoke all on function public.set_site_flag(text, boolean)            from public, anon;
grant execute on function public.publish_content_entries(uuid[], text[]) to authenticated;
grant execute on function public.rollback_content_entry(uuid)            to authenticated;
grant execute on function public.set_site_flag(text, boolean)            to authenticated;

-- ---------------------------------------------------------------------------
-- 3. Site health (written only by the ingest-site-health function with the service role)
-- ---------------------------------------------------------------------------
create table public.site_health_runs (
  id             uuid primary key default gen_random_uuid(),
  started_at     timestamptz not null default now(),
  finished_at    timestamptz,
  kind           text not null check (kind in ('full_crawl','baseline','manual')),
  target_origin  text not null check (target_origin ~ '^https://'),
  commit_ref     text check (commit_ref is null or char_length(commit_ref) <= 80),
  pages_checked  integer not null default 0 check (pages_checked >= 0),
  errors         integer not null default 0 check (errors >= 0),
  warnings       integer not null default 0 check (warnings >= 0),
  status         text not null default 'running' check (status in ('running','passed','warnings','failed','aborted','blocked'))
);
create index site_health_runs_started_idx on public.site_health_runs (kind, started_at desc);

create table public.site_health_results (
  id               uuid primary key default gen_random_uuid(),
  run_id           uuid not null references public.site_health_runs(id) on delete cascade,
  path             text not null check (char_length(path) <= 500),
  viewport         text not null default 'desktop' check (viewport in ('desktop','mobile')),
  http_status      integer,
  load_ms          integer check (load_ms is null or load_ms >= 0),
  title            text check (title is null or char_length(title) <= 300),
  h1               text check (h1 is null or char_length(h1) <= 300),
  canonical        text check (canonical is null or char_length(canonical) <= 500),
  text_hash        text check (text_hash is null or char_length(text_hash) <= 64),  -- visible-text fingerprint for change detection
  console_errors   integer not null default 0,
  failed_requests  integer not null default 0,
  -- [{ "code": "broken_link", "severity": "error|warning|info", "message": "...", "target": "/x", "fingerprint": "sha" }]
  issues           jsonb not null default '[]'::jsonb
                     check (jsonb_typeof(issues) = 'array' and octet_length(issues::text) <= 100000),
  checked_at       timestamptz not null default now()
);
create index site_health_results_run_idx  on public.site_health_results (run_id);
create index site_health_results_path_idx on public.site_health_results (path, checked_at desc);

create table public.site_health_issue_states (
  fingerprint  text primary key check (char_length(fingerprint) <= 64),   -- sha of code + path + target
  state        text not null check (state in ('fixed','ignored')),
  reason       text check (reason is null or char_length(reason) <= 500),
  updated_at   timestamptz not null default now(),
  updated_by   uuid default auth.uid() references public.profiles(id) on delete set null
);

-- ---------------------------------------------------------------------------
-- 4. RLS and grants
-- ---------------------------------------------------------------------------
alter table public.site_flags               enable row level security;
alter table public.content_entries          enable row level security;
alter table public.content_entry_versions   enable row level security;
alter table public.site_health_runs         enable row level security;
alter table public.site_health_results      enable row level security;
alter table public.site_health_issue_states enable row level security;

revoke all on public.site_flags, public.content_entries, public.content_entry_versions,
              public.site_health_runs, public.site_health_results, public.site_health_issue_states
  from public, anon, authenticated;
grant all on public.site_flags, public.content_entries, public.content_entry_versions,
             public.site_health_runs, public.site_health_results, public.site_health_issue_states
  to service_role;

-- Visitors (anon) and signed-in users both read flags and published values only.
grant select (key, enabled) on public.site_flags to anon, authenticated;
create policy "Everyone reads site flags" on public.site_flags for select to anon, authenticated using (true);

grant select (id, key, page_id, kind, published_value, published_at) on public.content_entries to anon;
create policy "Visitors read published content" on public.content_entries
  for select to anon using (published_value is not null);

-- Admins: read everything (including drafts), create entries, edit drafts only.
grant select, insert, delete on public.content_entries to authenticated;
grant update (draft_value, updated_at, updated_by) on public.content_entries to authenticated;
-- Signed-in NON-admins get no rows (column grants cannot differ per user, so drafts would leak
-- otherwise). The public loader treats "no rows" as "use code defaults", so they simply see defaults.
create policy "Admins read all content" on public.content_entries
  for select to authenticated using (public.is_admin(auth.uid()));
create policy "Admins create content entries" on public.content_entries
  for insert to authenticated with check (public.is_admin(auth.uid()) and published_value is null);
create policy "Admins edit drafts" on public.content_entries
  for update to authenticated using (public.is_admin(auth.uid())) with check (public.is_admin(auth.uid()));
create policy "Super admins delete content entries" on public.content_entries
  for delete to authenticated using (public.has_role(auth.uid(), 'super_admin'));

grant select on public.content_entry_versions to authenticated;
create policy "Admins read content versions" on public.content_entry_versions
  for select to authenticated using (public.is_admin(auth.uid()));

grant select on public.site_health_runs, public.site_health_results to authenticated;
create policy "Admins read health runs" on public.site_health_runs
  for select to authenticated using (public.is_admin(auth.uid()));
create policy "Admins read health results" on public.site_health_results
  for select to authenticated using (public.is_admin(auth.uid()));

grant select, insert, update, delete on public.site_health_issue_states to authenticated;
create policy "Admins manage issue states" on public.site_health_issue_states
  for all to authenticated using (public.is_admin(auth.uid())) with check (public.is_admin(auth.uid()));

commit;

-- Verification after apply (read-only unless noted):
--   select * from public.site_flags;                       -- content_overrides=false, admin_only=true
--   set role anon; select key, enabled from public.site_flags; reset role;      -- works
--   set role anon; select draft_value from public.content_entries; reset role;  -- must FAIL (permission denied)
-- Retention: delete site_health_* rows older than 90 days (job drafted later; not scheduled here).
