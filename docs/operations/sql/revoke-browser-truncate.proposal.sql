-- PROPOSAL A: NOT APPROVED / NOT EXECUTED. Not an automatic migration.
-- Set the fingerprint only after live MCP identity, metadata review, backup confirmation
-- and one approval of the exact live change set. Inherited access is never fixed by
-- revoking role memberships or modifying roles; any such dependency aborts this proposal.
begin;
set local lock_timeout = '2s';
set local statement_timeout = '15s';

do $guard$
declare
  approved_catalog constant text := 'PENDING_RECHECK_AND_APPROVAL';
  actual_catalog text;
begin
  select md5(jsonb_build_object(
    'tables', (select jsonb_agg(jsonb_build_array(c.oid, c.relname, c.relowner, c.relacl::text) order by c.oid)
      from pg_class c join pg_namespace n on n.oid = c.relnamespace
      where n.nspname = 'public' and c.relkind in ('r', 'p')),
    'roles', (select jsonb_agg(jsonb_build_array(oid, rolname, rolsuper, rolinherit) order by oid) from pg_roles),
    'memberships', (select jsonb_agg(to_jsonb(m) order by roleid, member, grantor) from pg_auth_members m)
  )::text) into actual_catalog;
  if approved_catalog !~ '^[a-f0-9]{32}$' or actual_catalog is distinct from approved_catalog then
    raise exception 'Unapproved or changed table/grant/role catalog; stop and re-review';
  end if;
end $guard$;

-- Snapshot effective permissions for every role, including server/owner roles.
create temporary table agc_privileges_before on commit drop as
select r.oid as role_oid, c.oid as table_oid, p.privilege,
       has_table_privilege(r.oid, c.oid, p.privilege) as allowed
from pg_roles r cross join pg_class c
join pg_namespace n on n.oid = c.relnamespace
cross join unnest(array['SELECT','INSERT','UPDATE','DELETE','REFERENCES','TRIGGER','TRUNCATE']) p(privilege)
where n.nspname = 'public' and c.relkind in ('r', 'p');

do $change$
declare item record;
begin
  for item in select n.nspname, c.relname from pg_class c
    join pg_namespace n on n.oid = c.relnamespace
    where n.nspname = 'public' and c.relkind in ('r', 'p') order by c.oid
  loop
    execute format('REVOKE TRUNCATE ON TABLE %I.%I FROM PUBLIC, anon, authenticated RESTRICT', item.nspname, item.relname);
  end loop;
  if exists (
    select 1 from pg_temp.agc_privileges_before b join pg_roles r on r.oid = b.role_oid
    where (b.privilege <> 'TRUNCATE' or r.rolname in ('service_role', current_user)
      or r.oid in (select relowner from pg_class where oid = b.table_oid))
      and has_table_privilege(b.role_oid, b.table_oid, b.privilege) is distinct from b.allowed
  ) then raise exception 'A normal or server/owner privilege changed; transaction aborted'; end if;
  if exists (
    select 1 from pg_class c join pg_namespace n on n.oid = c.relnamespace
    cross join pg_roles browser cross join pg_roles reachable
    where n.nspname = 'public' and c.relkind in ('r', 'p')
      and browser.rolname in ('anon', 'authenticated')
      and pg_has_role(browser.oid, reachable.oid, 'MEMBER')
      and has_table_privilege(reachable.oid, c.oid, 'TRUNCATE')
  ) then raise exception 'Effective or reachable inherited TRUNCATE remains; stop without changing roles'; end if;
end $change$;

select count(*) as browser_roles_with_effective_truncate
from pg_roles r cross join pg_class c join pg_namespace n on n.oid = c.relnamespace
where n.nspname = 'public' and c.relkind in ('r', 'p')
  and r.rolname in ('anon', 'authenticated') and has_table_privilege(r.oid, c.oid, 'TRUNCATE');
-- Expected zero. Other permissions must have passed the assertions above.
commit;

-- RECOVERY IS SEPARATE: before approval, save the preflight-generated statements
-- with original grantor, grantee and grant option. Wrap those exact statements in
-- BEGIN/COMMIT after fresh review; do not restore with GRANT ALL or a blanket grant.
-- Default privileges are inspected but unchanged; future-table grants need a separate
-- creator-specific proposal if the preflight shows the problem would recur.
