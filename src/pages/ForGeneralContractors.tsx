import { useIntakeEnabled } from "@/hooks/useIntakeEnabled";
import { usePageContent } from "@/hooks/usePageContent";
import contentModule from "@/content/pages/for-general-contractors";
import { SITE_URL } from "@/constants/company";
import SEO from "@/components/SEO";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { PageHero } from "@/components/shared/PageHero";
import { EmailLink } from "@/components/EmailLink";
import { PhoneLink } from "@/components/shared/PhoneLink";
import { Card } from "@/design-system/components/Card";
import { Section } from "@/components/sections/Section";
import {
  OperationalProofBar,
  DEFAULT_PROOF_ITEMS,
} from "@/components/proof/OperationalProofBar";
import { SectionHeader } from "@/design-system/components/SectionHeader";
import { CapabilityCard } from "@/design-system/components/CapabilityCard";
import { CardGrid } from "@/components/shared/CardGrid";
import { ProcessStepCard } from "@/components/unified";
import { Button } from "@/ui/Button";
import { CTA_TEXT } from "@/design-system/constants";
import {
  CheckCircle,
  Clock,
  Shield,
  FileText,
  Users,
  Wrench,
  Download,
  Mail,
  Phone,
  AlertTriangle,
  Building,
  ClipboardCheck,
} from "lucide-react";
import { Link } from "react-router-dom";
import { audienceHeroes } from "@/data/hero-images";
import { TrustRibbon } from "@/design-system/components/TrustRibbon";
import { FAQAccordion } from "@/design-system/components/FAQAccordion";
import { RelatedLinksGrid } from "@/design-system/components/RelatedLinksGrid";
import { useSharedFaqs } from "@/hooks/useSharedContent";

