-- 0001_inquiries_workflow.sql  (v2, 3 October 2026)
-- DRAFT FOR OWNER REVIEW. Not applied. Do not place in supabase/migrations until approved.
--
-- v2 changes after external review:
--   * Bell notification and activity-log writes in the insert trigger are isolated in their own
--     sub-transaction, so a notification failure can no longer roll back the lead itself.
--   * Last-super-admin protection moved into statement-level triggers on user_roles (covers the
--     existing direct-write policy and the invite-user function), serialised with an advisory lock
--     so two simultaneous demotions cannot both succeed.
--   * Submission idempotency: inquiries.submission_key (unique) lets submit-form return the
--     existing row on a retried POST instead of creating a duplicate or sending a second alert.
--   * Per-recipient alert outcomes in inquiry_alert_deliveries; inquiries.alert_status is a summary
--     that now includes 'partial'. A short send lease (alert_lease_until) prevents two concurrent
--     sends and lets a crashed send be retried after it expires.
--   * Rollback section completed.
--
-- Apply through Lovable only after:
--   (a) 0000_preflight_readonly.sql results have been reviewed (queries 1-14), and
--   (b) a backup was taken: Cloud -> Overview -> Advanced settings -> Export data.
-- Additive except: admin_notifications_notification_type_check is widened, and two triggers are
-- added to user_roles (they only refuse statements that would leave zero super admins).

begin;

-- ---------------------------------------------------------------------------
-- 1. admin_notifications: allow 'inquiry' and 'email_failure'
--    ('email_failure' is already sent by send-rfp-notification and currently rejected).
-- ---------------------------------------------------------------------------
alter table public.admin_notifications
  drop constraint if exists admin_notifications_notification_type_check;
alter table public.admin_notifications
  add constraint admin_notifications_notification_type_check
  check (notification_type = any (array[
    'rfp','contact','resume','prequal','quote','newsletter','inquiry','email_failure'
  ]));

