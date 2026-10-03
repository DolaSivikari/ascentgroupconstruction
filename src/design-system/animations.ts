/**
 * Unified Animation System
 * Consistent animation patterns across the entire site
 */

import { CARD_STYLES } from './constants';

/**
 * Standard stagger delays for card grids
 * Use these to create sequential reveal animations
 */
export const STAGGER_DELAYS = {
  /** No stagger - all items animate together */
  none: 0,
  /** Subtle stagger - 50ms between items */
  subtle: 50,
  /** Standard stagger - 100ms between items (default) */
  standard: 100,
  /** Pronounced stagger - 150ms between items */
  pronounced: 150,
  /** Dramatic stagger - 200ms between items */
  dramatic: 200,
} as const;

export type StaggerDelay = typeof STAGGER_DELAYS[keyof typeof STAGGER_DELAYS];

/**
 * Calculate stagger delay for an item in a grid
 * @param index - Item index (0-based)
 * @param staggerAmount - Delay between items in ms
 * @returns Delay in milliseconds
 */
export const getStaggerDelay = (index: number, staggerAmount: StaggerDelay = STAGGER_DELAYS.standard): number => {
  return index * staggerAmount;
};

/**
 * Standard animation configurations
 */
export const ANIMATIONS = {
  /** Fade in from below (most common) */
  fadeInUp: {
    direction: 'up' as const,
    threshold: 0.1,
  },
  /** Fade in from left */
  fadeInLeft: {
    direction: 'left' as const,
    threshold: 0.1,
  },
  /** Fade in from right */
  fadeInRight: {
    direction: 'right' as const,
    threshold: 0.1,
  },
} as const;

/**
 * Interactive hover states
 * Apply these classes for consistent hover behavior
 */
export const INTERACTIONS = {
  /** Standard card hover - lift + shadow increase */
  cardHover: `${CARD_STYLES.motion} ${CARD_STYLES.hover}`,
  
  /** Button hover - slight opacity change */
  buttonHover: 'hover:opacity-90 transition-opacity duration-300 motion-reduce:transition-none',
  
  /** Link hover - color change */
  linkHover: 'hover:text-primary transition-colors duration-150 motion-reduce:transition-none',
  
  /** Active/click state - slight scale down */
  activeClick: 'active:scale-[0.98] transition-transform duration-150 motion-reduce:active:scale-100 motion-reduce:transition-none',
} as const;

/**
 * Pre-configured animation classes for common patterns
 */
export const ANIMATION_CLASSES = {
  /** Standard section fade in */
  section: 'animate-fade-in',
  
  /** Card grid with stagger */
  cardGrid: 'animate-fade-in',
  
  /** Hero section */
  hero: 'animate-fade-in',
  
  /** Navigation items */
  navItem: 'transition-colors duration-150 motion-reduce:transition-none',
} as const;
