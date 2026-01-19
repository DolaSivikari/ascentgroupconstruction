import SEO from "@/components/SEO";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { PageHero } from "@/components/shared/PageHero";
import { EmailLink } from "@/components/EmailLink";
import { PhoneLink } from "@/components/shared/PhoneLink";
import { Card } from "@/design-system/components/Card";
import { Section } from "@/components/sections/Section";
import { CardGrid } from "@/components/shared/CardGrid";
import { FeatureCard, ProcessStepCard } from "@/components/unified";
import { Button } from "@/ui/Button";
import { CTA_TEXT } from "@/design-system/constants";
import { CheckCircle, Clock, Shield, FileText, Users, Wrench, Download, Mail, Phone } from "lucide-react";
import { Link } from "react-router-dom";
import { audienceHeroes } from "@/data/hero-images";

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
      title: "48-Hour Quote Turnaround",
      description: "Unit pricing for envelope scope on active tenders—typical response within 2 business days for standard packages",
    },
    {
      icon: Users,
      title: "Self-Performed Work (85%)",
      description: "10-person dedicated crew handles EIFS, masonry, sealant, painting—minimal sub-tiers, direct accountability on every project",
    },
    {
      icon: Shield,
      title: "WSIB & $2M CGL Coverage",
      description: "Active WSIB registration since incorporation, comprehensive general liability, verified site safety protocols",
    },
    {
      icon: FileText,
      title: "Daily Progress Reporting",
      description: "Dedicated project lead assigned to every job—daily photo updates, prompt RFI turnaround within 24 hours",
    },
    {
      icon: CheckCircle,
      title: "Manufacturer-Compliant Documentation",
      description: "Complete closeout packages with product data sheets, warranty certificates, and material compliance verification",
    },
    {
      icon: Wrench,
      title: "Envelope & Interior Focus Only",
      description: "We bid what we execute well—no structural, mechanical, or electrical scope creep",
    },
  ];

  const processSteps = [
    {
      step: "1",
      title: "Tender Review & Clarifications",
      description: "We review your bid package, confirm scope boundaries, and submit RFIs for any ambiguities—ensuring accurate pricing without hidden assumptions",
      icon: FileText,
    },
    {
      step: "2",
      title: "Competitive Unit Rate Submission",
      description: "Detailed pricing by trade and activity within 48 hours for standard packages—broken down for transparency and easy comparison",
      icon: CheckCircle,
    },
    {
      step: "3",
      title: "Pre-Start Coordination",
      description: "Upon award, we coordinate directly with your site superintendent for access, safety protocols, material deliveries, and schedule integration",
      icon: Users,
    },
    {
      step: "4",
      title: "Daily Execution & Reporting",
      description: "Dedicated project lead provides daily photo updates, tracks progress against schedule, and responds to RFIs within 24 hours",
      icon: Wrench,
    },
    {
      step: "5",
      title: "Closeout & Documentation",
      description: "Final walkthrough with deficiency list, product data sheets, warranty certificates, and material compliance documentation delivered digitally",
      icon: Shield,
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
      
      <PageHero
        title="Reliable Trade Partner for General Contractors"
        description="Subcontractor services for building envelope and interior trades. Self-performed work, fast quotes, professional execution. Serving GCs across commercial, multi-family, and institutional projects."
        image={audienceHeroes["for-general-contractors"]}
        imageAlt="Construction management for general contractors"
        height="large"
        primaryCta={{ text: CTA_TEXT.gc, href: "#contact" }}
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
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              Why GCs Choose Ascent Group
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              Reliable envelope and interior trades partner—built on professional execution and direct accountability
            </p>
          </div>

          <CardGrid columns={3} stagger="standard">
            {whyWorkWithUs.map((item, index) => (
              <FeatureCard
                key={index}
                icon={item.icon}
                title={item.title}
                description={item.description}
              />
            ))}
          </CardGrid>
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

          <div className="max-w-4xl mx-auto space-y-4">
            {processSteps.map((step, index) => (
              <ProcessStepCard
                key={index}
                step={step.step}
                title={step.title}
                description={step.description}
                icon={step.icon}
              />
            ))}
          </div>
        </Section>

        {/* We're Building Our Track Record Section */}
        <Section size="major" className="bg-primary/5">
          <Card variant="elevated" size="lg" className="border-l-4 border-l-primary max-w-4xl mx-auto">
            <h3 className="text-2xl md:text-3xl font-semibold mb-4">We're Building Our Track Record—Pilot Projects Welcome</h3>
            <p className="text-lg text-muted-foreground mb-6">
              As a newly incorporated company, we understand GCs need proven reliability. We're open to competitive pilot projects to demonstrate our capabilities. Here's what we bring:
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
                  <p className="text-sm text-muted-foreground">DataBid, ConstructConnect, and more</p>
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
                  <strong className="text-foreground">$2M CGL coverage</strong>
                  <p className="text-sm text-muted-foreground">comprehensive liability insurance</p>
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
                  <strong className="text-foreground">Competitive pilot pricing</strong>
                  <p className="text-sm text-muted-foreground">transparent unit rates for first projects</p>
                </div>
              </div>
            </div>
            <p className="text-muted-foreground italic">
              We know we need to earn your trust through professional execution, responsive communication, and quality work. Every project is an opportunity to prove we're the trade partner you can rely on. Let's start with a pilot project—we'll demonstrate our value.
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
                <span>Insurance certificates ($2M CGL coverage)</span>
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
              Start Your Project
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground mb-8">
              Add us to your bidders list or request unit pricing on active tenders
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <Card variant="interactive" hover size="md" className="text-center">
              <Phone className="w-8 h-8 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Call Us</h3>
              <PhoneLink showIcon={false} className="text-primary hover:underline" />
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
                <EmailLink 
                  encoded={btoa('projects@ascentgroupconstruction.com')} 
                  className="hover:text-primary transition-colors inline" 
                  showIcon={false} 
                />
              </div>
              <div className="hidden sm:block text-muted-foreground/50">|</div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                <PhoneLink showIcon={false} className="hover:text-primary transition-colors" />
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
