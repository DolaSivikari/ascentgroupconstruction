import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { PageHero } from "@/components/shared/PageHero";
import { Section } from "@/components/sections/Section";
import { SectionHeader } from "@/design-system/components/SectionHeader";
import { CapabilityCard } from "@/design-system/components/CapabilityCard";
import { CTABand } from "@/design-system/components/CTABand";
import { Card } from "@/design-system/components/Card";
import { TrustRibbon } from "@/design-system/components/TrustRibbon";
import { FAQAccordion } from "@/design-system/components/FAQAccordion";
import { RelatedLinksGrid } from "@/design-system/components/RelatedLinksGrid";
import { OperationalProofBar, DEFAULT_PROOF_ITEMS } from "@/components/proof/OperationalProofBar";
import { Building2, TrendingUp, Users, Calendar, ShieldCheck, Timer, CreditCard, FileText, Zap, AlertTriangle, HardHat, Wrench } from "lucide-react";
import { audienceHeroes } from "@/data/hero-images";
import { propertyManagersFaqs } from "@/data/page-faqs";

const PropertyManagers = () => {
  const benefits = [
    {
      icon: CreditCard,
      title: "Capital Planning Support",
      description: "Reserve fund study-aligned envelope repairs with clear documentation and manufacturer warranties"
    },
    {
      icon: Calendar,
      title: "Occupied Building Expertise",
      description: "Phased execution, tenant coordination, and off-hours work to minimize disruption"
    },
    {
      icon: Users,
      title: "Multi-Property Programs",
      description: "Consistent service across your portfolio with dedicated project managers and volume pricing"
    },
    {
      icon: ShieldCheck,
      title: "Full Compliance",
      description: "$2M CGL coverage, active WSIB registration, and comprehensive site safety protocols"
    },
    {
      icon: Timer,
      title: "48-72 Hour Response",
      description: "Emergency site visits for active water intrusion and urgent facade issues"
    }
  ];

  const services = [
    {
      title: "Façade Remediation",
      description: "Cladding repairs, sealant replacement, EIFS/stucco restoration for mid-rise buildings",
      roi: "Stop water intrusion, pass RSF requirements"
    },
    {
      title: "Parking Garage Rehabilitation",
      description: "Concrete restoration, waterproofing, protective coatings, traffic membrane systems",
      roi: "Extend structural life 15-20 years"
    },
    {
      title: "Suite Turnovers",
      description: "3-day turnarounds for 1-2 bedroom units: painting, patching, flooring coordination",
      roi: "Minimize vacancy downtime"
    },
    {
      title: "Common Area Refresh",
      description: "Lobbies, hallways, amenity spaces—commercial-grade finishes on property management timelines",
      roi: "Enhance tenant satisfaction"
    },
    {
      title: "Sealant Maintenance Programs",
      description: "10-12 year replacement cycles for window perimeters, expansion joints, curtain wall systems",
      roi: "Prevent $200K+ emergency repairs"
    },
    {
      title: "Balcony Waterproofing",
      description: "Membrane replacement, tile over concrete, drainage solutions for occupied buildings",
      roi: "Eliminate unit complaints"
    }
  ];

  const processSteps = [
    { step: "1", title: "Site Assessment", desc: "We inspect and provide detailed quote" },
    { step: "2", title: "Scheduling", desc: "Flexible timing around your tenants" },
    { step: "3", title: "Execution", desc: "Professional work with daily updates" },
    { step: "4", title: "Completion", desc: "Final inspection and documentation" }
  ];

  return (
    <div className="min-h-screen">
      <SEO 
        title="Property Management Services - Envelope & Restoration for Multi-Residential"
        description="Façade remediation, parking garage restoration, and unit turnovers for 10-30 story condominiums in Toronto and GTA. Reserve fund study-aligned. WSIB compliant. Fast response for active leaks."
        keywords="property management contractor, condo restoration GTA, facade remediation Toronto, parking garage repair, multi-residential contractor, reserve fund study contractor"
      />
      <Navigation />
      
      <PageHero
        eyebrow="For Property Managers"
        title="Envelope & Restoration Partner for Multi-Residential Properties"
        description="Façade remediation, parking garage repairs, and unit turnovers for 10-30 story condominiums across the GTA. Fast response, clear documentation, reserve fund study-aligned work."
        image={audienceHeroes["property-managers"]}
        imageAlt="Property management construction services"
        primaryCta={{ text: "Contact Us", href: "/contact" }}
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Property Managers" }
        ]}
        badges={[
          { icon: CreditCard, text: "Reserve Fund Aligned" },
          { icon: Zap, text: "Fast Response" },
          { icon: FileText, text: "Clear Documentation" },
        ]}
      />
      
      <TrustRibbon />

      <main>
        {/* Benefits */}
        <Section size="major">
          <SectionHeader
            title="Built for Property Management Success"
            description="We help you maximize value, minimize downtime, and keep tenants happy"
          />
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <CapabilityCard
                key={index}
                icon={benefit.icon}
                title={benefit.title}
                description={benefit.description}
              />
            ))}
          </div>
        </Section>

        {/* Services with ROI */}
        <Section size="major" className="bg-muted/30">
          <SectionHeader
            title="Services That Deliver ROI"
            description="Every service designed to increase property value and tenant satisfaction"
          />
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {services.map((service, index) => (
              <Card key={index} variant="elevated" size="md" className="border-l-4 border-l-primary">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-2xl font-bold text-primary">{service.title}</h3>
                  <TrendingUp className="w-6 h-6 text-muted-foreground flex-shrink-0" />
                </div>
                <p className="text-muted-foreground mb-4">{service.description}</p>
                <div className="inline-block px-4 py-2 bg-muted/50 rounded-lg">
                  <span className="text-sm font-bold text-primary">{service.roi}</span>
                </div>
              </Card>
            ))}
          </div>
        </Section>

        {/* Process */}
        <Section size="major">
          <SectionHeader title="Streamlined Process" />
          <div className="grid md:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {processSteps.map((item, index) => (
              <Card key={index} variant="elevated" size="md" className="text-center">
                <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                  {item.step}
                </div>
                <h3 className="font-bold mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </Card>
            ))}
          </div>
        </Section>

        {/* Operational Proof */}
        <OperationalProofBar
          items={[
            DEFAULT_PROOF_ITEMS[2], // Occupied-Building Experience
            DEFAULT_PROOF_ITEMS[4], // Documentation & Closeout
            DEFAULT_PROOF_ITEMS[3], // Schedule Coordination
            DEFAULT_PROOF_ITEMS[1], // WSIB & CGL
          ]}
          title="Why Property Managers Trust Us"
          description="Operational capabilities built around occupied-building requirements"
        />

        {/* CTA */}
        <CTABand
          title="Let's Discuss Your Property Needs"
          description="Volume pricing available for multi-unit properties and ongoing maintenance contracts"
          primaryCta={{ text: "Contact Us", href: "/contact" }}
          secondaryCta={{ text: "Request a Proposal", href: "/contact" }}
          variant="dark"
        />
      </main>
      
      <Footer />
    </div>
  );
};

export default PropertyManagers;
