import { useQuery } from '@tanstack/react-query';
import { fetchActiveSettingsRow } from '@/hooks/useActiveSettings';
import { COMPANY_PHONE, COMPANY_EMAIL } from '@/constants/company';

export interface CompanySettings {
  companyName: string;
  phone: string;
  email: string;
  address: string;
  businessHours: {
    weekday: string;
    saturday: string;
    sunday: string;
  };
  socialLinks: {
    linkedin: string;
    facebook: string;
    instagram: string;
    twitter: string;
  };
  certifications: string[];
  metaTitle: string;
  metaDescription: string;
}

interface SiteSettingsRow {
  company_name?: string;
  phone?: string;
  email?: string;
  address?: string;
  business_hours?: Record<string, string> | null;
  social_links?: Record<string, string> | null;
  certifications?: string[] | null;
  meta_title?: string;
  meta_description?: string;
}

interface UseCompanySettingsResult {
  settings: CompanySettings | null;
  loading: boolean;
  error: Error | null;
}

const mapRow = (row: SiteSettingsRow | null): CompanySettings | null => {
  if (!row) return null;
  const businessHours = row.business_hours || null;
  const socialLinks = row.social_links || null;
  return {
    companyName: row.company_name || 'Ascent Group Construction',
    phone: row.phone || COMPANY_PHONE,
    email: row.email || COMPANY_EMAIL,
    address: row.address || '2 Jody Ave, North York, ON M3N 1H1',
    businessHours: {
      weekday: businessHours?.weekday || 'Mon-Fri: 8AM-6PM',
      saturday: businessHours?.saturday || 'Sat: 9AM-4PM',
      sunday: businessHours?.sunday || 'Closed',
    },
    socialLinks: {
      linkedin: socialLinks?.linkedin || '',
      facebook: socialLinks?.facebook || '',
      instagram: socialLinks?.instagram || '',
      twitter: socialLinks?.twitter || '',
    },
    certifications: (row.certifications as string[]) || [],
    metaTitle: row.meta_title || 'Ascent Group Construction - Professional Painting & Restoration',
    metaDescription: row.meta_description || 'Leading construction and project management services across the GTA',
  };
};

export function useCompanySettings(): UseCompanySettingsResult {
  // Shares cache with useSiteSettings via identical queryKey, so the
  // homepage hits site_settings exactly once across Navigation, StickyInquiryBar,
  // MobileNavSheet, InteractiveCTA, and DirectAnswer.
  const { data, isLoading, error } = useQuery({
    queryKey: ['site-settings'],
    queryFn: async () => {
      const result = await fetchActiveSettingsRow<SiteSettingsRow>('site_settings');
      if (result.warning) {
        console.warn(result.warning);
      }
      return result.data;
    },
    staleTime: 5 * 60 * 1000,
  });

  return {
    settings: mapRow((data as SiteSettingsRow | null) ?? null),
    loading: isLoading,
    error: (error as Error) || null,
  };
}
