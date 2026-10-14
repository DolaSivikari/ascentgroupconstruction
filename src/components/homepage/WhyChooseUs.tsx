import { usePageContent } from "@/hooks/usePageContent";
import contentModule from "@/content/pages/home-why-choose-us";
import { BadgeCheck } from "lucide-react";
import { getIcon } from "@/utils/getIcon";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useWhyChooseUs } from "@/hooks/useWhyChooseUs";
import { useScrollFadeIn } from "@/hooks/useScrollFadeIn";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { Button } from "@/ui/Button";

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
    <section aria-labelledby="why-choose-us-heading" className="py-12 md:py-16">
      <div className="container mx-auto max-w-7xl px-4 md:px-8 lg:px-12">
        <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
          <div className="grid lg:grid-cols-[minmax(0,0.8fr)_minmax(0,2fr)]">
            {/* Introduction panel */}
            <div className="relative overflow-hidden bg-[hsl(var(--navy-surface))] p-6 text-white md:p-8 lg:p-10">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 opacity-[0.07] [background-image:linear-gradient(to_right,white_1px,transparent_1px),linear-gradient(to_bottom,white_1px,transparent_1px)] [background-size:48px_48px]"
              />
              <div
                ref={headerRef}
                className="relative max-w-3xl"
                style={{
                  opacity: showHeader ? 1 : 0,
                  transform: showHeader ? "translateY(0)" : "translateY(24px)",
                  transition: rm
                    ? "none"
                    : "opacity 300ms ease-out, transform 300ms ease-out",
                }}
              >
                <div
                  aria-hidden="true"
                  className="mb-6 h-1 w-12 rounded-full bg-[hsl(var(--brand-accent))]"
                />
                <h2
                  id="why-choose-us-heading"
                  className="mb-5 text-3xl font-bold leading-tight tracking-tight text-white md:text-4xl"
                >
                  {c.f001}
                </h2>
                <p className="text-base leading-relaxed text-white/85">
                  {c.f002}
                </p>
              </div>
            </div>

            {/* Reasons remain in the original reading order. */}
            {isLoading ? (
              <div className="px-6 py-12 text-center">{c.f003}</div>
            ) : (
              <div className="grid min-w-0 sm:grid-cols-2">
                {differentiators.map((item, index) => {
                  const Icon = getIcon(item.icon, BadgeCheck)!;
                  return (
                    <motion.article
                      key={index}
                      initial={rm ? false : { opacity: 0, y: 12 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, amount: 0.1 }}
                      transition={
                        rm
                          ? { duration: 0 }
                          : { delay: index * 0.04, duration: 0.3 }
                      }
                      className="flex min-w-0 flex-col border-b border-border p-6 sm:odd:border-r md:p-7"
                    >
                      <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl border border-border bg-muted/50">
                        <Icon
                          className="h-5 w-5 text-primary"
                          aria-hidden="true"
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="mb-3 text-lg font-semibold leading-tight text-foreground md:text-xl">
                          {item.title}
                        </h3>
                        <p className="mb-5 text-sm leading-relaxed text-muted-foreground">
                          {item.desc}
                        </p>
                      </div>
                      {item.stats && (
                        <div className="mt-auto">
                          <div className="inline-flex max-w-full items-center border-l-2 border-[hsl(var(--brand-accent))] bg-muted/40 py-2 pl-3 pr-3 text-xs font-semibold text-primary">
                            {item.stats}
                          </div>
                        </div>
                      )}
                    </motion.article>
                  );
                })}
              </div>
            )}
          </div>

          {/* Existing actions sit inside the same frame. */}
          <div className="flex flex-col gap-6 border-t border-border bg-muted/30 p-6 md:p-8 xl:flex-row xl:items-center xl:justify-between">
            <div className="max-w-xl">
              <h3 className="mb-3 text-2xl font-semibold text-foreground">
                {c.f004}
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {c.f005}
              </p>
            </div>
            <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
              <Button asChild size="lg">
                <Link to="/contact">{c.f006}</Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="secondary"
                className="border-primary text-primary hover:bg-muted/50"
              >
                <Link to="/projects">{c.f007}</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
