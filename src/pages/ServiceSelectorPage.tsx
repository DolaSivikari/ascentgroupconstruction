import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { PageHero } from "@/components/shared/PageHero";
import { Section } from "@/components/sections/Section";
import { ServiceSelector } from "@/components/tools/ServiceSelector";
import heroImage from "@/assets/heroes/hero-facade-remediation.jpg";
import { AscentEmailLink } from "@/components/EmailLink";
import { PhoneLink } from "@/components/shared/PhoneLink";
import { formatPhoneDisplay } from "@/utils/formatPhone";

/**
 * Service Selector Tool Page
 * Dedicated page for the interactive service recommendation tool
 */

const ServiceSelectorPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <SEO
        title="Find the Right Service | Interactive Service Selector"
        description="Not sure which service you need? Use our interactive tool to get personalized service recommendations based on your property type, issues, and timeline."
        keywords="service selector, construction services finder, building maintenance tool, renovation quiz, property service finder"
      />
      <Navigation />

      <PageHero
        title="Find the Right Service for Your Project"
        description="Answer a few quick questions and we'll recommend the best services for your specific needs"
        image={heroImage}
        imageAlt="Interactive service selector tool"
        height="small"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Service Selector" },
        ]}
      />

      <main className="flex-1">
        <Section size="major">
          <ServiceSelector />

          {/* Additional Information */}
          <div className="mt-16 max-w-3xl mx-auto text-center">
            <h2 className="text-2xl font-bold mb-4">Still Not Sure?</h2>
            <p className="text-muted-foreground mb-6">
              Every project is unique. If you're not sure which service fits your needs, 
              our team can visit your site, assess the situation, and provide expert recommendations.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <PhoneLink
                showIcon={false}
                className="inline-flex items-center justify-center rounded-[var(--radius-lg)] px-6 py-3 text-sm font-semibold text-white bg-primary hover:bg-primary/90 transition-colors"
              >
                Call: {formatPhoneDisplay()}
              </PhoneLink>
              <div className="inline-flex items-center justify-center rounded-[var(--radius-lg)] px-6 py-3 text-sm font-semibold text-foreground border-2 border-border hover:border-primary transition-colors">
                <AscentEmailLink showIcon={false}>Email Us</AscentEmailLink>
              </div>
            </div>
          </div>
        </Section>
      </main>

      <Footer />
    </div>
  );
};

export default ServiceSelectorPage;
