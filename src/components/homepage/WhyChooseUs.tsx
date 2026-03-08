import * as LucideIcons from "lucide-react";
import { useWhyChooseUs } from "@/hooks/useWhyChooseUs";
import { SectionHeader, CapabilityCard } from "@/design-system/components";
import { Section } from "@/components/sections/Section";
import { GRID } from "@/design-system/layouts";

// Fallback data with construction-specific icons
const fallbackDifferentiators = [
  { icon: "Shield", title: "Licensed & Certified", desc: "Fully licensed and insured with $2M CGL liability coverage, active WSIB registration, and working toward COR certification. Professional execution backed by comprehensive insurance and safety protocols.", stats: "$2M CGL Insured" },
  { icon: "Building", title: "Envelope & Trades Expertise", desc: "Specialty services from building envelope restoration to interior trades. Single point of contact eliminates coordination complexity and streamlines project delivery.", stats: "Self-Performed Core Scopes" },
  { icon: "Award", title: "Trusted Manufacturer Brands", desc: "Working with trusted manufacturer brands including Benjamin Moore and Sherwin-Williams, with extended warranties. Proven installation methods ensure lasting quality and performance.", stats: "Extended Warranties" },
  { icon: "Calendar", title: "Reliable Delivery", desc: "Dedicated project management with transparent pricing and detailed estimates. Our systematic approach and self-performed work keep projects on track.", stats: "WSIB Compliant" },
  { icon: "HardHat", title: "Expert Team", desc: "Certified safety-trained crews with continuous training and comprehensive safety protocols backed by full liability coverage on every project.", stats: "Ontario Safety Standards" },
  { icon: "Hammer", title: "Quality Standards", desc: "Rigorous quality control processes and proven best practices ensure exceptional results. Every project meets or exceeds regulatory requirements and client expectations.", stats: "" },
];

const WhyChooseUs = () => {
  const { data: items, isLoading } = useWhyChooseUs();
  
  const differentiators = items && items.length > 0 
    ? items.map(item => ({
        icon: item.icon_name || "BadgeCheck",
        title: item.title,
        desc: item.description,
        stats: item.stats_badge || "",
      }))
    : fallbackDifferentiators;

  return (
    <Section size="major" className="bg-muted/30">
      <SectionHeader
        badge="Why Choose Us"
        title="Why Clients Choose Us"
        description="Our team brings 15+ years of combined experience in building envelope and interior trades across Ontario, delivering exceptional construction results through licensed professionals, complete services, and unwavering commitment to quality."
        align="left"
        maxWidth="lg"
      />

      {isLoading ? (
        <div className="text-center py-12">Loading...</div>
      ) : (
        <div className={GRID.cards3}>
          {differentiators.map((item, index) => {
            const Icon = (LucideIcons as any)[item.icon] || LucideIcons.BadgeCheck;
            return (
              <CapabilityCard
                key={index}
                icon={Icon}
                title={item.title}
                description={item.desc}
                stat={item.stats || undefined}
              />
            );
          })}
        </div>
      )}
    </Section>
  );
};

export default WhyChooseUs;
