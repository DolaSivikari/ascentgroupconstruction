import { useEffect, useRef, useState } from "react";

interface UseScrollRevealOptions {
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
}

/**
 * Hook for scroll-triggered reveal animations
 * @param options - Intersection Observer options
 * @returns ref to attach to element and isVisible state
 * 
 * @example
 * ```tsx
 * const { ref, isVisible } = useScrollReveal({ threshold: 0.2 });
 * 
 * return (
 *   <div ref={ref} className={`scroll-reveal ${isVisible ? 'is-visible' : ''}`}>
 *     Content will fade in when scrolled into view
 *   </div>
 * );
 * ```
 */
export const useScrollReveal = <T extends HTMLElement = HTMLDivElement>(
  options: UseScrollRevealOptions = {}
) => {
  const {
    threshold = 0.1,
    rootMargin = "0px 0px -100px 0px",
    triggerOnce = true,
  } = options;

  const ref = useRef<T>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [skipAnimation, setSkipAnimation] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    let observer: IntersectionObserver | null = null;
    let rafId = 0;
    let timeoutId: ReturnType<typeof setTimeout> | null = null;
    let firstCallback = true;

    // Use the IntersectionObserver's first synchronous callback to determine
    // initial visibility instead of calling getBoundingClientRect() during
    // React's commit phase (which caused a forced reflow).
    rafId = requestAnimationFrame(() => {
      observer = new IntersectionObserver(
        ([entry]) => {
          if (firstCallback) {
            firstCallback = false;
            if (entry.isIntersecting) {
              // Already in view on mount — show without animating in.
              setSkipAnimation(true);
              setIsVisible(true);
              if (triggerOnce) {
                observer?.unobserve(element);
              }
              return;
            }
          }

          if (entry.isIntersecting) {
            setIsVisible(true);
            if (triggerOnce) {
              observer?.unobserve(element);
            }
          } else if (!triggerOnce) {
            setIsVisible(false);
          }
        },
        { threshold, rootMargin }
      );

      observer.observe(element);
    });

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      if (timeoutId) clearTimeout(timeoutId);
      observer?.disconnect();
    };
  }, [threshold, rootMargin, triggerOnce]);

  return { ref, isVisible, skipAnimation };
};
