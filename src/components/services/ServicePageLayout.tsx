import { ReactNode } from "react";
import { Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { PageHero } from "@/components/shared/PageHero";
import { Button } from "@/ui/Button";
import { Section } from "@/components/sections/Section";
import { ArrowRight } from "lucide-react";
import { RelatedServices } from "./RelatedServices";
import { CTABand } from "@/design-system/components/CTABand";
import { CTA_TEXT } from "@/design-system/constants";

interface ServicePageLayoutProps {
  // SEO
  title: string;
  description: string;
  keywords?: string;
  structuredData?: object[];
  
  // Hero
  heroTitle: string;
  heroDescription: string;
  heroImage: string;
  
  // Category for related services
  category: string;
  slug: string;
  
  // Content sections
  children: ReactNode;
  
  // CTA customization
  ctaTitle?: string;
  ctaDescription?: string;
}

export const ServicePageLayout = ({
  title,
  description,
  keywords,
  structuredData,
  heroTitle,
  heroDescription,
  heroImage,
  category,
  slug,
  children,
  ctaTitle = "Ready to Start Your Project?",
  ctaDescription = "Get a detailed proposal from our team. We'll evaluate your needs and provide transparent pricing.",
}: ServicePageLayoutProps) => {
  return (
    <div className="min-h-screen">
      <SEO
        title={title}
        description={description}
        keywords={keywords}
        structuredData={structuredData}
      />
      <Navigation />
      
      <PageHero
        title={heroTitle}
        description={heroDescription}
        image={heroImage}
        imageAlt={`${heroTitle} services by Ascent Group Construction`}
        height="medium"
        primaryCta={{ text: CTA_TEXT.primary, href: "/contact" }}
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Services", href: "/services" },
          { label: heroTitle }
        ]}
      />

      <main>
        {children}

        {/* Related Services */}
        <RelatedServices currentServiceSlug={slug} currentCategory={category} />

        {/* CTA Band */}
        <Section size="major" className="bg-primary text-primary-foreground">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">{ctaTitle}</h2>
            <p className="text-lg text-primary-foreground/90 mb-8">
              {ctaDescription}
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button asChild size="lg" variant="secondary">
                <Link to="/contact">
                  Request Consultation
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
                <Link to="/projects">View Projects</Link>
              </Button>
            </div>
          </div>
        </Section>
      </main>

      <Footer />
    </div>
  );
};
