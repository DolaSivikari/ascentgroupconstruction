-- DRAFT FOR OWNER REVIEW. Codex has not applied this SQL.
-- Apply through Lovable after a backup and the read-only preflight.
-- Separate from lead intake: no form, inquiry, email or secret changes.
-- Existing storage objects and captions remain unchanged.
begin;

create table if not exists public.media_asset_metadata (
  bucket_id text not null default 'project-images' check (bucket_id = 'project-images'),
  path text not null check (path <> '' and path !~ '(^|/)\.\.(/|$)'),
  alt_text text not null default '' check (char_length(alt_text) <= 500),
  updated_at timestamptz not null default now(),
  primary key (bucket_id, path)
);
alter table public.media_asset_metadata enable row level security;
revoke all on public.media_asset_metadata from public, anon, authenticated;
grant select (bucket_id, path, alt_text, updated_at) on public.media_asset_metadata to anon, authenticated;
grant insert, update, delete on public.media_asset_metadata to authenticated;
grant all on public.media_asset_metadata to service_role;
drop policy if exists "Public image descriptions" on public.media_asset_metadata;
create policy "Public image descriptions" on public.media_asset_metadata for select to anon, authenticated using (bucket_id = 'project-images');
drop policy if exists "Admins manage image descriptions" on public.media_asset_metadata;
create policy "Admins manage image descriptions" on public.media_asset_metadata for all to authenticated using (public.is_admin(auth.uid())) with check (public.is_admin(auth.uid()));

alter table public.project_images add column if not exists alt_text text check (alt_text is null or char_length(alt_text) <= 500);
-- Preserve existing gallery RLS; this grants only the new public image-description column.
grant select (alt_text) on public.project_images to anon, authenticated;
grant insert (alt_text), update (alt_text) on public.project_images to authenticated;

-- Reuse the established audit function and admin-only audit_log policies.
-- Missing required tables/function abort this draft instead of silently claiming coverage.
do $$
declare content_table text;
begin
  if to_regprocedure('public.log_sensitive_access()') is null then
    raise exception 'Preflight required: log_sensitive_access() is missing';
  end if;
  foreach content_table in array array['services', 'blog_posts', 'site_settings', 'footer_settings', 'contact_page_settings', 'about_page_settings', 'hero_slides', 'media_asset_metadata'] loop
    if to_regclass(format('public.%I', content_table)) is null then
      raise exception 'Preflight required: % is missing', content_table;
    end if;
    -- Metadata has a composite key instead of the id expected by the old audit function.
    if content_table <> 'media_asset_metadata' then
      execute format('drop trigger if exists admin_content_audit on public.%I', content_table);
      execute format('create trigger admin_content_audit after insert or update or delete on public.%I for each row execute function public.log_sensitive_access()', content_table);
    end if;
  end loop;
end $$;
commit;

-- Read-only verification:
-- select has_column_privilege('anon', 'public.project_images', 'alt_text', 'SELECT');
-- select tablename, policyname from pg_policies where tablename = 'media_asset_metadata';
-- select event_object_table, trigger_name from information_schema.triggers where trigger_name = 'admin_content_audit';
-- About editor separately needs 0002 and the column grants described in that reviewed draft.
-- Rollback (after reverting the UI; exported alt text is lost if columns/table are dropped):
-- begin;
-- do $$ declare t text; begin foreach t in array array['services','blog_posts','site_settings','footer_settings','contact_page_settings','about_page_settings','hero_slides'] loop execute format('drop trigger if exists admin_content_audit on public.%I', t); end loop; end $$;
-- alter table public.project_images drop column if exists alt_text;
-- drop table if exists public.media_asset_metadata;
-- commit;
