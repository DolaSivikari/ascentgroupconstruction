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

  // Use longhand transition properties to avoid React's
  // "Updating transition (a style property during rerender) when a conflicting
  // property is set" warning when delay is combined with the shorthand `transition`
  // declared in the CSS class.
  const delayStyle: React.CSSProperties | undefined =
    !skipAnimation && delay > 0
      ? {
          transitionProperty: "opacity, transform",
          transitionDuration: "700ms",
          transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
          transitionDelay: `${delay}ms`,
        }
      : undefined;

  return (
    <div
      ref={ref}
      className={cn(
        skipAnimation ? "opacity-100" : directionClass,
        isVisible && !skipAnimation && "is-visible",
        className
      )}
      style={delayStyle}
    >
      {children}
    </div>
  );
};
