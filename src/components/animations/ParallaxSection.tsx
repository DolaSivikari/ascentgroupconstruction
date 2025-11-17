import { ReactNode, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface ParallaxSectionProps {
  children: ReactNode;
  /** Speed multiplier for parallax effect (0 = no movement, 1 = normal scroll) */
  speed?: "slow" | "medium" | "fast" | number;
  /** Custom className for the section */
  className?: string;
}

/**
 * Section wrapper that creates parallax scrolling effect
 * 
 * @example
 * ```tsx
 * <ParallaxSection speed="slow">
 *   <div className="parallax-layer">
 *     Background content (moves slower)
 *   </div>
 * </ParallaxSection>
 * 
 * <ParallaxSection speed="fast">
 *   <div className="parallax-layer">
 *     Foreground content (moves faster)
 *   </div>
 * </ParallaxSection>
 * ```
 */
export const ParallaxSection = ({
  children,
  speed = "medium",
  className,
}: ParallaxSectionProps) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const layerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current || !layerRef.current) return;

      const scrolled = window.scrollY;
      const rect = sectionRef.current.getBoundingClientRect();
      const elementTop = rect.top + scrolled;
      const elementHeight = rect.height;
      const windowHeight = window.innerHeight;

      // Only apply parallax when element is in viewport
      if (scrolled + windowHeight > elementTop && scrolled < elementTop + elementHeight) {
        const scrollPosition = scrolled - elementTop + windowHeight;
        layerRef.current.style.setProperty('--scroll-position', `${scrollPosition}px`);
      }
    };

    let ticking = false;
    const throttledScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", throttledScroll, { passive: true });
    handleScroll(); // Initial calculation

    return () => {
      window.removeEventListener("scroll", throttledScroll);
    };
  }, []);

  const speedClass = typeof speed === "string" 
    ? `parallax-layer-${speed}` 
    : "";

  return (
    <div ref={sectionRef} className={cn("parallax-section", className)}>
      <div
        ref={layerRef}
        className={cn("parallax-layer", speedClass)}
        style={typeof speed === "number" ? {
          transform: `translateY(calc(var(--scroll-position, 0) * ${-speed}))`,
        } : undefined}
      >
        {children}
      </div>
    </div>
  );
};
