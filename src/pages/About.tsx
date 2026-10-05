import { useAboutDetails } from "@/content/aboutDetails";
import { usePageContent } from "@/hooks/usePageContent";
import contentModule from "@/content/pages/about";
import { usePublicSettings } from "@/hooks/usePublicSettings";
import { resolveAboutContent, type AboutContent } from "@/lib/aboutContent";
import { SITE_URL } from "@/constants/company";
import { Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { Card } from "@/design-system/components/Card";
import { SectionHeader } from "@/design-system/components/SectionHeader";
import { ProofStrip } from "@/design-system/components/ProofStrip";
import { StartProjectCTA } from "@/components/shared/StartProjectCTA";
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
import {
  generateBreadcrumbSchema,
  generateHowToSchema,
  generateFAQSchema,
} from "@/utils/seo";
import { founderBio } from "@/data/enriched-company-content";
import { useSharedFaqs } from "@/hooks/useSharedContent";

// ─── Data ────────────────────────────────────────────────────────────────────

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
  const aboutFaqs = useSharedFaqs("aboutFaqs");
  const c = usePageContent(contentModule);
  const MILESTONES = [
    {
      year: "2025",
      title: c.f045,
      description: c.f046,
    },
    {
      year: "Q1 2025",
      title: c.f047,
      description: c.f048,
    },
    {
      year: "Q2 2025",
      title: c.f049,
      description: c.f050,
    },
    {
      year: "2025+",
      title: c.f051,
      description: c.f052,
    },
  ];
  const SERVICES = [
    { icon: Layers, label: c.f053 },
    { icon: Wrench, label: c.f054 },
    { icon: Car, label: c.f055 },
    { icon: BrickWall, label: c.f056 },
    { icon: BrickWall, label: c.f057 },
    { icon: Droplets, label: c.f058 },
    { icon: PaintRoller, label: c.f059 },
    { icon: Grid2x2, label: c.f060 },
    { icon: Brush, label: c.f061 },
    { icon: Building2, label: c.f062 },
  ];
  const VALUES = [
    {
      icon: Target,
      title: c.f063,
      description: c.f064,
    },
    {
      icon: ShieldCheck,
      title: c.f065,
      description: c.f066,
    },
    {
      icon: MessageSquare,
      title: c.f067,
      description: c.f068,
    },
    {
      icon: Handshake,
      title: c.f069,
      description: c.f070,
    },
    {
      icon: HardHat,
      title: c.f071,
      description: c.f072,
    },
    {
      icon: TrendingUp,
      title: c.f073,
      description: c.f074,
    },
  ];
  const AUDIENCES = [
    {
      icon: Building2,
      title: c.f075,
      description: c.f076,
      link: "/for-general-contractors",
    },
    {
      icon: Users,
      title: c.f077,
      description: c.f078,
      link: "/markets",
    },
    {
      icon: Award,
      title: c.f079,
      description: c.f080,
      link: "/markets",
    },
    {
      icon: ClipboardList,
      title: c.f081,
      description: c.f082,
      link: "/markets",
    },
  ];
  const PROCESS_STEPS = [
    {
      number: "01",
      title: c.f083,
      description: c.f084,
    },
    {
      number: "02",
      title: c.f085,
      description: c.f086,
    },
    {
      number: "03",
      title: c.f087,
      description: c.f088,
    },
    {
      number: "04",
      title: c.f089,
      description: c.f090,
    },
    {
      number: "05",
      title: c.f091,
      description: c.f092,
    },
  ];

  const { data: aboutRow } = usePublicSettings<Partial<AboutContent>>(
    "about_page_settings",
  );
  const content = useAboutDetails(resolveAboutContent(aboutRow));
  usePageAnalytics("about");

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: c.f001, url: "/" },
    { name: c.f002, url: "/about" },
  ]);

  const processSchema = generateHowToSchema({
    name: c.f003,
    description: c.f004,
    steps: PROCESS_STEPS.map((s) => ({ name: s.title, text: s.description })),
  });

  return (
    <div className="min-h-screen">
      <SEO
        title={c.f005}
        description={c.f006}
        keywords="about Ascent Group, building envelope contractor, specialty contractor Ontario, restoration company, GTA contractor"
        canonical={`${SITE_URL}/about`}
        structuredData={[
          breadcrumbSchema,
          processSchema,
          generateFAQSchema(aboutFaqs),
        ]}
      />
      <Navigation />

      {/* ── 1. Hero ──────────────────────────────────────────────────────── */}
      <PageHero
        eyebrow={c.f007}
        title={content.hero_headline}
        description={content.hero_intro}
        image={mainPageHeroes.about}
        imageAlt={c.f008}
        height="large"
        stats={content.stats}
        primaryCta={{ text: c.f009, href: "/submit-rfp" }}
        secondaryCta={{ text: c.f010, href: "/contact" }}
        breadcrumbs={[{ label: c.f011, href: "/" }, { label: c.f012 }]}
      />

      <TrustRibbon />

      <TabbedSections
        sections={[
          {
            id: "story",
            label: c.f013,
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
                        {c.f014}
                      </span>
                      <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-6 leading-tight">
                        {content.story_headline
                          .split("\n")
                          .map((line, index) => (
                            <span key={index}>
                              {index > 0 && <br />}
                              {line}
                            </span>
                          ))}
                      </h2>
                      {content.story_content.map((paragraph, index) => (
                        <p
                          key={index}
                          className={
                            index === 0
                              ? "text-lg text-muted-foreground leading-relaxed mb-4"
                              : index === content.story_content.length - 1
                                ? "text-base text-muted-foreground leading-relaxed"
                                : "text-base text-muted-foreground leading-relaxed mb-4"
                          }
                        >
                          {paragraph}
                        </p>
                      ))}
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
                    title={c.f015}
                    description={c.f016}
                    badge="Timeline"
                    maxWidth="md"
                  />
                  <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
                    {MILESTONES.map((m) => (
                      <Card
                        key={`${m.year}-${m.title}`}
                        variant="elevated"
                        size="md"
                      >
                        <div className="flex items-center gap-2 mb-3">
                          <Calendar className="w-4 h-4 text-primary" />
                          <span className="text-sm font-bold text-primary">
                            {m.year}
                          </span>
                        </div>
                        <h3 className="text-base font-semibold mb-2">
                          {m.title}
                        </h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {m.description}
                        </p>
                      </Card>
                    ))}
                  </div>
                </Section>

                {/* Proof Strip */}
                <Section size="tight">
                  <ProofStrip
                    items={[
                      { value: "15+", label: c.f017 },
                      { value: "$2M", label: c.f019 },
                      { value: "100%", label: c.f020 },
                      { value: "85%", label: c.f021 },
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
            label: c.f022,
            icon: UserCircle,
            content: (
              <section className="w-full bg-[hsl(var(--ink))] py-20 md:py-28">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                  <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center">
                    <div>
                      <span className="text-sm font-semibold uppercase tracking-wider text-[hsl(var(--accent))] mb-3 block">
                        {c.f023}
                      </span>
                      <h2 className="text-3xl md:text-4xl font-bold text-white mb-1">
                        {content.founder_name}
                      </h2>
                      <p className="text-[hsl(var(--accent))] font-medium mb-6">
                        {content.founder_title}
                      </p>
                      {content.founder_bio
                        .split(/\n\s*\n/)
                        .map((paragraph, index) => (
                          <p
                            key={index}
                            className={
                              index === 0
                                ? "text-white/80 leading-relaxed mb-4 text-base"
                                : "text-white/70 leading-relaxed text-base mb-8"
                            }
                          >
                            {paragraph}
                          </p>
                        ))}
                      <div className="space-y-2">
                        {founderBio.credentials.map((cred, i) => (
                          <div
                            key={i}
                            className="flex items-center gap-2 text-white/70 text-sm"
                          >
                            <CheckCircle className="w-4 h-4 text-[hsl(var(--accent))] flex-shrink-0" />
                            <span>{cred}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="border-l-4 border-[hsl(var(--accent))] pl-8 py-2">
                      {content.founder_image_url && (
                        <img
                          src={content.founder_image_url}
                          alt={content.founder_name}
                          className="w-full rounded-lg mb-6"
                          loading="lazy"
                        />
                      )}
                      <p className="text-2xl md:text-3xl font-semibold text-white leading-snug italic mb-8">
                        {content.founder_quote}
                      </p>
                      <p className="text-white/80 text-sm uppercase tracking-wider">
                        {content.founder_name} · {content.founder_title}
                      </p>
                    </div>
                  </div>
                </div>
              </section>
            ),
          },
          {
            id: "values",
            label: c.f024,
            icon: Heart,
            content: (
              <Section size="major">
                <SectionHeader
                  title={c.f025}
                  description={c.f026}
                  badge="Our Values"
                />
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {VALUES.map(({ icon: Icon, title, description }, i) => (
                    <Card key={i} variant="elevated" size="md" hover>
                      <div className="p-2 bg-primary/10 rounded-lg w-fit mb-4">
                        <Icon className="w-5 h-5 text-primary" />
                      </div>
                      <h3 className="text-lg font-semibold mb-2">{title}</h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        {description}
                      </p>
                    </Card>
                  ))}
                </div>
              </Section>
            ),
          },
          {
            id: "capabilities",
            label: c.f027,
            icon: Wrench,
            content: (
              <>
                <Section size="major">
                  <SectionHeader
                    title={c.f028}
                    description={c.f029}
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
                        {c.f030} <ArrowRight className="ml-2 w-4 h-4" />
                      </Link>
                    </Button>
                  </div>
                </Section>

                <Section size="major" className="bg-muted/30">
                  <SectionHeader
                    title={c.f031}
                    description={c.f032}
                    badge="Clients"
                  />
                  <div className="grid sm:grid-cols-2 gap-6">
                    {AUDIENCES.map(
                      ({ icon: Icon, title, description, link }, i) => (
                        <Card key={i} variant="elevated" size="lg" hover>
                          <div className="flex items-start gap-4">
                            <div className="p-3 bg-primary/10 rounded-xl flex-shrink-0">
                              <Icon className="w-6 h-6 text-primary" />
                            </div>
                            <div>
                              <h3 className="text-xl font-semibold mb-2">
                                {title}
                              </h3>
                              <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                                {description}
                              </p>
                              <Link
                                to={link}
                                className="text-primary text-sm font-medium hover:underline inline-flex items-center gap-1"
                              >
                                {c.f033} <ArrowRight className="w-3.5 h-3.5" />
                              </Link>
                            </div>
                          </div>
                        </Card>
                      ),
                    )}
                  </div>
                </Section>

                <Section size="major">
                  <SectionHeader
                    title={c.f034}
                    description={c.f035}
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
                        <div
                          className={
                            index < PROCESS_STEPS.length - 1 ? "pb-10" : "pb-0"
                          }
                        >
                          <h3 className="text-lg font-semibold mb-2 mt-2.5">
                            {step.title}
                          </h3>
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
                        {c.f036} <ArrowRight className="ml-2 w-4 h-4" />
                      </Link>
                    </Button>
                  </div>
                </Section>
              </>
            ),
          },
          {
            id: "service-areas",
            label: c.f037,
            icon: Map,
            content: (
              <Section size="major">
                <div className="max-w-4xl mx-auto text-center">
                  <span className="text-sm font-semibold uppercase tracking-wider text-primary mb-3 block">
                    {c.f038}
                  </span>
                  <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
                    {c.f039}
                  </h2>
                  <p className="text-lg text-muted-foreground mb-10 max-w-2xl mx-auto">
                    {c.f040} <strong>{c.f041}</strong>
                    {c.f042}
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
          title={c.f043}
          description={c.f044}
          badge="FAQ"
          maxWidth="md"
        />
        <div className="max-w-3xl mx-auto">
          <FAQAccordion faqs={aboutFaqs} />
        </div>
      </Section>

      {/* ── 10. Start a Project (unified CTA band) ───────────────────────── */}
      <StartProjectCTA />

      <Footer />
    </div>
  );
};

export default About;
