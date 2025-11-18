import SEO from "@/components/SEO";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import PageHeader from "@/components/PageHeader";
import { Card } from "@/design-system/components/Card";
import { Section } from "@/components/sections/Section";
import { Button } from "@/ui/Button";
import { CTA_TEXT } from "@/design-system/constants";
import { CheckCircle, Clock, Shield, FileText, Users, Wrench, Download, Mail, Phone } from "lucide-react";
import { Link } from "react-router-dom";
import { ScrollReveal } from "@/components/animations/ScrollReveal";
import heroImage from "@/assets/heroes/hero-construction-management.jpg";

const ForGeneralContractors = () => {
  const tradePackages = [
    "Façade remediation and cladding repairs",
    "EIFS / stucco installation and repair",
    "Sealant (caulking) replacement programs",
    "Masonry restoration and tuckpointing",
    "Balcony waterproofing systems",
    "Protective coatings (interior/exterior)",
    "Commercial and residential painting",
    "Tile and flooring installation",
    "Interior finishing and buildouts",
  ];

  const whyWorkWithUs = [
    {
      icon: Clock,
      title: "Responsive Quote Turnaround",
      description: "Competitive bids and unit pricing for active tenders—building our reputation on professionalism",
    },
    {
      icon: Users,
      title: "Self-Performed Work",
      description: "85% of work done by our 10-person crew—minimal sub-tiers, direct accountability",
    },
    {
      icon: Shield,
      title: "Safety & Compliance",
      description: "Active WSIB registration, comprehensive site safety protocols, and proper insurance coverage",
    },
    {
      icon: FileText,
      title: "Clear Communication",
      description: "Dedicated project lead, progress reporting, and prompt RFI responses",
    },
    {
      icon: CheckCircle,
      title: "Professional Documentation",
      description: "Complete closeout packages with product data sheets and warranty information",
    },
    {
      icon: Wrench,
      title: "Trade Specialization",
      description: "Focused on envelope and interior trades we execute well—no scope creep",
    },
  ];

  const processSteps = [
    {
      number: "1",
      title: "Tender Review",
      description: "We review your bid package and clarify scope, exclusions, and site requirements",
    },
    {
      number: "2",
      title: "Unit Rate Submission",
      description: "Competitive pricing broken down by trade and activity with clear assumptions",
    },
    {
      number: "3",
      title: "Award & Mobilization",
      description: "Coordinate with your site superintendent for access, safety, and schedule alignment",
    },
    {
      number: "4",
      title: "Execution",
      description: "Daily reporting, photo documentation, and material compliance verification",
    },
    {
      number: "5",
      title: "Closeout",
      description: "Final walkthrough, warranty paperwork, and material certifications delivered",
    },
  ];

  return (
    <>
      <SEO 
        title="Trade Partner for General Contractors"
        description="Ascent Group provides building envelope and interior trade services as a reliable subcontractor partner for general contractors across Ontario. Fast quotes, self-performed work, and professional execution."
        keywords="general contractor partner, trade subcontractor, envelope trades, GTA subcontractor, unit pricing, tender packages"
      />
      <Navigation />
      
      <PageHeader
        title="Reliable Trade Partner for General Contractors"
        description="Subcontractor services for building envelope and interior trades. Self-performed work, fast quotes, professional execution. Serving GCs across commercial, multi-family, and institutional projects."
        backgroundImage={heroImage}
        cta={{ label: CTA_TEXT.gc, href: "#contact" }}
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "For General Contractors" }
        ]}
      />
      
      <main className="min-h-screen bg-background">

        {/* Trade Packages Section */}
        <Section size="major" className="scroll-mt-20" data-section="trade-packages">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Trade Packages We Execute
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground">
              Specialized envelope and interior trades for commercial, multi-family, and institutional projects
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
            {tradePackages.map((pkg, index) => (
              <Card key={index} variant="default" size="sm" className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <span>{pkg}</span>
              </Card>
            ))}
          </div>

          <div className="mt-8 p-6 bg-muted/50 rounded-lg max-w-3xl mx-auto text-center">
            <p className="text-sm text-muted-foreground mb-2">
              <strong className="text-foreground">Typical Project Scope:</strong>
            </p>
            <p className="text-muted-foreground">
              Trade package values: $25k - $75k+ | Mid-rise to high-rise projects (5-30 storeys) | New construction and occupied building restoration
            </p>
          </div>
        </Section>

        {/* Why Work With Us */}
        <Section size="major" className="bg-muted/30">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Why GCs Work With Us
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground">
              Professional execution, clear communication, and reliable trade-level expertise
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {whyWorkWithUs.map((item, index) => (
              <Card key={index} variant="elevated" size="md" hover>
                <item.icon className="w-8 h-8 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-muted-foreground">{item.description}</p>
              </Card>
            ))}
          </div>
        </Section>

        {/* Our Process */}
        <Section size="major">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Our Process for GC Partners
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground">
              From tender review to project closeout—clear steps for seamless collaboration
            </p>
          </div>

          <div className="max-w-4xl mx-auto space-y-6">
            {processSteps.map((step, index) => (
              <ScrollReveal key={index} direction="left" delay={index * 100}>
                <Card variant="elevated" size="md" hover className="flex gap-6 items-start">
                  <div className="p-3 bg-primary/10 rounded-lg flex-shrink-0">
                    <span className="text-2xl font-bold text-primary">{step.number}</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                    <p className="text-muted-foreground">{step.description}</p>
                  </div>
                </Card>
              </ScrollReveal>
            ))}
          </div>
        </Section>

        {/* We're Building Our Track Record Section */}
        <Section size="major" className="bg-primary/5">
          <Card variant="elevated" size="lg" className="border-l-4 border-l-primary max-w-4xl mx-auto">
            <h3 className="text-2xl md:text-3xl font-semibold mb-4">We're Building Our Track Record</h3>
            <p className="text-lg text-muted-foreground mb-6">
              As a newly incorporated company, we understand GCs need proven reliability. Here's what we bring:
            </p>
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                <div>
                  <strong className="text-foreground">15+ years team experience</strong>
                  <p className="text-sm text-muted-foreground">from major GTA commercial projects</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                <div>
                  <strong className="text-foreground">Registered on bidding platforms</strong>
                  <p className="text-sm text-muted-foreground">DataBid, ConstructConnect</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                <div>
                  <strong className="text-foreground">WSIB compliant</strong>
                  <p className="text-sm text-muted-foreground">with comprehensive site safety protocols</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                <div>
                  <strong className="text-foreground">$5M liability coverage</strong>
                  <p className="text-sm text-muted-foreground">and bonding available</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                <div>
                  <strong className="text-foreground">Client references available</strong>
                  <p className="text-sm text-muted-foreground">upon request</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                <div>
                  <strong className="text-foreground">Competitive pricing</strong>
                  <p className="text-sm text-muted-foreground">with transparent unit rates</p>
                </div>
              </div>
            </div>
            <p className="text-muted-foreground italic">
              We know we need to earn your trust through professional execution, responsive communication, and quality work. Every project is an opportunity to prove we're the trade partner you can rely on.
            </p>
          </Card>
        </Section>

        {/* Building Credentials Section */}
        <Section size="major" maxWidth="narrow" className="bg-muted/30">
          <Card variant="elevated" size="lg" className="border-l-4 border-l-primary">
            <h3 className="text-2xl font-semibold mb-4 flex items-center gap-3">
              <Download className="w-6 h-6 text-primary" />
              Prequalification Documents
            </h3>
            <p className="text-muted-foreground mb-6">
              Download our complete prequalification package including:
            </p>
            <ul className="space-y-2 mb-6">
              <li className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <span>Company profile and project experience</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <span>WSIB clearance certificate</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <span>Insurance certificates ($5M general liability)</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <span>Safety certifications and COR training records</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <span>Sample project references and past performance</span>
              </li>
            </ul>
            <Button asChild size="lg">
              <Link to="/resources/contractor-portal">Access Documents</Link>
            </Button>
          </Card>
        </Section>

        {/* Contact Section */}
        <Section size="major" maxWidth="narrow" className="scroll-mt-20" data-section="contact">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Get Started
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground mb-8">
              Add us to your bidders list or request unit pricing on active tenders
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <Card variant="interactive" hover size="md" className="text-center">
              <Phone className="w-8 h-8 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Call Us</h3>
              <a href="tel:+14373290029" className="text-primary hover:underline">
                +1 (437) 329-0029
              </a>
            </Card>

            <Card variant="interactive" hover size="md" className="text-center">
              <FileText className="w-8 h-8 text-primary mx-auto mb-4" />
              <h3 className="text-xl md:text-2xl font-semibold mb-2">Request Unit Pricing</h3>
              <p className="text-muted-foreground mb-4 text-sm">
                Send us your tender package for competitive pricing
              </p>
              <Button asChild className="w-full">
                <Link to="/contact">Submit Tender Request</Link>
              </Button>
            </Card>
          </div>

          <div className="p-6 bg-muted/50 rounded-lg">
            <p className="text-sm font-semibold mb-2">Contact for Tendering:</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center text-muted-foreground">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <a href="mailto:projects@ascentgroupconstruction.com" className="hover:text-primary transition-colors">
                  projects@ascentgroupconstruction.com
                </a>
              </div>
              <div className="hidden sm:block text-muted-foreground/50">|</div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                <a href="tel:647-528-6804" className="hover:text-primary transition-colors">
                  647-528-6804
                </a>
              </div>
            </div>
          </div>
        </Section>
      </main>
      <Footer />
    </>
  );
};

export default ForGeneralContractors;
