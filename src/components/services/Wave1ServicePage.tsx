import { useWaveContent } from "@/hooks/useSharedContent";
/**
 * Wave1ServicePage — shared composition for the static AEO/GEO landing pages
 * (Wave 1 + Wave 2). Mirrors src/pages/ServiceDetail.tsx so these pages match
 * the rest of the site exactly: standard PageHero (with image + hero badges),
 * TrustRibbon, DirectAnswer, QuickFacts, PeopleAlsoAsk, ServiceAreaSection,
 * FAQAccordion, RelatedLinksGrid, and CTABand.
 *
 * All copy comes from src/data/wave1-services.ts — page files are one-line
 * shims that pass a slug.
 */

import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import PageHero from "@/components/shared/PageHero";
import DirectAnswer from "@/components/seo/DirectAnswer";
import QuickFacts from "@/components/seo/QuickFacts";
import PeopleAlsoAsk from "@/components/seo/PeopleAlsoAsk";
import ServiceAreaSection from "@/components/seo/ServiceAreaSection";
import { TrustRibbon } from "@/design-system/components/TrustRibbon";
import { FAQAccordion } from "@/design-system/components/FAQAccordion";
import { RelatedLinksGrid } from "@/design-system/components/RelatedLinksGrid";
import { CTABand } from "@/design-system/components/CTABand";
import { SectionHeader } from "@/design-system/components/SectionHeader";
import { Card, CardContent } from "@/design-system/components/Card";
import { CTA_TEXT } from "@/design-system/constants";
import { CheckCircle2, ShieldCheck, Award, Building2 } from "lucide-react";

import { SITE_URL } from "@/constants/company";
import { serviceAreaCities } from "@/data/service-area-cities";
import { getServiceParent } from "@/data/service-registry";
import { ServiceSpecialties } from "./ServiceSpecialties";
import {
  generateFAQSchema,
  generateBreadcrumbSchema,
  generateServiceSchema,
} from "@/utils/seo/structured-data";
import {
  WAVE1_PAGES,
  WAVE1_PRETTY_NAMES,
  type Wave1ServicePage as Wave1PageData,
} from "@/data/wave1-services";

import { resolveServiceHero } from "@/data/hero-images";

// Standard hero badges per slug (frosted-glass pills — see mem://design/hero-badges-system)
const HERO_BADGES_MAP: Record<
  string,
  Array<{ icon: typeof ShieldCheck; text: string }>
> = {
  "commercial-painting-gta": [
    { icon: ShieldCheck, text: "$2M CGL · WSIB" },
    { icon: Building2, text: "Self-Performed" },
    { icon: Award, text: "Off-Hours Available" },
  ],
  "exterior-painting-toronto": [
    { icon: ShieldCheck, text: "EIFS / Stucco Recoats" },
    { icon: Building2, text: "Lift & Swing-Stage" },
    { icon: Award, text: "Manufacturer Systems" },
  ],
  "caulking-sealants-toronto": [
    { icon: ShieldCheck, text: "Sika · Tremco · Dow" },
    { icon: Building2, text: "Building Envelope" },
    { icon: Award, text: "Warranty Documented" },
  ],
  "fire-retardant-coatings-ontario": [
    { icon: ShieldCheck, text: "OBC Compliant" },
    { icon: Building2, text: "UL / ULC Assemblies" },
    { icon: Award, text: "WFT/DFT Documented" },
  ],
  "interior-painting-toronto": [
    { icon: ShieldCheck, text: "Low-VOC Systems" },
    { icon: Building2, text: "Off-Hours Scheduling" },
    { icon: Award, text: "Self-Performed" },
  ],
  "residential-exterior-painting-gta": [
    { icon: ShieldCheck, text: "$2M CGL · WSIB" },
    { icon: Building2, text: "Weather-Window Scheduled" },
    { icon: Award, text: "Premium Exterior Systems" },
  ],
  "tile-installation-toronto": [
    { icon: ShieldCheck, text: "Schluter & Mapei Certified" },
    { icon: Building2, text: "TTMAC / TCNA Standards" },
    { icon: Award, text: "Commercial & Residential" },
  ],
  "flooring-installation-gta": [
    { icon: ShieldCheck, text: "LVT · Laminate · Hardwood" },
    { icon: Building2, text: "Moisture Tested" },
    { icon: Award, text: "Condo IIC Compliant" },
  ],
  "handyman-patching-toronto": [
    { icon: ShieldCheck, text: "$2M CGL · WSIB" },
    { icon: Building2, text: "Property Manager Friendly" },
    { icon: Award, text: "Same-Day Quotes" },
  ],
};

interface Wave1ServicePageProps {
  slug: keyof typeof WAVE1_PAGES;
}

