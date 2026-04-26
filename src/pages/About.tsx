import { SITE_URL } from "@/constants/company";
import { Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { Card } from "@/design-system/components/Card";
import { SectionHeader } from "@/design-system/components/SectionHeader";
import { ProofStrip } from "@/design-system/components/ProofStrip";
import { CTABand } from "@/design-system/components/CTABand";
import { TrustRibbon } from "@/design-system/components/TrustRibbon";
import { TabbedSections, FAQAccordion } from "@/design-system/components";
import { Section } from "@/components/sections/Section";
import { PageHero } from "@/components/shared/PageHero";
import { Button } from "@/ui/Button";
import {
  Shield,
  ShieldCheck,
  Target,
  CheckCircle,
  MapPin,
  Award,
  HardHat,
  MessageSquare,
  Handshake,
  TrendingUp,
  ArrowRight,
  Building2,
  Users,
  Wrench,
  Layers,
  Droplets,
  BrickWall,
  PaintRoller,
  Car,
  Grid2x2,
  Brush,
  ClipboardList,
  BookOpen,
  UserCircle,
  Heart,
  Map,
  Calendar,
} from "lucide-react";
import { mainPageHeroes } from "@/data/hero-images";
import { usePageAnalytics } from "@/hooks/usePageAnalytics";
import { generateBreadcrumbSchema, generateHowToSchema } from "@/utils/seo";
import { founderBio } from "@/data/enriched-company-content";
import { aboutFaqs } from "@/data/page-faqs";

const MILESTONES = [
  { year: "2010", title: "Field Experience Begins", description: "Hebun's hands-on envelope work starts on GTA highrise and commercial projects." },
  { year: "2020", title: "Trade Lead", description: "Leading EIFS, masonry, and restoration crews on multi-storey envelope scopes." },
  { year: "2025", title: "Ascent Group Founded", description: "Formalized as a specialty contractor — direct accountability, no markup layers." },
  { year: "2025", title: "Sto Canada Listed", description: "Listed Installer for Modules SCL-001 through SCL-010." },
];

// ─── Data ────────────────────────────────────────────────────────────────────

const SERVICES = [
  { icon: Layers,      label: "Façade Remediation & Cladding" },
  { icon: Wrench,      label: "Sealant Replacement Programs" },
  { icon: Car,         label: "Concrete & Parking Garage Repairs" },
  { icon: BrickWall,   label: "EIFS & Stucco Systems" },
  { icon: BrickWall,   label: "Masonry Restoration" },
  { icon: Droplets,    label: "Waterproofing Systems" },
  { icon: PaintRoller, label: "Protective & Architectural Coatings" },
  { icon: Grid2x2,     label: "Flooring & Tile" },
  { icon: Brush,       label: "Residential & Commercial Painting" },
  { icon: Building2,   label: "Interior Buildouts" },
];

const VALUES = [
  {
    icon: Target,
    title: "Professional Execution",
    description: "We bring the same professional standards developed on major GTA projects to every job, regardless of size.",
  },
  {
    icon: ShieldCheck,
    title: "Clear Accountability",
    description: "You work directly with the people on your site. No subcontractor layers, no finger-pointing.",
  },
  {
    icon: MessageSquare,
    title: "Honest Communication",
    description: "Realistic schedules, detailed scopes, proactive updates. If issues arise, you hear about them immediately with solutions.",
  },
  {
    icon: Handshake,
    title: "Relationship First",
    description: "Every client relationship matters. We earn trust through consistent, professional work and reliable follow-through.",
  },
  {
    icon: HardHat,
    title: "Safety First",
    description: "WSIB compliant, proper safety protocols, and the right equipment on every job. We never compromise on safety.",
  },
  {
    icon: TrendingUp,
    title: "Long-Term Thinking",
    description: "We're building for the long term — sustainable growth through client satisfaction and a strong market reputation.",
  },
];

const AUDIENCES = [
  {
    icon: Building2,
    title: "General Contractors",
    description: "Dependable specialty trade partners for envelope, EIFS, masonry, and interior work on commercial and multi-residential projects.",
    link: "/for-general-contractors",
  },
  {
    icon: Users,
    title: "Property Managers",
    description: "Envelope and interior trades for building maintenance, restoration, and capital projects — with minimal tenant disruption.",
    link: "/markets",
  },
  {
    icon: Award,
    title: "Developers & Owners",
    description: "Direct prime-scope pricing without subcontractor markup layers, backed by proven GTA project experience.",
    link: "/markets",
  },
  {
    icon: ClipboardList,
    title: "Building Consultants",
    description: "Reliable contractors who follow your specifications, document everything, and respond professionally to RFIs.",
    link: "/markets",
  },
];

const PROCESS_STEPS = [
  {
    number: "01",
    title: "Site Walk & Assessment",
    description:
      "We meet on site to understand the issue, constraints, and access. For urgent matters, we aim to attend within 48–72 hours.",
  },
  {
    number: "02",
    title: "Scope & Proposal",
    description:
      "You receive a clear, itemized scope — drawings/photos as needed, alternates where helpful, and unit rates for repetitive work. We prioritize fast, complete submittals.",
  },
  {
    number: "03",
    title: "Mobilize & Execute",
    description:
      "We coordinate permits, access, logistics, and occupant notices. A dedicated lead oversees daily safety, quality, and schedule.",
  },
  {
    number: "04",
    title: "Quality Assurance & Reporting",
    description:
      "Field checks, photo logs, and inspection records ensure work follows specifications and manufacturer guidance.",
  },
  {
    number: "05",
    title: "Closeout & Warranty",
    description:
      "Final walkthrough, punch completion, turnover package with photos and product data, and applicable warranty.",
  },
];

const REGIONS = [
  "City of Toronto",
  "Mississauga",
  "Brampton",
  "Vaughan",
  "Markham",
  "Oakville",
  "Burlington",
  "Hamilton",
  "Scarborough",
  "North York",
  "Etobicoke",
  "Broader Ontario",
];

const CREDENTIALS = [
  "15+ years combined hands-on team experience",
  "Highrise & commercial building background across the GTA",
  "Manufacturer-approved installation methods",
  "WSIB compliant — $2M CGL liability coverage",
  "85% self-performed — direct crew accountability",
  "Professional safety protocols on every job site",
];

// ─── Component ───────────────────────────────────────────────────────────────

const About = () => {
  usePageAnalytics("about");

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "About Us", url: "/about" },
  ]);

  const processSchema = generateHowToSchema({
    name: "Ascent Group Construction 5-Step Project Process",
    description:
      "Our proven approach to delivering reliable building envelope and restoration projects",
    steps: PROCESS_STEPS.map((s) => ({ name: s.title, text: s.description })),
  });

  return (
    <div className="min-h-screen">
      <SEO
        title="About Us — Building Envelope & Restoration Specialists | GTA"
        description="15+ years of combined experience in building envelope, restoration & interior trades across the GTA — now operating as Ascent Group Construction."
        keywords="about Ascent Group, building envelope contractor, specialty contractor Ontario, restoration company, GTA contractor"
        canonical={`${SITE_URL}/about`}
        structuredData={[breadcrumbSchema, processSchema]}
      />
      <Navigation />

      {/* ── 1. Hero ──────────────────────────────────────────────────────── */}
      <PageHero
        eyebrow="About Ascent Group"
        title="15 Years of Experience. One Clear Mission."
        description="Specialty contractor for building envelope, restoration & interior trades across the GTA — self-performed work, direct accountability, professional closeout."
        image={mainPageHeroes.about}
        imageAlt="Ascent Group Construction team at work on a building facade"
        height="large"
        stats={[
          { value: "15+", label: "Years Experience" },
          { value: "85%",  label: "Self-Performed" },
          { value: "$2M",  label: "CGL Coverage" },
          { value: "100%", label: "WSIB Compliant" },
        ]}
        primaryCta={{ text: "Request a Site Assessment", href: "/contact" }}
        secondaryCta={{ text: "How We Work", href: "/our-process" }}
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "About Us" },
        ]}
      />

      <TrustRibbon />

      <TabbedSections
        sections={[
          {
            id: "story",
            label: "Story",
            icon: BookOpen,
            content: (
              <>
                {/* Identity — Proven Expertise. New Name. */}
                <Section size="major" maxWidth="wide">
                  <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center">
                    <div>
                      <img
                        src="/brand/logo-vertical-dark.png"
                        alt=""
                        aria-hidden="true"
                        className="h-28 w-auto mb-6 opacity-95"
                        loading="lazy"
                        decoding="async"
                      />
                      <span className="text-sm font-semibold uppercase tracking-wider text-primary mb-3 block">
                        Our Story
                      </span>
                      <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-6 leading-tight">
                        Proven Expertise.<br />New Name.
                      </h2>
                      <p className="text-lg text-muted-foreground leading-relaxed mb-4">
                        Ascent Group Construction represents 15+ years of combined experience in building envelope and
                        interior trades — formalized under a new company name in 2025.
                      </p>
                      <p className="text-base text-muted-foreground leading-relaxed mb-4">
                        Our team brings hands-on experience from envelope restoration, EIFS installation, masonry repair,
                        waterproofing, and interior finishing on buildings ranging from 3-storey walk-ups to 30-storey
                        towers. We've delivered results for general contractors, property managers, building consultants,
                        and institutional clients who demand professional execution.
                      </p>
                      <p className="text-base text-muted-foreground leading-relaxed">
                        We founded Ascent Group to bring this proven capability directly to clients — without the
                        complexity of layered subcontracting or inflated middleman margins.
                      </p>
                    </div>

                    <div className="space-y-4">
                      {CREDENTIALS.map((cred, i) => (
                        <div key={i} className="flex items-start gap-3">
                          <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                          <span className="text-base">{cred}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </Section>

                {/* Milestones */}
                <Section size="major" className="bg-muted/30">
                  <SectionHeader
                    title="Milestones"
                    description="Key moments behind Ascent Group's specialty contracting capability."
                    badge="Timeline"
                    maxWidth="md"
                  />
                  <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
                    {MILESTONES.map((m) => (
                      <Card key={`${m.year}-${m.title}`} variant="elevated" size="md">
                        <div className="flex items-center gap-2 mb-3">
                          <Calendar className="w-4 h-4 text-primary" />
                          <span className="text-sm font-bold text-primary">{m.year}</span>
                        </div>
                        <h3 className="text-base font-semibold mb-2">{m.title}</h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">{m.description}</p>
                      </Card>
                    ))}
                  </div>
                </Section>

                {/* Proof Strip */}
                <Section size="tight">
                  <ProofStrip
                    items={[
                      { value: "15+",  label: "Years Team Experience" },
                      { value: "$2M",  label: "CGL Coverage" },
                      { value: "100%", label: "WSIB Compliant" },
                      { value: "85%",  label: "Self-Performed" },
                    ]}
                    variant="dark"
                    columns={4}
                  />
                </Section>
              </>
            ),
          },
          {
            id: "founder",
            label: "Founder",
            icon: UserCircle,
            content: (
              <section className="w-full bg-[hsl(var(--ink))] py-20 md:py-28">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                  <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center">
                    <div>
                      <span className="text-sm font-semibold uppercase tracking-wider text-[hsl(var(--accent))] mb-3 block">
                        Founder
                      </span>
                      <h2 className="text-3xl md:text-4xl font-bold text-white mb-1">
                        {founderBio.name}
                      </h2>
                      <p className="text-[hsl(var(--accent))] font-medium mb-6">
                        {founderBio.title}
                      </p>
                      <p className="text-white/80 leading-relaxed mb-4 text-base">
                        Hebun established Ascent Group Construction in 2025 to bring 15+ years of proven building
                        envelope and interior trades expertise directly to commercial, multi-family, and residential
                        clients across Ontario.
                      </p>
                      <p className="text-white/70 leading-relaxed text-base mb-8">
                        From 3-storey walk-ups to 30-storey high-rises, Hebun has delivered envelope restoration, EIFS
                        installation, masonry repair, and interior finishing across the GTA — building the field
                        knowledge and client relationships that Ascent Group is founded on.
                      </p>
                      <div className="space-y-2">
                        {founderBio.credentials.map((cred, i) => (
                          <div key={i} className="flex items-center gap-2 text-white/70 text-sm">
                            <CheckCircle className="w-4 h-4 text-[hsl(var(--accent))] flex-shrink-0" />
                            <span>{cred}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="border-l-4 border-[hsl(var(--accent))] pl-8 py-2">
                      <p className="text-2xl md:text-3xl font-semibold text-white leading-snug italic mb-8">
                        "We're building Ascent Group methodically — professional systems, quality execution, and
                        honest client relationships. Our focus is on being the most reliable envelope and interior
                        trade specialist in the GTA."
                      </p>
                      <p className="text-white/50 text-sm uppercase tracking-wider">
                        Hebun Isik · Founder &amp; Principal
                      </p>
                    </div>
                  </div>
                </div>
              </section>
            ),
          },
          {
            id: "values",
            label: "Values",
            icon: Heart,
            content: (
              <Section size="major">
                <SectionHeader
                  title="What We Stand For"
                  description="Six principles that guide every project, every interaction, every decision."
                  badge="Our Values"
                />
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {VALUES.map(({ icon: Icon, title, description }, i) => (
                    <Card key={i} variant="elevated" size="md" hover>
                      <div className="p-2 bg-primary/10 rounded-lg w-fit mb-4">
                        <Icon className="w-5 h-5 text-primary" />
                      </div>
                      <h3 className="text-lg font-semibold mb-2">{title}</h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">{description}</p>
                    </Card>
                  ))}
                </div>
              </Section>
            ),
          },
          {
            id: "capabilities",
            label: "Capabilities",
            icon: Wrench,
            content: (
              <>
                <Section size="major">
                  <SectionHeader
                    title="What We Self-Perform"
                    description="Each scope is planned for minimal disruption, clear sequencing, and documented QA/QC."
                    badge="Services"
                  />
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 mb-10">
                    {SERVICES.map(({ icon: Icon, label }, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-3 bg-background rounded-xl border border-border px-4 py-3 hover:border-primary/50 transition-colors"
                      >
                        <Icon className="w-5 h-5 text-primary flex-shrink-0" />
                        <span className="text-sm font-medium">{label}</span>
                      </div>
                    ))}
                  </div>
                  <div className="text-center">
                    <Button asChild variant="outline" size="lg">
                      <Link to="/services">
                        View All Services <ArrowRight className="ml-2 w-4 h-4" />
                      </Link>
                    </Button>
                  </div>
                </Section>

                <Section size="major" className="bg-muted/30">
                  <SectionHeader
                    title="Who We Work With"
                    description="Built for clients who value reliability, clear communication, and professional trade execution."
                    badge="Clients"
                  />
                  <div className="grid sm:grid-cols-2 gap-6">
                    {AUDIENCES.map(({ icon: Icon, title, description, link }, i) => (
                      <Card key={i} variant="elevated" size="lg" hover>
                        <div className="flex items-start gap-4">
                          <div className="p-3 bg-primary/10 rounded-xl flex-shrink-0">
                            <Icon className="w-6 h-6 text-primary" />
                          </div>
                          <div>
                            <h3 className="text-xl font-semibold mb-2">{title}</h3>
                            <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                              {description}
                            </p>
                            <Link
                              to={link}
                              className="text-primary text-sm font-medium hover:underline inline-flex items-center gap-1"
                            >
                              Learn more <ArrowRight className="w-3.5 h-3.5" />
                            </Link>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </Section>

                <Section size="major">
                  <SectionHeader
                    title="Our 5-Step Approach"
                    description="A consistent process for every project — from first call to final closeout."
                    badge="Process"
                  />
                  <div className="max-w-3xl mx-auto">
                    {PROCESS_STEPS.map((step, index) => (
                      <div key={index} className="relative flex gap-6">
                        <div className="flex flex-col items-center">
                          <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-sm flex-shrink-0 z-10">
                            {step.number}
                          </div>
                          {index < PROCESS_STEPS.length - 1 && (
                            <div className="w-0.5 flex-1 bg-border mt-2 mb-2" />
                          )}
                        </div>
                        <div className={index < PROCESS_STEPS.length - 1 ? "pb-10" : "pb-0"}>
                          <h3 className="text-lg font-semibold mb-2 mt-2.5">{step.title}</h3>
                          <p className="text-muted-foreground text-base leading-relaxed">
                            {step.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="text-center mt-10">
                    <Button asChild variant="outline" size="lg">
                      <Link to="/our-process">
                        Full Process Details <ArrowRight className="ml-2 w-4 h-4" />
                      </Link>
                    </Button>
                  </div>
                </Section>
              </>
            ),
          },
          {
            id: "service-areas",
            label: "Service Areas",
            icon: Map,
            content: (
              <Section size="major">
                <div className="max-w-4xl mx-auto text-center">
                  <span className="text-sm font-semibold uppercase tracking-wider text-primary mb-3 block">
                    Service Area
                  </span>
                  <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
                    Where We Work
                  </h2>
                  <p className="text-lg text-muted-foreground mb-10 max-w-2xl mx-auto">
                    Primarily serving <strong>Ontario &amp; the Greater Toronto Area</strong>. We consider broader
                    Ontario for the right project.
                  </p>
                  <div className="flex flex-wrap gap-3 justify-center">
                    {REGIONS.map((region) => (
                      <div
                        key={region}
                        className="inline-flex items-center gap-2 bg-muted rounded-full px-4 py-2 text-sm font-medium border border-border"
                      >
                        <MapPin className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                        {region}
                      </div>
                    ))}
                  </div>
                </div>
              </Section>
            ),
          },
        ]}
      />

      {/* People Also Ask */}
      <Section size="major" className="bg-muted/30">
        <SectionHeader
          title="People Also Ask"
          description="Common questions about our company, founder, and approach."
          badge="FAQ"
          maxWidth="md"
        />
        <div className="max-w-3xl mx-auto">
          <FAQAccordion faqs={aboutFaqs} />
        </div>
      </Section>

      {/* ── 10. CTA ──────────────────────────────────────────────────────── */}
      <CTABand
        title="Let's Talk About Your Project"
        description="Site assessment, trade pricing, or just a conversation — we're straightforward to work with."
        primaryCta={{ text: "Contact Us", href: "/contact" }}
        secondaryCta={{ text: "Explore Our Services", href: "/services" }}
        variant="dark"
      />

      <Footer />
    </div>
  );
};

export default About;
