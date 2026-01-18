import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { UnifiedServiceCard } from "./UnifiedServiceCard";
import { CardGrid } from "@/components/shared/CardGrid";
import { Section } from "@/components/sections/Section";
import { Building2, Home, Sparkles, LucideIcon } from "lucide-react";

interface Service {
  id: string;
  name: string;
  slug: string;
  short_description: string | null;
  icon_name: string | null;
  service_tier: string;
  category: string | null;
  challenge_tags?: string[] | null;
}

interface CategoryConfig {
  title: string;
  description: string;
  icon: LucideIcon;
  dbCategory: string;
}

const CATEGORY_CONFIG: CategoryConfig[] = [
  {
    title: "Building Envelope",
    description: "Exterior envelope systems, waterproofing, and cladding solutions",
    icon: Building2,
    dbCategory: "Building Envelope",
  },
  {
    title: "Interior Construction",
    description: "Complete interior buildouts, finishing, and renovation services",
    icon: Home,
    dbCategory: "Interior Construction",
  },
  {
    title: "Specialized Services",
    description: "Expert specialty solutions for unique project requirements",
    icon: Sparkles,
    dbCategory: "Specialized Services",
  },
];

export const MarketSegmentedServices = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    const { data } = await supabase
      .from('services')
      .select('id, name, slug, short_description, icon_name, service_tier, category, challenge_tags')
      .eq('publish_state', 'published')
      .order('service_tier', { ascending: false })
      .order('name', { ascending: true });

    if (data) {
      setServices(data);
    }
    setIsLoading(false);
  };

  const getServicesForCategory = (dbCategory: string) => {
    return services.filter(s => s.category === dbCategory);
  };

  const getCategoryBackground = (index: number) => {
    const backgrounds = ['bg-background', 'bg-muted/20', 'bg-muted/10'];
    return backgrounds[index % backgrounds.length];
  };

  if (isLoading) {
    return (
      <Section className="py-16">
        <div className="text-center text-muted-foreground">Loading services...</div>
      </Section>
    );
  }

  return (
    <div className="space-y-0">
      {CATEGORY_CONFIG.map((category, index) => {
        const categoryServices = getServicesForCategory(category.dbCategory);
        
        if (categoryServices.length === 0) return null;

        const Icon = category.icon;

        return (
          <Section key={category.dbCategory} className={getCategoryBackground(index)}>
            {/* Category Header */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-foreground">{category.title}</h2>
                  <span className="text-sm text-muted-foreground">
                    {categoryServices.length} service{categoryServices.length !== 1 ? 's' : ''}
                  </span>
                </div>
              </div>
              <p className="text-muted-foreground max-w-2xl">{category.description}</p>
            </div>
            
            <CardGrid columns={3} gap="lg">
              {categoryServices.map((service) => (
                <UnifiedServiceCard
                  key={service.id}
                  id={service.id}
                  name={service.name}
                  slug={service.slug}
                  short_description={service.short_description}
                  service_tier={service.service_tier}
                  challenge_tags={service.challenge_tags}
                />
              ))}
            </CardGrid>
          </Section>
        );
      })}
    </div>
  );
};
