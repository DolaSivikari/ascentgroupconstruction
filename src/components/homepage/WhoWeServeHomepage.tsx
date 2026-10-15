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
  ArrowUpRight,
} from "lucide-react";
import { Section } from "@/components/sections/Section";
import { SectionBadge } from "@/components/ui/SectionBadge";
import { Card } from "@/design-system/components/Card";
import { Button } from "@/ui/Button";
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
        {/* Why Choose Us */}
        <div
          ref={headerRef}
          className="mb-12 overflow-hidden rounded-2xl border border-border border-t-4 border-t-[hsl(var(--brand-accent))] bg-card shadow-sm"
          style={fadeStyle(showHeader)}
          data-client-reasons
        >
          <div className="border-b border-border p-6 md:p-8">
            <SectionBadge icon={Award} text={c.f001} />
            <h2 className="mb-5 text-3xl font-bold leading-tight tracking-tight text-foreground md:text-4xl">
              {c.f002}
            </h2>
            <p className="mb-6 rounded-r-lg border-l-2 border-primary bg-muted/30 px-4 py-3 text-lg font-semibold leading-relaxed text-foreground md:text-xl">
              {c.f003}
              <span className="text-primary">{c.f004}</span> {c.f005}
            </p>

            <div className="grid gap-5 lg:grid-cols-[1.4fr_1fr] lg:gap-8">
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
          </div>

          {/* Benefit bullets */}
          <div className="grid gap-4 bg-muted/20 p-6 md:grid-cols-2 md:p-8 xl:grid-cols-3">
            {benefits.map((b, i) => (
              <Card
                key={i}
                variant="outline"
                size="sm"
                className={`h-full rounded-xl border border-border bg-background p-5 ${i === benefits.length - 1 ? "md:col-span-2 xl:col-span-3" : ""}`}
              >
                <div className="flex gap-3">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                    <CheckCircle2
                      className="h-4 w-4 text-primary"
                      aria-hidden="true"
                    />
                  </span>
                  <div className="min-w-0">
                    <h3
                      className={`${TYPOGRAPHY_STYLES.cardTitle} mb-2 leading-snug text-foreground`}
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
          <div className="flex flex-col flex-wrap gap-3 border-t border-border p-6 sm:flex-row md:px-8 md:py-6">
            <Button
              asChild
              size="lg"
              variant="navy"
              className="min-w-0 whitespace-normal text-center"
            >
              <Link to="/contact">{c.f020}</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="min-w-0 whitespace-normal border-primary text-center text-primary hover:bg-muted/50"
            >
              <Link to="/services">{c.f021}</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="min-w-0 whitespace-normal border-primary text-center text-primary hover:bg-muted/50"
            >
              <Link to="/contact">{c.f022}</Link>
            </Button>
          </div>
        </div>

        {/* Divider + Who We Serve cards */}
        <div
          className="mt-16 border-t border-border/50 pt-12"
          data-home-audiences
        >
          <div className="max-w-3xl mb-8">
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
