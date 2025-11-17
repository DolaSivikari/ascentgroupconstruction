import { Link } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';
import PageHeader from '@/components/PageHeader';
import { UnifiedCard } from "@/components/shared/UnifiedCard";
import { Section } from "@/components/sections/Section";
import { Button } from '@/ui/Button';
import { CTA_TEXT } from "@/design-system/constants";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Building2, Shield, Layers, Wind, CheckCircle2, ArrowRight } from 'lucide-react';
import heroImage from '@/assets/heroes/hero-cladding.jpg';
import { ServiceCitySection } from "@/components/services/ServiceCitySection";
import { ScrollReveal } from "@/components/animations/ScrollReveal";

const CladdingSystems = () => {
  const stats = [
    { value: '2M+', label: 'SF Installed' },
    { value: '150+', label: 'Facade Projects' },
    { value: '100%', label: 'Warranty Compliant' },
    { value: '15 Years', label: 'Expertise' }
  ];

  const advantages = [
    'Specialized envelope crews with manufacturer certifications',
    'In-house engineering support for complex facades',
    'Complete rainscreen and air barrier integration',
    'Full warranty compliance and testing documentation',
    'Experience with occupied building installations'
  ];

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Exterior Cladding Systems Ontario | Metal Panels, EIFS, Stucco & Rainscreen"
        description="Complete exterior cladding solutions including metal panel systems, EIFS/stucco, fiber cement, and ventilated rainscreen assemblies. Self-performed by specialized envelope crews serving commercial and institutional projects across Ontario."
        keywords="exterior cladding, metal panel systems, EIFS contractor, stucco contractor, rainscreen cladding, fiber cement siding, facade systems, commercial cladding Ontario"
      />
      <Navigation />

      <PageHeader
        title="Cladding Systems"
        description="Complete exterior cladding solutions from metal panels to EIFS and rainscreen assemblies"
        backgroundImage={heroImage}
        cta={{ label: CTA_TEXT.project, href: "/estimate" }}
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Services', href: '/services' },
          { label: 'Cladding Systems' }
        ]}
      />

      <main className="flex-1">
        {/* Cladding Types Tabs Section */}
        <section className="py-20 bg-gradient-to-b from-muted/20 to-background">
          <div className="container mx-auto px-4">
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

              <TabsContent value="metal" className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <UnifiedCard variant="elevated">
                    <Building2 className="h-12 w-12 mb-4 text-primary" />
                    <h3 className="text-xl font-semibold mb-2">Aluminum Composite Panels (ACM)</h3>
                    <p className="text-muted-foreground mb-4">
                      Lightweight, versatile panels in unlimited colors and finishes. Ideal for modern commercial facades requiring complex shapes and precise panel alignment.
                    </p>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-primary" />
                        Fire-rated core options (FR/A2)
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-primary" />
                        Rainscreen and direct-applied systems
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-primary" />
                        PVDF and anodized finishes
                      </li>
                    </ul>
                  </UnifiedCard>

                  <UnifiedCard variant="elevated">
                    <Layers className="h-12 w-12 mb-4 text-primary" />
                    <h3 className="text-xl font-semibold mb-2">Standing Seam Metal Roofing/Walls</h3>
                    <p className="text-muted-foreground mb-4">
                      Concealed fastener metal panel systems for roofs and walls. Long-lasting, low-maintenance solution with thermal movement accommodation.
                    </p>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-primary" />
                        Aluminum, steel, zinc, and copper options
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-primary" />
                        Snap-lock and mechanical seam profiles
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-primary" />
                        Integrated gutter and trim systems
                      </li>
                    </ul>
                  </UnifiedCard>

                  <UnifiedCard variant="elevated">
                    <Shield className="h-12 w-12 mb-4 text-primary" />
                    <h3 className="text-xl font-semibold mb-2">Insulated Metal Panels (IMP)</h3>
                    <p className="text-muted-foreground mb-4">
                      Factory-insulated metal panels combining structural support, insulation, and weather barrier in single component for fast installation.
                    </p>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-primary" />
                        R-values up to R-40
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-primary" />
                        Wall and roof applications
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-primary" />
                        Flush panel and ribbed profiles
                      </li>
                    </ul>
                  </UnifiedCard>

                  <UnifiedCard variant="elevated">
                    <Wind className="h-12 w-12 mb-4 text-primary" />
                    <h3 className="text-xl font-semibold mb-2">Corrugated & Ribbed Metal Siding</h3>
                    <p className="text-muted-foreground mb-4">
                      Cost-effective metal siding for industrial, warehouse, and utilitarian applications requiring durability and low maintenance.
                    </p>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-primary" />
                        Galvanized and pre-painted steel
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-primary" />
                        Exposed fastener systems
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-primary" />
                        Multiple rib profiles and gauges
                      </li>
                    </ul>
                  </UnifiedCard>
                </div>
              </TabsContent>

              <TabsContent value="eifs" className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <UnifiedCard variant="elevated">
                    <Building2 className="h-12 w-12 mb-4 text-primary" />
                    <h3 className="text-xl font-semibold mb-2">EIFS (Exterior Insulation & Finish System)</h3>
                    <p className="text-muted-foreground mb-4">
                      Multi-layer synthetic stucco system providing continuous insulation, design flexibility, and energy efficiency for commercial facades.
                    </p>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-primary" />
                        PB (polymer-based) and PM (polymer-modified) systems
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-primary" />
                        Unlimited color and texture options
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-primary" />
                        Integrated water management
                      </li>
                    </ul>
                  </UnifiedCard>

                  <UnifiedCard variant="elevated">
                    <Layers className="h-12 w-12 mb-4 text-primary" />
                    <h3 className="text-xl font-semibold mb-2">Traditional Stucco</h3>
                    <p className="text-muted-foreground mb-4">
                      Cement-based three-coat stucco system for durable, breathable, and fire-resistant exterior finish on commercial and institutional buildings.
                    </p>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-primary" />
                        Scratch, brown, and finish coats
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-primary" />
                        Integral color and painted finishes
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-primary" />
                        Over masonry, CMU, or lath
                      </li>
                    </ul>
                  </UnifiedCard>

                  <UnifiedCard variant="elevated">
                    <Shield className="h-12 w-12 mb-4 text-primary" />
                    <h3 className="text-xl font-semibold mb-2">Acrylic & Elastomeric Finishes</h3>
                    <p className="text-muted-foreground mb-4">
                      High-performance coating systems for EIFS and stucco providing weather protection, crack bridging, and aesthetic enhancement.
                    </p>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-primary" />
                        Smooth, sand, and textured finishes
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-primary" />
                        UV-resistant formulations
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-primary" />
                        20+ year performance life
                      </li>
                    </ul>
                  </UnifiedCard>

                  <UnifiedCard variant="elevated">
                    <Wind className="h-12 w-12 mb-4 text-primary" />
                    <h3 className="text-xl font-semibold mb-2">EIFS Repair & Restoration</h3>
                    <p className="text-muted-foreground mb-4">
                      Specialized repair services for existing EIFS systems including moisture remediation, impact repair, and complete recoating.
                    </p>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-primary" />
                        Moisture testing and remediation
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-primary" />
                        Impact damage repair
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-primary" />
                        Complete system recoating
                      </li>
                    </ul>
                  </UnifiedCard>
                </div>
              </TabsContent>

              <TabsContent value="other" className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <UnifiedCard variant="elevated">
                    <Building2 className="h-12 w-12 mb-4 text-primary" />
                    <h3 className="text-xl font-semibold mb-2">Fiber Cement Siding</h3>
                    <p className="text-muted-foreground mb-4">
                      Durable, non-combustible siding in lap, panel, and shake profiles. Ideal for commercial and multi-family projects requiring low maintenance.
                    </p>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-primary" />
                        Factory-primed and pre-finished options
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-primary" />
                        30-50 year warranty coverage
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-primary" />
                        Fire-resistant and pest-proof
                      </li>
                    </ul>
                  </UnifiedCard>

                  <UnifiedCard variant="elevated">
                    <Layers className="h-12 w-12 mb-4 text-primary" />
                    <h3 className="text-xl font-semibold mb-2">Rainscreen Cladding Systems</h3>
                    <p className="text-muted-foreground mb-4">
                      Ventilated facade systems with drainage cavity behind cladding. Superior moisture management and thermal performance for any cladding type.
                    </p>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-primary" />
                        Compatible with all cladding materials
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-primary" />
                        Improved envelope durability
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-primary" />
                        Enhanced energy performance
                      </li>
                    </ul>
                  </UnifiedCard>

                  <UnifiedCard variant="elevated">
                    <Shield className="h-12 w-12 mb-4 text-primary" />
                    <h3 className="text-xl font-semibold mb-2">Composite Panel Systems</h3>
                    <p className="text-muted-foreground mb-4">
                      High-performance composite panels combining multiple materials for optimal performance, aesthetics, and sustainability.
                    </p>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-primary" />
                        Wood-plastic composite (WPC) panels
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-primary" />
                        High-pressure laminate (HPL)
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-primary" />
                        Phenolic resin panels
                      </li>
                    </ul>
                  </UnifiedCard>

                  <UnifiedCard variant="elevated">
                    <Wind className="h-12 w-12 mb-4 text-primary" />
                    <h3 className="text-xl font-semibold mb-2">Vinyl & PVC Siding</h3>
                    <p className="text-muted-foreground mb-4">
                      Cost-effective, low-maintenance siding for commercial and residential projects requiring economical weather protection.
                    </p>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-primary" />
                        Horizontal and vertical profiles
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-primary" />
                        Insulated and non-insulated options
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-primary" />
                        Lifetime limited warranties
                      </li>
                    </ul>
                  </UnifiedCard>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </section>

        {/* Why Choose Us Section */}
        <section className="py-20 bg-gradient-to-b from-muted/20 to-background">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">Why Ascent for Cladding Systems</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {advantages.map((advantage, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <CheckCircle2 className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                    <p className="text-lg">{advantage}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Service Cities Section */}
        <ServiceCitySection serviceName="Cladding Systems" serviceSlug="cladding-systems" />

        {/* CTA Section */}
        <section className="py-20 bg-primary text-primary-foreground">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Start Your Cladding Project?
            </h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
              Get expert cladding system installation from specialized envelope crews
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" asChild>
                <Link to="/estimate">Request Quote</Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
                <Link to="/contact">Contact Us</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default CladdingSystems;