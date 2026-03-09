import * as LucideIcons from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/ui/Button";
import { Link } from "react-router-dom";
import { useWhyChooseUs } from "@/hooks/useWhyChooseUs";
import { GRID } from "@/design-system/layouts";
import { LAYOUT } from "@/design-system/constants";
import { useScrollFadeIn } from "@/hooks/useScrollFadeIn";
import { useStaggerAnimation } from "@/hooks/useStaggerAnimation";
import { useReducedMotion } from "@/hooks/useReducedMotion";

// Fallback data with construction-specific icons
const fallbackDifferentiators = [
  { icon: "Shield", title: "Licensed & Certified", desc: "Fully licensed and insured with $2M CGL liability coverage, active WSIB registration, and working toward COR certification. Professional execution backed by comprehensive insurance and safety protocols.", stats: "$2M CGL Insured" },
  { icon: "Building", title: "Comprehensive Services", desc: "Complete construction solutions from envelope restoration to specialty trades. Single point of contact eliminates coordination complexity and streamlines project delivery.", stats: "21+ Service Offerings" },
  { icon: "Award", title: "Premium Materials", desc: "Authorized contractor for industry-leading brands with extended manufacturer warranties. Premium materials and proven installation methods ensure lasting quality and performance.", stats: "Extended Warranties" },
  { icon: "Calendar", title: "On-Time Delivery", desc: "Dedicated project management with transparent pricing and detailed estimates. Our systematic approach maintains a 95% on-time completion rate across all projects.", stats: "WSIB Compliant" },
  { icon: "HardHat", title: "Expert Team", desc: "Certified safety-trained crews with continuous training and comprehensive safety protocols backed by full liability coverage on every project.", stats: "Ontario Safety Standards" },
  { icon: "Hammer", title: "Quality Standards", desc: "Rigorous quality control processes and industry-leading best practices ensure exceptional results. Every project meets or exceeds regulatory requirements and client expectations.", stats: "" },
];

const WhyChooseUs = () => {
  const { data: items, isLoading } = useWhyChooseUs();
  const prefersReducedMotion = useReducedMotion();
  const { ref: headerRef, isVisible: headerVisible, skipAnimation: headerSkip } =
    useScrollFadeIn();
  const { ref: gridRef, isVisible: gridVisible, skipAnimation: gridSkip } =
    useScrollFadeIn({ threshold: 0.05 });
  const delays = useStaggerAnimation({ itemCount: 6, staggerDelay: 50 });

  const showHeader = headerVisible || headerSkip || prefersReducedMotion;
  const showGrid = gridVisible || gridSkip || prefersReducedMotion;

  const differentiators = items && items.length > 0
    ? items.map(item => ({
        icon: item.icon_name || "BadgeCheck",
        title: item.title,
        desc: item.description,
        stats: item.stats_badge || "",
      }))
    : fallbackDifferentiators;

  return (
    <section className={`${LAYOUT.sectionSpacing.major} bg-muted/30`}>
      <div className="container mx-auto px-6 md:px-8 lg:px-12 max-w-7xl">

        {/* Section Header */}
        <div
          ref={headerRef}
          className="max-w-3xl mb-16"
          style={{
            opacity: showHeader ? 1 : 0,
            transform: showHeader ? "translateY(0)" : "translateY(24px)",
            transition: prefersReducedMotion
              ? "none"
              : "opacity 300ms ease-out, transform 300ms ease-out",
          }}
        >
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-6 leading-tight tracking-tight">
            Why Property Owners Choose Us
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
            Our team brings 15+ years of combined experience in building envelope and interior trades across Ontario, delivering exceptional construction results through licensed professionals, complete services, and unwavering commitment to quality.
          </p>
        </div>

        {/* Cards Grid */}
        {isLoading ? (
          <div className="text-center py-12">Loading...</div>
        ) : (
          <div ref={gridRef} className={GRID.cards3}>
            {differentiators.map((item, index) => {
              const Icon = (LucideIcons as any)[item.icon] || LucideIcons.BadgeCheck;
              return (
              <Card
                key={index}
                variant="elevated"
                className="h-full hover-subtle group"
                style={{
                  opacity: showGrid ? 1 : 0,
                  transform: showGrid ? "translateY(0)" : "translateY(24px)",
                  transition: prefersReducedMotion
                    ? "none"
                    : `opacity 300ms ease-out, transform 300ms ease-out`,
                  transitionDelay: showGrid ? `${delays[index] ?? 0}ms` : "0ms",
                }}
              >
                <div className="p-8 h-full flex flex-col">
                  {/* Icon with Steel Blue Accent */}
                  <div className="w-14 h-14 rounded-lg bg-steel-blue/10 flex items-center justify-center mb-6 group-hover:bg-steel-blue/20 transition-colors hover-scale-icon">
                    <Icon className="w-7 h-7 text-steel-blue" />
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <h3 className="text-xl md:text-2xl font-bold mb-4 text-foreground leading-tight">
                      {item.title}
                    </h3>
                    
                    <p className="text-base text-muted-foreground mb-6 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>

                  {/* Stats Badge */}
                  <div className="pt-6 border-t border-border">
                    <div className="inline-flex items-center gap-2 text-sm font-semibold text-steel-blue">
                      {item.stats}
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
        )}

        {/* Bottom CTA Section */}
        <div className="max-w-4xl mx-auto mt-16">
          <Card className="border-primary/20 bg-background">
            <div className="p-8 lg:p-12 text-center">
              <h3 className="text-2xl md:text-3xl font-bold mb-4 text-foreground">
                Ready to Start Your Project?
              </h3>
              <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                Get a detailed proposal for your construction project with transparent pricing and comprehensive scope documentation.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" variant="primary" className="min-w-[200px]">
                  <Link to="/contact">Request a Proposal</Link>
                </Button>
                <Button asChild size="lg" variant="secondary" className="min-w-[200px]">
                  <Link to="/projects">View Portfolio</Link>
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
