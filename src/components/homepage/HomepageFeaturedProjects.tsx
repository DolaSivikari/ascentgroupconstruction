import { Link } from "react-router-dom";
import { ArrowRight, MapPin } from "lucide-react";
import { GRID } from "@/design-system/layouts";
import { useScrollFadeIn } from "@/hooks/useScrollFadeIn";
import { useStaggerAnimation } from "@/hooks/useStaggerAnimation";
import { useReducedMotion } from "@/hooks/useReducedMotion";

// Static featured projects — replace with a Supabase query when project data is available
const featuredProjects = [
  {
    title: "High-Rise Façade Remediation",
    location: "North York, ON",
    category: "Façade Remediation",
    description:
      "Full building envelope restoration on a 22-storey residential tower — sealant replacement, EIFS repairs, and window perimeter caulking across all elevations.",
    image: "/hero-poster-1.webp",
    href: "/projects",
  },
  {
    title: "Underground Parking Garage Restoration",
    location: "Mississauga, ON",
    category: "Parking Garage",
    description:
      "Structural concrete repair, traffic membrane coating, and drainage system upgrades for a 400-stall commercial parkade, completed in occupied building conditions.",
    image: "/hero-poster-1.webp",
    href: "/projects",
  },
  {
    title: "Commercial Masonry & Waterproofing",
    location: "Downtown Toronto, ON",
    category: "Masonry Restoration",
    description:
      "Heritage brick repointing, lintel replacement, and below-grade waterproofing on a 1960s-era office building — fully compliant with heritage guidelines.",
    image: "/hero-poster-1.webp",
    href: "/projects",
  },
];

export const HomepageFeaturedProjects = () => {
  const prefersReducedMotion = useReducedMotion();
  const { ref: headerRef, isVisible: headerVisible, skipAnimation: headerSkip } =
    useScrollFadeIn();
  const { ref: gridRef, isVisible: gridVisible, skipAnimation: gridSkip } =
    useScrollFadeIn({ threshold: 0.1 });
  const delays = useStaggerAnimation({ itemCount: featuredProjects.length, staggerDelay: 120 });

  const showHeader = headerVisible || headerSkip || prefersReducedMotion;
  const showGrid = gridVisible || gridSkip || prefersReducedMotion;

  return (
    <section className="py-20 md:py-28 bg-muted/30">
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
            Featured Projects
          </p>
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-5 leading-tight tracking-tight">
            Work We're Proud Of
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            A sample of recent building envelope and restoration projects across Ontario and the GTA.
          </p>
        </div>

        {/* Project cards */}
        <div ref={gridRef} className={GRID.cards3}>
          {featuredProjects.map((project, index) => (
            <Link
              key={index}
              to={project.href}
              className="group block rounded-xl overflow-hidden border border-border/60 bg-card hover:shadow-lg transition-all duration-300"
              style={{
                opacity: showGrid ? 1 : 0,
                transform: showGrid ? "translateY(0)" : "translateY(24px)",
                transition: prefersReducedMotion
                  ? "none"
                  : `opacity 300ms ease-out, transform 300ms ease-out`,
                transitionDelay: showGrid ? `${delays[index] ?? 0}ms` : "0ms",
              }}
            >
              {/* Image with subtle scale reveal */}
              <div className="overflow-hidden aspect-[16/9] bg-muted">
                <img
                  src={project.image}
                  alt={project.title}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-500 ease-out"
                  style={{
                    transform: showGrid ? "scale(1)" : "scale(1.04)",
                    transition: prefersReducedMotion
                      ? "none"
                      : `transform 500ms ease-out`,
                    transitionDelay: showGrid ? `${(delays[index] ?? 0) + 100}ms` : "0ms",
                  }}
                />
              </div>

              {/* Content */}
              <div className="p-6">
                <span className="inline-block text-xs font-semibold text-primary uppercase tracking-wider mb-3">
                  {project.category}
                </span>
                <h3 className="text-lg font-bold text-foreground mb-2 leading-snug group-hover:text-primary transition-colors duration-200">
                  {project.title}
                </h3>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-3">
                  <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                  {project.location}
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {project.description}
                </p>
              </div>
            </Link>
          ))}
        </div>

        {/* Footer link */}
        <div className="mt-12 text-center">
          <Link
            to="/projects"
            className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary/80 transition-colors duration-200"
          >
            View all projects
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};
