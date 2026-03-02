import { useQuery } from '@tanstack/react-query';
import type { Json } from '@/integrations/supabase/types';
import { fetchActiveSettingsRow } from '@/hooks/useActiveSettings';

export interface SiteSettings {
  id: string;
  company_name: string;
  company_tagline: string;
  phone: string;
  email: string;
  address: string;
  business_hours: Json;
  social_links: Json;
  certifications: string[] | null;
  meta_title: string;
  meta_description: string;
  founded_year: number;
  is_active: boolean;
  // Feature flags (may not exist yet)
  maintenance_mode?: boolean;
  show_phone_in_header?: boolean;
  show_social_in_footer?: boolean;
  copyright_text?: string;
}

export function useSiteSettings() {
  return useQuery({
    queryKey: ['site-settings'],
    queryFn: async () => {
      const result = await fetchActiveSettingsRow<SiteSettings>('site_settings');
      if (result.warning) {
        console.warn(result.warning);
      }
      return result.data;
    },
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });
}
