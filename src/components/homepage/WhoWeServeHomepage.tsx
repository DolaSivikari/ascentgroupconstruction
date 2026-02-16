import { Building2, Users, Home, Briefcase } from "lucide-react";
import { Section } from "@/components/sections/Section";
import { ClientSegmentCard } from "@/components/unified";
import { GRID } from "@/design-system/layouts";

const WhoWeServeHomepage = () => {
  const clientSegments = [
    {
      icon: Briefcase,
      title: "General Contractors",
      description: "Trade partner for envelope and restoration scopes on commercial and multi-family projects across the GTA.",
      link: "/for-general-contractors",
      examples: [
        "Unit pricing for envelope packages",
        "Fast RFP response (48-72 hours)",
        "Self-performed core trades",
      ],
    },
    {
      icon: Building2,
      title: "Property Managers",
      description: "Reliable envelope maintenance and emergency restoration for multi-residential and commercial portfolios.",
      link: "/property-managers",
      examples: [
        "10-30 story condominiums",
        "Occupied building expertise",
        "Clear documentation for reserve fund studies",
      ],
    },
    {
      icon: Users,
      title: "Commercial Owners",
      description: "Façade remediation and building envelope solutions for office buildings, retail strips, and industrial properties.",
      link: "/commercial-clients",
      examples: [
        "Water intrusion repairs",
        "Parking garage restoration",
        "Tenant coordination",
      ],
    },
    {
      icon: Home,
      title: "Homeowners",
      description: "Exterior restoration and interior renovation services for single-family homes across Ontario.",
      link: "/homeowners",
      examples: [
        "EIFS and stucco repair",
        "Masonry restoration",
        "Interior painting and finishes",
      ],
    },
  ];

  return (
    <Section size="major" className="bg-background">
      <div className="relative z-10">
        <div className="max-w-4xl mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 leading-tight tracking-tight">
            Who We Serve
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            From general contractors seeking reliable trade partners to property managers protecting their portfolios—we deliver specialized envelope and restoration solutions across Ontario.
          </p>
        </div>

        <div className={GRID.cards4}>
          {clientSegments.map((segment, index) => (
            <ClientSegmentCard
              key={index}
              icon={segment.icon}
              title={segment.title}
              description={segment.description}
              link={segment.link}
              examples={segment.examples}
            />
          ))}
        </div>
      </div>
    </Section>
  );
};

export default WhoWeServeHomepage;
