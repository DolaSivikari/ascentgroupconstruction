import { usePageContent } from "@/hooks/usePageContent";
import contentModule from "@/content/pages/home-parallax";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useEffect, useRef, useState } from "react";

/**
 * Full-bleed parallax image break with bold mission statement.
 * Background image translates upward as user scrolls down for a true parallax effect.
 */
export const HomepageParallaxBreak = () => {
  const c = usePageContent(contentModule);

  const rm = useReducedMotion();
  const sectionRef = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    if (rm) return;

    const MAX_SHIFT = 120; // px per side — symmetric reveal range

    let ticking = false;
    const compute = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const windowH = window.innerHeight;

      // Only calculate when section is in or near viewport
      if (rect.bottom < 0 || rect.top > windowH) return;

      // Normalized progress: 0 when section's top edge first touches viewport bottom,
      // 1 when section's bottom edge exits the viewport top.
      const total = windowH + rect.height;
      const traveled = windowH - rect.top;
      const progress = Math.max(0, Math.min(1, traveled / total));

      // Center offset around 0 so the image reveals symmetrically:
      // entry → image shifted up (top of image visible),
      // exit  → image shifted down (bottom of image revealed).
      const next = (progress - 0.5) * 2 * MAX_SHIFT;
      setOffset(next);
    };

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          compute();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll, { passive: true });
    compute();
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, [rm]);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden"
      aria-label="Company mission statement"
    >
      {/* Background layer — parallax scroll */}
      <div
        className="absolute left-0 right-0 bg-cover bg-center will-change-transform"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1920&q=80')",
          transform: rm ? "none" : `translate3d(0, ${offset}px, 0)`,
          top: "-140px",
          bottom: "-140px",
        }}
      />
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-primary/60" />

      {/* Content */}
      <div className="relative z-10 py-24 md:py-36 lg:py-44 text-center px-6">
        <p className="text-xs md:text-sm font-semibold uppercase tracking-[0.25em] text-primary-foreground/60 mb-4">
          {c.f001}
        </p>
        <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-primary-foreground leading-tight max-w-4xl mx-auto mb-6 tracking-tight">
          {c.f002}
        </h2>
        <p className="text-base md:text-lg text-primary-foreground/80 max-w-2xl mx-auto leading-relaxed">
          {c.f003}
        </p>
      </div>
    </section>
  );
};
