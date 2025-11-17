import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface PopularSearch {
  query: string;
  count: number;
}

export function usePopularSearches() {
  const { data: popularSearches = [], isLoading } = useQuery({
    queryKey: ['popular-searches'],
    queryFn: async () => {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const { data, error } = await supabase
        .from('search_analytics')
        .select('search_query')
        .gte('created_at', thirtyDaysAgo.toISOString())
        .not('search_query', 'is', null)
        .not('search_query', 'eq', '');

      if (error) {
        console.error('Failed to fetch popular searches:', error);
        return [];
      }

      // Aggregate by query and count
      const queryCounts = data.reduce((acc, item) => {
        const query = item.search_query.toLowerCase().trim();
        if (query) {
          acc[query] = (acc[query] || 0) + 1;
        }
        return acc;
      }, {} as Record<string, number>);

      // Convert to array and sort by count
      const popular: PopularSearch[] = Object.entries(queryCounts)
        .map(([query, count]) => ({ query, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

      return popular;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  return { popularSearches, isLoading };
}
