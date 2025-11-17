import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { Card, CardContent } from "@/design-system/components/Card";
import { Section } from "@/components/sections/Section";
import PageHeader from "@/components/PageHeader";
import { Button } from "@/ui/Button";
import { CTA_TEXT } from "@/design-system/constants";
import { 
  Building2, 
  Shield, 
  Target, 
  CheckCircle, 
  MapPin, 
  TrendingUp,
  Phone,
  Mail,
  FileText,
  Award,
  HardHat,
  Home,
  Factory
} from "lucide-react";
import { Link } from "react-router-dom";
import { ScrollReveal } from "@/components/animations/ScrollReveal";
import heroImage from "@/assets/heroes/hero-about-company.jpg";
import { usePageAnalytics } from "@/hooks/usePageAnalytics";
import { ParallaxSection } from "@/components/animations/ParallaxSection";
import { StaggerContainer } from "@/components/animations/StaggerContainer";
import { UnifiedPageHero } from "@/components/sections/UnifiedPageHero";

const About = () => {
  // Analytics tracking
  usePageAnalytics('about');

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
      description: "Emergency and maintenance requests only.",
      priority: "Limited"
    }
  ];

  return (
    <div className="min-h-screen">
      <SEO 
        title="About Us - Ontario's Building Envelope & Restoration Specialist"
        description="Ascent Group Construction delivers accountable, prime-scope execution for building envelope and exterior restoration projects. Learn about our approach, values, and vision."
        keywords="about Ascent Group, building envelope contractor, specialty contractor Ontario, restoration company, GTA contractor"
      />
      <Navigation />
      
      <ParallaxSection speed="slow">
        <PageHeader
          title="Building Envelope & Restoration Specialists"
          description="An emerging specialty contractor delivering reliable envelope solutions across Ontario's GTA—building trust, project by project."
          backgroundImage={heroImage}
          cta={{ label: CTA_TEXT.contact, href: "/contact" }}
          breadcrumbs={[
            { label: "Home", href: "/" },
            { label: "About Us" }
          ]}
        />
      </ParallaxSection>

      {/* Main Introduction */}
      <Section size="major" maxWidth="narrow">
        <ScrollReveal direction="left" delay={100}>
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
        </ScrollReveal>

        {/* Founder Story with parallax */}
        <ParallaxSection speed="medium">
          <ScrollReveal direction="right" delay={150}>
            <Card variant="elevated" size="lg" className="mt-12 border-l-4 border-primary">
            <h3 className="text-2xl md:text-3xl font-semibold mb-4">The Ascent Story</h3>
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed mb-6">
              I founded Ascent Group Construction in 2025 after spending 15+ years working in Ontario's construction industry. 
              I started by studying Construction Engineering Technology, then worked my way through the field—first as a Site 
              Coordinator with Madison Group and Aspenridge Homes on highrise residential projects, then as a trade subcontractor 
              handling envelope and interior work on various commercial and multi-family properties.
            </p>
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed mb-6">
              Through those years, I learned what property managers and general contractors actually need from trade partners: 
              fast turnaround on quotes, reliable execution, clear communication, and professional documentation. I also saw too 
              many contractors overpromising and underdelivering—damaging relationships and leaving clients frustrated.
            </p>
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed mb-6">
              That's why I started Ascent Group—to build a specialty contractor that delivers on promises. We're currently 
              actively working toward full WSIB clearance, COR certification, and bonding capacity.
            </p>
            <blockquote className="text-xl italic mb-4 border-l-2 border-primary/50 pl-6">
              "We're building Ascent Group the right way—professional systems, quality execution, and honest positioning. 
              Every project we complete moves us closer to becoming a full general contractor, but we're not there yet. 
              Right now, we're focused on being the most reliable envelope and interior trade specialist in the GTA."
            </blockquote>
            <div className="flex items-center gap-4 mt-6">
              <div>
                <p className="font-semibold text-primary text-lg">Hebun Isik</p>
                <p className="text-muted-foreground">Founder & Principal</p>
              </div>
            </div>
          </Card>
          </ScrollReveal>
        </ParallaxSection>
      </Section>

      {/* Who We Serve */}
      <Section size="major" className="bg-muted/30">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight">Who We Serve</h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Trusted partners across Ontario's construction ecosystem
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {clientTypes.map((client, index) => {
            const IconComponent = client.icon;
            return (
              <ScrollReveal key={index} direction="up" delay={index * 100}>
                <Card variant="interactive" hover size="md">
                  <IconComponent className="w-12 h-12 text-primary mb-4" />
                  <h3 className="text-2xl font-semibold mb-3">{client.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{client.description}</p>
                </Card>
              </ScrollReveal>
            );
          })}
        </div>
      </Section>

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
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <MapPin className="w-16 h-16 text-primary mx-auto mb-6" />
            <h2 className="text-3xl md:text-5xl font-bold mb-6 tracking-tight">Where We Work</h2>
            <p className="text-xl text-muted-foreground leading-relaxed">
              We serve <strong>Ontario & the Greater Toronto Area</strong>, with emphasis on the GTA and 
              Golden Horseshoe: Toronto, Mississauga, Brampton, Vaughan/Markham, Oakville/Burlington, 
              and Hamilton. We consider broader Ontario for the right project.
            </p>
          </div>
        </div>
      </section>

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
