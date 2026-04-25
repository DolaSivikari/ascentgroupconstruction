import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Badge — uses semantic design tokens (success / warning / danger / info / brand-primary / brand-accent).
 * Do NOT add hardcoded HSL values or palette utilities (bg-green-500, text-yellow-400, etc.) here.
 * See CONTRIBUTING.md → "Design Tokens" for the rules.
 */
const badgeVariants = cva(
  "inline-flex items-center font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        // ── Semantic feedback variants (CANONICAL) ─────────────────────────
        primary: "border-0 bg-brand-primary text-white shadow-md hover:shadow-lg hover-scale",
        success: "border-0 bg-success text-success-foreground shadow-md hover:shadow-lg hover-scale",
        warning: "border-0 bg-warning text-warning-foreground shadow-md hover:shadow-lg hover-scale",
        info:    "border-0 bg-info text-info-foreground shadow-md hover:shadow-lg hover-scale",
        danger:  "border-0 bg-danger text-danger-foreground shadow-md hover:shadow-lg hover-scale",

        // ── Surface treatments ─────────────────────────────────────────────
        glass: "border border-white/20 bg-white/10 backdrop-blur-md text-white shadow-md hover:bg-white/20 hover-scale",
        "outline-gradient":
          "border-2 border-brand-primary text-brand-primary bg-transparent hover:bg-brand-primary/5 hover-scale",
        outline: "border-2 border-line bg-transparent text-ink hover:bg-bg-soft hover-scale",

        // ── Status indicator variants (semantic aliases) ───────────────────
        "status-active":   "border-0 bg-success text-success-foreground shadow-md hover-scale animate-pulse",
        "status-pending":  "border-0 bg-warning text-warning-foreground shadow-md hover-scale",
        "status-inactive": "border-0 bg-muted text-muted-foreground shadow-sm hover-scale",

        // ── Legacy aliases — map to semantic tokens (kept for back-compat) ─
        default:     "border-0 bg-brand-primary text-white shadow-md hover-scale",
        secondary:   "border-0 bg-bg-soft text-brand-primary shadow-sm hover-scale",
        destructive: "border-0 bg-danger text-danger-foreground shadow-md hover-scale",

        // Submission/inbox status aliases
        new:        "border-0 bg-brand-accent text-white shadow-md hover-scale",
        contacted:  "border-0 bg-info text-info-foreground shadow-md hover-scale",
        resolved:   "border-0 bg-success text-success-foreground shadow-md hover-scale",
        completed:  "border-0 bg-success text-success-foreground shadow-md hover-scale",
        active:     "border-0 bg-success text-success-foreground shadow-md hover-scale",
        inactive:   "border-0 bg-muted text-muted-foreground shadow-sm hover-scale",
      },
      size: {
        xs: "text-xs px-2.5 py-1 gap-1 rounded-full",
        sm: "text-sm px-3 py-1.5 gap-1.5 rounded-full",
        md: "text-base px-4 py-2 gap-2 rounded-full",
        lg: "text-base px-4 py-2 gap-2 rounded-[var(--radius-sm)]",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "sm",
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  icon?: LucideIcon;
  showDot?: boolean;
}

function Badge({ className, variant, size, icon: Icon, showDot, children, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant, size }), className)} {...props}>
      {showDot && <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />}
      {Icon && <Icon className="w-3 h-3" />}
      {children}
    </div>
  );
}

export { Badge, badgeVariants };
