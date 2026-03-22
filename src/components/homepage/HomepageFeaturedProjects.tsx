import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/design-system/components/Card";
import { useScrollFadeIn } from "@/hooks/useScrollFadeIn";
import { useReducedMotion } from "@/hooks/useReducedMotion";

const springHover = { type: "spring" as const, stiffness: 300, damping: 20 };

function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export const HomepageFeaturedProjects = () => {
  const rm = useReducedMotion();
  const { ref: headerRef, isVisible: headerVisible, skipAnimation: headerSkip } =
    useScrollFadeIn();

  const showHeader = headerVisible || headerSkip || rm;

  const { data: projects } = useQuery({
    queryKey: ["homepage-featured-projects"],
    queryFn: async () => {
      const cols = "id, title, slug, category, location, featured_image, summary";

      const { data: featured } = await supabase
        .from("projects")
        .select(cols)
        .eq("publish_state", "published")
        .eq("featured", true)
        .order("created_at", { ascending: false })
        .limit(12);

      const { data: latest } = await supabase
        .from("projects")
        .select(cols)
        .eq("publish_state", "published")
        .order("created_at", { ascending: false })
        .limit(12);

      // Merge featured first, then backfill with latest (deduplicated)
      const seen = new Set<string>();
      const pool: typeof featured = [];
      for (const p of [...(featured ?? []), ...(latest ?? [])]) {
        if (!seen.has(p.id)) {
          seen.add(p.id);
          pool.push(p);
        }
      }

      if (pool.length <= 3) return pool;
      return shuffleArray(pool).slice(0, 3);
    },
    staleTime: 0,
    gcTime: 0,
  });

  if (!projects || projects.length === 0) return null;

  return (
    <section className="pt-8 md:pt-12 pb-16 md:pb-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        {/* Header */}
        <div
          ref={headerRef}
          className="flex flex-col md:flex-row md:items-end md:justify-between mb-12 gap-4"
          style={{
            opacity: showHeader ? 1 : 0,
            transform: showHeader ? "translateY(0)" : "translateY(24px)",
            transition: rm
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={rm ? false : { opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={rm ? { duration: 0 } : { delay: index * 0.08, duration: 0.4 }}
              whileHover={rm ? {} : { y: -6, transition: springHover }}
            >
              <Link to={`/projects/${project.slug}`} className="group">
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
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
