/**
 * Unified Design System Constants
 * Single source of truth for all design decisions across the site
 */

// Layout Standards - Enterprise-Grade Spacing
export const LAYOUT = {
  maxWidth: 'max-w-7xl',
  sectionSpacing: {
    major: 'py-20 md:py-28 lg:py-32',       // 128-200px - Major sections (increased)
    subsection: 'py-16 md:py-20',           // 96-128px - Subsections (increased)
    tight: 'py-12 md:py-16',                // 64-96px - Compact sections (increased)
  },
  containerPadding: 'px-4 sm:px-6 lg:px-8',
} as const;

// Typography Hierarchy - Professional Scale
export const TYPOGRAPHY_STYLES = {
  // Page titles - bold, commanding
  pageTitle: 'text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight',
  // Section headings - clear hierarchy
  sectionTitle: 'text-3xl md:text-4xl font-bold tracking-tight',
  // Subsection headings
  subsectionTitle: 'text-2xl md:text-3xl font-semibold',
  // Card titles
  cardTitle: 'text-xl md:text-2xl font-semibold',
  // Body text
  bodyLarge: 'text-lg md:text-xl leading-relaxed',
  bodyDefault: 'text-base md:text-lg leading-relaxed',
  // Labels and small text
  label: 'text-sm font-medium uppercase tracking-wider',
} as const;

// Unified CTA Text
export const CTA_TEXT = {
  // Commercial/Professional CTAs
  primary: 'Request Site Assessment',
  secondary: 'View Services',
  gc: 'For GCs: Request Unit Pricing',
  project: 'Request Project Quote',
  contact: 'Contact Us',
  viewProjects: 'View Projects',
  learnMore: 'Learn More',
  
  // Homeowner-Friendly CTAs
  freeQuote: 'Get Free Quote',
  freeEstimate: 'Get Free Estimate',
  homeConsultation: 'Book Home Consultation',
  residentialServices: 'View Residential Services',
  startProject: 'Start Your Project',
  callNow: 'Call Us Today',
} as const;

// Card & Component Styling
export const CARD_STYLES = {
  base: 'rounded-[var(--radius-lg)] border border-border bg-card',
  elevated: 'rounded-[var(--radius-lg)] border border-border bg-card shadow-[var(--shadow-md)]',
  hover: 'transition-all duration-300 hover:shadow-[var(--shadow-lg)] hover:-translate-y-2',
  interactive: 'cursor-pointer transition-all duration-300 hover:shadow-[var(--shadow-lg)] hover:-translate-y-2 active:scale-[0.98]',
} as const;

// Unified Hover States
export const HOVER_STATES = {
  card: 'hover:-translate-y-2 hover:shadow-[var(--shadow-lg)] transition-all duration-300',
  button: 'hover:opacity-90 transition-opacity duration-[150ms]',
  link: 'hover:text-primary transition-colors duration-[150ms]',
  scale: 'hover:scale-105 transition-transform duration-300',
  lift: 'hover:-translate-y-1 transition-transform duration-300',
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
