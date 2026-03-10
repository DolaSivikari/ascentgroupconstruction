import { Building2, Users, Layers, Wrench, ArrowRight, Shield, HardHat, Hammer, CheckCircle, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { PageHero } from "@/components/shared/PageHero";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/design-system/components/Card";
import { Section } from "@/components/sections/Section";
import { ProofStrip } from "@/design-system/components/ProofStrip";
import { CTABand } from "@/design-system/components/CTABand";
import { Button } from "@/ui/Button";
import SEO from "@/components/SEO";
import { TYPOGRAPHY_STYLES } from "@/design-system/constants";
import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { companyHeroes } from "@/data/hero-images";
import { PartnershipModelsSection } from "@/components/partnerships/PartnershipModelsSection";

const Capabilities = () => {
  const selfPerform = {
    envelope: [
      "EIFS & stucco installation/repair (Dryvit, Parex, Sto certified)",
      "Perimeter sealant replacement (windows, expansion joints, penetrations)",
      "Masonry restoration & tuckpointing (brick, block, stone)",
      "Exterior architectural painting & protective coatings",
      "Balcony waterproofing membrane systems",
    ],
    interior: [
      "Commercial & residential painting (interior/exterior)",
      "High-performance coatings (epoxy, urethane, anti-graffiti)",
      "Tile & resilient flooring installation",
      "Interior drywall finishing & buildouts",
      "Parking garage restoration (coating, marking, repairs)",
    ],
  };

  const deliveryMethods = [
    {
      title: "Self-Performed Specialty Work",
      description: "Direct execution with our own trained crews",
      icon: Wrench,
      details: [
        "EIFS, stucco, sealant, masonry, painting—all direct execution",
        "Minimal sub-tier layers = direct accountability",
        "No subcontractor markup on self-performed scope",
        "Same crew start-to-finish for consistency",
      ],
    },
    {
      title: "Pre-Construction Consultation",
      description: "Practical input during planning for envelope scope",
      icon: Users,
      details: [
        "Field-tested recommendations for EIFS and cladding approaches",
        "Realistic cost guidance based on actual project experience",
        "Material selection support (Dryvit, Parex, Sto)",
        "Constructability insights for your envelope consultant",
      ],
    },
    {
      title: "Envelope + Interior Trade Packaging",
      description: "Bundle related scopes under one specialty contractor",
      icon: Layers,
      details: [
        "Typical package: Façade restoration + protective coatings + painting",
        "Unified schedule for envelope remediation and interior finishes",
        "Single point of contact for related building enclosure work",
        "Reduces coordination burden for envelope-focused projects",
      ],
    },
  ];

  return (
    <div className="min-h-screen">
      <SEO
        title="How We Deliver | Specialty Contracting & Self-Perform Trades"
        description="See how Ascent Group delivers building envelope restoration and interior trades. Self-performed work, partnership models, and project delivery methods across Ontario's GTA."
      />
      <Navigation />

      <PageHero
        title="How Ascent Delivers Projects"
        eyebrow="How We Deliver"
        description="Self-performed specialty work with direct accountability. We adapt our role to your project structure — as prime contractor, trade partner, or consultant-aligned executor."
        image={companyHeroes["capabilities"]}
        imageAlt="Ascent Group crew executing building envelope restoration"
        height="large"
        primaryCta={{ text: "Submit RFP", href: "/submit-rfp" }}
        secondaryCta={{ text: "View Our Work", href: "/projects" }}
        stats={[
          { value: "85%", label: "Self-Performed" },
          { value: "15+", label: "Years Crew Experience" },
          { value: "$2M", label: "CGL Coverage" },
        ]}
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Capabilities" },
        ]}
        badges={[
          { icon: Hammer, text: "85% Self-Performed" },
          { icon: CheckCircle, text: "Direct Accountability" },
          { icon: Zap, text: "Flexible Delivery" },
        ]}
      />

      <main>
        {/* Partnership Models */}
        <Section size="major">
          <PartnershipModelsSection />
          <div className="mt-8 text-center">
            <Button variant="outline" asChild>
              <Link to="/for-general-contractors">
                For General Contractors
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
          </div>
        </Section>

        {/* Self-Perform Capabilities */}
        <Section size="major" className="bg-muted/30">
          <h2 className={`${TYPOGRAPHY_STYLES.sectionTitle} mb-4`}>
            Self-Perform Capabilities
          </h2>
          <div className="mb-8 max-w-3xl">
            <p className="text-muted-foreground">
              Our crew directly executes the majority of project scope — EIFS, masonry,
              sealant, painting, and coatings. We sub-trade only specialized equipment
              work (e.g., swing-stage rigging) and maintain direct oversight of all
              activities.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Complete Exterior Envelope</CardTitle>
                <CardDescription>
                  Full building envelope systems and restoration
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {selfPerform.envelope.map((item, i) => (
                    <li
                      key={i}
                      className="text-muted-foreground flex items-start gap-2"
                    >
                      <span className="text-primary mt-1">•</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Interior & Specialty</CardTitle>
                <CardDescription>
                  Commercial interior construction and coatings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {selfPerform.interior.map((item, i) => (
                    <li
                      key={i}
                      className="text-muted-foreground flex items-start gap-2"
                    >
                      <span className="text-primary mt-1">•</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          <div className="mt-8 flex flex-wrap gap-4">
            <Button variant="outline" asChild>
              <Link to="/projects">
                See Related Projects
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link to="/our-process">
                View Our Process
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
          </div>
        </Section>

        {/* Project Delivery Methods */}
        <Section size="major">
          <h2 className={`${TYPOGRAPHY_STYLES.sectionTitle} mb-8`}>
            Project Delivery Methods
          </h2>
          <ScrollReveal direction="up">
            <div className="grid md:grid-cols-3 gap-6">
              {deliveryMethods.map((method, index) => {
                const Icon = method.icon;
                return (
                  <Card
                    key={index}
                    className="hover:shadow-lg transition-shadow"
                  >
                    <CardHeader>
                      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>
                      <CardTitle>{method.title}</CardTitle>
                      <CardDescription>{method.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {method.details.map((detail, i) => (
                          <li
                            key={i}
                            className="text-sm text-muted-foreground flex items-start gap-2"
                          >
                            <span className="text-primary mt-1">•</span>
                            {detail}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </ScrollReveal>
        </Section>

        {/* Project Size & Capacity */}
        <Section size="major" className="bg-muted/30">
          <h2 className={`${TYPOGRAPHY_STYLES.sectionTitle} mb-8`}>
            Project Size & Capacity
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <Building2 className="h-8 w-8 text-primary mb-2" />
                <CardTitle>Current Project Range</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-primary mb-2">
                  $25K – $500K
                </p>
                <p className="text-sm text-muted-foreground">
                  Emergency repairs to multi-phase restoration programs
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <HardHat className="h-8 w-8 text-primary mb-2" />
                <CardTitle>Team Experience</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-primary mb-2">
                  15+ Years Combined
                </p>
                <p className="text-sm text-muted-foreground">
                  Prior roles on major GTA developments and restoration projects
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <Shield className="h-8 w-8 text-primary mb-2" />
                <CardTitle>Financial Strength</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-primary mb-2">$2M CGL</p>
                <p className="text-sm text-muted-foreground">
                  WSIB compliant with growing bonding capacity
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="mt-8">
            <Button variant="outline" asChild>
              <Link to="/prequalification">
                View Pre-Qualification Package
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
          </div>
        </Section>

        {/* Proof Strip */}
        <Section size="tight">
          <ProofStrip
            items={[
              { value: "WSIB", label: "Active Clearance" },
              { value: "$2M", label: "CGL Coverage" },
              { value: "85%", label: "Self-Performed" },
              { value: "15+", label: "Years Experience" },
            ]}
            variant="dark"
            columns={4}
          />
        </Section>

        {/* CTA Band */}
        <CTABand
          title="Ready to Partner?"
          description="Whether you need a prime contractor for envelope scope or a trade partner for your next project, let's discuss how we can deliver."
          primaryCta={{ text: "Submit RFP", href: "/submit-rfp" }}
          secondaryCta={{ text: "Contact Us", href: "/contact" }}
        />
      </main>

      <Footer />
    </div>
  );
};

export default Capabilities;
