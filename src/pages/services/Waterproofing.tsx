import { Droplets, Shield, Building, Layers, CheckCircle2 } from 'lucide-react';
import { UnifiedCard } from "@/components/shared/UnifiedCard";
import { Section } from "@/components/sections/Section";
import { ServicePageLayout } from "@/components/services/ServicePageLayout";
import { generateServiceSchema, generateBreadcrumbSchema, SERVICE_SCHEMAS } from '@/utils/schemaGenerators';
import heroImage from '@/assets/hero-waterproofing.jpg';

const Waterproofing = () => {
  const serviceConfig = SERVICE_SCHEMAS["waterproofing"];
  const siteUrl = typeof window !== 'undefined' ? window.location.origin : '';
  
  const serviceSchema = generateServiceSchema({
    name: serviceConfig.name,
    description: serviceConfig.description,
    url: `${siteUrl}/services/waterproofing`,
    provider: "Ascent Group Construction",
    areaServed: serviceConfig.areaServed,
    serviceType: serviceConfig.serviceType
  });

  const breadcrumbSchemaData = generateBreadcrumbSchema([
    { name: "Home", url: siteUrl },
    { name: "Services", url: `${siteUrl}/services` },
    { name: "Waterproofing", url: `${siteUrl}/services/waterproofing` }
  ]);

  const deliverables = [
    {
      icon: Droplets,
      title: 'Below-Grade Waterproofing',
      description: 'Foundation and basement waterproofing with proven membrane systems and drainage solutions.'
    },
    {
      icon: Shield,
      title: 'Plaza Deck Systems',
      description: 'Trafficked and landscaped deck waterproofing with protection boards and drainage layers.'
    },
    {
      icon: Building,
      title: 'Above-Grade Membranes',
      description: 'Wall and balcony waterproofing systems integrated with building envelope assemblies.'
    },
    {
      icon: Layers,
      title: 'Leak Investigation & Repair',
      description: 'Expert diagnostics and remediation of existing waterproofing failures.'
    }
  ];

  const process = [
    {
      phase: 'Assessment & Testing',
      description: 'Moisture testing, system evaluation, and engineering review.'
    },
    {
      phase: 'Substrate Preparation',
      description: 'Surface preparation, priming, and detailing for proper adhesion.'
    },
    {
      phase: 'System Installation',
      description: 'Membrane application with critical detailing at transitions and penetrations.'
    }
  ];

  return (
    <ServicePageLayout
      title="Waterproofing Systems | Self-Performed by Specialty Contractor"
      description="Specialty contractor self-performing waterproofing systems including below-grade, plaza decks, and membrane installation. Manufacturer-certified applicators with extended warranties."
      keywords="waterproofing, specialty contractor, below grade waterproofing, plaza deck, membrane systems, foundation waterproofing"
      structuredData={[serviceSchema, breadcrumbSchemaData]}
      heroTitle="Waterproofing Systems"
      heroDescription="Comprehensive waterproofing solutions protecting your investment from foundation to roof"
      heroImage={heroImage}
      category="Building Envelope"
      slug="waterproofing-systems"
      ctaTitle="Protect Your Building from Moisture"
      ctaDescription="Expert waterproofing systems with comprehensive warranties and proven performance."
    >
      {/* What We Deliver */}
      <Section size="major">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">What We Deliver</h2>
          <p className="text-lg text-muted-foreground">
            From foundation to plaza decks, we install proven waterproofing systems that provide lasting protection.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {deliverables.map((item, index) => (
            <UnifiedCard key={index} variant="elevated" className="p-8">
              <item.icon className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-xl font-bold mb-3">{item.title}</h3>
              <p className="text-muted-foreground">{item.description}</p>
            </UnifiedCard>
          ))}
        </div>
      </Section>

      {/* Our Process */}
      <Section size="major" className="bg-muted/30">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Process</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {process.map((step, index) => (
            <div key={index} className="relative">
              <div className="bg-primary text-primary-foreground w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mb-4">
                {index + 1}
              </div>
              <h3 className="text-xl font-bold mb-3">{step.phase}</h3>
              <p className="text-muted-foreground">{step.description}</p>
            </div>
          ))}
        </div>
      </Section>
    </ServicePageLayout>
  );
};

export default Waterproofing;
