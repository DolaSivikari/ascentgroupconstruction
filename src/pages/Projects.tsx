import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import PageHeader from "@/components/PageHeader";
import Breadcrumb from "@/components/Breadcrumb";
import FilterBar from "@/components/FilterBar";
import ProjectCard from "@/components/ProjectCard";
import ProjectFeaturedCard from "@/components/ProjectFeaturedCard";
import { Building2, Home, School, Factory } from "lucide-react";
import { Button } from "@/ui/Button";
import { supabase } from "@/integrations/supabase/client";
import { useRealtimeProjects } from "@/hooks/useRealtimeProjects";
import { resolveImagePath } from "@/utils/imageResolver";
import { PremiumProjectHero } from "@/components/projects/PremiumProjectHero";
import { FilterDrawer } from "@/components/projects/FilterDrawer";
import { FilterChips } from "@/components/projects/FilterChips";
import { ProjectQuickView } from "@/components/projects/ProjectQuickView";
import { VideoTestimonials } from "@/components/shared/VideoTestimonials";
import { ScrollToTop } from "@/components/ui/scroll-to-top";
import { usePageAnalytics } from "@/hooks/usePageAnalytics";


const categories = [
  { label: "All Projects", value: "All", icon: Building2 },
  { label: "Commercial", value: "Commercial", icon: Building2 },
  { label: "Residential", value: "Residential", icon: Home },
  { label: "Institutional", value: "Institutional", icon: School },
  { label: "Industrial", value: "Industrial", icon: Factory },
];

const years = ["All", "2024", "2023", "2022", "2021"];

