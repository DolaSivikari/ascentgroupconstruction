import { Sun, Droplet, Recycle, Leaf } from 'lucide-react';
import { Card } from "@/design-system/components/Card";
import { Section } from "@/components/sections/Section";
import { ServicePageLayout } from "@/components/services/ServicePageLayout";
import heroImage from '@/assets/heroes/hero-sustainable.jpg';

const SustainableBuilding = () => {
  const deliverables = [
    {
      icon: Sun,
      title: 'Energy-Efficient Envelope Systems',
      description: 'High-performance building envelope assemblies optimizing thermal performance and reducing energy costs.'
    },
    {
      icon: Leaf,
      title: 'Sustainable Material Selection',
      description: 'Low-VOC coatings, recycled-content materials, and regionally sourced products where available.'
    },
    {
      icon: Droplet,
      title: 'Water Management & Protection',
      description: 'Effective waterproofing and moisture management systems that extend building lifespan.'
    },
    {
      icon: Recycle,
      title: 'Waste Diversion Practices',
      description: 'On-site waste sorting, material recycling programs, and responsible disposal protocols.'
    }
  ];

  const process = [
    {
      phase: 'Assessment & Goals',
      description: 'Review existing envelope performance and identify opportunities for energy-efficient upgrades.'
    },
    {
      phase: 'Material & Method Selection',
      description: 'Recommend sustainable materials and installation methods that align with your budget and performance goals.'
    },
    {
      phase: 'Execution & Documentation',
      description: 'Install with attention to thermal bridging, air tightness, and moisture management. Provide material data sheets and waste diversion records.'
    }
  ];

  const capabilities = [
    'Continuous insulation systems (EIFS, mineral wool)',
    'High-performance air and vapour barriers',
    'Low-VOC and zero-VOC coatings',
    'Recycled-content building materials',
    'On-site waste diversion and recycling',
    'Energy-efficient window and door integration'
  ];

  return (
    <ServicePageLayout
      title="Sustainable Building Practices | Energy-Efficient Envelope Systems | Ascent Group"
      description="Sustainable construction practices including energy-efficient envelope systems, low-VOC materials, and waste diversion for commercial and residential projects across Ontario."
      keywords="sustainable building practices, energy efficient envelope, low VOC coatings, waste diversion construction, green building Ontario"
      heroTitle="Sustainable Building Practices"
      heroDescription="Energy-efficient envelope systems, sustainable materials, and responsible construction methods"
      heroImage={heroImage}
      category="Specialized Services"
      slug="sustainable-building"
      ctaTitle="Ready to Build More Sustainably?"
      ctaDescription="Ask us about energy-efficient envelope options and sustainable material choices for your project."
    >
      {/* What We Deliver */}
      <Section size="major">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">What We Deliver</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Practical sustainable building approaches that improve envelope performance and reduce environmental impact
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {deliverables.map((item, index) => (
            <Card key={index} variant="elevated" size="md">
              <item.icon className="h-12 w-12 mb-4 text-primary" />
              <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
              <p className="text-muted-foreground">{item.description}</p>
            </Card>
          ))}
        </div>
      </Section>

      {/* Capabilities */}
      <Section size="major" className="bg-muted/30">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Sustainable Capabilities</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Practical approaches we integrate into our envelope and interior trade work
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto">
          {capabilities.map((item, index) => (
            <div key={index} className="flex items-center gap-3 p-4 rounded-lg border bg-background">
              <Leaf className="h-5 w-5 text-primary flex-shrink-0" />
              <span className="text-sm font-medium">{item}</span>
            </div>
          ))}
        </div>
      </Section>

      {/* Our Process */}
      <Section size="major">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Approach</h2>
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
