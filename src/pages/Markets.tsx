import { usePageContent } from "@/hooks/usePageContent";
import contentModule from "@/content/pages/markets";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { PageHero } from "@/components/shared/PageHero";
import SEO from "@/components/SEO";
import { SITE_URL } from "@/constants/company";
import {
  SectionHeader,
  SegmentCard,
  TrustRibbon,
  FAQAccordion,
  StickyPageNav,
} from "@/design-system/components";
import { StartProjectCTA } from "@/components/shared/StartProjectCTA";
import {
  Building2,
  Briefcase,
  Home,
  HardHat,
  Building,
  Layers,
  Target,
  Users,
  Store,
  Hotel,
  Stethoscope,
  GraduationCap,
  Factory,
  Hammer,
  Building as BuildingIcon,
  Boxes,
} from "lucide-react";
import { sectorHeroes } from "@/data/hero-images";
import { Section } from "@/components/sections/Section";
import { useSharedFaqs } from "@/hooks/useSharedContent";
import { generateBreadcrumbSchema } from "@/utils/seo";

const sectorTable = [
  {
    sector: "Property Managers",
    scope: "$25K – $300K recurring",
    decisionMaker: "Building Manager / Owner",
    sla: "Site visit in 48–72 hrs",
    typical: "Sealants, masonry, balconies",
  },
  {
    sector: "General Contractors",
    scope: "$50K – $500K trade pkg",
    decisionMaker: "Project Manager / Estimator",
    sla: "RFP turnaround 2–5 days",
    typical: "EIFS, façade, interior trades",
  },
  {
    sector: "Commercial Owners",
    scope: "$25K – $400K",
    decisionMaker: "Asset Manager",
    sla: "Proposal within 1 week",
    typical: "Façade upgrades, coatings",
  },
  {
    sector: "Developers",
    scope: "$100K – $500K+",
    decisionMaker: "Construction Lead",
    sla: "Pre-bid input on request",
    typical: "Envelope + interior finishing",
  },
  {
    sector: "Homeowners",
    scope: "$5K – $75K",
    decisionMaker: "Owner",
    sla: "On-site quote in 1 week",
    typical: "Painting, tile, interior renos",
  },
];

