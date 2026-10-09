import { usePageContent } from "@/hooks/usePageContent";
import contentModule from "@/content/pages/home";
// Build trigger: 2026-03-09T18:55
import { lazy, Suspense, useEffect, type ReactNode } from "react";
import { DeferredBoundary } from "@/components/DeferredBoundary";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import EnhancedHero from "@/components/homepage/EnhancedHero";
import { HeroSurface } from "@/components/shared/HeroPresenceProvider";
import SEO from "@/components/SEO";
import { HomepageEntryPaths } from "@/components/homepage/HomepageEntryPaths";
import {
  createHowToSchema,
  createQASchema,
  createSiteSearchSchema,
} from "@/utils/schema-injector";
import { SITE_URL } from "@/constants/company";
// Above-the-fold proof strip stays eager (renders immediately under hero)
import { HomepageProofStrip } from "@/components/homepage/HomepageProofStrip";
// Below-the-fold sections are lazy-loaded to slim the initial JS bundle and reduce TBT.
// They sit below the hero+proof strip so users won't see the Suspense fallback in normal scrolling.
const HomepageServiceHighlights = lazy(() =>
  import("@/components/homepage/HomepageServiceHighlights").then((m) => ({
    default: m.HomepageServiceHighlights,
  })),
);
const WhoWeServeHomepage = lazy(
  () => import("@/components/homepage/WhoWeServeHomepage"),
);
const HomepageFeaturedProjects = lazy(() =>
  import("@/components/homepage/HomepageFeaturedProjects").then((m) => ({
    default: m.HomepageFeaturedProjects,
  })),
);
const HomepageParallaxBreak = lazy(() =>
  import("@/components/homepage/HomepageParallaxBreak").then((m) => ({
    default: m.HomepageParallaxBreak,
  })),
);
const WhyChooseUs = lazy(() => import("@/components/homepage/WhyChooseUs"));
const InteractiveCTA = lazy(
  () => import("@/components/homepage/InteractiveCTA"),
);
const HomepageFinalCta = lazy(() =>
  import("@/components/homepage/HomepageFinalCta").then((m) => ({
    default: m.HomepageFinalCta,
  })),
);
const HomepageQuestions = lazy(() => import("@/components/homepage/HomepageQuestions"));
import { videoSchema } from "@/utils/structured-data";
import { getHomepageVideos } from "@/data/video-metadata";

import { personalization } from "@/utils/personalization";
import { initializeTests } from "@/utils/ab-testing";

import { usePageAnalytics } from "@/hooks/usePageAnalytics";
import { usePerformanceMonitoring } from "@/hooks/usePerformanceMonitoring";
import { useHomepageData } from "@/hooks/useHomepageData";

// Lightweight skeleton placeholder for lazy section boundaries — keeps layout stable
// without pulling extra components into the critical path.
const SectionFallback = () => (
  <div aria-hidden="true" className="min-h-[400px]" />
);
const DeferredSection = ({
  name,
  children,
}: {
  name: string;
  children: ReactNode;
}) => (
  <DeferredBoundary name={name}>
    <Suspense fallback={<SectionFallback />}>{children}</Suspense>
  </DeferredBoundary>
);

const Index = () => {
  const c = usePageContent(contentModule);

  usePerformanceMonitoring("homepage");
  useHomepageData();
  usePageAnalytics("homepage");

  useEffect(() => {
    personalization.initialize();
    initializeTests();
    document.documentElement.classList.remove("loading", "page-loading");
  }, []);

  // AEO/GEO Structured Data
  const howToChooseContractor = createHowToSchema({
    name: c.f001,
    description: c.f002,
    steps: [
      { position: 1, name: c.f003, text: c.f004 },
      { position: 2, name: c.f005, text: c.f006 },
      { position: 3, name: c.f007, text: c.f008 },
      { position: 4, name: c.f009, text: c.f010 },
      { position: 5, name: c.f011, text: c.f012 },
    ],
  });

  const whatDoesAscentDo = createQASchema(
    "What services does Ascent Group Construction provide?",
    "Ascent Group Construction is a specialty contractor for building envelope and restoration across Ontario. We deliver complete cladding systems (metal panels, EIFS, stucco), building envelope solutions, masonry restoration, protective coatings, interior construction, painting services, tile & flooring, and sustainable building practices. With self-performed core trades and 15+ years of team experience, we serve developers, property managers, and building owners across Toronto and the GTA.",
  );

  const whyChooseUsSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: c.f013,
    description: c.f014,
    itemListElement: [
      { "@type": "ListItem", position: 1, name: c.f015, description: c.f016 },
      { "@type": "ListItem", position: 2, name: c.f017, description: c.f018 },
      { "@type": "ListItem", position: 3, name: c.f019, description: c.f020 },
    ],
  };

  const siteSearchSchema = createSiteSearchSchema(SITE_URL);

  const homepageVideos = getHomepageVideos();
  const videoSchemas = homepageVideos.map((video) =>
    videoSchema({
      name: video.name,
      description: video.description,
      thumbnailUrl: `${SITE_URL}${video.thumbnailUrl}`,
      uploadDate: video.uploadDate,
      contentUrl: `${SITE_URL}${video.contentUrl}`,
      duration: video.duration,
    }),
  );

  return (
    <>
      <div className="min-h-screen relative">
        <SEO
          title={c.f021}
          description={c.f022}
          keywords="specialty contractor Ontario, building envelope contractor GTA, facade remediation Toronto, waterproofing contractor, EIFS contractor, masonry restoration, parking garage repair"
          canonical={`${SITE_URL}/`}
          structuredData={[
            howToChooseContractor,
            whatDoesAscentDo,
            whyChooseUsSchema,
            siteSearchSchema,
            ...videoSchemas,
          ]}
        />
        <Navigation />

        <main id="main-content" role="main">
          {/* 1. Hero */}
          <HeroSurface>
            <EnhancedHero />
          </HeroSurface>

          {/* ── Zone A: White background ── */}
          <div className="bg-background">
            <HomepageEntryPaths />
            <HomepageProofStrip />
            <DeferredSection name="Service highlights">
              <HomepageServiceHighlights />
            </DeferredSection>
          </div>

          {/* ── Zone B: Muted background ── */}
          <div className="bg-muted/30">
            <DeferredSection name="Who we serve">
              <WhoWeServeHomepage />
            </DeferredSection>
            <DeferredSection name="Featured projects">
              <HomepageFeaturedProjects />
            </DeferredSection>
          </div>

          {/* ── Full-bleed parallax break ── */}
          <DeferredSection name="Project showcase">
            <HomepageParallaxBreak />
          </DeferredSection>

          {/* ── Zone B continued ── */}
          <div className="bg-muted/30">
            <DeferredSection name="Why choose us">
              <WhyChooseUs />
            </DeferredSection>
          </div>

          <DeferredSection name="Project questions">
            <HomepageQuestions />
          </DeferredSection>

          {/* ── Inline Conversion Form ── */}
          <DeferredSection name="Project inquiry">
            <InteractiveCTA />
          </DeferredSection>

          {/* ── Zone D: Primary CTA ── */}
          <DeferredSection name="Get in touch">
            <HomepageFinalCta />
          </DeferredSection>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default Index;
