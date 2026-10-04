/**
 * Columns of site_settings readable by anonymous visitors.
 * Contact email/phone are intentionally excluded so they cannot be bulk
 * harvested through the public API — the site renders them from
 * src/constants/company.ts instead.
 */
export const PUBLIC_SITE_SETTINGS_COLUMNS = [
  'id',
  'company_name',
  'company_tagline',
  'address',
  'business_hours',
  'social_links',
  'certifications',
  'google_analytics_id',
  'meta_title',
  'meta_description',
  'og_image',
  'is_active',
  'created_at',
  'updated_at',
  'service_areas',
  'knows_about',
  'founded_year',
].join(', ');

/**
 * Columns of contact_page_settings readable by anonymous visitors.
 * Phone/email columns are excluded; the page falls back to company constants.
 */
export const PUBLIC_CONTACT_PAGE_SETTINGS_COLUMNS = [
  'id',
  'office_address',
  'weekday_hours',
  'saturday_hours',
  'sunday_hours',
  'map_embed_url',
  'is_active',
].join(', ');
