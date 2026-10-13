-- REVIEW DRAFT: do not apply as part of a frontend deployment.
-- Requires existing projects/project_images (including alt_text)/project_services,
-- is_admin(uuid), authenticated grants/RLS, and a current backup.
-- SECURITY INVOKER preserves the existing RLS and grants. No policies are changed.
begin;
create function public.save_project_atomic(
  _id uuid, _expected_updated_at timestamptz, _project jsonb,
  _images jsonb, _service_ids uuid[]
) returns jsonb language plpgsql security invoker
set search_path = public, pg_temp as $$
declare
  current_project public.projects%rowtype;
  desired public.projects%rowtype;
  saved public.projects%rowtype;
  image jsonb;
  image_id uuid;
  kept uuid[] := '{}';
  position integer := 0;
begin
  if auth.uid() is null or not public.is_admin(auth.uid()) then
    raise exception 'Administrators only' using errcode = '42501';
  end if;
  if jsonb_typeof(_project) is distinct from 'object'
    or jsonb_typeof(_images) is distinct from 'array'
    or jsonb_array_length(_images) > 200 or cardinality(_service_ids) > 200
    or _service_ids is null then
    raise exception 'Invalid project payload' using errcode = '22023';
  end if;
  if exists (select 1 from jsonb_object_keys(_project) k where k <> all(array['slug','title','subtitle','summary','description','featured_image','gallery','client_name','location','category','tags','project_size','budget_range','start_date','completion_date','project_status','publish_state','seo_title','seo_description','seo_keywords','content_blocks','featured','year','duration','before_images','after_images','project_value','square_footage','your_role','delivery_method','client_type','trades_coordinated','peak_workforce','on_time_completion','on_budget','safety_incidents','scope_of_work','team_credits','og_image_url','canonical_url','challenge','solution','results'])) then
    raise exception 'Unsupported project field' using errcode = '22023';
  end if;
  if _id is null then
    if _expected_updated_at is not null then
      raise exception 'Invalid new project version' using errcode = '22023';
    end if;
    insert into public.projects(slug, title, publish_state, created_by, updated_by)
      values (_project->>'slug', _project->>'title', 'draft', auth.uid(), auth.uid())
      returning * into current_project;
  else
    select * into current_project from public.projects where id = _id for update;
    if not found then raise exception 'Project unavailable' using errcode = '42501'; end if;
    if current_project.updated_at is distinct from _expected_updated_at then
      raise exception 'Project changed; reload before saving' using errcode = '40001';
    end if;
  end if;
  desired := jsonb_populate_record(current_project, _project);
  -- Updates and gallery/service writes commit together, including publish_state.
  update public.projects set
    slug = desired.slug,
    title = desired.title,
    subtitle = desired.subtitle,
    summary = desired.summary,
    description = desired.description,
    featured_image = desired.featured_image,
    gallery = desired.gallery,
    client_name = desired.client_name,
    location = desired.location,
    category = desired.category,
    tags = desired.tags,
    project_size = desired.project_size,
    budget_range = desired.budget_range,
    start_date = desired.start_date,
    completion_date = desired.completion_date,
    project_status = desired.project_status,
    publish_state = desired.publish_state,
    seo_title = desired.seo_title,
    seo_description = desired.seo_description,
    seo_keywords = desired.seo_keywords,
    content_blocks = desired.content_blocks,
    featured = desired.featured,
    year = desired.year,
    duration = desired.duration,
    before_images = desired.before_images,
    after_images = desired.after_images,
    project_value = desired.project_value,
    square_footage = desired.square_footage,
    your_role = desired.your_role,
    delivery_method = desired.delivery_method,
    client_type = desired.client_type,
    trades_coordinated = desired.trades_coordinated,
    peak_workforce = desired.peak_workforce,
    on_time_completion = desired.on_time_completion,
    on_budget = desired.on_budget,
    safety_incidents = desired.safety_incidents,
    scope_of_work = desired.scope_of_work,
    team_credits = desired.team_credits,
    og_image_url = desired.og_image_url,
    canonical_url = desired.canonical_url,
    challenge = desired.challenge,
    solution = desired.solution,
    results = desired.results,
    updated_at = clock_timestamp(), updated_by = auth.uid()
    where id = current_project.id returning * into saved;
  for image in select value from jsonb_array_elements(_images) loop
    if jsonb_typeof(image) <> 'object' or coalesce(image->>'url','') = ''
      or coalesce(image->>'category','') not in ('before','after','process','gallery') then
      raise exception 'Invalid project image' using errcode = '22023';
    end if;
    image_id := null;
    if coalesce(image->>'id','') ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$' then
      select id into image_id from public.project_images
        where id = (image->>'id')::uuid and project_id = saved.id;
    end if;
    if image_id = any(kept) then
      raise exception 'Duplicate project image' using errcode = '22023';
    end if;
    if image_id is null then
      insert into public.project_images(project_id,url,category,caption,alt_text,display_order,featured)
        values(saved.id,image->>'url',image->>'category',nullif(image->>'caption',''),
          nullif(image->>'altText',''),position,coalesce((image->>'featured')::boolean,false))
        returning id into image_id;
    else
      update public.project_images set url=image->>'url',category=image->>'category',
        caption=nullif(image->>'caption',''),
        alt_text=case when image ? 'altText' then nullif(image->>'altText','') else alt_text end,
        display_order=position,featured=coalesce((image->>'featured')::boolean,false)
        where id=image_id and project_id=saved.id;
    end if;
    kept := array_append(kept,image_id);
    position := position + 1;
  end loop;
  delete from public.project_images where project_id=saved.id and not(id=any(kept));
  insert into public.project_services(project_id,service_id)
    select saved.id, id from (select distinct unnest(_service_ids) id) ids
    on conflict(project_id,service_id) do nothing;
  delete from public.project_services where project_id=saved.id and not(service_id=any(_service_ids));
  return jsonb_build_object('project',to_jsonb(saved),'relationships',jsonb_build_object(
    'images',coalesce((select jsonb_agg(jsonb_build_object('id',id,'url',url,'category',category,
      'caption',caption,'altText',alt_text,'order',display_order,'featured',featured) order by display_order)
      from public.project_images where project_id=saved.id),'[]'::jsonb),
    'serviceIds',to_jsonb(_service_ids)));
end $$;
revoke all on function public.save_project_atomic(uuid,timestamptz,jsonb,jsonb,uuid[]) from public,anon;
grant execute on function public.save_project_atomic(uuid,timestamptz,jsonb,jsonb,uuid[]) to authenticated;
notify pgrst, 'reload schema';
commit;
-- Rollback (separate reviewed operation, after disabling VITE_ATOMIC_PROJECT_SAVE_ENABLED):
-- drop function public.save_project_atomic(uuid,timestamptz,jsonb,jsonb,uuid[]);
