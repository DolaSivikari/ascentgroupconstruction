import SEO from "@/components/SEO";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { PageHero } from "@/components/shared/PageHero";
import { Section } from "@/components/sections/Section";
import { SectionHeader } from "@/design-system/components/SectionHeader";
import { CapabilityCard } from "@/design-system/components/CapabilityCard";
import { OperationalProofBar, DEFAULT_PROOF_ITEMS } from "@/components/proof/OperationalProofBar";
import { Card } from "@/design-system/components/Card";
import { Button } from "@/ui/Button";
import { Link } from "react-router-dom";
import { PhoneLink } from "@/components/shared/PhoneLink";
import { TrustRibbon } from "@/design-system/components/TrustRibbon";
import { FAQAccordion } from "@/design-system/components/FAQAccordion";
import { RelatedLinksGrid } from "@/design-system/components/RelatedLinksGrid";
import { architectsFaqs } from "@/data/page-faqs";
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
  Thermometer,
  Wind,
  Droplets,
  BookOpen,
  Microscope,
} from "lucide-react";
import { serviceHeroes } from "@/data/hero-images";

const materialSystems = [
  {
    icon: Layers,
    title: "EIFS & Stucco Systems",
    description: "Drainage cavity and barrier EIFS (Dryvit, Sto, Finestone). Continuous insulation achieving effective R-values per ASHRAE 90.1 and OBC SB-10. Proper drainage mat detailing, base coat reinforcement, and moisture management at penetrations and transitions.",
    stat: "15+ years crew experience",
  },
  {
    icon: Building2,
    title: "Masonry & Stone",
    description: "Tuckpointing, brick replacement, lintel repair, and stone restoration. CSA A371-compliant mortar matching for vapor permeability and freeze-thaw resistance. Heritage-sensitive repointing with compatible mortar profiles and aggregate matching.",
  },
  {
    icon: Wrench,
    title: "Cladding & Rainscreen",
    description: "Pressure-equalized rainscreen systems in ACM, fiber cement, metal panel, and composite cladding. Ventilated cavity design with thermal break fasteners to minimize thermal bridging. Engineered attachment through continuous insulation per manufacturer load tables.",
  },
  {
    icon: Paintbrush,
    title: "Protective Coatings",
    description: "Elastomeric wall coatings with specified permeance ratings (perms) to maintain vapor-open assemblies. Anti-carbonation treatments for concrete, parking deck traffic membranes, and high-elongation systems for crack-bridging on dynamic substrates.",
  },
  {
    icon: Shield,
    title: "Waterproofing & Sealants",
    description: "Hydrostatic and non-hydrostatic membrane systems. Below-grade waterproofing, traffic deck assemblies, and joint sealant replacement programs. Class I, II, and III vapor retarder selection per assembly dew point analysis. Testing per ASTM D4263 and ASTM E96.",
  },
  {
    icon: Ruler,
    title: "Interior Finishing",
    description: "Fire-rated wall and ceiling assemblies (ULC-listed). Level 5 drywall finish for critical light conditions. Acoustic assemblies achieving specified STC/IIC ratings. Precision finishing for tenant improvements and suite turnovers.",
  },
];

const buildingSciencePrinciples = [
  {
    icon: Thermometer,
    title: "Hygrothermal Performance",
    description: "We understand vapor drive direction, dew point location within assemblies, and condensation risk. Our detailing supports your WUFI modeling assumptions — ensuring the as-built assembly performs as designed through heating and cooling seasons.",
  },
  {
    icon: Wind,
    title: "Air Barrier Continuity",
    description: "Whole-building air tightness depends on transition details at slab edges, window-to-wall interfaces, and roof-to-wall junctions. We install and detail air barrier systems (self-adhered, fluid-applied, mechanical) with continuity verified through blower door coordination.",
  },
  {
    icon: Layers,
    title: "Thermal Bridging",
    description: "We understand the difference between nominal and effective R-value. Our crews install thermally broken cladding attachments, insulated shelf angle details, and continuous insulation strategies that maintain the thermal performance your energy model requires.",
  },
  {
    icon: Droplets,
    title: "Moisture Management",
    description: "Drainage plane continuity, kick-out flashing integration, through-wall flashing at shelf angles, weep systems in masonry veneer, and capillary breaks at grade transitions. Every layer is sequenced to shed water outward.",
  },
];

const standards = [
  { code: "OBC SB-10 / SB-12", description: "Ontario energy efficiency requirements" },
  { code: "ASHRAE 90.1", description: "Energy standard for buildings" },
  { code: "ASHRAE 62.1", description: "Ventilation for acceptable IAQ" },
  { code: "CSA A371", description: "Masonry construction for buildings" },
  { code: "CSA A23.1", description: "Concrete materials and construction" },
  { code: "ASTM E1105", description: "Field water penetration testing" },
  { code: "ASTM E2178", description: "Air leakage of building materials" },
  { code: "ASTM C1363", description: "Thermal performance of assemblies" },
  { code: "CCMC", description: "EIFS system evaluations" },
  { code: "ABAA", description: "Air barrier certified installation details" },
];

