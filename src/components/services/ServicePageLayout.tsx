import { ReactNode } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { PageHero } from "@/components/shared/PageHero";
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
        <CTABand
          title={ctaTitle}
          description={ctaDescription}
          primaryCta={{ text: CTA_TEXT.consultation, href: "/contact" }}
          secondaryCta={{ text: CTA_TEXT.viewProjects, href: "/projects" }}
          variant="dark"
        />
      </main>

      <Footer />
    </div>
  );
};
