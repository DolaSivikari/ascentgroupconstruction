import { usePageContent } from "@/hooks/usePageContent";
import contentModule from "@/content/pages/emergency-repair";
import SEO from "@/components/SEO";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { PageHero } from "@/components/shared/PageHero";
import { Section } from "@/components/sections/Section";
import { COMPANY_PHONE, COMPANY_PHONE_TEL } from "@/constants/company";
import { SectionHeader } from "@/design-system/components/SectionHeader";
import { CapabilityCard } from "@/design-system/components/CapabilityCard";
import { CTABand } from "@/design-system/components/CTABand";
import { Card } from "@/design-system/components/Card";
import { Button } from "@/ui/Button";
import { PhoneLink } from "@/components/shared/PhoneLink";
import { Link } from "react-router-dom";
import { TrustRibbon } from "@/design-system/components/TrustRibbon";
import { FAQAccordion } from "@/design-system/components/FAQAccordion";
import { RelatedLinksGrid } from "@/design-system/components/RelatedLinksGrid";
import { useSharedFaqs } from "@/hooks/useSharedContent";
import {
  Phone,
  Droplets,
  Wind,
  AlertTriangle,
  Building2,
  Clock,
  ClipboardCheck,
  Wrench,
  Shield,
  CheckCircle,
  ArrowRight,
  MapPin,
  Zap,
} from "lucide-react";
import { mainPageHeroes } from "@/data/hero-images";
import {
  serviceAreaCities,
  primaryServiceCities,
} from "@/data/service-area-cities";

