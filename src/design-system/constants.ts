/**
 * Unified Design System Constants
 * Business-level constants (layout rules, CTA text, brand, card styles)
 * 
 * Raw design tokens live in tokens.ts — this file provides
 * higher-level constants used directly in components.
 */

// Layout Standards
export const LAYOUT = {
  maxWidth: 'max-w-7xl',
  sectionSpacing: {
    major: 'py-20 md:py-28 lg:py-32',
    subsection: 'py-16 md:py-20',
    tight: 'py-12 md:py-16',
  },
  containerPadding: 'px-4 sm:px-6 lg:px-8',
} as const;

// Typography Hierarchy — Tailwind class presets
export const TYPOGRAPHY_STYLES = {
  pageTitle: 'text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight',
  sectionTitle: 'text-3xl md:text-4xl font-bold tracking-tight',
  subsectionTitle: 'text-2xl md:text-3xl font-semibold',
  cardTitle: 'text-xl md:text-2xl font-semibold',
  bodyLarge: 'text-lg md:text-xl leading-relaxed',
  bodyDefault: 'text-base md:text-lg leading-relaxed',
  label: 'text-sm font-medium uppercase tracking-wider',
} as const;

// Unified CTA Text
export const CTA_TEXT = {
  primary: 'Request a Proposal',
  secondary: 'View Services',
  gc: 'For GCs: Request Unit Pricing',
  project: 'Request Project Quote',
  contact: 'Start Your Project',
  viewProjects: 'View Projects',
  learnMore: 'Learn More',
  proposal: 'Request Proposal',
  homeConsultation: 'Book Home Consultation',
  residentialServices: 'View Residential Services',
  startProject: 'Start Your Project',
  callNow: 'Call Us Today',
  getEstimate: 'Request Estimate',
} as const;

// Card Styling Presets — utility classes for inline card styling
export const CARD_STYLES = {
  base: 'rounded-[var(--radius-lg)] border border-border bg-card',
  elevated: 'rounded-[var(--radius-lg)] border border-border bg-card shadow-[var(--shadow-md)]',
  hover: 'transition-all duration-200 hover:shadow-[var(--shadow-lg)] hover:-translate-y-1',
  interactive: 'cursor-pointer transition-all duration-200 hover:shadow-[var(--shadow-lg)] hover:-translate-y-1',
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
