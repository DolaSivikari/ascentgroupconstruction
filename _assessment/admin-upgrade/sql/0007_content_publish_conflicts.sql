-- DRAFT ONLY: not applied. Requires reviewed 0003 content objects.
-- Application publication and undo use expected revision timestamps. No role changes.
begin;
create or replace function public.publish_content_entries_checked(
  _ids uuid[], _default_hashes text[], _expected_updated_ats timestamptz[]
) returns integer language plpgsql security definer set search_path = public as $$
declare r record; position integer;
begin
  if not coalesce(public.is_admin(auth.uid()), false) then
    raise exception 'Admins only' using errcode = '42501';
  end if;
  if coalesce(cardinality(_ids),0) < 1 or cardinality(_ids) > 200
     or cardinality(_ids) is distinct from cardinality(_default_hashes)
     or cardinality(_ids) is distinct from cardinality(_expected_updated_ats)
     or exists(select 1 from unnest(_ids) x where x is null)
     or exists(select 1 from unnest(_expected_updated_ats) x where x is null)
     or (select count(distinct x) from unnest(_ids) x) <> cardinality(_ids) then
    raise exception 'Invalid publish batch' using errcode = '22023';
  end if;
  -- Stable lock order avoids deadlocks between overlapping page batches.
  for r in select id, updated_at from public.content_entries where id = any(_ids) order by id for update loop
    position := array_position(_ids, r.id);
    if r.updated_at is distinct from _expected_updated_ats[position] then
      raise exception 'Draft changed. Reload before publishing.' using errcode = '40001';
    end if;
  end loop;
  if (select count(*) from public.content_entries where id = any(_ids)) <> cardinality(_ids) then
    raise exception 'Content entry missing' using errcode = 'P0002';
  end if;
  return public.publish_content_entries(_ids, _default_hashes);
end;
$$;
create or replace function public.rollback_content_entry_checked(
  _version_id uuid, _entry_id uuid, _expected_updated_at timestamptz
) returns void language plpgsql security definer set search_path = public as $$
declare actual timestamptz;
begin
  if not coalesce(public.is_admin(auth.uid()), false) then
    raise exception 'Admins only' using errcode = '42501';
  end if;
  select updated_at into actual from public.content_entries where id = _entry_id for update;
  if not found or _expected_updated_at is null or actual is distinct from _expected_updated_at then
    raise exception 'Entry changed. Reload before undoing.' using errcode = '40001';
  end if;
  if not exists(select 1 from public.content_entry_versions where id = _version_id and entry_id = _entry_id) then
    raise exception 'Version does not belong to this entry' using errcode = '22023';
  end if;
  perform public.rollback_content_entry(_version_id);
end;
$$;
revoke all on function public.publish_content_entries_checked(uuid[],text[],timestamptz[]),
  public.rollback_content_entry_checked(uuid,uuid,timestamptz) from public, anon;
grant execute on function public.publish_content_entries_checked(uuid[],text[],timestamptz[]),
  public.rollback_content_entry_checked(uuid,uuid,timestamptz) to authenticated;
-- The checked wrappers call these internally as owner; clients cannot bypass revision checks.
revoke execute on function public.publish_content_entries(uuid[],text[]),
  public.rollback_content_entry(uuid) from authenticated;
commit;
-- Rollback (review first): restore the two original authenticated execute grants, then
-- drop the two *_checked functions. This does not remove content or history.
