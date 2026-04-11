import { useRef, useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useScrollFadeIn } from "@/hooks/useScrollFadeIn";
import { useReducedMotion } from "@/hooks/useReducedMotion";

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

  const stickyWrapperRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [scrollX, setScrollX] = useState(0);
  const rafRef = useRef<number>(0);

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
      if (pool.length <= 4) return pool;
      return shuffleArray(pool).slice(0, 4);
    },
    staleTime: 0,
    gcTime: 0,
  });

  const cardCount = projects?.length ?? 0;

  // Scroll-driven horizontal movement (desktop only)
  const handleScroll = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      const wrapper = stickyWrapperRef.current;
      if (!wrapper || window.innerWidth < 768) {
        setScrollX(0);
        return;
      }
      const rect = wrapper.getBoundingClientRect();
      const wrapperHeight = wrapper.offsetHeight;
      const viewportH = window.innerHeight;
      // progress: 0 when top of wrapper hits top of viewport, 1 when bottom hits bottom
      const scrollableDistance = wrapperHeight - viewportH;
      if (scrollableDistance <= 0) {
        setScrollX(0);
        return;
      }
      const rawProgress = -rect.top / scrollableDistance;
      const progress = Math.max(0, Math.min(1, rawProgress));
      setScrollX(progress);
    });
  }, []);

  useEffect(() => {
    if (rm || cardCount === 0) return;
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [handleScroll, rm, cardCount]);

  if (!projects || projects.length === 0) return null;

  // Total horizontal travel = (cardCount - 1) * cardWidth (in vw units, computed as px)
  // Each card is 60vw wide with 2rem gap
  const cardWidthVw = 60;
  const gapRem = 2;

  // The wrapper height creates the scroll distance — more cards = more scroll
  const wrapperHeightVh = 100 + cardCount * 80;

  return (
    <section>
      {/* Header — outside sticky context */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl pt-8 md:pt-12 pb-8">
        <div
          ref={headerRef}
          className="flex flex-col md:flex-row md:items-end md:justify-between gap-4"
          style={{
            opacity: showHeader ? 1 : 0,
            transform: showHeader ? "translateY(0)" : "translateY(24px)",
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

      {/* Mobile: normal vertical stack */}
      <div className="md:hidden px-4 pb-16 space-y-6">
        {projects.map((project) => (
          <Link key={project.id} to={`/projects/${project.slug}`} className="group block">
            <div className="rounded-[var(--radius-lg)] overflow-hidden bg-card border border-border shadow-sm">
              <div className="aspect-[16/10] overflow-hidden bg-muted">
                {project.featured_image ? (
                  <img
                    src={project.featured_image}
                    alt={project.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-3xl font-bold text-muted-foreground/30">AGC</span>
                  </div>
                )}
              </div>
              <div className="p-5">
                {project.category && (
                  <span className="text-xs font-medium text-accent uppercase tracking-wider mb-1 block">
                    {project.category}
                  </span>
                )}
                <h3 className="text-lg font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">
                  {project.title}
                </h3>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {project.location || project.summary || "View project details"}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Desktop: pinned horizontal scroll */}
      <div
        ref={stickyWrapperRef}
        className="hidden md:block relative"
        style={{ height: rm ? "auto" : `${wrapperHeightVh}vh` }}
      >
        <div
          className="sticky top-0 h-screen overflow-hidden flex items-center"
          style={rm ? { position: "relative", height: "auto", padding: "2rem 0" } : undefined}
        >
          <div
            ref={trackRef}
            className="flex items-center gap-8 pl-[20vw]"
            style={
              rm
                ? { flexWrap: "wrap", gap: "2rem", paddingLeft: "2rem", paddingRight: "2rem" }
                : {
                    transform: `translateX(-${scrollX * (cardCount - 1) * (cardWidthVw + (gapRem * 16 / window.innerWidth) * 100)}vw)`,
                    willChange: "transform",
                  }
            }
          >
            {projects.map((project, index) => {
              // Each card fades in based on scroll proximity
              const cardProgress = cardCount > 1 ? index / (cardCount - 1) : 0;
              const distFromScroll = Math.abs(scrollX - cardProgress);
              const cardOpacity = rm ? 1 : Math.max(0.4, 1 - distFromScroll * 1.5);
              const cardScale = rm ? 1 : 0.92 + 0.08 * Math.max(0, 1 - distFromScroll * 2);

              return (
                <Link
                  key={project.id}
                  to={`/projects/${project.slug}`}
                  className="group flex-shrink-0"
                  style={{
                    width: rm ? "calc(33.333% - 1.5rem)" : "60vw",
                    opacity: cardOpacity,
                    transform: `scale(${cardScale})`,
                    transition: rm ? "none" : "opacity 200ms ease-out, transform 200ms ease-out",
                  }}
                >
                  <div className="rounded-[var(--radius-lg)] overflow-hidden bg-card border border-border shadow-lg h-[70vh] relative">
                    {/* Image — 70% */}
                    <div className="absolute inset-0 h-[70%] overflow-hidden bg-muted">
                      {project.featured_image ? (
                        <img
                          src={project.featured_image}
                          alt={project.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="text-5xl font-bold text-muted-foreground/20">AGC</span>
                        </div>
                      )}
                    </div>
                    {/* Text overlay — bottom 30% */}
                    <div className="absolute bottom-0 left-0 right-0 h-[30%] bg-gradient-to-t from-card via-card to-card/80 p-8 flex flex-col justify-center">
                      {project.category && (
                        <span className="text-xs font-medium text-accent uppercase tracking-wider mb-2 block">
                          {project.category}
                        </span>
                      )}
                      <h3 className="text-2xl lg:text-3xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                        {project.title}
                      </h3>
                      <p className="text-base text-muted-foreground line-clamp-2 max-w-lg">
                        {project.summary || project.location || "View project details"}
                      </p>
                      <span className="inline-flex items-center gap-2 text-sm font-semibold text-primary mt-3 group-hover:gap-3 transition-all">
                        View project <ArrowRight className="w-4 h-4" />
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
