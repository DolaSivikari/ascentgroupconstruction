import { ReactNode, forwardRef } from "react";
import { cn } from "@/lib/utils";
import { RADIUS, SHADOW, TRANSITION } from "@/design-system/tokens";

/**
 * Unified Card Component
 * Single card system used across the entire site for consistency
 */

type CardVariant = 'default' | 'elevated' | 'interactive' | 'ghost' | 'outline';
type CardSize = 'sm' | 'md' | 'lg';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
  size?: CardSize;
  hover?: boolean;
  children: ReactNode;
}

const cardVariants: Record<CardVariant, string> = {
  default: 'bg-card border border-border',
  elevated: 'bg-card border border-border shadow-[var(--shadow-card-elevated)]',
  interactive: 'bg-card border border-border shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-card-hover)] hover:-translate-y-1 cursor-pointer',
  ghost: 'bg-transparent border-0',
  outline: 'bg-transparent border-2 border-border',
};

const cardSizes: Record<CardSize, string> = {
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
};

/**
 * Base Card Component
 */
export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ variant = 'default', size = 'md', hover = false, className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          // Base styles
          'rounded-[var(--radius-lg)]',
          'transition-all duration-200',
          
          // Variant
          cardVariants[variant],
          
          // Size
          cardSizes[size],
          
          // Hover effect (subtle lift only)
          hover && 'hover:-translate-y-1',
          
          // Custom className
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = "Card";

/**
 * Card Header
 */
export const CardHeader = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex flex-col space-y-1.5 mb-4", className)}
      {...props}
    />
  )
);

CardHeader.displayName = "CardHeader";

/**
 * Card Title
 */
export const CardTitle = forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3
      ref={ref}
      className={cn("text-xl font-semibold leading-tight tracking-tight text-foreground", className)}
      {...props}
    />
  )
);

CardTitle.displayName = "CardTitle";

/**
 * Card Description
 */
export const CardDescription = forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p
      ref={ref}
      className={cn("text-sm text-muted-foreground leading-relaxed", className)}
      {...props}
    />
  )
);

CardDescription.displayName = "CardDescription";

/**
 * Card Content
 */
export const CardContent = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("", className)} {...props} />
  )
);

CardContent.displayName = "CardContent";

/**
 * Card Footer
 */
export const CardFooter = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex items-center mt-4 pt-4 border-t border-border", className)}
      {...props}
    />
  )
);

CardFooter.displayName = "CardFooter";
