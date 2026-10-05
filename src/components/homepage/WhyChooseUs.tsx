import { usePageContent } from "@/hooks/usePageContent";
import contentModule from "@/content/pages/home-why-choose-us";
import { BadgeCheck } from "lucide-react";
import { getIcon } from "@/utils/getIcon";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useWhyChooseUs } from "@/hooks/useWhyChooseUs";
import { GRID } from "@/design-system/layouts";
import { LAYOUT } from "@/design-system/constants";
import { useScrollFadeIn } from "@/hooks/useScrollFadeIn";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { Button } from "@/ui/Button";

const springHover = { type: "spring" as const, stiffness: 300, damping: 20 };

const WhyChooseUs = () => {
  const c = usePageContent(contentModule);
  const fallbackDifferentiators = [
    {
      icon: "Shield",
      title: c.f008,
      desc: "Fully licensed and insured with $2M CGL liability coverage, active WSIB registration, and working toward COR certification. Professional execution backed by comprehensive insurance and safety protocols.",
      stats: "$2M CGL Insured",
    },
    {
      icon: "Building",
      title: c.f009,
      desc: "Specialty services from building envelope restoration to interior trades. Single point of contact eliminates coordination complexity and streamlines project delivery.",
      stats: "Self-Performed Core Scopes",
    },
    {
      icon: "Award",
      title: c.f010,
      desc: "Working with trusted manufacturer brands including Benjamin Moore and Sherwin-Williams, with extended warranties. Proven installation methods ensure lasting quality and performance.",
      stats: "Extended Warranties",
    },
    {
      icon: "Calendar",
      title: c.f011,
      desc: "Dedicated project management with transparent pricing and detailed estimates. Our systematic approach and self-performed work keep projects on track.",
      stats: "WSIB Compliant",
    },
    {
      icon: "HardHat",
      title: c.f012,
      desc: "Certified safety-trained crews with continuous training and comprehensive safety protocols backed by full liability coverage on every project.",
      stats: "Ontario Safety Standards",
    },
    {
      icon: "Hammer",
      title: c.f013,
      desc: "Rigorous quality control processes and proven best practices ensure exceptional results. Every project meets or exceeds regulatory requirements and client expectations.",
      stats: "",
    },
  ];

  const { data: items, isLoading } = useWhyChooseUs();
  const rm = useReducedMotion();
  const {
    ref: headerRef,
    isVisible: headerVisible,
    skipAnimation: headerSkip,
  } = useScrollFadeIn();

  const showHeader = headerVisible || headerSkip || rm;

  const differentiators =
    items && items.length > 0
      ? items.map((item) => ({
          icon: item.icon_name || "BadgeCheck",
          title: item.title,
          desc: item.description,
          stats: item.stats_badge || "",
        }))
      : fallbackDifferentiators;

  return (
    <section className="pt-8 md:pt-12 pb-20 md:pb-28">
      <div className="container mx-auto px-6 md:px-8 lg:px-12 max-w-7xl">
        {/* Section Header */}
        <div
          ref={headerRef}
          className="max-w-3xl mb-16"
          style={{
            opacity: showHeader ? 1 : 0,
            transform: showHeader ? "translateY(0)" : "translateY(24px)",
            transition: rm
              ? "none"
              : "opacity 300ms ease-out, transform 300ms ease-out",
          }}
        >
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-6 leading-tight tracking-tight">
            {c.f001}
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
            {c.f002}
          </p>
        </div>

        {/* Cards Grid */}
        {isLoading ? (
          <div className="text-center py-12">{c.f003}</div>
        ) : (
          <div className={GRID.cards3}>
            {differentiators.map((item, index) => {
              const Icon = getIcon(item.icon, BadgeCheck)!;
              return (
                <motion.div
                  key={index}
                  initial={rm ? false : { opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.1 }}
                  transition={
                    rm
                      ? { duration: 0 }
                      : { delay: index * 0.08, duration: 0.4 }
                  }
                  whileHover={rm ? {} : { y: -4, transition: springHover }}
                  className="bg-card border rounded-[var(--radius-lg)] h-full hover:shadow-lg transition-shadow group"
                >
                  <div className="p-8 h-full flex flex-col">
                    <motion.div
                      className="w-14 h-14 rounded-lg bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors"
                      whileHover={rm ? {} : { scale: 1.1, rotate: 3 }}
                      transition={springHover}
                    >
                      <Icon className="w-7 h-7 text-primary" />
                    </motion.div>
                    <div className="flex-1">
                      <h3 className="text-xl md:text-2xl font-bold mb-4 text-foreground leading-tight">
                        {item.title}
                      </h3>
                      <p className="text-base text-muted-foreground mb-6 leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                    {item.stats && (
                      <div className="pt-6 border-t border-border">
                        <div className="inline-flex items-center gap-2 text-sm font-semibold text-primary">
                          {item.stats}
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Bottom CTA Section */}
        <div className="max-w-4xl mx-auto mt-16">
          <div className="border border-primary/20 bg-background rounded-[var(--radius-lg)]">
            <div className="p-8 lg:p-12 text-center">
              <h3 className="text-2xl md:text-3xl font-bold mb-4 text-foreground">
                {c.f004}
              </h3>
              <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                {c.f005}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" className="min-w-[200px]">
                  <Link to="/contact">{c.f006}</Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="secondary"
                  className="min-w-[200px]"
                >
                  <Link to="/projects">{c.f007}</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
