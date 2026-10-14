import { usePageContent } from "@/hooks/usePageContent";
import contentModule from "@/content/pages/home-audiences";
import { Building2, Users, Home, Briefcase } from "lucide-react";
import { Section } from "@/components/sections/Section";
import { SegmentCard } from "@/design-system/components/SegmentCard";
import { GRID } from "@/design-system/layouts";
import { useScrollFadeIn } from "@/hooks/useScrollFadeIn";
import { useStaggerAnimation } from "@/hooks/useStaggerAnimation";
import { useReducedMotion } from "@/hooks/useReducedMotion";

const WhoWeServeHomepage = () => {
  const c = usePageContent(contentModule);
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
        {/* Audience segments keep their existing links and content. */}
        <div>
          <div
            ref={headerRef}
            className="max-w-3xl mb-8"
            style={fadeStyle(showHeader)}
          >
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
