-- DRAFT FOR OWNER REVIEW. Not applied by Codex.
-- Isolates the reviewed role function and table guard from 0001.
-- No inquiry tables, intake, alerts or public form changes.
-- Apply after backup/preflight; ensure at least one existing super admin.
begin;
lock table public.user_roles in share row exclusive mode;
do $$ begin if not exists (select 1 from public.user_roles where role = 'super_admin') then raise exception 'Preflight required: add a super admin before enabling the guard'; end if; end $$;
drop trigger if exists user_roles_guard_last_super_admin_delete on public.user_roles;
drop trigger if exists user_roles_guard_last_super_admin_update on public.user_roles;
create or replace function public.guard_last_super_admin()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if current_setting('transaction_isolation') <> 'read committed' then
    raise exception 'Role changes require READ COMMITTED isolation' using errcode = '0A000';
  end if;
  if exists (select 1 from removed_rows where role = 'super_admin') then
    perform pg_advisory_xact_lock(hashtext('public.user_roles.super_admin'));
    if not exists (select 1 from public.user_roles where role = 'super_admin') then
      raise exception 'At least one super admin must remain' using errcode = '23514';
    end if;
  end if;
  return null;
end;
$$;

create trigger user_roles_guard_last_super_admin_delete
after delete on public.user_roles
referencing old table as removed_rows
for each statement execute function public.guard_last_super_admin();

create trigger user_roles_guard_last_super_admin_update
after update on public.user_roles
referencing old table as removed_rows
for each statement execute function public.guard_last_super_admin();


revoke all on function public.guard_last_super_admin() from public, anon, authenticated;
create or replace function public.set_user_role(_user_id uuid, _role public.app_role)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  perform pg_advisory_xact_lock(hashtext('public.user_roles.super_admin'));
  -- Recheck authorization after acquiring the lock: another transaction may have
  -- revoked the caller's super-admin role while this request waited.
  if not public.has_role(auth.uid(), 'super_admin') then
    raise exception 'Only a super admin can change roles' using errcode = '42501';
  end if;
  -- Insert first, then remove the others: re-saving a sole super admin as super_admin never
  -- passes through a zero-super-admin state.
  insert into public.user_roles (user_id, role) values (_user_id, _role)
  on conflict (user_id, role) do nothing;
  delete from public.user_roles where user_id = _user_id and role <> _role;
end;
$$;
revoke all on function public.set_user_role(uuid, public.app_role) from public, anon;
grant execute on function public.set_user_role(uuid, public.app_role) to authenticated;
commit;
-- Verify: inspect pg_trigger for both user_roles_guard_last_super_admin triggers
-- and pg_proc for set_user_role(uuid,app_role). Do not test by demoting a real user.
-- Rollback only after reverting the Users UI and retaining at least two super admins:
-- begin;
-- drop trigger if exists user_roles_guard_last_super_admin_delete on public.user_roles;
-- drop trigger if exists user_roles_guard_last_super_admin_update on public.user_roles;
-- drop function if exists public.set_user_role(uuid, public.app_role);
-- drop function if exists public.guard_last_super_admin();
-- commit;
