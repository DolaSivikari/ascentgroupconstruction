import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface PageLayoutProps {
  children: ReactNode;
  className?: string;
}

/**
 * Standard page wrapper ensuring consistent container width and spacing
 */
export const PageLayout = ({ children, className }: PageLayoutProps) => {
  return (
    <main id="main-content" className={cn("min-h-screen pt-24", className)}>
      {children}
    </main>
  );
};
