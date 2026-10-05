import { usePageContent } from "@/hooks/usePageContent";
import contentModule from "@/content/pages/company-developers";
import { TYPOGRAPHY_STYLES } from "@/design-system/constants";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { PageHero } from "@/components/shared/PageHero";
import SEO from "@/components/SEO";
import { Section } from "@/components/sections/Section";
import { SectionHeader } from "@/design-system/components/SectionHeader";
import { CapabilityCard } from "@/design-system/components/CapabilityCard";
import { CTABand } from "@/design-system/components/CTABand";
import { Card } from "@/design-system/components/Card";
import { Button } from "@/ui/Button";
import { Link } from "react-router-dom";
import { TrustRibbon } from "@/design-system/components/TrustRibbon";
import { FAQAccordion } from "@/design-system/components/FAQAccordion";
import { RelatedLinksGrid } from "@/design-system/components/RelatedLinksGrid";
import { useSharedFaqs } from "@/hooks/useSharedContent";
import {
  ShieldCheck,
  Calendar,
  TrendingUp,
  CheckCircle,
  Award,
  FileText,
  Users,
  Briefcase,
  Building2,
} from "lucide-react";
import { audienceHeroes } from "@/data/hero-images";

const Developers = () => {
  const developersFaqs = useSharedFaqs("developersFaqs");
  const c = usePageContent(contentModule);

  const benefits = [
    {
      icon: ShieldCheck,
      title: c.f001,
      description: c.f002,
    },
    {
      icon: Award,
      title: c.f003,
      description: c.f004,
    },
    {
      icon: Calendar,
      title: c.f005,
      description: c.f006,
    },
    {
      icon: TrendingUp,
      title: c.f007,
      description: c.f008,
    },
  ];

  const services = [
    {
      title: c.f009,
      description: c.f010,
      details: [c.f011, c.f012, c.f013, c.f014],
    },
    {
      title: c.f015,
      description: c.f016,
      details: [c.f017, c.f018, c.f019, c.f020],
    },
    {
      title: c.f021,
      description: c.f022,
      details: [c.f023, c.f024, c.f025, c.f026],
    },
  ];

  const process = [
    {
      icon: FileText,
      title: c.f027,
      description: c.f028,
    },
    {
      icon: CheckCircle,
      title: c.f029,
      description: c.f030,
    },
    {
      icon: Users,
      title: c.f031,
      description: c.f032,
    },
    {
      icon: Award,
      title: c.f033,
      description: c.f034,
    },
  ];

  return (
    <>
      <SEO
        title={c.f035}
        description={c.f036}
        canonical="/company/developers"
      />
      <div className="min-h-screen flex flex-col">
        <Navigation />

        <PageHero
          eyebrow={c.f037}
          title={c.f038}
          description={c.f039}
          image={audienceHeroes.developers}
          imageAlt={c.f040}
          breadcrumbs={[
            { label: c.f041, href: "/" },
            { label: c.f042, href: "/about" },
            { label: c.f043 },
          ]}
          primaryCta={{ text: c.f044, href: "/contact" }}
          height="medium"
        />

        <TrustRibbon />

        <main>
          {/* Why Partner Section */}
          <Section size="major">
            <SectionHeader title={c.f045} description={c.f046} />
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
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

          {/* Services Section */}
          <Section size="major" className="bg-muted/30">
            <SectionHeader title={c.f047} description={c.f048} />
            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {services.map((service, index) => (
                <Card key={index} variant="elevated" size="lg">
                  <h3
                    className={`${TYPOGRAPHY_STYLES.cardTitle} mb-3 text-primary`}
                  >
                    {service.title}
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    {service.description}
                  </p>
                  <ul className="space-y-2">
                    {service.details.map((detail, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                        <span className="text-sm">{detail}</span>
                      </li>
                    ))}
                  </ul>
                </Card>
              ))}
            </div>
          </Section>

          {/* Process Section */}
          <Section size="major">
            <SectionHeader title={c.f049} description={c.f050} />
            <div className="grid md:grid-cols-4 gap-6 max-w-6xl mx-auto">
              {process.map((item, index) => (
                <CapabilityCard
                  key={index}
                  icon={item.icon}
                  title={item.title}
                  description={item.description}
                />
              ))}
            </div>
          </Section>

          {/* Documentation Section */}
          <Section size="major" className="bg-muted/30">
            <div className="max-w-4xl mx-auto">
              <Card
                variant="elevated"
                size="lg"
                className="border-l-4 border-l-primary"
              >
                <div className="flex flex-col md:flex-row gap-8 items-start">
                  <div className="w-20 h-20 bg-primary/10 rounded-[var(--radius-lg)] flex items-center justify-center shrink-0">
                    <FileText className="w-10 h-10 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-3xl font-bold mb-4">{c.f051}</h2>
                    <p className="text-muted-foreground mb-6 text-lg">
                      {c.f052}
                    </p>
                    <div className="grid sm:grid-cols-2 gap-3 mb-8">
                      {[c.f053, c.f054, c.f055, c.f056, c.f057, c.f058].map(
                        (item, idx) => (
                          <div key={idx} className="flex items-center gap-2">
                            <CheckCircle className="w-5 h-5 text-primary shrink-0" />
                            <span className="text-sm">{item}</span>
                          </div>
                        ),
                      )}
                    </div>
                    <Button size="lg" asChild className="w-full sm:w-auto">
                      <Link to="/resources/contractor-portal">
                        <FileText className="mr-2 w-5 h-5" />
                        {c.f059}
                      </Link>
                    </Button>
                  </div>
                </div>
              </Card>
            </div>
          </Section>

          {/* FAQ */}
          <Section size="subsection" className="bg-muted/30">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-4">{c.f060}</h2>
              <p className="text-center text-muted-foreground mb-8">{c.f061}</p>
              <FAQAccordion faqs={developersFaqs} />
            </div>
          </Section>

          {/* Related Resources */}
          <RelatedLinksGrid
            title={c.f062}
            description={c.f063}
            links={[
              {
                title: c.f064,
                description: c.f065,
                href: "/capabilities",
                icon: Building2,
              },
              {
                title: c.f066,
                description: c.f067,
                href: "/company/certifications-insurance",
                icon: Award,
              },
              {
                title: c.f068,
                description: c.f069,
                href: "/resources/contractor-portal",
                icon: Briefcase,
              },
            ]}
          />

          {/* Contact CTA */}
          <CTABand
            title={c.f070}
            description={c.f071}
            primaryCta={{ text: c.f072, href: "/contact" }}
            secondaryCta={{ text: c.f073, href: "/contact" }}
            variant="dark"
          />
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Developers;
