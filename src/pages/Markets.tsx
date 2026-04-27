import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { PageHero } from "@/components/shared/PageHero";
import SEO from "@/components/SEO";
import { SITE_URL } from "@/constants/company";
import { SectionHeader, SegmentCard, CTABand, TrustRibbon, FAQAccordion, StickyPageNav } from "@/design-system/components";
import {
  Building2, Briefcase, Home, HardHat, Building, Layers, Target, Users,
  Store, Hotel, Stethoscope, GraduationCap, Factory, Hammer, Building as BuildingIcon, Boxes,
} from "lucide-react";
import { sectorHeroes } from "@/data/hero-images";
import { Section } from "@/components/sections/Section";
import { marketsFaqs } from "@/data/page-faqs";
import { generateBreadcrumbSchema } from "@/utils/seo";

const segments = [
  {
    icon: Building2,
    title: "Property Managers",
    description: "Building envelope maintenance, restoration programs, and capital improvement planning for multi-unit residential and commercial properties.",
    href: "/property-managers",
    badge: "Primary",
  },
  {
    icon: HardHat,
    title: "General Contractors",
    description: "Reliable specialty trade partner for building envelope, interior finishing, and restoration scopes on commercial and institutional projects.",
    href: "/for-general-contractors",
    badge: "Trade Partner",
  },
  {
    icon: Briefcase,
    title: "Commercial Clients",
    description: "Exterior upgrades, tenant improvements, and façade systems for office, retail, and mixed-use commercial properties across the GTA.",
    href: "/commercial-clients",
  },
  {
    icon: Home,
    title: "Homeowners",
    description: "Interior renovations, painting, tile and flooring, and exterior finishing for residential properties.",
    href: "/homeowners",
  },
  {
    icon: Building,
    title: "Developers",
    description: "New construction finishing packages, multi-unit coordination, and phased completion schedules for residential and commercial developments.",
    href: "/company/developers",
  },
];

const subSectors = [
  { icon: BuildingIcon, label: "Office" },
  { icon: Store, label: "Retail" },
  { icon: Hotel, label: "Hospitality" },
  { icon: Stethoscope, label: "Healthcare" },
  { icon: GraduationCap, label: "Education" },
  { icon: Factory, label: "Industrial" },
  { icon: Boxes, label: "Multi-Residential" },
  { icon: Hammer, label: "Mixed-Use" },
];

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
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Markets", url: "/markets" },
  ]);

  // ItemList schema for the segment cards
  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Markets Served by Ascent Group Construction",
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
        title="Markets We Serve | Ascent Group Construction"
        description="Ascent Group Construction serves property managers, commercial clients, homeowners, developers, and general contractors across Ontario and the GTA."
        canonical={`${SITE_URL}/markets`}
        structuredData={[breadcrumbSchema, itemListSchema]}
      />
      <Navigation />

      <PageHero
        title="Markets We Serve"
        eyebrow="Our Markets"
        description="Specialty construction services tailored to your sector — from property managers maintaining building envelopes to general contractors needing a reliable trade partner."
        image={sectorHeroes["markets-overview"]}
        imageAlt="Markets served by Ascent Group Construction"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Markets" },
        ]}
        badges={[
          { icon: Layers, text: "Multi-Sector Experience" },
          { icon: Target, text: "Tailored Solutions" },
          { icon: Users, text: "Trade Partnerships" },
        ]}
        primaryCta={{ text: "Submit RFP", href: "/submit-rfp" }}
        secondaryCta={{ text: "Contact Us", href: "/contact" }}
      />

      <TrustRibbon />

      <StickyPageNav
        sections={[
          { id: "who-we-work-with", label: "Who We Work With" },
          { id: "sector-glance", label: "Sector at a Glance" },
          { id: "sub-sectors", label: "Sub-Sectors" },
          { id: "markets-faq", label: "FAQ" },
        ]}
      />

      <section id="who-we-work-with" className="py-16 md:py-24 scroll-mt-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            title="Who We Work With"
            description="From property managers maintaining building envelopes to general contractors needing a reliable trade partner, we deliver focused expertise to every client segment."
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
          title="Sector at a Glance"
          description="Typical project size, decision-maker, and response cadence by client segment — so you know exactly how we engage."
          badge="Quick Reference"
          maxWidth="lg"
        />
        <div className="max-w-6xl mx-auto overflow-x-auto -mx-4 sm:mx-0">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left bg-background border-b border-border">
                <th className="py-3 px-4 font-semibold">Sector</th>
                <th className="py-3 px-4 font-semibold">Typical Scope</th>
                <th className="py-3 px-4 font-semibold">Decision-Maker</th>
                <th className="py-3 px-4 font-semibold">Response SLA</th>
                <th className="py-3 px-4 font-semibold">Common Services</th>
              </tr>
            </thead>
            <tbody className="bg-background">
              {sectorTable.map((row) => (
                <tr
                  key={row.sector}
                  className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors"
                >
                  <td className="py-3 px-4 font-medium text-foreground">{row.sector}</td>
                  <td className="py-3 px-4 text-muted-foreground">{row.scope}</td>
                  <td className="py-3 px-4 text-muted-foreground">{row.decisionMaker}</td>
                  <td className="py-3 px-4 text-muted-foreground">{row.sla}</td>
                  <td className="py-3 px-4 text-muted-foreground">{row.typical}</td>
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
          title="Sub-Sectors We Serve"
          description="Across the five client segments above, we have direct experience in these property types."
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
          title="People Also Ask"
          description="Quick answers to the most common questions about who we work with."
          badge="FAQ"
          maxWidth="md"
        />
        <div className="max-w-3xl mx-auto">
          <FAQAccordion faqs={marketsFaqs} />
        </div>
      </Section>
      </div>

      <CTABand
        title="Ready to Discuss Your Project?"
        description="Whether you're a property manager planning capital work or a GC looking for a trade partner, we're ready to talk scope."
        primaryCta={{ text: "Submit RFP", href: "/submit-rfp" }}
        secondaryCta={{ text: "Contact Us", href: "/contact" }}
        variant="dark"
      />

      <Footer />
    </div>
  );
};

export default Markets;
