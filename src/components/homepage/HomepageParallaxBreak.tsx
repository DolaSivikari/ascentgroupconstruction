import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useEffect, useRef } from "react";
import heroImage from "@/assets/heroes/hero-construction-management.jpg";

/**
 * Full-bleed parallax image break with bold mission statement.
 * Background image translates upward as user scrolls down for a true parallax effect.
 */
export const HomepageParallaxBreak = () => {
  const rm = useReducedMotion();
  const sectionRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (rm) return;

    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (sectionRef.current && bgRef.current) {
            const rect = sectionRef.current.getBoundingClientRect();
            const windowH = window.innerHeight;
            if (rect.bottom > 0 && rect.top < windowH) {
              const progress = (windowH - rect.top) / (windowH + rect.height);
              bgRef.current.style.transform = `translateY(-${progress * 160}px)`;
            }
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [rm]);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden"
      aria-label="Company mission statement"
    >
      {/* Background layer — parallax scroll */}
      <div
        ref={bgRef}
        className="absolute left-0 right-0 bg-cover bg-center will-change-transform"
        style={{
          backgroundImage: `url('${heroImage}')`,
          transform: rm ? "none" : "translateY(0px)",
          top: "-80px",
          bottom: "-80px",
        }}
      />
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-primary/60" />

      {/* Content */}
      <div className="relative z-10 py-24 md:py-36 lg:py-44 text-center px-6">
        <p className="text-xs md:text-sm font-semibold uppercase tracking-[0.25em] text-primary-foreground/60 mb-4">
          Our Commitment
        </p>
        <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-primary-foreground leading-tight max-w-4xl mx-auto mb-6 tracking-tight">
          We Protect &amp; Improve the Buildings People Depend On
        </h2>
        <p className="text-base md:text-lg text-primary-foreground/80 max-w-2xl mx-auto leading-relaxed">
          From envelope restoration to interior finishing — self-performed trades,
          accountable delivery, and documentation you can hand to your client.
        </p>
      </div>
    </section>
  );
};