const ForGeneralContractors = () => {
  const generalContractorsFaqs = useSharedFaqs("generalContractorsFaqs");
  const c = usePageContent(contentModule);
  const intakeV2 = useIntakeEnabled();

  const tradePackages = [
    c.f001,
    c.f002,
    c.f003,
    c.f004,
    c.f005,
    c.f006,
    c.f007,
    c.f008,
    c.f009,
  ];

  const whyWorkWithUs = [
    {
      icon: Clock,
      title: c.f010,
      description: c.f011,
    },
    {
      icon: Users,
      title: c.f012,
      description: c.f013,
    },
    {
      icon: Shield,
      title: c.f014,
      description: c.f015,
    },
    {
      icon: FileText,
      title: c.f016,
      description: c.f017,
    },
    {
      icon: CheckCircle,
      title: c.f018,
      description: c.f019,
    },
    {
      icon: Wrench,
      title: c.f020,
      description: c.f021,
    },
  ];

  const processSteps = [
    {
      step: "1",
      title: c.f022,
      description: c.f023,
      icon: FileText,
    },
    {
      step: "2",
      title: c.f024,
      description: c.f025,
      icon: CheckCircle,
    },
    {
      step: "3",
      title: c.f026,
      description: c.f027,
      icon: Users,
    },
    {
      step: "4",
      title: c.f028,
      description: c.f029,
      icon: Wrench,
    },
    {
      step: "5",
      title: c.f030,
      description: c.f031,
      icon: Shield,
    },
  ];

  return (
    <>
      <SEO
        title={c.f032}
        description={c.f033}
        keywords="general contractor partner, trade subcontractor, envelope trades, GTA subcontractor, unit pricing, tender packages"
        canonical={`${SITE_URL}/for-general-contractors`}
      />
      <Navigation />

      <PageHero
        title={c.f034}
        description={c.f035}
        image={audienceHeroes["for-general-contractors"]}
        imageAlt={c.f036}
        height="large"
        primaryCta={{
          text: CTA_TEXT.gc,
          href: intakeV2 ? "/contact?request=bid_invitation" : "#contact",
        }}
        breadcrumbs={[{ label: c.f037, href: "/" }, { label: c.f038 }]}
      />

      <main className="min-h-screen bg-background">
        <TrustRibbon />

        {/* Trade Packages Section */}
        <Section
          size="major"
          className="scroll-mt-20"
          data-section="trade-packages"
        >
          <SectionHeader title={c.f039} description={c.f040} />

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
            {tradePackages.map((pkg, index) => (
              <Card
                key={index}
                variant="default"
                size="sm"
                className="flex items-start gap-3"
              >
                <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <span>{pkg}</span>
              </Card>
            ))}
          </div>

          <div className="mt-8 p-6 bg-muted/50 rounded-lg max-w-3xl mx-auto text-center">
            <p className="text-sm text-muted-foreground mb-2">
              <strong className="text-foreground">{c.f041}</strong>
            </p>
            <p className="text-muted-foreground">{c.f042}</p>
          </div>
        </Section>

        {/* Why Work With Us */}
        <Section size="major" className="bg-muted/30">
          <SectionHeader title={c.f043} description={c.f044} />

          <CardGrid columns={3} stagger="standard">
            {whyWorkWithUs.map((item, index) => (
              <CapabilityCard
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
          <SectionHeader title={c.f045} description={c.f046} />

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

        {/* Credentials Section */}
        <Section size="major" className="bg-primary/5">
          <Card
            variant="elevated"
            size="lg"
            className="border-l-4 border-l-primary max-w-4xl mx-auto"
          >
            <h3 className="text-2xl md:text-3xl font-semibold mb-4">
              {c.f047}
            </h3>
            <p className="text-lg text-muted-foreground mb-6">{c.f048}</p>
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                <div>
                  <strong className="text-foreground">{c.f049}</strong>
                  <p className="text-sm text-muted-foreground">{c.f050}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                <div>
                  <strong className="text-foreground">{c.f051}</strong>
                  <p className="text-sm text-muted-foreground">{c.f052}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                <div>
                  <strong className="text-foreground">{c.f053}</strong>
                  <p className="text-sm text-muted-foreground">{c.f054}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                <div>
                  <strong className="text-foreground">{c.f055}</strong>
                  <p className="text-sm text-muted-foreground">{c.f056}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                <div>
                  <strong className="text-foreground">{c.f057}</strong>
                  <p className="text-sm text-muted-foreground">{c.f058}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                <div>
                  <strong className="text-foreground">{c.f059}</strong>
                  <p className="text-sm text-muted-foreground">{c.f060}</p>
                </div>
              </div>
            </div>
            <p className="text-muted-foreground">{c.f061}</p>
          </Card>
        </Section>

        {/* Building Credentials Section */}
        <Section size="major" maxWidth="narrow" className="bg-muted/30">
          <Card
            variant="elevated"
            size="lg"
            className="border-l-4 border-l-primary"
          >
            <h3 className="text-2xl font-semibold mb-4 flex items-center gap-3">
              <Download className="w-6 h-6 text-primary" />
              {c.f062}
            </h3>
            <p className="text-muted-foreground mb-6">{c.f063}</p>
            <ul className="space-y-2 mb-6">
              <li className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <span>{c.f064}</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <span>{c.f065}</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <span>{c.f066}</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <span>{c.f067}</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <span>{c.f068}</span>
              </li>
            </ul>
            <Button asChild size="lg">
              <Link to="/resources/contractor-portal">{c.f069}</Link>
            </Button>
          </Card>
        </Section>

        {/* Operational Proof */}
        <OperationalProofBar
          items={[
            DEFAULT_PROOF_ITEMS[0], // Self-Performed Scopes
            DEFAULT_PROOF_ITEMS[3], // Schedule Coordination
            DEFAULT_PROOF_ITEMS[4], // Documentation & Closeout
            DEFAULT_PROOF_ITEMS[1], // WSIB & CGL
          ]}
          title={c.f070}
          description={c.f071}
        />

        {/* Contact Section */}
        <Section
          size="major"
          maxWidth="narrow"
          className="scroll-mt-20"
          data-section="contact"
        >
          <SectionHeader title={c.f072} description={c.f073} />

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <Card variant="interactive" hover size="md" className="text-center">
              <Phone className="w-8 h-8 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">{c.f074}</h3>
              <PhoneLink
                showIcon={false}
                className="text-primary hover:underline"
              />
            </Card>

            <Card variant="interactive" hover size="md" className="text-center">
              <FileText className="w-8 h-8 text-primary mx-auto mb-4" />
              <h3 className="text-xl md:text-2xl font-semibold mb-2">
                {c.f075}
              </h3>
              <p className="text-muted-foreground mb-4 text-sm">{c.f076}</p>
              <Button asChild className="w-full">
                <Link to="/contact">{c.f077}</Link>
              </Button>
            </Card>
          </div>

          <div className="p-6 bg-muted/50 rounded-lg">
            <p className="text-sm font-semibold mb-2">{c.f078}</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center text-muted-foreground">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <EmailLink
                  encoded={btoa("projects@ascentgroupconstruction.com")}
                  className="hover:text-primary transition-colors inline"
                  showIcon={false}
                />
              </div>
              <div className="hidden sm:block text-muted-foreground">|</div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                <PhoneLink
                  showIcon={false}
                  className="hover:text-primary transition-colors"
                />
              </div>
            </div>
          </div>
        </Section>

        {/* FAQs */}
        <Section size="major" maxWidth="narrow" className="bg-muted/30">
          <SectionHeader title={c.f079} description={c.f080} />
          <FAQAccordion faqs={generalContractorsFaqs} />
        </Section>

        {/* Related */}
        <RelatedLinksGrid
          title={c.f081}
          links={[
            {
              icon: ClipboardCheck,
              title: c.f082,
              description: c.f083,
              href: "/prequalification",
            },
            {
              icon: Building,
              title: c.f084,
              description: c.f085,
              href: "/capabilities",
            },
            {
              icon: AlertTriangle,
              title: c.f086,
              description: c.f087,
              href: "/emergency-repair",
            },
          ]}
        />
      </main>
      <Footer />
    </>
  );
};

export default ForGeneralContractors;
