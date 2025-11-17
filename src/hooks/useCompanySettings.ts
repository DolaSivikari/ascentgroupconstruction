import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

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
        
        // Try maybeSingle first
        const { data, error: fetchError } = await supabase
          .from('site_settings')
          .select('*')
          .eq('is_active', true)
          .maybeSingle();

        if (fetchError) throw fetchError;

        // If no result, try getting the latest
        let settingsData = data;
        if (!settingsData) {
          const { data: latestData } = await supabase
            .from('site_settings')
            .select('*')
            .eq('is_active', true)
            .order('updated_at', { ascending: false })
            .limit(1)
            .maybeSingle();
          
          if (latestData) {
            console.warn('Multiple active rows in site_settings, using latest');
            settingsData = latestData;
          }
        }

        if (settingsData) {
          const businessHours = settingsData.business_hours as any;
          const socialLinks = settingsData.social_links as any;
          
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
