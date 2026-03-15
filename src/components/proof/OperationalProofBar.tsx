import { LucideIcon, Hammer, ShieldCheck, Building2, CalendarCheck, FileCheck, Award } from "lucide-react";
import { Section } from "@/components/sections/Section";
import { SectionHeader } from "@/design-system/components/SectionHeader";
import { CapabilityCard } from "@/design-system/components/CapabilityCard";

export interface ProofItem {
  icon: LucideIcon;
  title: string;
  description: string;
}

/** Default proof items — operational capability statements, not invented metrics */
export const DEFAULT_PROOF_ITEMS: ProofItem[] = [
  {
    icon: Hammer,
    title: "Self-Performed Core Scopes",
    description:
      "85% of our work is executed by our own crews — EIFS, masonry, sealant, painting, coatings. Direct accountability, no sub-tier surprises.",
  },
  {
    icon: ShieldCheck,
    title: "WSIB & $2M CGL Coverage",
    description:
      "Active WSIB registration since incorporation and comprehensive general liability insurance. Site safety protocols on every project.",
  },
  {
    icon: Building2,
    title: "Occupied-Building Experience",
    description:
      "Phased execution, tenant coordination, after-hours work, and noise/dust management for occupied commercial and residential buildings.",
  },
  {
    icon: CalendarCheck,
    title: "Schedule & Trade Coordination",
    description:
      "We integrate with your project schedule, coordinate with other trades, and communicate proactively when timelines shift.",
  },
  {
    icon: FileCheck,
    title: "Documentation & Closeout",
    description:
      "Complete closeout packages: warranty certificates, product data sheets, as-built records, lien releases, and punch-list resolution.",
  },
  {
    icon: Award,
    title: "Manufacturer Compliance",
    description:
      "Materials installed per manufacturer specifications. Warranty-eligible installations with proper documentation and inspection records.",
  },
];

interface OperationalProofBarProps {
  /** Override default items with a custom set or subset */
  items?: ProofItem[];
  title?: string;
  description?: string;
  className?: string;
}

/**
 * OperationalProofBar — Configurable proof module for operational credibility.
 * Accepts optional items array for page-specific subsets/reordering.
 * Defaults to the full 6-item set.
 */
export const OperationalProofBar = ({
  items = DEFAULT_PROOF_ITEMS,
  title = "Operational Capabilities",
  description,
  className,
}: OperationalProofBarProps) => {
  return (
    <Section size="major" className={className}>
      <SectionHeader title={title} description={description} />
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {items.map((item, index) => (
          <CapabilityCard
            key={index}
            icon={item.icon}
            title={item.title}
            description={item.description}
          />
        ))}
      </div>
    </Section>
  );
};
