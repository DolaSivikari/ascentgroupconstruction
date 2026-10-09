import { cn } from "@/lib/utils";
import { CARD_STYLES, TYPOGRAPHY_STYLES } from "@/design-system/constants";
import { lazy, Suspense, useEffect } from "react";
import { DeferredContent } from "@/pages/redesign/DeferredContent";
import CapacityRange from "./capabilities/CapacityRange";
import WhoIsOnSite from "./capabilities/WhoIsOnSite";
import "./capabilities/capabilities.css";
import { ArrowRight, Shield, Target, MessageSquare, Zap } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { PageHero } from "@/components/shared/PageHero";
import { Section } from "@/components/sections/Section";
import { StartProjectCTA } from "@/components/shared/StartProjectCTA";
import {
  TrustRibbon,
  FAQAccordion,
  SectionHeader as DSSectionHeader,
  StickyPageNav,
} from "@/design-system/components";
import { capabilitiesFaqs } from "@/data/page-faqs";
import { Button } from "@/ui/Button";
import SEO from "@/components/SEO";
import { companyHeroes } from "@/data/hero-images";
const PartnershipOrgChart = lazy(
  () => import("./capabilities/PartnershipOrgChart"),
);
const CapabilityMatrix = lazy(() => import("./capabilities/CapabilityMatrix"));
const AccessPlanner = lazy(() => import("./capabilities/AccessPlanner"));
const InspectionTestPlan = lazy(
  () => import("./capabilities/InspectionTestPlan"),
);

// ─── Data ────────────────────────────────────────────────────────────────────

