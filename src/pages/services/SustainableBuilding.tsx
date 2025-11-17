import { Link } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';
import PageHeader from '@/components/PageHeader';
import { Button } from '@/ui/Button';
import { UnifiedCard } from "@/components/shared/UnifiedCard";
import { Section } from "@/components/sections/Section";
import { Leaf, Sun, Droplet, Recycle, CheckCircle2, Award, ArrowRight } from 'lucide-react';
import heroImage from '@/assets/heroes/hero-sustainable.jpg';
import { ServiceCitySection } from "@/components/services/ServiceCitySection";
import { CTA_TEXT } from "@/design-system/constants";
import { ScrollReveal } from "@/components/animations/ScrollReveal";

const SustainableBuilding = () => {
  const stats = [
    { value: '50+', label: 'LEED Projects' },
    { value: '30%', label: 'Avg Energy Reduction' },
    { value: '100%', label: 'Sustainable Material Use' },
    { value: '10 Years', label: 'Green Building Experience' }
  ];

  const deliverables = [
    {
      icon: Award,
      title: 'LEED Consulting & Certification',
      description: 'Full LEED certification support from planning through documentation including credit optimization, material tracking, and commissioning coordination.'
    },
    {
      icon: Sun,
      title: 'Energy-Efficient Envelope Systems',
      description: 'High-performance building envelope assemblies optimizing thermal performance, air tightness, and renewable energy integration.'
    },
    {
      icon: Droplet,
      title: 'Water Conservation Systems',
      description: 'Rainwater harvesting, greywater systems, and low-flow fixture integration reducing potable water consumption and stormwater runoff.'
    },
    {
      icon: Recycle,
      title: 'Sustainable Materials & Methods',
      description: 'Recycled content materials, regional sourcing, low-VOC products, and construction waste diversion programs exceeding 75% diversion rates.'
    }
  ];

  const process = [
    {
      phase: 'Sustainability Goals',
      description: 'Define certification targets, establish performance baselines, and develop integrated sustainability strategy aligned with project objectives.'
    },
    {
      phase: 'Design Integration',
      description: 'Collaborate with design team on envelope optimization, material selection, and systems integration maximizing environmental performance.'
    },
    {
      phase: 'Execution & Documentation',
      description: 'Implement sustainable construction practices with rigorous material tracking, waste management, and documentation for certification submittal.'
    }
  ];

  const certifications = [
    {
      name: 'LEED Certification',
      levels: ['Certified', 'Silver', 'Gold', 'Platinum'],
      description: 'Leadership in Energy and Environmental Design certification from USGBC/CaGBC'
    },
    {
      name: 'Green Globes',
      levels: ['1-4 Globes'],
      description: 'Alternative green building rating system with flexible, streamlined certification process'
    },
    {
      name: 'Passive House',
      levels: ['Classic', 'Plus', 'Premium'],
      description: 'Rigorous energy efficiency standard focusing on envelope performance and mechanical systems'
    }
  ];

  const advantages = [
    'LEED Accredited Professionals on staff',
    'Envelope engineering expertise for energy modeling',
    'Established sustainable material supply chains',
    'Track record of successful LEED Gold projects',
    'Integration with renewable energy systems',
    'Comprehensive waste diversion programs'
  ];

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Sustainable Building & LEED Certification | Green Construction Ontario"
        description="Sustainable construction services including LEED consulting, energy-efficient envelope systems, and green building certifications. Expert support for LEED, Green Globes, and Passive House projects across Ontario."
        keywords="sustainable building, LEED certification, green construction, energy efficient buildings, LEED consultant, passive house, green building Ontario"
      />
      <Navigation />

      <PageHeader
        title="Sustainable Building Solutions"
        description="LEED certification, energy-efficient envelope systems, and green building expertise"
        backgroundImage={heroImage}
        cta={{ label: "Request Consultation", href: "/estimate" }}
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Services', href: '/services' },
          { label: 'Sustainable Building' }
        ]}
      />

      <main className="flex-1">
        {/* What We Deliver Section */}
        <section className="py-20 bg-gradient-to-b from-muted/20 to-background">
          <div className="container mx-auto px-4">
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
          </div>
        </section>

        {/* Certifications Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Green Building Certifications</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Supporting multiple certification pathways based on your project goals
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {certifications.map((cert, index) => (
                <UnifiedCard key={index} variant="base">
                  <h3 className="text-2xl font-bold mb-3">{cert.name}</h3>
                  <div className="mb-4">
                    <p className="text-sm text-muted-foreground mb-2">Levels Available:</p>
                    <div className="flex flex-wrap gap-2">
                      {cert.levels.map((level, lIndex) => (
                        <span key={lIndex} className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                          {level}
                        </span>
                      ))}
                    </div>
                  </div>
                  <p className="text-muted-foreground">{cert.description}</p>
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
                Integrated approach from concept through certification
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
              <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">Why Ascent for Sustainable Building</h2>
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
        <ServiceCitySection serviceName="Sustainable Building" serviceSlug="sustainable-construction" />

        {/* CTA Section */}
        <section className="py-20 bg-primary text-primary-foreground">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Build Sustainably?
            </h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
              Get expert sustainable building services and LEED certification support
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" asChild>
                <Link to="/estimate">Request Consultation</Link>
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

export default SustainableBuilding;