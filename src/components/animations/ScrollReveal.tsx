import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { useScrollReveal } from "@/hooks/useScrollReveal";

interface ScrollRevealProps {
  children: ReactNode;
  /** Direction of reveal animation */
  direction?: "up" | "left" | "right";
  /** Threshold for triggering animation (0-1) */
  threshold?: number;
  /** Whether to trigger animation only once */
  triggerOnce?: boolean;
  /** Custom className */
  className?: string;
  /** Additional delay in milliseconds */
  delay?: number;
}

/**
 * Component wrapper that reveals content on scroll
 * 
 * @example
 * ```tsx
 * <ScrollReveal direction="up" delay={200}>
 *   <h2>This content will fade in from below when scrolled into view</h2>
 * </ScrollReveal>
 * 
 * <ScrollReveal direction="left">
 *   <Card>Content slides in from left</Card>
 * </ScrollReveal>
 * ```
 */
export const ScrollReveal = ({
  children,
  direction = "up",
  threshold = 0.1,
  triggerOnce = true,
  className,
  delay = 0,
}: ScrollRevealProps) => {
  const { ref, isVisible, skipAnimation } = useScrollReveal<HTMLDivElement>({
    threshold,
    triggerOnce,
  });

  const directionClass = direction === "up" 
    ? "scroll-reveal"
    : direction === "left"
    ? "scroll-reveal-left"
    : "scroll-reveal-right";

  return (
    <div
      ref={ref}
      className={cn(
        skipAnimation ? "opacity-100" : directionClass,
        isVisible && !skipAnimation && "is-visible",
        className
      )}
      style={!skipAnimation && delay > 0 ? {
        transitionDelay: `${delay}ms`,
      } : undefined}
    >
      {children}
    </div>
  );
};
