import { Award, Sun, Droplet, Recycle } from 'lucide-react';
import { UnifiedCard } from "@/components/shared/UnifiedCard";
import { Section } from "@/components/sections/Section";
import { ServicePageLayout } from "@/components/services/ServicePageLayout";
import heroImage from '@/assets/heroes/hero-sustainable.jpg';

const SustainableBuilding = () => {
  const deliverables = [
    {
      icon: Award,
      title: 'LEED Consulting & Certification',
      description: 'Full LEED certification support from planning through documentation.'
    },
    {
      icon: Sun,
      title: 'Energy-Efficient Envelope Systems',
      description: 'High-performance building envelope assemblies optimizing thermal performance.'
    },
    {
      icon: Droplet,
      title: 'Water Conservation Systems',
      description: 'Rainwater harvesting, greywater systems, and low-flow fixture integration.'
    },
    {
      icon: Recycle,
      title: 'Sustainable Materials & Methods',
      description: 'Recycled content materials, regional sourcing, and waste diversion programs.'
    }
  ];

  const process = [
    {
      phase: 'Sustainability Goals',
      description: 'Define certification targets and develop integrated sustainability strategy.'
    },
    {
      phase: 'Design Integration',
      description: 'Collaborate on envelope optimization and material selection.'
    },
    {
      phase: 'Execution & Documentation',
      description: 'Implement sustainable practices with rigorous material tracking.'
    }
  ];

  const certifications = [
    { name: 'LEED', levels: ['Certified', 'Silver', 'Gold', 'Platinum'] },
    { name: 'Green Globes', levels: ['1-4 Globes'] },
    { name: 'Passive House', levels: ['Classic', 'Plus', 'Premium'] }
  ];

  return (
    <ServicePageLayout
      title="Sustainable Building & LEED Certification | Green Construction Ontario"
      description="Sustainable construction services including LEED consulting, energy-efficient envelope systems, and green building certifications across Ontario."
      keywords="sustainable building, LEED certification, green construction, energy efficient buildings, passive house Ontario"
      heroTitle="Sustainable Building Solutions"
      heroDescription="LEED certification, energy-efficient envelope systems, and green building expertise"
      heroImage={heroImage}
      category="Specialized Services"
      slug="sustainable-building"
      ctaTitle="Ready to Build Sustainably?"
      ctaDescription="Get expert sustainable building services and LEED certification support."
    >
      {/* What We Deliver */}
      <Section size="major">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">What We Deliver</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Comprehensive sustainable building services reducing environmental impact and operational costs
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {deliverables.map((item, index) => (
            <UnifiedCard key={index} variant="elevated">
              <item.icon className="h-12 w-12 mb-4 text-primary" />
              <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
              <p className="text-muted-foreground">{item.description}</p>
            </UnifiedCard>
          ))}
        </div>
      </Section>

      {/* Certifications */}
      <Section size="major" className="bg-muted/30">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Certifications We Support</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {certifications.map((cert, index) => (
            <UnifiedCard key={index} variant="base">
              <h3 className="text-2xl font-bold mb-3">{cert.name}</h3>
              <div className="flex flex-wrap gap-2">
                {cert.levels.map((level, lIndex) => (
                  <span key={lIndex} className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                    {level}
                  </span>
                ))}
              </div>
            </UnifiedCard>
          ))}
        </div>
      </Section>

      {/* Our Process */}
      <Section size="major">
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

export default SustainableBuilding;
