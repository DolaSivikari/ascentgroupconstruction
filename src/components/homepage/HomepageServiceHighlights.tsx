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
} from "lucide-react";
import { GRID } from "@/design-system/layouts";
import { useScrollFadeIn } from "@/hooks/useScrollFadeIn";
import { useStaggerAnimation } from "@/hooks/useStaggerAnimation";
import { useReducedMotion } from "@/hooks/useReducedMotion";

const services = [
  {
    icon: Building2,
    title: "Façade Remediation",
    description: "Sealant replacement, panel repairs, and full building envelope restoration.",
    href: "/services/facade-remediation",
  },
  {
    icon: Layers,
    title: "EIFS & Stucco Systems",
    description: "Energy-efficient insulated finish systems and traditional stucco repair.",
    href: "/services/eifs-stucco",
  },
  {
    icon: Hammer,
    title: "Masonry Restoration",
    description: "Repointing, tuckpointing, and structural stabilisation for brick and stone.",
    href: "/services/masonry-restoration",
  },
  {
    icon: Droplets,
    title: "Waterproofing",
    description: "Below-grade, foundation, and deck waterproofing to stop water at the source.",
    href: "/services/waterproofing",
  },
  {
    icon: Grid3x3,
    title: "Metal Cladding",
    description: "Aluminum, steel, and composite panel installation and repairs.",
    href: "/services/metal-cladding",
  },
  {
    icon: Car,
    title: "Parking Garage Restoration",
    description: "Concrete repair, traffic coatings, and structural rehab for parkades.",
    href: "/services/parking-garage-restoration",
  },
  {
    icon: LayoutDashboard,
    title: "Interior Buildouts",
    description: "Tenant improvements, suite builds, drywall, and finishing trades.",
    href: "/services/interior-buildouts",
  },
  {
    icon: Paintbrush,
    title: "Commercial Painting",
    description: "Commercial, condo, and multi-unit painting with premium coatings.",
    href: "/services/commercial-painting",
  },
];

export const HomepageServiceHighlights = () => {
  const prefersReducedMotion = useReducedMotion();
  const { ref: headerRef, isVisible: headerVisible, skipAnimation: headerSkip } =
    useScrollFadeIn();
  const { ref: gridRef, isVisible: gridVisible, skipAnimation: gridSkip } =
    useScrollFadeIn({ threshold: 0.05 });
  const delays = useStaggerAnimation({ itemCount: services.length, staggerDelay: 50 });

  const showHeader = headerVisible || headerSkip || prefersReducedMotion;
  const showGrid = gridVisible || gridSkip || prefersReducedMotion;

  return (
    <section className="py-20 md:py-28 bg-background">
      <div className="container mx-auto px-6 md:px-8 lg:px-12 max-w-7xl">
        {/* Header */}
        <div
          ref={headerRef}
          className="max-w-3xl mb-14"
          style={{
            opacity: showHeader ? 1 : 0,
            transform: showHeader ? "translateY(0)" : "translateY(24px)",
            transition: prefersReducedMotion
              ? "none"
              : "opacity 300ms ease-out, transform 300ms ease-out",
          }}
        >
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-4">
            Our Services
          </p>
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-5 leading-tight tracking-tight">
            Specialty Trades, Self-Performed
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Eight core service lines delivered by our own trained crews — no sub-contractor
            hand-offs, full accountability on every project.
          </p>
        </div>

        {/* Service cards */}
        <div ref={gridRef} className={GRID.cards4}>
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <Link
                key={index}
                to={service.href}
                className="group block p-6 rounded-xl border border-border/60 bg-card hover:border-primary/40 hover:shadow-md transition-all duration-300"
                style={{
                  opacity: showGrid ? 1 : 0,
                  transform: showGrid ? "translateY(0)" : "translateY(24px)",
                  transition: prefersReducedMotion
                    ? "none"
                    : `opacity 300ms ease-out, transform 300ms ease-out`,
                  transitionDelay: showGrid ? `${delays[index] ?? 0}ms` : "0ms",
                }}
              >
                <div className="w-11 h-11 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors duration-300">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="text-base font-bold text-foreground mb-2 leading-snug">
                  {service.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {service.description}
                </p>
              </Link>
            );
          })}
        </div>

        {/* Footer link */}
        <div className="mt-12 text-center">
          <Link
            to="/services"
            className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary/80 transition-colors duration-200"
          >
            View all services
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};
