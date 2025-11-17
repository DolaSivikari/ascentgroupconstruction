import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { LucideIcon } from "lucide-react";
import { getIconForService } from "@/utils/serviceIcons";

interface PersonalizedRecommendation {
  service_link: string;
  service_name: string;
  recommendation_score: number;
  reason: string;
  icon: LucideIcon;
}

const getUserIdentifier = () => {
  return localStorage.getItem('user_identifier') || `user_${Date.now()}`;
};

export const usePersonalizedRecommendations = (limit: number = 4) => {
  return useQuery({
    queryKey: ['personalized-recommendations', getUserIdentifier(), limit],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_personalized_recommendations', {
        p_user_identifier: getUserIdentifier(),
        p_limit: limit,
      });

      if (error) {
        console.error('Error fetching recommendations:', error);
        return [];
      }

      // Add icons to recommendations
      return (data || []).map((rec: any) => ({
        ...rec,
        icon: getIconForService(rec.service_name),
      })) as PersonalizedRecommendation[];
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000,
    enabled: !!getUserIdentifier(),
  });
};
