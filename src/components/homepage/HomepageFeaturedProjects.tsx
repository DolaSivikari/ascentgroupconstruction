import { TYPOGRAPHY_STYLES } from "@/design-system/constants";
import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, MapPin, Building2, Calendar } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { StaggerContainer } from "@/components/animations/StaggerContainer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/ui/Button";
import { ProjectFeaturedImage } from "@/components/projects/ProjectFeaturedImage";

import { GRID } from "@/design-system/layouts";

function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export const HomepageFeaturedProjects = () => {
  // Per-mount random seed so each visit/refresh fetches a fresh sample
  const [mountId] = useState(() => Math.random().toString(36).slice(2));

  const { data: projects, isLoading } = useQuery({
    queryKey: ["homepage-featured-projects", mountId],
    queryFn: async () => {
      const cols = "id, title, slug, category, location, featured_image, summary, year, featured";
      // Fetch ALL published projects (small payload)
      const { data: all } = await supabase
        .from("projects")
        .select(cols)
        .eq("publish_state", "published");

      const pool = all ?? [];
      if (pool.length === 0) return [];

      // Prefer featured first, backfill with non-featured
      const featured = pool.filter((p: any) => p.featured === true);
      const nonFeatured = pool.filter((p: any) => p.featured !== true);

      const shuffledFeatured = shuffleArray(featured);
      const shuffledRest = shuffleArray(nonFeatured);

      const combined = [...shuffledFeatured, ...shuffledRest];
      return combined.slice(0, 4);
    },
    staleTime: 0,
    gcTime: 0,
    refetchOnMount: "always",
  });

  if (isLoading) {
    return (
      <section className="py-16 md:py-20 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <p className="text-muted-foreground">Loading projects...</p>
          </div>
        </div>
      </section>
    );
  }

  if (!projects || projects.length === 0) return null;

  return (
    <section className="py-16 md:py-20 lg:py-24">
      <div className="container mx-auto px-4 max-w-6xl">
        <ScrollReveal direction="up">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12">
            <div>
              <p className="text-sm font-medium uppercase tracking-wider text-accent mb-3">
                Recent Work
              </p>
              <h2 className="text-3xl md:text-4xl font-bold mb-2 text-foreground">
                Featured Projects
              </h2>
              <p className="text-base md:text-lg text-muted-foreground max-w-2xl">
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
        </ScrollReveal>

        <StaggerContainer type="fade">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {projects.map((project, index) => (
              <ScrollReveal
                key={project.id}
                direction={index % 3 === 0 ? "left" : index % 3 === 1 ? "up" : "right"}
                delay={index * 100}
              >
                <Card variant="interactive" className="group overflow-hidden hover-subtle h-full flex flex-col">
                  <Link to={`/projects/${project.slug}`} className="block">
                    <ProjectFeaturedImage
                      src={project.featured_image}
                      alt={project.title}
                      variant="card"
                    />
                  </Link>
                  <CardContent className="p-5 flex-1 flex flex-col">
                    <div className="flex items-center gap-2 mb-3 flex-wrap">
                      {project.location && (
                        <Badge variant="secondary" size="sm" icon={MapPin}>
                          {project.location}
                        </Badge>
                      )}
                      {project.category && (
                        <Badge variant="primary" size="sm" icon={Building2}>
                          {project.category}
                        </Badge>
                      )}
                      {project.year && (
                        <Badge variant="info" size="sm" icon={Calendar}>
                          {project.year}
                        </Badge>
                      )}
                    </div>
                    <Link to={`/projects/${project.slug}`}>
                      <h3 className={`${TYPOGRAPHY_STYLES.cardTitle} mb-2 hover:text-primary link-hover line-clamp-2`}>
                        {project.title}
                      </h3>
                    </Link>
                    {project.summary && (
                      <p className={`${TYPOGRAPHY_STYLES.cardBody} text-muted-foreground line-clamp-3 flex-1`}>{project.summary}</p>
                    )}
                  </CardContent>
                </Card>
              </ScrollReveal>
            ))}
          </div>
        </StaggerContainer>

        <ScrollReveal direction="up" delay={300}>
          <div className="text-center mt-10">
            <Button size="lg" variant="outline" asChild>
              <Link to="/projects">
                View All Projects <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};
