import { Ruler, Shield, Clock, CheckCircle2, Sparkles } from 'lucide-react';
import { Card } from "@/design-system/components/Card";
import { Section } from "@/components/sections/Section";
import { ServicePageLayout } from "@/components/services/ServicePageLayout";
import heroImage from '@/assets/heroes/hero-tile-flooring.jpg';

const TileFlooring = () => {
  const deliverables = [
    {
      icon: Ruler,
      title: 'Ceramic & Porcelain Tile',
      description: 'Large-format porcelain, ceramic tile, and mosaic installations for commercial lobbies and high-traffic areas.'
    },
    {
      icon: Shield,
      title: 'Luxury Vinyl & Resilient Flooring',
      description: 'Commercial-grade LVT, sheet vinyl, and resilient flooring with proper substrate preparation.'
    },
    {
      icon: Sparkles,
      title: 'Specialty Surfaces',
      description: 'Natural stone, terrazzo, epoxy flooring, and decorative concrete for unique requirements.'
    },
    {
      icon: Clock,
      title: 'Waterproofing & Substrate Prep',
      description: 'Critical waterproof membrane installation and proper substrate leveling for long-term performance.'
    }
  ];

  const process = [
    {
      phase: 'Substrate Assessment',
      description: 'Moisture testing, flatness verification, and structural evaluation.'
    },
    {
      phase: 'Preparation & Waterproofing',
      description: 'Substrate leveling, crack repair, and waterproof membrane application.'
    },
    {
      phase: 'Installation & Finishing',
      description: 'Precision tile layout, proper adhesive application, grout, and sealing.'
    }
  ];

  return (
    <ServicePageLayout
      title="Tile & Flooring Installation | Commercial & Multi-Family Projects Ontario"
      description="Professional tile installation and flooring services for commercial, institutional, and multi-family projects. Ceramic, porcelain, LVT, and specialty surfaces with certified crews."
      keywords="tile installation, commercial flooring, porcelain tile, luxury vinyl tile, LVT installation, flooring contractor Ontario"
      heroTitle="Tile & Flooring Installation"
      heroDescription="Professional flooring solutions for commercial and multi-family projects"
      heroImage={heroImage}
      category="Interior Construction"
      slug="tile-flooring"
    >
      {/* What We Deliver */}
      <Section size="major">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">What We Deliver</h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Professional flooring installation for commercial, institutional, and multi-family projects
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-8">
          {deliverables.map((item, index) => (
            <Card key={index} variant="elevated" size="md">
              <item.icon className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
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

export default TileFlooring;
