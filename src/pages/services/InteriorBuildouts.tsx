import { Ruler, Layers, PaintBucket, Building2, CheckCircle2 } from 'lucide-react';
import { Card } from "@/design-system/components/Card";
import { Section } from "@/components/sections/Section";
import { ServicePageLayout } from "@/components/services/ServicePageLayout";
import { createServiceSchema } from '@/utils/schema-injector';
import { breadcrumbSchema } from '@/utils/structured-data';
import heroImage from '@/assets/heroes/hero-tenant-improvements.jpg';

const InteriorBuildouts = () => {
  const serviceSchema = createServiceSchema({
    serviceType: 'Interior Buildouts & Finishing',
    areaServed: ['Toronto', 'Mississauga', 'Brampton', 'Vaughan', 'Markham', 'Hamilton', 'Burlington'],
    priceRange: '$$-$$$',
    subServices: ['Suite Buildouts', 'Tenant Improvements', 'Drywall & Finishing']
  });

  const breadcrumbSchemaData = breadcrumbSchema([
    { name: 'Home', url: 'https://ascentgroupconstruction.com/' },
    { name: 'Services', url: 'https://ascentgroupconstruction.com/services' },
    { name: 'Interior Buildouts', url: 'https://ascentgroupconstruction.com/services/interior-buildouts' }
  ]);

  const deliverables = [
    {
      icon: Ruler,
      title: 'Tenant Improvements',
      description: 'Complete commercial buildouts from base building to turnkey occupancy.'
    },
    {
      icon: Layers,
      title: 'Drywall & Metal Framing',
      description: 'Precision framing and drywall installation with specialty finishes.'
    },
    {
      icon: PaintBucket,
      title: 'Interior Finishing',
      description: 'Complete finishing packages including paint, millwork, and flooring.'
    },
    {
      icon: Building2,
      title: 'Suite Conversions',
      description: 'Adaptive reuse and space reconfiguration for new functions.'
    }
  ];

  const process = [
    {
      phase: 'Design Coordination',
      description: 'Architectural review, value engineering, and MEP coordination.'
    },
    {
      phase: 'Rough-In & Framing',
      description: 'Metal framing installation, MEP rough-ins, and inspections.'
    },
    {
      phase: 'Finishing & Closeout',
      description: 'Drywall finishing, paint, flooring, and millwork installation.'
    }
  ];

  return (
    <ServicePageLayout
      title="Interior Buildouts & Tenant Improvements | Specialty Contractor"
      description="Specialty contractor self-performing interior buildouts including tenant improvements, drywall installation, and complete finishing for Ontario commercial projects."
      keywords="interior buildouts, tenant improvements, specialty contractor, drywall installation, metal framing, interior finishing"
      structuredData={[serviceSchema, breadcrumbSchemaData]}
      heroTitle="Interior Buildouts & Finishing"
      heroDescription="Complete interior construction from tenant improvements to precision finishing"
      heroImage={heroImage}
      category="Interior Construction"
      slug="interior-buildouts-finishing"
      ctaTitle="Ready to Build Out Your Space?"
      ctaDescription="Expert interior construction with coordinated execution and quality finishes."
    >
      {/* What We Deliver */}
      <Section size="major">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">What We Deliver</h2>
          <p className="text-lg text-muted-foreground">
            From commercial tenant improvements to complete suite buildouts with quality craftsmanship.
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

export default InteriorBuildouts;
