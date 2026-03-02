import { useQueries } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface HomepageSettings {
  headline: string;
  subheadline: string;
  hero_description: string | null;
  cta_primary_text: string | null;
  cta_primary_url: string | null;
  cta_secondary_text: string | null;
  cta_secondary_url: string | null;
  cta_tertiary_text: string | null;
  cta_tertiary_url: string | null;
  value_prop_1: string | null;
  value_prop_2: string | null;
  value_prop_3: string | null;
}

interface ValuePillar {
  id: string;
  title: string;
  description: string;
  icon_name: string;
  display_order: number;
  is_active: boolean;
}

export interface HeroSlide {
  id: string;
  headline: string;
  subheadline: string;
  description: string | null;
  stat_number: string | null;
  stat_label: string | null;
  primary_cta_text: string;
  primary_cta_url: string;
  primary_cta_icon: string | null;
  secondary_cta_text: string | null;
  secondary_cta_url: string | null;
  video_url: string | null;
  poster_url: string | null;
  display_order: number;
  is_active: boolean;
}

const fetchHomepageSettings = async (): Promise<HomepageSettings | null> => {
  const { data, error } = await supabase
    .from("homepage_settings")
    .select("*")
    .eq("is_active", true)
    .maybeSingle();

  if (error) {
    console.error("Error fetching homepage settings:", error);
    return null;
  }
  return data as HomepageSettings;
};

const fetchValuePillars = async (): Promise<ValuePillar[]> => {
  const { data, error } = await supabase
    .from("value_pillars")
    .select("*")
    .eq("is_active", true)
    .order("display_order");

  if (error) {
    console.error("Error fetching value pillars:", error);
    return [];
  }
  return data as ValuePillar[];
};

export const fetchHeroSlides = async (): Promise<HeroSlide[]> => {
  const { data, error } = await supabase
    .from("hero_slides")
    .select("*")
    .eq("is_active", true)
    .order("display_order");

  if (error) {
    console.error("Error fetching hero slides:", error);
    return [];
  }
  return data as HeroSlide[];
};

/**
 * Coordinated data fetching for homepage
 * Batches all homepage queries for optimal performance
 */
export const useHomepageData = () => {
  return useQueries({
    queries: [
      {
        queryKey: ['homepage-settings'],
        queryFn: fetchHomepageSettings,
        staleTime: 10 * 60 * 1000, // 10 minutes
        gcTime: 15 * 60 * 1000, // 15 minutes (renamed from cacheTime)
        refetchOnWindowFocus: false,
      },
      {
        queryKey: ['value-pillars'],
        queryFn: fetchValuePillars,
        staleTime: 10 * 60 * 1000,
        gcTime: 15 * 60 * 1000,
        refetchOnWindowFocus: false,
      },
      {
        queryKey: ['hero-slides'],
        queryFn: fetchHeroSlides,
        staleTime: 10 * 60 * 1000,
        gcTime: 15 * 60 * 1000,
        refetchOnWindowFocus: false,
      }
    ]
  });
};

// Export individual query keys for use in other components
export const homepageQueryKeys = {
  settings: ['homepage-settings'],
  pillars: ['value-pillars'],
  slides: ['hero-slides'],
} as const;
