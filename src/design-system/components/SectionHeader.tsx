import { cn } from "@/lib/utils";
import { RevealText } from "@/components/ui/RevealText";

interface SectionHeaderProps {
  title: string;
  description?: string;
  badge?: string;
  align?: "left" | "center";
  /** Max width for the description text */
  maxWidth?: "sm" | "md" | "lg";
  className?: string;
}

const maxWidthMap = {
  sm: "max-w-xl",
  md: "max-w-2xl",
  lg: "max-w-3xl",
} as const;

/**
 * SectionHeader — Standardized heading pattern for page sections
 * 
 * Usage:
 *   <SectionHeader title="What We Deliver" description="..." badge="Services" />
 */
export const SectionHeader = ({
  title,
  description,
  badge,
  align = "center",
  maxWidth = "md",
  className,
}: SectionHeaderProps) => {
  return (
    <div
      className={cn(
        "mb-12",
        align === "center" && "text-center",
        className
      )}
    >
      {badge && (
        <span className="inline-block text-sm font-medium uppercase tracking-wider text-primary mb-3">
          {badge}
        </span>
      )}
      <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
        <RevealText>{title}</RevealText>
      </h2>
      {description && (
        <p
          className={cn(
            "text-lg text-muted-foreground leading-relaxed",
            maxWidthMap[maxWidth],
            align === "center" && "mx-auto"
          )}
        >
          {description}
        </p>
      )}
    </div>
  );
};
