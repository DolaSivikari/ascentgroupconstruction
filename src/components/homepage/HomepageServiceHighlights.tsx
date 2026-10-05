import { usePageContent } from "@/hooks/usePageContent";
import contentModule from "@/content/pages/home-service-highlights";
import { CARD_STYLES, TYPOGRAPHY_STYLES } from "@/design-system/constants";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import {
  Building2,
  Layers,
  Hammer,
  Droplets,
  Grid3x3,
  Car,
  LayoutDashboard,
  Paintbrush,
  ArrowRight,
  Shield,
  Award,
  FileCheck,
  MapPin,
  Clock,
} from "lucide-react";
import { motion } from "framer-motion";
import { GRID } from "@/design-system/layouts";
import { useScrollFadeIn } from "@/hooks/useScrollFadeIn";
import { useReducedMotion } from "@/hooks/useReducedMotion";

const springHover = { type: "spring" as const, stiffness: 300, damping: 20 };

export const HomepageServiceHighlights = () => {
  const c = usePageContent(contentModule);
  const services = [
    {
      icon: Building2,
      title: c.f021,
      description: c.f022,
      detail: c.f023,
      href: "/services/facade-remediation",
    },
    {
      icon: Layers,
      title: c.f024,
      description: c.f025,
      detail: c.f026,
      href: "/services/eifs-stucco-systems",
    },
    {
      icon: Hammer,
      title: c.f027,
      description: c.f028,
      detail: c.f029,
      href: "/services/masonry-restoration",
    },
    {
      icon: Droplets,
      title: c.f030,
      description: c.f031,
      detail: c.f032,
      href: "/services/waterproofing-systems",
    },
    {
      icon: Grid3x3,
      title: c.f033,
      description: c.f034,
      detail: c.f035,
      href: "/services/cladding-systems",
    },
    {
      icon: Car,
      title: c.f036,
      description: c.f037,
      detail: c.f038,
      href: "/services/parking-garage-restoration",
    },
    {
      icon: LayoutDashboard,
      title: c.f039,
      description: c.f040,
      detail: c.f041,
      href: "/services/interior-buildouts-finishing",
    },
    {
      icon: Paintbrush,
      title: c.f042,
      description: c.f043,
      detail: c.f044,
      href: "/services/painting-services",
    },
  ];
  const highlights = [
    {
      icon: Shield,
      title: c.f045,
      description: c.f046,
    },
    {
      icon: Award,
      title: c.f047,
      description: c.f048,
    },
    {
      icon: FileCheck,
      title: c.f049,
      description: c.f050,
    },
  ];

  const rm = useReducedMotion();
  const {
    ref: introRef,
    isVisible: introVisible,
    skipAnimation: introSkip,
  } = useScrollFadeIn();
  const {
    ref: headerRef,
    isVisible: headerVisible,
    skipAnimation: headerSkip,
  } = useScrollFadeIn();

  const showIntro = introVisible || introSkip || rm;
  const showHeader = headerVisible || headerSkip || rm;

  const fadeStyle = (visible: boolean) => ({
    opacity: visible ? 1 : 0,
    transform: visible ? "translateY(0)" : "translateY(24px)",
    transition: rm
      ? "none"
      : "opacity 300ms ease-out, transform 300ms ease-out",
  });

  return (
    <section className="pt-12 md:pt-16 pb-20 md:pb-28">
      <div className="container mx-auto px-6 md:px-8 lg:px-12 max-w-7xl">
        {/* ── Part 1: Company Introduction ── */}
        <div ref={introRef} style={fadeStyle(showIntro)}>
          {/* Header */}
          <div className="max-w-4xl mb-10">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-4">
              {c.f001}
            </p>
            <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-5 leading-tight tracking-tight">
              {c.f002}
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed max-w-3xl">
              {c.f003}
            </p>
          </div>

          {/* Two-column body */}
          <div className="grid md:grid-cols-2 gap-x-12 gap-y-6 mb-12">
            <div className="space-y-4">
              <p
                className={`${TYPOGRAPHY_STYLES.cardBody} text-muted-foreground`}
              >
                {c.f004}
                <span className="font-medium text-foreground">
                  {c.f005}
                </span> to{" "}
                <span className="font-medium text-foreground">{c.f006}</span>,{" "}
                <span className="font-medium text-foreground">{c.f007}</span>
                {c.f008}
              </p>
              <p
                className={`${TYPOGRAPHY_STYLES.cardBody} text-muted-foreground`}
              >
                {c.f009}
              </p>
            </div>
            <div className="space-y-4">
              <p
                className={`${TYPOGRAPHY_STYLES.cardBody} text-muted-foreground`}
              >
                {c.f010}{" "}
                <span className="font-medium text-foreground">{c.f011}</span>{" "}
                {c.f012}
              </p>
              <p
                className={`${TYPOGRAPHY_STYLES.cardBody} text-muted-foreground`}
              >
                {c.f013}
              </p>
            </div>
          </div>

          {/* Three highlight cards */}
          <div className="grid sm:grid-cols-3 gap-4 mb-10">
            {highlights.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className="p-5 rounded-lg border border-border/60 bg-card"
                >
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="text-base font-bold text-foreground mb-1.5">
                    {item.title}
                  </h3>
                  <p
                    className={`${TYPOGRAPHY_STYLES.cardBody} text-muted-foreground`}
                  >
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Service area + response time */}
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground mb-14">
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-primary" />
              {c.f014}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-primary" />
              {c.f015}
            </span>
          </div>

          {/* Divider */}
          <div className="border-b border-border mb-14" />
        </div>

        {/* ── Part 2: Service Cards ── */}
        <div
          ref={headerRef}
          className="max-w-3xl mb-14"
          style={fadeStyle(showHeader)}
        >
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-4">
            {c.f016}
          </p>
          <h3 className="text-3xl md:text-4xl font-bold text-foreground mb-5 leading-tight tracking-tight">
            {c.f017}
          </h3>
          <p className="text-lg text-muted-foreground leading-relaxed">
            {c.f018}
          </p>
        </div>

        <div className={GRID.cards4}>
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <motion.div
                key={index}
                initial={rm ? false : { opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.1 }}
                transition={
                  rm ? { duration: 0 } : { delay: index * 0.08, duration: 0.4 }
                }
              >
                <Link
                  to={service.href}
                  className={cn(
                    CARD_STYLES.base,
                    CARD_STYLES.motion,
                    CARD_STYLES.hover,
                    CARD_STYLES.interactive,
                    "group/card block p-6 h-full",
                  )}
                >
                  <motion.div
                    className="w-11 h-11 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover/card:bg-primary/20 transition-colors duration-300"
                    whileHover={rm ? {} : { scale: 1.1 }}
                    transition={springHover}
                  >
                    <Icon className="w-5 h-5 text-primary" />
                  </motion.div>
                  <h3
                    className={`${TYPOGRAPHY_STYLES.cardTitle} text-foreground mb-2`}
                  >
                    {service.title}
                  </h3>
                  <p
                    className={`${TYPOGRAPHY_STYLES.cardBody} text-muted-foreground`}
                  >
                    {service.description}
                  </p>

                  {/* Hover-reveal detail panel */}
                  <div className="grid grid-rows-[0fr] group-hover/card:grid-rows-[1fr] focus-within:grid-rows-[1fr] transition-[grid-template-rows] duration-300 ease-out">
                    <div className="overflow-hidden">
                      <div className="pt-3 mt-3 border-t border-border/40">
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {service.detail}
                        </p>
                        <span className="inline-flex items-center gap-1 mt-3 text-xs font-semibold text-primary">
                          {c.f019}
                          {service.title}
                          <ArrowRight className="w-3 h-3" />
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* Footer link */}
        <div className="mt-12 text-center">
          <Link
            to="/services"
            className="inline-flex items-center gap-2 text-base font-semibold text-primary hover:text-primary/80 transition-colors duration-200"
          >
            {c.f020}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};
