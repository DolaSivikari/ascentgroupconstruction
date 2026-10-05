import { usePageContent } from "@/hooks/usePageContent";
import contentModule from "@/content/pages/property-managers";
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
  Building2,
  TrendingUp,
  Users,
  Calendar,
  ShieldCheck,
  Timer,
  CreditCard,
  FileText,
  Zap,
  AlertTriangle,
  HardHat,
  Wrench,
} from "lucide-react";
import { audienceHeroes } from "@/data/hero-images";
import { useSharedFaqs } from "@/hooks/useSharedContent";

const PropertyManagers = () => {
  const propertyManagersFaqs = useSharedFaqs("propertyManagersFaqs");
  const c = usePageContent(contentModule);

  const benefits = [
    {
      icon: CreditCard,
      title: c.f001,
      description: c.f002,
    },
    {
      icon: Calendar,
      title: c.f003,
      description: c.f004,
    },
    {
      icon: Users,
      title: c.f005,
      description: c.f006,
    },
    {
      icon: ShieldCheck,
      title: c.f007,
      description: c.f008,
    },
    {
      icon: Timer,
      title: c.f009,
      description: c.f010,
    },
  ];

  const services = [
    {
      title: c.f011,
      description: c.f012,
      roi: "Stop water intrusion, pass RSF requirements",
    },
    {
      title: c.f013,
      description: c.f014,
      roi: "Extend structural life 15-20 years",
    },
    {
      title: c.f015,
      description: c.f016,
      roi: "Minimize vacancy downtime",
    },
    {
      title: c.f017,
      description: c.f018,
      roi: "Enhance tenant satisfaction",
    },
    {
      title: c.f019,
      description: c.f020,
      roi: "Prevent $200K+ emergency repairs",
    },
    {
      title: c.f021,
      description: c.f022,
      roi: "Eliminate unit complaints",
    },
  ];

  const processSteps = [
    { step: "1", title: c.f023, desc: "We inspect and provide detailed quote" },
    { step: "2", title: c.f024, desc: "Flexible timing around your tenants" },
    { step: "3", title: c.f025, desc: "Professional work with daily updates" },
    { step: "4", title: c.f026, desc: "Final inspection and documentation" },
  ];

  return (
    <div className="min-h-screen">
      <SEO
        title={c.f027}
        description={c.f028}
        keywords="property management contractor, condo restoration GTA, facade remediation Toronto, parking garage repair, multi-residential contractor, reserve fund study contractor"
      />
      <Navigation />

      <PageHero
        eyebrow={c.f029}
        title={c.f030}
        description={c.f031}
        image={audienceHeroes["property-managers"]}
        imageAlt={c.f032}
        primaryCta={{ text: c.f033, href: "/contact" }}
        breadcrumbs={[{ label: c.f034, href: "/" }, { label: c.f035 }]}
        badges={[
          { icon: CreditCard, text: c.f036 },
          { icon: Zap, text: c.f037 },
          { icon: FileText, text: c.f038 },
        ]}
      />

      <TrustRibbon />

      <main>
        {/* Benefits */}
        <Section size="major">
          <SectionHeader title={c.f039} description={c.f040} />
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <CapabilityCard
                key={index}
                icon={benefit.icon}
                title={benefit.title}
                description={benefit.description}
              />
            ))}
          </div>
        </Section>

        {/* Services with ROI */}
        <Section size="major" className="bg-muted/30">
          <SectionHeader title={c.f041} description={c.f042} />
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {services.map((service, index) => (
              <Card
                key={index}
                variant="elevated"
                size="md"
                className="border-l-4 border-l-primary"
              >
                <div className="flex items-start justify-between mb-3">
                  <h3 className={`${TYPOGRAPHY_STYLES.cardTitle} text-primary`}>
                    {service.title}
                  </h3>
                  <TrendingUp className="w-6 h-6 text-muted-foreground flex-shrink-0" />
                </div>
                <p className="text-muted-foreground mb-4">
                  {service.description}
                </p>
                <div className="inline-block px-4 py-2 bg-muted/50 rounded-lg">
                  <span className="text-sm font-bold text-primary">
                    {service.roi}
                  </span>
                </div>
              </Card>
            ))}
          </div>
        </Section>

        {/* Process */}
        <Section size="major">
          <SectionHeader title={c.f043} />
          <div className="grid md:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {processSteps.map((item, index) => (
              <Card
                key={index}
                variant="elevated"
                size="md"
                className="text-center"
              >
                <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                  {item.step}
                </div>
                <h3 className="font-bold mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </Card>
            ))}
          </div>
        </Section>

        {/* Operational Proof */}
        <OperationalProofBar
          items={[
            DEFAULT_PROOF_ITEMS[2], // Occupied-Building Experience
            DEFAULT_PROOF_ITEMS[4], // Documentation & Closeout
            DEFAULT_PROOF_ITEMS[3], // Schedule Coordination
            DEFAULT_PROOF_ITEMS[1], // WSIB & CGL
          ]}
          title={c.f044}
          description={c.f045}
        />

        {/* FAQs (emits FAQPage JSON-LD) */}
        <Section size="major" maxWidth="narrow">
          <SectionHeader
            badge="Property Manager FAQs"
            title={c.f046}
            description={c.f047}
          />
          <FAQAccordion faqs={propertyManagersFaqs} />
        </Section>

        {/* CTA */}
        <CTABand
          title={c.f048}
          description={c.f049}
          primaryCta={{ text: c.f050, href: "/contact" }}
          secondaryCta={{ text: c.f051, href: "/contact" }}
          variant="dark"
        />

        {/* Related links */}
        <RelatedLinksGrid
          title={c.f052}
          links={[
            {
              icon: AlertTriangle,
              title: c.f053,
              description: c.f054,
              href: "/emergency-repair",
            },
            {
              icon: Wrench,
              title: c.f055,
              description: c.f056,
              href: "/services",
            },
            {
              icon: HardHat,
              title: c.f057,
              description: c.f058,
              href: "/capabilities",
            },
          ]}
        />
      </main>

      <Footer />
    </div>
  );
};

export default PropertyManagers;
