import { z } from 'zod';

// Contact Page Settings Schema
export const contactPageSettingsSchema = z.object({
  office_address: z.string().min(1, 'Office address is required').max(500),
  office_phone: z.string().min(1, 'Office phone is required').max(20),
  office_email: z.string().email('Invalid email format').max(255),
  emergency_phone: z.string().max(20).optional().nullable(),
  careers_email: z.string().email('Invalid email format').max(255).optional().nullable(),
  business_hours: z.string().min(1, 'Business hours are required').max(500),
  map_embed_url: z.string().url('Invalid URL format').max(1000).optional().nullable(),
});

// Footer Settings Schema
export const footerSettingsSchema = z.object({
  quick_links: z.array(z.object({
    label: z.string().min(1, 'Label is required').max(100),
    href: z.string().min(1, 'Link is required').max(500),
  })).min(1, 'At least one quick link is required'),
  sectors_links: z.array(z.object({
    label: z.string().min(1, 'Label is required').max(100),
    href: z.string().min(1, 'Link is required').max(500),
  })).optional(),
  contact_phone: z.string().min(1, 'Contact phone is required').max(20),
  contact_email: z.string().email('Invalid email format').max(255),
  social_facebook: z.string().url('Invalid URL format').max(500).optional().nullable(),
  social_linkedin: z.string().url('Invalid URL format').max(500).optional().nullable(),
  social_instagram: z.string().url('Invalid URL format').max(500).optional().nullable(),
  trust_bar_items: z.array(z.object({
    label: z.string().min(1, 'Label is required').max(100),
    value: z.string().optional(),
  })).optional(),
});

// Site Settings Schema
export const siteSettingsSchema = z.object({
  site_name: z.string().min(1, 'Site name is required').max(100),
  site_tagline: z.string().max(200).optional().nullable(),
  contact_email: z.string().email('Invalid email format').max(255),
  contact_phone: z.string().min(1, 'Contact phone is required').max(20),
  office_address: z.string().max(500).optional().nullable(),
  meta_description: z.string().max(160, 'Meta description must be 160 characters or less').optional().nullable(),
  meta_keywords: z.string().max(500).optional().nullable(),
  social_facebook: z.string().url('Invalid URL format').max(500).optional().nullable(),
  social_linkedin: z.string().url('Invalid URL format').max(500).optional().nullable(),
  social_instagram: z.string().url('Invalid URL format').max(500).optional().nullable(),
  social_twitter: z.string().url('Invalid URL format').max(500).optional().nullable(),
});

// About Page Settings Schema
export const aboutPageSettingsSchema = z.object({
  hero_title: z.string().min(1, 'Hero title is required').max(200),
  hero_subtitle: z.string().max(500).optional().nullable(),
  stats_projects: z.number().min(0).optional().nullable(),
  stats_years: z.number().min(0).optional().nullable(),
  stats_sqft: z.number().min(0).optional().nullable(),
  stats_clients: z.number().min(0).optional().nullable(),
  story_title: z.string().max(200).optional().nullable(),
  story_content: z.string().max(2000).optional().nullable(),
  cta_title: z.string().max(200).optional().nullable(),
  cta_description: z.string().max(500).optional().nullable(),
  cta_button_text: z.string().max(50).optional().nullable(),
  cta_button_link: z.string().max(500).optional().nullable(),
});

export type ContactPageSettings = z.infer<typeof contactPageSettingsSchema>;
export type FooterSettings = z.infer<typeof footerSettingsSchema>;
export type SiteSettings = z.infer<typeof siteSettingsSchema>;
export type AboutPageSettings = z.infer<typeof aboutPageSettingsSchema>;
