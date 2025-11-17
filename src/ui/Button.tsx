import { forwardRef } from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "navy" | "ghost" | "danger" | "outline" | "destructive" | "link" | "default" | "admin-glass" | "admin-primary" | "admin-success";
type Size = "sm" | "md" | "lg" | "icon" | "default";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  as?: React.ElementType;
  asChild?: boolean;
  variant?: Variant;
  size?: Size;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ as: Tag = "button", asChild = false, variant = "primary", size = "md", className, children, ...props }, ref) => {
    const Comp = asChild ? Slot : Tag;
    
    const variants = {
      primary: "bg-[hsl(var(--brand-accent))] text-white hover:opacity-90 shadow-lg",
      default: "bg-[hsl(var(--brand-accent))] text-white hover:opacity-90 shadow-lg",
      secondary: "border-2 border-[hsl(var(--brand-primary))] text-[hsl(var(--brand-primary))] bg-transparent hover:bg-[hsl(var(--bg-soft))]",
      outline: "border-2 border-[hsl(var(--brand-primary))] text-[hsl(var(--brand-primary))] bg-transparent hover:bg-[hsl(var(--bg-soft))]",
      navy: "bg-[hsl(var(--brand-primary))] text-white hover:opacity-90 shadow-lg",
      ghost: "text-[hsl(var(--brand-primary))] hover:bg-[hsl(var(--bg-soft))]",
      danger: "bg-[hsl(var(--danger))] text-white hover:opacity-90",
      destructive: "bg-[hsl(var(--danger))] text-white hover:opacity-90",
      link: "text-[hsl(var(--brand-primary))] underline-offset-4 hover:underline",
      "admin-glass": "bg-[hsl(var(--admin-bg-card))] text-[hsl(var(--admin-text-primary))] border border-[hsl(var(--admin-border))] hover:bg-[hsl(var(--admin-bg-hover))] backdrop-blur-md",
      "admin-primary": "bg-gradient-to-r from-[hsl(var(--admin-primary))] to-[hsl(221_83%_53%)] text-white hover:opacity-90 shadow-lg",
      "admin-success": "bg-[hsl(var(--admin-success))] text-white hover:opacity-90 shadow-lg"
    };

    const sizes = {
      sm: "px-4 py-2 text-sm rounded-[var(--radius-xs)] min-h-[44px] md:min-h-[40px] md:px-3",
      md: "px-6 py-3 text-base rounded-[var(--radius-sm)] min-h-[48px] md:min-h-[44px] md:px-4 md:py-2.5 md:text-sm",
      default: "px-6 py-3 text-base rounded-[var(--radius-sm)] min-h-[48px] md:min-h-[44px] md:px-4 md:py-2.5 md:text-sm",
      lg: "px-8 py-4 text-lg rounded-[var(--radius-md)] min-h-[52px] md:px-5 md:py-3 md:text-base",
      icon: "h-12 w-12 rounded-[var(--radius-sm)] md:h-9 md:w-9"
    };

    return (
      <Comp
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center gap-2 font-medium transition-all duration-300",
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      >
        {children}
      </Comp>
    );
  }
);

Button.displayName = "Button";
