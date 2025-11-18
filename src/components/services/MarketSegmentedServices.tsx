import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ServiceCardTier1 } from "./ServiceCardTier1";
import { ServiceCardTier2 } from "./ServiceCardTier2";
import { ServiceCardTier3 } from "./ServiceCardTier3";
import { Section } from "@/components/sections/Section";
import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { Building2, Home, Briefcase } from "lucide-react";

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
  icon: typeof Building2;
  services: Service[];
  color: string;
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
          description: "Building envelope, restoration, and commercial construction for multi-family and institutional properties",
          icon: Building2,
          services: commercial,
          color: "primary"
        },
        {
          title: "Residential Services",
          description: "Home renovations, finishing, and upgrades for homeowners and condo owners",
          icon: Home,
          services: residential,
          color: "terracotta"
        },
        {
          title: "Both Markets",
          description: "Services for commercial properties and residential clients",
          icon: Briefcase,
          services: both,
          color: "secondary"
        }
      ]);
    }
    setIsLoading(false);
  };

  const renderServiceCard = (service: Service) => {
    if (service.service_tier === 'PRIME_SPECIALTY') {
      return (
        <ServiceCardTier1
          key={service.id}
          id={service.id}
          name={service.name}
          slug={service.slug}
          short_description={service.short_description}
          icon_name={service.icon_name}
          challenge_tags={service.challenge_tags}
          service_tier={service.service_tier}
        />
      );
    } else if (service.service_tier === 'TRADE_PACKAGE') {
      return (
        <ServiceCardTier2
          key={service.id}
          id={service.id}
          name={service.name}
          slug={service.slug}
          short_description={service.short_description}
          icon_name={service.icon_name}
          challenge_tags={service.challenge_tags}
          service_tier={service.service_tier}
        />
      );
    } else {
      return (
        <ServiceCardTier3
          key={service.id}
          id={service.id}
          name={service.name}
          slug={service.slug}
          short_description={service.short_description}
          challenge_tags={service.challenge_tags}
        />
      );
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
    <>
      {segments.map((segment, idx) => (
        <Section key={segment.title} className={idx % 2 === 0 ? "bg-background" : "bg-muted/30"}>
          <ScrollReveal>
            <div className="mb-12 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                <segment.icon className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">{segment.title}</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                {segment.description}
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {segment.services.map((service) => renderServiceCard(service))}
          </div>
        </Section>
      ))}
    </>
  );
};
