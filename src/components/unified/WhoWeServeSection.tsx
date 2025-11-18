import { ReactNode } from "react";
import { Section } from "@/components/sections/Section";
import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { CardGrid } from "@/components/shared/CardGrid";
import { cn } from "@/lib/utils";
import { STAGGER_DELAYS } from "@/design-system/animations";

/**
 * Unified "Who We Serve" Section Component
 * Consistent section layout for displaying client segments across the site
 */

interface WhoWeServeSectionProps {
  /** Section heading */
  title?: string;
  /** Section description/subheading */
  description?: string;
  /** Number of columns (2, 3, or 4) */
  columns?: 2 | 3 | 4;
  /** Child cards to display */
  children: ReactNode[];
  /** Background variant */
  background?: "default" | "muted";
  /** Optional custom className */
  className?: string;
  /** Whether to use CardGrid with stagger animation (default: true) */
  useCardGrid?: boolean;
}

export const WhoWeServeSection = ({
  title = "Who We Serve",
  description = "Specialized solutions tailored to your project requirements",
  columns = 4,
  children,
  background = "default",
  className,
  useCardGrid = true,
}: WhoWeServeSectionProps) => {
  const bgClass = background === "muted" ? "bg-muted/30" : "bg-background";

  return (
    <Section size="major" className={cn(bgClass, className)}>
      {/* Section Header */}
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight">
          {title}
        </h2>
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
          {description}
        </p>
      </div>

      {/* Cards Grid */}
      {useCardGrid ? (
        <CardGrid columns={columns} stagger="standard" gap="lg">
          {children}
        </CardGrid>
      ) : (
        <div className={cn(
          "grid gap-8",
          columns === 2 && "grid-cols-1 md:grid-cols-2",
          columns === 3 && "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
          columns === 4 && "grid-cols-1 md:grid-cols-2 lg:grid-cols-4"
        )}>
          {children.map((child, index) => (
            <ScrollReveal
              key={index}
              direction="up"
              delay={index * STAGGER_DELAYS.standard}
            >
              {child}
            </ScrollReveal>
          ))}
        </div>
      )}
    </Section>
  );
};
