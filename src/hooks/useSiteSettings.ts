import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Json } from '@/integrations/supabase/types';

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
      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .eq('is_active', true)
        .maybeSingle();
      
      if (error) throw error;
      return data as SiteSettings | null;
    },
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });
}
