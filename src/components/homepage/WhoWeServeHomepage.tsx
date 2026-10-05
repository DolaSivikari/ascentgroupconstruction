import { usePageContent } from "@/hooks/usePageContent";
import contentModule from "@/content/pages/home-audiences";
import { TYPOGRAPHY_STYLES } from "@/design-system/constants";
import {
  Building2,
  Users,
  Home,
  Briefcase,
  Award,
  CheckCircle2,
} from "lucide-react";
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

const WhoWeServeHomepage = () => {
  const c = usePageContent(contentModule);
  const benefits = [
    {
      title: c.f025,
      desc: "One team, one contract, one responsible point of contact.",
    },
    {
      title: c.f026,
      desc: "Sealants/caulking, EIFS & stucco, masonry repairs, waterproofing & protective coatings, concrete and parking‑garage rehabilitation, commercial painting, interior buildouts.",
    },
    {
      title: c.f027,
      desc: "We build to drawings and specs, submit materials, and document compliance.",
    },
    {
      title: c.f028,
      desc: "Photo logs, inspection records (ITPs when requested), clear punch‑list closeout.",
    },
    {
      title: c.f029,
      desc: "Safe access, phasing, tenant coordination, off‑hours where needed.",
    },
    {
      title: c.f030,
      desc: "48–72‑hour site walks, fast submittals, and unit pricing for GC trade packages.",
    },
    {
      title: c.f031,
      desc: "Toronto, Mississauga, Brampton, Vaughan/Markham, Oakville/Burlington, Hamilton.",
    },
  ];
  const clientSegments = [
    {
      icon: Briefcase,
      title: c.f032,
      description: c.f033,
      link: "/for-general-contractors",
      examples: [c.f034, c.f035, c.f036],
    },
    {
      icon: Building2,
      title: c.f037,
      description: c.f038,
      link: "/property-managers",
      examples: [c.f039, c.f040, c.f041],
    },
    {
      icon: Users,
      title: c.f042,
      description: c.f043,
      link: "/commercial-clients",
      examples: [c.f044, c.f045, c.f046],
    },
    {
      icon: Home,
      title: c.f047,
      description: c.f048,
      link: "/homeowners",
      examples: [c.f049, c.f050, c.f051],
    },
  ];

  const prefersReducedMotion = useReducedMotion();
  const {
    ref: headerRef,
    isVisible: headerVisible,
    skipAnimation: headerSkip,
  } = useScrollFadeIn();
  const {
    ref: gridRef,
    isVisible: gridVisible,
    skipAnimation: gridSkip,
  } = useScrollFadeIn({ threshold: 0.1 });
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
    <Section
      size="major"
      className="!bg-transparent !pt-16 md:!pt-20 !pb-8 md:!pb-12"
    >
      <div className="relative z-10">
        {/* Why Choose Us */}
        <div
          ref={headerRef}
          className="max-w-4xl mb-12"
          style={fadeStyle(showHeader)}
        >
          <SectionBadge icon={Award} text={c.f001} />
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-6 leading-tight tracking-tight">
            {c.f002}
          </h2>
          <p className="text-xl md:text-2xl text-foreground font-semibold mb-6">
            {c.f003}
            <span className="text-primary">{c.f004}</span> {c.f005}
          </p>

          <div className="space-y-4 mb-8">
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
              {c.f006}
              <span className="text-foreground font-semibold">
                {c.f007}
              </span>{" "}
              {c.f008}
              <span className="text-foreground font-semibold">
                {c.f009}
              </span>{" "}
              {c.f010}
              <span className="text-foreground font-semibold">{c.f011}</span>
              {c.f012}
              <span className="text-foreground font-semibold">{c.f013}</span>
              {c.f014}
              <span className="text-foreground font-semibold">{c.f015}</span>.
            </p>
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
              {c.f016}
              <span className="text-foreground font-semibold">{c.f017}</span>
              {c.f018}
              <span className="text-foreground font-semibold">{c.f019}</span>.
            </p>
          </div>

          {/* Benefit bullets */}
          <div className="grid md:grid-cols-2 gap-4 mb-8">
            {benefits.map((b, i) => (
              <Card
                key={i}
                variant="outline"
                size="sm"
                hover
                className="h-full"
              >
                <div className="flex gap-3">
                  <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <h3
                      className={`${TYPOGRAPHY_STYLES.cardTitle} text-foreground mb-1`}
                    >
                      {b.title}
                    </h3>
                    <p className="text-base text-muted-foreground leading-relaxed">
                      {b.desc}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row flex-wrap gap-4">
            <Button
              asChild
              size="lg"
              className="bg-primary hover:bg-primary/90"
            >
              <Link to="/contact">{c.f020}</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link to="/services">{c.f021}</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link to="/contact">{c.f022}</Link>
            </Button>
          </div>
        </div>

        {/* Divider + Who We Serve cards */}
        <div className="mt-16 pt-12 border-t border-border/50">
          <div className="max-w-3xl mb-8">
            <h3 className="text-2xl md:text-3xl font-semibold text-foreground mb-4 leading-tight">
              {c.f023}
            </h3>
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
              {c.f024}
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
