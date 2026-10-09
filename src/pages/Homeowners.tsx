import { usePageContent } from "@/hooks/usePageContent";
import contentModule from "@/content/pages/homeowners";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { PageHero } from "@/components/shared/PageHero";
import { Section } from "@/components/sections/Section";
import { SectionHeader } from "@/design-system/components/SectionHeader";
import { CapabilityCard } from "@/design-system/components/CapabilityCard";
import { CTABand } from "@/design-system/components/CTABand";
import { Button } from "@/ui/Button";
import { Badge } from "@/components/ui/badge";
import {
  Home,
  Paintbrush,
  Hammer,
  Droplets,
  Square,
  Shield,
  CheckCircle,
  DollarSign,
  Award,
  Clock,
  User,
} from "lucide-react";
import { Link } from "react-router-dom";
import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { StaggerContainer } from "@/components/animations/StaggerContainer";
import { audienceHeroes } from "@/data/hero-images";
import { usePageAnalytics } from "@/hooks/usePageAnalytics";
import { Card } from "@/design-system/components/Card";
import { Badge as UIBadge } from "@/components/ui/badge";
import { TrustRibbon } from "@/design-system/components/TrustRibbon";
import { FAQAccordion } from "@/design-system/components/FAQAccordion";
import { RelatedLinksGrid } from "@/design-system/components/RelatedLinksGrid";
import { H2 } from "@/design-system/components/Typography";
import { useSharedFaqs } from "@/hooks/useSharedContent";

