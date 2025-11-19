import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { calculateAggregateRating } from "@/utils/review-helpers";

/**
 * Hook to fetch and calculate aggregate rating from published testimonials
 * @returns Aggregate rating data with loading state
 */
export const useAggregateRating = () => {
  const { data: testimonials, isLoading } = useQuery({
    queryKey: ["aggregate-rating"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("testimonials")
        .select("rating")
        .eq("publish_state", "published")
        .not("rating", "is", null)
        .gt("rating", 0);

      if (error) {
        console.error("Error fetching testimonials for aggregate rating:", error);
        return [];
      }

      return data || [];
    },
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });

  const aggregateRating = calculateAggregateRating(testimonials || []);
  const hasRatings = testimonials && testimonials.length > 0;

  return {
    aggregateRating,
    hasRatings,
    isLoading,
  };
};
