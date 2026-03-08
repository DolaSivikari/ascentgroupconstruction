import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { Card } from "@/design-system/components/Card";
import { SectionHeader } from "@/design-system/components/SectionHeader";
import { ProofStrip } from "@/design-system/components/ProofStrip";
import { Section } from "@/components/sections/Section";
import { PageHero } from "@/components/shared/PageHero";
import { Button } from "@/ui/Button";
import { CTA_TEXT } from "@/design-system/constants";
import { 
  Building2, 
  Shield, 
  Target, 
  CheckCircle, 
  MapPin, 
  Award,
  HardHat,
  Home,
  Factory,
  FileText
} from "lucide-react";
import { Link } from "react-router-dom";
import { mainPageHeroes } from "@/data/hero-images";
import { usePageAnalytics } from "@/hooks/usePageAnalytics";
import { WhoWeServeCard, WhoWeServeSection } from "@/components/unified";
import { generateBreadcrumbSchema, generateHowToSchema, COMPANY_FACTS } from "@/utils/seo";

const About = () => {
  // Analytics tracking
  usePageAnalytics('about');

  // SEO Structured Data
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "About Us", url: "/about" }
  ]);

  const processSchema = generateHowToSchema({
    name: "Ascent Group Construction 5-Step Project Process",
    description: "Our proven approach to delivering reliable building envelope and restoration projects",
    steps: [
      { name: "Site Walk & Assessment", text: "We meet on site to understand the issue, constraints, and access. For urgent matters, we aim to attend within 48–72 hours." },
      { name: "Scope & Proposal", text: "You receive a clear, itemized scope with drawings/photos as needed, alternates where helpful, and unit rates for repetitive work." },
      { name: "Mobilize & Execute", text: "We coordinate permits, access, logistics, and occupant notices. A dedicated lead oversees daily safety, quality, and schedule." },
      { name: "Quality Assurance & Reporting", text: "Field checks, photo logs, and inspection records ensure work follows specifications and manufacturer guidance." },
      { name: "Closeout & Warranty", text: "Final walkthrough, punch completion, turnover package with photos and product data, and applicable warranty." }
    ]
  });

  const services = [
    "Façade Remediation & Cladding Repairs",
    "Sealant (Caulking) Replacement Programs",
    "Concrete & Parking Garage Repairs",
    "EIFS & Stucco Systems",
    "Masonry Restoration",
    "Waterproofing Systems",
    "Protective & Architectural Coatings"
  ];

  const values = [
    {
      icon: Shield,
      title: "Integrity & Transparency",
      description: "Straight scopes, clear pricing, and proactive communication."
    },
    {
      icon: HardHat,
      title: "Safety First",
      description: "Planning, training, and controls that protect occupants, crews, and property."
    },
    {
      icon: Award,
      title: "Craftsmanship & Compliance",
      description: "Manufacturer-aligned methods and detail-driven execution."
    },
    {
      icon: Target,
      title: "Accountability",
      description: "We own outcomes and close projects with thorough documentation."
    }
  ];

  const processSteps = [
    {
      number: "01",
      title: "Site Walk & Assessment",
      description: "We meet on site to understand the issue, constraints, and access. For urgent matters, we aim to attend within 48–72 hours (subject to safety and access)."
    },
    {
      number: "02",
      title: "Scope & Proposal",
      description: "You receive a clear, itemized scope—drawings/photos as needed, alternates where helpful, and unit rates for repetitive work. We prioritize fast, complete submittals so you can move forward confidently."
    },
    {
      number: "03",
      title: "Mobilize & Execute",
      description: "We coordinate permits, access, logistics, and occupant notices. A dedicated lead oversees daily safety, quality, and schedule."
    },
    {
      number: "04",
      title: "Quality Assurance & Reporting",
      description: "Field checks, photo logs, and (when requested) ITPs/inspection records ensure work follows specifications and manufacturer guidance."
    },
    {
      number: "05",
      title: "Closeout & Warranty",
      description: "Final walkthrough, punch completion, turnover package (photos, product data, care guidance), and applicable warranty."
    }
  ];

  const clientTypes = [
    {
      icon: Building2,
      title: "Property Managers & Building Owners/Developers",
      description: "Condos, multi-residential, commercial, and institutional properties seeking dependable prime execution for envelope and restoration scopes.",
      priority: "Primary"
    },
    {
      icon: FileText,
      title: "Envelope/Building Consultants",
      description: "A responsive specialty partner who follows details and documents work thoroughly.",
      priority: "Primary"
    },
    {
      icon: Factory,
      title: "General Contractors",
      description: "Unit-rate and tender support for envelope trade packages (EIFS/stucco, sealants, coatings, masonry, garage rehab, waterproofing).",
      priority: "Secondary"
    },
    {
      icon: Home,
      title: "Homeowners",
      description: "Residential painting, tile/flooring, stucco repair, basement finishing, and general renovations. Commercial-grade quality for your home.",
      priority: "Growing"
    }
  ];

  return (
    <div className="min-h-screen">
      <SEO 
        title="About Us - Building Envelope & Restoration Services | Ontario & GTA"
        description="Emerging specialty contractor delivering accountable envelope and restoration services across Ontario. Learn about our approach, values, and vision for becoming a trusted GC partner."
        keywords="about Ascent Group, building envelope contractor, specialty contractor Ontario, restoration company, GTA contractor, emerging contractor"
        structuredData={[breadcrumbSchema, processSchema]}
      />
      <Navigation />
      
      <PageHero
        title="Building Envelope & Restoration Specialists"
        description="An emerging specialty contractor delivering reliable envelope solutions across Ontario's GTA—building trust, project by project."
        image={mainPageHeroes.about}
        imageAlt="Ascent Group Construction team at work"
        height="large"
        primaryCta={{ text: CTA_TEXT.contact, href: "/contact" }}
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "About Us" }
        ]}
      />

      {/* Main Introduction */}
      <Section size="major" maxWidth="narrow">
        <div className="prose prose-lg max-w-none">
          <p className="text-lg md:text-xl leading-relaxed mb-6">
            Ascent Group Construction is an emerging specialty contractor focused on building envelope and restoration 
            work across Ontario's Greater Toronto Area. We're in the early stages of building our company—establishing 
            systems, earning trust, and delivering quality work that speaks for itself.
          </p>
          <p className="text-base md:text-lg text-muted-foreground leading-relaxed mb-8">
            Right now, we specialize in façade remediation, sealant replacement, concrete & parking garage repair, 
            EIFS/stucco, masonry restoration, waterproofing, and protective coatings. Our goal is clear: become the 
            most reliable specialty contractor in our market, then expand into full general contracting capabilities 
            over the next 3–5 years. Every project we complete, every relationship we build, and every lesson we 
            learn moves us toward that vision.
          </p>
        </div>

        {/* Founder Story */}
        <Card variant="elevated" size="lg" className="mt-12 border-l-4 border-primary">
          <h3 className="text-2xl md:text-3xl font-semibold mb-4">Proven Expertise. New Name.</h3>
          <p className="text-base md:text-lg text-muted-foreground leading-relaxed mb-6">
            Ascent Group Construction represents over 15 years of combined experience in building envelope and interior trades work across the Greater Toronto Area—formalized under a new company name in 2025.
          </p>
          <p className="text-base md:text-lg text-muted-foreground leading-relaxed mb-6">
            Our team members bring hands-on experience from a wide range of envelope restoration, EIFS installation, masonry repair, waterproofing, and interior finishing projects on buildings ranging from residential walk-ups to 30-story towers. We've worked as trusted trade partners for general contractors, property managers, building consultants, and institutional clients who demand professional execution and reliable results.
          </p>
          <p className="text-base md:text-lg text-muted-foreground leading-relaxed mb-6">
            We founded Ascent Group to bring this proven capability directly to clients who need specialty trade expertise without the complexity of layered subcontracting. Our focus is simple: deliver high-quality envelope and interior work, maintain professional safety and communication standards, and build lasting relationships through accountable performance.
          </p>
          <blockquote className="text-xl italic mb-4 border-l-2 border-primary/50 pl-6">
            "We're building Ascent Group methodically—professional systems, quality execution, and honest client relationships. 
            Our long-term vision is to expand into general contracting capabilities, but right now we're laser-focused on being 
            the most reliable envelope and interior trade specialist in the GTA."
          </blockquote>
          <div className="flex items-center gap-4 mt-6">
            <div>
              <p className="font-semibold text-primary text-lg">Hebun Isik</p>
              <p className="text-muted-foreground">Founder & Principal</p>
            </div>
          </div>
        </Card>
      </Section>

      {/* Who We Serve - Using Unified Components */}
      <WhoWeServeSection
        title="Who We Serve"
        description="Trusted partners across Ontario's construction ecosystem"
        columns={2}
        background="muted"
      >
        {clientTypes.map((client) => (
          <WhoWeServeCard
            key={client.title}
            icon={client.icon}
            title={client.title}
            description={client.description}
            link={`/${client.title.toLowerCase().replace(/\s+/g, '-')}`}
            variant="simple"
          />
        ))}
      </WhoWeServeSection>

      {/* What We Self-Perform */}
      <Section size="major">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight">What We Self-Perform</h2>
          <p className="text-lg md:text-xl text-muted-foreground">
            Each scope is planned for minimal disruption, clear sequencing, and documented QA/QC
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {services.map((service, index) => (
            <Card key={index} variant="default" size="md" className="hover:border-primary/50 transition-colors">
              <CheckCircle className="w-5 h-5 text-primary mb-2" />
              <span className="font-medium">{service}</span>
            </Card>
          ))}
        </div>
      </Section>

      {/* Our 5-Step Approach */}
      <Section size="major">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight">Our 5-Step Approach</h2>
          <p className="text-lg md:text-xl text-muted-foreground">
            A proven process for reliable project delivery
          </p>
        </div>

        <div className="space-y-6 max-w-5xl mx-auto">
          {processSteps.map((step, index) => (
            <Card key={index} variant="elevated" size="md" hover>
              <div className="flex items-start gap-4">
                <div className="p-3 bg-primary/10 rounded-lg flex-shrink-0">
                  <span className="text-2xl font-bold text-primary">{step.number}</span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </Section>

      {/* Where We Work */}
      <Section size="major">
        <div className="max-w-4xl mx-auto text-center">
          <MapPin className="w-16 h-16 text-primary mx-auto mb-6" />
          <h2 className="text-3xl md:text-5xl font-bold mb-6 tracking-tight">Where We Work</h2>
          <p className="text-xl text-muted-foreground leading-relaxed">
            We serve <strong>Ontario & the Greater Toronto Area</strong>, with emphasis on the GTA and 
            Golden Horseshoe: Toronto, Mississauga, Brampton, Vaughan/Markham, Oakville/Burlington, 
            and Hamilton. We consider broader Ontario for the right project.
          </p>
        </div>
      </Section>

      {/* Our Vision */}
      <Section size="major" maxWidth="narrow" className="bg-primary/5">
        <Card variant="elevated" size="lg" className="text-center border-2 border-primary/20">
          <h2 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight">Ready to Discuss Your Project?</h2>
          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Whether you need trade pricing for an active tender or want to discuss a restoration project, 
            we're here to provide professional service and competitive rates.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg">
              <Link to="/contact">{CTA_TEXT.contact}</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/services">View Services</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/projects">View Projects</Link>
            </Button>
          </div>
        </Card>
      </Section>

      <Footer />
    </div>
  );
};

export default About;
