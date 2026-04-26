import { LucideIcon, Shield, ShieldCheck, Wrench, Award, Users } from "lucide-react";
import { cn } from "@/lib/utils";

export interface TrustRibbonItem {
  icon: LucideIcon;
  text: string;
  /** Short label shown on small screens (defaults to text) */
  short?: string;
}

export interface TrustRibbonProps {
  items?: TrustRibbonItem[];
  /** Visual style: "soft" (muted bg) or "ink" (dark) */
  variant?: "soft" | "ink";
  className?: string;
}

const DEFAULT_ITEMS: TrustRibbonItem[] = [
  { icon: ShieldCheck, text: "$2M CGL Coverage", short: "$2M CGL" },
  { icon: Shield, text: "WSIB Compliant", short: "WSIB" },
  { icon: Wrench, text: "85% Self-Performed", short: "85% Self-Perform" },
  { icon: Users, text: "15+ Years Experience", short: "15+ Years" },
  { icon: Award, text: "Sto Listed Installer", short: "Sto Listed" },
];

/**
 * TrustRibbon — slim 1-line trust strip placed directly under PageHero.
 * Distinct from the heavier ProofStrip used for major proof sections.
 */
export const TrustRibbon = ({
  items = DEFAULT_ITEMS,
  variant = "soft",
  className,
}: TrustRibbonProps) => {
  return (
    <div
      className={cn(
        "w-full border-y",
        variant === "soft" && "bg-muted/40 border-border/60",
        variant === "ink" && "bg-[hsl(var(--ink))] border-white/10",
        className,
      )}
      role="region"
      aria-label="Trust signals"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-3 md:py-4">
        <ul className="flex items-center justify-around md:justify-between gap-3 md:gap-6 overflow-x-auto scrollbar-hide">
          {items.map(({ icon: Icon, text, short }, i) => (
            <li
              key={i}
              className={cn(
                "flex items-center gap-2 whitespace-nowrap text-xs md:text-sm font-medium",
                variant === "soft" && "text-foreground",
                variant === "ink" && "text-white",
              )}
            >
              <Icon
                className={cn(
                  "w-4 h-4 md:w-5 md:h-5 flex-shrink-0",
                  variant === "soft" && "text-primary",
                  variant === "ink" && "text-[hsl(var(--accent))]",
                )}
              />
              <span className="hidden sm:inline">{text}</span>
              <span className="sm:hidden">{short ?? text}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default TrustRibbon;
