// Build trigger: 2026-03-09T18:55
import { lazy, Suspense, useEffect } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import EnhancedHero from "@/components/homepage/EnhancedHero";
import { HeroSurface } from "@/components/shared/HeroPresenceProvider";
import SEO from "@/components/SEO";
import SkipLink from "@/components/SkipLink";
import { createHowToSchema, createQASchema, createSiteSearchSchema } from "@/utils/schema-injector";
import { SITE_URL } from "@/constants/company";
// Above-the-fold proof strip stays eager (renders immediately under hero)
import { HomepageProofStrip } from "@/components/homepage/HomepageProofStrip";
// Below-the-fold sections are lazy-loaded to slim the initial JS bundle and reduce TBT.
// They sit below the hero+proof strip so users won't see the Suspense fallback in normal scrolling.
const HomepageServiceHighlights = lazy(() =>
  import("@/components/homepage/HomepageServiceHighlights").then(m => ({ default: m.HomepageServiceHighlights }))
);
const WhoWeServeHomepage = lazy(() => import("@/components/homepage/WhoWeServeHomepage"));
const HomepageFeaturedProjects = lazy(() =>
  import("@/components/homepage/HomepageFeaturedProjects").then(m => ({ default: m.HomepageFeaturedProjects }))
);
const HomepageParallaxBreak = lazy(() =>
  import("@/components/homepage/HomepageParallaxBreak").then(m => ({ default: m.HomepageParallaxBreak }))
);
const WhyChooseUs = lazy(() => import("@/components/homepage/WhyChooseUs"));
const InteractiveCTA = lazy(() => import("@/components/homepage/InteractiveCTA"));
const HomepageFinalCta = lazy(() =>
  import("@/components/homepage/HomepageFinalCta").then(m => ({ default: m.HomepageFinalCta }))
);
import { videoSchema } from "@/utils/structured-data";
import { getHomepageVideos } from "@/data/video-metadata";

import { personalization } from "@/utils/personalization";
import { initializeTests } from "@/utils/ab-testing";

import { usePageAnalytics } from "@/hooks/usePageAnalytics";
import { usePerformanceMonitoring } from "@/hooks/usePerformanceMonitoring";
import { useHomepageData } from "@/hooks/useHomepageData";

// Lightweight skeleton placeholder for lazy section boundaries — keeps layout stable
// without pulling extra components into the critical path.
const SectionFallback = () => <div aria-hidden="true" className="min-h-[400px]" />;

const Index = () => {
  usePerformanceMonitoring('homepage');
  useHomepageData();
  usePageAnalytics('homepage');

  useEffect(() => {
    personalization.initialize();
    initializeTests();
    document.documentElement.classList.remove('loading', 'page-loading');
  }, []);

  // AEO/GEO Structured Data
  const howToChooseContractor = createHowToSchema({
    name: "How to Choose a Reliable Construction Contractor in Ontario",
    description: "A step-by-step guide to selecting a qualified construction contractor for your commercial or residential project",
    steps: [
      { position: 1, name: "Verify Licensing and Insurance", text: "Ensure the contractor has valid WSIB coverage, liability insurance, and necessary municipal licenses in Ontario" },
      { position: 2, name: "Check Experience and Portfolio", text: "Review their portfolio of completed projects similar to yours, with a minimum of 10+ years industry experience" },
      { position: 3, name: "Request Multiple References", text: "Contact at least 3 recent clients and verify project quality, timeline adherence, and communication" },
      { position: 4, name: "Compare Detailed Estimates", text: "Get itemized quotes from 3+ contractors, comparing materials, timelines, and warranties" },
      { position: 5, name: "Review Contract Terms", text: "Ensure written contracts include payment schedules, change order procedures, and completion guarantees" },
    ],
  });

  const whatDoesAscentDo = createQASchema(
    "What services does Ascent Group Construction provide?",
    "Ascent Group Construction is a specialty contractor for building envelope and restoration across Ontario. We deliver complete cladding systems (metal panels, EIFS, stucco), building envelope solutions, masonry restoration, protective coatings, interior construction, painting services, tile & flooring, and sustainable building practices. With self-performed core trades and 15+ years of team experience, we serve developers, property managers, and building owners across Toronto and the GTA."
  );

  const whyChooseUsSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "Why Choose Ascent Group Construction",
    "description": "Key reasons to choose Ascent Group Construction for your Toronto and GTA construction projects",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Licensed Construction Excellence Across Ontario", "description": "Fully licensed and insured with $2M CGL liability coverage, active WSIB registration, working toward COR certification." },
      { "@type": "ListItem", "position": 2, "name": "Specialty Trade Services", "description": "Envelope and interior trade services including masonry repair, EIFS installation, metal cladding, and parking garage restoration." },
      { "@type": "ListItem", "position": 3, "name": "Premium Materials & Manufacturer Warranties", "description": "Benjamin Moore and Sherwin-Williams authorized contractor using premium materials backed by extended warranties." },
    ],
  };

  const siteSearchSchema = createSiteSearchSchema(SITE_URL);

  const homepageVideos = getHomepageVideos();
  const videoSchemas = homepageVideos.map(video => videoSchema({
    name: video.name,
    description: video.description,
    thumbnailUrl: `${SITE_URL}${video.thumbnailUrl}`,
    uploadDate: video.uploadDate,
    contentUrl: `${SITE_URL}${video.contentUrl}`,
    duration: video.duration,
  }));

  return (
    <>
      <div className="min-h-screen relative">
        <SkipLink />
        <SEO
          title="Envelope & Restoration GTA"
          description="Specialty contractor in the GTA delivering façade remediation, waterproofing, EIFS, masonry & restoration. 15+ yrs crew, self-performed, WSIB, $2M CGL."
          keywords="specialty contractor Ontario, building envelope contractor GTA, facade remediation Toronto, waterproofing contractor, EIFS contractor, masonry restoration, parking garage repair"
          canonical={`${SITE_URL}/`}
          structuredData={[howToChooseContractor, whatDoesAscentDo, whyChooseUsSchema, siteSearchSchema, ...videoSchemas]}
        />
        <Navigation />

        <main id="main-content" role="main">
          {/* 1. Hero */}
          <HeroSurface><EnhancedHero /></HeroSurface>

          {/* ── Zone A: White background ── */}
          <div className="bg-background">
            <HomepageProofStrip />
            <Suspense fallback={<SectionFallback />}>
              <HomepageServiceHighlights />
            </Suspense>
          </div>

          {/* All below-the-fold sections share one Suspense boundary so chunks can stream in together */}
          <Suspense fallback={<SectionFallback />}>
            {/* ── Zone B: Muted background ── */}
            <div className="bg-muted/30">
              <WhoWeServeHomepage />
              <HomepageFeaturedProjects />
            </div>

            {/* ── Full-bleed parallax break ── */}
            <HomepageParallaxBreak />

            {/* ── Zone B continued ── */}
            <div className="bg-muted/30">
              <WhyChooseUs />
            </div>

            {/* ── Inline Conversion Form ── */}
            <InteractiveCTA />

            {/* ── Zone D: Primary CTA ── */}
            <HomepageFinalCta />
          </Suspense>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default Index;
