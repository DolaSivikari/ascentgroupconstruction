import { Link } from "react-router-dom";
import { Search, FileText, HardHat, CheckCircle, ArrowRight } from "lucide-react";
import { useScrollFadeIn } from "@/hooks/useScrollFadeIn";
import { useStaggerAnimation } from "@/hooks/useStaggerAnimation";
import { useReducedMotion } from "@/hooks/useReducedMotion";

const steps = [
  {
    number: "01",
    icon: Search,
    title: "Assess",
    description: "Site inspection and scope definition with a written summary.",
  },
  {
    number: "02",
    icon: FileText,
    title: "Scope",
    description: "Detailed estimate and itemised work breakdown, no surprises.",
  },
  {
    number: "03",
    icon: HardHat,
    title: "Execute",
    description: "Self-performed installation by our trained, insured crews.",
  },
  {
    number: "04",
    icon: CheckCircle,
    title: "Close Out",
    description: "QA walkthrough, deficiency sign-off, and warranty documentation.",
  },
];

export const HomepageProcessStrip = () => {
  const prefersReducedMotion = useReducedMotion();
  const { ref: headerRef, isVisible: headerVisible, skipAnimation: headerSkip } =
    useScrollFadeIn();
  const { ref: gridRef, isVisible: gridVisible, skipAnimation: gridSkip } =
    useScrollFadeIn({ threshold: 0.1 });
  const delays = useStaggerAnimation({ itemCount: steps.length, staggerDelay: 75 });

  const showHeader = headerVisible || headerSkip || prefersReducedMotion;
  const showGrid = gridVisible || gridSkip || prefersReducedMotion;

  return (
    <section className="py-16 md:py-24 bg-muted/20 border-y border-border/40">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div
          ref={headerRef}
          className="text-center mb-12"
          style={{
            opacity: showHeader ? 1 : 0,
            transform: showHeader ? "translateY(0)" : "translateY(24px)",
            transition: prefersReducedMotion
              ? "none"
              : "opacity 300ms ease-out, transform 300ms ease-out",
          }}
        >
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-3">
            How We Work
          </p>
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">
            From First Call to Final Sign-Off
          </h2>
        </div>

        {/* Steps grid */}
        <div
          ref={gridRef}
          className="grid grid-cols-2 md:grid-cols-4 gap-8"
        >
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div
                key={index}
                className="relative text-center group"
                style={{
                  opacity: showGrid ? 1 : 0,
                  transform: showGrid ? "translateY(0)" : "translateY(24px)",
                  transition: prefersReducedMotion
                    ? "none"
                    : `opacity 300ms ease-out, transform 300ms ease-out`,
                  transitionDelay: showGrid ? `${delays[index] ?? 0}ms` : "0ms",
                }}
              >
                {/* Giant muted step number */}
                <span
                  aria-hidden="true"
                  className="absolute -top-2 left-1/2 -translate-x-1/2 text-7xl font-bold text-foreground/5 select-none leading-none"
                >
                  {step.number}
                </span>

                {/* Icon */}
                <div className="relative z-10 mx-auto mb-4 w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors duration-300">
                  <Icon className="w-6 h-6 text-primary" />
                </div>

                {/* Content */}
                <h3 className="relative z-10 text-base font-bold text-foreground mb-2">
                  {step.title}
                </h3>
                <p className="relative z-10 text-sm text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Footer link */}
        <div className="text-center mt-10">
          <Link
            to="/how-we-work"
            className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary/80 transition-colors duration-200"
          >
            See our full process
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};
