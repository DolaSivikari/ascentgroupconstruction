import { useState, useEffect } from 'react';
import { fetchActiveSettingsRow } from '@/hooks/useActiveSettings';

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

export function useCompanySettings(): UseCompanySettingsResult {
  const [settings, setSettings] = useState<CompanySettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const result = await fetchActiveSettingsRow<SiteSettingsRow>('site_settings');
        if (result.warning) {
          console.warn(result.warning);
        }

        const settingsData = result.data;

        if (settingsData) {
          const businessHours = settingsData.business_hours || null;
          const socialLinks = settingsData.social_links || null;
          
          setSettings({
            companyName: settingsData.company_name || 'Ascent Group Construction',
            phone: settingsData.phone || '647-528-6804',
            email: settingsData.email || 'info@ascentgroupconstruction.com',
            address: settingsData.address || '2 Jody Ave, North York, ON M3N 1H1',
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
            certifications: (settingsData.certifications as string[]) || [],
            metaTitle: settingsData.meta_title || 'Ascent Group Construction - Professional Painting & Restoration',
            metaDescription: settingsData.meta_description || 'Leading construction and project management services across the GTA',
          });
        } else {
          const missingError = new Error('No active site_settings row found; components will use local fallbacks');
          setError(missingError);
          console.warn(missingError.message);
        }
      } catch (err) {
        setError(err as Error);
        console.error('Error fetching company settings:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  return { settings, loading, error };
}
