-- 0002_about_page_fields.sql
-- DRAFT FOR OWNER REVIEW. Not applied. Independent of 0001; may be applied before or after it.
-- Purpose: let the admin edit the About page hero, story, founder section and stats strip
-- (owner decision, 3 October 2026). Additive only.
--
-- Public About page rule: each field falls back to the current text in About.tsx when NULL/empty,
-- so applying this migration changes nothing visible until someone saves a value.
--
-- Rollback:
--   alter table public.about_page_settings
--     drop column if exists hero_headline, drop column if exists hero_intro,
--     drop column if exists founder_name, drop column if exists founder_title,
--     drop column if exists founder_bio, drop column if exists founder_quote,
--     drop column if exists founder_image_url, drop column if exists stats;
--   (the seeded empty row, if it was created, can stay; it is inert)

begin;

alter table public.about_page_settings
  add column if not exists hero_headline     text check (hero_headline is null or char_length(hero_headline) <= 160),
  add column if not exists hero_intro        text check (hero_intro is null or char_length(hero_intro) <= 600),
  add column if not exists founder_name      text check (founder_name is null or char_length(founder_name) <= 120),
  add column if not exists founder_title     text check (founder_title is null or char_length(founder_title) <= 120),
  add column if not exists founder_bio       text check (founder_bio is null or char_length(founder_bio) <= 4000),
  add column if not exists founder_quote     text check (founder_quote is null or char_length(founder_quote) <= 600),
  add column if not exists founder_image_url text check (founder_image_url is null or char_length(founder_image_url) <= 1000),
  -- stats: [{ "value": "15+", "label": "Years team experience" }, ...]  (max 6, enforced in the app)
  add column if not exists stats             jsonb check (stats is null or jsonb_typeof(stats) = 'array');

comment on column public.about_page_settings.story_headline is 'About page story heading (existing column, now rendered).';
comment on column public.about_page_settings.story_content  is 'About page story paragraphs: JSON array of strings (existing column, now rendered).';

-- The Settings "About" tab saves with UPDATE ... WHERE id = <active row>. No active row has ever been
-- seeded, so saving can fail. Create one empty active row only if none exists. Every column is NULL,
-- so the public page keeps showing its built-in text until values are saved.
insert into public.about_page_settings (is_active)
select true
where not exists (select 1 from public.about_page_settings where is_active = true);

commit;

-- Verification (read-only):
--   select id, is_active, hero_headline is null as hero_empty from public.about_page_settings;
--   -- expect exactly one active row
--   select has_column_privilege('anon', 'public.about_page_settings', 'hero_headline', 'SELECT');
--   -- expect true (the public About page reads these columns as a visitor). If false, add:
--   -- grant select (id, is_active, story_headline, story_content, hero_headline, hero_intro, founder_name,
--   --   founder_title, founder_bio, founder_quote, founder_image_url, stats, licenses, memberships, insurance)
--   --   on public.about_page_settings to anon;
