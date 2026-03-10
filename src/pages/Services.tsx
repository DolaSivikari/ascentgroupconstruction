import { Wrench, ShieldCheck, MapPin } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { PageHero } from "@/components/shared/PageHero";
import { ServicePillarsGrid } from "@/components/services/ServicePillarsGrid";
import { OperationalCapabilities } from "@/components/services/OperationalCapabilities";
import { ServicesClientSegments } from "@/components/services/ServicesClientSegments";
import { ServicesTrustBar } from "@/components/services/ServicesTrustBar";
import { ServicesFeaturedWork } from "@/components/services/ServicesFeaturedWork";
import { ServicesProcessSnapshot } from "@/components/services/ServicesProcessSnapshot";
import { ServicesCtaSection } from "@/components/services/ServicesCtaSection";
import { mainPageHeroes } from "@/data/hero-images";
import { usePageAnalytics } from "@/hooks/usePageAnalytics";
import { generateBreadcrumbSchema } from "@/utils/seo";

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
        canonical="https://ascentgroupconstruction.com/services"
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
      />

      <main className="flex-1 relative">
        <ServicePillarsGrid />
        <OperationalCapabilities />
        <ServicesClientSegments />
        <ServicesTrustBar />
        <ServicesFeaturedWork />
        <ServicesProcessSnapshot />
        <ServicesCtaSection />
      </main>

      <Footer />
    </div>
  );
};

export default Services;
