import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface StaggerContainerProps {
  children: ReactNode;
  /** Animation type for stagger effect */
  type?: "fade" | "scale";
  /** Custom className for container */
  className?: string;
}

/**
 * Container that automatically staggers animations of direct children
 * 
 * @example
 * ```tsx
 * <StaggerContainer type="fade">
 *   <Card>Item 1 - Fades in first</Card>
 *   <Card>Item 2 - Fades in second</Card>
 *   <Card>Item 3 - Fades in third</Card>
 * </StaggerContainer>
 * 
 * <StaggerContainer type="scale">
 *   {items.map(item => (
 *     <div key={item.id}>{item.name}</div>
 *   ))}
 * </StaggerContainer>
 * ```
 */
export const StaggerContainer = ({
  children,
  type = "fade",
  className,
}: StaggerContainerProps) => {
  const staggerClass = type === "fade" ? "stagger-fade-in" : "stagger-scale";

  return (
    <div className={cn(staggerClass, className)}>
      {children}
    </div>
  );
};
