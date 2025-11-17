import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import * as LucideIcons from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/ui/Button";
import { CheckCircle, ArrowRight } from "lucide-react";
import OptimizedImage from "./OptimizedImage";

interface Service {
  id: string;
  name: string;
  slug: string;
  short_description: string | null;
  category: string | null;
  icon_name: string | null;
}

interface CategoryConfig {
  name: string;
  slug: string;
  icon: keyof typeof LucideIcons;
  color: string;
  description: string;
  image: string;
}

const categoryConfig: Record<string, CategoryConfig> = {
  "Building Envelope": {
    name: "Building Envelope Systems",
    slug: "building-envelope",
    icon: "Shield",
    color: "primary",
    description: "Complete building envelope and weatherproofing solutions",
    image: "/src/assets/project-commercial.jpg"
  },
  "Cladding Systems": {
    name: "Cladding Systems",
    slug: "cladding-systems",
    icon: "Layers",
    color: "terracotta",
    description: "Complete exterior cladding, siding, and metal panel solutions",
    image: "/src/assets/project-industrial.jpg"
  },
  "Specialty Services": {
    name: "Interior & Finishing",
    slug: "interior-buildouts",
    icon: "Hammer",
    color: "accent",
    description: "Interior buildouts, tenant improvements, and specialized construction",
    image: "/src/assets/project-institutional.jpg"
  }
};

const ServicesPreview = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const isVisible = useIntersectionObserver(sectionRef);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    const { data, error } = await supabase
      .from("services")
      .select("id, name, slug, short_description, category, icon_name")
      .eq("publish_state", "published")
      .order("name");

    if (error) {
      console.error("Error loading services:", error);
      setLoading(false);
      return;
    }

    setServices(data || []);
    setLoading(false);
  };

  // Group services by category (exclude Construction Management from homepage)
  const groupedServices = services
    .filter(service => service.category && service.category !== "Construction Management")
    .reduce((acc, service) => {
      const category = service.category || "Other";
      if (!acc[category]) acc[category] = [];
      acc[category].push(service);
      return acc;
    }, {} as Record<string, Service[]>);

  // Get featured service or top service for each category
  const getCategoryService = (category: string) => {
    const categoryServices = groupedServices[category] || [];
    // Return the featured service if it exists, otherwise return first service
    return categoryServices.find(s => s.slug === categoryConfig[category]?.slug) || categoryServices[0];
  };

  return (
    <section
      ref={sectionRef}
      className={`py-20 bg-gradient-to-b from-background to-muted/20 ${
        prefersReducedMotion ? 'opacity-100' : `transition-opacity duration-1000 ${isVisible ? "opacity-100" : "opacity-0"}`
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Our Services
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Comprehensive construction solutions for every project type
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} variant="elevated" className={`h-[500px] bg-muted ${!prefersReducedMotion && 'animate-pulse'}`}>
                <div />
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {Object.entries(categoryConfig).map(([categoryName, config]) => {
              const IconComponent = LucideIcons[config.icon] as React.ComponentType<{ className?: string }>;
              const featuredService = getCategoryService(categoryName);

              return (
                <Card
                  key={config.slug}
                  variant="elevated"
                  className="group overflow-hidden h-full hover:shadow-xl transition-all duration-300"
                >
                  <div className="relative h-48 overflow-hidden">
                    <OptimizedImage
                      src={config.image}
                      alt={`${config.name} hero image`}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      width={600}
                      height={400}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/50 to-transparent" />
                    
                    <div className="absolute bottom-4 left-6 flex items-center gap-3">
                      <div className="p-3 rounded-xl bg-background/80 backdrop-blur-sm border-2 border-primary/20">
                        <IconComponent className="w-6 h-6 text-primary" />
                      </div>
                      <h3 className="text-2xl font-bold text-foreground">
                        {config.name}
                      </h3>
                    </div>
                  </div>

                  <div className="p-6 flex flex-col h-[calc(100%-12rem)]">
                    <p className="text-muted-foreground mb-6">
                      {config.description}
                    </p>

                    {featuredService && (
                      <div className="mb-6 flex-grow">
                        <Link
                          to={`/services/${featuredService.slug}`}
                          className="block p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors group/card"
                        >
                          <h4 className="font-semibold text-foreground mb-2 group-hover/card:text-primary transition-colors">
                            {featuredService.name}
                          </h4>
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {featuredService.short_description}
                          </p>
                        </Link>
                      </div>
                    )}

                    <Button
                      asChild
                      variant="secondary"
                      size="lg"
                    >
                      <Link to={`/services/${config.slug}`}>
                        Learn More
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Link>
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>
        )}

        <div className="text-center mt-12">
          <Button asChild size="lg" className="shadow-lg">
            <Link to="/services">
              Explore All Services
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ServicesPreview;
