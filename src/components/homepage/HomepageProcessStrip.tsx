import { Link } from "react-router-dom";
import {
  Search, FileText, HardHat, CheckCircle, ArrowRight,
  Shield, Award, Lightbulb, Heart, Target, CircleCheckBig,
} from "lucide-react";
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

const approachItems = [
  "Detailed site assessment and project planning",
  "Transparent pricing with no hidden costs",
  "Dedicated project manager for seamless coordination",
  "Premium materials from trusted suppliers",
  "Rigorous quality control at every phase",
  "Comprehensive warranties and ongoing support",
];

const valuesItems = [
  { icon: Shield, title: "Safety First", desc: "Comprehensive safety protocols and training for every project, ensuring zero-incident worksites." },
  { icon: Award, title: "Quality Craftsmanship", desc: "Premium materials and skilled trades deliver results that exceed industry standards." },
  { icon: Lightbulb, title: "Innovation", desc: "Latest techniques and sustainable solutions for modern construction challenges." },
  { icon: Heart, title: "Client Partnership", desc: "Transparent communication and dedicated support throughout your project journey." },
];

const promiseItems = [
  { title: "On-Time Delivery", desc: "We respect your schedule with efficient project management and clear timelines." },
  { title: "Budget Certainty", desc: "Detailed estimates upfront with no surprise costs or change orders." },
  { title: "Quality Guarantee", desc: "Comprehensive warranties backed by 15+ years of team experience." },
  { title: "Safety Compliance", desc: "WSIB certified with strict adherence to all safety regulations." },
];

export const HomepageProcessStrip = () => {
  const prefersReducedMotion = useReducedMotion();
  const { ref: headerRef, isVisible: headerVisible, skipAnimation: headerSkip } = useScrollFadeIn();
  const { ref: gridRef, isVisible: gridVisible, skipAnimation: gridSkip } = useScrollFadeIn({ threshold: 0.1 });
  const { ref: cardsRef, isVisible: cardsVisible, skipAnimation: cardsSkip } = useScrollFadeIn({ threshold: 0.1 });
  const stepDelays = useStaggerAnimation({ itemCount: steps.length, staggerDelay: 75 });
  const cardDelays = useStaggerAnimation({ itemCount: 3, staggerDelay: 100 });

  const showHeader = headerVisible || headerSkip || prefersReducedMotion;
  const showGrid = gridVisible || gridSkip || prefersReducedMotion;
  const showCards = cardsVisible || cardsSkip || prefersReducedMotion;

  const transition = prefersReducedMotion ? "none" : "opacity 300ms ease-out, transform 300ms ease-out";

  return (
    <section className="w-full py-20 md:py-28 lg:py-32 bg-gradient-to-b from-muted/40 to-background">
      <div className="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        {/* Header */}
        <div
          ref={headerRef}
          className="mb-12"
          style={{
            opacity: showHeader ? 1 : 0,
            transform: showHeader ? "translateY(0)" : "translateY(24px)",
            transition,
          }}
        >
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            Your Envelope, Restoration & Interior Trades Partner
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed max-w-3xl">
            From building envelope systems to specialty restoration, we deliver focused trade execution with the expertise, safety standards, and quality you expect.
          </p>
        </div>

        {/* 4-step process row */}
        <div ref={gridRef} className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div
                key={index}
                className="relative text-center group"
                style={{
                  opacity: showGrid ? 1 : 0,
                  transform: showGrid ? "translateY(0)" : "translateY(24px)",
                  transition,
                  transitionDelay: showGrid ? `${stepDelays[index] ?? 0}ms` : "0ms",
                }}
              >
                <span
                  aria-hidden="true"
                  className="absolute -top-2 left-1/2 -translate-x-1/2 text-7xl font-bold text-foreground/5 select-none leading-none"
                >
                  {step.number}
                </span>
                <div className="relative z-10 mx-auto mb-4 w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors duration-300">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="relative z-10 text-base font-bold text-foreground mb-2">{step.title}</h3>
                <p className="relative z-10 text-sm text-muted-foreground leading-relaxed">{step.description}</p>
              </div>
            );
          })}
        </div>

        {/* 3-column cards */}
        <div ref={cardsRef} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Our Approach */}
          <div
            className="rounded-[var(--radius-lg)] transition-all duration-200 bg-card border border-border p-8 h-full border-t-4 border-t-primary"
            style={{
              opacity: showCards ? 1 : 0,
              transform: showCards ? "translateY(0)" : "translateY(24px)",
              transition,
              transitionDelay: showCards ? `${cardDelays[0] ?? 0}ms` : "0ms",
            }}
          >
            <h3 className="text-lg font-bold uppercase tracking-wider text-primary mb-6">Our Approach</h3>
            <div className="space-y-4">
              {approachItems.map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <CircleCheckBig className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" aria-hidden="true" />
                  <span className="text-sm text-muted-foreground leading-relaxed">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Our Values */}
          <div
            className="rounded-[var(--radius-lg)] transition-all duration-200 border border-border shadow-[var(--shadow-card-elevated)] p-8 h-full bg-primary text-primary-foreground"
            style={{
              opacity: showCards ? 1 : 0,
              transform: showCards ? "translateY(0)" : "translateY(24px)",
              transition,
              transitionDelay: showCards ? `${cardDelays[1] ?? 0}ms` : "0ms",
            }}
          >
            <h3 className="text-lg font-bold uppercase tracking-wider mb-6">Our Values</h3>
            <div className="space-y-5">
              {valuesItems.map((item, i) => {
                const VIcon = item.icon;
                return (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-[var(--radius-sm)] bg-primary-foreground/15 flex items-center justify-center flex-shrink-0">
                      <VIcon className="w-4 h-4 text-primary-foreground" aria-hidden="true" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold mb-0.5">{item.title}</p>
                      <p className="text-xs text-primary-foreground/80 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Our Promise */}
          <div
            className="rounded-[var(--radius-lg)] transition-all duration-200 bg-card border border-border p-8 h-full border-t-4 border-t-accent"
            style={{
              opacity: showCards ? 1 : 0,
              transform: showCards ? "translateY(0)" : "translateY(24px)",
              transition,
              transitionDelay: showCards ? `${cardDelays[2] ?? 0}ms` : "0ms",
            }}
          >
            <h3 className="text-lg font-bold uppercase tracking-wider text-foreground mb-6">Our Promise</h3>
            <div className="space-y-5">
              {promiseItems.map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <Target className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" aria-hidden="true" />
                  <div>
                    <p className="text-sm font-semibold mb-0.5">{item.title}</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
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
