import { useEffect, useState } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import EnhancedHero from "@/components/homepage/EnhancedHero";
import CompanyIntroduction from "@/components/homepage/CompanyIntroduction";
import { ServicesExplorer } from "@/components/services/ServicesExplorer";
import SEO from "@/components/SEO";
import CompanyOverviewHub from "@/components/homepage/CompanyOverviewHub";
import ClientValueProposition from "@/components/homepage/ClientValueProposition";
import CertificationsBar from "@/components/homepage/CertificationsBar";
import PrequalPackage from "@/components/homepage/PrequalPackage";
import SkipLink from "@/components/SkipLink";
import ContentHub from "@/components/homepage/ContentHub";
import { createHowToSchema, createQASchema, createSiteSearchSchema } from "@/utils/schema-injector";
import InsightsFeed from "@/components/insights/InsightsFeed";
import ValuePillars from "@/components/homepage/ValuePillars";
import SplashScreen from "@/components/SplashScreen";
import { TrustBadgeBar } from "@/components/homepage/TrustBadgeBar";

import { personalization } from "@/utils/personalization";
import { initializeTests } from "@/utils/ab-testing";
import { CTA_TEXT } from "@/design-system/constants";
import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { ScrollToTop } from "@/components/ui/scroll-to-top";
import { ParallaxSection } from "@/components/animations/ParallaxSection";
import { StaggerContainer } from "@/components/animations/StaggerContainer";
import { usePageAnalytics } from "@/hooks/usePageAnalytics";

const Index = () => {
  const [showSplash, setShowSplash] = useState(true);
  const [splashComplete, setSplashComplete] = useState(false);

  // Analytics tracking
  usePageAnalytics('homepage');

  // Initialize personalization and A/B testing
  useEffect(() => {
    personalization.initialize();
    initializeTests();
  }, []);
  // Remove loading classes when hero is ready
  useEffect(() => {
    const handleHeroReady = () => {
      // Small delay to ensure smooth transition
      setTimeout(() => {
        document.documentElement.classList.remove('loading');
        document.documentElement.classList.remove('page-loading');
      }, 100);
    };

    window.addEventListener('hero-ready', handleHeroReady);
    
    return () => {
      window.removeEventListener('hero-ready', handleHeroReady);
    };
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
    "email": "mailto:hebun.isik.ca@gmail.com",
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
    ],
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "reviewCount": "150"
    }
  };

  // Why Choose Us Structured Data
  const whyChooseUsSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "Why Choose Ascent Group Construction",
    "description": "Six key reasons to choose Ascent Group Construction for your Toronto and GTA construction projects",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Licensed Construction Excellence Across Ontario",
        "description": "Fully licensed and insured with $5M liability coverage, WSIB compliant, and municipally licensed across the Greater Toronto Area with 500+ successful projects."
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Comprehensive Construction Services Under One Roof",
        "description": "Comprehensive construction services including commercial construction, masonry repair, EIFS installation, metal cladding, and parking garage restoration throughout Toronto and the GTA."
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": "Premium Materials & Manufacturer Warranties",
        "description": "Benjamin Moore and Sherwin-Williams authorized contractor using premium materials backed by extended manufacturer warranties."
      },
      {
        "@type": "ListItem",
        "position": 4,
        "name": "On-Time, On-Budget Project Delivery",
        "description": "95% on-time completion rate with transparent pricing, itemized estimates, and dedicated project management across Ontario."
      },
      {
        "@type": "ListItem",
        "position": 5,
        "name": "Safety-First Approach to Every Project",
        "description": "OSHA certified crews with zero-incident safety record, comprehensive protocols, and full liability coverage."
      },
      {
        "@type": "ListItem",
        "position": 6,
        "name": "24/7 Emergency Response Services",
        "description": "Same-day emergency assessment and response throughout Greater Toronto Area with dedicated rapid response team."
      }
    ]
  };

  const siteSearchSchema = createSiteSearchSchema("https://ascentgroupconstruction.com");

  return (
    <>
      {showSplash && (
        <SplashScreen
          onComplete={() => {
            setShowSplash(false);
            setSplashComplete(true);
          }}
        />
      )}
      <div className="min-h-screen relative">
        <SkipLink />
        
        <SEO
        title="Specialty Contractor Ontario | Building Envelope, Cladding Systems & Interior Construction"
        description="Specialty contractor for building envelope, complete cladding systems, masonry restoration, interior construction, and sustainable building. Self-performed quality with 15+ years expertise serving Toronto, GTA, and Ontario."
        keywords="specialty contractor Ontario, building envelope contractor, cladding systems, metal panels, EIFS contractor, masonry restoration, interior construction, sustainable building, LEED consulting, Toronto contractor"
        structuredData={[specialtyContractorSchema, howToChooseContractor, whatDoesAscentDo, whyChooseUsSchema, siteSearchSchema]} 
        includeRating={true} 
        />
        <Navigation />
      <main id="main-content" role="main">
        <ParallaxSection speed="slow">
          <EnhancedHero splashComplete={splashComplete} />
        </ParallaxSection>
        
        <ScrollReveal direction="up" delay={0}>
          <TrustBadgeBar />
        </ScrollReveal>

        <ScrollReveal direction="left" delay={100}>
          <ValuePillars />
        </ScrollReveal>

        <ScrollReveal direction="up" delay={0}>
          <CompanyIntroduction />
        </ScrollReveal>
        
        <ScrollReveal direction="right" delay={100}>
          <ClientValueProposition />
        </ScrollReveal>
        
        <ParallaxSection speed="medium">
          <ScrollReveal direction="up" delay={0}>
            <div className="py-24">
              <ServicesExplorer />
            </div>
          </ScrollReveal>
        </ParallaxSection>
        
        <ScrollReveal direction="left" delay={100}>
          <PrequalPackage />
        </ScrollReveal>
      </main>
        <Footer />
        <ScrollToTop />
      </div>
    </>
  );
};

export default Index;