-- ---------------------------------------------------------------------------
-- 2. inquiries
-- ---------------------------------------------------------------------------
create table public.inquiries (
  id                    uuid primary key default gen_random_uuid(),
  reference_code        text generated always as ('INQ-' || upper(substr(replace(id::text,'-',''),1,8))) stored,
  submission_key        uuid,                -- generated once per form fill in the browser; retries reuse it
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now(),

  inquiry_type          text not null
    check (inquiry_type in ('general','estimate','bid_invitation','rfp','prequal_request')),
  status                text not null default 'new'
    check (status in ('new','reviewing','bidding','submitted','won','lost','no_bid')),
  status_changed_at     timestamptz not null default now(),
  priority              text not null default 'normal'
    check (priority in ('urgent','high','normal','low')),

  contact_name          text not null check (char_length(btrim(contact_name)) between 1 and 200),
  email                 text not null check (char_length(email) <= 320 and email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  phone                 text check (phone is null or char_length(phone) <= 40),
  company               text check (company is null or char_length(company) <= 200),
  requester_role        text check (requester_role is null or requester_role in
                          ('owner','property_manager','condo_board','developer','gc','cm','consultant','architect','homeowner','other')),

  project_name          text check (project_name is null or char_length(project_name) <= 300),
  project_location      text check (project_location is null or char_length(project_location) <= 500),
  message               text check (message is null or char_length(message) <= 5000),
  urgency               text check (urgency is null or urgency in ('emergency','this_month','planning')),
  bid_due_at            timestamptz,          -- entered/shown in America/Toronto
  drawings_url          text check (drawings_url is null or (char_length(drawings_url) <= 2000 and drawings_url ~ '^https://')),
  attachment_paths      text[] not null default '{}',
  prequal_requested     boolean not null default false,
  details               jsonb not null default '{}'::jsonb,

  assigned_to           uuid references public.profiles(id) on delete set null,
  bid_amount            numeric(14,2) check (bid_amount is null or bid_amount >= 0),
  first_viewed_at       timestamptz,
  archived_at           timestamptz,
  archived_by           uuid references public.profiles(id) on delete set null,

  source_path           text check (source_path is null or char_length(source_path) <= 500),
  service_origin        text check (service_origin is null or char_length(service_origin) <= 200),
  utm                   jsonb,

  consent_given         boolean not null default false,
  consent_at            timestamptz,
  consent_text_version  text,

  -- alert summary (detail per recipient lives in inquiry_alert_deliveries)
  alert_status          text not null default 'pending'
    check (alert_status in ('pending','sent','partial','failed','suppressed','skipped')),
  alert_attempts        integer not null default 0 check (alert_attempts >= 0),
  alert_last_error      text check (alert_last_error is null or char_length(alert_last_error) <= 1000),
  alert_sent_at         timestamptz,
  alert_lease_until     timestamptz,          -- set while a send is in progress; expired lease = safe to retry
  confirmation_status   text
    check (confirmation_status is null or confirmation_status in ('sent','failed','suppressed','skipped')),

  constraint inquiries_bid_fields_required check (
    inquiry_type <> 'bid_invitation'
    or (bid_due_at is not null and company is not null and project_name is not null)
  ),
  constraint inquiries_consent_consistent check (consent_at is null or consent_given)
);

create unique index inquiries_submission_key_idx on public.inquiries (submission_key) where submission_key is not null;
create unique index inquiries_reference_code_idx on public.inquiries (reference_code);
create index inquiries_status_due_idx   on public.inquiries (status, bid_due_at);
create index inquiries_created_idx      on public.inquiries (created_at desc, id desc);
create index inquiries_assigned_idx     on public.inquiries (assigned_to) where archived_at is null;
create index inquiries_alert_open_idx   on public.inquiries (alert_status) where alert_status in ('pending','partial','failed');

comment on table public.inquiries is
  'Public leads inserted only by the submit-form edge function (service role). Legacy lead tables remain live sources until the intake switch-over.';
comment on column public.inquiries.submission_key is
  'Idempotency key from the browser form. submit-form inserts with ON CONFLICT (submission_key) DO NOTHING and returns the existing row.';

-- ---------------------------------------------------------------------------
-- 3. Notes, activity history, per-recipient alert deliveries, recipients
-- ---------------------------------------------------------------------------
create table public.inquiry_notes (
  id          uuid primary key default gen_random_uuid(),
  inquiry_id  uuid not null references public.inquiries(id) on delete cascade,
  author_id   uuid default auth.uid() references public.profiles(id) on delete set null,
  body        text not null check (char_length(btrim(body)) between 1 and 5000),
  created_at  timestamptz not null default now()
);
create index inquiry_notes_inquiry_idx on public.inquiry_notes (inquiry_id, created_at);

create table public.inquiry_events (
  id          uuid primary key default gen_random_uuid(),
  inquiry_id  uuid not null references public.inquiries(id) on delete cascade,
  actor_id    uuid references public.profiles(id) on delete set null,
  event_type  text not null check (event_type in (
                'created','status_changed','assigned','due_changed','priority_changed',
                'bid_amount_changed','archived','restored','viewed','note_added',
                'alert_sent','alert_partial','alert_failed','alert_suppressed','alert_resend_requested')),
  from_value  text,
  to_value    text,
  created_at  timestamptz not null default now()
);
create index inquiry_events_inquiry_idx on public.inquiry_events (inquiry_id, created_at);

create table public.inquiry_alert_deliveries (
  id               uuid primary key default gen_random_uuid(),
  inquiry_id       uuid not null references public.inquiries(id) on delete cascade,
  attempt          integer not null check (attempt >= 1),
  recipient        text not null check (char_length(recipient) <= 320),
  status           text not null check (status in ('sent','failed','suppressed')),
  error            text check (error is null or char_length(error) <= 1000),
  idempotency_key  text not null,
  message_id       text,
  created_at       timestamptz not null default now(),
  unique (inquiry_id, attempt, recipient),
  unique (idempotency_key)
);
create index inquiry_alert_deliveries_inquiry_idx on public.inquiry_alert_deliveries (inquiry_id, attempt);

create table public.notification_recipients (
  id            uuid primary key default gen_random_uuid(),
  inquiry_type  text not null default 'all'
    check (inquiry_type in ('all','general','estimate','bid_invitation','rfp','prequal_request')),
  email         text not null check (char_length(email) <= 320 and email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  is_active     boolean not null default true,
  created_at    timestamptz not null default now(),
  created_by    uuid default auth.uid() references public.profiles(id) on delete set null,
  unique (inquiry_type, email)
);

-- ---------------------------------------------------------------------------
-- 4. Triggers on inquiries / notes
-- ---------------------------------------------------------------------------
create or replace function public.inquiries_before_write()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at := now();
  if tg_op = 'UPDATE' and new.status is distinct from old.status then
    new.status_changed_at := now();
  end if;
  return new;
end;
$$;

create trigger inquiries_before_write
before insert or update on public.inquiries
for each row execute function public.inquiries_before_write();

-- Side effects of a new lead. Each block runs in its own sub-transaction: if the activity log or
-- the bell notification fails, a WARNING is logged and the lead insert still commits.
create or replace function public.inquiries_after_insert()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  begin
    insert into public.inquiry_events (inquiry_id, actor_id, event_type, to_value)
    values (new.id, null, 'created', new.inquiry_type);
  exception when others then
    raise warning 'inquiry % created-event failed: %', new.id, sqlstate;
  end;

  begin
    perform public.notify_admins(
      'inquiry',
      new.id,
      case new.inquiry_type
        when 'bid_invitation'  then 'New bid invitation'
        when 'rfp'             then 'New RFP'
        when 'estimate'        then 'New estimate request'
        when 'prequal_request' then 'New prequalification request'
        else 'New inquiry'
      end,
      left(coalesce(new.company || ' — ', '') || new.contact_name
           || coalesce(' — ' || new.project_name, ''), 300)
    );
  exception when others then
    raise warning 'inquiry % bell notification failed: %', new.id, sqlstate;
  end;

  return new;
end;
$$;

create trigger inquiries_after_insert
after insert on public.inquiries
for each row execute function public.inquiries_after_insert();

create or replace function public.inquiries_after_update()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  actor uuid := auth.uid();   -- null when the service role (edge function) updates
begin
  if new.status is distinct from old.status then
    insert into public.inquiry_events (inquiry_id, actor_id, event_type, from_value, to_value)
    values (new.id, actor, 'status_changed', old.status, new.status);
  end if;
  if new.assigned_to is distinct from old.assigned_to then
    insert into public.inquiry_events (inquiry_id, actor_id, event_type, from_value, to_value)
    values (new.id, actor, 'assigned', old.assigned_to::text, new.assigned_to::text);
  end if;
  if new.bid_due_at is distinct from old.bid_due_at then
    insert into public.inquiry_events (inquiry_id, actor_id, event_type, from_value, to_value)
    values (new.id, actor, 'due_changed', old.bid_due_at::text, new.bid_due_at::text);
  end if;
  if new.priority is distinct from old.priority then
    insert into public.inquiry_events (inquiry_id, actor_id, event_type, from_value, to_value)
    values (new.id, actor, 'priority_changed', old.priority, new.priority);
  end if;
  if new.bid_amount is distinct from old.bid_amount then
    insert into public.inquiry_events (inquiry_id, actor_id, event_type, from_value, to_value)
    values (new.id, actor, 'bid_amount_changed', old.bid_amount::text, new.bid_amount::text);
  end if;
  if new.archived_at is distinct from old.archived_at then
    insert into public.inquiry_events (inquiry_id, actor_id, event_type)
    values (new.id, actor, case when new.archived_at is null then 'restored' else 'archived' end);
  end if;
  if old.first_viewed_at is null and new.first_viewed_at is not null then
    insert into public.inquiry_events (inquiry_id, actor_id, event_type)
    values (new.id, actor, 'viewed');
  end if;
  if new.alert_status is distinct from old.alert_status
     and new.alert_status in ('sent','partial','failed','suppressed') then
    insert into public.inquiry_events (inquiry_id, actor_id, event_type, to_value)
    values (new.id, actor, 'alert_' || new.alert_status, left(new.alert_last_error, 500));
  end if;
  return new;
end;
$$;

create trigger inquiries_after_update
after update on public.inquiries
for each row execute function public.inquiries_after_update();

create or replace function public.inquiry_notes_after_insert()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.inquiry_events (inquiry_id, actor_id, event_type)
  values (new.inquiry_id, new.author_id, 'note_added');
  return new;
end;
$$;

create trigger inquiry_notes_after_insert
after insert on public.inquiry_notes
for each row execute function public.inquiry_notes_after_insert();

-- ---------------------------------------------------------------------------
-- 5. Last-super-admin guard on user_roles
--    Applies to every write path: the existing "User roles manageable by super admins" policy
--    (direct REST writes), invite-user, set_user_role, and cascades from profiles.
--    Statement-level AFTER triggers see the whole statement's effect; the advisory lock serialises
--    concurrent statements, and the count runs in a fresh READ COMMITTED snapshot after the lock.
-- ---------------------------------------------------------------------------
create or replace function public.guard_last_super_admin()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
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

-- Trigger functions are never called directly by clients.
revoke all on function public.inquiries_before_write()      from public, anon, authenticated;
revoke all on function public.inquiries_after_insert()      from public, anon, authenticated;
revoke all on function public.inquiries_after_update()      from public, anon, authenticated;
revoke all on function public.inquiry_notes_after_insert()  from public, anon, authenticated;
revoke all on function public.guard_last_super_admin()      from public, anon, authenticated;

-- ---------------------------------------------------------------------------
-- 6. Row-level security and grants
-- ---------------------------------------------------------------------------
alter table public.inquiries                enable row level security;
alter table public.inquiry_notes            enable row level security;
alter table public.inquiry_events           enable row level security;
alter table public.inquiry_alert_deliveries enable row level security;
alter table public.notification_recipients  enable row level security;

revoke all on public.inquiries, public.inquiry_notes, public.inquiry_events,
              public.inquiry_alert_deliveries, public.notification_recipients
  from public, anon, authenticated;
grant all on public.inquiries, public.inquiry_notes, public.inquiry_events,
             public.inquiry_alert_deliveries, public.notification_recipients
  to service_role;

-- inquiries: staff edit workflow columns only; nobody but the service role inserts
grant select on public.inquiries to authenticated;
grant update (status, priority, assigned_to, bid_due_at, bid_amount, first_viewed_at, archived_at, archived_by)
  on public.inquiries to authenticated;
grant delete on public.inquiries to authenticated;

create policy "Admins read inquiries" on public.inquiries
  for select to authenticated using (public.is_admin(auth.uid()));
create policy "Admins update inquiry workflow" on public.inquiries
  for update to authenticated
  using (public.is_admin(auth.uid())) with check (public.is_admin(auth.uid()));
create policy "Super admins delete inquiries" on public.inquiries
  for delete to authenticated using (public.has_role(auth.uid(), 'super_admin'));

grant select, insert, delete on public.inquiry_notes to authenticated;
create policy "Admins read inquiry notes" on public.inquiry_notes
  for select to authenticated using (public.is_admin(auth.uid()));
create policy "Admins add own inquiry notes" on public.inquiry_notes
  for insert to authenticated
  with check (public.is_admin(auth.uid()) and author_id = auth.uid());
create policy "Super admins delete inquiry notes" on public.inquiry_notes
  for delete to authenticated using (public.has_role(auth.uid(), 'super_admin'));

grant select on public.inquiry_events to authenticated;
create policy "Admins read inquiry events" on public.inquiry_events
  for select to authenticated using (public.is_admin(auth.uid()));

grant select on public.inquiry_alert_deliveries to authenticated;
create policy "Admins read alert deliveries" on public.inquiry_alert_deliveries
  for select to authenticated using (public.is_admin(auth.uid()));

grant select, insert, update, delete on public.notification_recipients to authenticated;
create policy "Admins manage notification recipients" on public.notification_recipients
  for all to authenticated
  using (public.is_admin(auth.uid())) with check (public.is_admin(auth.uid()));

-- ---------------------------------------------------------------------------
-- 7. Dashboard summary for the new table (SECURITY INVOKER: RLS applies).
--    During the transition the dashboard ADDS legacy-table counts on the client; this function
--    covers inquiries only.
-- ---------------------------------------------------------------------------
create or replace function public.admin_inquiry_summary()
returns jsonb
language sql
stable
security invoker
set search_path = public
as $$
  with open_rows as (
    select * from public.inquiries
    where archived_at is null and status in ('new','reviewing','bidding','submitted')
  )
  select jsonb_build_object(
    'generated_at',        now(),
    'unopened',            (select count(*) from open_rows where status = 'new' and first_viewed_at is null),
    'needs_action',        (select count(*) from open_rows where status in ('new','reviewing','bidding')),
    'awaiting_decision',   (select count(*) from open_rows where status = 'submitted'),
    'due_next_7_days',     (select count(*) from open_rows
                              where status in ('new','reviewing','bidding')
                                and bid_due_at >= now() and bid_due_at < now() + interval '7 days'),
    'overdue',             (select count(*) from open_rows
                              where status in ('new','reviewing','bidding') and bid_due_at < now()),
    'unassigned',          (select count(*) from open_rows where assigned_to is null),
    'alerts_needing_attention',
                           (select count(*) from public.inquiries
                              where archived_at is null
                                and (alert_status in ('failed','partial')
                                     or (alert_status = 'pending' and created_at < now() - interval '10 minutes'
                                         and (alert_lease_until is null or alert_lease_until < now())))),
    'by_status',           coalesce((select jsonb_object_agg(status, n)
                                     from (select status, count(*) n from public.inquiries
                                           where archived_at is null group by status) s), '{}'::jsonb),
    'by_type_open',        coalesce((select jsonb_object_agg(inquiry_type, n)
                                     from (select inquiry_type, count(*) n from open_rows group by inquiry_type) t), '{}'::jsonb),
    'closed_last_90_days', jsonb_build_object(
                              'won',    (select count(*) from public.inquiries where status = 'won'    and status_changed_at > now() - interval '90 days'),
                              'lost',   (select count(*) from public.inquiries where status = 'lost'   and status_changed_at > now() - interval '90 days'),
                              'no_bid', (select count(*) from public.inquiries where status = 'no_bid' and status_changed_at > now() - interval '90 days')),
    'submitted_value_open', (select coalesce(sum(bid_amount), 0) from open_rows where status = 'submitted')
  );
$$;
revoke all on function public.admin_inquiry_summary() from public, anon;
grant execute on function public.admin_inquiry_summary() to authenticated;

-- ---------------------------------------------------------------------------
-- 8. Atomic role change. Takes the same advisory lock as the guard; the guard trigger is the
--    final protection either way.
-- ---------------------------------------------------------------------------
create or replace function public.set_user_role(_user_id uuid, _role public.app_role)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.has_role(auth.uid(), 'super_admin') then
    raise exception 'Only a super admin can change roles' using errcode = '42501';
  end if;
  perform pg_advisory_xact_lock(hashtext('public.user_roles.super_admin'));
  -- Insert first, then remove the others: re-saving a sole super admin as super_admin never
  -- passes through a zero-super-admin state.
  insert into public.user_roles (user_id, role) values (_user_id, _role)
  on conflict (user_id, role) do nothing;
  delete from public.user_roles where user_id = _user_id and role <> _role;
end;
$$;
revoke all on function public.set_user_role(uuid, public.app_role) from public, anon;
grant execute on function public.set_user_role(uuid, public.app_role) to authenticated;

-- ---------------------------------------------------------------------------
-- 9. Realtime (only if the publication exists)
-- ---------------------------------------------------------------------------
do $$
begin
  if exists (select 1 from pg_publication where pubname = 'supabase_realtime') then
    execute 'alter publication supabase_realtime add table public.inquiries';
  end if;
end $$;

commit;

-- ===========================================================================
-- ROLLBACK (separate script; run only after exporting any rows in the new tables)
-- ===========================================================================
-- begin;
-- drop trigger if exists user_roles_guard_last_super_admin_delete on public.user_roles;
-- drop trigger if exists user_roles_guard_last_super_admin_update on public.user_roles;
-- drop function if exists public.guard_last_super_admin();
-- drop function if exists public.set_user_role(uuid, public.app_role);
-- drop function if exists public.admin_inquiry_summary();
-- drop table if exists public.inquiry_alert_deliveries, public.inquiry_events, public.inquiry_notes,
--                      public.notification_recipients, public.inquiries;   -- also leaves the realtime publication
-- drop function if exists public.inquiries_before_write(), public.inquiries_after_insert(),
--                         public.inquiries_after_update(), public.inquiry_notes_after_insert();
-- -- Restoring the original CHECK fails while notifications of the new types exist. Either keep the
-- -- widened CHECK (harmless), or remove those rows first:
-- -- delete from public.admin_notifications where notification_type in ('inquiry','email_failure');
-- -- alter table public.admin_notifications drop constraint admin_notifications_notification_type_check;
-- -- alter table public.admin_notifications add constraint admin_notifications_notification_type_check
-- --   check (notification_type = any (array['rfp','contact','resume','prequal','quote','newsletter']));
-- commit;
-- The Users page must be reverted to its previous code at the same time if set_user_role is dropped.
