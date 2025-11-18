-- Update or insert site_settings with correct contact information
INSERT INTO site_settings (
  company_name,
  company_tagline,
  email,
  phone,
  address,
  meta_description,
  social_links,
  founded_year
) 
SELECT 
  'Ascent Group Construction',
  'Building Envelope & Interior Trades Specialists',
  'info@ascentgroupconstruction.com',
  '+1-647-528-6804',
  '2 Jody Ave, North York, ON M3N 1H1',
  'Ontario specialty contractor: building envelope restoration, interior trades, and renovation services. 15+ years experience. WSIB compliant.',
  '{"linkedin": "https://www.linkedin.com/company/ascent-group-construction"}'::jsonb,
  2009
WHERE NOT EXISTS (SELECT 1 FROM site_settings LIMIT 1);

-- Update existing site_settings if any exist
UPDATE site_settings SET
  email = 'info@ascentgroupconstruction.com',
  phone = '+1-647-528-6804',
  address = '2 Jody Ave, North York, ON M3N 1H1',
  social_links = '{"linkedin": "https://www.linkedin.com/company/ascent-group-construction"}'::jsonb,
  updated_at = now()
WHERE id IN (SELECT id FROM site_settings LIMIT 1);

-- Populate contact_page_settings with detailed contact information
INSERT INTO contact_page_settings (
  office_address,
  main_phone,
  general_email,
  rfp_email,
  careers_email,
  weekday_hours,
  saturday_hours,
  sunday_hours,
  map_embed_url
)
SELECT
  '2 Jody Ave, North York, ON M3N 1H1, Canada',
  '+1-647-528-6804',
  'info@ascentgroupconstruction.com',
  'rfp@ascentgroupconstruction.com',
  'careers@ascentgroupconstruction.com',
  'Monday - Friday: 8:00 AM - 6:00 PM',
  'Saturday: 9:00 AM - 2:00 PM',
  'Sunday: Closed',
  'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2882.334!2d-79.456123!3d43.742829!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x882b34c2db8e8e65%3A0x1234567890abcdef!2s2%20Jody%20Ave%2C%20North%20York%2C%20ON%20M3N%201H1!5e0!3m2!1sen!2sca!4v1234567890123!5m2!1sen!2sca'
WHERE NOT EXISTS (SELECT 1 FROM contact_page_settings LIMIT 1);

-- Update existing contact_page_settings if any exist
UPDATE contact_page_settings SET
  office_address = '2 Jody Ave, North York, ON M3N 1H1, Canada',
  main_phone = '+1-647-528-6804',
  general_email = 'info@ascentgroupconstruction.com',
  rfp_email = 'rfp@ascentgroupconstruction.com',
  careers_email = 'careers@ascentgroupconstruction.com',
  weekday_hours = 'Monday - Friday: 8:00 AM - 6:00 PM',
  saturday_hours = 'Saturday: 9:00 AM - 2:00 PM',
  sunday_hours = 'Sunday: Closed',
  map_embed_url = 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2882.334!2d-79.456123!3d43.742829!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x882b34c2db8e8e65%3A0x1234567890abcdef!2s2%20Jody%20Ave%2C%20North%20York%2C%20ON%20M3N%201H1!5e0!3m2!1sen!2sca!4v1234567890123!5m2!1sen!2sca',
  updated_at = now()
WHERE id IN (SELECT id FROM contact_page_settings LIMIT 1);

-- Populate footer_settings with footer contact information
INSERT INTO footer_settings (
  contact_info,
  social_media,
  quick_links,
  sectors_links
)
SELECT
  '{"phone": "+1-647-528-6804", "email": "info@ascentgroupconstruction.com"}'::jsonb,
  '{"linkedin": "https://www.linkedin.com/company/ascent-group-construction"}'::jsonb,
  '[
    {"label": "About Us", "href": "/about"},
    {"label": "Services", "href": "/services"},
    {"label": "Projects", "href": "/projects"},
    {"label": "Contact", "href": "/contact"}
  ]'::jsonb,
  '[
    {"label": "Homeowners", "href": "/homeowners"},
    {"label": "Property Managers", "href": "/property-managers"},
    {"label": "Commercial Clients", "href": "/commercial-clients"},
    {"label": "For General Contractors", "href": "/for-general-contractors"}
  ]'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM footer_settings LIMIT 1);

-- Update existing footer_settings if any exist
UPDATE footer_settings SET
  contact_info = '{"phone": "+1-647-528-6804", "email": "info@ascentgroupconstruction.com"}'::jsonb,
  social_media = '{"linkedin": "https://www.linkedin.com/company/ascent-group-construction"}'::jsonb,
  updated_at = now()
WHERE id IN (SELECT id FROM footer_settings LIMIT 1);