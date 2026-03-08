/**
 * Grid System — Re-exports from tokens.ts for backward compatibility
 * 
 * Canonical grid definitions now live in tokens.ts (GRID, GRID_PATTERNS).
 * This file provides the old API shape so existing imports don't break.
 */

import { cn } from "@/lib/utils";
import { GRID_PATTERNS } from "@/design-system/tokens";

// Re-export the named grid patterns as GRID (old API name)
export const GRID = {
  cards2: GRID_PATTERNS.cards2,
  cards3: GRID_PATTERNS.cards3,
  cards4: GRID_PATTERNS.cards4,
  features2: GRID_PATTERNS.features2,
  features3: GRID_PATTERNS.features3,
  contentSidebar: GRID_PATTERNS.contentSidebar,
  contentMain: 'lg:col-span-8',
  contentAside: 'lg:col-span-4',
  split50: GRID_PATTERNS.split50,
  split33: 'grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12',
  split33Left: 'lg:col-span-4',
  split33Right: 'lg:col-span-8',
  split66: 'grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12',
  split66Left: 'lg:col-span-8',
  split66Right: 'lg:col-span-4',
} as const;

export const GAP = {
  tight: 'gap-4',
  standard: 'gap-8',
  loose: 'gap-12',
  xl: 'gap-16',
} as const;

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
  const baseGrid = gridMap[columns].replace('gap-8', '').replace('gap-6', '');
  return cn(baseGrid, GAP[gap], className);
};

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

export const getContentSidebarClasses = () => ({
  container: GRID.contentSidebar,
  main: GRID.contentMain,
  aside: GRID.contentAside,
});

export const GRID_PRESETS = {
  services: GRID.cards3,
  projects: GRID.cards3,
  team: GRID.cards4,
  testimonials: GRID.cards2,
  blog: GRID.cards3,
  features: GRID.features2,
  stats: GRID_PATTERNS.stats,
} as const;
