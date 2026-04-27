import { useState } from "react";
import {
  Building2,
  Users,
  Layers,
  Wrench,
  ArrowRight,
  Shield,
  HardHat,
  Hammer,
  CheckCircle,
  Zap,
  Droplets,
  BrickWall,
  PaintRoller,
  Grid2x2,
  Car,
  Brush,
  FileCheck,
  Target,
  MessageSquare,
} from "lucide-react";
import { Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { PageHero } from "@/components/shared/PageHero";
import { Card } from "@/design-system/components/Card";
import { Section } from "@/components/sections/Section";
import { SectionHeader } from "@/design-system/components/SectionHeader";
import { ProofStrip } from "@/design-system/components/ProofStrip";
import { CTABand } from "@/design-system/components/CTABand";
import { TrustRibbon, FAQAccordion, SectionHeader as DSSectionHeader, StickyPageNav } from "@/design-system/components";
import { capabilitiesFaqs } from "@/data/page-faqs";
import { Button } from "@/ui/Button";
import SEO from "@/components/SEO";
import { companyHeroes } from "@/data/hero-images";
import { PartnershipModelsSection } from "@/components/partnerships/PartnershipModelsSection";

// ─── Data ────────────────────────────────────────────────────────────────────

type ScopeKey = "envelope" | "interior";

const SCOPES: Record<ScopeKey, { label: string; icon: typeof Building2; items: { icon: typeof Building2; label: string }[] }> = {
  envelope: {
    label: "Building Envelope",
    icon: Building2,
    items: [
      { icon: Layers,      label: "EIFS & Stucco Systems (Dryvit, Parex, Sto certified)" },
      { icon: Wrench,      label: "Perimeter Sealant Replacement (windows, joints, penetrations)" },
      { icon: BrickWall,   label: "Masonry Restoration & Tuckpointing (brick, block, stone)" },
      { icon: PaintRoller, label: "Exterior Architectural Painting & Protective Coatings" },
      { icon: Droplets,    label: "Balcony Waterproofing Membrane Systems" },
    ],
  },
  interior: {
    label: "Interior & Specialty",
    icon: Layers,
    items: [
      { icon: Brush,       label: "Commercial & Residential Painting (interior/exterior)" },
      { icon: PaintRoller, label: "High-Performance Coatings (epoxy, urethane, anti-graffiti)" },
      { icon: Grid2x2,     label: "Tile & Resilient Flooring Installation" },
      { icon: Layers,      label: "Interior Drywall Finishing & Buildouts" },
      { icon: Car,         label: "Parking Garage Restoration (coating, marking, repairs)" },
    ],
  },
};

const DELIVERY_METHODS = [
  {
    title: "Self-Performed Specialty Work",
    description: "Direct execution with our own trained crews — the core of how we operate.",
    icon: Wrench,
    details: [
      "EIFS, stucco, sealant, masonry, painting — all direct execution",
      "Minimal sub-tier layers = direct accountability",
      "No subcontractor markup on self-performed scope",
      "Same crew start-to-finish for consistency",
    ],
  },
  {
    title: "Pre-Construction Consultation",
    description: "Practical field-tested input during planning for envelope scope.",
    icon: Users,
    details: [
      "Field-tested recommendations for EIFS and cladding approaches",
      "Realistic cost guidance based on actual project experience",
      "Material selection support (Dryvit, Parex, Sto)",
      "Constructability insights for your envelope consultant",
    ],
  },
  {
    title: "Envelope + Interior Packaging",
    description: "Bundle related scopes under one specialty contractor — fewer handoffs.",
    icon: Layers,
    details: [
      "Typical package: façade restoration + protective coatings + painting",
      "Unified schedule for envelope and interior finish work",
      "Single point of contact for building enclosure scopes",
      "Reduces coordination burden on your project team",
    ],
  },
];

const WHY_SELF_PERFORM = [
  {
    icon: Target,
    title: "Direct Accountability",
    description: "When we self-perform, there's no subcontractor to point at. Our foremen and our crew are responsible for the quality — and they're on-site every day.",
  },
  {
    icon: Shield,
    title: "No Markup Layers",
    description: "Self-performed work eliminates the subcontractor markup that inflates cost without adding value. You pay for the work, not the middle layer.",
  },
  {
    icon: MessageSquare,
    title: "Better Communication",
    description: "When we talk to the crew, we're talking to the people actually doing the work. No game of telephone — issues flagged on-site get resolved on-site.",
  },
  {
    icon: Zap,
    title: "Consistent Standards",
    description: "Our crew works to the same standards on every project. No variation in quality based on which sub won the bid — just our own consistent practices.",
  },
];

const CROSS_LINKS = [
  {
    title: "For General Contractors",
    body: "How we work as a specialty trade partner on GC-led projects — integration, coordination, and accountability.",
    href: "/for-general-contractors",
    label: "Learn More",
  },
  {
    title: "Our Delivery Process",
    body: "The 5-step approach we apply to every project from site assessment through digital closeout.",
    href: "/our-process",
    label: "View Process",
  },
  {
    title: "Prequalification",
    body: "Download our capability statement, WSIB certificate, insurance documents, and safety records.",
    href: "/prequalification",
    label: "Get Pre-Qual Docs",
  },
];

// ─── Component ───────────────────────────────────────────────────────────────

const Capabilities = () => {
  const [activeScope, setActiveScope] = useState<ScopeKey>("envelope");
  const scope = SCOPES[activeScope];

  return (
    <div className="min-h-screen">
      <SEO
        title="Capabilities | Self-Perform Specialty Contracting"
        description="Ascent Group delivers building envelope restoration and interior trades through self-performed work, direct crew accountability, and flexible project delivery across Ontario's GTA."
      />
      <Navigation />

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <PageHero
        eyebrow="How We Deliver"
        title="How Ascent Delivers Projects"
        description="Self-performed specialty work with direct accountability. We adapt our role to your project structure — as prime contractor, trade partner, or consultant-aligned executor."
        image={companyHeroes["capabilities"]}
        imageAlt="Ascent Group crew executing building envelope restoration"
        height="large"
        primaryCta={{ text: "Submit RFP", href: "/submit-rfp" }}
        secondaryCta={{ text: "View Our Work", href: "/projects" }}
        stats={[
          { value: "85%",  label: "Self-Performed" },
          { value: "15+",  label: "Years Crew Experience" },
          { value: "$2M",  label: "CGL Coverage" },
          { value: "100%", label: "WSIB Compliant" },
        ]}
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Capabilities" },
        ]}
      />

      <TrustRibbon />

      <StickyPageNav
        sections={[
          { id: "why-self-perform", label: "Why Self-Perform" },
          { id: "partnership-models", label: "Partnership Models" },
          { id: "self-perform-scope", label: "Capabilities" },
          { id: "delivery-methods", label: "Delivery Methods" },
          { id: "project-capacity", label: "Capacity" },
          { id: "capabilities-faq", label: "FAQ" },
        ]}
      />

      <main>
        {/* ── Why Self-Perform? ───────────────────────────────────────────── */}
        <section id="why-self-perform" className="w-full bg-[hsl(var(--ink))] py-20 md:py-28 scroll-mt-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center mb-16">
              <div>
                <span className="text-sm font-semibold uppercase tracking-wider text-[hsl(var(--accent))] mb-3 block">
                  Our Model
                </span>
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 leading-tight">
                  Why We Self-Perform 85% of Our Work
                </h2>
                <p className="text-white/80 leading-relaxed text-lg">
                  Most specialty contractors broker the work — they win the contract, then hand it off to
                  subcontractors. We take a different approach: we put our own crew on site for the majority
                  of every scope we take on.
                </p>
              </div>
              <div>
                <p className="text-white/70 leading-relaxed mb-4">
                  This isn't just a business model preference. It's the reason we can make real commitments
                  about quality, schedule, and accountability — and back them up.
                </p>
                <p className="text-white/70 leading-relaxed">
                  When we sub-trade (typically for specialized equipment like swing-stage rigging), we maintain
                  direct oversight and the same quality expectations. The prime responsibility stays with us.
                </p>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {WHY_SELF_PERFORM.map(({ icon: Icon, title, description }, i) => (
                <div
                  key={i}
                  className="bg-white/5 border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-colors"
                >
                  <div className="p-2.5 bg-[hsl(var(--accent))]/20 rounded-lg w-fit mb-4">
                    <Icon className="w-5 h-5 text-[hsl(var(--accent))]" />
                  </div>
                  <h3 className="text-white font-semibold mb-2">{title}</h3>
                  <p className="text-white/60 text-sm leading-relaxed">{description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Partnership Models ─────────────────────────────────────────── */}
        <div id="partnership-models" className="scroll-mt-24">
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
        </div>

        {/* ── Self-Perform Capabilities (Tabbed) ─────────────────────────── */}
        <div id="self-perform-scope" className="scroll-mt-24">
        <Section size="major" className="bg-muted/30">
          <SectionHeader
            badge="Self-Perform Capabilities"
            title="What Our Crew Delivers Directly"
            description="Our crew directly executes the majority of project scope. We sub-trade only specialized equipment work and maintain direct oversight of all activities."
            align="left"
          />

          {/* Tab bar */}
          <div className="flex gap-2 mb-8" role="tablist">
            {(Object.keys(SCOPES) as ScopeKey[]).map((key) => {
              const { label, icon: Icon } = SCOPES[key];
              const isActive = activeScope === key;
              return (
                <button
                  key={key}
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setActiveScope(key)}
                  className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-primary text-primary-foreground shadow-md"
                      : "bg-background text-muted-foreground border border-border hover:text-foreground"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </button>
              );
            })}
          </div>

          {/* Chip grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-8">
            {scope.items.map(({ icon: Icon, label }, i) => (
              <div
                key={i}
                className="flex items-center gap-3 bg-background rounded-xl border border-border px-4 py-3 hover:border-primary/50 transition-colors"
              >
                <Icon className="w-5 h-5 text-primary flex-shrink-0" />
                <span className="text-sm font-medium">{label}</span>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-4">
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
        </div>

        {/* ── Project Delivery Methods ───────────────────────────────────── */}
        <div id="delivery-methods" className="scroll-mt-24">
        <Section size="major">
          <SectionHeader
            badge="Delivery Methods"
            title="How We Structure Our Role"
            description="We adapt our delivery model to the structure of your project — not the other way around."
            align="left"
          />
          <div className="grid md:grid-cols-3 gap-6">
            {DELIVERY_METHODS.map(({ title, description, icon: Icon, details }, i) => (
              <Card key={i} variant="elevated" size="lg" hover>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-5">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{title}</h3>
                <p className="text-muted-foreground text-sm mb-5 leading-relaxed">{description}</p>
                <ul className="space-y-2.5">
                  {details.map((detail, di) => (
                    <li key={di} className="flex items-start gap-2.5 text-sm">
                      <CheckCircle className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-muted-foreground">{detail}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            ))}
          </div>
        </Section>

        {/* ── Project Size & Capacity ────────────────────────────────────── */}
        <Section size="major" className="bg-muted/30">
          <SectionHeader
            badge="Project Capacity"
            title="Project Size & Financial Strength"
            description="We're structured to handle projects across a broad range — from emergency repairs to multi-phase restoration programs."
            align="left"
          />

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <Card variant="elevated" size="lg">
              <Building2 className="h-8 w-8 text-primary mb-4" />
              <p className="text-3xl font-bold text-primary mb-1">$25K – $500K</p>
              <p className="text-sm font-medium text-foreground mb-2">Current Project Range</p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Emergency repairs through multi-phase restoration programs. Sweet spot is mid-range envelope
                and interior scopes for property managers and GCs.
              </p>
            </Card>

            <Card variant="elevated" size="lg">
              <HardHat className="h-8 w-8 text-primary mb-4" />
              <p className="text-3xl font-bold text-primary mb-1">15+ Years</p>
              <p className="text-sm font-medium text-foreground mb-2">Combined Crew Experience</p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Prior roles on major GTA developments and restoration projects. Our crew brings the
                experience of larger firms to every job.
              </p>
            </Card>

            <Card variant="elevated" size="lg">
              <Shield className="h-8 w-8 text-primary mb-4" />
              <p className="text-3xl font-bold text-primary mb-1">$2M CGL</p>
              <p className="text-sm font-medium text-foreground mb-2">Liability Coverage</p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                WSIB active clearance, $2M commercial general liability, growing bonding capacity.
                All documentation available on request.
              </p>
            </Card>
          </div>

          <Button variant="outline" asChild>
            <Link to="/prequalification">
              View Pre-Qualification Package
              <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </Button>
        </Section>

        {/* ── Proof Strip ───────────────────────────────────────────────── */}
        <Section size="tight">
          <ProofStrip
            items={[
              { value: "WSIB",  label: "Active Clearance" },
              { value: "$2M",   label: "CGL Coverage" },
              { value: "85%",   label: "Self-Performed" },
              { value: "15+",   label: "Years Experience" },
            ]}
            variant="dark"
            columns={4}
          />
        </Section>

        {/* ── Cross-links ───────────────────────────────────────────────── */}
        <Section size="subsection" className="bg-muted/30 border-t border-border/50">
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {CROSS_LINKS.map(({ title, body, href, label }, i) => (
              <div
                key={i}
                className="p-6 bg-background rounded-lg border border-border hover:shadow-md transition-shadow"
              >
                <h3 className="font-bold text-foreground mb-2">{title}</h3>
                <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{body}</p>
                <Link
                  to={href}
                  className="inline-flex items-center gap-1.5 text-sm text-primary font-medium hover:underline"
                >
                  {label} <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            ))}
          </div>
        </Section>

        {/* People Also Ask */}
        <Section size="major">
          <DSSectionHeader
            title="People Also Ask"
            description="Common questions about our self-perform model and capacity."
            badge="FAQ"
            maxWidth="md"
          />
          <div className="max-w-3xl mx-auto">
            <FAQAccordion faqs={capabilitiesFaqs} />
          </div>
        </Section>
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
