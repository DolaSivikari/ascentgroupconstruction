
-- Phase 8: Neutralize inflated column defaults

-- homepage_settings: remove inflated value props
ALTER TABLE homepage_settings ALTER COLUMN value_prop_2 SET DEFAULT 'WSIB Compliant';
ALTER TABLE homepage_settings ALTER COLUMN value_prop_3 SET DEFAULT 'Fully Insured';
ALTER TABLE homepage_settings ALTER COLUMN hero_description SET DEFAULT 'Ascent Group Construction specializes in general contracting and construction management for commercial, institutional, and multi-family projects. We deliver quality results through transparent project management and proven construction methodologies.';

-- about_page_settings: zero out inflated stat defaults
ALTER TABLE about_page_settings ALTER COLUMN total_projects SET DEFAULT 0;
ALTER TABLE about_page_settings ALTER COLUMN satisfaction_rate SET DEFAULT 0;
ALTER TABLE about_page_settings ALTER COLUMN years_in_business SET DEFAULT 0;
