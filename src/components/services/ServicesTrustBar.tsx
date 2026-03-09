import { Section } from "@/components/sections/Section";
import { ProofStrip } from "@/design-system/components";
import { Hammer, ShieldCheck, MapPin, Building2, Layers } from "lucide-react";

const TRUST_ITEMS = [
  { icon: Hammer, value: "Self-Performed Core Scopes", label: "Our crews, our quality" },
  { icon: ShieldCheck, value: "WSIB, Insurance & Compliance", label: "Fully covered & documented" },
  { icon: MapPin, value: "GTA & Southern Ontario", label: "Toronto, Mississauga, Brampton & beyond" },
  { icon: Building2, value: "Commercial + Multi-Unit + Residential", label: "Cross-market experience" },
  { icon: Layers, value: "Envelope + Interior Trade Focus", label: "Specialty depth, not generalist breadth" },
];

export const ServicesTrustBar = () => {
  return (
    <Section size="subsection">
      <ProofStrip items={TRUST_ITEMS} variant="dark" columns={4} />
    </Section>
  );
};
