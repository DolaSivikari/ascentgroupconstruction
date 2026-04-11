import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useRef, useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useIsMobile } from "@/hooks/use-mobile";

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
  const isMobile = useIsMobile();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);
  const [headerVisible, setHeaderVisible] = useState(false);

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

      const seen = new Set<string>();
      const pool: typeof featured = [];
      for (const p of [...(featured ?? []), ...(latest ?? [])]) {
        if (!seen.has(p.id)) {
          seen.add(p.id);
          pool.push(p);
        }
      }

      if (pool.length <= 6) return pool;
      return shuffleArray(pool).slice(0, 6);
    },
    staleTime: 0,
    gcTime: 0,
  });

  // Header fade-in on mount
  useEffect(() => {
    const t = setTimeout(() => setHeaderVisible(true), 100);
    return () => clearTimeout(t);
  }, []);

  // Sticky horizontal scroll logic (desktop only, no reduced motion)
  const useSticky = !isMobile && !rm;

  const onScroll = useCallback(() => {
    if (!useSticky || !wrapperRef.current || !trackRef.current) return;

    rafRef.current = requestAnimationFrame(() => {
      const wrapper = wrapperRef.current!;
      const track = trackRef.current!;
      const rect = wrapper.getBoundingClientRect();
      const wrapperHeight = wrapper.offsetHeight;
      const viewportHeight = window.innerHeight;
      const scrollableDistance = wrapperHeight - viewportHeight;

      if (scrollableDistance <= 0) return;

      // How far we've scrolled into the wrapper
      const scrolled = -rect.top;
      const progress = Math.max(0, Math.min(1, scrolled / scrollableDistance));

      // Total track width minus viewport
      const trackWidth = track.scrollWidth;
      const maxTranslate = trackWidth - window.innerWidth + 64; // 64px for right padding

      track.style.transform = `translateX(-${progress * Math.max(0, maxTranslate)}px)`;
    });
  }, [useSticky]);

  useEffect(() => {
    if (!useSticky) return;
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [onScroll, useSticky]);

  if (!projects || projects.length === 0) return null;

  const cardCount = projects.length;
  // Each card is 60vw + gap, wrapper height scales with card count
  const wrapperHeight = useSticky ? `${Math.max(200, cardCount * 80)}vh` : "auto";

  return (
    <section>
      {/* Header — always visible above the sticky area */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl pt-8 md:pt-12">
        <div
          className="flex flex-col md:flex-row md:items-end md:justify-between mb-8 gap-4"
          style={{
            opacity: headerVisible ? 1 : 0,
            transform: headerVisible ? "translateY(0)" : "translateY(24px)",
            transition: rm ? "none" : "opacity 300ms ease-out, transform 300ms ease-out",
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
      </div>

      {/* Desktop: sticky horizontal scroll */}
      {useSticky ? (
        <div ref={wrapperRef} className="relative" style={{ height: wrapperHeight }}>
          <div className="sticky top-0 h-screen overflow-hidden flex items-center">
            <div
              ref={trackRef}
              className="flex gap-8 pl-8 lg:pl-16 will-change-transform"
              style={{ transform: "translateX(0)" }}
            >
              {projects.map((project) => (
                <ProjectShowcaseCard key={project.id} project={project} />
              ))}
              {/* End spacer so last card can fully enter viewport */}
              <div className="flex-shrink-0 w-16" />
            </div>
          </div>
        </div>
      ) : (
        /* Mobile / reduced motion: swipeable row */
        <div className="overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-8">
          <div className="flex gap-4 px-4 sm:px-6">
            {projects.map((project) => (
              <div key={project.id} className="w-[85vw] sm:w-[70vw] flex-shrink-0 snap-center">
                <ProjectShowcaseCard project={project} />
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
};

interface ProjectData {
  id: string;
  title: string;
  slug: string;
  category: string | null;
  location: string | null;
  featured_image: string | null;
  summary: string | null;
}

function ProjectShowcaseCard({ project }: { project: ProjectData }) {
  return (
    <Link
      to={`/projects/${project.slug}`}
      className="group block flex-shrink-0 w-[85vw] sm:w-[70vw] lg:w-[60vw] rounded-2xl overflow-hidden relative"
      style={{ height: "70vh", minHeight: "400px", maxHeight: "700px" }}
    >
      {/* Image */}
      <div className="absolute inset-0">
        {project.featured_image ? (
          <img
            src={project.featured_image}
            alt={project.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full bg-muted flex items-center justify-center">
            <span className="text-4xl font-bold text-muted-foreground/20">AGC</span>
          </div>
        )}
      </div>

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

      {/* Category badge */}
      {project.category && (
        <div className="absolute top-5 left-5">
          <span className="inline-block text-xs font-semibold uppercase tracking-wider bg-primary/90 text-primary-foreground px-3 py-1.5 rounded-full backdrop-blur-sm">
            {project.category}
          </span>
        </div>
      )}

      {/* Bottom text */}
      <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
        <h3 className="text-xl md:text-2xl lg:text-3xl font-bold text-white mb-2 line-clamp-2">
          {project.title}
        </h3>
        <p className="text-sm md:text-base text-white/70 line-clamp-2">
          {project.location || project.summary || "View project details"}
        </p>
        <div className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-white/90 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
          View project
          <ArrowRight className="w-4 h-4" />
        </div>
      </div>
    </Link>
  );
}
