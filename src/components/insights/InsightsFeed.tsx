import { useState, useEffect, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, ArrowRight, Pin } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";

interface Insight {
  id: string;
  title: string;
  slug: string;
  summary: string;
  featured_image: string;
  category: string;
  tags: string[];
  published_at: string;
  read_time_minutes: number;
  sector: 'Infrastructure' | 'Buildings' | 'Both' | 'General';
  source: string | null;
  is_pinned: boolean;
}

interface InsightsFeedProps {
  limit?: number;
  sector?: 'Infrastructure' | 'Buildings' | 'General' | 'Both' | null;
  category?: string;
  tags?: string[];
  showPinnedFirst?: boolean;
  showFilters?: boolean;
  featuredSlug?: string;
}

const InsightsFeed = ({
  limit = 12,
  sector: propSector = null,
  category: propCategory = null,
  tags: propTags = [],
  showPinnedFirst = true,
  showFilters = true,
  featuredSlug = null,
}: InsightsFeedProps) => {
  const [insights, setInsights] = useState<Insight[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeSector, setActiveSector] = useState<string | null>(propSector);
  const [activeCategory, setActiveCategory] = useState<string | null>(propCategory);
  const [activeTags, setActiveTags] = useState<string[]>(propTags);

  const loadInsights = async () => {
    setLoading(true);

    let query = supabase
      .from("blog_posts")
      .select("*")
      .eq("publish_state", "published");

    // Apply filters
    if (activeSector && activeSector !== "All") {
      query = query.eq("sector", activeSector);
    }
    if (activeCategory) {
      query = query.eq("category", activeCategory);
    }
    if (activeTags.length > 0) {
      query = query.contains("tags", activeTags);
    }

    // Sort: pinned first, then by date
    if (showPinnedFirst) {
      query = query.order("is_pinned", { ascending: false });
    }
    query = query.order("published_at", { ascending: false }).limit(limit);

    const { data, error } = await query;

    if (!error && data) {
      setInsights(data as Insight[]);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadInsights();
  }, [activeSector, activeCategory, activeTags, limit]);

  const sectorTabs = ["All", "Infrastructure", "Buildings", "General"];
  const categories = useMemo(() => {
    const cats = new Set(insights.map((i) => i.category).filter(Boolean));
    return Array.from(cats);
  }, [insights]);

  const featuredInsight = useMemo(() => {
    if (featuredSlug) {
      return insights.find((i) => i.slug === featuredSlug);
    }
    return insights.find((i) => i.is_pinned) || insights[0];
  }, [insights, featuredSlug]);

  const regularInsights = useMemo(() => {
    return insights.filter((i) => i.id !== featuredInsight?.id);
  }, [insights, featuredInsight]);

  const getSectorColor = (sector: string) => {
    const colors: Record<string, string> = {
      Infrastructure: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
      Buildings: "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20",
      Both: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
      General: "bg-muted text-muted-foreground border-border",
    };
    return colors[sector] || colors.General;
  };

  if (loading) {
    return (
      <section className="py-12 md:py-16 bg-background">
        <div className="container mx-auto px-4 md:px-6 max-w-7xl">
          <div className="space-y-6">
            <Skeleton className="h-10 w-64 mx-auto" />
            <Skeleton className="h-5 w-96 mx-auto" />
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {[...Array(6)].map((_, i) => (
                <Skeleton key={i} className="h-96 w-full" />
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 md:py-16 bg-background">
      <div className="container mx-auto px-4 md:px-6 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
            Industry Insights
          </h2>
          <p className="text-base text-muted-foreground max-w-2xl mx-auto">
            Expert perspectives on construction trends, innovations, and best practices
          </p>
          <div className="h-1 w-16 bg-primary mx-auto mt-4"></div>
        </div>

        {/* Sector Filter Tabs */}
        {showFilters && (
          <div className="flex flex-wrap justify-center gap-2 mb-6">
            {sectorTabs.map((sector) => (
              <button
                key={sector}
                onClick={() => setActiveSector(sector === "All" ? null : sector)}
                className={`px-5 py-1.5 rounded-full text-sm font-medium transition-all ${
                  (sector === "All" && !activeSector) || activeSector === sector
                    ? "bg-primary text-primary-foreground shadow-lg"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                {sector}
              </button>
            ))}
          </div>
        )}

        {/* Featured Insight */}
        {featuredInsight && (
          <Link to={`/blog/${featuredInsight.slug}`}>
            <Card className="mb-8 overflow-hidden hover:shadow-xl transition-shadow group animate-fade-in">
              <div className="grid md:grid-cols-2 gap-0">
                <div className="relative aspect-[4/3] md:aspect-auto overflow-hidden">
                  <img
                    src={featuredInsight.featured_image || "/placeholder.svg"}
                    alt={featuredInsight.title}
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500"
                  />
                  {featuredInsight.is_pinned && (
                    <Badge className="absolute top-3 right-3 gap-1 bg-primary/90 backdrop-blur-sm text-xs">
                      <Pin className="h-3 w-3" />
                      Featured
                    </Badge>
                  )}
                </div>
                <CardContent className="flex flex-col justify-center p-6 md:p-8">
                  <div className="flex flex-wrap gap-2 mb-3">
                    <Badge variant="outline" className={getSectorColor(featuredInsight.sector)}>
                      {featuredInsight.sector}
                    </Badge>
                    {featuredInsight.category && (
                      <Badge variant="outline">{featuredInsight.category}</Badge>
                    )}
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
                    {featuredInsight.title}
                  </h3>
                  <p className="text-muted-foreground mb-4 line-clamp-3 text-sm">
                    {featuredInsight.summary}
                  </p>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {featuredInsight.read_time_minutes} min read
                    </span>
                    <span>
                      {format(new Date(featuredInsight.published_at), "MMM d, yyyy")}
                    </span>
                  </div>
                </CardContent>
              </div>
            </Card>
          </Link>
        )}

        {/* Regular Insights Grid */}
        {regularInsights.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 animate-fade-in">
            {regularInsights.map((insight) => (
              <Link key={insight.id} to={`/blog/${insight.slug}`}>
                <Card className="overflow-hidden h-full hover:shadow-xl transition-all group hover-scale">
                  <div className="relative aspect-[16/9] overflow-hidden">
                    <img
                      src={insight.featured_image || "/placeholder.svg"}
                      alt={insight.title}
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500"
                    />
                    {insight.is_pinned && (
                      <Badge className="absolute top-3 right-3 gap-1 bg-primary/90 backdrop-blur-sm">
                        <Pin className="h-3 w-3" />
                        Pinned
                      </Badge>
                    )}
                  </div>
                  <CardContent className="p-4">
                    <div className="flex flex-wrap gap-1.5 mb-2">
                      <Badge variant="outline" className={getSectorColor(insight.sector)}>
                        {insight.sector}
                      </Badge>
                      {insight.category && (
                        <Badge variant="outline" className="text-xs">
                          {insight.category}
                        </Badge>
                      )}
                    </div>
                    <h3 className="text-lg font-bold text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-2">
                      {insight.title}
                    </h3>
                    <p className="text-muted-foreground mb-3 line-clamp-2 text-sm">
                      {insight.summary}
                    </p>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {insight.read_time_minutes} min
                      </span>
                      <span>{format(new Date(insight.published_at), "MMM d")}</span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-muted-foreground text-lg">
              No insights found for the selected filters.
            </p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => {
                setActiveSector(null);
                setActiveCategory(null);
                setActiveTags([]);
              }}
            >
              Clear Filters
            </Button>
          </div>
        )}

        {/* View All CTA */}
        <div className="text-center mt-8">
          <Link to="/insights">
            <Button size="lg" className="group">
              View All Insights
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default InsightsFeed;