const EmergencyRepair = () => {
  const emergencyRepairFaqs = useSharedFaqs("emergencyRepairFaqs");
  const c = usePageContent(contentModule);
  const emergencyServices = [
    {
      icon: Droplets,
      title: c.f040,
      description: c.f041,
    },
    {
      icon: Building2,
      title: c.f042,
      description: c.f043,
    },
    {
      icon: Wind,
      title: c.f044,
      description: c.f045,
    },
    {
      icon: AlertTriangle,
      title: c.f046,
      description: c.f047,
    },
  ];
  const responseProcess = [
    {
      step: "1",
      title: c.f048,
      description: `Call ${COMPANY_PHONE} directly. Describe the issue, location, and urgency. We triage immediately.`,
      icon: Phone,
    },
    {
      step: "2",
      title: c.f049,
      description: c.f050,
      icon: ClipboardCheck,
    },
    {
      step: "3",
      title: c.f051,
      description: c.f052,
      icon: Wrench,
    },
    {
      step: "4",
      title: c.f053,
      description: c.f054,
      icon: Shield,
    },
  ];

  return (
    <div className="min-h-screen">
      <SEO
        title={c.f001}
        description={`Emergency water infiltration, facade failure, and storm damage repair across the GTA. Same-day site assessment. Call ${COMPANY_PHONE} for immediate response.`}
        keywords="emergency water infiltration Toronto, emergency facade repair GTA, storm damage building repair, emergency building envelope contractor, urgent leak repair Ontario"
      />
      <Navigation />

      <PageHero
        eyebrow={c.f002}
        title={c.f003}
        description={c.f004}
        image={mainPageHeroes["emergency-repair"]}
        imageAlt={c.f005}
        height="medium"
        primaryCta={{ text: `Call ${COMPANY_PHONE}`, href: COMPANY_PHONE_TEL }}
        secondaryCta={{ text: c.f006, href: "/contact" }}
        breadcrumbs={[{ label: c.f007, href: "/" }, { label: c.f008 }]}
        badges={[
          { icon: Clock, text: c.f009 },
          { icon: Zap, text: c.f010 },
          { icon: MapPin, text: c.f011 },
        ]}
      />

      {/* Urgent Phone Banner */}
      <div className="bg-destructive text-destructive-foreground">
        <div className="container mx-auto px-4 py-4 flex flex-col sm:flex-row items-center justify-center gap-4 text-center">
          <Phone className="w-6 h-6 animate-pulse" />
          <span className="text-lg font-semibold">
            {c.f012}{" "}
            <a href={COMPANY_PHONE_TEL} className="underline font-bold">
              {COMPANY_PHONE}
            </a>
          </span>
        </div>
      </div>

      <TrustRibbon />

      {/* Emergency Services */}
      <Section size="major">
        <SectionHeader
          badge="What We Respond To"
          title={c.f013}
          description={c.f014}
        />
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {emergencyServices.map((service) => (
            <CapabilityCard
              key={service.title}
              icon={service.icon}
              title={service.title}
              description={service.description}
            />
          ))}
        </div>
      </Section>

      {/* Response Process */}
      <Section size="major" className="bg-muted/30">
        <SectionHeader
          badge="Our Process"
          title={c.f015}
          description={c.f016}
        />
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {responseProcess.map((item) => (
            <Card
              key={item.step}
              variant="elevated"
              size="md"
              className="relative"
            >
              <span className="text-5xl font-bold text-primary/10 absolute top-4 right-4">
                {item.step}
              </span>
              <item.icon className="w-8 h-8 text-primary mb-3" />
              <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {item.description}
              </p>
            </Card>
          ))}
        </div>
      </Section>

      {/* Service Area */}
      <Section size="major">
        <SectionHeader badge="Coverage" title={c.f017} description={c.f018} />
        <div className="max-w-4xl mx-auto">
          <Card variant="elevated" size="lg">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {serviceAreaCities.map((city) => (
                <div key={city} className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-primary flex-shrink-0" />
                  <span
                    className={`text-sm ${primaryServiceCities.includes(city) ? "font-semibold" : ""}`}
                  >
                    {city}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </Section>

      {/* Why Call Ascent */}
      <Section size="major" className="bg-muted/30">
        <SectionHeader badge="Why Ascent" title={c.f019} />
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <Card variant="elevated" size="md" hover>
            <Clock className="w-10 h-10 text-primary mb-4" />
            <h3 className="font-semibold mb-2">{c.f020}</h3>
            <p className="text-sm text-muted-foreground">{c.f021}</p>
          </Card>
          <Card variant="elevated" size="md" hover>
            <Wrench className="w-10 h-10 text-primary mb-4" />
            <h3 className="font-semibold mb-2">{c.f022}</h3>
            <p className="text-sm text-muted-foreground">{c.f023}</p>
          </Card>
          <Card variant="elevated" size="md" hover>
            <Shield className="w-10 h-10 text-primary mb-4" />
            <h3 className="font-semibold mb-2">{c.f024}</h3>
            <p className="text-sm text-muted-foreground">{c.f025}</p>
          </Card>
        </div>
      </Section>

      {/* CTA */}
      <Section size="major">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{c.f026}</h2>
          <p className="text-lg text-muted-foreground mb-4">{c.f027}</p>
          <p className="text-muted-foreground mb-8">
            {c.f028}
            <PhoneLink className="text-primary font-bold text-lg" />
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg">
              <a href={COMPANY_PHONE_TEL}>
                <Phone className="mr-2 w-4 h-4" />
                {c.f029}
                {COMPANY_PHONE}
              </a>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/contact">
                {c.f030}
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
          </div>
        </div>
      </Section>

      {/* FAQs */}
      <Section size="major" maxWidth="narrow" className="bg-muted/30">
        <SectionHeader
          badge="Emergency FAQs"
          title={c.f031}
          description={c.f032}
        />
        <FAQAccordion faqs={emergencyRepairFaqs} />
      </Section>

      <RelatedLinksGrid
        title={c.f033}
        links={[
          {
            icon: Droplets,
            title: c.f034,
            description: c.f035,
            href: "/services/waterproofing",
          },
          {
            icon: Building2,
            title: c.f036,
            description: c.f037,
            href: "/property-managers",
          },
          {
            icon: Shield,
            title: c.f038,
            description: c.f039,
            href: "/capabilities",
          },
        ]}
      />

      <Footer />
    </div>
  );
};

export default EmergencyRepair;
