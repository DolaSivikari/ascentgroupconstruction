import { Link } from "react-router-dom";
import { Section } from "@/components/sections/Section";
import { Card } from "@/design-system/components/Card";
import { TYPOGRAPHY_STYLES } from "@/design-system/constants";
import { ArrowRight, HardHat, Building, Landmark, Store, Home } from "lucide-react";

const CLIENT_SEGMENTS = [
  {
    icon: HardHat,
    title: "General Contractors",
    description: "We sub-contract envelope, painting, tiling, and interior finish packages under GC-led projects. Unit pricing, schedule compliance, and clean coordination.",
    link: "/for-general-contractors",
  },
  {
    icon: Building,
    title: "Property Managers",
    description: "Corridor repaints, suite turnovers, balcony restoration, and common-area upgrades — executed in occupied buildings with minimal disruption.",
    link: "/property-managers",
  },
  {
    icon: Landmark,
    title: "Developers",
    description: "Finish trade packages for new construction and turnover-ready units. Drywall, paint, tile, and flooring delivered to schedule on multi-phase builds.",
    link: "/company/developers",
  },
  {
    icon: Store,
    title: "Commercial Clients",
    description: "Tenant improvement buildouts, retail fit-ups, and facility maintenance painting and finishing for commercial property owners and operators.",
    link: "/commercial-clients",
  },
  {
    icon: Home,
    title: "Homeowners",
    description: "Kitchen and bathroom renovations, basement finishing, painting, and tile work for residential properties across Ontario.",
    link: "/homeowners",
  },
] as const;

export const ServicesClientSegments = () => {
  return (
    <Section size="major">
      <div className="mb-12">
        <p className={`${TYPOGRAPHY_STYLES.label} text-accent mb-3`}>Who We Work With</p>
        <h2 className={`${TYPOGRAPHY_STYLES.sectionTitle} text-foreground mb-4`}>
          Client Segments We Support
        </h2>
        <p className={`${TYPOGRAPHY_STYLES.bodyDefault} text-muted-foreground max-w-3xl`}>
          Different clients need different things from a specialty contractor. Here's how we support each one.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {CLIENT_SEGMENTS.map((seg) => {
          const Icon = seg.icon;
          return (
            <Link key={seg.title} to={seg.link} className="group">
              <Card variant="default" hover className="h-full flex flex-col">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-4.5 h-4.5 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                    {seg.title}
                  </h3>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed flex-1">
                  {seg.description}
                </p>
                <div className="flex items-center text-sm font-medium text-primary group-hover:text-accent transition-colors mt-4">
                  Learn more <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
              </Card>
            </Link>
          );
        })}
      </div>
    </Section>
  );
};
