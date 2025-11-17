/**
 * Unified Design System Constants
 * Single source of truth for all design decisions across the site
 */

// Layout Standards
export const LAYOUT = {
  maxWidth: 'max-w-7xl',
  sectionSpacing: {
    major: 'py-24 md:py-32 lg:py-40',
    subsection: 'py-16 md:py-24 lg:py-32',
    tight: 'py-12 md:py-16 lg:py-20',
  },
  containerPadding: 'px-4 sm:px-6 lg:px-8',
} as const;

// Unified CTA Text
export const CTA_TEXT = {
  primary: 'Request Site Assessment',
  secondary: 'View Services',
  gc: 'For GCs: Request Unit Pricing',
  project: 'Request Project Quote',
  contact: 'Contact Us',
  viewProjects: 'View Projects',
  learnMore: 'Learn More',
} as const;

// Card & Component Styling
export const CARD_STYLES = {
  base: 'rounded-[var(--radius-md)] border border-border bg-card',
  elevated: 'rounded-[var(--radius-md)] border border-border bg-card shadow-[0_8px_30px_rgb(0,0,0,0.12)]',
  hover: 'transition-all duration-300 hover:shadow-[0_20px_60px_rgb(0,0,0,0.20)] hover:-translate-y-2 hover:scale-[1.02]',
} as const;

// Animation Presets
export const ANIMATIONS = {
  fadeIn: 'animate-fade-in',
  slideUp: 'animate-slide-in-right',
  hover: 'transition-all duration-200 hover:scale-[1.02]',
  easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
} as const;

// Brand Voice & Positioning
export const BRAND = {
  positioning: "Envelope & Restoration Contractor — Ontario & GTA",
  tagline: "Envelope & Restoration Contractor — Ontario & GTA",
  fullName: "Ascent Group Construction",
  colors: {
    primary: "Navy Blue #003366",
    accent: "Construction Orange #F97316", 
    secondary: "Charcoal Gray #36454F"
  }
} as const;
