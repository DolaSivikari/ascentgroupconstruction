/**
 * Unified Grid System
 * Enterprise-grade layout patterns used across the entire site
 * 
 * Enterprise Rule: Use ONLY these grid patterns
 * No custom grid implementations allowed
 */

import { cn } from "@/lib/utils";

/**
 * Standard Grid Patterns
 * Based on 12-column grid system (desktop) / 4-column (mobile)
 */
export const GRID = {
  /** 2-column card grid (1 mobile, 2 desktop) */
  cards2: 'grid grid-cols-1 md:grid-cols-2 gap-8',
  
  /** 3-column card grid (1 mobile, 2 tablet, 3 desktop) - MOST COMMON */
  cards3: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8',
  
  /** 4-column card grid (1 mobile, 2 tablet, 4 desktop) */
  cards4: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6',
  
  /** 2-column feature grid with larger gap */
  features2: 'grid grid-cols-1 md:grid-cols-2 gap-12',
  
  /** 3-column feature grid with larger gap */
  features3: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12',
  
  /** Content + Sidebar layout (8/4 split) */
  contentSidebar: 'grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12',
  
  /** Content area (8 columns of 12) */
  contentMain: 'lg:col-span-8',
  
  /** Sidebar area (4 columns of 12) */
  contentAside: 'lg:col-span-4',
  
  /** 2-column split (6/6) */
  split50: 'grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12',
  
  /** 2-column split (4/8) */
  split33: 'grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12',
  split33Left: 'lg:col-span-4',
  split33Right: 'lg:col-span-8',
  
  /** 2-column split (8/4) */
  split66: 'grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12',
  split66Left: 'lg:col-span-8',
  split66Right: 'lg:col-span-4',
} as const;

/**
 * Gap Scale
 * Standard spacing between grid items
 */
export const GAP = {
  /** Tight spacing - small cards, compact layouts */
  tight: 'gap-4',
  
  /** Standard spacing - most common for cards */
  standard: 'gap-8',
  
  /** Loose spacing - features, large content */
  loose: 'gap-12',
  
  /** Extra loose - major sections */
  xl: 'gap-16',
} as const;

/**
 * Helper Functions
 */

/**
 * Get grid classes for card layouts
 */
export const getCardGridClasses = (
  columns: 2 | 3 | 4 = 3,
  gap: keyof typeof GAP = 'standard',
  className?: string
) => {
  const gridMap = {
    2: GRID.cards2,
    3: GRID.cards3,
    4: GRID.cards4,
  };
  
  // Replace default gap with custom gap
  const baseGrid = gridMap[columns].replace('gap-8', '').replace('gap-6', '');
  
  return cn(baseGrid, GAP[gap], className);
};

/**
 * Get grid classes for feature layouts
 */
export const getFeatureGridClasses = (
  columns: 2 | 3 = 2,
  className?: string
) => {
  const gridMap = {
    2: GRID.features2,
    3: GRID.features3,
  };
  
  return cn(gridMap[columns], className);
};

/**
 * Get content + sidebar layout classes
 */
export const getContentSidebarClasses = () => ({
  container: GRID.contentSidebar,
  main: GRID.contentMain,
  aside: GRID.contentAside,
});

/**
 * Grid Usage Rules (Enterprise Standards)
 * 
 * 1. Cards always use cards2, cards3, or cards4
 * 2. Features use features2 or features3 (larger gap)
 * 3. Content pages use contentSidebar layout
 * 4. Never use custom grid-cols or gap values
 * 5. Mobile is always single column (grid-cols-1)
 * 6. Tablet is always 2 columns (md:grid-cols-2)
 * 7. Desktop uses 3-4 columns based on content density
 */

/**
 * Pre-configured Grid Components (Optional)
 * Use these for maximum consistency
 */

export const GRID_PRESETS = {
  /** Service cards (3 columns) */
  services: GRID.cards3,
  
  /** Project cards (3 columns) */
  projects: GRID.cards3,
  
  /** Team members (4 columns) */
  team: GRID.cards4,
  
  /** Testimonials (2 columns) */
  testimonials: GRID.cards2,
  
  /** Blog posts (3 columns) */
  blog: GRID.cards3,
  
  /** Features (2 columns, large gap) */
  features: GRID.features2,
  
  /** Stats (4 columns, tight gap) */
  stats: 'grid grid-cols-2 md:grid-cols-4 gap-6',
} as const;
