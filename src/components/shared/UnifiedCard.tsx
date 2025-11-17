import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { CARD_STYLES } from "@/design-system/constants";

interface UnifiedCardProps {
  variant?: 'base' | 'elevated' | 'interactive';
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

/**
 * Unified Card Component
 * Standardized card styling across the entire site
 */
export const UnifiedCard = ({ 
  variant = 'base', 
  children, 
  className,
  onClick 
}: UnifiedCardProps) => {
  const variants = {
    base: CARD_STYLES.base,
    elevated: CARD_STYLES.elevated,
    interactive: cn(CARD_STYLES.elevated, CARD_STYLES.hover, 'cursor-pointer'),
  };

  return (
    <div 
      className={cn(variants[variant], 'p-6', className)}
      onClick={onClick}
    >
      {children}
    </div>
  );
};
