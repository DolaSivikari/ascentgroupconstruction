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
