import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { X, LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const tagVariants = cva(
  "inline-flex items-center font-medium transition-all duration-200 hover:scale-105 hover:brightness-110",
  {
    variants: {
      variant: {
        primary: "bg-gradient-to-br from-[hsl(var(--brand-primary))] to-[hsl(210_100%_30%)] text-white shadow-md hover:shadow-lg",
        success: "bg-gradient-to-br from-[hsl(142_76%_36%)] to-[hsl(142_76%_30%)] text-white shadow-md hover:shadow-lg",
        warning: "bg-gradient-to-br from-[hsl(38_92%_50%)] to-[hsl(38_92%_45%)] text-white shadow-md hover:shadow-lg",
        info: "bg-gradient-to-br from-[hsl(217_91%_60%)] to-[hsl(217_91%_55%)] text-white shadow-md hover:shadow-lg",
        danger: "bg-gradient-to-br from-[hsl(0_84%_60%)] to-[hsl(0_84%_55%)] text-white shadow-md hover:shadow-lg",
        neutral: "bg-gradient-to-br from-[hsl(var(--bg-soft))] to-[hsl(210_40%_95%)] text-[hsl(var(--ink))] shadow-sm hover:shadow-md",
        outline: "border-2 border-[hsl(var(--line))] bg-transparent text-[hsl(var(--ink))] hover:bg-[hsl(var(--bg-soft))]",
      },
      size: {
        sm: "text-xs px-3 py-1.5 gap-1.5 rounded-full",
        md: "text-sm px-4 py-2 gap-2 rounded-full",
        lg: "text-base px-5 py-2.5 gap-2.5 rounded-full",
      },
    },
    defaultVariants: {
      variant: "neutral",
      size: "md",
    },
  },
);

export interface TagProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof tagVariants> {
  icon?: LucideIcon;
  trailingIcon?: LucideIcon;
  onDismiss?: () => void;
  dismissible?: boolean;
  count?: number;
}

function Tag({ 
  className, 
  variant, 
  size, 
  icon: Icon, 
  trailingIcon: TrailingIcon,
  onDismiss,
  dismissible,
  count,
  children, 
  ...props 
}: TagProps) {
  return (
    <div className={cn(tagVariants({ variant, size }), className)} {...props}>
      {Icon && <Icon className={cn("w-3.5 h-3.5", size === "lg" && "w-4 h-4")} />}
      <span>{children}</span>
      {count !== undefined && (
        <span className="ml-1 px-1.5 py-0.5 text-xs font-bold bg-white/20 rounded-full">
          {count}
        </span>
      )}
      {TrailingIcon && <TrailingIcon className={cn("w-3.5 h-3.5", size === "lg" && "w-4 h-4")} />}
      {(dismissible || onDismiss) && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDismiss?.();
          }}
          className="ml-1 hover:bg-white/20 rounded-full p-0.5 transition-colors"
        >
          <X className="w-3 h-3" />
        </button>
      )}
    </div>
  );
}

export { Tag, tagVariants };