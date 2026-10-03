/**
 * Unified Design System Tokens
 * Single source of truth for all design decisions
 */

// ============================================
// SPACING SCALE (8px base)
// ============================================
export const SPACING = {
  xs: '0.5rem',    // 8px
  sm: '0.75rem',   // 12px
  md: '1rem',      // 16px
  lg: '1.5rem',    // 24px
  xl: '2rem',      // 32px
  '2xl': '2.5rem', // 40px
  '3xl': '3rem',   // 48px
  '4xl': '4rem',   // 64px
} as const;

// ============================================
// BORDER RADIUS (Unified System - 3 sizes only)
// ============================================
export const RADIUS = {
  none: '0',
  sm: '0.5rem',    // 8px - Buttons, badges
  md: '0.75rem',   // 12px - Dedicated image/feature frames
  lg: '1rem',      // 16px - Hero sections, large features
  full: '9999px',  // Circles only
} as const;

// Border Radius Utility Classes (USE THESE IN COMPONENTS)
export const BORDER_RADIUS = {
  button: 'rounded-[var(--radius-sm)]',    // 8px
  card: 'rounded-[var(--card-border-radius)]', // 8px
  hero: 'rounded-[var(--radius-lg)]',      // 16px
  full: 'rounded-full',                     // Circles only
} as const;

// ============================================
// SHADOWS (Elevation System)
// ============================================
export const SHADOW = {
  none: 'none',
  sm: '0 1px 2px 0 hsl(var(--primary) / 0.05)',
  md: '0 4px 6px -1px hsl(var(--primary) / 0.1), 0 2px 4px -2px hsl(var(--primary) / 0.1)',
  lg: '0 10px 15px -3px hsl(var(--primary) / 0.1), 0 4px 6px -4px hsl(var(--primary) / 0.1)',
  xl: '0 20px 25px -5px hsl(var(--primary) / 0.1), 0 8px 10px -6px hsl(var(--primary) / 0.1)',
  '2xl': '0 25px 50px -12px hsl(var(--primary) / 0.25)',
  inner: 'inset 0 2px 4px 0 hsl(var(--primary) / 0.05)',
} as const;

// ============================================
// TRANSITIONS (Timing System)
// ============================================
export const TRANSITION = {
  fast: '150ms cubic-bezier(0.22, 1, 0.36, 1)',
  base: '300ms cubic-bezier(0.22, 1, 0.36, 1)',
  medium: '300ms cubic-bezier(0.22, 1, 0.36, 1)',
  slow: '500ms cubic-bezier(0.22, 1, 0.36, 1)',
} as const;

export const DURATION = {
  fast: 150,    // Micro-interactions (hover, click)
  base: 300,    // Standard transitions (DEFAULT)
  slow: 500,    // Page transitions only
} as const;

// Duration Utility Classes (USE THESE IN COMPONENTS)
export const DURATION_CLASS = {
  fast: 'duration-150',   // Hover states, clicks
  base: 'duration-300',        // Default for most animations
  slow: 'duration-500',        // Page transitions only
} as const;

// ============================================
// Z-INDEX LAYERS
// ============================================
export const Z_INDEX = {
  base: 0,
  dropdown: 10,
  sticky: 20,
  fixed: 30,
  overlay: 40,
  modal: 50,
  popover: 60,
  toast: 70,
  tooltip: 80,
} as const;

// ============================================
// TYPOGRAPHY SCALE
// ============================================
export const TYPOGRAPHY = {
  fontSize: {
    xs: '0.75rem',     // 12px
    sm: '0.875rem',    // 14px
    base: '1rem',      // 16px
    lg: '1.125rem',    // 18px
    xl: '1.25rem',     // 20px
    '2xl': '1.5rem',   // 24px
    '3xl': '1.875rem', // 30px
    '4xl': '2.25rem',  // 36px
    '5xl': '3rem',     // 48px
    '6xl': '3.75rem',  // 60px
  },
  fontWeight: {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
  lineHeight: {
    tight: '1.25',
    normal: '1.5',
    relaxed: '1.75',
  },
} as const;

// ============================================
// ANIMATION PRESETS
// ============================================
export const ANIMATION = {
  fadeIn: {
    duration: DURATION.base,
    delay: 0,
  },
  slideUp: {
    duration: DURATION.base,
    delay: 0,
  },
  scaleIn: {
    duration: DURATION.base,
    delay: 0,
  },
  stagger: {
    duration: DURATION.base,
    staggerDelay: 100,
  },
} as const;

// ============================================
// INTERACTION STATES
// ============================================
export const INTERACTION = {
  hover: {
    scale: 1.02,
    transition: TRANSITION.base,
  },
  active: {
    scale: 0.98,
    transition: TRANSITION.fast,
  },
  focus: {
    ring: '2px',
    ringOffset: '2px',
  },
} as const;

// ============================================
// GRID SYSTEM (Canonical — replaces layouts.ts)
// ============================================
export const GRID = {
  cols: {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  },
  gap: {
    sm: 'gap-4',
    md: 'gap-6',
    lg: 'gap-8',
    xl: 'gap-12',
  },
} as const;

// Named grid patterns for common layouts
export const GRID_PATTERNS = {
  /** 2-column card grid */
  cards2: 'grid grid-cols-1 md:grid-cols-2 gap-8',
  /** 3-column card grid — MOST COMMON */
  cards3: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8',
  /** 4-column card grid */
  cards4: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6',
  /** 2-column feature grid with larger gap */
  features2: 'grid grid-cols-1 md:grid-cols-2 gap-12',
  /** 3-column feature grid with larger gap */
  features3: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12',
  /** Content + Sidebar (8/4 split) */
  contentSidebar: 'grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12',
  /** 50/50 split */
  split50: 'grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12',
  /** Stats row */
  stats: 'grid grid-cols-2 md:grid-cols-4 gap-6',
} as const;

// ============================================
// CONTAINER WIDTHS
// ============================================
export const CONTAINER = {
  sm: 'max-w-2xl',   // 672px
  md: 'max-w-4xl',   // 896px
  lg: 'max-w-6xl',   // 1152px
  xl: 'max-w-7xl',   // 1280px
  full: 'max-w-full',
} as const;