const Homeowners = () => {
  const homeownersFaqs = useSharedFaqs("homeownersFaqs");
  const c = usePageContent(contentModule);

  usePageAnalytics("homeowners");

  const residentialServices = [
    {
      icon: Paintbrush,
      title: c.f001,
      description: c.f002,
      scope: [c.f003, c.f004, c.f005, c.f006],
      typical: "$2,000 - $15,000",
      timeline: "3-7 days",
    },
    {
      icon: Home,
      title: c.f007,
      description: c.f008,
      scope: [c.f009, c.f010, c.f011, c.f012],
      typical: "$1,500 - $8,000",
      timeline: "2-5 days",
    },
    {
      icon: Square,
      title: c.f013,
      description: c.f014,
      scope: [c.f015, c.f016, c.f017, c.f018],
      typical: "$3,000 - $12,000",
      timeline: "3-8 days",
    },
    {
      icon: Droplets,
      title: c.f019,
      description: c.f020,
      scope: [c.f021, c.f022, c.f023, c.f024],
      typical: "$1,200 - $6,000",
      timeline: "1-4 days",
    },
    {
      icon: Hammer,
      title: c.f025,
      description: c.f026,
      scope: [c.f027, c.f028, c.f029, c.f030],
      typical: "$5,000 - $35,000",
      timeline: "1-4 weeks",
    },
    {
      icon: Home,
      title: c.f031,
      description: c.f032,
      scope: [c.f033, c.f034, c.f035, c.f036],
      typical: "$4,000 - $20,000",
      timeline: "5-10 days",
    },
  ];

  const whyChooseUs = [
    {
      icon: Shield,
      title: c.f037,
      description: c.f038,
    },
    {
      icon: Award,
      title: c.f039,
      description: c.f040,
    },
    {
      icon: CheckCircle,
      title: c.f041,
      description: c.f042,
    },
    {
      icon: Clock,
      title: c.f043,
      description: c.f044,
    },
  ];

  const processSteps = [
    {
      icon: DollarSign,
      title: c.f045,
      description: c.f046,
    },
    {
      icon: Home,
      title: c.f047,
      description: c.f048,
    },
    {
      icon: Hammer,
      title: c.f049,
      description: c.f050,
    },
    {
      icon: CheckCircle,
      title: c.f051,
      description: c.f052,
    },
  ];

  return (
    <div className="min-h-screen">
      <SEO
        title={c.f053}
        description={c.f054}
        keywords="residential painting Toronto, home renovation GTA, tile installation Toronto, flooring contractor, stucco repair homeowners, basement finishing, bathroom renovation, EIFS repair residential"
      />

      <Navigation />

      <PageHero
        title={c.f055}
        description={c.f056}
        image={audienceHeroes["homeowners"]}
        imageAlt={c.f057}
        breadcrumbs={[{ label: c.f058, href: "/" }, { label: c.f059 }]}
        badges={[
          { icon: User, text: c.f060 },
          { icon: Shield, text: c.f061 },
          { icon: DollarSign, text: c.f062 },
        ]}
      />

      <TrustRibbon />

      {/* Introduction Section */}
      <Section>
        <ScrollReveal>
          <div className="max-w-3xl mx-auto text-center mb-12">
            <Badge variant="secondary" className="mb-4">
              {c.f063}
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">{c.f064}</h2>
            <p className="text-lg text-muted-foreground leading-relaxed mb-4">
              {c.f065}
              <strong>{c.f066}</strong> {c.f067}
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              {c.f068}
            </p>
          </div>
        </ScrollReveal>

        {/* Why Choose Us */}
        <StaggerContainer>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {whyChooseUs.map((item, index) => (
              <ScrollReveal key={index}>
                <CapabilityCard
                  icon={item.icon}
                  title={item.title}
                  description={item.description}
                />
              </ScrollReveal>
            ))}
          </div>
        </StaggerContainer>
      </Section>

      {/* Residential Services Grid */}
      <Section className="bg-muted/30">
        <ScrollReveal>
          <div className="text-center mb-12">
            <H2 className="mb-4">{c.f069}</H2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              {c.f070}
            </p>
          </div>
        </ScrollReveal>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {residentialServices.map((service, index) => {
            const Icon = service.icon;
            return (
              <ScrollReveal key={index} delay={index * 0.1}>
                <Card
                  variant="elevated"
                  size="md"
                  hover
                  className="h-full flex flex-col group"
                >
                  <div className="w-14 h-14 rounded-[var(--radius-sm)] bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                    <Icon className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold leading-tight tracking-tight text-foreground mb-4">
                    {service.title}
                  </h3>
                  <p className="text-base text-muted-foreground mb-6 leading-relaxed">
                    {service.description}
                  </p>
                  <div className="mb-6 flex-grow">
                    <h4 className="font-semibold text-sm mb-3 text-foreground">
                      {c.f071}
                    </h4>
                    <ul className="space-y-2">
                      {service.scope.map((item, idx) => (
                        <li
                          key={idx}
                          className="text-sm text-muted-foreground flex items-start gap-2"
                        >
                          <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="pt-6 border-t border-border flex items-center gap-3 flex-wrap mt-auto">
                    <UIBadge
                      variant="secondary"
                      className="flex items-center gap-1.5 px-3 py-1"
                    >
                      <DollarSign className="w-3.5 h-3.5" />
                      <span className="font-medium">{service.typical}</span>
                    </UIBadge>
                    <UIBadge
                      variant="outline"
                      className="flex items-center gap-1.5 px-3 py-1"
                    >
                      <Clock className="w-3.5 h-3.5" />
                      <span className="font-medium">{service.timeline}</span>
                    </UIBadge>
                  </div>
                </Card>
              </ScrollReveal>
            );
          })}
        </div>

        <ScrollReveal>
          <div className="text-center mt-12">
            <p className="text-sm text-muted-foreground mb-4">
              <strong>{c.f072}</strong> {c.f073}
            </p>
            <Button asChild size="lg">
              <Link to="/estimate">{c.f074}</Link>
            </Button>
          </div>
        </ScrollReveal>
      </Section>

      {/* How It Works */}
      <Section>
        <ScrollReveal>
          <SectionHeader title={c.f075} description={c.f076} />
        </ScrollReveal>

        <StaggerContainer className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {processSteps.map((step, index) => (
            <ScrollReveal key={index}>
              <CapabilityCard
                icon={step.icon}
                title={step.title}
                description={step.description}
              />
            </ScrollReveal>
          ))}
        </StaggerContainer>
      </Section>

      {/* FAQ Section for Homeowners (FAQPage JSON-LD auto-emitted) */}
      <Section className="bg-muted/30">
        <ScrollReveal>
          <div className="text-center mb-12">
            <H2 className="mb-4">{c.f077}</H2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {c.f078}
            </p>
          </div>
        </ScrollReveal>

        <div className="max-w-3xl mx-auto">
          <ScrollReveal>
            <FAQAccordion faqs={homeownersFaqs} />
          </ScrollReveal>
        </div>
      </Section>

      {/* Final CTA */}
      <CTABand
        title={c.f079}
        description={c.f080}
        primaryCta={{ text: c.f081, href: "/estimate" }}
        secondaryCta={{ text: c.f082, href: "/contact" }}
        variant="dark"
      />

      {/* Related Resources */}
      <RelatedLinksGrid
        title={c.f083}
        links={[
          {
            icon: Paintbrush,
            title: c.f084,
            description: c.f085,
            href: "/services/painting-services",
          },
          {
            icon: Square,
            title: c.f086,
            description: c.f087,
            href: "/services/tile-flooring",
          },
          {
            icon: Hammer,
            title: c.f088,
            description: c.f089,
            href: "/services/interior-buildouts-finishing",
          },
        ]}
      />

      <Footer />
    </div>
  );
};

export default Homeowners;