const WHY_SELF_PERFORM = [
  {
    icon: Target,
    title: "Direct Accountability",
    description:
      "When we self-perform, there's no subcontractor to point at. Our foremen and our crew are responsible for the quality — and they're on-site every day.",
  },
  {
    icon: Shield,
    title: "No Markup Layers",
    description:
      "Self-performed work eliminates the subcontractor markup that inflates cost without adding value. You pay for the work, not the middle layer.",
  },
  {
    icon: MessageSquare,
    title: "Better Communication",
    description:
      "When we talk to the crew, we're talking to the people actually doing the work. No game of telephone — issues flagged on-site get resolved on-site.",
  },
  {
    icon: Zap,
    title: "Consistent Standards",
    description:
      "Our crew works to the same standards on every project. No variation in quality based on which sub won the bid — just our own consistent practices.",
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

const PARTNERSHIP_ANCHORS = [
  "prime-contractor",
  "trade-partner",
  "consultant-led",
  "direct-service",
];

const Capabilities = () => {
  const { hash } = useLocation();
  const requestedPartnership = PARTNERSHIP_ANCHORS.includes(hash.slice(1));
  useEffect(() => {
    const anchor =
      requestedPartnership || hash === "#delivery-methods"
        ? "partnership-models"
        : hash.slice(1);
    if (
      ![
        "partnership-models",
        "why-self-perform",
        "self-perform-scope",
        "access-planning",
        "quality-control",
        "project-capacity",
        "capabilities-faq",
      ].includes(anchor)
    )
      return;
    const frame = requestAnimationFrame(() =>
      document
        .getElementById(anchor)
        ?.scrollIntoView({ block: "start", behavior: "auto" }),
    );
    return () => cancelAnimationFrame(frame);
  }, [hash, requestedPartnership]);
  return (
    <div className="capabilities-redesign min-h-screen">
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
        primaryCta={{ text: "Start a Project", href: "/submit-rfp" }}
        secondaryCta={{ text: "View Our Work", href: "/projects" }}
        stats={[
          { value: "85%", label: "Self-Performed" },
          { value: "15+", label: "Years Crew Experience" },
          { value: "$2M", label: "CGL Coverage" },
          { value: "100%", label: "WSIB Compliant" },
        ]}
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Capabilities" }]}
      />

      <TrustRibbon />

      <StickyPageNav
        sections={[
          { id: "why-self-perform", label: "Why Self-Perform" },
          { id: "partnership-models", label: "Partnership Models" },
          { id: "self-perform-scope", label: "Capabilities" },
          { id: "access-planning", label: "Access Planning" },
          { id: "quality-control", label: "Quality Control" },
          { id: "project-capacity", label: "Capacity" },
          { id: "capabilities-faq", label: "FAQ" },
        ]}
      />

      <main>
        {/* ── Why Self-Perform? ───────────────────────────────────────────── */}
        <section
          id="why-self-perform"
          className="w-full bg-[hsl(var(--navy-surface))] py-20 md:py-28 scroll-mt-24"
        >
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center mb-16">
              <div>
                <span className="text-sm font-semibold uppercase tracking-wider text-white/90 mb-3 block">
                  Our Model
                </span>
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 leading-tight">
                  Why We Self-Perform 85% of Our Work
                </h2>
                <p className="text-white/80 leading-relaxed text-lg">
                  Most specialty contractors broker the work — they win the
                  contract, then hand it off to subcontractors. We take a
                  different approach: we put our own crew on site for the
                  majority of every scope we take on.
                </p>
              </div>
              <div>
                <p className="text-white/70 leading-relaxed mb-4">
                  This isn't just a business model preference. It's the reason
                  we can make real commitments about quality, schedule, and
                  accountability — and back them up.
                </p>
                <p className="text-white/70 leading-relaxed">
                  When we sub-trade (typically for specialized equipment like
                  swing-stage rigging), we maintain direct oversight and the
                  same quality expectations. The prime responsibility stays with
                  us.
                </p>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {WHY_SELF_PERFORM.map(({ icon: Icon, title, description }, i) => (
                <div
                  key={i}
                  className="bg-white/5 border border-white/10 rounded-[var(--card-border-radius)] p-6 hover:bg-white/10 transition-colors"
                >
                  <div className="p-2.5 bg-[hsl(var(--accent))]/20 rounded-lg w-fit mb-4">
                    <Icon className="w-5 h-5 text-[hsl(var(--accent))]" />
                  </div>
                  <h3
                    className={`${TYPOGRAPHY_STYLES.cardTitle} text-white mb-2`}
                  >
                    {title}
                  </h3>
                  <p className={`${TYPOGRAPHY_STYLES.cardBody} text-white/60`}>
                    {description}
                  </p>
                </div>
              ))}
            </div>
            <WhoIsOnSite />
          </div>
        </section>

        <section
          id="partnership-models"
          className="scroll-mt-24 py-16 md:py-20"
        >
          <div className="container px-4 md:px-6 lg:pr-40">
            {PARTNERSHIP_ANCHORS.map((id) => (
              <span
                key={id}
                id={id}
                aria-hidden="true"
                className="block scroll-mt-24"
              />
            ))}
            <span
              id="delivery-methods"
              aria-hidden="true"
              className="block scroll-mt-24"
            />
            <DeferredContent eager={requestedPartnership}>
              <Suspense
                fallback={<p role="status">Loading partnership structures…</p>}
              >
                <PartnershipOrgChart />
              </Suspense>
            </DeferredContent>
            <div className="mt-6">
              <Button variant="outline" asChild>
                <Link to="/for-general-contractors">
                  For General Contractors <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
        <section
          id="self-perform-scope"
          className="scroll-mt-24 bg-muted/30 py-16 md:py-20"
        >
          <div className="container px-4 md:px-6 lg:pr-40">
            <DeferredContent>
              <Suspense
                fallback={<p role="status">Loading capability matrix…</p>}
              >
                <CapabilityMatrix />
              </Suspense>
            </DeferredContent>
          </div>
        </section>
        <section
          id="access-planning"
          className="scroll-mt-24 bg-primary py-16 text-primary-foreground md:py-20"
        >
          <div className="container px-4 md:px-6 lg:pr-40">
            <div className="mb-8 text-center">
              <p className="mb-3 text-sm font-semibold uppercase tracking-wider">
                Access planning
              </p>
              <h2 className="mb-4 text-3xl font-bold md:text-4xl">
                We plan how to reach the work
              </h2>
              <p className="mx-auto max-w-2xl text-primary-foreground/80">
                Set the building height to explore typical access methods and
                the checks needed before mobilization.
              </p>
            </div>
            <DeferredContent>
              <Suspense fallback={<p role="status">Loading access planner…</p>}>
                <AccessPlanner />
              </Suspense>
            </DeferredContent>
          </div>
        </section>
        <section id="quality-control" className="scroll-mt-24 py-16 md:py-20">
          <div className="container px-4 md:px-6 lg:pr-40">
            <DeferredContent>
              <Suspense
                fallback={<p role="status">Loading sample inspection plan…</p>}
              >
                <InspectionTestPlan />
              </Suspense>
            </DeferredContent>
          </div>
        </section>
        <section
          id="project-capacity"
          className="scroll-mt-24 bg-muted/30 py-16 md:py-20"
        >
          <div className="container px-4 md:px-6 lg:pr-40">
            <CapacityRange />
          </div>
        </section>

        {/* ── Cross-links ───────────────────────────────────────────────── */}
        <Section
          size="subsection"
          className="bg-muted/30 border-t border-border/50"
        >
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {CROSS_LINKS.map(({ title, body, href, label }, i) => (
              <div
                key={i}
                className={cn(
                  CARD_STYLES.base,
                  CARD_STYLES.motion,
                  CARD_STYLES.hover,
                  "p-6",
                )}
              >
                <h3
                  className={`${TYPOGRAPHY_STYLES.cardTitle} text-foreground mb-2`}
                >
                  {title}
                </h3>
                <p
                  className={`${TYPOGRAPHY_STYLES.cardBody} text-muted-foreground mb-4`}
                >
                  {body}
                </p>
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
        <div id="capabilities-faq" className="scroll-mt-24">
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
        </div>
        <StartProjectCTA title="Have a project in mind?" />
      </main>

      <Footer />
    </div>
  );
};

export default Capabilities;