export const Wave1ServicePage = ({ slug }: Wave1ServicePageProps) => {
  const page: Wave1PageData = useWaveContent(slug);
  const parent = getServiceParent(slug);
  if (!page) return null;

  const canonical = `${SITE_URL}/services/${page.slug}`;
  const heroImage = resolveServiceHero(page.slug).image;
  const badges = HERO_BADGES_MAP[page.slug];

  // JSON-LD payload (Service + FAQPage + BreadcrumbList)
  const serviceSchema = generateServiceSchema({
    name: page.h1,
    description: page.metaDescription,
    slug: page.slug,
    image: heroImage ? `${SITE_URL}${heroImage}` : `${SITE_URL}/og-image.png`,
  });
  const faqSchema = generateFAQSchema(page.faqs);
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: `${SITE_URL}/` },
    { name: "Services", url: `${SITE_URL}/services` },
    ...(parent
      ? [{ name: parent.navLabel, url: `${SITE_URL}${parent.path}` }]
      : []),
    { name: page.eyebrow, url: canonical },
  ]);

  // Derive QuickFacts from scope bullets — first 5, normalized into label/value pairs
  // so QuickFacts component renders cleanly without rewriting the data file.
  const quickFacts = page.scopeBullets.slice(0, 5).map((bullet) => {
    const [first, ...rest] = bullet.split(/[:—–-]\s/);
    return rest.length > 0
      ? { label: first.trim(), value: rest.join(" ").trim() }
      : { label: "Included", value: bullet };
  });

  // People Also Ask: first 4 FAQs promoted as the snippet block (full set still
  // renders in the FAQAccordion below). PeopleAlsoAsk emits its own FAQPage
  // schema, so we disable schema there to avoid duplication.
  const peopleAlsoAskQuestions = page.faqs.slice(0, 4);

  // Related siblings → standard 3-up RelatedLinksGrid
  const relatedLinks = page.related
    .map((relatedSlug) => {
      const related = WAVE1_PAGES[relatedSlug];
      if (!related) return null;
      return {
        title: related.h1,
        description: related.metaDescription,
        href: `/services/${relatedSlug}`,
      };
    })
    .filter(
      (l): l is { title: string; description: string; href: string } =>
        l !== null,
    );

  // Always anchor back to the EIFS cornerstone page
  relatedLinks.push({
    title: "EIFS & Stucco Systems",
    description:
      "Sto Canada Listed Installer for EIFS installation, repair, and recoats across the GTA.",
    href: "/services/eifs-stucco-systems",
  });

  return (
    <div className="min-h-screen">
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
        description={page.metaDescription}
        image={heroImage}
        imageAlt={page.heroAlt}
        height="medium"
        overlay="gradient"
        primaryCta={{
          text: CTA_TEXT.primary,
          href: `/estimate?service=${page.ctaSlug}`,
        }}
        secondaryCta={{ text: "Talk to a PM", href: "/contact" }}
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Services", href: "/services" },
          ...(parent ? [{ label: parent.navLabel, href: parent.path }] : []),
          { label: page.eyebrow },
        ]}
        {...(badges ? { badges } : {})}
      />

      <TrustRibbon />

      <main>
        {/* Direct Answer — citation-ready paragraph for AI engines */}
        <DirectAnswer>
          <p className="text-lg leading-relaxed">{page.directAnswer}</p>
        </DirectAnswer>

        {/* Quick Facts */}
        {quickFacts.length > 0 && (
          <section className="py-12 bg-background">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto">
                <QuickFacts
                  title={`Quick Facts: ${page.h1}`}
                  facts={quickFacts}
                />
              </div>
            </div>
          </section>
        )}

        {/* Scope of work / split sections */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
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
                    <Card
                      key={section.heading}
                      variant="elevated"
                      className="h-full"
                    >
                      <CardContent className="p-6">
                        <h3 className="text-xl font-bold text-foreground mb-1">
                          {section.heading}
                        </h3>
                        <p className="text-sm text-primary font-medium mb-4">
                          {section.audience}
                        </p>
                        <ul className="space-y-2">
                          {section.bullets.map((b) => (
                            <li
                              key={b}
                              className="flex items-start gap-2 text-sm text-muted-foreground"
                            >
                              <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                              <span>{b}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="border-l-4 border-primary bg-muted/30 rounded-r-lg p-6 mt-8">
                  <div className="grid sm:grid-cols-2 gap-x-6 gap-y-3">
                    {page.scopeBullets.map((item) => (
                      <div key={item} className="flex items-start gap-2.5">
                        <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0 mt-1" />
                        <span className="text-sm text-foreground/90 leading-relaxed">
                          {item}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Materials */}
              {page.materials && page.materials.length > 0 && (
                <div className="mt-12">
                  <h3 className="text-lg font-bold text-foreground mb-4">
                    {page.materialsHeading ?? "Systems we apply"}
                  </h3>
                  <div className="flex flex-wrap gap-2.5">
                    {page.materials.map((m) => (
                      <span
                        key={m}
                        className="inline-flex items-center px-4 py-2 rounded-full bg-muted text-sm font-medium text-foreground/80 border border-border hover:border-primary/40 hover:bg-primary/5 transition-colors"
                      >
                        {m}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* People Also Ask — AEO snippet block */}
        {peopleAlsoAskQuestions.length > 0 && (
          <section className="py-12 bg-muted/30 border-y border-border/50">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto">
                <PeopleAlsoAsk
                  questions={peopleAlsoAskQuestions}
                  title={`${WAVE1_PRETTY_NAMES[page.slug]} — People Also Ask`}
                  emitSchema={false}
                />
              </div>
            </div>
          </section>
        )}

        <ServiceSpecialties slug={slug} />

        {/* Service Area */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <ServiceAreaSection cities={serviceAreaCities} />
          </div>
        </section>

        {/* Full FAQ — emits FAQPage JSON-LD */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
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
          </div>
        </section>

        {/* Related */}
        <RelatedLinksGrid
          title="Related services"
          links={relatedLinks}
          background="default"
        />
      </main>

      <CTABand
        title={`Request a proposal for ${WAVE1_PRETTY_NAMES[page.slug]}`}
        description="Site walkthrough, fixed-price proposal, and certificates issued before mobilization. We respond within 24 hours."
        primaryCta={{
          text: "Request a Proposal",
          href: `/estimate?service=${page.ctaSlug}`,
        }}
        secondaryCta={{ text: "Talk to a Project Manager", href: "/contact" }}
        variant="dark"
      />

      <Footer />
    </div>
  );
};

export default Wave1ServicePage;
