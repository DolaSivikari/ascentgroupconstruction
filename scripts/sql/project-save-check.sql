-- Disposable PostgreSQL fixture only; never run against the connected project.
set role authenticated;
set request.jwt.claim.sub = '00000000-0000-4000-8000-000000000001';
do $$
declare first jsonb; current_row public.projects%rowtype; pid uuid; initial_time timestamptz;
begin
  first := public.save_project_atomic(null,null,'{"slug":"fixture","title":"Fixture","publish_state":"published"}',
    '[{"url":"https://example.test/one.webp","category":"gallery","featured":false}]',array['00000000-0000-4000-8000-000000000002'::uuid]);
  pid := (first->'project'->>'id')::uuid;
  initial_time := (first->'project'->>'updated_at')::timestamptz;
  if (select count(*) from project_images where project_id=pid) <> 1 then raise exception 'Missing image'; end if;
  if (select count(*) from project_services where project_id=pid) <> 1 then raise exception 'Missing service'; end if;
  begin
    perform public.save_project_atomic(pid,initial_time,'{"title":"Should roll back"}', '[]',array['00000000-0000-4000-8000-000000000099'::uuid]);
    raise exception 'Expected foreign key failure';
  exception when foreign_key_violation then null; end;
  select * into current_row from projects where id=pid;
  if current_row.title <> 'Fixture' or current_row.updated_at is distinct from initial_time then raise exception 'Parent failed rollback'; end if;
  if (select count(*) from project_images where project_id=pid) <> 1 then raise exception 'Gallery failed rollback'; end if;
  perform public.save_project_atomic(pid,initial_time,'{"title":"Updated"}', '[]','{}');
  begin
    perform public.save_project_atomic(pid,initial_time,'{"title":"Stale overwrite"}', '[]','{}');
    raise exception 'Expected concurrency conflict';
  exception when serialization_failure then null; end;
  if (select title from projects where id=pid) <> 'Updated' then raise exception 'Conflict overwrote content'; end if;
  begin
    perform public.save_project_atomic(null,null,'{"slug":"broken","title":"Broken"}', '[{"url":"","category":"gallery"}]','{}');
    raise exception 'Expected invalid image failure';
  exception when invalid_parameter_value then null; end;
  if exists(select 1 from projects where slug='broken') then raise exception 'New project escaped rollback'; end if;
end $$;
set request.jwt.claim.sub = '00000000-0000-4000-8000-000000000099';
do $$ begin
  begin
    perform public.save_project_atomic(null,null,'{"slug":"denied","title":"Denied"}', '[]','{}');
    raise exception 'Expected admin denial';
  exception when insufficient_privilege then null; end;
end $$;
reset role;
do $$ begin
  if has_function_privilege('anon','public.save_project_atomic(uuid,timestamptz,jsonb,jsonb,uuid[])','execute') then
    raise exception 'Anonymous execute grant';
  end if;
end $$;
select 'Project transaction, rollback, concurrency and authorization checks passed' as result;
