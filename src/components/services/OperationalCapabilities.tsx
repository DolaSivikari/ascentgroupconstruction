import { Section } from "@/components/sections/Section";
import { SectionHeader, CapabilityCard } from "@/design-system/components";
import { Hammer, ShieldCheck, CalendarCheck, Layers, ClipboardCheck, FileCheck } from "lucide-react";

const CAPABILITIES = [
  {
    icon: Hammer,
    title: "Self-Performed Core Scopes",
    description: "Our own crews execute painting, drywall, tiling, and envelope scopes directly — reducing coordination risk and maintaining quality control on-site.",
  },
  {
    icon: ShieldCheck,
    title: "Occupied-Building Sensitivity",
    description: "We routinely work in occupied condos, active commercial spaces, and live healthcare environments with dust control, noise management, and resident communication protocols.",
  },
  {
    icon: CalendarCheck,
    title: "Schedule Coordination",
    description: "Multi-trade sequencing managed in-house. We coordinate our scopes with other contractors and building operations to avoid conflicts and delays.",
  },
  {
    icon: Layers,
    title: "Phased Delivery",
    description: "Projects broken into logical phases — by floor, wing, or scope — allowing partial occupancy, staged access, and predictable progress.",
  },
  {
    icon: ClipboardCheck,
    title: "Quality Control",
    description: "Pre-start checklists, in-progress inspections, and punch-list closeout procedures applied consistently across every project.",
  },
  {
    icon: FileCheck,
    title: "Closeout & Documentation",
    description: "Organized handover packages including warranties, as-built records, maintenance guides, and final inspection sign-offs.",
  },
] as const;

export const OperationalCapabilities = () => {
  return (
    <Section size="major" className="bg-muted/30">
      <SectionHeader
        badge="How We Work"
        title="Operational Capability"
        description="We don't just bid — we build. These are the operational disciplines that define how we deliver, from mobilization through closeout."
        align="left"
        maxWidth="lg"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {CAPABILITIES.map((cap) => (
          <CapabilityCard
            key={cap.title}
            icon={cap.icon}
            title={cap.title}
            description={cap.description}
          />
        ))}
      </div>
    </Section>
  );
};
