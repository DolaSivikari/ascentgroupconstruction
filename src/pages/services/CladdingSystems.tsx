import { Building2, Shield, Layers, Wind, CheckCircle2 } from 'lucide-react';
import { Card } from "@/design-system/components/Card";
import { Section } from "@/components/sections/Section";
import { ServicePageLayout } from "@/components/services/ServicePageLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import heroImage from '@/assets/heroes/hero-cladding.jpg';

const CladdingSystems = () => {
  const metalPanels = [
    { title: 'Aluminum Composite Panels (ACM)', description: 'Lightweight panels for modern facades with fire-rated options.' },
    { title: 'Standing Seam Metal', description: 'Concealed fastener systems for roofs and walls.' },
    { title: 'Insulated Metal Panels (IMP)', description: 'Factory-insulated panels for fast installation.' },
    { title: 'Corrugated & Ribbed Siding', description: 'Cost-effective metal for industrial applications.' }
  ];

  const eifsStucco = [
    { title: 'EIFS Systems', description: 'Multi-layer synthetic stucco with continuous insulation.' },
    { title: 'Traditional Stucco', description: 'Cement-based three-coat stucco for durability.' },
    { title: 'Acrylic Finishes', description: 'High-performance coatings for weather protection.' },
    { title: 'EIFS Repair & Restoration', description: 'Specialized repair and moisture remediation.' }
  ];

  const otherSystems = [
    { title: 'Fiber Cement Siding', description: 'Durable, non-combustible siding with long warranties.' },
    { title: 'Rainscreen Cladding', description: 'Ventilated facade systems with superior moisture management.' },
    { title: 'Composite Panels', description: 'High-performance composite materials for optimal performance.' }
  ];

  return (
    <ServicePageLayout
      title="Exterior Cladding Systems Ontario | Metal Panels, EIFS, Stucco & Rainscreen"
      description="Complete exterior cladding solutions including metal panel systems, EIFS/stucco, fiber cement, and ventilated rainscreen assemblies for commercial projects."
      keywords="exterior cladding, metal panel systems, EIFS contractor, stucco contractor, rainscreen cladding, facade systems Ontario"
      heroTitle="Cladding Systems"
      heroDescription="Complete exterior cladding solutions from metal panels to EIFS and rainscreen assemblies"
      heroImage={heroImage}
      category="Building Envelope"
      slug="cladding-systems"
    >
      {/* Cladding Types */}
      <Section size="major">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Cladding System Types</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Comprehensive exterior cladding solutions for commercial and institutional facades
          </p>
        </div>

        <Tabs defaultValue="metal" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="metal">Metal Panels</TabsTrigger>
            <TabsTrigger value="eifs">EIFS & Stucco</TabsTrigger>
            <TabsTrigger value="other">Other Systems</TabsTrigger>
          </TabsList>

          <TabsContent value="metal">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {metalPanels.map((item, index) => (
                <Card key={index} variant="elevated" size="md">
                  <Building2 className="h-10 w-10 mb-4 text-primary" />
                  <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                  <p className="text-muted-foreground">{item.description}</p>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="eifs">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {eifsStucco.map((item, index) => (
                <Card key={index} variant="elevated" size="md">
                  <Layers className="h-10 w-10 mb-4 text-primary" />
                  <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                  <p className="text-muted-foreground">{item.description}</p>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="other">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {otherSystems.map((item, index) => (
                <UnifiedCard key={index} variant="elevated">
                  <Shield className="h-10 w-10 mb-4 text-primary" />
                  <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                  <p className="text-muted-foreground">{item.description}</p>
                </UnifiedCard>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </Section>
    </ServicePageLayout>
  );
};

export default CladdingSystems;
