import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { PageHero } from "@/components/shared/PageHero";
import { Section } from "@/components/sections/Section";
import { SectionHeader } from "@/design-system/components/SectionHeader";
import { CapabilityCard } from "@/design-system/components/CapabilityCard";
import { CTABand } from "@/design-system/components/CTABand";
import { Card } from "@/design-system/components/Card";
import { OperationalProofBar, DEFAULT_PROOF_ITEMS } from "@/components/proof/OperationalProofBar";
import { Timer, ShieldCheck, Users, Moon, CheckCircle, Building2, Zap, ClipboardCheck, FileText, Wrench, FolderCheck } from "lucide-react";
import { audienceHeroes } from "@/data/hero-images";

const CommercialClients = () => {
  const benefits = [
    {
      icon: Moon,
      title: "After-Hours Work",
      description: "Night and weekend scheduling available to avoid disrupting your business operations"
    },
    {
      icon: Timer,
      title: "Fast-Track Scheduling",
      description: "Accelerated timelines when you need to meet tight deadlines"
    },
    {
      icon: ShieldCheck,
      title: "Fully Insured",
      description: "$2M CGL liability coverage and WSIB compliance—your business is protected"
    },
    {
      icon: Users,
      title: "Minimal Disruption",
      description: "Strategic planning and execution that keeps your business running smoothly"
    },
    {
      icon: Zap,
      title: "Low-VOC Materials",
      description: "Zero-odor, environmentally friendly products safe for occupied spaces"
    }
  ];

  const industries = [
    {
      title: "Office Buildings",
      description: "Professional finishes that create productive, attractive workspaces",
      features: ["After-hours scheduling", "Floor-by-floor coordination", "Common area refresh", "Conference room upgrades"]
    },
    {
      title: "Retail & Hospitality",
      description: "Fast turnarounds that minimize impact on customer-facing operations",
      features: ["Quick rebrands", "Night-shift work", "Storefront painting", "Seasonal updates"]
    },
    {
      title: "Industrial & Warehouses",
      description: "Durable coatings and safety markings for high-traffic environments",
      features: ["Epoxy floor coatings", "Safety line striping", "Machinery areas", "Loading docks"]
    },
    {
      title: "Healthcare & Education",
      description: "Specialized finishes meeting strict regulatory and safety standards",
      features: ["Antimicrobial coatings", "Low-VOC products", "School break scheduling", "Patient area coordination"]
    }
  ];

  const processSteps = [
    {
      icon: ClipboardCheck,
      title: "Site Review & Scope Definition",
      description: "We visit your facility to assess condition, identify priorities, and define scope around your operational schedule"
    },
    {
      icon: FileText,
      title: "Proposal & Scheduling",
      description: "Detailed proposal with phased approach, material specifications, and scheduling options that minimize business disruption"
    },
    {
      icon: Wrench,
      title: "Coordinated Execution",
      description: "After-hours and weekend work where needed. Daily progress updates and direct communication with your facility manager"
    },
    {
      icon: FolderCheck,
      title: "Closeout & Documentation",
      description: "Final walkthrough, deficiency resolution, warranty documentation, and maintenance recommendations"
    }
  ];

  return (
    <div className="min-h-screen">
      <SEO 
        title="Commercial Building Envelope & Restoration Services - Toronto & GTA"
        description="Envelope repairs, waterproofing, and restoration for office buildings, retail properties, and industrial facilities. After-hours scheduling. Minimal disruption. 15+ years of combined team experience in commercial construction."
        keywords="commercial envelope contractor, office building restoration, retail property repairs, industrial waterproofing, commercial facade repair GTA, Toronto commercial contractor"
      />
      <Navigation />
      
      <PageHero
        eyebrow="For Commercial Clients"
        title="Envelope & Restoration for Commercial Properties"
        description="Office buildings, retail strips, industrial properties—façade repairs, waterproofing, and interior finishes. After-hours scheduling available to minimize business disruption."
        image={audienceHeroes["commercial-clients"]}
        imageAlt="Commercial construction services"
        primaryCta={{ text: "Request an Estimate", href: "/estimate" }}
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Commercial Clients" }
        ]}
      />
      
      <main>
        {/* Benefits */}
        <Section size="major">
          <SectionHeader
            title="Why Commercial Clients Choose Ascent"
            description="Envelope and restoration services designed to protect your building investment with minimal business disruption."
          />
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((b, index) => (
              <CapabilityCard
                key={index}
                icon={b.icon}
                title={b.title}
                description={b.description}
              />
            ))}
          </div>
        </Section>

        {/* Industries */}
        <Section size="major" className="bg-muted/30">
          <SectionHeader
            title="Industries We Serve"
            description="Specialized solutions for every commercial sector"
          />
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {industries.map((industry, index) => (
              <Card key={index} variant="elevated" size="lg">
                <div className="flex items-start gap-3 mb-3">
                  <Building2 className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                  <h3 className="text-2xl font-bold text-primary">{industry.title}</h3>
                </div>
                <p className="text-muted-foreground mb-4">{industry.description}</p>
                <ul className="space-y-2">
                  {industry.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            ))}
          </div>
        </Section>

        {/* Process */}
        <Section size="major">
          <SectionHeader
            title="Our Commercial Approach"
            description="A clear process designed around your facility's operational needs"
          />
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {processSteps.map((step, index) => (
              <CapabilityCard
                key={index}
                icon={step.icon}
                title={step.title}
                description={step.description}
              />
            ))}
          </div>
        </Section>

        {/* Operational Proof */}
        <OperationalProofBar
          items={[
            DEFAULT_PROOF_ITEMS[3], // Schedule Coordination
            DEFAULT_PROOF_ITEMS[0], // Self-Performed Scopes
            DEFAULT_PROOF_ITEMS[1], // WSIB & CGL
            DEFAULT_PROOF_ITEMS[4], // Documentation & Closeout
          ]}
          title="Operational Standards"
          description="Built for commercial project requirements"
        />

        {/* CTA */}
        <CTABand
          title="Ready to Elevate Your Facility?"
          description="Get a comprehensive commercial quote with flexible scheduling options"
          primaryCta={{ text: "Request an Estimate", href: "/estimate" }}
          secondaryCta={{ text: "Contact Us", href: "/contact" }}
          variant="dark"
        />
      </main>
      
      <Footer />
    </div>
  );
};

export default CommercialClients;
