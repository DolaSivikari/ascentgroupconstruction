import { Link } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';
import PageHeader from '@/components/PageHeader';
import { Button } from '@/ui/Button';
import { UnifiedCard } from "@/components/shared/UnifiedCard";
import { Section } from "@/components/sections/Section";
import { Droplets, Shield, Building, Layers, CheckCircle2, ArrowRight } from 'lucide-react';
import { generateServiceSchema, generateBreadcrumbSchema, SERVICE_SCHEMAS } from '@/utils/schemaGenerators';
import heroImage from '@/assets/hero-waterproofing.jpg';
import { ServiceCitySection } from "@/components/services/ServiceCitySection";
import { CTA_TEXT } from "@/design-system/constants";
import { ScrollReveal } from "@/components/animations/ScrollReveal";

const Waterproofing = () => {
  const serviceConfig = SERVICE_SCHEMAS["waterproofing"];
  const siteUrl = window.location.origin;
  
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

  const stats = [
    { value: '1M+', label: 'SF Protected' },
    { value: 'ZERO', label: 'Leaks' },
    { value: '400+', label: 'Systems' },
    { value: '20 Years', label: 'Warranties' }
  ];

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
      description: 'Expert diagnostics and remediation of existing waterproofing failures with comprehensive warranties.'
    }
  ];

  const process = [
    {
      phase: 'Assessment & Testing',
      description: 'Moisture testing, system evaluation, and engineering review to determine optimal waterproofing strategy.'
    },
    {
      phase: 'Substrate Preparation',
      description: 'Surface preparation, priming, and detailing to ensure proper membrane adhesion and system performance.'
    },
    {
      phase: 'System Installation',
      description: 'Membrane application with critical detailing at transitions, penetrations, and terminations for lasting protection.'
    }
  ];

  const advantages = [
    'Manufacturer-certified applicators for all major systems',
    'In-house leak investigation and diagnostic services',
    'Extended warranties on materials and installation',
    'Integration with all building envelope systems'
  ];

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Waterproofing Systems | Self-Performed by Specialty Contractor"
        description="Specialty contractor self-performing waterproofing systems including below-grade, plaza decks, and membrane installation. Manufacturer-certified applicators with extended warranties for Ontario building envelope projects."
        keywords="waterproofing, specialty contractor, self-perform waterproofing, below grade waterproofing, plaza deck, membrane systems, foundation waterproofing, leak repair"
        structuredData={[serviceSchema, breadcrumbSchemaData]}
      />
      <Navigation />

      <PageHeader
        title="Waterproofing Systems"
        description="Comprehensive waterproofing solutions protecting your investment from foundation to roof"
        backgroundImage={heroImage}
        cta={{ label: CTA_TEXT.primary, href: "/estimate" }}
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Services', href: '/services' },
          { label: 'Waterproofing' }
        ]}
      />

      {/* What We Deliver */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Complete Waterproofing Solutions</h2>
            <p className="text-lg text-muted-foreground">
              From foundation to plaza decks, we install proven waterproofing systems that provide
              lasting protection against moisture intrusion.
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
        </div>
      </section>

      {/* How We Work */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Waterproofing Process</h2>
            <p className="text-lg text-muted-foreground">
              Systematic approach ensuring proper system selection and installation for maximum protection
            </p>
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
        </div>
      </section>

      {/* Self-Perform Advantage */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">Why Self-Perform Waterproofing</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {advantages.map((advantage, index) => (
                <div key={index} className="flex items-start gap-3">
                  <CheckCircle2 className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                  <p className="text-lg">{advantage}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Case Studies */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">Selected Waterproofing Projects</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              { title: 'Residential Tower Foundation', detail: '45,000 SF below-grade membrane, Toronto' },
              { title: 'Civic Plaza Deck', detail: 'Complete plaza waterproofing and landscaping, Mississauga' },
              { title: 'Hospital Parking Structure', detail: 'Traffic deck waterproofing system, Brampton' }
            ].map((project, index) => (
              <UnifiedCard key={index} variant="elevated">
                <h3 className="text-xl font-bold mb-2">{project.title}</h3>
                <p className="text-muted-foreground mb-4">{project.detail}</p>
                <Button variant="link" className="p-0 h-auto" asChild>
                  <Link to="/projects">View Project <ArrowRight className="w-4 h-4 ml-2" /></Link>
                </Button>
              </UnifiedCard>
            ))}
          </div>
        </div>
      </section>
      
      {/* Specialty Contractor Advantage */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">The Specialty Contractor Difference</h2>
            <p className="text-lg text-muted-foreground mb-6">
              As a specialty contractor, we self-perform waterproofing and restoration with trained crews—not subcontractors. This means better diagnostics, integrated solutions, comprehensive warranties, and direct accountability from our team to yours.
            </p>
            <Button variant="outline" size="lg" asChild>
              <Link to="/why-specialty-contractor">
                Why Choose a Specialty Contractor? <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* City-Specific SEO Section */}
      <ServiceCitySection
        serviceName="Waterproofing Services"
        serviceSlug="waterproofing"
        recentProjects={[
          {
            title: "Plaza Deck Waterproofing System",
            location: "Yorkville Residential Tower, Toronto",
            description: "Trafficked and landscaped plaza deck waterproofing with protection boards, drainage layers, and 20-year warranty for luxury condo amenity space."
          },
          {
            title: "Below-Grade Waterproofing Remediation",
            location: "Scarborough Commercial Complex",
            description: "Foundation waterproofing repair with drainage board installation and sump pump system upgrade for 85,000 sq ft office building experiencing basement moisture."
          },
          {
            title: "Balcony Waterproofing Replacement",
            location: "Mississauga Condominium",
            description: "Complete balcony membrane replacement for 18-story residential tower with integrated drainage and railing flashing details preventing water infiltration."
          }
        ]}
        faqs={[
          {
            question: "How much does waterproofing cost in Toronto?",
            answer: "Waterproofing costs in Toronto vary by system type: below-grade foundation waterproofing ranges $25-$60/sq ft, plaza deck systems $40-$85/sq ft, and balcony waterproofing $30-$65/sq ft. Leak investigation and repair typically costs $3,000-$8,000 per location. We provide detailed estimates after system assessment."
          },
          {
            question: "What's the best waterproofing system for Ontario climate?",
            answer: "For Ontario's freeze-thaw cycles, we recommend proven systems: rubberized asphalt membranes for below-grade, hot fluid-applied for plaza decks, and polyurethane or PVC for balconies. System selection depends on substrate, drainage, and exposure conditions—we provide engineering recommendations for each project."
          },
          {
            question: "How long do waterproofing warranties last?",
            answer: "Our waterproofing installations in the GTA come with manufacturer material warranties (10-20 years) and our installation workmanship warranty (2-10 years depending on system). Extended warranties are available through manufacturer-certified application programs. All warranties include leak repair coverage."
          }
        ]}
      />

      {/* CTA Band */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Protect Your Building from Moisture</h2>
          <p className="text-xl mb-8 text-primary-foreground/90 max-w-2xl mx-auto">
            Expert waterproofing systems with comprehensive warranties and proven performance
          </p>
          <Button size="lg" variant="secondary" asChild>
            <Link to="/contact">Request Assessment <ArrowRight className="ml-2 w-5 h-5" /></Link>
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Waterproofing;
