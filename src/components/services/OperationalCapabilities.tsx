import { Section } from "@/components/sections/Section";
import { TYPOGRAPHY_STYLES } from "@/design-system/constants";
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
      <div className="mb-12">
        <p className={`${TYPOGRAPHY_STYLES.label} text-accent mb-3`}>How We Work</p>
        <h2 className={`${TYPOGRAPHY_STYLES.sectionTitle} text-foreground mb-4`}>
          Operational Capability
        </h2>
        <p className={`${TYPOGRAPHY_STYLES.bodyDefault} text-muted-foreground max-w-3xl`}>
          We don't just bid — we build. These are the operational disciplines that define how we deliver, from mobilization through closeout.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {CAPABILITIES.map((cap) => {
          const Icon = cap.icon;
          return (
            <div key={cap.title} className="flex items-start gap-4">
              <div className="w-11 h-11 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Icon className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-foreground mb-1.5">{cap.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{cap.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </Section>
  );
};
