import { cn } from "@/lib/utils";
import { RevealText } from "@/components/ui/RevealText";
import { TYPOGRAPHY_STYLES } from "@/design-system/constants";

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
        <span className={cn(TYPOGRAPHY_STYLES.label, "inline-block text-primary mb-3")}>
          {badge}
        </span>
      )}
      <h2 className={cn(TYPOGRAPHY_STYLES.sectionTitle, "mb-4")}>
        <RevealText>{title}</RevealText>
      </h2>
      {description && (
        <p
          className={cn(
            TYPOGRAPHY_STYLES.bodyLarge,
            "text-muted-foreground",
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
