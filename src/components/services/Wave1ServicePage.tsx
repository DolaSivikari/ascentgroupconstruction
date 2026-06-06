/**
 * Wave1ServicePage — shared layout for the 4 AEO/GEO landing pages.
 *
 * Uses the existing design system (PageHero, Section, FAQAccordion, Card, ProofStrip)
 * so these pages match the rest of the site. All copy comes from src/data/wave1-services.ts.
 *
 * Emits:
 *   - <title>, <meta>, canonical via <SEO>
 *   - Service JSON-LD
 *   - FAQPage JSON-LD (via FAQAccordion auto-inject)
 *   - BreadcrumbList JSON-LD
 */

import { Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import PageHero from "@/components/shared/PageHero";
import { Section } from "@/components/sections/Section";
import { Button } from "@/ui/Button";
import { Card } from "@/design-system/components/Card";
import { SectionHeader, ProofStrip } from "@/design-system/components";
import { FAQAccordion } from "@/design-system/components/FAQAccordion";
import { CheckCircle2, Shield, FileCheck, Clock, ArrowRight } from "lucide-react";
import { SITE_URL } from "@/constants/company";
import {
  generateFAQSchema,
  generateBreadcrumbSchema,
  generateServiceSchema,
} from "@/utils/seo/structured-data";
import { serviceAreaCities } from "@/data/service-area-cities";
import {
  WAVE1_PAGES,
  WAVE1_PRETTY_NAMES,
  type Wave1ServicePage as Wave1PageData,
} from "@/data/wave1-services";

interface Wave1ServicePageProps {
  slug: keyof typeof WAVE1_PAGES;
}

export const Wave1ServicePage = ({ slug }: Wave1ServicePageProps) => {
  const page: Wave1PageData = WAVE1_PAGES[slug];
  if (!page) return null;

  const canonical = `${SITE_URL}/services/${page.slug}`;

  const serviceSchema = generateServiceSchema({
    name: page.h1,
    description: page.metaDescription,
    slug: page.slug,
    image: `${SITE_URL}/og-image.png`,
  });

  const faqSchema = generateFAQSchema(page.faqs);

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: `${SITE_URL}/` },
    { name: "Services", url: `${SITE_URL}/services` },
    { name: page.eyebrow, url: canonical },
  ]);

  return (
    <div className="min-h-screen flex flex-col">
      <SEO
        title={page.title}
        description={page.metaDescription}
        keywords={[page.primaryKeyword, ...page.secondaryKeywords].join(", ")}
        canonical={canonical}
        structuredData={[serviceSchema, faqSchema, breadcrumbSchema]}
      />

      {page.knownTradeoff && (
        // Documented in source for future maintainers; not rendered.
        <span hidden data-tradeoff-note={page.knownTradeoff} />
      )}

      <Navigation />

      <PageHero
        title={page.h1}
        eyebrow={page.eyebrow}
        description={page.directAnswer}
        imageAlt={page.heroAlt}
        height="medium"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Services", href: "/services" },
          { label: page.eyebrow },
        ]}
      />

      {/* Trust strip */}
      <Section size="tight" className="bg-muted/30" disableAnimation>
        <ProofStrip
          items={[
            { icon: Shield, value: "WSIB", label: "Certified" },
            { icon: FileCheck, value: "$2M", label: "CGL Coverage" },
            { icon: Clock, value: "Self-Perform", label: "Our Crew, No Subs" },
            { icon: CheckCircle2, value: "15+ yrs", label: "Combined Crew Experience" },
          ]}
          variant="light"
          columns={4}
        />
      </Section>

      {/* Scope or split sections */}
      <Section size="major">
        <div className="max-w-5xl mx-auto">
          <SectionHeader
            badge={page.eyebrow}
            title={page.scopeHeading}
            align="left"
            maxWidth="lg"
          />

          {page.splitSections && page.splitSections.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
              {page.splitSections.map((section) => (
                <Card key={section.heading} variant="elevated" className="h-full">
                  <h3 className="text-xl font-bold text-foreground mb-1">
                    {section.heading}
                  </h3>
                  <p className="text-sm text-primary font-medium mb-4">
                    {section.audience}
                  </p>
                  <ul className="space-y-2">
                    {section.bullets.map((b) => (
                      <li key={b} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </Card>
              ))}
            </div>
          ) : (
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-8">
              {page.scopeBullets.map((b) => (
                <li
                  key={b}
                  className="flex items-start gap-3 p-4 rounded-lg bg-muted/30 border border-border"
                >
                  <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-foreground">{b}</span>
                </li>
              ))}
            </ul>
          )}

          {/* Materials */}
          {page.materials && page.materials.length > 0 && (
            <div className="mt-12">
              <h3 className="text-lg font-bold text-foreground mb-4">
                {page.materialsHeading ?? "Systems we apply"}
              </h3>
              <div className="flex flex-wrap gap-2">
                {page.materials.map((m) => (
                  <span
                    key={m}
                    className="px-4 py-2 rounded-full bg-primary/5 border border-primary/20 text-sm text-foreground"
                  >
                    {m}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </Section>

      {/* City coverage */}
      <Section size="subsection" className="bg-muted/30">
        <div className="max-w-5xl mx-auto">
          <SectionHeader
            badge="Service Area"
            title="Cities we serve across the GTA"
            align="left"
            maxWidth="lg"
          />
          <div className="flex flex-wrap gap-2 mt-6">
            {serviceAreaCities.map((city) => (
              <span
                key={city}
                className="px-3 py-1.5 rounded-md bg-background border border-border text-sm text-muted-foreground"
              >
                {city}
              </span>
            ))}
          </div>
        </div>
      </Section>

      {/* FAQ — emits FAQPage JSON-LD via FAQAccordion */}
      <Section size="major">
        <div className="max-w-3xl mx-auto">
          <SectionHeader
            badge="FAQ"
            title="Frequently asked questions"
            align="left"
            maxWidth="lg"
          />
          <div className="mt-8">
            <FAQAccordion faqs={page.faqs} emitSchema={false} />
          </div>
        </div>
      </Section>

      {/* Related services */}
      {page.related.length > 0 && (
        <Section size="subsection" className="bg-muted/30">
          <div className="max-w-5xl mx-auto">
            <SectionHeader
              badge="Related"
              title="Related services"
              align="left"
              maxWidth="lg"
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              {page.related.map((relatedSlug) => {
                const related = WAVE1_PAGES[relatedSlug];
                if (!related) return null;
                return (
                  <Link
                    key={relatedSlug}
                    to={`/services/${relatedSlug}`}
                    className="group"
                  >
                    <Card variant="elevated" hover className="h-full">
                      <p className="text-xs font-semibold text-primary uppercase tracking-wide mb-2">
                        {related.eyebrow}
                      </p>
                      <h4 className="text-lg font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                        {related.h1}
                      </h4>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {related.metaDescription}
                      </p>
                      <div className="flex items-center text-sm font-medium text-primary mt-4">
                        View service{" "}
                        <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </Card>
                  </Link>
                );
              })}
              {/* Always link back to EIFS — the cornerstone page already ranking */}
              <Link to="/services/eifs-stucco-systems" className="group">
                <Card variant="elevated" hover className="h-full">
                  <p className="text-xs font-semibold text-primary uppercase tracking-wide mb-2">
                    EIFS & Stucco
                  </p>
                  <h4 className="text-lg font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                    EIFS & Stucco Systems
                  </h4>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    Sto Canada Listed Installer for EIFS installation, repair, and recoats across the GTA.
                  </p>
                  <div className="flex items-center text-sm font-medium text-primary mt-4">
                    View service{" "}
                    <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Card>
              </Link>
            </div>
          </div>
        </Section>
      )}

      {/* CTA */}
      <Section size="major">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Request a proposal for {WAVE1_PRETTY_NAMES[page.slug]}
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Site walkthrough, fixed-price proposal, and certificates issued before
            mobilization. We respond within 24 hours.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg">
              <Link to={`/estimate?service=${page.ctaSlug}`}>
                Request a Proposal
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link to="/contact">Talk to a Project Manager</Link>
            </Button>
          </div>
        </div>
      </Section>

      <Footer />
    </div>
  );
};

export default Wave1ServicePage;
