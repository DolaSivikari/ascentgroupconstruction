import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/design-system/components/Card";
import { LAYOUT, TYPOGRAPHY_STYLES } from "@/design-system/constants";

const HomepageFeaturedProjects = () => {
  const { data: projects } = useQuery({
    queryKey: ["homepage-featured-projects"],
    queryFn: async () => {
      // Tier 1: featured + published
      const { data: featured } = await supabase
        .from("projects")
        .select("id, title, slug, featured_image, category, location")
        .eq("publish_state", "published")
        .eq("featured", true)
        .order("created_at", { ascending: false })
        .limit(3);

      if (featured && featured.length >= 2) return featured.slice(0, 3);

      // Tier 2: backfill with latest published
      const { data: latest } = await supabase
        .from("projects")
        .select("id, title, slug, featured_image, category, location")
        .eq("publish_state", "published")
        .order("created_at", { ascending: false })
        .limit(3);

      return latest ?? [];
    },
    staleTime: 5 * 60 * 1000,
  });

  if (!projects || projects.length === 0) return null;

  return (
    <section className={`${LAYOUT.sectionSpacing.major} bg-muted/30`}>
      <div className={`container mx-auto ${LAYOUT.containerPadding} ${LAYOUT.maxWidth}`}>
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12 gap-4">
          <div>
            <p className={`${TYPOGRAPHY_STYLES.label} text-accent mb-3`}>Recent Work</p>
            <h2 className={`${TYPOGRAPHY_STYLES.sectionTitle} text-foreground mb-2`}>
              Featured Projects
            </h2>
            <p className={`${TYPOGRAPHY_STYLES.bodyDefault} text-muted-foreground max-w-2xl`}>
              Selected projects demonstrating our scope of work across Ontario.
            </p>
          </div>
          <Link
            to="/projects"
            className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-accent transition-colors whitespace-nowrap"
          >
            View all projects <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project) => (
            <Link key={project.id} to={`/projects/${project.slug}`} className="group">
              <Card variant="elevated" hover className="overflow-hidden h-full flex flex-col">
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

export default HomepageFeaturedProjects;
