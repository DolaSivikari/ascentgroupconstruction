import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import PageHero from "@/components/shared/PageHero";
import SEO from "@/components/SEO";
import { SectionHeader, SegmentCard, CTABand } from "@/design-system/components";
import { Building2, Briefcase, Home, HardHat, Building } from "lucide-react";
import { companyHeroes } from "@/data/hero-images";

const segments = [
  {
    icon: Building2,
    title: "Property Managers",
    description: "Building envelope maintenance, restoration programs, and capital improvement planning for multi-unit residential and commercial properties.",
    href: "/property-managers",
    badge: "Primary",
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
  {
    icon: HardHat,
    title: "General Contractors",
    description: "Reliable specialty trade partner for building envelope, interior finishing, and restoration scopes on commercial and institutional projects.",
    href: "/for-general-contractors",
    badge: "Trade Partner",
  },
];

const Markets = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Markets We Serve | Ascent Group Construction"
        description="Ascent Group Construction serves property managers, commercial clients, homeowners, developers, and general contractors across Ontario and the GTA."
        canonical="https://ascentgroupconstruction.com/markets"
      />
      <Navigation />

      <PageHero
        title="Markets We Serve"
        subtitle="Specialty construction services tailored to your sector"
        image={companyHeroes?.about}
      />

      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            title="Who We Work With"
            description="From property managers maintaining building envelopes to general contractors needing a reliable trade partner, we deliver focused expertise to every client segment."
            badge="Our Markets"
            maxWidth="lg"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {segments.map((segment) => (
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
