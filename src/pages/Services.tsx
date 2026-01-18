import { Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import PageHeader from "@/components/PageHeader";
import { Button } from "@/ui/Button";
import { MarketSegmentedServices } from "@/components/services/MarketSegmentedServices";
import { ServicePromotionsSection } from "@/components/services/ServicePromotionsSection";
import { Section } from "@/components/sections/Section";
import { CTA_TEXT, TYPOGRAPHY_STYLES } from "@/design-system/constants";
import heroServicesImage from "@/assets/heroes/hero-general-contracting.jpg";
import { usePageAnalytics } from "@/hooks/usePageAnalytics";

const Services = () => {
  usePageAnalytics('services');

  return (
    <div className="min-h-screen flex flex-col">
      <SEO 
        title="Services"
        description="Ascent Group Construction — Main specialty contractor for building envelope, interior trades, and residential renovations. Serving commercial properties, multi-family buildings, and homeowners across Ontario. Self-performed work with 15+ years team experience."
        keywords="specialty contractor services, building envelope contractor, residential renovation, interior trades, painting contractor, tile flooring, EIFS contractor, masonry repair, waterproofing contractor"
        canonical="https://ascentgroupconstruction.com/services"
      />
      <Navigation />
      
      <PageHeader
        title="Our Services"
        description="Specialty contractor for building envelope, interior trades, and renovations. Self-performed work across commercial, multi-family, and residential projects in Ontario."
        backgroundImage={heroServicesImage}
        cta={{ label: CTA_TEXT.primary, href: "/estimate" }}
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Services" }
        ]}
      />

      <main className="flex-1 relative">
        {/* Service Promotions (conditional - only shows if promotions exist) */}
        <ServicePromotionsSection />

        {/* All Services by Category */}
        <MarketSegmentedServices />

        {/* Single CTA Section */}
        <Section size="major" className="bg-primary text-primary-foreground">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Start Your Project?
            </h2>
            <p className="text-lg text-primary-foreground/90 mb-8">
              Get a detailed proposal from our team. We'll evaluate your needs and provide transparent pricing.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" variant="secondary">
                <Link to="/contact">Request a Consultation</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
                <Link to="/projects">View Our Projects</Link>
              </Button>
            </div>
          </div>
        </Section>
      </main>

      <Footer />
    </div>
  );
};

export default Services;
