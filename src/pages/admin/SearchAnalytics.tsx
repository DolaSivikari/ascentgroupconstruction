import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, TrendingUp, BarChart3, Users } from "lucide-react";
import { format } from "date-fns";

interface SearchAnalytic {
  id: string;
  search_query: string;
  results_count: number;
  clicked_result_name: string | null;
  section_distribution: Record<string, number> | null;
  searched_at: string;
}

interface TopSearch {
  query: string;
  count: number;
  avg_results: number;
}

const SearchAnalytics = () => {
  // Fetch recent searches
  const { data: recentSearches, isLoading: loadingRecent } = useQuery({
    queryKey: ["search-analytics-recent"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("search_analytics")
        .select("*")
        .order("searched_at", { ascending: false })
        .limit(50);

      if (error) throw error;
      return data as SearchAnalytic[];
    },
  });

  // Fetch top searches with manual aggregation
  const { data: topSearches, isLoading: loadingTop } = useQuery({
    queryKey: ["search-analytics-top"],
    queryFn: async () => {
      const { data: allSearches, error } = await supabase
        .from("search_analytics")
        .select("search_query, results_count");

      if (error) throw error;
      if (!allSearches) return [];

      // Manual aggregation
      const aggregated = allSearches.reduce((acc, search) => {
        const existing = acc.find((s) => s.query === search.search_query);
        if (existing) {
          existing.count += 1;
          existing.avg_results = (existing.avg_results * (existing.count - 1) + search.results_count) / existing.count;
        } else {
          acc.push({
            query: search.search_query,
            count: 1,
            avg_results: search.results_count,
          });
        }
        return acc;
      }, [] as TopSearch[]);

      return aggregated.sort((a, b) => b.count - a.count).slice(0, 20);
    },
  });

  // Calculate stats
  const totalSearches = recentSearches?.length || 0;
  const uniqueQueries = new Set(recentSearches?.map((s) => s.search_query)).size;
  const avgResults = recentSearches?.reduce((sum, s) => sum + s.results_count, 0) / totalSearches || 0;
  const clickThroughRate = (recentSearches?.filter((s) => s.clicked_result_name).length / totalSearches * 100) || 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Search Analytics</h1>
        <p className="text-muted-foreground mt-2">
          Track what users search for to optimize navigation and content
        </p>
      </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Searches</CardTitle>
              <Search className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalSearches}</div>
              <p className="text-xs text-muted-foreground">Last 50 recorded</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Unique Queries</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{uniqueQueries}</div>
              <p className="text-xs text-muted-foreground">Different search terms</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Avg Results</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{avgResults.toFixed(1)}</div>
              <p className="text-xs text-muted-foreground">Per search query</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Click Rate</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{clickThroughRate.toFixed(1)}%</div>
              <p className="text-xs text-muted-foreground">Clicked a result</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Searches */}
          <Card>
            <CardHeader>
              <CardTitle>Top Search Queries</CardTitle>
              <CardDescription>Most frequently searched terms</CardDescription>
            </CardHeader>
            <CardContent>
              {loadingTop ? (
                <div className="space-y-2">
                  {[...Array(10)].map((_, i) => (
                    <Skeleton key={i} className="h-10 w-full" />
                  ))}
                </div>
              ) : (
                <div className="space-y-2">
                  {topSearches?.map((search, index) => (
                    <div
                      key={search.query}
                      className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <Badge variant="outline" className="w-8 h-8 flex items-center justify-center">
                          {index + 1}
                        </Badge>
                        <div>
                          <div className="font-medium">{search.query}</div>
                          <div className="text-xs text-muted-foreground">
                            Avg {search.avg_results.toFixed(1)} results
                          </div>
                        </div>
                      </div>
                      <Badge variant="secondary">{search.count} searches</Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Searches */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Searches</CardTitle>
              <CardDescription>Latest search activity</CardDescription>
            </CardHeader>
            <CardContent>
              {loadingRecent ? (
                <div className="space-y-2">
                  {[...Array(10)].map((_, i) => (
                    <Skeleton key={i} className="h-16 w-full" />
                  ))}
                </div>
              ) : (
                <div className="space-y-2 max-h-[600px] overflow-y-auto">
                  {recentSearches?.slice(0, 20).map((search) => (
                    <div
                      key={search.id}
                      className="p-3 bg-muted/50 rounded-lg space-y-1"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{search.search_query}</span>
                        <Badge variant="outline">{search.results_count} results</Badge>
                      </div>
                      {search.clicked_result_name && (
                        <div className="text-xs text-green-600 dark:text-green-400">
                          ✓ Clicked: {search.clicked_result_name}
                        </div>
                      )}
                      <div className="text-xs text-muted-foreground">
                        {format(new Date(search.searched_at), "MMM d, yyyy 'at' h:mm a")}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
    </div>
  );
};

export default SearchAnalytics;
