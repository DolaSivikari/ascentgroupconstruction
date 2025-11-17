import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        // Gradient variants with solid backgrounds
        primary: "border-0 bg-gradient-to-br from-[hsl(var(--brand-primary))] to-[hsl(210_100%_30%)] text-white [box-shadow:var(--badge-shadow-md)] hover:[box-shadow:var(--badge-glow-primary)] hover-scale",
        success: "border-0 bg-gradient-to-br from-[hsl(142_76%_36%)] to-[hsl(142_76%_30%)] text-white [box-shadow:var(--badge-shadow-md)] hover:[box-shadow:var(--badge-glow-success)] hover-scale",
        warning: "border-0 bg-gradient-to-br from-[hsl(38_92%_50%)] to-[hsl(38_92%_45%)] text-white [box-shadow:var(--badge-shadow-md)] hover:[box-shadow:var(--badge-glow-warning)] hover-scale",
        info: "border-0 bg-gradient-to-br from-[hsl(217_91%_60%)] to-[hsl(217_91%_55%)] text-white [box-shadow:var(--badge-shadow-md)] hover:[box-shadow:var(--badge-glow-info)] hover-scale",
        danger: "border-0 bg-gradient-to-br from-[hsl(0_84%_60%)] to-[hsl(0_84%_55%)] text-white [box-shadow:var(--badge-shadow-md)] hover:[box-shadow:var(--badge-glow-danger)] hover-scale",
        
        // Glass morphism effect
        glass: "border border-white/20 bg-white/10 backdrop-blur-md text-white [box-shadow:var(--badge-shadow-md)] hover:bg-white/20 hover-scale",
        
        // Outline with gradient border
        "outline-gradient": "border-2 border-transparent bg-gradient-to-br from-[hsl(var(--brand-primary))] to-[hsl(var(--brand-accent))] bg-clip-border bg-origin-border text-[hsl(var(--brand-primary))] hover:[box-shadow:var(--badge-shadow-md)] hover-scale [background-clip:padding-box,border-box] [background-origin:padding-box,border-box] relative before:absolute before:inset-0 before:bg-white before:rounded-[inherit] before:-z-10",
        
        // Status indicators with dots
        "status-active": "border-0 bg-gradient-to-br from-[hsl(142_76%_36%)] to-[hsl(142_76%_30%)] text-white [box-shadow:var(--badge-shadow-md)] hover-scale animate-pulse",
        "status-pending": "border-0 bg-gradient-to-br from-[hsl(38_92%_50%)] to-[hsl(38_92%_45%)] text-white [box-shadow:var(--badge-shadow-md)] hover-scale",
        "status-inactive": "border-0 bg-gradient-to-br from-[hsl(215_16%_47%)] to-[hsl(215_16%_40%)] text-white [box-shadow:var(--badge-shadow-md)] hover-scale",
        
        // Legacy compatibility
        default: "border-0 bg-gradient-to-br from-[hsl(var(--brand-primary))] to-[hsl(210_100%_30%)] text-white [box-shadow:var(--badge-shadow-md)] hover-scale",
        secondary: "border-0 bg-gradient-to-br from-[hsl(var(--bg-soft))] to-[hsl(210_40%_95%)] text-[hsl(var(--brand-primary))] [box-shadow:var(--badge-shadow-sm)] hover-scale",
        destructive: "border-0 bg-gradient-to-br from-[hsl(0_84%_60%)] to-[hsl(0_84%_55%)] text-white [box-shadow:var(--badge-shadow-md)] hover-scale",
        outline: "border-2 border-[hsl(var(--line))] bg-transparent text-[hsl(var(--ink))] hover:bg-[hsl(var(--bg-soft))] hover-scale",
        
        // Additional status variants
        new: "border-0 bg-gradient-to-br from-[hsl(var(--brand-accent))] to-[hsl(25_95%_45%)] text-white [box-shadow:var(--badge-shadow-md)] hover-scale",
        contacted: "border-0 bg-gradient-to-br from-[hsl(217_91%_60%)] to-[hsl(217_91%_55%)] text-white [box-shadow:var(--badge-shadow-md)] hover-scale",
        resolved: "border-0 bg-gradient-to-br from-[hsl(142_76%_36%)] to-[hsl(142_76%_30%)] text-white [box-shadow:var(--badge-shadow-md)] hover-scale",
        completed: "border-0 bg-gradient-to-br from-[hsl(142_76%_36%)] to-[hsl(142_76%_30%)] text-white [box-shadow:var(--badge-shadow-md)] hover-scale",
        active: "border-0 bg-gradient-to-br from-[hsl(142_76%_36%)] to-[hsl(142_76%_30%)] text-white [box-shadow:var(--badge-shadow-md)] hover-scale",
        inactive: "border-0 bg-gradient-to-br from-[hsl(215_16%_47%)] to-[hsl(215_16%_40%)] text-white/90 [box-shadow:var(--badge-shadow-sm)] hover-scale",
      },
      size: {
        xs: "text-[10px] px-2 py-0.5 gap-1 rounded-full",
        sm: "text-xs px-2.5 py-1 gap-1.5 rounded-full",
        md: "text-sm px-3 py-1.5 gap-2 rounded-full",
        lg: "text-base px-4 py-2 gap-2 rounded-[var(--radius-sm)]",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "sm",
    },
  },
);

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {
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
