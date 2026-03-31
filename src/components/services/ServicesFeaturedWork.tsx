import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Section } from "@/components/sections/Section";
import { Card } from "@/design-system/components/Card";
import { TYPOGRAPHY_STYLES } from "@/design-system/constants";
import { ArrowRight, MapPin } from "lucide-react";

export const ServicesFeaturedWork = () => {
  const { data: projects } = useQuery({
    queryKey: ["services-featured-projects"],
    queryFn: async () => {
      // Tier 1: featured + published
      const { data: featured } = await supabase
        .from("projects")
        .select("id, title, slug, category, location, featured_image, summary")
        .eq("publish_state", "published")
        .eq("featured", true)
        .order("created_at", { ascending: false })
        .limit(2);

      if (featured && featured.length >= 2) return featured;

      // Tier 2: backfill with latest published
      const { data: latest } = await supabase
        .from("projects")
        .select("id, title, slug, category, location, featured_image, summary")
        .eq("publish_state", "published")
        .order("created_at", { ascending: false })
        .limit(2);

      return latest ?? [];
    },
  });

  if (!projects || projects.length === 0) return null;

  return (
    <Section size="major" className="bg-muted/30">
      <div className="mb-12">
        <p className={`${TYPOGRAPHY_STYLES.label} text-accent mb-3`}>Recent Work</p>
        <h2 className={`${TYPOGRAPHY_STYLES.sectionTitle} text-foreground mb-4`}>
          Featured Projects
        </h2>
        <p className={`${TYPOGRAPHY_STYLES.bodyDefault} text-muted-foreground max-w-3xl`}>
          Representative project work across our service categories.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {projects.map((project) => (
          <Link key={project.id} to={`/projects/${project.slug}`} className="group">
            <Card variant="elevated" hover className="overflow-hidden h-full flex flex-col p-0">
              <div className="aspect-[16/9] overflow-hidden bg-muted">
                {project.featured_image ? (
                  <img
                    src={project.featured_image}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-3xl font-bold text-muted-foreground/30">AGC</span>
                  </div>
                )}
              </div>
              <div className="p-6 flex flex-col flex-1">
                <div className="flex items-center gap-2 mb-2">
                  {project.category && (
                    <span className="text-xs font-medium text-accent uppercase tracking-wider">
                      {project.category}
                    </span>
                  )}
                  {project.location && (
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <MapPin className="w-3 h-3" /> {project.location}
                    </span>
                  )}
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                  {project.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed flex-1 line-clamp-2">
                  {project.summary || project.category || "View project details"}
                </p>
                <div className="flex items-center text-sm font-medium text-primary group-hover:text-accent transition-colors mt-4">
                  View project <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </Section>
  );
};
