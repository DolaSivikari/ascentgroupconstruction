import { Building2, Home, Shield, Clock, CheckCircle2 } from 'lucide-react';
import { Card } from "@/design-system/components/Card";
import { Section } from "@/components/sections/Section";
import { ServicePageLayout } from "@/components/services/ServicePageLayout";
import heroImage from '@/assets/heroes/hero-painting.jpg';

const PaintingServices = () => {
  const deliverables = [
    {
      icon: Building2,
      title: 'Commercial Painting',
      description: 'Office buildouts, retail spaces, and commercial facilities with minimal disruption and professional finishes.'
    },
    {
      icon: Home,
      title: 'Multi-Family & Residential',
      description: 'Condo towers, apartment buildings, and residential projects with coordinated scheduling.'
    },
    {
      icon: Shield,
      title: 'Specialty Coatings',
      description: 'Fire-rated coatings, anti-microbial finishes, and high-performance systems for specialized applications.'
    },
    {
      icon: Clock,
      title: 'Surface Preparation',
      description: 'Comprehensive prep including drywall repair, sanding, priming, and surface profiling.'
    }
  ];

  const process = [
    {
      phase: 'Pre-Paint Assessment',
      description: 'Surface condition evaluation, color consultation, and detailed scope development.'
    },
    {
      phase: 'Surface Preparation',
      description: 'Drywall repair, sanding, cleaning, masking, and primer application.'
    },
    {
      phase: 'Paint Application',
      description: 'Professional application using spray, brush, and roller techniques with quality control.'
    }
  ];

  return (
    <ServicePageLayout
      title="Painting Services Ontario | Commercial, Multi-Family & Residential Painting"
      description="Professional painting services for commercial, multi-family, and residential projects across Ontario. Certified crews, eco-friendly coatings, and warranty-backed work."
      keywords="painting contractor, commercial painting, multi-family painting, residential painting, interior painting, exterior painting Ontario"
      heroTitle="Painting Services"
      heroDescription="Professional painting for commercial, multi-family, and residential projects"
      heroImage={heroImage}
      category="Interior Construction"
      slug="painting-services"
    >
      {/* What We Deliver */}
      <Section size="major">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">What We Deliver</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Complete painting services with certified crews and eco-friendly systems
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {deliverables.map((item, index) => (
            <Card key={index} variant="elevated" size="md">
              <item.icon className="h-12 w-12 mb-4 text-primary" />
              <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
              <p className="text-muted-foreground">{item.description}</p>
            </UnifiedCard>
          ))}
        </div>
      </Section>

      {/* Our Process */}
      <Section size="major" className="bg-muted/30">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Process</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {process.map((step, index) => (
            <div key={index} className="relative">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold mr-4">
                  {index + 1}
                </div>
                <h3 className="text-xl font-semibold">{step.phase}</h3>
              </div>
              <p className="text-muted-foreground ml-14">{step.description}</p>
            </div>
          ))}
        </div>
      </Section>
    </ServicePageLayout>
  );
};

export default PaintingServices;
