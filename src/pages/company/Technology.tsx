import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { SITE_URL } from "@/constants/company";
import SEO from "@/components/SEO";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { CTABand } from "@/design-system/components/CTABand";
import { PageHero } from "@/components/shared/PageHero";
import { companyHeroes } from "@/data/hero-images";
import { ScrollytellingSection } from "./technology/sections/ScrollytellingSection";
import { ConstellationSection } from "./technology/sections/ConstellationSection";
import { BeforeAfterSlider } from "./technology/sections/BeforeAfterSlider";
import { AudienceTabs } from "./technology/sections/AudienceTabs";
import { TimelineSection } from "./technology/sections/TimelineSection";
import { CrossLinks } from "./technology/sections/CrossLinks";
import { TrustRibbon } from "@/design-system/components/TrustRibbon";
import { FAQAccordion } from "@/design-system/components/FAQAccordion";
import { technologyFaqs } from "@/data/page-faqs";

const TOOL_STRIP = ["Bluebeam", "PlanSwift", "ZZTAKEOFF", "Procore", "AutoCAD / DWG", "BIM 360"];

const Technology = () => {
  const rm = useReducedMotion();

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
      { "@type": "ListItem", position: 2, name: "Company", item: `${SITE_URL}/about` },
      { "@type": "ListItem", position: 3, name: "Technology & Digital Tools" },
    ],
  };

  return (
    <>
      <SEO
        title="Technology & Digital Tools"
        description="Ascent Group Construction uses Bluebeam, Procore, BIM 360, and digital documentation workflows to deliver coordinated, accountable specialty trade projects across the GTA."
        keywords="construction technology, Bluebeam, Procore, BIM coordination, digital closeout, specialty contractor documentation, GTA construction"
        structuredData={[breadcrumbSchema]}
      />
      <Navigation />

      <main>
        <PageHero
          eyebrow="Technology & Documentation"
          title="Built on Digital Precision"
          description="From the first site assessment to the final closeout package — every step of our process is documented, coordinated, and accountable. No verbal-only updates, no retroactive records."
          image={companyHeroes["our-process"]}
          imageAlt="Ascent Group digital construction technology"
          height="medium"
          overlay="gradient"
          stats={[
            { value: "100%", label: "Projects Site-Assessed" },
            { value: "Daily", label: "Field Reports" },
            { value: "100%", label: "Digital Closeout" },
          ]}
          breadcrumbs={[
            { label: "Home", href: "/" },
            { label: "Company", href: "/about" },
            { label: "Technology & Digital Tools" },
          ]}
          primaryCta={{ text: "Request a Site Assessment", href: "/contact" }}
          secondaryCta={{ text: "Our Delivery Process", href: "/our-process" }}
        />

        <section className="bg-[hsl(var(--ink))] py-6 border-b border-white/5">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-3 text-sm">
              <span className="text-white/40 uppercase tracking-wider text-xs font-medium">Tools we use</span>
              {TOOL_STRIP.map((tool) => (
                <span key={tool} className="text-white/70 font-medium hover:text-white transition-colors">
                  {tool}
                </span>
              ))}
            </div>
          </div>
        </section>

        <ScrollytellingSection rm={rm} />
        <ConstellationSection rm={rm} />
        <BeforeAfterSlider rm={rm} />
        <AudienceTabs rm={rm} />
        <TimelineSection rm={rm} />

        <CTABand
          title="The Ascent Standard"
          description="We assess before we estimate. We document before we mobilize. We report every day we're on site. We close out with a full digital package."
          primaryCta={{ text: "Start A Conversation", href: "/contact" }}
          secondaryCta={{ text: "Get Prequalified", href: "/prequalification" }}
          variant="dark"
        />

        <CrossLinks />
      </main>

      <Footer />
    </>
  );
};

export default Technology;