const Markets = () => {
  const marketsFaqs = useSharedFaqs("marketsFaqs");
  const c = usePageContent(contentModule);
  const segments = [
    {
      icon: Building2,
      title: c.f034,
      description: c.f035,
      href: "/property-managers",
      badge: "Primary",
    },
    {
      icon: HardHat,
      title: c.f036,
      description: c.f037,
      href: "/for-general-contractors",
      badge: "Trade Partner",
    },
    {
      icon: Briefcase,
      title: c.f038,
      description: c.f039,
      href: "/commercial-clients",
    },
    {
      icon: Home,
      title: c.f040,
      description: c.f041,
      href: "/homeowners",
    },
    {
      icon: Building,
      title: c.f042,
      description: c.f043,
      href: "/company/developers",
    },
  ];
  const subSectors = [
    { icon: BuildingIcon, label: c.f044 },
    { icon: Store, label: c.f045 },
    { icon: Hotel, label: c.f046 },
    { icon: Stethoscope, label: c.f047 },
    { icon: GraduationCap, label: c.f048 },
    { icon: Factory, label: c.f049 },
    { icon: Boxes, label: c.f050 },
    { icon: Hammer, label: c.f051 },
  ];

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: c.f001, url: "/" },
    { name: c.f002, url: "/markets" },
  ]);

  // ItemList schema for the segment cards
  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: c.f003,
    itemListElement: segments.map((s, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: s.title,
      description: s.description,
      url: `${SITE_URL}${s.href}`,
    })),
  };

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title={c.f004}
        description={c.f005}
        canonical={`${SITE_URL}/markets`}
        structuredData={[breadcrumbSchema, itemListSchema]}
      />
      <Navigation />

      <PageHero
        title={c.f006}
        eyebrow={c.f007}
        description={c.f008}
        image={sectorHeroes["markets-overview"]}
        imageAlt={c.f009}
        breadcrumbs={[{ label: c.f010, href: "/" }, { label: c.f011 }]}
        badges={[
          { icon: Layers, text: c.f012 },
          { icon: Target, text: c.f013 },
          { icon: Users, text: c.f014 },
        ]}
        primaryCta={{ text: c.f015, href: "/submit-rfp" }}
        secondaryCta={{ text: c.f016, href: "/contact" }}
      />

      <TrustRibbon />

      <StickyPageNav
        sections={[
          { id: "who-we-work-with", label: c.f017 },
          { id: "sector-glance", label: c.f018 },
          { id: "sub-sectors", label: c.f019 },
          { id: "markets-faq", label: c.f020 },
        ]}
      />

      <section id="who-we-work-with" className="py-16 md:py-24 scroll-mt-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            title={c.f021}
            description={c.f022}
            badge="Our Markets"
            maxWidth="lg"
          />

          {/* Asymmetric layout: first 2 (primary) larger, remainder 3-up */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {segments.slice(0, 2).map((segment) => (
              <SegmentCard
                key={segment.title}
                icon={segment.icon}
                title={segment.title}
                description={segment.description}
                href={segment.href}
                badge={segment.badge}
              />
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {segments.slice(2).map((segment) => (
              <SegmentCard
                key={segment.title}
                icon={segment.icon}
                title={segment.title}
                description={segment.description}
                href={segment.href}
                badge={segment.badge}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Sector at a glance table */}
      <div id="sector-glance" className="scroll-mt-24">
        <Section size="major" className="bg-muted/30">
          <SectionHeader
            title={c.f023}
            description={c.f024}
            badge="Quick Reference"
            maxWidth="lg"
          />
          <div tabIndex={0} role="region" aria-label="Markets comparison" className="max-w-6xl mx-auto overflow-x-auto -mx-4 sm:mx-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-left bg-background border-b border-border">
                  <th className="py-3 px-4 font-semibold">{c.f025}</th>
                  <th className="py-3 px-4 font-semibold">{c.f026}</th>
                  <th className="py-3 px-4 font-semibold">{c.f027}</th>
                  <th className="py-3 px-4 font-semibold">{c.f028}</th>
                  <th className="py-3 px-4 font-semibold">{c.f029}</th>
                </tr>
              </thead>
              <tbody className="bg-background">
                {sectorTable.map((row) => (
                  <tr
                    key={row.sector}
                    className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors"
                  >
                    <td className="py-3 px-4 font-medium text-foreground">
                      {row.sector}
                    </td>
                    <td className="py-3 px-4 text-muted-foreground">
                      {row.scope}
                    </td>
                    <td className="py-3 px-4 text-muted-foreground">
                      {row.decisionMaker}
                    </td>
                    <td className="py-3 px-4 text-muted-foreground">
                      {row.sla}
                    </td>
                    <td className="py-3 px-4 text-muted-foreground">
                      {row.typical}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>
      </div>

      {/* Sub-sectors strip */}
      <div id="sub-sectors" className="scroll-mt-24">
        <Section size="major">
          <SectionHeader
            title={c.f030}
            description={c.f031}
            badge="Building Types"
            maxWidth="md"
          />
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 max-w-5xl mx-auto">
            {subSectors.map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="flex items-center gap-3 bg-background rounded-xl border border-border px-4 py-3 hover:border-primary/40 hover:shadow-sm transition-all"
              >
                <Icon className="w-5 h-5 text-primary flex-shrink-0" />
                <span className="text-sm font-medium">{label}</span>
              </div>
            ))}
          </div>
        </Section>
      </div>

      {/* People Also Ask */}
      <div id="markets-faq" className="scroll-mt-24">
        <Section size="major" className="bg-muted/30">
          <SectionHeader
            title={c.f032}
            description={c.f033}
            badge="FAQ"
            maxWidth="md"
          />
          <div className="max-w-3xl mx-auto">
            <FAQAccordion faqs={marketsFaqs} />
          </div>
        </Section>
      </div>

      <StartProjectCTA />

      <Footer />
    </div>
  );
};

export default Markets;