const collaborationProcess = [
  {
    step: "01",
    title: "Specification & Constructability Review",
    description: "We review your drawings, specs, and envelope details to confirm scope, identify constructability concerns around thermal and moisture continuity, and flag product substitution opportunities that maintain design intent.",
  },
  {
    step: "02",
    title: "Shop Drawings, Submittals & Analysis Coordination",
    description: "Detailed shop drawings, product data sheets, and material samples prepared to your format and timeline. We coordinate with your building science consultant on WUFI analysis assumptions and thermal modeling inputs.",
  },
  {
    step: "03",
    title: "Mock-Up, Testing & Approval",
    description: "On-site mock-ups for envelope assemblies, coating systems, or finish samples. Field air and water penetration testing per ASTM E1105 and AAMA 501.2, coordinated with your field review schedule.",
  },
  {
    step: "04",
    title: "Execution, Commissioning & Closeout",
    description: "Self-performed installation by trained crews. Thermographic scanning documentation, warranty packages, as-built records, and maintenance guides. Commissioning support for air barrier and envelope performance verification.",
  },
];

const projectTypes = [
  "Façade remediation & envelope restoration",
  "New construction envelope assemblies",
  "Parking garage membrane replacement",
  "Balcony waterproofing & drainage systems",
  "Air barrier installation & remediation",
  "Sealant replacement programs",
  "Heritage & heritage-adjacent restoration",
  "Continuous insulation retrofits",
  "Thermal bridging mitigation projects",
  "Multi-unit coating & re-cladding programs",
];

const ForArchitects = () => {
  return (
    <div className="min-h-screen">
      <SEO
        title="For Architects & Building Science Consultants | Ascent Group"
        description="Specialty envelope contractor for architects and building science professionals. EIFS, air barriers, rainscreen cladding — hygrothermal performance, ASHRAE 90.1 compliance, and spec-aligned execution."
        keywords="building science contractor Ontario, air barrier installer GTA, hygrothermal performance contractor, ASHRAE 90.1 compliant envelope, specialty contractor for architects, facade contractor specifications, EIFS installer Ontario, rainscreen cladding contractor"
      />
      <Navigation />

      <PageHero
        eyebrow="For Design Professionals"
        title="A Contractor Who Speaks Building Science"
        description="We execute envelope and interior scopes to your design intent — with the hygrothermal awareness, air barrier detailing, and field testing your high-performance assemblies demand."
        image={serviceHeroes["building-envelope"]}
        imageAlt="Building envelope installation detail"
        height="medium"
        primaryCta={{ text: "Request a Consultation", href: "/contact" }}
        secondaryCta={{ text: "View Capabilities", href: "/capabilities" }}
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "For Architects" },
        ]}
        badges={[
          { icon: Microscope, text: "Building Science Focus" },
          { icon: FileText, text: "Spec Compliance" },
          { icon: CheckCircle, text: "Field Testing" },
        ]}
      />

      <TrustRibbon />
      <OperationalProofBar items={DEFAULT_PROOF_ITEMS} />

      {/* Material Systems Expertise */}
      <Section size="major">
        <SectionHeader
          badge="Material Systems"
          title="Systems We Install & Restore"
          description="Our crews are trained on the product lines you specify — not just generic application. We understand manufacturer details, warranty requirements, approved substrates, and how each system performs within your wall assembly."
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

      {/* Building Science Principles */}
      <Section size="major" className="bg-muted/30">
        <SectionHeader
          badge="Building Science"
          title="Building Science We Understand"
          description="Your specs are rooted in building science principles. We install with an understanding of why each layer matters — not just how it goes on."
        />
        <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {buildingSciencePrinciples.map((item) => (
            <CapabilityCard
              key={item.title}
              icon={item.icon}
              title={item.title}
              description={item.description}
            />
          ))}
        </div>
      </Section>

      {/* Standards & Specifications */}
      <Section size="major">
        <SectionHeader
          badge="Codes & Standards"
          title="Standards & Specifications We Work To"
          description="We're familiar with the codes, standards, and testing protocols referenced in your specifications."
        />
        <div className="max-w-4xl mx-auto">
          <Card variant="elevated" size="lg">
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {standards.map((s) => (
                <div key={s.code} className="flex items-start gap-3">
                  <BookOpen className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <span className="text-sm font-semibold">{s.code}</span>
                    <p className="text-xs text-muted-foreground">{s.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </Section>

      {/* How We Work With Design Teams */}
      <Section size="major" className="bg-muted/30">
        <SectionHeader
          badge="Collaboration"
          title="How We Work With Design Teams"
          description="From spec review to commissioning, our process is built around your documentation requirements, building science objectives, and review milestones."
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

      {/* FAQs */}
      <Section size="major" maxWidth="narrow">
        <SectionHeader
          badge="Architect & Consultant FAQs"
          title="Common Questions from Design Teams"
          description="Hygrothermal modeling, ASTM testing, submittals, and spec compliance — covered."
        />
        <FAQAccordion faqs={architectsFaqs} />
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

      <RelatedLinksGrid
        title="Resources for Design Teams"
        links={[
          {
            icon: BookOpen,
            title: "Capabilities Statement",
            description: "Self-perform crew, project sizes, delivery models, and operational standards in one capability brief.",
            href: "/capabilities",
          },
          {
            icon: FileText,
            title: "Prequalification Documents",
            description: "Insurance, WSIB, safety policy, and references — packaged for your client's procurement team.",
            href: "/prequalification",
          },
          {
            icon: Layers,
            title: "Building Envelope Services",
            description: "EIFS, masonry, sealants, cladding, and waterproofing — full envelope and restoration scope detail.",
            href: "/services",
          },
        ]}
      />

      <Footer />
    </div>
  );
};

export default ForArchitects;
