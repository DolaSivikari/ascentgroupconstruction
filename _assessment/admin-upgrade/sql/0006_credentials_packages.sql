-- DRAFT ONLY. Owner review and a backup are required before separate activation.
-- No existing document contents, credential claims or roles are changed.
begin;
create table public.credential_packages (
 id uuid primary key,
 title text not null check (char_length(btrim(title)) between 1 and 200),
 document_ids uuid[] not null check (cardinality(document_ids) between 1 and 20),
 file_path text not null,
 token_hash text not null unique check (token_hash ~ '^[a-f0-9]{64}$'),
 expires_at timestamptz not null,
 created_at timestamptz not null default now(),
 created_by uuid references public.profiles(id) on delete set null,
 revoked_at timestamptz,
 open_count integer not null default 0,
 last_opened_at timestamptz
);
alter table public.credential_packages enable row level security;
revoke all on public.credential_packages from anon, authenticated;
grant select on public.credential_packages to authenticated;
grant all on public.credential_packages to service_role;
create policy "Admins read credential packages" on public.credential_packages
 for select to authenticated using (public.is_admin(auth.uid()));
create function public.register_credential_package(_id uuid, _title text, _document_ids uuid[], _file_path text, _token_hash text, _expires_at timestamptz)
returns uuid language plpgsql security definer set search_path=public as $$
declare n integer;
begin
 if not public.is_admin(auth.uid()) then raise exception 'Admins only' using errcode='42501'; end if;
 if _expires_at <= now() or _expires_at > now()+interval '7 days' or _file_path <> 'packages/'||_id::text||'/package.pdf' then raise exception 'Invalid package'; end if;
 if cardinality(_document_ids) not between 1 and 20 or cardinality(_document_ids) <> (select count(distinct d) from unnest(_document_ids) d) then raise exception 'Invalid document selection'; end if;
 select count(*) into n from public.documents_library
 where id=any(_document_ids) and is_active and requires_authentication
 and file_url like 'restricted:%' and (expiry_date is null or expiry_date >= (now() at time zone 'America/Toronto')::date);
 if n <> cardinality(_document_ids) then raise exception 'Every document must be active, private and not expired'; end if;
 if not exists(select 1 from storage.objects where bucket_id='documents-restricted' and name=_file_path) then raise exception 'Upload package PDF first'; end if;
 insert into public.credential_packages(id,title,document_ids,file_path,token_hash,expires_at,created_by)
 values(_id,btrim(_title),_document_ids,_file_path,_token_hash,_expires_at,auth.uid());
 return _id;
end; $$;
create function public.revoke_credential_package(_id uuid)
returns void language plpgsql security definer set search_path=public as $$
begin
 if not public.is_admin(auth.uid()) then raise exception 'Admins only' using errcode='42501'; end if;
 update public.credential_packages set revoked_at=now() where id=_id;
 if not found then raise exception 'Package not found'; end if;
end; $$;
create function public.record_credential_package_open(_id uuid)
returns void language sql security definer set search_path=public as $$
 update public.credential_packages set open_count=open_count+1,last_opened_at=now()
 where id=_id and revoked_at is null and expires_at>now();
$$;
revoke all on function public.register_credential_package(uuid,text,uuid[],text,text,timestamptz), public.revoke_credential_package(uuid), public.record_credential_package_open(uuid) from public, anon, authenticated;
grant execute on function public.register_credential_package(uuid,text,uuid[],text,text,timestamptz), public.revoke_credential_package(uuid) to authenticated;
grant execute on function public.record_credential_package_open(uuid) to service_role;
commit;
-- Rollback after exporting package records:
-- drop table public.credential_packages;
-- drop function public.register_credential_package(uuid,text,uuid[],text,text,timestamptz), public.revoke_credential_package(uuid), public.record_credential_package_open(uuid);
-- Private PDF uploads are deliberately retained; remove only identified generated packages.
