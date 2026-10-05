import { usePageContent } from "@/hooks/usePageContent";
import contentModule from "@/content/pages/commercial-clients";
import { TYPOGRAPHY_STYLES } from "@/design-system/constants";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { PageHero } from "@/components/shared/PageHero";
import { Section } from "@/components/sections/Section";
import { SectionHeader } from "@/design-system/components/SectionHeader";
import { CapabilityCard } from "@/design-system/components/CapabilityCard";
import { CTABand } from "@/design-system/components/CTABand";
import { Card } from "@/design-system/components/Card";
import { TrustRibbon } from "@/design-system/components/TrustRibbon";
import { FAQAccordion } from "@/design-system/components/FAQAccordion";
import { RelatedLinksGrid } from "@/design-system/components/RelatedLinksGrid";
import {
  OperationalProofBar,
  DEFAULT_PROOF_ITEMS,
} from "@/components/proof/OperationalProofBar";
import {
  Timer,
  ShieldCheck,
  Users,
  Moon,
  CheckCircle,
  Building2,
  Zap,
  ClipboardCheck,
  FileText,
  Wrench,
  FolderCheck,
  Ban,
  AlertTriangle,
  Building,
} from "lucide-react";
import { audienceHeroes } from "@/data/hero-images";
import { useSharedFaqs } from "@/hooks/useSharedContent";

const CommercialClients = () => {
  const commercialClientsFaqs = useSharedFaqs("commercialClientsFaqs");
  const c = usePageContent(contentModule);

  const benefits = [
    {
      icon: Moon,
      title: c.f001,
      description: c.f002,
    },
    {
      icon: Timer,
      title: c.f003,
      description: c.f004,
    },
    {
      icon: ShieldCheck,
      title: c.f005,
      description: c.f006,
    },
    {
      icon: Users,
      title: c.f007,
      description: c.f008,
    },
    {
      icon: Zap,
      title: c.f009,
      description: c.f010,
    },
  ];

  const industries = [
    {
      title: c.f011,
      description: c.f012,
      features: [c.f013, c.f014, c.f015, c.f016],
    },
    {
      title: c.f017,
      description: c.f018,
      features: [c.f019, c.f020, c.f021, c.f022],
    },
    {
      title: c.f023,
      description: c.f024,
      features: [c.f025, c.f026, c.f027, c.f028],
    },
    {
      title: c.f029,
      description: c.f030,
      features: [c.f031, c.f032, c.f033, c.f034],
    },
  ];

  const processSteps = [
    {
      icon: ClipboardCheck,
      title: c.f035,
      description: c.f036,
    },
    {
      icon: FileText,
      title: c.f037,
      description: c.f038,
    },
    {
      icon: Wrench,
      title: c.f039,
      description: c.f040,
    },
    {
      icon: FolderCheck,
      title: c.f041,
      description: c.f042,
    },
  ];

  return (
    <div className="min-h-screen">
      <SEO
        title={c.f043}
        description={c.f044}
        keywords="commercial envelope contractor, office building restoration, retail property repairs, industrial waterproofing, commercial facade repair GTA, Toronto commercial contractor"
      />
      <Navigation />

      <PageHero
        eyebrow={c.f045}
        title={c.f046}
        description={c.f047}
        image={audienceHeroes["commercial-clients"]}
        imageAlt={c.f048}
        primaryCta={{ text: c.f049, href: "/estimate" }}
        breadcrumbs={[{ label: c.f050, href: "/" }, { label: c.f051 }]}
        badges={[
          { icon: Moon, text: c.f052 },
          { icon: Ban, text: c.f053 },
          { icon: ShieldCheck, text: c.f054 },
        ]}
      />

      <TrustRibbon />

      <main>
        {/* Benefits */}
        <Section size="major">
          <SectionHeader title={c.f055} description={c.f056} />
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((b, index) => (
              <CapabilityCard
                key={index}
                icon={b.icon}
                title={b.title}
                description={b.description}
              />
            ))}
          </div>
        </Section>

        {/* Industries */}
        <Section size="major" className="bg-muted/30">
          <SectionHeader title={c.f057} description={c.f058} />
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {industries.map((industry, index) => (
              <Card key={index} variant="elevated" size="lg">
                <div className="flex items-start gap-3 mb-3">
                  <Building2 className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                  <h3 className={`${TYPOGRAPHY_STYLES.cardTitle} text-primary`}>
                    {industry.title}
                  </h3>
                </div>
                <p className="text-muted-foreground mb-4">
                  {industry.description}
                </p>
                <ul className="space-y-2">
                  {industry.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            ))}
          </div>
        </Section>

        {/* Process */}
        <Section size="major">
          <SectionHeader title={c.f059} description={c.f060} />
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {processSteps.map((step, index) => (
              <CapabilityCard
                key={index}
                icon={step.icon}
                title={step.title}
                description={step.description}
              />
            ))}
          </div>
        </Section>

        {/* Operational Proof */}
        <OperationalProofBar
          items={[
            DEFAULT_PROOF_ITEMS[3], // Schedule Coordination
            DEFAULT_PROOF_ITEMS[0], // Self-Performed Scopes
            DEFAULT_PROOF_ITEMS[1], // WSIB & CGL
            DEFAULT_PROOF_ITEMS[4], // Documentation & Closeout
          ]}
          title={c.f061}
          description={c.f062}
        />

        {/* FAQs */}
        <Section size="major" maxWidth="narrow">
          <SectionHeader
            badge="Commercial FAQs"
            title={c.f063}
            description={c.f064}
          />
          <FAQAccordion faqs={commercialClientsFaqs} />
        </Section>

        {/* CTA */}
        <CTABand
          title={c.f065}
          description={c.f066}
          primaryCta={{ text: c.f067, href: "/estimate" }}
          secondaryCta={{ text: c.f068, href: "/contact" }}
          variant="dark"
        />

        {/* Related links */}
        <RelatedLinksGrid
          title={c.f069}
          links={[
            {
              icon: Building,
              title: c.f070,
              description: c.f071,
              href: "/property-managers",
            },
            {
              icon: AlertTriangle,
              title: c.f072,
              description: c.f073,
              href: "/emergency-repair",
            },
            {
              icon: Wrench,
              title: c.f074,
              description: c.f075,
              href: "/services",
            },
          ]}
        />
      </main>

      <Footer />
    </div>
  );
};

export default CommercialClients;
