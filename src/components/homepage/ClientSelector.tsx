import { Building2, HardHat, Home } from "lucide-react";
import { WhoWeServeCard, WhoWeServeSection } from "@/components/unified";

/**
 * Homepage "Who We Serve" Section
 * Uses unified components for consistency
 */

const ClientSelector = () => {
  return (
    <WhoWeServeSection
      title="Who We Serve"
      description="Choose your path to see how we can help with your specific needs"
      columns={3}
      background="default"
    >
      <WhoWeServeCard
        icon={Building2}
        title="Property Managers"
        description="Multi-family and commercial property solutions"
        link="/property-managers"
        variant="detailed"
        benefits={[
          "After-hours work coordination",
          "Minimal tenant disruption",
          "Multi-property maintenance contracts",
        ]}
        ctaText="Request Consultation"
      />
      <WhoWeServeCard
        icon={Home}
        title="Property Owners"
        description="Residential and multi-family property solutions"
        link="/services"
        variant="detailed"
        benefits={[
          "Quality construction delivery",
          "Professional service standards",
          "Reliable project completion",
        ]}
        ctaText="View Services"
      />
      <WhoWeServeCard
        icon={HardHat}
        title="Contractors & Developers"
        description="Reliable, certified partner for commercial projects"
        link="/for-general-contractors"
        variant="detailed"
        benefits={[
          "Fast response times",
          "Bonded & fully insured",
          "Large project capacity",
        ]}
        ctaText="Download Prequalification"
      />
    </WhoWeServeSection>
  );
};

export default ClientSelector;
