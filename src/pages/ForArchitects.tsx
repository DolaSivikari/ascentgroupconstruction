import SEO from "@/components/SEO";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { PageHero } from "@/components/shared/PageHero";
import { Section } from "@/components/sections/Section";
import { SectionHeader } from "@/design-system/components/SectionHeader";
import { CapabilityCard } from "@/design-system/components/CapabilityCard";
import { CTABand } from "@/design-system/components/CTABand";
import { OperationalProofBar, DEFAULT_PROOF_ITEMS } from "@/components/proof/OperationalProofBar";
import { Card } from "@/design-system/components/Card";
import { Button } from "@/ui/Button";
import { CTA_TEXT } from "@/design-system/constants";
import { Link } from "react-router-dom";
import { PhoneLink } from "@/components/shared/PhoneLink";
import {
  Layers,
  FileText,
  CheckCircle,
  Ruler,
  Paintbrush,
  Wrench,
  Shield,
  Building2,
  ClipboardList,
  ArrowRight,
} from "lucide-react";
import { serviceHeroes } from "@/data/hero-images";

const materialSystems = [
  {
    icon: Layers,
    title: "EIFS & Stucco Systems",
    description: "Dryvit, Sto, and Finestone systems. Full installation, remediation, and detail work per manufacturer specs.",
    stat: "15+ years crew experience",
  },
  {
    icon: Building2,
    title: "Masonry & Stone",
    description: "Tuckpointing, brick replacement, lintel repair, stone restoration. CSA-compliant mortar matching and heritage-sensitive techniques.",
  },
  {
    icon: Wrench,
    title: "Cladding & Rainscreen",
    description: "ACM, fiber cement, metal panel, and composite cladding systems. Engineered fastening and drainage cavity detailing.",
  },
  {
    icon: Paintbrush,
    title: "Protective Coatings",
    description: "Benjamin Moore, Sherwin-Williams, and specialty elastomeric systems. Parking deck membranes, traffic coatings, and anti-carbonation treatments.",
  },
  {
    icon: Shield,
    title: "Waterproofing & Sealants",
    description: "Below-grade membranes, traffic deck systems, joint sealant replacement programs. Compatible with all major product lines.",
  },
  {
    icon: Ruler,
    title: "Interior Finishing",
    description: "Drywall, taping, painting, tile, and flooring. Precision finishing for tenant improvements and suite turnovers.",
  },
];

const collaborationProcess = [
  {
    step: "01",
    title: "Specification Review",
    description: "We review your drawings and specs to confirm scope, identify potential constructability concerns, and flag any product substitution opportunities.",
  },
  {
    step: "02",
    title: "Shop Drawings & Submittals",
    description: "Detailed shop drawings, product data sheets, and material samples prepared to your specification format and review timeline.",
  },
  {
    step: "03",
    title: "Mock-Up & Approval",
    description: "On-site mock-ups for envelope assemblies, coating systems, or finish samples — coordinated with your field review schedule.",
  },
  {
    step: "04",
    title: "Execution & Closeout",
    description: "Self-performed installation by our trained crews. Warranty documentation, as-built records, and maintenance guides at project completion.",
  },
];

const projectTypes = [
  "Façade remediation & restoration",
  "New construction envelope systems",
  "Parking garage membrane replacement",
  "Balcony waterproofing programs",
  "Tenant improvement & suite buildouts",
  "Sealant replacement programs",
  "Heritage & heritage-adjacent restoration",
  "Multi-unit painting & coating programs",
];

