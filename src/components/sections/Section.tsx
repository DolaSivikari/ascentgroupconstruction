import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { LAYOUT } from "@/design-system/constants";

interface SectionProps {
  children: ReactNode;
  size?: "major" | "subsection" | "tight";
  maxWidth?: "standard" | "narrow" | "wide" | "full";
  className?: string;
}

/**
 * Unified Section Component
 * Enforces consistent layout, spacing, and max-width across all pages
 * - major: Main page sections (py-16 md:py-20 lg:py-24)
 * - subsection: Nested sections (py-12 md:py-16)
 * - tight: Compact sections (py-8 md:py-12)
 */
export const Section = ({ 
  children, 
  size = "major",
  maxWidth = "standard",
  className
}: SectionProps) => {
  const maxWidths = {
    standard: LAYOUT.maxWidth, // max-w-7xl
    narrow: "max-w-4xl",
    wide: "max-w-[1400px]",
    full: "w-full"
  };

  return (
    <section 
      className={cn(
        "w-full bg-background",
        LAYOUT.sectionSpacing[size],
        className
      )}
    >
      <div className={cn("mx-auto", LAYOUT.containerPadding, maxWidths[maxWidth])}>
        {children}
      </div>
    </section>
  );
};
