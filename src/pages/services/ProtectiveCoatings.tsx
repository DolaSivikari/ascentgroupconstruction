import { Paintbrush, CheckCircle2, ArrowRight, Clock, Shield, Sparkles, Building } from "lucide-react";
import { Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import PageHeader from "@/components/PageHeader";
import { UnifiedCard } from "@/components/shared/UnifiedCard";
import { Section } from "@/components/sections/Section";
import { Button } from '@/ui/Button';
import SEO from "@/components/SEO";
import { CTA_TEXT } from "@/design-system/constants";
import heroImage from "@/assets/heroes/hero-protective-coatings.jpg";
import { ServiceCitySection } from "@/components/services/ServiceCitySection";
import { ScrollReveal } from "@/components/animations/ScrollReveal";

const ProtectiveCoatings = () => {
  const whatWeDeliver = [
    {
      icon: Shield,
      title: "Industrial-Grade Protection",
      description: "High-performance epoxy, polyurethane, and elastomeric coatings engineered for extreme environments, chemical exposure, and heavy traffic areas."
    },
    {
      icon: Sparkles,
      title: "Anti-Graffiti Systems",
      description: "Sacrificial and permanent anti-graffiti coatings with rapid cleanup protocols. Protecting transit stations, public buildings, and vulnerable exterior surfaces."
    },
    {
      icon: Building,
      title: "Heritage Restoration Finishes",
      description: "Breathable mineral-based coatings, lime washes, and traditional finishes preserving historic masonry while meeting modern conservation guidelines."
    },
    {
      icon: Paintbrush,
      title: "Architectural Coatings",
      description: "Decorative elastomeric, textured, and specialty finishes combining aesthetic enhancement with superior weather protection and UV resistance."
    }
  ];

  const howWeWork = [
    {
      phase: "Surface Analysis & Specification",
      activities: [
        "Substrate type identification and contamination testing",
        "Moisture content measurement, pH analysis, and salt testing",
        "Coating compatibility assessment and adhesion testing",
        "System specification matching performance to environmental conditions",
        "Cost-benefit analysis for coating longevity and maintenance"
      ]
    },
    {
      phase: "Preparation & Priming",
      activities: [
        "Power washing, chemical cleaning, and surface profiling",
        "Graffiti removal and surface defect repair",
        "Moisture mitigation and substrate sealing",
        "Primer application optimized for coating adhesion",
        "Environmental controls for temperature and humidity"
      ]
    },
    {
      phase: "Application & Quality Control",
      activities: [
        "Controlled coating application by certified technicians",
        "Multiple coat buildup achieving specified mil thickness",
        "Real-time thickness monitoring and visual inspections",
        "Cure verification and performance testing",
        "Complete warranty documentation and maintenance guidelines"
      ]
    }
  ];

  const caseStudies = [
    {
      title: "Industrial Warehouse Coating",
      location: "Brampton, ON",
      size: "150,000 sq ft",
      duration: "6 weeks",
      description: "High-performance epoxy floor coating system for manufacturing facility with chemical resistance and forklift traffic."
    },
    {
      title: "Transit Station Anti-Graffiti",
      location: "Toronto, ON",
      size: "Multiple locations",
      duration: "3 months",
      description: "Permanent anti-graffiti coating program across subway station walls and structural elements for TTC maintenance."
    },
    {
      title: "Heritage Building Restoration",
      location: "Old Toronto",
      size: "Historic 4-story brick",
      duration: "4 months",
      description: "Breathable mineral coating system on heritage masonry meeting conservation standards while providing weather protection."
    }
  ];

  return (
    <div className="min-h-screen">
      <SEO
        title="Protective & Architectural Coatings Toronto | Industrial Coatings Ontario"
        description="Professional protective and architectural coating services across Ontario. Industrial-grade systems, anti-graffiti protection, heritage restoration finishes. 1,000+ projects with $30M+ in coatings applied."
        keywords="protective coatings Toronto, industrial coatings, anti-graffiti coating, architectural coatings, epoxy coatings, heritage restoration coatings Toronto"
      />
      <Navigation />
      
      <PageHeader
        title="Protective & Architectural Coatings"
        description="High-performance coating systems protecting and beautifying commercial, industrial, and institutional surfaces"
        backgroundImage={heroImage}
        cta={{ label: CTA_TEXT.project, href: "/contact" }}
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Services", href: "/services" },
          { label: "Protective & Architectural Coatings" }
        ]}
      />

      <main>
        {/* What We Deliver */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-foreground mb-4">What We Deliver</h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                Comprehensive coating solutions for protection, aesthetics, and performance across diverse commercial and institutional applications.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {whatWeDeliver.map((item, index) => {
                const Icon = item.icon;
                return (
                  <UnifiedCard key={index} variant="interactive">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </UnifiedCard>
                );
              })}
            </div>
          </div>
        </section>

        {/* How We Work */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-foreground mb-4">How We Work</h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                Our proven methodology ensures proper surface preparation, coating selection, and application techniques for long-lasting performance.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {howWeWork.map((phase, index) => (
                <UnifiedCard key={index} variant="elevated">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                      {index + 1}
                    </div>
                    <h3 className="text-xl font-semibold">{phase.phase}</h3>
                  </div>
                  <ul className="space-y-2">
                    {phase.activities.map((activity, actIndex) => (
                      <li key={actIndex} className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                        <span className="text-sm text-muted-foreground">{activity}</span>
                      </li>
                    ))}
                  </ul>
                </UnifiedCard>
              ))}
            </div>
          </div>
        </section>

        {/* Selected Case Studies */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-foreground mb-4">Selected Case Studies</h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                Recent coating projects demonstrating our technical expertise across diverse substrates and applications.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {caseStudies.map((project, index) => (
                <UnifiedCard key={index} variant="interactive">
                  <h3 className="text-lg font-semibold mb-2">{project.title}</h3>
                  <div className="flex flex-wrap gap-2 mb-3">
                    <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                      {project.location}
                    </span>
                    <span className="text-xs bg-accent/10 text-accent px-2 py-1 rounded">
                      {project.size}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">{project.description}</p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Clock className="w-3 h-3" />
                    <span>Completed in {project.duration}</span>
                  </div>
                </UnifiedCard>
              ))}
            </div>

            <div className="text-center mt-8">
              <Button asChild variant="outline" size="lg">
                <Link to="/projects">View All Projects</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* City-Specific SEO Section */}
        <ServiceCitySection
          serviceName="Protective Coatings & Painting"
          serviceSlug="protective-coatings"
          recentProjects={[
            {
              title: "Industrial Facility Coating Program",
              location: "Vaughan Manufacturing Plant",
              description: "Comprehensive protective coating system for 150,000 sq ft manufacturing facility including epoxy floor coatings, corrosion-resistant wall systems, and high-performance equipment coatings in chemical processing areas."
            },
            {
              title: "Parking Garage Traffic Coatings",
              location: "Downtown Toronto Parkade",
              description: "Multi-level parking structure coating program with polyurethane traffic membrane systems, expansion joint sealing, and line striping for 800-space underground facility maintaining resident access throughout."
            },
            {
              title: "Commercial Building Restoration Coatings",
              location: "Mississauga Office Tower",
              description: "High-rise building coating project including concrete sealer, elastomeric wall coatings, and specialty coatings for metal railings and architectural features protecting 18-story building envelope."
            }
          ]}
          faqs={[
            {
              question: "How much do protective coatings cost in Toronto?",
              answer: "Protective coating costs in Toronto vary by system: epoxy floor coatings $8-$18/sq ft, polyurethane traffic coatings $12-$25/sq ft, elastomeric wall coatings $6-$15/sq ft, intumescent fireproofing $15-$35/sq ft, industrial equipment coatings $25-$60/sq ft. Costs include surface preparation, priming, and specified coating systems."
            },
            {
              question: "How long do protective coatings last in Ontario?",
              answer: "Protective coating longevity in Ontario depends on system and exposure: epoxy floors 10-20 years, polyurethane traffic coatings 10-15 years, elastomeric wall coatings 8-15 years, industrial coatings 15-25 years. Proper surface preparation and application in controlled conditions are critical for achieving maximum service life in Ontario's climate."
            },
            {
              question: "Can you apply protective coatings in occupied buildings?",
              answer: "Yes, we specialize in occupied building coating projects throughout the GTA. We use low-odor and low-VOC coating systems where appropriate, coordinate work during off-hours, implement ventilation plans, and provide phased application schedules minimizing disruption to building operations while maintaining safety and quality standards."
          }
        ]}
        />

        {/* CTA Band */}
        <section className="py-16 bg-primary text-primary-foreground">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">Need Surface Protection or Restoration?</h2>
            <p className="text-lg text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
              Request a surface analysis and let our coating specialists develop a protection strategy for your facility.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button asChild size="lg" variant="secondary">
                <Link to="/contact">
                  Request Quote
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
                <Link to="/about">Talk to a Specialist</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default ProtectiveCoatings;