/**
 * Typography Components
 * Pre-configured heading and text components that enforce the design system
 */

import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { 
  getH1Classes, 
  getH2Classes, 
  getH3Classes, 
  getH4Classes, 
  getBodyClasses,
  TEXT_COLORS 
} from "../typography";

interface HeadingProps {
  children: ReactNode;
  className?: string;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
}

interface TextProps {
  children: ReactNode;
  size?: 'default' | 'large' | 'small' | 'xs';
  color?: keyof typeof TEXT_COLORS;
  className?: string;
  as?: 'p' | 'span' | 'div';
}

/**
 * H1 Component - Use ONLY in hero sections
 */
export const H1 = ({ children, className, as: Component = 'h1' }: HeadingProps) => {
  return (
    <Component className={getH1Classes(className)}>
      {children}
    </Component>
  );
};

/**
 * H2 Component - Major section headers
 */
export const H2 = ({ children, className, as: Component = 'h2' }: HeadingProps) => {
  return (
    <Component className={getH2Classes(className)}>
      {children}
    </Component>
  );
};

/**
 * H3 Component - Subsection headers, card titles
 */
export const H3 = ({ children, className, as: Component = 'h3' }: HeadingProps) => {
  return (
    <Component className={getH3Classes(className)}>
      {children}
    </Component>
  );
};

/**
 * H4 Component - Minor headings
 */
export const H4 = ({ children, className, as: Component = 'h4' }: HeadingProps) => {
  return (
    <Component className={getH4Classes(className)}>
      {children}
    </Component>
  );
};

/**
 * Text Component - Body text with size variants
 */
export const Text = ({ 
  children, 
  size = 'default', 
  color = 'primary',
  className,
  as: Component = 'p' 
}: TextProps) => {
  return (
    <Component className={cn(
      getBodyClasses(size),
      TEXT_COLORS[color],
      className
    )}>
      {children}
    </Component>
  );
};
