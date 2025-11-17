import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { LAYOUT } from "@/design-system/constants";
import { ScrollReveal } from "@/components/animations/ScrollReveal";

interface SectionProps {
  children: ReactNode;
  size?: "major" | "subsection" | "tight";
  maxWidth?: "standard" | "narrow" | "wide" | "full";
  className?: string;
  /** Disable automatic scroll reveal animation */
  disableAnimation?: boolean;
  /** Animation direction for scroll reveal */
  animationDirection?: "up" | "left" | "right";
  /** Delay before animation starts (ms) */
  animationDelay?: number;
}

/**
 * Unified Section Component
 * Enforces consistent layout, spacing, and max-width across all pages
 * Automatically wraps content in ScrollReveal for consistent animation
 * 
 * - major: Main page sections (py-16 md:py-20 lg:py-24)
 * - subsection: Nested sections (py-12 md:py-16)
 * - tight: Compact sections (py-8 md:py-12)
 */
export const Section = ({ 
  children, 
  size = "major",
  maxWidth = "standard",
  className,
  disableAnimation = false,
  animationDirection = "up",
  animationDelay = 0
}: SectionProps) => {
  const maxWidths = {
    standard: LAYOUT.maxWidth, // max-w-7xl
    narrow: "max-w-4xl",
    wide: "max-w-[1400px]",
    full: "w-full"
  };

  const content = (
    <div className={cn("mx-auto", LAYOUT.containerPadding, maxWidths[maxWidth])}>
      {children}
    </div>
  );

  return (
    <section 
      className={cn(
        "w-full bg-background",
        LAYOUT.sectionSpacing[size],
        className
      )}
    >
      {disableAnimation ? (
        content
      ) : (
        <ScrollReveal 
          direction={animationDirection} 
          delay={animationDelay}
          threshold={0.1}
        >
          {content}
        </ScrollReveal>
      )}
    </section>
  );
};
