import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import FilterBar from "@/components/FilterBar";
import { CTABand } from "@/design-system/components/CTABand";
import ProjectCard from "@/components/ProjectCard";
import ProjectFeaturedCard from "@/components/ProjectFeaturedCard";
import { Section } from "@/components/sections/Section";
import { Building2, Home, School, Factory } from "lucide-react";
import { Button } from "@/ui/Button";
import { supabase } from "@/integrations/supabase/client";
import { useRealtimeProjects } from "@/hooks/useRealtimeProjects";
import { formatProjectValue } from "@/utils/formatProjectValue";
import { resolveImagePath } from "@/utils/imageResolver";
import { PremiumProjectHero } from "@/components/projects/PremiumProjectHero";
import { FilterChips } from "@/components/projects/FilterChips";
import { ProjectQuickView } from "@/components/projects/ProjectQuickView";
import { VideoTestimonials } from "@/components/shared/VideoTestimonials";
import { ScrollToTop } from "@/components/ui/scroll-to-top";
import { usePageAnalytics } from "@/hooks/usePageAnalytics";
import { TYPOGRAPHY_STYLES } from "@/design-system/constants";


const categories = [
  { label: "All Projects", value: "All", icon: Building2 },
  { label: "Commercial", value: "Commercial", icon: Building2 },
  { label: "Residential", value: "Residential", icon: Home },
  { label: "Institutional", value: "Institutional", icon: School },
  { label: "Industrial", value: "Industrial", icon: Factory },
];

const years = ["All", "2024", "2023", "2022", "2021"];

type ProjectRecord = Record<string, any>;
type ProjectViewModel = {
  title: string; category: string; location: string; year: string; size: string; duration: string; image: string;
  images: any[]; tags: string[]; description: string; highlights: string[]; slug: string; featured: boolean; id: string; rawData: ProjectRecord;
  project_value?: any; your_role?: string | null; on_time_completion?: boolean | null; on_budget?: boolean | null; safety_incidents?: number | null;
};

const Projects = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedYear, setSelectedYear] = useState("All");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [visibleCount, setVisibleCount] = useState(6);
  const [allProjects, setAllProjects] = useState<ProjectViewModel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [quickViewProject, setQuickViewProject] = useState<ProjectViewModel | null>(null);
  
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
        const projects = data.map((project) => ({
          title: project.title,
          category: project.category || "General",
          location: project.location || "N/A",
          year: project.year || new Date(project.created_at).getFullYear().toString(),
          size: project.project_size || "N/A",
          duration: project.duration || "N/A",
          image: resolveImagePath(project.featured_image),
          images: (project.gallery || []) as any[],
          tags: project.tags || [project.category, project.duration, project.project_size].filter(Boolean),
          description: project.description || project.summary || "",
          highlights: project.summary ? [project.summary] : [],
          slug: project.slug,
          featured: project.featured,
          id: project.id,
          rawData: project as any,
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
  const realtimeProjects = useRealtimeProjects(allProjects.map(p => p.rawData) as any[]);
  
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
        title="Our Projects | Ascent Group Construction"
        description="Browse our growing portfolio of construction and restoration projects across the GTA. Commercial, residential, and institutional envelope and interior work."
        canonical="https://ascentgroupconstruction.com/projects"
      />
      <Navigation />

      <PremiumProjectHero 
        featuredProjects={featuredProjects.map(p => ({
          title: p.title,
          location: p.location,
          category: p.category,
          image: p.image,
          value: formatProjectValue(p.project_value) ?? undefined
        }))}
      />


      {/* Featured Projects Spotlight */}
      {featuredProjects.length > 0 && (
        <Section size="major" className="bg-muted/30">
          <div className="text-center mb-8">
            <h2 className={`${TYPOGRAPHY_STYLES.sectionTitle} mb-2 text-foreground`}>Featured Projects</h2>
            <p className="text-muted-foreground">Showcasing our most notable work</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProjects.map((project) => (
              <ProjectFeaturedCard key={project.slug} {...project} />
            ))}
          </div>
        </Section>
      )}

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
      <Section size="major">
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
              <div className="text-center mb-8">
                <h2 className={`${TYPOGRAPHY_STYLES.sectionTitle} mb-2 text-foreground`}>All Projects</h2>
                <p className="text-muted-foreground">{filteredProjects.length} project{filteredProjects.length !== 1 ? 's' : ''} found</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {visibleProjects.map((project) => (
                  <ProjectCard
                    key={project.slug}
                    {...project}
                    slug={project.slug}
                    onViewDetails={handleViewDetails}
                    onQuickView={() => setQuickViewProject(project)}
                  />
                ))}
              </div>

              {visibleCount < regularProjects.length && (
                <div className="text-center mt-12">
                  <Button variant="outline" onClick={loadMore} size="lg">
                    Show More Projects
                    <span className="ml-2 text-muted-foreground text-sm">
                      Showing {Math.min(visibleCount, regularProjects.length)} of {regularProjects.length}
                    </span>
                  </Button>
                </div>
              )}
            </>
          )}
      </Section>

      {/* Quick View Modal */}
      <ProjectQuickView
        project={quickViewProject}
        open={!!quickViewProject}
        onOpenChange={(open) => !open && setQuickViewProject(null)}
      />

      <CTABand
        title="Ready to Start Your Project?"
        description="Get a detailed proposal with transparent pricing and a clear timeline for your building envelope or restoration project."
        primaryCta={{ text: "Request a Quote", href: "/estimate" }}
        secondaryCta={{ text: "Contact Us", href: "/contact" }}
        variant="dark"
      />

      <ScrollToTop />
      <Footer />
    </div>
  );
};

export default Projects;
