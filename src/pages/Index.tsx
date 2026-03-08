import { useEffect } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import EnhancedHero from "@/components/homepage/EnhancedHero";
import { ServicesExplorer } from "@/components/services/ServicesExplorer";
import SEO from "@/components/SEO";
import PrequalPackage from "@/components/homepage/PrequalPackage";
import SkipLink from "@/components/SkipLink";
import { createHowToSchema, createQASchema, createSiteSearchSchema } from "@/utils/schema-injector";
import { TrustBadgeBar } from "@/components/homepage/TrustBadgeBar";
import WhyChooseUs from "@/components/homepage/WhyChooseUs";
import CompanyOverviewHub from "@/components/homepage/CompanyOverviewHub";
import WhoWeServeHomepage from "@/components/homepage/WhoWeServeHomepage";
import { videoSchema } from "@/utils/structured-data";
import { getHomepageVideos } from "@/data/video-metadata";

import { personalization } from "@/utils/personalization";
import { initializeTests } from "@/utils/ab-testing";
import { ScrollToTop } from "@/components/ui/scroll-to-top";
import { usePageAnalytics } from "@/hooks/usePageAnalytics";
import { usePerformanceMonitoring } from "@/hooks/usePerformanceMonitoring";
import { useHomepageData } from "@/hooks/useHomepageData";

const Index = () => {
  // Performance monitoring
  usePerformanceMonitoring('homepage');

  // Prefetch homepage data for faster loading
  useHomepageData();

  // Analytics tracking
  usePageAnalytics('homepage');

  // Initialize personalization and A/B testing
  useEffect(() => {
    personalization.initialize();
    initializeTests();
    // Remove loading classes immediately (no splash screen)
    document.documentElement.classList.remove('loading', 'page-loading');
  }, []);

  // AEO/GEO Structured Data
  const howToChooseContractor = createHowToSchema({
    name: "How to Choose a Reliable Construction Contractor in Ontario",
    description: "A step-by-step guide to selecting a qualified construction contractor for your commercial or residential project",
    steps: [
      {
        position: 1,
        name: "Verify Licensing and Insurance",
        text: "Ensure the contractor has valid WSIB coverage, liability insurance, and necessary municipal licenses in Ontario"
      },
      {
        position: 2,
        name: "Check Experience and Portfolio",
        text: "Review their portfolio of completed projects similar to yours, with a minimum of 10+ years industry experience"
      },
      {
        position: 3,
        name: "Request Multiple References",
        text: "Contact at least 3 recent clients and verify project quality, timeline adherence, and communication"
      },
      {
        position: 4,
        name: "Compare Detailed Estimates",
        text: "Get itemized quotes from 3+ contractors, comparing materials, timelines, and warranties"
      },
      {
        position: 5,
        name: "Review Contract Terms",
        text: "Ensure written contracts include payment schedules, change order procedures, and completion guarantees"
      }
    ]
  });

  const whatDoesAscentDo = createQASchema(
    "What services does Ascent Group Construction provide?",
    "Ascent Group Construction is a specialty contractor for building envelope and restoration across Ontario. We deliver complete cladding systems (metal panels, EIFS, stucco), building envelope solutions, masonry restoration, protective coatings, interior construction, painting services, tile & flooring, and sustainable building solutions including LEED consulting. With self-performed core trades and 15+ years of experience, we serve developers, property managers, and building owners across Toronto and the GTA."
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
      { "@type": "City", "name": "Markham" }
    ],
    "priceRange": "$25000-$150000",
    "serviceType": "Building Envelope & Restoration Contractor",
    "knowsAbout": [
      "building envelope systems",
      "cladding systems",
      "metal panels",
      "EIFS and stucco",
      "masonry restoration",
      "protective coatings",
      "interior construction",
      "painting services",
      "tile and flooring",
      "sustainable building",
      "LEED consulting",
      "commercial construction",
      "multi-family construction"
    ]
  };

  // Why Choose Us Structured Data
  const whyChooseUsSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "Why Choose Ascent Group Construction",
    "description": "Key reasons to choose Ascent Group Construction for your Toronto and GTA construction projects",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Licensed Construction Excellence Across Ontario",
        "description": "Fully licensed and insured with $2M CGL liability coverage, active WSIB registration, working toward COR certification."
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Comprehensive Construction Services Under One Roof",
        "description": "Complete construction services including masonry repair, EIFS installation, metal cladding, and parking garage restoration."
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": "Premium Materials & Manufacturer Warranties",
        "description": "Benjamin Moore and Sherwin-Williams authorized contractor using premium materials backed by extended warranties."
      }
    ]
  };

  const siteSearchSchema = createSiteSearchSchema("https://ascentgroupconstruction.com");

  // Video schemas for rich snippets in search results
  const homepageVideos = getHomepageVideos();
  const videoSchemas = homepageVideos.map(video => videoSchema({
    name: video.name,
    description: video.description,
    thumbnailUrl: `${window.location.origin}${video.thumbnailUrl}`,
    uploadDate: video.uploadDate,
    contentUrl: `${window.location.origin}${video.contentUrl}`,
    duration: video.duration
  }));

  return (
    <>
      <div className="min-h-screen relative">
        <SkipLink />
        
        <SEO
          title="Building Envelope & Restoration Specialists | Specialty Contractor Ontario & GTA"
          description="Specialty contractor in Ontario & GTA delivering façade remediation, waterproofing, EIFS, masonry, restoration. 15+ years crew experience, 85% self-performed. WSIB compliant, $2M CGL."
          keywords="specialty contractor Ontario, building envelope contractor GTA, facade remediation Toronto, waterproofing contractor, EIFS contractor, masonry restoration, parking garage repair"
          structuredData={[specialtyContractorSchema, howToChooseContractor, whatDoesAscentDo, whyChooseUsSchema, siteSearchSchema, ...videoSchemas]} 
          includeRating={true} 
        />
        <Navigation />
        
        <main id="main-content" role="main">
          {/* Hero Section */}
          <EnhancedHero />
          
          {/* Trust Indicators - 3 key badges */}
          <TrustBadgeBar />
          
          {/* Who We Serve - Commercial & Residential Split */}
          <WhoWeServeHomepage />

          {/* Admin-managed differentiators with safe fallback */}
          <WhyChooseUs />

          {/* Admin-managed company overview with safe fallback */}
          <CompanyOverviewHub />
          
          {/* Featured Services - No wrapper animation, content animates itself */}
          <div className="py-16">
            <ServicesExplorer />
          </div>
          
          {/* CTA Section */}
          <PrequalPackage />
        </main>
        
        <Footer />
        <ScrollToTop />
      </div>
    </>
  );
};

export default Index;