import { Shield, Droplets, Wind, ThermometerSun, CheckCircle2, ArrowRight, Clock, Wrench } from "lucide-react";
import { Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import PageHeader from "@/components/PageHeader";
import { UnifiedCard } from "@/components/shared/UnifiedCard";
import { Section } from "@/components/sections/Section";
import { Button } from '@/ui/Button';
import SEO from "@/components/SEO";
import { CTA_TEXT } from "@/design-system/constants";
import { generateServiceSchema, generateBreadcrumbSchema, SERVICE_SCHEMAS } from "@/utils/schemaGenerators";
import heroImage from "@/assets/hero-building-envelope.jpg";
import { ServiceCitySection } from "@/components/services/ServiceCitySection";
import { ScrollReveal } from "@/components/animations/ScrollReveal";

const BuildingEnvelope = () => {
  const whatWeDeliver = [
    {
      icon: Droplets,
      title: "Waterproofing Excellence",
      description: "Advanced membrane systems, flashing details, and drainage solutions preventing water infiltration and moisture damage."
    },
    {
      icon: ThermometerSun,
      title: "Thermal Performance",
      description: "Continuous insulation systems, air barrier integration, and energy-efficient assemblies reducing operational costs."
    },
    {
      icon: Wind,
      title: "Air Sealing Systems",
      description: "Comprehensive air barrier installation with tested continuity, minimizing energy loss and improving comfort."
    },
    {
      icon: Shield,
      title: "Structural Protection",
      description: "Durable cladding systems, proper attachment methods, and long-term warranty coverage protecting your investment."
    }
  ];

  const howWeWork = [
    {
      phase: "Pre-Construction",
      activities: [
        "Building envelope assessment and condition analysis",
        "Thermal imaging and moisture testing",
        "System selection and material specifications",
        "Value engineering and lifecycle cost analysis"
      ]
    },
    {
      phase: "Execution",
      activities: [
        "Proper substrate preparation and repair",
        "Quality-controlled installation by certified crews",
        "Third-party testing and commissioning",
        "Comprehensive photo documentation"
      ]
    },
    {
      phase: "Closeout",
      activities: [
        "System performance testing and validation",
        "Complete warranty documentation",
        "Maintenance guidelines and schedules",
        "Long-term service and support agreements"
      ]
    }
  ];

  const systemsWeInstall = [
    "EIFS (Exterior Insulation and Finish Systems)",
    "Traditional Stucco and Modern Cement-Based Systems",
    "Masonry Restoration and Tuckpointing",
    "Metal Wall Panels and Cladding Systems",
    "Rainscreen and Cavity Wall Systems",
    "Below-Grade and Plaza Deck Waterproofing",
    "Window and Door Flashing Integration",
    "Expansion Joint Systems"
  ];

  const caseStudies = [
    {
      title: "High-Rise Envelope Restoration",
      location: "Toronto, ON",
      size: "200,000 sq ft",
      duration: "18 months",
      description: "Complete envelope rehabilitation including EIFS replacement, window upgrades, and balcony waterproofing for 25-story residential tower."
    },
    {
      title: "Commercial Office Enclosure",
      location: "Mississauga, ON",
      size: "60,000 sq ft",
      duration: "12 months",
      description: "New metal panel rainscreen system with continuous insulation achieving LEED Silver thermal performance targets."
    },
    {
      title: "Institutional Building Retrofit",
      location: "Vaughan, ON",
      size: "85,000 sq ft",
      duration: "14 months",
      description: "Heritage masonry restoration with modern air barrier integration and below-grade waterproofing remediation."
    }
  ];

  const serviceConfig = SERVICE_SCHEMAS["building-envelope"];
  const siteUrl = window.location.origin;
  
  const serviceSchema = generateServiceSchema({
    name: serviceConfig.name,
    description: serviceConfig.description,
    url: `${siteUrl}/services/building-envelope`,
    provider: "Ascent Group Construction",
    areaServed: serviceConfig.areaServed,
    serviceType: serviceConfig.serviceType
  });

  const breadcrumbSchemaData = generateBreadcrumbSchema([
    { name: "Home", url: siteUrl },
    { name: "Services", url: `${siteUrl}/services` },
    { name: "Building Envelope", url: `${siteUrl}/services/building-envelope` }
  ]);

  return (
    <div className="min-h-screen">
      <SEO
        title="Building Envelope Services Toronto | Exterior Envelope Specialists"
        description="Expert building envelope solutions including EIFS, stucco, masonry restoration, metal cladding, and waterproofing. Energy-efficient, durable systems for commercial and multi-family buildings across Ontario."
        keywords="building envelope, exterior envelope, EIFS, stucco, masonry restoration, waterproofing, Toronto envelope contractor"
        structuredData={[serviceSchema, breadcrumbSchemaData]}
      />
      <Navigation />
      
      <PageHeader
        title="Building Envelope"
        description="Durable, energy-efficient building performance through expert envelope systems"
        backgroundImage={heroImage}
        cta={{ label: CTA_TEXT.primary, href: "/contact" }}
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Services", href: "/services" },
          { label: "Building Envelope" }
        ]}
      />

      <main>
        {/* What We Deliver */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-foreground mb-4">Comprehensive Envelope Solutions</h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                We deliver complete building envelope systems engineered for long-term durability, energy efficiency, and weather protection.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {whatWeDeliver.map((item, index) => {
                const Icon = item.icon;
                return (
                  <ScrollReveal key={index} direction="up" delay={index * 100}>
                    <UnifiedCard variant="elevated" className="p-6 hover:shadow-xl transition-all duration-300">
                      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                        <Icon className="w-6 h-6 text-primary" />
                      </div>
                      <h3 className="text-lg font-bold mb-3">{item.title}</h3>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                    </UnifiedCard>
                  </ScrollReveal>
                );
              })}
            </div>
          </div>
        </section>

        {/* Systems We Install */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-foreground mb-4">Systems We Install</h2>
                <p className="text-lg text-muted-foreground">
                  Full-service envelope capabilities from below-grade waterproofing to wall cladding systems.
                </p>
              </div>

              <ScrollReveal direction="up">
                <UnifiedCard variant="base" className="p-6 hover:shadow-xl transition-all duration-300">
                  <div className="grid md:grid-cols-2 gap-4">
                    {systemsWeInstall.map((system, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                        <span className="text-muted-foreground">{system}</span>
                      </div>
                    ))}
                  </div>
                </UnifiedCard>
              </ScrollReveal>
            </div>
          </div>
        </section>

        {/* How We Work */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-foreground mb-4">Our Envelope Process</h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                Proven methodology ensuring proper design, quality installation, and long-term performance.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {howWeWork.map((phase, index) => (
                <UnifiedCard key={index} variant="elevated" className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                      {index + 1}
                    </div>
                    <h3 className="text-xl font-bold">{phase.phase}</h3>
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

        {/* Self-Perform Advantage */}
        <section className="py-20 bg-gradient-to-br from-primary/5 to-accent/5">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-foreground mb-6">Why Self-Perform Envelope Work</h2>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                We directly employ certified envelope technicians rather than subcontracting critical envelope work. This ensures:
              </p>
              
              <div className="grid md:grid-cols-2 gap-6 text-left">
                <UnifiedCard variant="elevated" className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <Wrench className="w-5 h-5 text-primary" />
                    <h3 className="text-base font-bold">Technical Expertise</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Our crews receive ongoing training on latest systems, materials, and installation techniques.
                  </p>
                </UnifiedCard>

                <UnifiedCard variant="elevated" className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <Shield className="w-5 h-5 text-primary" />
                    <h3 className="text-base font-bold">Quality Consistency</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Same crews, same standards, same quality control processes across all projects.
                  </p>
                </UnifiedCard>

                <UnifiedCard variant="elevated" className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <Clock className="w-5 h-5 text-primary" />
                    <h3 className="text-base font-bold">Schedule Reliability</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Direct control eliminates subcontractor scheduling conflicts and availability issues.
                  </p>
                </UnifiedCard>

                <UnifiedCard variant="elevated" className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <CheckCircle2 className="w-5 h-5 text-primary" />
                    <h3 className="text-base font-bold">Warranty Confidence</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    We stand behind our work with comprehensive warranties and responsive service.
                  </p>
                </UnifiedCard>
              </div>
            </div>
          </div>
        </section>

        {/* Selected Case Studies */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-foreground mb-4">Envelope Project Showcase</h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                Recent envelope projects demonstrating our technical capabilities and quality standards.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {caseStudies.map((project, index) => (
                <UnifiedCard key={index} variant="interactive" className="p-6">
                  <h3 className="text-lg font-bold mb-3">{project.title}</h3>
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
                <Link to="/projects">View All Envelope Projects</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* City-Specific SEO Section */}
        <ServiceCitySection
          serviceName="Building Envelope Services"
          serviceSlug="building-envelope"
          recentProjects={[
            {
              title: "25-Story Residential Tower Envelope Restoration",
              location: "Downtown Toronto",
              description: "Complete EIFS replacement, window upgrades, and balcony waterproofing for high-rise condo tower with occupied building logistics."
            },
            {
              title: "Commercial Office LEED Retrofit",
              location: "Mississauga City Centre",
              description: "Metal panel rainscreen system with continuous insulation achieving LEED Silver thermal performance targets for 60,000 sq ft office building."
            },
            {
              title: "Heritage Masonry Restoration",
              location: "Old City Hall District, Toronto",
              description: "Sympathetic masonry restoration with modern air barrier integration and concealed structural reinforcement for 85,000 sq ft institutional building."
            }
          ]}
          faqs={[
            {
              question: "How much does building envelope restoration cost in Toronto?",
              answer: "Building envelope restoration costs in Toronto typically range from $40-$120 per square foot depending on system type, building height, and access requirements. EIFS replacement averages $65-$90/sq ft, while masonry restoration ranges from $80-$150/sq ft. We provide detailed cost breakdowns during preconstruction."
            },
            {
              question: "Can you upgrade the building envelope on an occupied building?",
              answer: "Yes, we specialize in occupied building envelope projects throughout the GTA. Our phased approach maintains tenant access while installing swing stages, protection systems, and noise mitigation measures. Most projects are completed with minimal disruption to building operations."
            },
            {
              question: "What's the typical timeline for envelope restoration in Ontario?",
              answer: "Building envelope projects in Ontario typically take 12-24 months depending on building size and scope. Weather windows affect scheduling—exterior work is optimal April-November. We provide detailed phasing plans that account for Ontario's climate conditions."
            }
          ]}
        />

        {/* CTA Band */}
        <section className="py-16 bg-primary text-primary-foreground">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Upgrade Your Building Envelope?</h2>
            <p className="text-lg text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
              Request a comprehensive envelope assessment and let's discuss solutions for your building.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button asChild size="lg" variant="secondary">
                <Link to="/contact">
                  Request Assessment
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
                <Link to="/about">Talk to an Envelope Specialist</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default BuildingEnvelope;
