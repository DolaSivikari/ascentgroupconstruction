import { RichText } from "@/components/RichText";
import { useEffect, useState } from "react";
import { useParams, Navigate, Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import PageHero from "@/components/shared/PageHero";
import { supabase } from "@/integrations/supabase/client";
import { SITE_URL } from "@/constants/company";
import { formatPhoneDisplay, formatPhoneTel } from "@/utils/formatPhone";
import { Button } from "@/ui/Button";
import {
  Phone,
  Mail,
  CheckCircle,
  Award,
  ShieldCheck,
  ExternalLink,
  Building2,
  ArrowRight,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { sanitizeAndValidate } from "@/utils/sanitize";
import QuickFacts from "@/components/seo/QuickFacts";
import { CTA_TEXT } from "@/design-system/constants";
import { CTABand } from "@/design-system/components/CTABand";
import { SectionHeader } from "@/design-system/components/SectionHeader";
import { CapabilityCard } from "@/design-system/components/CapabilityCard";
import { Card, CardContent } from "@/design-system/components/Card";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import PeopleAlsoAsk from "@/components/seo/PeopleAlsoAsk";
import ServiceAreaSection from "@/components/seo/ServiceAreaSection";
import DirectAnswer from "@/components/seo/DirectAnswer";
import { serviceQuickFacts } from "@/data/service-quick-facts";
import { servicePeopleAlsoAsk } from "@/data/service-people-ask";
import { serviceAreaCities } from "@/data/service-area-cities";
import { getServiceParent } from "@/data/service-registry";
import { ServiceSpecialties } from "@/components/services/ServiceSpecialties";
import {
  createServiceSchema,
  createHowToSchema,
} from "@/utils/schema-injector";
import { breadcrumbSchema } from "@/utils/structured-data";
import { getIconForService } from "@/utils/serviceIcons";
import { resolveServiceHero } from "@/data/hero-images";
import { TrustRibbon } from "@/design-system/components/TrustRibbon";
import { FAQAccordion } from "@/design-system/components/FAQAccordion";
import { RelatedLinksGrid } from "@/design-system/components/RelatedLinksGrid";
import { useSharedFaqs } from "@/hooks/useSharedContent";
import { Wrench, Briefcase } from "lucide-react";
import {
  getRelatedForService,
  type SmartRelatedLink,
} from "@/utils/relatedLinks";

interface ProcessStep {
  step_number: number;
  title: string;
  description: string;
}

interface FAQItem {
  question: string;
  answer: string;
}

type StringOrLabeled = string | { label?: string; title?: string };

interface Service {
  id: string;
  name: string;
  slug: string;
  short_description: string | null;
  long_description: string | null;
  icon_name: string | null;
  featured_image: string | null;
  seo_title: string | null;
  seo_description: string | null;
  seo_keywords: string[] | null;
  service_overview: string | null;
  process_steps: ProcessStep[] | null;
  what_we_provide: StringOrLabeled[] | null;
  typical_applications: StringOrLabeled[] | null;
  key_benefits: Array<{ title: string; description: string }> | null;
  faq_items: FAQItem[] | null;
  category: string | null;
}

// Defensive: some legacy rows store these as [{label: "..."}] instead of plain strings
const normalizeStringArray = (arr: unknown): string[] =>
  Array.isArray(arr)
    ? arr
        .map((v) =>
          typeof v === "string"
            ? v
            : ((v as { label?: string; title?: string })?.label ??
              (v as { label?: string; title?: string })?.title ??
              ""),
        )
        .filter(Boolean)
    : [];

// Per-service hero badges (trust signals)
const serviceBadges: Record<
  string,
  Array<{ icon: typeof ShieldCheck; text: string }>
> = {
  "eifs-stucco-systems": [
    { icon: ShieldCheck, text: "Sto Canada Listed Installer" },
    { icon: Award, text: "APW Warranty Eligible" },
    { icon: Building2, text: "CCMC Evaluated Systems" },
  ],
  "building-envelope-solutions": [
    { icon: ShieldCheck, text: "CCMC Listed Assemblies" },
    { icon: Award, text: "20-Year System Warranties" },
    { icon: Building2, text: "OBC & NBC Compliant" },
  ],
  "cladding-systems": [
    { icon: ShieldCheck, text: "Factory-Certified Installers" },
    { icon: Award, text: "30+ Year Service Life" },
    { icon: Building2, text: "Sto / Hardie / IMP Certified" },
  ],
  "facade-remediation": [
    { icon: ShieldCheck, text: "Engineer-Coordinated" },
    { icon: Award, text: "Multi-Year Programs" },
    { icon: Building2, text: "Occupied-Building Specialists" },
  ],
  "masonry-restoration": [
    { icon: ShieldCheck, text: "Heritage-Grade Craftsmanship" },
    { icon: Award, text: "Mortar-Matched Repairs" },
    { icon: Building2, text: "Conservation Compliant" },
  ],
  "waterproofing-systems": [
    { icon: ShieldCheck, text: "Manufacturer-Certified" },
    { icon: Award, text: "Up to 20-Year Warranties" },
    { icon: Building2, text: "Soprema / Tremco / Sika" },
  ],
  "sustainable-building": [
    { icon: ShieldCheck, text: "LEED Project Experience" },
    { icon: Award, text: "Toronto Green Standard" },
    { icon: Building2, text: "Passive House Capable" },
  ],
};

const ServiceDetail = () => {
  const serviceDetailFaqs = useSharedFaqs("serviceDetailFaqs");
  const { slug } = useParams<{ slug: string }>();
  const parent = getServiceParent(slug ?? "");
  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [relatedLinks, setRelatedLinks] = useState<SmartRelatedLink[]>([]);

  useEffect(() => {
    loadService();
  }, [slug]);

  // Resolve smart related links once the service is loaded
  useEffect(() => {
    if (!service) return;
    let cancelled = false;
    getRelatedForService({
      serviceId: service.id,
      serviceSlug: service.slug,
      category: service.category,
    }).then((links) => {
      if (!cancelled) setRelatedLinks(links);
    });
    return () => {
      cancelled = true;
    };
  }, [service]);

  const loadService = async () => {
    if (!slug) {
      setNotFound(true);
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from("services")
      .select("*")
      .eq("slug", slug)
      .eq("publish_state", "published")
      .single();

    if (error || !data) {
      setNotFound(true);
    } else {
      setService(data as unknown as Service);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        <Navigation />
        <main className="container mx-auto px-4 py-32">
          <div className="max-w-4xl mx-auto space-y-8">
            <Skeleton className="h-12 w-3/4" />
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-2/3" />
            <Skeleton className="h-64 w-full" />
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (notFound || !service) {
    return <Navigate to="/404" replace />;
  }

  const serviceKey = service.slug || "";
  const quickFacts = serviceQuickFacts[serviceKey] || [];
  const peopleAsk = servicePeopleAlsoAsk[serviceKey] || [];
  const ServiceIcon = getIconForService(service.name);
  const hero = resolveServiceHero(
    service.slug,
    service.featured_image,
    service.category,
  );
  const badges = serviceBadges[service.slug];

  // Normalize legacy data shapes ([{label}] -> [string])
  const whatWeProvide = normalizeStringArray(service.what_we_provide);
  const typicalApplications = normalizeStringArray(
    service.typical_applications,
  );

  // Generate AEO/GEO structured data
  const serviceSchemaData = createServiceSchema({
    serviceType: service.name,
    areaServed: ["Toronto", "Mississauga", "Brampton", "Vaughan", "Markham"],
    priceRange: "$$-$$$",
    subServices: whatWeProvide,
  });

  const howToSchemaData = service.process_steps
    ? createHowToSchema({
        name: `How ${service.name} Works: Professional Process`,
        description: `Step-by-step process for ${service.name.toLowerCase()} services by Ascent Group Construction`,
        steps: service.process_steps.map((step) => ({
          position: step.step_number,
          name: step.title,
          text: step.description,
        })),
        totalTime: "P7D",
      })
    : null;

  const breadcrumbSchemaData = breadcrumbSchema([
    { name: "Home", url: `${SITE_URL}/` },
    { name: "Services", url: `${SITE_URL}/services` },
    ...(parent
      ? [{ name: parent.navLabel, url: `${SITE_URL}${parent.path}` }]
      : []),
    { name: service.name, url: `${SITE_URL}/services/${service.slug}` },
  ]);

  const structuredDataArray: any[] = [serviceSchemaData, breadcrumbSchemaData];
  if (howToSchemaData) structuredDataArray.push(howToSchemaData);
  const allFaqs = [
    ...(Array.isArray(service.faq_items) ? service.faq_items : []),
    ...serviceDetailFaqs,
  ].filter((f) => f && f.question && f.answer);
  if (allFaqs.length > 0) {
    structuredDataArray.push({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: allFaqs.map((f) => ({
        "@type": "Question",
        name: f.question,
        acceptedAnswer: { "@type": "Answer", text: f.answer },
      })),
    });
  }

  return (
    <div className="min-h-screen">
      <SEO
        title={service.seo_title || service.name}
        description={service.seo_description || service.short_description || ""}
        keywords={service.seo_keywords?.join(", ") || ""}
        structuredData={structuredDataArray}
      />
      <Navigation />

      <PageHero
        title={service.name}
        description={service.short_description || ""}
        image={hero.image}
        fallbackImage={
          resolveServiceHero(service.slug, null, service.category).image
        }
        imageAlt={hero.imageAlt}
        primaryCta={{ text: CTA_TEXT.primary, href: "/contact" }}
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Services", href: "/services" },
          ...(parent ? [{ label: parent.navLabel, href: parent.path }] : []),
          { label: service.name },
        ]}
        height="medium"
        {...(badges ? { badges } : {})}
      />

      <TrustRibbon />

      <main className="min-h-screen">
        {/* Direct Answer Section */}
        {service.short_description && (
          <DirectAnswer>
            <p className="text-lg leading-relaxed">
              <strong>What is {service.name}?</strong>{" "}
              {service.short_description} Ascent Group Construction provides
              professional {service.name.toLowerCase()} services throughout the
              Greater Toronto Area, including Toronto, Mississauga, Brampton,
              Vaughan, and Markham.
            </p>
          </DirectAnswer>
        )}

        {/* Quick Facts */}
        {quickFacts.length > 0 && (
          <section className="py-12 bg-background">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto">
                <QuickFacts
                  title={`Quick Facts: ${service.name}`}
                  facts={quickFacts}
                />
              </div>
            </div>
          </section>
        )}

        {/* Main content with sticky sidebar */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-7xl mx-auto grid lg:grid-cols-[1fr_320px] gap-12">
              {/* MAIN COLUMN */}
              <div className="space-y-16 min-w-0">
                {/* Service Overview */}
                {service.service_overview && (
                  <div>
                    <SectionHeader
                      badge="Overview"
                      title="Service Overview"
                      align="left"
                    />
                    <RichText
                      className="text-lg text-muted-foreground leading-relaxed [&>p]:mb-4 [&>p:last-child]:mb-0"
                      content={service.service_overview}
                    />
                  </div>
                )}

                {/* Sto Canada Certification Banner — EIFS only */}
                {service.slug === "eifs-stucco-systems" && (
                  <div className="relative overflow-hidden rounded-xl border-2 border-primary/20 bg-gradient-to-br from-primary/5 via-background to-accent/5 p-8 md:p-10">
                    <div className="absolute top-4 right-4 md:top-6 md:right-6">
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary uppercase tracking-wider">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        Verified
                      </span>
                    </div>
                    <div className="flex flex-col md:flex-row gap-6 md:gap-10 items-start">
                      <div className="flex-shrink-0 w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center">
                        <Award className="w-8 h-8 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold text-foreground mb-2">
                          Sto Canada Listed Installer
                        </h3>
                        <p className="text-muted-foreground leading-relaxed mb-4">
                          Ascent Group Construction is a{" "}
                          <strong className="text-foreground">
                            factory-certified Listed Installer
                          </strong>{" "}
                          recognized by Sto Canada Ltd. Every installation
                          qualifies for{" "}
                          <strong className="text-foreground">
                            Sto Assured Performance Warranty (APW)
                          </strong>{" "}
                          coverage.
                        </p>
                        <a
                          href="https://dinliarttwuzzozyvuiu.supabase.co/storage/v1/object/public/documents/certifications/Ascent_Group_Construction_-_Sto_Listing_Certificate.pdf"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-accent transition-colors"
                        >
                          View Certificate
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </div>
                    </div>
                  </div>
                )}

                {/* Process Steps — Numbered Timeline */}
                {service.process_steps && service.process_steps.length > 0 && (
                  <div>
                    <SectionHeader
                      badge="Our Process"
                      title="How We Deliver"
                      description="A proven, repeatable workflow from first inspection to final warranty turnover."
                      align="left"
                    />
                    <div className="relative">
                      {/* vertical connector line */}
                      <div className="absolute left-5 top-2 bottom-2 w-px bg-border hidden sm:block" />
                      <div className="space-y-6">
                        {service.process_steps.map((step, index) => (
                          <div
                            key={index}
                            className="relative flex gap-5 items-start"
                          >
                            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm relative z-10 ring-4 ring-background">
                              {step.step_number}
                            </div>
                            <Card className="flex-1 p-0">
                              <CardContent className="p-5">
                                <h3 className="text-lg font-semibold mb-1.5">
                                  {step.title}
                                </h3>
                                <p className="text-muted-foreground text-sm leading-relaxed">
                                  {step.description}
                                </p>
                              </CardContent>
                            </Card>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Key Benefits — CapabilityCard grid */}
                {service.key_benefits && service.key_benefits.length > 0 && (
                  <div>
                    <SectionHeader
                      badge="Why It Matters"
                      title="Key Benefits"
                      align="left"
                    />
                    <div className="grid sm:grid-cols-2 gap-4">
                      {service.key_benefits.map((benefit, index) => (
                        <CapabilityCard
                          key={index}
                          icon={ServiceIcon}
                          title={benefit.title}
                          description={benefit.description}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* What We Provide — bordered checklist panel */}
                {whatWeProvide.length > 0 && (
                  <div>
                    <SectionHeader
                      badge="Scope of Work"
                      title="What We Provide"
                      align="left"
                    />
                    <div className="border-l-4 border-primary bg-muted/30 rounded-r-lg p-6">
                      <div className="grid sm:grid-cols-2 gap-x-6 gap-y-3">
                        {whatWeProvide.map((item, index) => (
                          <div key={index} className="flex items-start gap-2.5">
                            <CheckCircle className="w-4 h-4 text-primary flex-shrink-0 mt-1" />
                            <span className="text-sm text-foreground/90 leading-relaxed">
                              {item}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Typical Applications — pill chips */}
                {typicalApplications.length > 0 && (
                  <div>
                    <SectionHeader
                      badge="Where We Work"
                      title="Typical Applications"
                      align="left"
                    />
                    <div className="flex flex-wrap gap-2.5">
                      {typicalApplications.map((app, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-4 py-2 rounded-full bg-muted text-sm font-medium text-foreground/80 border border-border hover:border-primary/40 hover:bg-primary/5 transition-colors"
                        >
                          {app}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* FAQs — Accordion w/ auto FAQPage JSON-LD (AEO) */}
                {service.faq_items && service.faq_items.length > 0 && (
                  <div>
                    <SectionHeader
                      badge="FAQ"
                      title="Frequently Asked Questions"
                      align="left"
                    />
                    <div className="mt-6">
                      <FAQAccordion faqs={service.faq_items} emitSchema />
                    </div>
                  </div>
                )}

                {/* Fallback: Long Description */}
                {!service.service_overview && service.long_description && (
                  <div className="prose prose-lg max-w-none">
                    <RichText content={service.long_description} />
                  </div>
                )}
              </div>

              {/* STICKY SIDEBAR — desktop only */}
              <aside className="hidden lg:block">
                <div className="sticky top-24 space-y-4">
                  <Card className="p-0">
                    <CardContent className="p-6">
                      <h3 className="text-lg font-bold mb-1">
                        Request a Quote
                      </h3>
                      <p className="text-sm text-muted-foreground mb-5">
                        Get a detailed proposal from our team — typically within
                        2 business days.
                      </p>
                      <Button asChild className="w-full mb-3">
                        <Link to="/estimate">
                          {CTA_TEXT.project}
                          <ArrowRight className="w-4 h-4 ml-1" />
                        </Link>
                      </Button>
                      <Button asChild variant="outline" className="w-full mb-5">
                        <Link to="/contact">{CTA_TEXT.contact}</Link>
                      </Button>

                      <div className="border-t pt-4 space-y-3 text-sm">
                        <a
                          href={formatPhoneTel()}
                          className="flex items-center gap-2.5 text-foreground hover:text-primary transition-colors"
                        >
                          <Phone className="w-4 h-4 text-primary" />
                          <span className="font-medium">
                            Call our team at {formatPhoneDisplay()}
                          </span>
                        </a>
                        <a
                          href="mailto:projects@ascentgroupconstruction.com"
                          className="flex items-center gap-2.5 text-foreground hover:text-primary transition-colors"
                        >
                          <Mail className="w-4 h-4 text-primary" />
                          <span className="font-medium">Email projects</span>
                        </a>
                      </div>
                    </CardContent>
                  </Card>

                  {badges && (
                    <Card className="p-0">
                      <CardContent className="p-6">
                        <h4 className="text-xs uppercase tracking-wider font-semibold text-muted-foreground mb-3">
                          Credentials
                        </h4>
                        <div className="space-y-2.5">
                          {badges.map((badge, i) => {
                            const BadgeIcon = badge.icon;
                            return (
                              <div
                                key={i}
                                className="flex items-start gap-2.5 text-sm"
                              >
                                <BadgeIcon className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                                <span className="text-foreground/90">
                                  {badge.text}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </aside>
            </div>
          </div>
        </section>

        {/* People Also Ask */}
        {peopleAsk.length > 0 && (
          <section className="py-16 bg-muted/40">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto">
                <PeopleAlsoAsk questions={peopleAsk} />
              </div>
            </div>
          </section>
        )}

        <ServiceSpecialties slug={service.slug} />

        {/* Service Area */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <ServiceAreaSection cities={serviceAreaCities} radius="100km" />
          </div>
        </section>

        {/* Service-level FAQ (auto FAQ schema) */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4 max-w-3xl">
            <h2 className="text-3xl font-bold text-center mb-4">
              Common Questions
            </h2>
            <p className="text-center text-muted-foreground mb-8">
              Standard answers about scope, schedule, and warranty for{" "}
              {service.name.toLowerCase()}.
            </p>
            <FAQAccordion faqs={serviceDetailFaqs} />
          </div>
        </section>

        {/* Related cross-links — tag/category-aware */}
        <RelatedLinksGrid
          title="Explore Related Services"
          description="Sibling services and recent projects sharing this scope."
          links={
            relatedLinks.length > 0
              ? relatedLinks
              : [
                  {
                    title: "All Services",
                    description:
                      "Browse the full envelope, restoration & interior catalog.",
                    href: "/services",
                    icon: Wrench,
                  },
                  {
                    title: "Recent Projects",
                    description:
                      "See similar projects delivered across the GTA.",
                    href: "/projects",
                    icon: Briefcase,
                  },
                  {
                    title: "Capabilities",
                    description: "What we self-perform and how we deliver.",
                    href: "/capabilities",
                    icon: Building2,
                  },
                ]
          }
          background="default"
        />

        <CTABand
          title="Ready to Discuss Your Project?"
          description="Get a detailed proposal from our team"
          primaryCta={{ text: CTA_TEXT.project, href: "/estimate" }}
          secondaryCta={{ text: CTA_TEXT.contact, href: "/contact" }}
          variant="dark"
        />
      </main>

      <Footer />
    </div>
  );
};

export default ServiceDetail;
