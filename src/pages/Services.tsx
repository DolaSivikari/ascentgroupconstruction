import { Wrench, ShieldCheck, MapPin, Building2, Hammer, PaintBucket } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { PageHero } from "@/components/shared/PageHero";
import { ServicesDataGrid } from "@/components/services/ServicesDataGrid";
import { ServicesProcessSnapshot } from "@/components/services/ServicesProcessSnapshot";
import { ServicesCtaSection } from "@/components/services/ServicesCtaSection";
import { TrustRibbon, SectionHeader, FAQAccordion, DetailCard } from "@/design-system/components";
import { Section } from "@/components/sections/Section";
import { mainPageHeroes } from "@/data/hero-images";
import { usePageAnalytics } from "@/hooks/usePageAnalytics";
import { generateBreadcrumbSchema, generateFAQSchema } from "@/utils/seo";
import { SITE_URL } from "@/constants/company";
import { servicesFaqs } from "@/data/page-faqs";

const SERVICE_CATEGORIES = [
  {
    icon: Building2,
    title: "Building Envelope",
    description:
      "EIFS & stucco, masonry restoration, sealants, balcony waterproofing, and architectural cladding — the systems that keep buildings dry, efficient, and intact.",
    bullets: [
      "Sto Canada Listed Installer (SCL-001 → SCL-010)",
      "Dryvit, Parex, and Sto cladding systems",
      "Sealant renewal & joint replacement programs",
    ],
  },
  {
    icon: Hammer,
    title: "Restoration",
    description:
      "Concrete repair, parking garage rehabilitation, and balcony restoration — full lifecycle scopes for property managers and capital planners.",
    bullets: [
      "Concrete spall repair & rebar treatment",
      "Parking garage coatings & line marking",
      "Balcony deck membrane systems",
    ],
  },
  {
    icon: PaintBucket,
    title: "Interior Trades",
    description:
      "Painting, tile, drywall, and flooring — interior buildouts and finishing work executed by the same self-perform crews running our envelope scopes.",
    bullets: [
      "Commercial & residential painting",
      "Tile, resilient flooring, and finishes",
      "Drywall, framing, and tenant buildouts",
    ],
  },
];

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
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Services", url: "/services" }
  ]);
  usePageAnalytics('services');

  return (
    <div className="min-h-screen flex flex-col">
      <SEO 
        title="Specialty Contracting Services"
        description="Self-performed and coordinated specialty contracting — envelope, restoration, cladding, masonry, painting, and interior trades across Ontario."
        keywords="specialty contractor Ontario, multi-trade self-perform contractor, building envelope contractor, EIFS stucco contractor, masonry restoration, interior buildouts, commercial painting services, tile and flooring, cladding systems, renovation contractor"
        canonical={`${SITE_URL}/services`}
        structuredData={[breadcrumbSchema, generateFAQSchema(servicesFaqs)]}
      />
      <Navigation />
      
      <PageHero
        eyebrow="Services"
        title="Specialty contracting services for envelope, restoration, and interior trade execution"
        description="Self-performed and coordinated scopes across commercial, multi-unit, and residential projects in Ontario."
        image={mainPageHeroes.services}
        imageAlt="Specialty contracting services — building envelope and interior trades"
        height="medium"
        primaryCta={{ text: "Start a Project", href: "/submit-rfp" }}
        secondaryCta={{ text: "Request Site Assessment", href: "/contact" }}
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Services" }
        ]}
        badges={[
          { icon: Wrench, text: "Self-Performed Work" },
          { icon: ShieldCheck, text: "Licensed & Insured" },
          { icon: MapPin, text: "GTA Coverage" },
        ]}
      />

      <TrustRibbon />

      <main className="flex-1 relative">
        {/* Category framing — three pillars */}
        <Section size="major">
          <SectionHeader
            badge="Service Categories"
            title="Three Categories. One Self-Perform Crew."
            description="Every service we offer lives in one of three categories. Each is delivered by the same accountable crew — no broker, no markup layers."
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
            title="Manufacturer Systems We Install"
            description="We install to manufacturer specifications using approved systems from leading envelope, coating, and restoration product lines."
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
            title="People Also Ask"
            description="Common questions about our services, certifications, and how we deliver."
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
