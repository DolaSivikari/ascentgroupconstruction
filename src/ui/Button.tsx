import { forwardRef, useRef, useState } from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/hooks/useReducedMotion";

type Variant = "primary" | "secondary" | "navy" | "ghost" | "danger" | "outline" | "destructive" | "link" | "default" | "admin-glass" | "admin-primary" | "admin-success" | "admin-secondary" | "admin-danger" | "admin-outline";
type Size = "sm" | "md" | "lg" | "icon" | "default";


export const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 font-medium transition-[background-color,border-color,color,box-shadow,opacity] duration-300 motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
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
        "admin-success": "bg-[hsl(var(--admin-success))] text-white hover:opacity-90 shadow-lg",
        "admin-secondary": "bg-[hsl(var(--brand-primary))] text-white hover:opacity-90 shadow-lg",
        "admin-danger": "bg-[hsl(var(--admin-danger))] text-white hover:opacity-90 shadow-lg",
        "admin-outline": "border-2 border-[hsl(var(--brand-primary))] text-[hsl(var(--brand-primary))] bg-transparent hover:bg-[hsl(var(--admin-bg-secondary))]"
      },
      size: {
        sm: "px-4 py-2 text-sm rounded-[var(--radius-xs)] min-h-[44px] md:min-h-[40px] md:px-3",
        md: "px-6 py-3 text-base rounded-[var(--radius-sm)] min-h-[48px] md:min-h-[44px] md:px-4 md:py-2.5 md:text-sm",
        default: "px-6 py-3 text-base rounded-[var(--radius-sm)] min-h-[48px] md:min-h-[44px] md:px-4 md:py-2.5 md:text-sm",
        lg: "px-8 py-4 text-lg rounded-[var(--radius-sm)] min-h-[52px] md:px-5 md:py-3 md:text-base",
        icon: "h-12 w-12 rounded-[var(--radius-sm)] md:h-9 md:w-9"
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  }
);

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  as?: React.ElementType;
  asChild?: boolean;
  variant?: Variant;
  size?: Size;
}

interface Ripple { x: number; y: number; size: number; id: number; }

// Variants that should NOT receive the ripple effect (subtle / text-only buttons)
const NO_RIPPLE_VARIANTS: ReadonlySet<Variant> = new Set(["ghost", "link"]);

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ as: Tag = "button", asChild = false, variant = "primary", size = "md", className, children, onMouseDown, ...props }, ref) => {
    const Comp = asChild ? Slot : Tag;
    const reduced = useReducedMotion();
    const containerRef = useRef<HTMLSpanElement>(null);
    const [ripples, setRipples] = useState<Ripple[]>([]);

    // Ripple is skipped when: asChild (Slot requires single child), reduced motion, or subtle variant
    const rippleEnabled = !asChild && !reduced && !NO_RIPPLE_VARIANTS.has(variant);

    const handleMouseDown = (e: React.MouseEvent<HTMLButtonElement>) => {
      onMouseDown?.(e);
      if (!rippleEnabled || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;
      const id = Date.now() + Math.random();
      setRipples((prev) => [...prev, { x, y, size, id }]);
      window.setTimeout(() => {
        setRipples((prev) => prev.filter((r) => r.id !== id));
      }, 600);
    };

    return (
      <Comp
        ref={ref}
        onMouseDown={handleMouseDown}
        className={cn(
          buttonVariants({ variant, size }),
          rippleEnabled && "relative overflow-hidden",
          className
        )}
        {...props}
      >
        {asChild ? (
          children
        ) : (
          <>
            {children}
            {rippleEnabled && (
              <span ref={containerRef} className="absolute inset-0 pointer-events-none overflow-hidden rounded-[inherit]">
                {ripples.map((r) => (
                  <span
                    key={r.id}
                    className="absolute rounded-full pointer-events-none animate-ripple bg-white/30"
                    style={{
                      left: r.x,
                      top: r.y,
                      width: r.size,
                      height: r.size,
                      animationDuration: "600ms",
                    }}
                  />
                ))}
              </span>
            )}
          </>
        )}
      </Comp>
    );
  }
);

Button.displayName = "Button";
