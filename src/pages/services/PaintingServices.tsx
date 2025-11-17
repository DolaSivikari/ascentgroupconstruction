import { Link } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';
import PageHeader from '@/components/PageHeader';
import { Button } from '@/ui/Button';
import { UnifiedCard } from "@/components/shared/UnifiedCard";
import { Section } from "@/components/sections/Section";
import { Paintbrush, Building2, Home, Shield, CheckCircle2, Clock, ArrowRight } from 'lucide-react';
import heroImage from '@/assets/heroes/hero-painting.jpg';
import { ServiceCitySection } from "@/components/services/ServiceCitySection";
import { CTA_TEXT } from "@/design-system/constants";
import { ScrollReveal } from "@/components/animations/ScrollReveal";

const PaintingServices = () => {
  const stats = [
    { value: '2M+', label: 'SF Painted' },
    { value: '300+', label: 'Projects' },
    { value: '100%', label: 'Eco-Friendly Coatings' },
    { value: '15 Years', label: 'Experience' }
  ];

  const deliverables = [
    {
      icon: Building2,
      title: 'Commercial Painting',
      description: 'Office buildouts, retail spaces, and commercial facilities with minimal disruption and professional finishes meeting tenant improvement standards.'
    },
    {
      icon: Home,
      title: 'Multi-Family & Residential',
      description: 'Condo towers, apartment buildings, and residential projects with coordinated scheduling, common area protection, and resident communication.'
    },
    {
      icon: Shield,
      title: 'Specialty Coatings',
      description: 'Fire-rated coatings, anti-microbial finishes, and high-performance systems for specialized applications and code compliance.'
    },
    {
      icon: Clock,
      title: 'Surface Preparation',
      description: 'Comprehensive prep including drywall repair, sanding, priming, and surface profiling ensuring proper paint adhesion and smooth finishes.'
    }
  ];

  const process = [
    {
      phase: 'Pre-Paint Assessment',
      description: 'Surface condition evaluation, color consultation, product selection, and detailed scope development with scheduling coordination.'
    },
    {
      phase: 'Surface Preparation',
      description: 'Drywall repair, sanding, cleaning, masking, and primer application following proper surface preparation protocols.'
    },
    {
      phase: 'Paint Application',
      description: 'Professional application using spray, brush, and roller techniques with quality control inspections and warranty documentation.'
    }
  ];

  const projectTypes = [
    {
      type: 'Office & Retail',
      features: [
        'After-hours scheduling to minimize disruption',
        'Low-VOC coatings for occupied spaces',
        'Color consultation and brand matching',
        'Quick turnaround for tenant improvements'
      ]
    },
    {
      type: 'Multi-Family Buildings',
      features: [
        'Coordinated unit scheduling and access',
        'Common area protection protocols',
        'Resident communication and notices',
        'Warranty documentation for property management'
      ]
    },
    {
      type: 'Residential Projects',
      features: [
        'Interior and exterior painting services',
        'Cabinet and trim refinishing',
        'Deck and fence staining',
        'Color consultation and recommendations'
      ]
    }
  ];

  const advantages = [
    'Master Painters with provincial certifications',
    'Eco-friendly, low-VOC coating systems',
    'Comprehensive surface preparation protocols',
    'Coordinated scheduling for occupied buildings',
    'Full warranty and quality documentation'
  ];

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Painting Services Ontario | Commercial, Multi-Family & Residential Painting"
        description="Professional painting services for commercial, multi-family, and residential projects across Ontario. Certified crews, eco-friendly coatings, and warranty-backed work. From office buildouts to condo towers."
        keywords="painting contractor, commercial painting, multi-family painting, residential painting, interior painting, exterior painting, condo painting, office painting Ontario"
      />
      <Navigation />

      <PageHeader
        title="Painting Services"
        description="Professional painting for commercial, multi-family, and residential projects"
        backgroundImage={heroImage}
        cta={{ label: CTA_TEXT.project, href: "/estimate" }}
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Services', href: '/services' },
          { label: 'Painting Services' }
        ]}
      />

      <main className="flex-1">
        {/* What We Deliver Section */}
        <section className="py-20 bg-gradient-to-b from-muted/20 to-background">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">What We Deliver</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Complete painting services across all project types with certified crews and eco-friendly systems
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
          </div>
        </section>

        {/* Project Types Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Project Types We Serve</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Specialized painting solutions tailored to each project type
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {projectTypes.map((project, index) => (
                <UnifiedCard key={index} variant="base">
                  <h3 className="text-2xl font-bold mb-4">{project.type}</h3>
                  <ul className="space-y-3">
                    {project.features.map((feature, fIndex) => (
                      <li key={fIndex} className="flex items-start gap-2">
                        <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                        <span className="text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </UnifiedCard>
              ))}
            </div>
          </div>
        </section>

        {/* How We Work Section */}
        <section className="py-20 bg-gradient-to-b from-muted/20 to-background">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">How We Work</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Systematic approach ensuring quality finishes and minimal disruption
              </p>
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
          </div>
        </section>

        {/* Why Choose Us Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">Why Ascent for Painting</h2>
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
        <ServiceCitySection serviceName="Painting Services" serviceSlug="painting-services" />

        {/* CTA Section */}
        <section className="py-20 bg-primary text-primary-foreground">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Start Your Painting Project?
            </h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
              Get professional painting services with certified crews and eco-friendly coatings
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

export default PaintingServices;