const Projects = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedYear, setSelectedYear] = useState("All");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [visibleCount, setVisibleCount] = useState(6);
  const [allProjects, setAllProjects] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [quickViewProject, setQuickViewProject] = useState<any>(null);
  
  // Analytics tracking
  usePageAnalytics('projects');
  
  // Advanced filters
  const [selectedDeliveryMethod, setSelectedDeliveryMethod] = useState("All");
  const [selectedClientType, setSelectedClientType] = useState("All");
  const [selectedValueRange, setSelectedValueRange] = useState("All");
  const [performanceBadges, setPerformanceBadges] = useState({
    onTime: false,
    onBudget: false,
    zeroIncidents: false,
  });

  // Fetch projects from database with realtime updates
  useEffect(() => {
    const fetchProjects = async () => {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("publish_state", "published")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching projects:", error);
      } else if (data) {
        // Transform database projects to component format
        const projects = data.map((project: any) => ({
          title: project.title,
          category: project.category || "General",
          location: project.location || "N/A",
          year: project.year || new Date(project.created_at).getFullYear().toString(),
          size: project.project_size || "N/A",
          duration: project.duration || "N/A",
          image: resolveImagePath(project.featured_image),
          images: project.gallery || [],
          tags: project.tags || [project.category, project.duration, project.project_size].filter(Boolean),
          description: project.description || project.summary || "",
          highlights: project.summary ? [project.summary] : [],
          slug: project.slug,
          featured: project.featured,
          id: project.id,
          rawData: project,
          // GC Metrics
          project_value: project.project_value,
          your_role: project.your_role,
          on_time_completion: project.on_time_completion,
          on_budget: project.on_budget,
          safety_incidents: project.safety_incidents,
        }));
        setAllProjects(projects);
      }
      setIsLoading(false);
    };

    fetchProjects();
  }, []);

  // Enable realtime subscription for instant updates
  const realtimeProjects = useRealtimeProjects(allProjects.map(p => p.rawData));
  
  useEffect(() => {
    if (realtimeProjects.length > 0) {
      const transformed = realtimeProjects.map((project: any) => ({
        title: project.title,
        category: project.category || "General",
        location: project.location || "N/A",
        year: project.year || new Date(project.created_at).getFullYear().toString(),
        size: project.project_size || "N/A",
        duration: project.duration || "N/A",
        image: resolveImagePath(project.featured_image),
        images: project.gallery || [],
        tags: project.tags || [project.category, project.duration, project.project_size].filter(Boolean),
        description: project.description || project.summary || "",
        highlights: project.summary ? [project.summary] : [],
        slug: project.slug,
        featured: project.featured,
        id: project.id,
        rawData: project,
        // GC Metrics
        project_value: project.project_value,
        your_role: project.your_role,
        on_time_completion: project.on_time_completion,
        on_budget: project.on_budget,
        safety_incidents: project.safety_incidents,
      }));
      setAllProjects(transformed);
    }
  }, [realtimeProjects]);

  const filteredProjects = allProjects.filter((project) => {
    const matchesSearch = 
      project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === "All" || project.category.includes(selectedCategory);
    const matchesYear = selectedYear === "All" || project.year === selectedYear;

    // Advanced filters
    const matchesDeliveryMethod = 
      selectedDeliveryMethod === "All" || 
      project.rawData?.delivery_method === selectedDeliveryMethod;

    const matchesClientType = 
      selectedClientType === "All" || 
      project.rawData?.client_type === selectedClientType;

    const matchesValueRange = (() => {
      if (selectedValueRange === "All") return true;
      const projectValue = project.project_value || 0;
      
      if (selectedValueRange === "0-500000") return projectValue < 50000000; // $500K in cents
      if (selectedValueRange === "500000-1000000") return projectValue >= 50000000 && projectValue < 100000000;
      if (selectedValueRange === "1000000-2500000") return projectValue >= 100000000 && projectValue < 250000000;
      if (selectedValueRange === "2500000-5000000") return projectValue >= 250000000 && projectValue < 500000000;
      if (selectedValueRange === "5000000+") return projectValue >= 500000000;
      return true;
    })();

    const matchesPerformance = (
      (!performanceBadges.onTime || project.on_time_completion === true) &&
      (!performanceBadges.onBudget || project.on_budget === true) &&
      (!performanceBadges.zeroIncidents || project.safety_incidents === 0)
    );

    return matchesSearch && matchesCategory && matchesYear && 
           matchesDeliveryMethod && matchesClientType && matchesValueRange && 
           matchesPerformance;
  });

  const featuredProjects = (filteredProjects.some(p => p.featured) ? filteredProjects.filter(p => p.featured) : filteredProjects).slice(0, 3);
  const regularProjects = filteredProjects.filter(p => !p.featured);
  const visibleProjects = regularProjects.slice(0, visibleCount);

  const handleViewDetails = (slug: string) => {
    navigate(`/projects/${slug}`);
  };

  const loadMore = () => {
    setVisibleCount(prev => prev + 6);
  };

  return (
    <div className="min-h-screen text-foreground">
      <SEO
        title="Our Projects - 500+ Completed | Ascen Group"
        description="Browse our portfolio of 500+ successfully completed construction and painting projects across the GTA. Commercial, residential, institutional, and industrial work."
        canonical="https://ascentgroupconstruction.com/projects"
      />
      <Navigation />

      <PremiumProjectHero 
        featuredProjects={featuredProjects.map(p => ({
          title: p.title,
          location: p.location,
          category: p.category,
          image: p.image,
          value: p.project_value ? `$${(p.project_value / 100000000).toFixed(1)}M` : undefined
        }))}
      />


      {/* Featured Projects Spotlight */}
      {featuredProjects.length > 0 && (
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold mb-2 text-foreground">Featured Projects</h2>
            <p className="text-muted-foreground">Showcasing our most notable work</p>
          </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredProjects.map((project) => (
                <ProjectFeaturedCard key={project.slug} {...project} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Filter Bar with Advanced Filters */}
      <div className="bg-muted/30 py-6 border-y">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap items-center gap-4 mb-4">
            <FilterDrawer 
              filters={{
                minValue: selectedValueRange,
                minYear: selectedYear,
                onTime: performanceBadges.onTime,
                onBudget: performanceBadges.onBudget,
                zeroIncidents: performanceBadges.zeroIncidents
              }}
              onFiltersChange={(newFilters) => {
                if (newFilters.minValue) setSelectedValueRange(newFilters.minValue);
                if (newFilters.minYear) setSelectedYear(newFilters.minYear.toString());
                if (newFilters.onTime !== undefined) setPerformanceBadges(prev => ({ ...prev, onTime: newFilters.onTime }));
              }}
            />
          </div>
          
          <FilterChips
            filters={[
              selectedCategory !== "All" && { label: "Category", value: selectedCategory, onRemove: () => setSelectedCategory("All") },
              selectedYear !== "All" && { label: "Year", value: selectedYear, onRemove: () => setSelectedYear("All") },
              selectedDeliveryMethod !== "All" && { label: "Delivery", value: selectedDeliveryMethod, onRemove: () => setSelectedDeliveryMethod("All") },
              performanceBadges.onTime && { label: "Performance", value: "On Time", onRemove: () => setPerformanceBadges(prev => ({ ...prev, onTime: false })) }
            ].filter(Boolean) as any}
            onClearAll={() => {
              setSelectedCategory("All");
              setSelectedYear("All");
              setSelectedDeliveryMethod("All");
              setSelectedClientType("All");
              setSelectedValueRange("All");
              setPerformanceBadges({ onTime: false, onBudget: false, zeroIncidents: false });
            }}
          />
        </div>
      </div>

      <FilterBar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        selectedYear={selectedYear}
        onYearChange={setSelectedYear}
        categories={categories}
        years={years}
        projectCount={filteredProjects.length}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        selectedDeliveryMethod={selectedDeliveryMethod}
        onDeliveryMethodChange={setSelectedDeliveryMethod}
        selectedClientType={selectedClientType}
        onClientTypeChange={setSelectedClientType}
        selectedValueRange={selectedValueRange}
        onValueRangeChange={setSelectedValueRange}
        performanceBadges={performanceBadges}
        onPerformanceBadgesChange={setPerformanceBadges}
      />

      {/* Projects Grid */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          {isLoading ? (
            <div className="text-center py-16">
              <p className="text-muted-foreground">Loading projects...</p>
            </div>
          ) : visibleProjects.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-muted-foreground mb-4">No projects found matching your criteria</p>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm("");
                  setSelectedCategory("All");
                  setSelectedYear("All");
                  setSelectedDeliveryMethod("All");
                  setSelectedClientType("All");
                  setSelectedValueRange("All");
                  setPerformanceBadges({ onTime: false, onBudget: false, zeroIncidents: false });
                }}
              >
                Clear Filters
              </Button>
            </div>
          ) : (
            <>
              <div className="grid md:grid-cols-2 gap-8">
                {visibleProjects.map((project) => (
                  <div key={project.slug}>
                    <ProjectCard
                      {...project}
                      slug={project.slug}
                      onViewDetails={handleViewDetails}
                    />
                    <button
                      onClick={() => setQuickViewProject(project)}
                      className="mt-2 text-sm text-primary hover:underline w-full text-center"
                    >
                      Quick View
                    </button>
                  </div>
                ))}
              </div>

              {/* Load More Button */}
              {visibleCount < regularProjects.length && (
                <div className="text-center mt-12">
                  <Button onClick={loadMore} size="lg">
                    Load More Projects
                    <span className="ml-2">
                      ({visibleCount} of {regularProjects.length})
                    </span>
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* Video Testimonials - Removed pending verified testimonial collection */}

      {/* Quick View Modal */}
      <ProjectQuickView
        project={quickViewProject}
        open={!!quickViewProject}
        onOpenChange={(open) => !open && setQuickViewProject(null)}
      />

      <ScrollToTop />
      <Footer />
    </div>
  );
};

export default Projects;
