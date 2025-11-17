import { useEffect, useState } from "react";

interface UseParallaxOptions {
  /** Speed multiplier (0 = no movement, 1 = normal scroll) */
  speed?: number;
  /** Reverse direction */
  reverse?: boolean;
  /** Enable parallax only within viewport */
  enableInViewport?: boolean;
}

/**
 * Hook for creating parallax scroll effects
 * @param options - Parallax configuration
 * @returns Current parallax offset value
 * 
 * @example
 * ```tsx
 * const offset = useParallax({ speed: 0.5 });
 * 
 * return (
 *   <div style={{ transform: `translateY(${offset}px)` }}>
 *     Parallax content
 *   </div>
 * );
 * ```
 */
export const useParallax = (options: UseParallaxOptions | number = {}) => {
  // Support legacy number parameter
  const config: UseParallaxOptions = typeof options === "number" 
    ? { speed: options }
    : options;
    
  const { speed = 0.5, reverse = false, enableInViewport = false } = config;
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollY = window.scrollY;
          const multiplier = reverse ? -1 : 1;
          
          if (enableInViewport) {
            // Only apply parallax when element would be in viewport
            const viewportHeight = window.innerHeight;
            if (scrollY < viewportHeight * 2) {
              setOffset(scrollY * speed * multiplier);
            }
          } else {
            setOffset(scrollY * speed * multiplier);
          }
          
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Initial calculation
    
    return () => window.removeEventListener("scroll", handleScroll);
  }, [speed, reverse, enableInViewport]);

  return offset;
};