const ForArchitects = () => {
  return (
    <div className="min-h-screen">
      <SEO
        title="For Architects & Consultants | Ascent Group Construction"
        description="Partner with a specialty contractor who understands your specifications. EIFS, masonry, cladding, coatings — shop drawings, mock-ups, and submittals aligned to your design intent."
        keywords="specialty contractor for architects, building envelope subcontractor, facade contractor specifications, EIFS installer Ontario, masonry contractor submittals, construction consultant partner GTA"
      />
      <Navigation />

      <PageHero
        eyebrow="For Design Professionals"
        title="Partner With a Contractor Who Understands Your Specs"
        description="We execute envelope and interior scopes to your design intent — with the submittals, mock-ups, and field coordination your projects demand."
        image={serviceHeroes["building-envelope"]}
        imageAlt="Building envelope installation detail"
        height="medium"
        primaryCta={{ text: "Request a Consultation", href: "/contact" }}
        secondaryCta={{ text: "View Capabilities", href: "/capabilities" }}
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "For Architects" },
        ]}
      />

      <OperationalProofBar items={DEFAULT_PROOF_ITEMS} />

      {/* Material Systems Expertise */}
      <Section size="major">
        <SectionHeader
          badge="Material Systems"
          title="Systems We Install & Restore"
          description="Our crews are trained on the product lines you specify — not just generic application. We understand manufacturer details, warranty requirements, and approved substrates."
        />
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {materialSystems.map((system) => (
            <CapabilityCard
              key={system.title}
              icon={system.icon}
              title={system.title}
              description={system.description}
              stat={system.stat}
            />
          ))}
        </div>
      </Section>

      {/* How We Work With Design Teams */}
      <Section size="major" className="bg-muted/30">
        <SectionHeader
          badge="Collaboration"
          title="How We Work With Design Teams"
          description="From spec review to closeout, our process is built around your documentation requirements and review milestones."
        />
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {collaborationProcess.map((item) => (
            <Card key={item.step} variant="elevated" size="md" className="relative">
              <span className="text-4xl font-bold text-primary/15 absolute top-4 right-4">
                {item.step}
              </span>
              <ClipboardList className="w-8 h-8 text-primary mb-3" />
              <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {item.description}
              </p>
            </Card>
          ))}
        </div>
      </Section>

      {/* Typical Project Types */}
      <Section size="major">
        <SectionHeader
          badge="Project Scope"
          title="Typical Project Types"
          description="Scopes we regularly execute for architects, building science consultants, and envelope engineers."
        />
        <div className="max-w-3xl mx-auto">
          <Card variant="elevated" size="lg">
            <div className="grid sm:grid-cols-2 gap-4">
              {projectTypes.map((type) => (
                <div key={type} className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-sm">{type}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </Section>

      {/* Why Specify Ascent */}
      <Section size="major" className="bg-muted/30">
        <SectionHeader
          badge="Why Ascent"
          title="Why Specify Ascent Group"
          description="What sets us apart when you're recommending a trade contractor to your client."
        />
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <Card variant="elevated" size="md" hover>
            <FileText className="w-10 h-10 text-primary mb-4" />
            <h3 className="font-semibold mb-2">85% Self-Performed</h3>
            <p className="text-sm text-muted-foreground">
              Our crews execute the work — no sub-tiers diluting quality or accountability on your project.
            </p>
          </Card>
          <Card variant="elevated" size="md" hover>
            <Shield className="w-10 h-10 text-primary mb-4" />
            <h3 className="font-semibold mb-2">WSIB & $2M CGL</h3>
            <p className="text-sm text-muted-foreground">
              Fully compliant, fully insured. Prequalification package available on request for your client's procurement team.
            </p>
          </Card>
          <Card variant="elevated" size="md" hover>
            <Ruler className="w-10 h-10 text-primary mb-4" />
            <h3 className="font-semibold mb-2">Spec-Aligned Execution</h3>
            <p className="text-sm text-muted-foreground">
              We read your specs before we price. Submittals, mock-ups, and warranty docs delivered to your schedule.
            </p>
          </Card>
        </div>
      </Section>

      {/* Contact CTA */}
      <Section size="major">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Have a Project Coming to Tender?
          </h2>
          <p className="text-lg text-muted-foreground mb-4">
            Send us the scope and we'll provide unit pricing, a capability statement, and references for similar completed work.
          </p>
          <p className="text-muted-foreground mb-8">
            Or call us directly: <PhoneLink className="text-primary font-medium" />
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg">
              <Link to="/contact">
                Request a Consultation
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/prequalification">View Prequalification Package</Link>
            </Button>
          </div>
        </div>
      </Section>

      <Footer />
    </div>
  );
};

export default ForArchitects;
