/**
 * Unified Typography System
 * Enforces strict heading hierarchy across the entire site
 * 
 * Enterprise Rule: Use ONLY these typography classes
 * No ad-hoc text sizing allowed
 */

import { cn } from "@/lib/utils";

/**
 * Typography Scale
 * Based on enterprise construction site analysis
 */
export const TYPOGRAPHY = {
  /** H1 - Homepage hero ONLY (60px desktop / 36px mobile) */
  h1: {
    desktop: 'text-6xl',
    mobile: 'text-4xl',
    combined: 'text-4xl md:text-6xl',
  },
  
  /** H2 - Major section headers (48px desktop / 30px mobile) */
  h2: {
    desktop: 'text-5xl',
    mobile: 'text-3xl',
    combined: 'text-3xl md:text-5xl',
  },
  
  /** H3 - Subsection headers, card titles (30px desktop / 24px mobile) */
  h3: {
    desktop: 'text-3xl',
    mobile: 'text-2xl',
    combined: 'text-2xl md:text-3xl',
  },
  
  /** H4 - Minor headings (24px desktop / 20px mobile) */
  h4: {
    desktop: 'text-2xl',
    mobile: 'text-xl',
    combined: 'text-xl md:text-2xl',
  },
  
  /** Body text */
  body: {
    default: 'text-base',      // 16px
    large: 'text-lg',          // 18px - For readability
    small: 'text-sm',          // 14px - Captions
    xs: 'text-xs',             // 12px - Labels
  },
} as const;

/**
 * Font Weight Scale
 */
export const FONT_WEIGHT = {
  normal: 'font-normal',       // 400
  medium: 'font-medium',       // 500
  semibold: 'font-semibold',   // 600
  bold: 'font-bold',           // 700
} as const;

/**
 * Line Height
 */
export const LINE_HEIGHT = {
  tight: 'leading-tight',      // 1.25
  normal: 'leading-normal',    // 1.5
  relaxed: 'leading-relaxed',  // 1.75
} as const;

/**
 * Typography Helper Functions
 */

/**
 * Get H1 classes (Hero only)
 */
export const getH1Classes = (className?: string) => {
  return cn(
    TYPOGRAPHY.h1.combined,
    FONT_WEIGHT.bold,
    LINE_HEIGHT.tight,
    'tracking-tight',
    className
  );
};

/**
 * Get H2 classes (Section headers)
 */
export const getH2Classes = (className?: string) => {
  return cn(
    TYPOGRAPHY.h2.combined,
    FONT_WEIGHT.bold,
    LINE_HEIGHT.tight,
    'tracking-tight',
    className
  );
};

/**
 * Get H3 classes (Subsections, cards)
 */
export const getH3Classes = (className?: string) => {
  return cn(
    TYPOGRAPHY.h3.combined,
    FONT_WEIGHT.semibold,
    LINE_HEIGHT.tight,
    className
  );
};

/**
 * Get H4 classes (Minor headings)
 */
export const getH4Classes = (className?: string) => {
  return cn(
    TYPOGRAPHY.h4.combined,
    FONT_WEIGHT.semibold,
    LINE_HEIGHT.normal,
    className
  );
};

/**
 * Get body text classes
 */
export const getBodyClasses = (size: 'default' | 'large' | 'small' | 'xs' = 'default', className?: string) => {
  return cn(
    TYPOGRAPHY.body[size],
    FONT_WEIGHT.normal,
    LINE_HEIGHT.relaxed,
    className
  );
};

/**
 * Standard text color classes
 */
export const TEXT_COLORS = {
  primary: 'text-foreground',
  secondary: 'text-muted-foreground',
  accent: 'text-primary',
  inverse: 'text-primary-foreground',
} as const;

/**
 * Typography Rules (Enterprise Standards)
 * 
 * 1. H1 appears ONLY ONCE per page (hero section)
 * 2. H2 for major sections (4-6 per page max)
 * 3. H3 for subsections and card titles
 * 4. H4 for minor headings
 * 5. Body text uses 'large' (18px) for main content readability
 * 6. Never use custom text sizes - use TYPOGRAPHY constants only
 */
