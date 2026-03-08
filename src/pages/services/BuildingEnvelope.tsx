import { Shield, Droplets, Wind, ThermometerSun, CheckCircle2 } from "lucide-react";
import { Card } from "@/design-system/components/Card";
import { Section } from "@/components/sections/Section";
import { ServicePageLayout } from "@/components/services/ServicePageLayout";
import { generateServiceSchema, generateBreadcrumbSchema, SERVICE_SCHEMAS } from "@/utils/schemaGenerators";
import { generateFAQSchema } from "@/utils/seo";
import VoiceFAQ from "@/components/seo/VoiceFAQ";
import heroImage from "@/assets/hero-building-envelope.jpg";

const BuildingEnvelope = () => {
  const whatWeDeliver = [
    {
      icon: Droplets,
      title: "Waterproofing Excellence",
      description: "Advanced membrane systems, flashing details, and drainage solutions preventing water infiltration."
    },
    {
      icon: ThermometerSun,
      title: "Thermal Performance",
      description: "Continuous insulation systems, air barrier integration, and energy-efficient assemblies."
    },
    {
      icon: Wind,
      title: "Air Sealing Systems",
      description: "Comprehensive air barrier installation with tested continuity, minimizing energy loss."
    },
    {
      icon: Shield,
      title: "Structural Protection",
      description: "Durable cladding systems, proper attachment methods, and long-term warranty coverage."
    }
  ];

  const howWeWork = [
    {
      phase: "Pre-Construction",
      activities: [
        "Building envelope assessment and condition analysis",
        "System selection and material specifications",
        "Value engineering and lifecycle cost analysis"
      ]
    },
    {
      phase: "Execution",
      activities: [
        "Proper substrate preparation and repair",
        "Quality-controlled installation by certified crews",
        "Third-party testing and commissioning"
      ]
    },
    {
      phase: "Closeout",
      activities: [
        "System performance testing and validation",
        "Complete warranty documentation",
        "Maintenance guidelines and schedules"
      ]
    }
  ];

  const systemsWeInstall = [
    "EIFS (Exterior Insulation and Finish Systems)",
    "Traditional Stucco and Cement-Based Systems",
    "Masonry Restoration and Tuckpointing",
    "Metal Wall Panels and Cladding Systems",
    "Rainscreen and Cavity Wall Systems",
    "Below-Grade and Plaza Deck Waterproofing"
  ];

  const serviceConfig = SERVICE_SCHEMAS["building-envelope"];
  const siteUrl = typeof window !== 'undefined' ? window.location.origin : '';
  
  const serviceSchema = generateServiceSchema({
    name: serviceConfig.name,
    description: serviceConfig.description,
    url: `${siteUrl}/services/building-envelope`,
    provider: "Ascent Group Construction",
    areaServed: serviceConfig.areaServed,
    serviceType: serviceConfig.serviceType
  });

  const breadcrumbSchemaData = generateBreadcrumbSchema([
    { name: "Home", url: siteUrl },
    { name: "Services", url: `${siteUrl}/services` },
    { name: "Building Envelope", url: `${siteUrl}/services/building-envelope` }
  ]);

  return (
    <ServicePageLayout
      title="Building Envelope Services Toronto | Exterior Envelope Specialists"
      description="Expert building envelope solutions including EIFS, stucco, masonry restoration, metal cladding, and waterproofing for commercial and multi-family buildings across Ontario."
      keywords="building envelope, exterior envelope, EIFS, stucco, masonry restoration, waterproofing, Toronto envelope contractor"
      structuredData={[serviceSchema, breadcrumbSchemaData]}
      heroTitle="Building Envelope"
      heroDescription="Durable, energy-efficient building performance through expert envelope systems"
      heroImage={heroImage}
      category="Building Envelope"
      slug="building-envelope-solutions"
      ctaTitle="Ready to Upgrade Your Building Envelope?"
      ctaDescription="Request a comprehensive envelope assessment and let's discuss solutions for your building."
    >
      {/* What We Deliver */}
      <Section size="major">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">What We Deliver</h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Complete building envelope systems engineered for long-term durability and energy efficiency.
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
                <h3 className="text-lg font-bold mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </Card>
            );
          })}
        </div>
      </Section>

      {/* Systems We Install */}
      <Section size="major" className="bg-muted/30">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Systems We Install</h2>
          </div>

          <Card variant="default" size="md">
            <div className="grid md:grid-cols-2 gap-4">
              {systemsWeInstall.map((system, index) => (
                <div key={index} className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <span className="text-muted-foreground">{system}</span>
                </div>
              ))}
            </div>
          </UnifiedCard>
        </div>
      </Section>

      {/* Our Process */}
      <Section size="major">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Process</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {howWeWork.map((phase, index) => (
            <UnifiedCard key={index} variant="elevated" className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                  {index + 1}
                </div>
                <h3 className="text-xl font-bold">{phase.phase}</h3>
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

      {/* Voice FAQs for AEO */}
      <Section size="major" className="bg-muted/30">
        <div className="max-w-4xl mx-auto">
          <VoiceFAQ category="services" limit={4} />
        </div>
      </Section>
    </ServicePageLayout>
  );
};

export default BuildingEnvelope;
