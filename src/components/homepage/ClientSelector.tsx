import { Building2, HardHat, Home } from "lucide-react";
import { Section } from "@/components/sections/Section";
import { CardGrid } from "@/components/shared/CardGrid";
import { SegmentCard } from "@/design-system/components/SegmentCard";

/**
 * Homepage "Who We Serve" Section
 * Uses canonical SegmentCard for consistency.
 */
const ClientSelector = () => {
  return (
    <Section size="major" className="bg-background">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight">
          Who We Serve
        </h2>
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
          Choose your path to see how we can help with your specific needs
        </p>
      </div>

      <CardGrid columns={3} stagger="standard" gap="lg">
        <SegmentCard
          icon={Building2}
          title="Property Managers"
          description="Multi-family and commercial property solutions with after-hours coordination, minimal tenant disruption, and multi-property maintenance contracts."
          href="/property-managers"
        />
        <SegmentCard
          icon={Home}
          title="Property Owners"
          description="Residential and multi-family property solutions delivered with quality construction, professional standards, and reliable completion."
          href="/services"
        />
        <SegmentCard
          icon={HardHat}
          title="Contractors & Developers"
          description="A reliable, certified partner for commercial projects—fast response, active WSIB & $2M CGL coverage, and large project capacity."
          href="/for-general-contractors"
        />
      </CardGrid>
    </Section>
  );
};

export default ClientSelector;
