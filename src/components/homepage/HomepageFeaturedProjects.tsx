import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/design-system/components/Card";
import { useScrollFadeIn } from "@/hooks/useScrollFadeIn";
import { useStaggerAnimation } from "@/hooks/useStaggerAnimation";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export const HomepageFeaturedProjects = () => {
  const prefersReducedMotion = useReducedMotion();
  const { ref: headerRef, isVisible: headerVisible, skipAnimation: headerSkip } =
    useScrollFadeIn();
  const { ref: gridRef, isVisible: gridVisible, skipAnimation: gridSkip } =
    useScrollFadeIn({ threshold: 0.1 });

  const { data: projects } = useQuery({
    queryKey: ["homepage-featured-projects"],
    queryFn: async () => {
      const { data: featured } = await supabase
        .from("projects")
        .select("id, title, slug, category, location, featured_image, summary")
        .eq("publish_state", "published")
        .eq("featured", true)
        .order("created_at", { ascending: false })
        .limit(3);

      if (featured && featured.length >= 3) return featured;

      const { data: latest } = await supabase
        .from("projects")
        .select("id, title, slug, category, location, featured_image, summary")
        .eq("publish_state", "published")
        .order("created_at", { ascending: false })
        .limit(3);

      return latest ?? [];
    },
  });

  const delays = useStaggerAnimation({ itemCount: projects?.length ?? 3, staggerDelay: 120 });

  const showHeader = headerVisible || headerSkip || prefersReducedMotion;
  const showGrid = gridVisible || gridSkip || prefersReducedMotion;

  if (!projects || projects.length === 0) return null;

  return (
    <section className="py-20 md:py-28 lg:py-32 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        {/* Header */}
        <div
          ref={headerRef}
          className="flex flex-col md:flex-row md:items-end md:justify-between mb-12 gap-4"
          style={{
            opacity: showHeader ? 1 : 0,
            transform: showHeader ? "translateY(0)" : "translateY(24px)",
            transition: prefersReducedMotion
              ? "none"
              : "opacity 300ms ease-out, transform 300ms ease-out",
          }}
        >
          <div>
            <p className="text-sm font-medium uppercase tracking-wider text-accent mb-3">
              Recent Work
            </p>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-2">
              Featured Projects
            </h2>
            <p className="text-base md:text-lg leading-relaxed text-muted-foreground max-w-2xl">
              Selected projects demonstrating our scope of work across Ontario.
            </p>
          </div>
          <Link
            to="/projects"
            className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-accent transition-colors whitespace-nowrap"
          >
            View all projects
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </Link>
        </div>

        {/* Project cards */}
        <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <Link
              key={project.id}
              to={`/projects/${project.slug}`}
              className="group"
              style={{
                opacity: showGrid ? 1 : 0,
                transform: showGrid ? "translateY(0)" : "translateY(24px)",
                transition: prefersReducedMotion
                  ? "none"
                  : `opacity 300ms ease-out, transform 300ms ease-out`,
                transitionDelay: showGrid ? `${delays[index] ?? 0}ms` : "0ms",
              }}
            >
              <Card variant="elevated" hover className="overflow-hidden h-full flex flex-col p-0">
                {project.featured_image && (
                  <div className="aspect-[16/10] overflow-hidden">
                    <img
                      src={project.featured_image}
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                  </div>
                )}
                <div className="p-6 flex flex-col flex-1">
                  {project.category && (
                    <span className="text-xs font-medium text-accent uppercase tracking-wider mb-2">
                      {project.category}
                    </span>
                  )}
                  <h3 className="text-lg font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">
                    {project.title}
                  </h3>
                  {project.location && (
                    <p className="text-sm text-muted-foreground">{project.location}</p>
                  )}
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};
