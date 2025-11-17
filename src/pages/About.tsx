import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { UnifiedCard } from "@/components/shared/UnifiedCard";
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
            <UnifiedCard variant="elevated" className="mt-12 border-l-4 border-primary">
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
                <p className="text-sm text-muted-foreground">Founder & Principal, Ascent Group Construction</p>
                <p className="text-xs text-muted-foreground mt-1">Construction Engineering Technician | 15+ Years Industry Experience</p>
              </div>
            </div>
          </UnifiedCard>
          </ScrollReveal>
        </ParallaxSection>
      </Section>

      {/* Who We Serve */}
      <Section size="major" className="bg-muted/30">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Who We Serve</h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Trusted partners across Ontario's construction ecosystem
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {clientTypes.map((client, index) => {
            const IconComponent = client.icon;
            return (
              <ScrollReveal key={index} direction="up" delay={index * 100}>
                <UnifiedCard variant="interactive" className="hover:shadow-xl transition-all duration-300">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="p-3 bg-primary/10 rounded-lg">
                      <IconComponent className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-xl md:text-2xl font-semibold">{client.title}</h3>
                        <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
                          client.priority === 'Primary' ? 'bg-primary/20 text-primary' :
                          client.priority === 'Secondary' ? 'bg-secondary/20 text-secondary-foreground' :
                          'bg-muted text-muted-foreground'
                        }`}>
                          {client.priority}
                        </span>
                      </div>
                      <p className="text-muted-foreground">{client.description}</p>
                    </div>
                  </div>
                </UnifiedCard>
              </ScrollReveal>
            );
          })}
        </div>
      </Section>

      {/* What We Self-Perform */}
      <Section size="major">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">What We Self-Perform</h2>
          <p className="text-lg md:text-xl text-muted-foreground">
            Each scope is planned for minimal disruption, clear sequencing, and documented QA/QC
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {services.map((service, index) => (
            <UnifiedCard key={index} variant="base" className="hover:border-primary/50 transition-colors">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                <span className="text-base md:text-lg font-medium">{service}</span>
              </div>
            </UnifiedCard>
          ))}
        </div>

        <p className="text-center text-muted-foreground mt-8 max-w-2xl mx-auto">
          Each scope is planned for minimal disruption, clear sequencing, and documented QA/QC so owners 
          and consultants have complete confidence in what was performed and why.
        </p>
      </Section>

      {/* Our Values */}
      <Section size="major" className="bg-muted/30">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Values</h2>
          <p className="text-lg md:text-xl text-muted-foreground">
            The principles that guide every project we undertake
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {values.map((value, index) => {
            const IconComponent = value.icon;
            return (
              <UnifiedCard key={index} variant="elevated" className="text-center">
                <div className="inline-flex p-4 bg-primary/10 rounded-full mb-6">
                  <IconComponent className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl md:text-2xl font-semibold mb-3">{value.title}</h3>
                <p className="text-muted-foreground">{value.description}</p>
              </UnifiedCard>
            );
          })}
        </div>
      </Section>

      {/* Our 5-Step Approach */}
      <Section size="major">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Our 5-Step Approach</h2>
          <p className="text-lg md:text-xl text-muted-foreground">
            A proven process for reliable project delivery
          </p>
        </div>

        <div className="space-y-6 max-w-5xl mx-auto">
          {processSteps.map((step, index) => (
            <UnifiedCard key={index} variant="elevated" className="hover:border-primary/50 transition-colors">
              <div className="flex gap-6">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-2xl font-bold text-primary">{step.number}</span>
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl md:text-2xl font-semibold mb-3">{step.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            </UnifiedCard>
          ))}
        </div>
      </Section>

      {/* Safety, Insurance & Compliance */}
      <Section size="major" maxWidth="narrow" className="bg-muted/30">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Safety, Insurance & Compliance</h2>
          <p className="text-lg md:text-xl text-muted-foreground">
            Your protection is our priority
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <UnifiedCard variant="base">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
              <span>WSIB compliance and safety training (e.g., Working at Heights/WHMIS)</span>
            </div>
          </UnifiedCard>
          <UnifiedCard variant="base">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
              <span>Commercial General Liability (CGL) coverage; certificates available on request</span>
            </div>
          </UnifiedCard>
          <UnifiedCard variant="base">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
              <span>Bonding/Pre-qualification support available on request (project-dependent)</span>
            </div>
          </UnifiedCard>
          <UnifiedCard variant="base">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
              <span>Job-specific Safety Plans, toolbox talks, and secure site practices</span>
            </div>
          </UnifiedCard>
        </div>
      </Section>

      {/* Where We Work */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <MapPin className="w-16 h-16 text-primary mx-auto mb-6" />
            <h2 className="text-4xl font-bold mb-6">Where We Work</h2>
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
        <UnifiedCard variant="elevated" className="border-2 border-primary/20 text-center">
          <TrendingUp className="w-16 h-16 text-primary mx-auto mb-6" />
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Our Vision: From Specialist to General Contractor</h2>
          <div className="text-left space-y-4">
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
              <strong className="text-foreground">Today (Year 1):</strong> We're establishing ourselves as a reliable 
              specialty contractor for building envelope and restoration work. We're earning trust through quality 
              execution, clear communication, and safety-first practices.
            </p>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
              <strong className="text-foreground">Years 2-3:</strong> Expand our capabilities as a lead contractor, 
              taking full project responsibility for larger envelope programs while building relationships with key 
              property managers, developers, and consultants across Ontario.
            </p>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
              <strong className="text-foreground">Years 4-5:</strong> Transition into a full-service general contractor, 
              managing multiple trades and larger projects—while maintaining the specialty envelope expertise and service 
              standards that define Ascent Group Construction.
            </p>
            <p className="text-base md:text-lg text-primary font-semibold mt-6 text-center">
              We're not rushing the process. We're building the right foundation—one project, one relationship, 
              one reputation at a time.
            </p>
          </div>
        </UnifiedCard>
      </Section>

      {/* Ready to Work Together */}
      <Section size="major" maxWidth="narrow" className="bg-muted/30">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Work Together?</h2>
          <p className="text-lg md:text-xl text-muted-foreground">
            Let's discuss your project and how we can help
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <UnifiedCard variant="interactive" className="text-center">
            <div className="inline-flex p-4 bg-primary/10 rounded-full mb-4">
              <Phone className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl md:text-2xl font-semibold mb-3">Book a Site Walk</h3>
            <p className="text-muted-foreground mb-6">48–72h target for urgent matters</p>
            <Button asChild className="w-full">
              <Link to="/contact">Schedule Visit</Link>
            </Button>
          </UnifiedCard>

          <UnifiedCard variant="interactive" className="text-center">
            <div className="inline-flex p-4 bg-primary/10 rounded-full mb-4">
              <FileText className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl md:text-2xl font-semibold mb-3">Request a Quote</h3>
            <p className="text-muted-foreground mb-6">Detailed project estimates</p>
            <Button asChild variant="secondary" className="w-full">
              <Link to="/estimate">{CTA_TEXT.project}</Link>
            </Button>
          </UnifiedCard>

          <UnifiedCard variant="interactive" className="text-center">
            <div className="inline-flex p-4 bg-primary/10 rounded-full mb-4">
              <Mail className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl md:text-2xl font-semibold mb-3">For GCs</h3>
            <p className="text-muted-foreground mb-6">Trade packages & pre-qual docs</p>
            <Button asChild variant="outline" className="w-full">
              <Link to="/contact">Partner With Us</Link>
            </Button>
          </UnifiedCard>
        </div>
      </Section>

      <Footer />
    </div>
  );
};

export default About;
