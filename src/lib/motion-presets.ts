/**
 * Motion Presets — single source of truth for site-wide motion
 *
 * Why: most sites feel "templated" because they use default easings.
 * cubic-bezier(0.22, 1, 0.36, 1) ("expo-out") decelerates hard at the end
 * and reads as physical motion. Pair it with consistent stagger + duration
 * and every animation on the site upgrades at once.
 */

import type { Variants } from "framer-motion";

/** Premium ease-out curve — feels physical, not mechanical. */
export const EASE_EXPO_OUT = [0.22, 1, 0.36, 1] as const;

/** Stagger delays (seconds) between sibling animations. */
export const STAGGER = {
  tight: 0.04,
  base: 0.06,
  loose: 0.08,
} as const;

/** Animation durations (seconds). */
export const DURATION = {
  fast: 0.3,
  base: 0.5,
  slow: 0.7,
} as const;

/* ─────────────────────────────────────────────────────────────
 * Reusable Framer Motion variants
 * All pre-wired to EASE_EXPO_OUT.
 * ────────────────────────────────────────────────────────────── */

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: DURATION.base, ease: EASE_EXPO_OUT },
  },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: DURATION.base, ease: EASE_EXPO_OUT },
  },
};

export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: STAGGER.base,
      delayChildren: 0.05,
    },
  },
};

/** Per-word reveal — used by <RevealText> for headline entrances. */
export const wordReveal: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: DURATION.base, ease: EASE_EXPO_OUT },
  },
};
