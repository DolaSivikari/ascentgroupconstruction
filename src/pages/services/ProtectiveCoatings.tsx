import { Shield, Sparkles, Building, Paintbrush, CheckCircle2 } from "lucide-react";
import { Card } from "@/design-system/components/Card";
import { Section } from "@/components/sections/Section";
import { ServicePageLayout } from "@/components/services/ServicePageLayout";
import heroImage from "@/assets/heroes/hero-protective-coatings.jpg";

const ProtectiveCoatings = () => {
  const whatWeDeliver = [
    {
      icon: Shield,
      title: "Industrial-Grade Protection",
      description: "High-performance epoxy, polyurethane, and elastomeric coatings for extreme environments."
    },
    {
      icon: Sparkles,
      title: "Anti-Graffiti Systems",
      description: "Sacrificial and permanent anti-graffiti coatings with rapid cleanup protocols."
    },
    {
      icon: Building,
      title: "Heritage Restoration Finishes",
      description: "Breathable mineral-based coatings and lime washes preserving historic masonry."
    },
    {
      icon: Paintbrush,
      title: "Architectural Coatings",
      description: "Decorative elastomeric and textured finishes with superior weather protection."
    }
  ];

  const howWeWork = [
    {
      phase: "Surface Analysis",
      activities: [
        "Substrate identification and contamination testing",
        "Moisture content and pH analysis",
        "Coating compatibility assessment"
      ]
    },
    {
      phase: "Preparation",
      activities: [
        "Power washing and surface profiling",
        "Defect repair and priming",
        "Environmental controls"
      ]
    },
    {
      phase: "Application",
      activities: [
        "Controlled coating application",
        "Thickness monitoring and inspections",
        "Warranty documentation"
      ]
    }
  ];

  return (
    <ServicePageLayout
      title="Protective & Architectural Coatings Toronto | Industrial Coatings Ontario"
      description="Professional protective and architectural coating services across Ontario. Industrial-grade systems, anti-graffiti protection, heritage restoration finishes."
      keywords="protective coatings Toronto, industrial coatings, anti-graffiti coating, architectural coatings, epoxy coatings, heritage restoration"
      heroTitle="Protective & Architectural Coatings"
      heroDescription="High-performance coating systems protecting and beautifying commercial and industrial surfaces"
      heroImage={heroImage}
      category="Specialized Services"
      slug="protective-architectural-coatings"
      ctaTitle="Need Surface Protection or Restoration?"
      ctaDescription="Request a surface analysis and let our coating specialists develop a protection strategy."
    >
      {/* What We Deliver */}
      <Section size="major">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">What We Deliver</h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Comprehensive coating solutions for protection and aesthetics across diverse applications.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {whatWeDeliver.map((item, index) => {
            const Icon = item.icon;
            return (
              <Card key={index} variant="elevated" size="md">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </Card>
            );
          })}
        </div>
      </Section>

      {/* Our Process */}
      <Section size="major" className="bg-muted/30">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Process</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {howWeWork.map((phase, index) => (
            <Card key={index} variant="elevated" size="md">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                  {index + 1}
                </div>
                <h3 className="text-xl font-semibold">{phase.phase}</h3>
              </div>
              <ul className="space-y-2">
                {phase.activities.map((activity, actIndex) => (
                  <li key={actIndex} className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    <span className="text-sm text-muted-foreground">{activity}</span>
                  </li>
                ))}
              </ul>
            </UnifiedCard>
          ))}
        </div>
      </Section>
    </ServicePageLayout>
  );
};

export default ProtectiveCoatings;
