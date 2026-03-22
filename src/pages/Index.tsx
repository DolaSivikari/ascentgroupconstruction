// Build trigger: 2026-03-09T18:55
import { useEffect } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import EnhancedHero from "@/components/homepage/EnhancedHero";
import SEO from "@/components/SEO";
import SkipLink from "@/components/SkipLink";
import { createHowToSchema, createQASchema, createSiteSearchSchema } from "@/utils/schema-injector";
import WhyChooseUs from "@/components/homepage/WhyChooseUs";
import WhoWeServeHomepage from "@/components/homepage/WhoWeServeHomepage";
import { HomepageProofStrip } from "@/components/homepage/HomepageProofStrip";
import { HomepageProcessStrip } from "@/components/homepage/HomepageProcessStrip";
import { HomepageServiceHighlights } from "@/components/homepage/HomepageServiceHighlights";
import { HomepageFeaturedProjects } from "@/components/homepage/HomepageFeaturedProjects";
import { HomepageFinalCta } from "@/components/homepage/HomepageFinalCta";
import { videoSchema } from "@/utils/structured-data";
import { getHomepageVideos } from "@/data/video-metadata";

import { personalization } from "@/utils/personalization";
import { initializeTests } from "@/utils/ab-testing";
import { ScrollToTop } from "@/components/ui/scroll-to-top";
import { usePageAnalytics } from "@/hooks/usePageAnalytics";
import { usePerformanceMonitoring } from "@/hooks/usePerformanceMonitoring";
import { useHomepageData } from "@/hooks/useHomepageData";

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

  const specialtyContractorSchema = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "name": "Ascent Group Construction",
    "description": "Specialty contractor for building envelope and restoration: complete cladding systems, building envelope solutions, masonry restoration, interior construction, and sustainable building across Ontario & the GTA.",
    "url": "https://ascentgroupconstruction.com/",
    "email": "mailto:info@ascentgroupconstruction.com",
    "areaServed": [
      { "@type": "State", "name": "Ontario" },
      { "@type": "City", "name": "Toronto" },
      { "@type": "City", "name": "Mississauga" },
      { "@type": "City", "name": "Brampton" },
      { "@type": "City", "name": "Vaughan" },
      { "@type": "City", "name": "Markham" },
    ],
    "priceRange": "$25000-$150000",
    "serviceType": "Building Envelope & Restoration Contractor",
    "knowsAbout": [
      "building envelope systems", "cladding systems", "metal panels", "EIFS and stucco",
      "masonry restoration", "protective coatings", "interior construction", "painting services",
      "tile and flooring", "sustainable building practices", "energy-efficient envelope systems",
      "commercial construction", "multi-family construction",
    ],
  };

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

  const siteSearchSchema = createSiteSearchSchema("https://ascentgroupconstruction.com");

  const homepageVideos = getHomepageVideos();
  const videoSchemas = homepageVideos.map(video => videoSchema({
    name: video.name,
    description: video.description,
    thumbnailUrl: `${window.location.origin}${video.thumbnailUrl}`,
    uploadDate: video.uploadDate,
    contentUrl: `${window.location.origin}${video.contentUrl}`,
    duration: video.duration,
  }));

  return (
    <>
      <div className="min-h-screen relative">
        <SkipLink />
        <SEO
          title="Building Envelope & Restoration Specialists | Specialty Contractor Ontario & GTA"
          description="Specialty contractor in Ontario & GTA delivering façade remediation, waterproofing, EIFS, masonry, restoration. 15+ years crew experience, 85% self-performed. WSIB compliant, $2M CGL."
          keywords="specialty contractor Ontario, building envelope contractor GTA, facade remediation Toronto, waterproofing contractor, EIFS contractor, masonry restoration, parking garage repair"
          canonical="https://ascentgroupconstruction.com/"
          structuredData={[specialtyContractorSchema, howToChooseContractor, whatDoesAscentDo, whyChooseUsSchema, siteSearchSchema, ...videoSchemas]}
          includeRating={true}
        />
        <Navigation />

        <main id="main-content" role="main">
          {/* 1. Hero */}
          <EnhancedHero />

          {/* ── Zone A: White background ── */}
          <div className="bg-background">
            <HomepageProofStrip />
            <HomepageServiceHighlights />
          </div>

          {/* ── Zone B: Muted background ── */}
          <div className="bg-muted/30">
            <WhoWeServeHomepage />
            <HomepageFeaturedProjects />
            <WhyChooseUs />
          </div>

          {/* ── Zone C: Gradient transition ── */}
          <HomepageProcessStrip />

          {/* ── Zone D: Primary CTA ── */}
          <HomepageFinalCta />
        </main>

        <Footer />
        <ScrollToTop />
      </div>
    </>
  );
};

export default Index;
