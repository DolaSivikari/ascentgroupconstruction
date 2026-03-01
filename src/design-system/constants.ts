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

// Unified CTA Text - Professional Language
export const CTA_TEXT = {
  // Commercial/Professional CTAs
  primary: 'Request a Proposal',
  secondary: 'View Services',
  gc: 'For GCs: Request Unit Pricing',
  project: 'Request Project Quote',
  contact: 'Start Your Project',
  viewProjects: 'View Projects',
  learnMore: 'Learn More',
  proposal: 'Request Proposal',
  
  // Homeowner-Friendly CTAs (professional but approachable)
  homeConsultation: 'Book Home Consultation',
  residentialServices: 'View Residential Services',
  startProject: 'Start Your Project',
  callNow: 'Call Us Today',
  getEstimate: 'Request Estimate',
} as const;

// Spacing System - Audit Aligned (48px, 64px, 96px)
export const SPACING = {
  sectionPadding: {
    sm: '48px',   // py-12
    md: '64px',   // py-16
    lg: '96px',   // py-24
  },
  componentGap: {
    sm: '24px',   // gap-6
    md: '32px',   // gap-8
    lg: '48px',   // gap-12
  },
  cardPadding: '24px',  // p-6
} as const;

// Card & Component Styling - Standardized
export const CARD_STYLES = {
  base: 'rounded-[var(--radius-lg)] border border-border bg-card',
  elevated: 'rounded-[var(--radius-lg)] border border-border bg-card shadow-[var(--shadow-md)]',
  hover: 'transition-all duration-200 hover:shadow-[var(--shadow-lg)] hover:-translate-y-1',
  interactive: 'cursor-pointer transition-all duration-200 hover:shadow-[var(--shadow-lg)] hover:-translate-y-1',
} as const;

// Unified Hover States - Simplified & Consistent
export const HOVER_STATES = {
  card: 'hover:-translate-y-1 hover:shadow-[var(--shadow-lg)] transition-all duration-200',
  button: 'hover:opacity-90 transition-opacity duration-150',
  link: 'hover:text-primary transition-colors duration-150',
  scale: 'hover:scale-[1.02] transition-transform duration-200',
  lift: 'hover:-translate-y-1 transition-transform duration-200',
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
