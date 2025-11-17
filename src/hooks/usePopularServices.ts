import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Building2, HardHat, Ruler, Shield, LucideIcon } from "lucide-react";

export interface PopularService {
  name: string;
  link: string;
  icon: LucideIcon;
  searchCount?: number;
  isTrending?: boolean;
  trendPercentage?: number;
}

// Default curated specialty services
const DEFAULT_SERVICES: PopularService[] = [
  {
    name: "Building Envelope Solutions",
    link: "/services/building-envelope",
    icon: Shield,
  },
  {
    name: "Protective Coatings",
    link: "/services/protective-coatings",
    icon: Shield,
  },
  {
    name: "Interior Buildouts",
    link: "/services/interior-buildouts",
    icon: Ruler,
  },
];

// Map service names to icons
const SERVICE_ICON_MAP: Record<string, LucideIcon> = {
  "building envelope solutions": Shield,
  "building envelope": Shield,
  "protective coatings": Shield,
  "waterproofing": Shield,
  "interior buildouts": Ruler,
  "painting services": HardHat,
  "tile & flooring": Ruler,
  "cladding systems": Building2,
};

const getIconForService = (serviceName: string): LucideIcon => {
  const normalizedName = serviceName.toLowerCase();
  return SERVICE_ICON_MAP[normalizedName] || Building2;
};

export function usePopularServices() {
  return useQuery({
    queryKey: ["popular-services"],
    queryFn: async () => {
      const now = new Date();
      const lastWeekStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      const previousWeekStart = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);

      // Query last week's data
      const { data: lastWeekData, error: lastWeekError } = await supabase
        .from("search_analytics")
        .select("clicked_result_name, clicked_result_link, searched_at")
        .not("clicked_result_name", "is", null)
        .not("clicked_result_link", "is", null)
        .gte("searched_at", lastWeekStart.toISOString());

      // Query previous week's data for trend comparison
      const { data: previousWeekData, error: previousWeekError } = await supabase
        .from("search_analytics")
        .select("clicked_result_name, clicked_result_link, searched_at")
        .not("clicked_result_name", "is", null)
        .not("clicked_result_link", "is", null)
        .gte("searched_at", previousWeekStart.toISOString())
        .lt("searched_at", lastWeekStart.toISOString());

      if (lastWeekError) {
        console.debug("Analytics query failed, using defaults:", lastWeekError);
        return DEFAULT_SERVICES;
      }

      // Count occurrences for last week
      const lastWeekCounts = new Map<string, { link: string; count: number }>();
      lastWeekData?.forEach((row) => {
        const name = row.clicked_result_name!;
        const link = row.clicked_result_link!;
        const current = lastWeekCounts.get(name) || { link, count: 0 };
        lastWeekCounts.set(name, { link, count: current.count + 1 });
      });

      // Count occurrences for previous week
      const previousWeekCounts = new Map<string, number>();
      previousWeekData?.forEach((row) => {
        const name = row.clicked_result_name!;
        const current = previousWeekCounts.get(name) || 0;
        previousWeekCounts.set(name, current + 1);
      });

      // Calculate trends and build service list
      const sortedServices = Array.from(lastWeekCounts.entries())
        .map(([name, { link, count }]) => {
          const previousCount = previousWeekCounts.get(name) || 0;
          const increase = count - previousCount;
          const trendPercentage = previousCount > 0 
            ? ((increase / previousCount) * 100) 
            : (count >= 5 ? 100 : 0);
          
          // Consider trending if 50%+ increase OR 10+ new searches
          const isTrending = (trendPercentage >= 50 && previousCount > 0) || increase >= 10;

          return {
            name,
            link,
            icon: getIconForService(name),
            searchCount: count,
            isTrending,
            trendPercentage: Math.round(trendPercentage),
          };
        })
        .sort((a, b) => b.searchCount! - a.searchCount!)
        .slice(0, 4);

      // Use analytics data if we have enough searches (50+), otherwise use defaults
      const totalSearches = lastWeekData?.length || 0;
      if (totalSearches < 50) {
        return DEFAULT_SERVICES;
      }

      return sortedServices.length > 0 ? sortedServices : DEFAULT_SERVICES;
    },
    staleTime: 1000 * 60 * 30, // Cache for 30 minutes
    gcTime: 1000 * 60 * 60, // Keep in cache for 1 hour
  });
}
