import { Building2, Users, Home, Briefcase, Award, CheckCircle2 } from "lucide-react";
import { Section } from "@/components/sections/Section";
import { SectionBadge } from "@/components/ui/SectionBadge";
import { SegmentCard } from "@/design-system/components/SegmentCard";
import { Card } from "@/design-system/components/Card";
import { Button } from "@/ui/Button";
import { Link } from "react-router-dom";
import { GRID } from "@/design-system/layouts";
import { useScrollFadeIn } from "@/hooks/useScrollFadeIn";
import { useStaggerAnimation } from "@/hooks/useStaggerAnimation";
import { useReducedMotion } from "@/hooks/useReducedMotion";

const benefits = [
  { title: "Prime accountability for project scopes", desc: "One team, one contract, one responsible point of contact." },
  { title: "Self‑performed core trades", desc: "Sealants/caulking, EIFS & stucco, masonry repairs, waterproofing & protective coatings, concrete and parking‑garage rehabilitation, commercial painting, interior buildouts." },
  { title: "Consultant/EOR‑aligned execution", desc: "We build to drawings and specs, submit materials, and document compliance." },
  { title: "Documented QA/QC", desc: "Photo logs, inspection records (ITPs when requested), clear punch‑list closeout." },
  { title: "Occupied‑building expertise", desc: "Safe access, phasing, tenant coordination, off‑hours where needed." },
  { title: "Responsive by design", desc: "48–72‑hour site walks, fast submittals, and unit pricing for GC trade packages." },
  { title: "Local coverage", desc: "Toronto, Mississauga, Brampton, Vaughan/Markham, Oakville/Burlington, Hamilton." },
];

const clientSegments = [
  {
    icon: Briefcase,
    title: "General Contractors",
    description: "Trade partner for envelope and restoration scopes on commercial and multi-family projects across the GTA.",
    link: "/for-general-contractors",
    examples: [
      "Unit pricing for envelope packages",
      "Fast RFP response (48-72 hours)",
      "Self-performed core trades",
    ],
  },
  {
    icon: Building2,
    title: "Property Managers",
    description: "Reliable envelope maintenance and emergency restoration for multi-residential and commercial portfolios.",
    link: "/property-managers",
    examples: [
      "10-30 story condominiums",
      "Occupied building expertise",
      "Clear documentation for reserve fund studies",
    ],
  },
  {
    icon: Users,
    title: "Commercial Owners",
    description: "Façade remediation and building envelope solutions for office buildings, retail strips, and industrial properties.",
    link: "/commercial-clients",
    examples: [
      "Water intrusion repairs",
      "Parking garage restoration",
      "Tenant coordination",
    ],
  },
  {
    icon: Home,
    title: "Homeowners",
    description: "Exterior restoration and interior renovation services for single-family homes across Ontario.",
    link: "/homeowners",
    examples: [
      "EIFS and stucco repair",
      "Masonry restoration",
      "Interior painting and finishes",
    ],
  },
];

const WhoWeServeHomepage = () => {
  const prefersReducedMotion = useReducedMotion();
  const { ref: headerRef, isVisible: headerVisible, skipAnimation: headerSkip } =
    useScrollFadeIn();
  const { ref: gridRef, isVisible: gridVisible, skipAnimation: gridSkip } =
    useScrollFadeIn({ threshold: 0.1 });
  const delays = useStaggerAnimation({ itemCount: 4, staggerDelay: 100 });

  const showHeader = headerVisible || headerSkip || prefersReducedMotion;
  const showGrid = gridVisible || gridSkip || prefersReducedMotion;

  const fadeStyle = (visible: boolean) => ({
    opacity: visible ? 1 : 0,
    transform: visible ? "translateY(0)" : "translateY(24px)",
    transition: prefersReducedMotion
      ? "none"
      : "opacity 300ms ease-out, transform 300ms ease-out",
  });

  return (
    <Section size="major" className="!bg-transparent !pt-16 md:!pt-20 !pb-8 md:!pb-12">
      <div className="relative z-10">
        {/* Why Choose Us */}
        <div ref={headerRef} className="max-w-4xl mb-12" style={fadeStyle(showHeader)}>
          <SectionBadge icon={Award} text="Why Choose Us" />
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-6 leading-tight tracking-tight">
            Why Clients Choose Us
          </h2>
          <p className="text-xl md:text-2xl text-foreground font-semibold mb-6">
            Building performance is non‑negotiable—and <span className="text-primary">accountability</span> is everything.
          </p>

          <div className="space-y-4 mb-8">
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
              Developers, general contractors, property managers, and asset owners choose <span className="text-foreground font-semibold">Ascent Group Construction</span> for specialized envelope, restoration, and <span className="text-foreground font-semibold">interior trade delivery</span> across Toronto (GTA) and the Golden Horseshoe. We act as the <span className="text-foreground font-semibold">lead contractor</span>—coordinating access and safety, <span className="text-foreground font-semibold">self‑performing key trades</span>, and communicating clearly from <span className="text-foreground font-semibold">site walk to closeout</span>.
            </p>
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
              We follow consultant/engineer‑of‑record (EOR) details, document work with <span className="text-foreground font-semibold">photo logs/ITPs</span>, and provide <span className="text-foreground font-semibold">applicable manufacturer and workmanship warranties</span>.
            </p>
          </div>

          {/* Benefit bullets */}
          <div className="grid md:grid-cols-2 gap-4 mb-8">
            {benefits.map((b, i) => (
              <Card key={i} variant="outline" size="sm" hover className="h-full">
                <div className="flex gap-3">
                  <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-foreground text-base mb-1">{b.title}</h3>
                    <p className="text-base text-muted-foreground leading-relaxed">{b.desc}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row flex-wrap gap-4">
            <Button asChild size="lg" className="bg-primary hover:bg-primary/90">
              <Link to="/contact">Request Site Assessment</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link to="/services">View Services</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link to="/contact">For GCs: Request Unit Pricing</Link>
            </Button>
          </div>
        </div>

        {/* Divider + Who We Serve cards */}
        <div className="mt-16 pt-12 border-t border-border/50">
          <div className="max-w-3xl mb-8">
            <h3 className="text-2xl md:text-3xl font-semibold text-foreground mb-4 leading-tight">
              Who We Serve
            </h3>
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
              From general contractors seeking reliable trade partners to property managers protecting their portfolios—we deliver specialized envelope, restoration, and interior trade solutions across Ontario and the GTA.
            </p>
          </div>

          <div ref={gridRef} className={GRID.cards4}>
            {clientSegments.map((segment, index) => (
              <div
                key={index}
                style={{
                  ...fadeStyle(showGrid),
                  transitionDelay: showGrid ? `${delays[index] ?? 0}ms` : "0ms",
                }}
              >
                <SegmentCard
                  icon={segment.icon}
                  title={segment.title}
                  description={segment.description}
                  href={segment.link}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
};

export default WhoWeServeHomepage;
