import { Link } from "react-router-dom";
import {
  Search, FileText, HardHat, CheckCircle, ArrowRight,
  Shield, Award, Lightbulb, Heart, Target, CircleCheckBig,
} from "lucide-react";
import { useScrollFadeIn } from "@/hooks/useScrollFadeIn";
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

const TimelineStep = ({
  step,
  index,
  isEven,
  prefersReducedMotion,
}: {
  step: typeof steps[number];
  index: number;
  isEven: boolean;
  prefersReducedMotion: boolean;
}) => {
  const { ref, isVisible, skipAnimation } = useScrollFadeIn({ threshold: 0.3 });
  const show = isVisible || skipAnimation || prefersReducedMotion;
  const Icon = step.icon;
  const delay = prefersReducedMotion ? 0 : index * 150;
  const trans = prefersReducedMotion
    ? "none"
    : `opacity 400ms ease-out ${delay}ms, transform 400ms ease-out ${delay}ms`;

  return (
    <div ref={ref} className="relative flex items-start md:items-center gap-0 md:gap-0">
      {/* Mobile + Desktop layout wrapper */}
      <div className={`w-full flex flex-col md:flex-row ${isEven ? "md:flex-row-reverse" : ""} items-start md:items-center`}>
        {/* Card side */}
        <div className="w-full md:w-[calc(50%-2rem)] pl-14 md:pl-0">
          <div
            className={`rounded-[var(--radius-lg)] bg-card border border-border p-6 shadow-sm ${isEven ? "md:ml-0 md:mr-auto" : "md:mr-0 md:ml-auto"}`}
            style={{
              opacity: show ? 1 : 0,
              transform: show
                ? "translateX(0)"
                : isEven
                  ? "translateX(40px)"
                  : "translateX(-40px)",
              transition: trans,
            }}
          >
            <span
              aria-hidden="true"
              className="text-5xl font-bold text-foreground/5 select-none leading-none"
            >
              {step.number}
            </span>
            <div className="flex items-center gap-3 mt-2 mb-2">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Icon className="w-5 h-5 text-primary" />
              </div>
              <h3 className="text-lg font-bold text-foreground">{step.title}</h3>
            </div>
            <p className="text-base text-muted-foreground leading-relaxed">{step.description}</p>
          </div>
        </div>

        {/* Center dot — positioned absolutely on the timeline line */}
        <div
          className="absolute left-6 md:left-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-primary flex items-center justify-center z-10 border-4 border-background shadow-md"
          style={{
            transform: `translateX(-50%) scale(${show ? 1 : 0.5})`,
            opacity: show ? 1 : 0,
            transition: prefersReducedMotion
              ? "none"
              : `opacity 300ms ease-out ${delay}ms, transform 300ms cubic-bezier(0.34,1.56,0.64,1) ${delay}ms`,
          }}
        >
          <span className="text-xs font-bold text-primary-foreground">{step.number}</span>
        </div>

        {/* Spacer for the other side on desktop */}
        <div className="hidden md:block md:w-[calc(50%-2rem)]" />
      </div>
    </div>
  );
};

const TimelineSegment = ({
  show,
  prefersReducedMotion,
  delay,
}: {
  show: boolean;
  prefersReducedMotion: boolean;
  delay: number;
}) => (
  <div className="relative h-16 md:h-20 flex items-center justify-start md:justify-center">
    <div
      className="absolute left-6 md:left-1/2 -translate-x-1/2 w-0.5 h-full bg-primary/30"
      style={{
        transform: `translateX(-50%) scaleY(${show ? 1 : 0})`,
        transformOrigin: "top",
        transition: prefersReducedMotion ? "none" : `transform 500ms ease-out ${delay}ms`,
      }}
    />
  </div>
);

export const HomepageProcessStrip = () => {
  const prefersReducedMotion = useReducedMotion();
  const { ref: headerRef, isVisible: headerVisible, skipAnimation: headerSkip } = useScrollFadeIn();
  const { ref: cardsRef, isVisible: cardsVisible, skipAnimation: cardsSkip } = useScrollFadeIn({ threshold: 0.1 });

  // Track visibility for line segments
  const step0 = useScrollFadeIn({ threshold: 0.3 });
  const step1 = useScrollFadeIn({ threshold: 0.3 });
  const step2 = useScrollFadeIn({ threshold: 0.3 });
  const step3 = useScrollFadeIn({ threshold: 0.3 });
  const stepVisibility = [
    step0.isVisible || step0.skipAnimation || prefersReducedMotion,
    step1.isVisible || step1.skipAnimation || prefersReducedMotion,
    step2.isVisible || step2.skipAnimation || prefersReducedMotion,
    step3.isVisible || step3.skipAnimation || prefersReducedMotion,
  ];

  const showHeader = headerVisible || headerSkip || prefersReducedMotion;
  const showCards = cardsVisible || cardsSkip || prefersReducedMotion;

  const transition = prefersReducedMotion ? "none" : "opacity 300ms ease-out, transform 300ms ease-out";
  const cardDelays = [0, 100, 200];

  return (
    <section className="w-full pt-16 md:pt-20 pb-20 md:pb-28 bg-gradient-to-b from-muted/30 to-background">
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

        {/* Vertical Timeline */}
        <div className="relative mb-16">
          {steps.map((step, index) => (
            <div key={index}>
              <TimelineStep
                step={step}
                index={index}
                isEven={index % 2 === 1}
                prefersReducedMotion={prefersReducedMotion}
              />
              {index < steps.length - 1 && (
                <TimelineSegment
                  show={stepVisibility[index + 1]}
                  prefersReducedMotion={prefersReducedMotion}
                  delay={index * 150}
                />
              )}
            </div>
          ))}
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
              transitionDelay: showCards ? `${cardDelays[0]}ms` : "0ms",
            }}
          >
            <h3 className="text-lg font-bold uppercase tracking-wider text-primary mb-6">Our Approach</h3>
            <div className="space-y-4">
              {approachItems.map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <CircleCheckBig className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" aria-hidden="true" />
                  <span className="text-base text-muted-foreground leading-relaxed">{item}</span>
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
              transitionDelay: showCards ? `${cardDelays[1]}ms` : "0ms",
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
                      <p className="text-base font-semibold mb-0.5">{item.title}</p>
                      <p className="text-sm text-primary-foreground/80 leading-relaxed">{item.desc}</p>
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
              transitionDelay: showCards ? `${cardDelays[2]}ms` : "0ms",
            }}
          >
            <h3 className="text-lg font-bold uppercase tracking-wider text-foreground mb-6">Our Promise</h3>
            <div className="space-y-5">
              {promiseItems.map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <Target className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" aria-hidden="true" />
                  <div>
                    <p className="text-base font-semibold mb-0.5">{item.title}</p>
                    <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer link */}
        <div className="text-center mt-10">
          <Link
            to="/our-process"
            className="inline-flex items-center gap-2 text-base font-semibold text-primary hover:text-primary/80 transition-colors duration-200"
          >
            See our full process
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};