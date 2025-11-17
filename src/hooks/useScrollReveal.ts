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

    // Check if element is already in viewport on mount
    const rect = element.getBoundingClientRect();
    const isInViewport = (
      rect.top < window.innerHeight * 0.8 && 
      rect.bottom > 0
    );

    if (isInViewport) {
      // Element already visible - show immediately without animation
      setSkipAnimation(true);
      setIsVisible(true);
      return; // Don't set up observer
    }

    // Element not in viewport - set up normal scroll animation with slight delay
    const timeoutId = setTimeout(() => {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            if (triggerOnce) {
              observer.unobserve(element);
            }
          } else if (!triggerOnce) {
            setIsVisible(false);
          }
        },
        {
          threshold,
          rootMargin,
        }
      );

      observer.observe(element);

      return () => {
        observer.disconnect();
      };
    }, 350); // Wait for page-loading class to finish (300ms + 50ms buffer)

    return () => {
      clearTimeout(timeoutId);
    };
  }, [threshold, rootMargin, triggerOnce]);

  return { ref, isVisible, skipAnimation };
};
