import { Section } from "@/components/sections/Section";
import { Hammer, ShieldCheck, MapPin, Building2, Layers } from "lucide-react";

const TRUST_ITEMS = [
  {
    icon: Hammer,
    label: "Self-Performed Core Scopes",
    detail: "Our crews, our quality",
  },
  {
    icon: ShieldCheck,
    label: "WSIB, Insurance & Compliance",
    detail: "Fully covered & documented",
  },
  {
    icon: MapPin,
    label: "GTA & Southern Ontario",
    detail: "Toronto, Mississauga, Brampton & beyond",
  },
  {
    icon: Building2,
    label: "Commercial + Multi-Unit + Residential",
    detail: "Cross-market experience",
  },
  {
    icon: Layers,
    label: "Envelope + Interior Trade Focus",
    detail: "Specialty depth, not generalist breadth",
  },
] as const;

export const ServicesTrustBar = () => {
  return (
    <Section size="subsection" className="bg-primary text-primary-foreground">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
        {TRUST_ITEMS.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.label} className="text-center">
              <div className="w-10 h-10 rounded-full bg-primary-foreground/10 flex items-center justify-center mx-auto mb-3">
                <Icon className="w-5 h-5 text-primary-foreground" />
              </div>
              <p className="text-sm font-semibold text-primary-foreground mb-1">{item.label}</p>
              <p className="text-xs text-primary-foreground/70">{item.detail}</p>
            </div>
          );
        })}
      </div>
    </Section>
  );
};
