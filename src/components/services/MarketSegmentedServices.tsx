import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { UnifiedServiceCard } from "./UnifiedServiceCard";
import { MarketSegmentHeader } from "./MarketSegmentHeader";
import { CardGrid } from "@/components/shared/CardGrid";
import { Section } from "@/components/sections/Section";
import { Building2, Home, Layers, LucideIcon } from "lucide-react";

interface Service {
  id: string;
  name: string;
  slug: string;
  short_description: string | null;
  icon_name: string | null;
  service_tier: string;
  challenge_tags?: string[] | null;
}

interface MarketSegment {
  title: string;
  description: string;
  icon: LucideIcon;
  services: Service[];
  segment: 'commercial' | 'residential' | 'both';
}

export const MarketSegmentedServices = () => {
  const [segments, setSegments] = useState<MarketSegment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadMarketSegments();
  }, []);

  const loadMarketSegments = async () => {
    const { data } = await supabase
      .from('services')
      .select('*')
      .eq('publish_state', 'published')
      .order('service_tier', { ascending: false })
      .order('name', { ascending: true });

    if (data) {
      // Define market segmentation logic
      const commercial = data.filter(s => 
        ['Building Envelope Solutions', 'Masonry Restoration', 'Waterproofing Systems', 
         'Protective & Architectural Coatings', 'Sustainable Building', 'Cladding Systems',
         'Interior Buildouts & Finishing'].includes(s.name)
      );

      const residential = data.filter(s =>
        ['Kitchen & Bathroom Renovations', 'Basement Finishing', 'Suite Renovations',
         'EIFS & Stucco Systems'].includes(s.name)
      );

      const both = data.filter(s =>
        ['Painting Services', 'Tile & Flooring', 'Carpentry & Trim Work',
         'Drywall & Finishing', 'General Repairs & Maintenance'].includes(s.name)
      );

      setSegments([
        {
          title: "Commercial Services",
          description: "Specialized solutions for commercial, industrial, and institutional buildings",
          icon: Building2,
          services: commercial,
          segment: 'commercial',
        },
        {
          title: "Residential Services",
          description: "Expert craftsmanship for multi-family residential projects",
          icon: Home,
          services: residential,
          segment: 'residential',
        },
        {
          title: "Both Markets",
          description: "Core services spanning commercial and residential applications",
          icon: Layers,
          services: both,
          segment: 'both',
        },
      ]);
    }
    setIsLoading(false);
  };

  const getSegmentBackground = (segment: 'commercial' | 'residential' | 'both') => {
    switch (segment) {
      case 'commercial':
        return 'bg-background';
      case 'residential':
        return 'bg-muted/20';
      case 'both':
        return 'bg-secondary/5';
    }
  };

  if (isLoading) {
    return (
      <Section className="py-24">
        <div className="text-center text-muted-foreground">Loading services...</div>
      </Section>
    );
  }

  return (
    <div className="space-y-0">
      {segments.map((segment) => (
        <Section key={segment.title} className={getSegmentBackground(segment.segment)}>
          <MarketSegmentHeader
            title={segment.title}
            description={segment.description}
            icon={segment.icon}
            serviceCount={segment.services.length}
            segment={segment.segment}
          />
          
          <CardGrid columns={3} gap="lg" stagger="standard">
            {segment.services.map((service) => (
              <UnifiedServiceCard
                key={service.id}
                id={service.id}
                name={service.name}
                slug={service.slug}
                short_description={service.short_description}
                service_tier={service.service_tier}
                challenge_tags={service.challenge_tags}
                marketSegment={segment.segment}
              />
            ))}
          </CardGrid>
        </Section>
      ))}
    </div>
  );
};
