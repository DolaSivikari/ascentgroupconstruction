-- Disposable PostgreSQL fixture ONLY. Never apply to the connected Lovable project.
-- Requires a fresh empty local/CI database; creates synthetic tables, roles and helpers.
create role anon; create role authenticated; create schema auth; create schema extensions;
create extension if not exists "uuid-ossp" with schema extensions;
create type public.publish_state as enum ('draft','published','archived');
create function auth.uid() returns uuid language sql stable as $$ select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid $$;
create function public.is_admin(uuid) returns boolean language sql stable as $$select $1='00000000-0000-4000-8000-000000000001'::uuid$$;
CREATE TABLE public.projects (
    id uuid DEFAULT extensions.uuid_generate_v4() NOT NULL,
    slug text NOT NULL,
    title text NOT NULL,
    subtitle text,
    summary text,
    description text,
    featured_image text,
    gallery jsonb DEFAULT '[]'::jsonb,
    client_name text,
    location text,
    category text,
    tags text[],
    project_size text,
    budget_range text,
    start_date date,
    completion_date date,
    project_status text,
    process_notes text,
    publish_state public.publish_state DEFAULT 'draft'::public.publish_state,
    seo_title text,
    seo_description text,
    seo_keywords text[],
    created_by uuid,
    updated_by uuid,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    content_blocks jsonb DEFAULT '[]'::jsonb,
    version integer DEFAULT 1,
    draft_content jsonb,
    preview_token text,
    scheduled_publish_at timestamp with time zone,
    featured boolean DEFAULT false,
    year text,
    duration text,
    before_images jsonb DEFAULT '[]'::jsonb,
    after_images jsonb DEFAULT '[]'::jsonb,
    preview_token_expires_at timestamp with time zone,
    preview_token_created_by uuid,
    project_value text,
    square_footage text,
    your_role text,
    delivery_method text,
    client_type text,
    trades_coordinated integer,
    peak_workforce integer,
    on_time_completion boolean DEFAULT true,
    on_budget boolean DEFAULT true,
    safety_incidents integer DEFAULT 0,
    scope_of_work text,
    team_credits jsonb DEFAULT '[]'::jsonb,
    og_image_url text,
    canonical_url text,
    challenge text,
    solution text,
    results text
);
CREATE TABLE public.project_images (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    project_id uuid NOT NULL,
    url text NOT NULL,
    category character varying(20) NOT NULL,
    caption text,
    display_order integer DEFAULT 0 NOT NULL,
    featured boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    CONSTRAINT project_images_category_check CHECK (((category)::text = ANY ((ARRAY['before'::character varying, 'after'::character varying, 'process'::character varying, 'gallery'::character varying])::text[])))
);
CREATE TABLE public.project_services (
    id uuid DEFAULT extensions.uuid_generate_v4() NOT NULL,
    project_id uuid,
    service_id uuid
);
alter table projects add primary key(id);
alter table project_images add primary key(id);
alter table project_images add column alt_text text;
alter table project_services add primary key(id);
create unique index project_services_pair on project_services(project_id,service_id);
create unique index projects_slug on projects(slug);
create table services(id uuid primary key);
insert into services values ('00000000-0000-4000-8000-000000000002');
alter table project_services add foreign key(service_id) references services(id);
alter table project_services add foreign key(project_id) references projects(id);
alter table project_images add foreign key(project_id) references projects(id);
grant usage on schema public,auth,extensions to authenticated;
grant all on all tables in schema public to authenticated;
alter table projects enable row level security; create policy admins on projects for all to authenticated using(public.is_admin(auth.uid())) with check(public.is_admin(auth.uid()));
alter table project_images enable row level security; create policy admins on project_images for all to authenticated using(public.is_admin(auth.uid())) with check(public.is_admin(auth.uid()));
alter table project_services enable row level security; create policy admins on project_services for all to authenticated using(public.is_admin(auth.uid())) with check(public.is_admin(auth.uid()));
