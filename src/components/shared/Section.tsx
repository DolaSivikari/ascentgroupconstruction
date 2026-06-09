import { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Tone = "white" | "muted" | "ink";
type Padding = "sm" | "md" | "lg";

interface SectionProps {
  children: ReactNode;
  /** Background tone — keeps page rhythm consistent. */
  tone?: Tone;
  /** Vertical padding scale. */
  padding?: Padding;
  /** Anchor id for scroll-to-section links. */
  id?: string;
  /** Optional aria-label for landmark navigation. */
  ariaLabel?: string;
  /** Render inner container (max-width + horizontal padding). Defaults true. */
  container?: boolean;
  className?: string;
  innerClassName?: string;
}

const toneClass: Record<Tone, string> = {
  white: "bg-background text-foreground",
  muted: "bg-muted/30 text-foreground",
  ink: "bg-[hsl(var(--ink))] text-white",
};

const paddingClass: Record<Padding, string> = {
  sm: "py-10 md:py-14",
  md: "py-16 md:py-20",
  lg: "py-20 md:py-28",
};

/**
 * Standardized page section wrapper. Every non-hero band on a public page
 * should render inside <Section> so tone, padding, and container width stay
 * consistent across the site.
 */
export const Section = ({
  children,
  tone = "white",
  padding = "md",
  id,
  ariaLabel,
  container = true,
  className,
  innerClassName,
}: SectionProps) => {
  return (
    <section
      id={id}
      aria-label={ariaLabel}
      className={cn(
        "w-full scroll-mt-24",
        toneClass[tone],
        paddingClass[padding],
        className
      )}
    >
      {container ? (
        <div className={cn("container mx-auto px-4 md:px-6", innerClassName)}>
          {children}
        </div>
      ) : (
        children
      )}
    </section>
  );
};

export default Section;
