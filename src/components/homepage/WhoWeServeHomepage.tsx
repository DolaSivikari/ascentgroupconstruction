import { usePageContent } from "@/hooks/usePageContent";
import contentModule from "@/content/pages/home-audiences";
import { Building2, Users, Home, Briefcase, ArrowUpRight } from "lucide-react";
import { Section } from "@/components/sections/Section";
import { Link } from "react-router-dom";
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
        {/* Benefits live in the unified carousel; this section owns audience links only. */}
        <div data-home-audiences>
          <div
            ref={headerRef}
            className="max-w-3xl mb-8"
            style={fadeStyle(showHeader)}
          >
            <span
              className="mb-5 block h-1 w-10 rounded-full bg-[hsl(var(--brand-accent))]"
              aria-hidden="true"
            />
            <h3 className="mb-4 text-2xl font-semibold leading-tight tracking-tight text-foreground md:text-3xl">
              {c.f023}
            </h3>
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
              {c.f024}
            </p>
          </div>

          <div
            ref={gridRef}
            className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4"
          >
            {clientSegments.map((segment, index) => (
              <div
                key={index}
                style={{
                  ...fadeStyle(showGrid),
                  transitionDelay: showGrid ? `${delays[index] ?? 0}ms` : "0ms",
                }}
              >
                <Link
                  to={segment.link}
                  className="group flex h-full flex-col rounded-xl border border-border bg-card p-6 shadow-sm transition-colors hover:border-primary/50 hover:bg-muted/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4 focus-visible:ring-offset-background motion-reduce:transition-none"
                >
                  <div className="mb-6 flex items-center justify-between gap-4">
                    <span className="flex h-12 w-12 items-center justify-center rounded-xl border border-[hsl(var(--brand-accent)/0.2)] bg-[hsl(var(--brand-accent)/0.08)] text-primary">
                      <segment.icon className="h-6 w-6" aria-hidden="true" />
                    </span>
                    <ArrowUpRight
                      className="h-5 w-5 shrink-0 text-primary/70 group-hover:text-primary group-focus-visible:text-primary"
                      aria-hidden="true"
                    />
                  </div>
                  <h3 className="mb-3 text-xl font-semibold leading-snug text-foreground xl:min-h-14">
                    {segment.title}
                  </h3>
                  <p className="text-base leading-relaxed text-muted-foreground">
                    {segment.description}
                  </p>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
};

export default WhoWeServeHomepage;
