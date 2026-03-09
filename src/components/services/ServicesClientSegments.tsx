import { Section } from "@/components/sections/Section";
import { SectionHeader, SegmentCard } from "@/design-system/components";
import { HardHat, Building, Landmark, Store, Home } from "lucide-react";

const CLIENT_SEGMENTS = [
  {
    icon: HardHat,
    title: "General Contractors",
    description: "We sub-contract envelope, painting, tiling, and interior finish packages under GC-led projects. Unit pricing, schedule compliance, and clean coordination.",
    href: "/for-general-contractors",
  },
  {
    icon: Building,
    title: "Property Managers",
    description: "Corridor repaints, suite turnovers, balcony restoration, and common-area upgrades — executed in occupied buildings with minimal disruption.",
    href: "/property-managers",
  },
  {
    icon: Landmark,
    title: "Developers",
    description: "Finish trade packages for new construction and turnover-ready units. Drywall, paint, tile, and flooring delivered to schedule on multi-phase builds.",
    href: "/company/developers",
  },
  {
    icon: Store,
    title: "Commercial Clients",
    description: "Tenant improvement buildouts, retail fit-ups, and facility maintenance painting and finishing for commercial property owners and operators.",
    href: "/commercial-clients",
  },
  {
    icon: Home,
    title: "Homeowners",
    description: "Kitchen and bathroom renovations, basement finishing, painting, and tile work for residential properties across Ontario.",
    href: "/homeowners",
  },
] as const;

export const ServicesClientSegments = () => {
  return (
    <Section size="major">
      <SectionHeader
        badge="Who We Work With"
        title="Client Segments We Support"
        description="Different clients need different things from a specialty contractor. Here's how we support each one."
        align="left"
        maxWidth="lg"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {CLIENT_SEGMENTS.map((seg) => (
          <SegmentCard
            key={seg.title}
            icon={seg.icon}
            title={seg.title}
            description={seg.description}
            href={seg.href}
          />
        ))}
      </div>
    </Section>
  );
};
