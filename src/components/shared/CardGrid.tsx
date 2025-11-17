import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { getStaggerDelay, STAGGER_DELAYS } from "@/design-system/animations";

interface CardGridProps {
  children: ReactNode[];
  columns?: 2 | 3 | 4;
  gap?: "sm" | "md" | "lg";
  stagger?: keyof typeof STAGGER_DELAYS;
  className?: string;
}

/**
 * Unified Card Grid Component
 * Automatically applies ScrollReveal with stagger delays to children
 * Creates consistent grid layouts across the site
 */
export const CardGrid = ({
  children,
  columns = 3,
  gap = "lg",
  stagger = "standard",
  className,
}: CardGridProps) => {
  const gridCols = {
    2: "grid-cols-1 md:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
  };

  const gapSize = {
    sm: "gap-4",
    md: "gap-6",
    lg: "gap-8",
  };

  const staggerAmount = STAGGER_DELAYS[stagger];

  return (
    <div className={cn("grid", gridCols[columns], gapSize[gap], className)}>
      {Array.isArray(children) ? (
        children.map((child, index) => (
          <ScrollReveal
            key={index}
            direction="up"
            delay={getStaggerDelay(index, staggerAmount)}
            threshold={0.1}
          >
            {child}
          </ScrollReveal>
        ))
      ) : (
        <ScrollReveal direction="up" threshold={0.1}>
          {children}
        </ScrollReveal>
      )}
    </div>
  );
};
