import { useState, useEffect, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight, Search, X } from "lucide-react";
import { Link } from "react-router-dom";
import { TieredServicesGrid } from "./TieredServicesGrid";

interface Service {
  id: string;
  name: string;
  slug: string;
  short_description: string | null;
  category: string | null;
  icon_name: string | null;
  featured?: boolean;
  typical_timeline?: string | null;
  project_types?: string[] | null;
  service_tier?: string | null;
  challenge_tags?: string[] | null;
}

export const ServicesExplorer = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [activeChallenge, setActiveChallenge] = useState<string | null>(null);
  const [showCount, setShowCount] = useState(50);

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    const { data, error } = await supabase
      .from("services")
      .select("id, name, slug, short_description, category, icon_name, featured, typical_timeline, project_types, service_tier, challenge_tags")
      .eq("publish_state", "published")
      .order("featured", { ascending: false })
      .order("name");

    if (error) {
      console.error("Error loading services:", error);
      setLoading(false);
      return;
    }

    setServices(data || []);
    setLoading(false);
  };

  // Filter services based on challenge, search, and filters
  const filteredServices = useMemo(() => {
    let filtered = services;

    // Challenge filter
    if (activeChallenge) {
      filtered = filtered.filter((s) =>
        s.challenge_tags?.includes(activeChallenge)
      );
    }

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (s) =>
          s.name.toLowerCase().includes(query) ||
          s.short_description?.toLowerCase().includes(query) ||
          s.category?.toLowerCase().includes(query)
      );
    }

    // Project type filters
    if (activeFilters.length > 0) {
      filtered = filtered.filter((s) =>
        s.project_types?.some((type) => activeFilters.includes(type))
      );
    }

    return filtered;
  }, [services, activeChallenge, searchQuery, activeFilters]);

  const visibleServices = filteredServices.slice(0, showCount);

  const handleFilterToggle = (filter: string) => {
    setActiveFilters((prev) =>
      prev.includes(filter)
        ? prev.filter((f) => f !== filter)
        : [...prev, filter]
    );
  };

  const handleLoadMore = () => {
    setShowCount((prev) => prev + 12);
  };

  const activeFilterCount = activeFilters.length + (searchQuery ? 1 : 0) + (activeChallenge ? 1 : 0);

  return (
    <section className="relative py-16 md:py-24 overflow-hidden">
      {/* Background Treatment */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/5" />
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMwMDAiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDM0djItaDJ2LTJoLTJ6bTAtNHYyaDJ2LTJoLTJ6bS0yIDJ2Mmgydi0yaC0yem0wLTJ2Mmgydi0yaC0yem0yLTJ2Mmgydi0yaC0yem0wLTJ2Mmgydi0yaC0yem0tMiAydjJoMnYtMmgtMnptMC0ydjJoMnYtMmgtMnptMi0ydjJoMnYtMmgtMnptMC0ydjJoMnYtMmgtMnoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-40" />
      
      <div className="container mx-auto px-4 md:px-6 max-w-7xl relative z-10">
        {/* Section Header with Stats */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            Specialty Contractor Services
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4 tracking-tight">
            Complete Building Solutions
          </h2>
          
          <p className="text-lg text-muted-foreground leading-relaxed mb-8">
            From building envelope and cladding systems to masonry restoration and interior construction—our self-performed specialty services deliver quality across commercial, multi-family, and institutional projects.
          </p>
          
          {/* Stats Bar */}
          <div className="grid grid-cols-3 gap-4 md:gap-8 max-w-2xl mx-auto">
            <div className="text-center p-4 rounded-lg bg-card/50 backdrop-blur-sm border border-border/50">
              <div className="text-2xl md:text-3xl font-bold text-primary mb-1">{services.length}+</div>
              <div className="text-xs md:text-sm text-muted-foreground">Services</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-card/50 backdrop-blur-sm border border-border/50">
              <div className="text-2xl md:text-3xl font-bold text-primary mb-1">15+</div>
              <div className="text-xs md:text-sm text-muted-foreground">Years Experience</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-card/50 backdrop-blur-sm border border-border/50">
              <div className="text-2xl md:text-3xl font-bold text-primary mb-1">500+</div>
              <div className="text-xs md:text-sm text-muted-foreground">Projects Complete</div>
            </div>
          </div>
        </div>

        {/* Enhanced Search & Filter Controls */}
        <div className="max-w-3xl mx-auto mb-12">
          {/* Search Bar with Glass Effect */}
          <div className="relative mb-6">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg blur-xl opacity-50" />
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search by service name, category, or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 pr-12 h-14 text-base bg-card/80 backdrop-blur-sm border-2 border-border/50 hover:border-primary/50 focus:border-primary transition-all shadow-lg"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-muted hover:bg-muted-foreground/20 text-muted-foreground hover:text-foreground transition-all"
                  aria-label="Clear search"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>

          {/* Project Type Filters - Enhanced Pills */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            <span className="text-sm font-medium text-muted-foreground mr-2">Filter by:</span>
            {["residential", "commercial", "industrial"].map((filter) => (
              <Button
                key={filter}
                variant={activeFilters.includes(filter) ? "default" : "outline"}
                size="lg"
                onClick={() => handleFilterToggle(filter)}
                className={`
                  min-w-[120px] capitalize font-medium transition-all
                  ${activeFilters.includes(filter) 
                    ? "shadow-lg shadow-primary/25 scale-105" 
                    : "hover:scale-105 hover:border-primary/50"
                  }
                `}
              >
                {filter}
                {activeFilters.includes(filter) && (
                  <span className="ml-2 w-2 h-2 rounded-full bg-background animate-pulse" />
                )}
              </Button>
            ))}
            {activeFilterCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setActiveFilters([]);
                  setSearchQuery("");
                  setActiveChallenge(null);
                }}
                className="text-sm text-muted-foreground hover:text-foreground hover:bg-muted ml-2"
              >
                Clear all ({activeFilterCount})
              </Button>
            )}
          </div>
        </div>

        {/* Results with Enhanced Layout */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-72 bg-card/50 backdrop-blur-sm animate-pulse rounded-xl border border-border/50" />
            ))}
          </div>
        ) : filteredServices.length === 0 ? (
          <div className="text-center py-20">
            <div className="max-w-md mx-auto">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                <Search className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">No services found</h3>
              <p className="text-muted-foreground mb-6">
                Try adjusting your search or filters to find what you're looking for.
              </p>
              <Button
                variant="outline"
                size="lg"
                onClick={() => {
                  setActiveFilters([]);
                  setSearchQuery("");
                  setActiveChallenge(null);
                }}
              >
                Clear All Filters
              </Button>
            </div>
          </div>
        ) : (
          <>
            {/* Enhanced Results Count Bar */}
            <div className="flex items-center justify-between mb-8 p-4 rounded-lg bg-card/50 backdrop-blur-sm border border-border/50">
              <div className="flex items-center gap-3">
                <div className="w-1 h-8 bg-primary rounded-full" />
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {visibleServices.length} of {filteredServices.length} services
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {activeFilterCount > 0 ? `${activeFilterCount} filter${activeFilterCount > 1 ? 's' : ''} applied` : 'Showing all services'}
                  </p>
                </div>
              </div>
              {activeFilterCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setActiveFilters([]);
                    setSearchQuery("");
                    setActiveChallenge(null);
                  }}
                  className="text-muted-foreground hover:text-foreground"
                >
                  Reset
                </Button>
              )}
            </div>

            <TieredServicesGrid services={visibleServices} />

            {filteredServices.length > visibleServices.length && (
              <div className="text-center mt-12">
                <Button onClick={handleLoadMore} size="lg" className="shadow-lg hover:shadow-xl transition-all">
                  Load More Services
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            )}
          </>
        )}

        {/* Enhanced CTA Section */}
        <div className="relative mt-20">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-primary/5 to-secondary/10 rounded-2xl blur-3xl" />
          <div className="relative text-center p-8 md:p-12 rounded-2xl bg-card/80 backdrop-blur-sm border-2 border-border/50">
            <div className="max-w-2xl mx-auto">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                Free Consultation
              </div>
              
              <h3 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Ready to Start Your Project?
              </h3>
              
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                Get a detailed site assessment and project proposal from our team of building envelope specialists. We'll evaluate your needs and provide transparent pricing.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link to="/contact">
                  <Button size="lg" className="group shadow-lg hover:shadow-xl transition-all w-full sm:w-auto">
                    Request Site Assessment
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link to="/services">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto">
                    View All Services
                  </Button>
                </Link>
              </div>
              
              <p className="text-xs text-muted-foreground mt-6">
                ✓ No obligation consultation  •  ✓ Licensed & Insured  •  ✓ 15+ Years Experience
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
