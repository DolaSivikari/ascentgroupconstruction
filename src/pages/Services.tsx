import { usePageContent } from "@/hooks/usePageContent";
import contentModule from "@/content/pages/services";
import {
  Wrench,
  ShieldCheck,
  MapPin,
  Building2,
  Hammer,
  PaintBucket,
} from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { PageHero } from "@/components/shared/PageHero";
import { ServicesDataGrid } from "@/components/services/ServicesDataGrid";
import { ServicesProcessSnapshot } from "@/components/services/ServicesProcessSnapshot";
import { ServicesCtaSection } from "@/components/services/ServicesCtaSection";
import {
  TrustRibbon,
  SectionHeader,
  FAQAccordion,
  DetailCard,
} from "@/design-system/components";
import { Section } from "@/components/sections/Section";
import { mainPageHeroes } from "@/data/hero-images";
import { usePageAnalytics } from "@/hooks/usePageAnalytics";
import { generateBreadcrumbSchema, generateFAQSchema } from "@/utils/seo";
import { SITE_URL } from "@/constants/company";
import { useSharedFaqs } from "@/hooks/useSharedContent";
import { SERVICE_CATEGORIES as SERVICE_CATEGORY_LABELS } from "@/data/service-registry";

const MATERIAL_PARTNERS = [
  "Sto Canada",
  "Dryvit",
  "Parex",
  "Benjamin Moore",
  "Sherwin-Williams",
  "Sika",
  "Tremco",
  "Mapei",
];

const Services = () => {
  const servicesFaqs = useSharedFaqs("servicesFaqs");
  const c = usePageContent(contentModule);
  const SERVICE_CATEGORIES = [
    {
      icon: Building2,
      title: SERVICE_CATEGORY_LABELS.envelope.title,
      description: c.f022,
      bullets: [c.f023, c.f024, c.f025],
    },
    {
      icon: Hammer,
      title: SERVICE_CATEGORY_LABELS.restoration.title,
      description: c.f026,
      bullets: [c.f027, c.f028, c.f029],
    },
    {
      icon: PaintBucket,
      title: SERVICE_CATEGORY_LABELS.interior.title,
      description: c.f030,
      bullets: [c.f031, c.f032, c.f033],
    },
  ];

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: c.f001, url: "/" },
    { name: c.f002, url: "/services" },
  ]);
  usePageAnalytics("services");

  return (
    <div className="min-h-screen flex flex-col">
      <SEO
        title={c.f003}
        description={c.f004}
        keywords="specialty contractor Ontario, multi-trade self-perform contractor, building envelope contractor, EIFS stucco contractor, masonry restoration, interior buildouts, commercial painting services, tile and flooring, cladding systems, renovation contractor"
        canonical={`${SITE_URL}/services`}
        structuredData={[breadcrumbSchema, generateFAQSchema(servicesFaqs)]}
      />
      <Navigation />

      <PageHero
        eyebrow={c.f005}
        title={c.f006}
        description={c.f007}
        image={mainPageHeroes.services}
        imageAlt={c.f008}
        height="medium"
        primaryCta={{ text: c.f009, href: "/submit-rfp" }}
        secondaryCta={{ text: c.f010, href: "/contact" }}
        breadcrumbs={[{ label: c.f011, href: "/" }, { label: c.f012 }]}
        badges={[
          { icon: Wrench, text: c.f013 },
          { icon: ShieldCheck, text: c.f014 },
          { icon: MapPin, text: c.f015 },
        ]}
      />

      <TrustRibbon />

      <main className="flex-1 relative">
        {/* Category framing — three pillars */}
        <Section size="major">
          <SectionHeader
            badge="Service Categories"
            title={c.f016}
            description={c.f017}
            maxWidth="lg"
          />
          <div className="grid md:grid-cols-3 gap-6">
            {SERVICE_CATEGORIES.map((cat) => (
              <DetailCard
                key={cat.title}
                icon={cat.icon}
                title={cat.title}
                description={cat.description}
                bullets={cat.bullets}
                accent
              />
            ))}
          </div>
        </Section>

        <ServicesDataGrid />

        {/* Materials & systems */}
        <Section size="major" className="bg-muted/30">
          <SectionHeader
            badge="Materials & Systems"
            title={c.f018}
            description={c.f019}
            maxWidth="md"
          />
          <div className="flex flex-wrap justify-center gap-3 max-w-4xl mx-auto">
            {MATERIAL_PARTNERS.map((name) => (
              <span
                key={name}
                className="inline-flex items-center px-4 py-2 rounded-full bg-background border border-border text-sm font-medium text-foreground/80 hover:border-primary/40 hover:text-foreground transition-colors"
              >
                {name}
              </span>
            ))}
          </div>
        </Section>

        <ServicesProcessSnapshot />

        {/* People Also Ask */}
        <Section size="major" className="bg-muted/30">
          <SectionHeader
            badge="FAQ"
            title={c.f020}
            description={c.f021}
            maxWidth="md"
          />
          <div className="max-w-3xl mx-auto">
            <FAQAccordion faqs={servicesFaqs} />
          </div>
        </Section>

        <ServicesCtaSection />
      </main>

      <Footer />
    </div>
  );
};

export default Services;
