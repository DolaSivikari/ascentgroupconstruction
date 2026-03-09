import { useScrollReveal } from './useScrollReveal';

interface UseScrollFadeInOptions {
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
}

/**
 * Scroll-triggered fade-in hook with brand-standard threshold (0.15).
 * Thin wrapper around useScrollReveal — returns the same interface.
 *
 * @example
 * ```tsx
 * const { ref, isVisible, skipAnimation } = useScrollFadeIn();
 * const show = isVisible || skipAnimation;
 *
 * <div ref={ref} style={{
 *   opacity: show ? 1 : 0,
 *   transform: show ? 'translateY(0)' : 'translateY(24px)',
 *   transition: 'opacity 300ms ease-out, transform 300ms ease-out',
 * }}>
 * ```
 */
export const useScrollFadeIn = (options: UseScrollFadeInOptions = {}) => {
  return useScrollReveal({
    threshold: options.threshold ?? 0.15,
    rootMargin: options.rootMargin ?? '0px 0px -80px 0px',
    triggerOnce: options.triggerOnce ?? true,
  });
};
