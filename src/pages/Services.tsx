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
import { generateBreadcrumbSchema } from "@/utils/seo";
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
        title="Specialty Contracting Services | Envelope, Restoration & Interior Trades"
        description="Self-performed and coordinated specialty contracting for building envelope, restoration, cladding, masonry, painting, tile, and interior trade packages across Ontario."
        keywords="specialty contractor Ontario, building envelope contractor, EIFS stucco contractor, masonry restoration, interior buildouts, painting contractor, tile flooring, cladding systems, renovation contractor"
        canonical={`${SITE_URL}/services`}
        structuredData={[breadcrumbSchema]}
      />
      <Navigation />
      
      <PageHero
        eyebrow="Services"
        title="Specialty contracting services for envelope, restoration, and interior trade execution"
        description="Self-performed and coordinated scopes across commercial, multi-unit, and residential projects in Ontario."
        image={mainPageHeroes.services}
        imageAlt="Specialty contracting services — building envelope and interior trades"
        height="medium"
        primaryCta={{ text: "Submit an RFP", href: "/submit-rfp" }}
        secondaryCta={{ text: "Request an Estimate", href: "/estimate" }}
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
        <ServicesDataGrid />
        <ServicesProcessSnapshot />
        <ServicesCtaSection />
      </main>

      <Footer />
    </div>
  );
};

export default Services;
