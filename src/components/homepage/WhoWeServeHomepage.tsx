import { Building2, Users, Home, Briefcase } from "lucide-react";
import { Section } from "@/components/sections/Section";
import { SectionHeader, SegmentCard } from "@/design-system/components";
import { GRID } from "@/design-system/layouts";

const clientSegments = [
  {
    icon: Briefcase,
    title: "General Contractors",
    description: "Trade partner for envelope and restoration scopes on commercial and multi-family projects across the GTA.",
    href: "/for-general-contractors",
    badge: "Trade Partner",
  },
  {
    icon: Building2,
    title: "Property Managers",
    description: "Reliable envelope maintenance and emergency restoration for multi-residential and commercial portfolios.",
    href: "/property-managers",
    badge: "Primary",
  },
  {
    icon: Users,
    title: "Commercial Owners",
    description: "Façade remediation and building envelope solutions for office buildings, retail strips, and industrial properties.",
    href: "/commercial-clients",
  },
  {
    icon: Home,
    title: "Homeowners",
    description: "Exterior restoration and interior renovation services for single-family homes across Ontario.",
    href: "/homeowners",
  },
];

const WhoWeServeHomepage = () => {
  return (
    <Section size="major" className="bg-background">
      <div className="relative z-10">
        <SectionHeader
          badge="Who We Serve"
          title="Trusted Envelope & Restoration Partner"
          description="From general contractors seeking reliable trade partners to property managers protecting their portfolios—we deliver specialized envelope and restoration solutions across Ontario and the GTA."
          align="left"
          maxWidth="lg"
        />

        <div className={GRID.cards4}>
          {clientSegments.map((segment) => (
            <SegmentCard
              key={segment.title}
              icon={segment.icon}
              title={segment.title}
              description={segment.description}
              href={segment.href}
              badge={segment.badge}
            />
          ))}
        </div>
      </div>
    </Section>
  );
};

export default WhoWeServeHomepage;
