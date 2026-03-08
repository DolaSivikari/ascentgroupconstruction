import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProofStripItem {
  icon?: LucideIcon;
  value: string;
  label: string;
}

interface ProofStripProps {
  items: ProofStripItem[];
  variant?: "light" | "dark";
  columns?: 2 | 3 | 4;
  className?: string;
}

/**
 * ProofStrip — Horizontal stat/trust bar for inline credibility signals.
 * 
 * Usage:
 *   <ProofStrip items={[{ value: "$2M", label: "CGL Coverage" }]} variant="dark" />
 */
export const ProofStrip = ({
  items,
  variant = "light",
  columns = 4,
  className,
}: ProofStripProps) => {
  const colClasses = {
    2: "grid-cols-2",
    3: "grid-cols-1 sm:grid-cols-3",
    4: "grid-cols-2 md:grid-cols-4",
  };

  return (
    <div
      className={cn(
        "rounded-[var(--radius-lg)] py-8 px-6",
        variant === "dark"
          ? "bg-primary text-primary-foreground"
          : "bg-muted/50 border border-border",
        className
      )}
    >
      <div className={cn("grid gap-6 text-center", colClasses[columns])}>
        {items.map((item, index) => {
          const Icon = item.icon;
          return (
            <div key={index} className="flex flex-col items-center gap-1">
              {Icon && (
                <Icon
                  className={cn(
                    "w-5 h-5 mb-1",
                    variant === "dark" ? "text-primary-foreground/80" : "text-primary"
                  )}
                />
              )}
              <p className="text-xl md:text-2xl font-bold">{item.value}</p>
              <p
                className={cn(
                  "text-xs font-medium uppercase tracking-wider",
                  variant === "dark" ? "text-primary-foreground/70" : "text-muted-foreground"
                )}
              >
                {item.label}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
