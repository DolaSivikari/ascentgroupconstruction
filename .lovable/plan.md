

# Blend Technology Page into Site Theme

## Problem
The Technology page (`/company/technology`) uses a completely different visual language than the rest of the site:
- **Full-screen dark cinematic hero** vs. the standard `PageHero` with breadcrumbs and background image
- **Multiple dark `bg-foreground` sections** (hero, scrollytelling, timeline, manifesto) — the rest of the site is predominantly light backgrounds
- **No shared components** — doesn't use `Section`, `SectionHeader`, `CapabilityCard`, `CTABand`, or `PageHero`
- **Pill-shaped buttons** (`rounded-full`) vs. the site's standard `Button` component
- **Monospace eyebrow text** (`font-mono uppercase tracking-widest`) not used anywhere else on the site
- **No breadcrumb navigation** in the hero

The interactive features (scrollytelling, constellation, slider, tabs, timeline) are good — the problem is purely the wrapper/chrome around them.

## Approach
Keep all the interactive sections but re-skin them to use the site's standard layout primitives and light-background palette.

## Changes (all in `src/pages/company/Technology.tsx`)

### A. Replace cinematic hero with `PageHero`
- Swap the full-screen dark hero for the standard `PageHero` component with breadcrumbs, a background image, and the standard height/overlay
- Keep the same headline and description text

### B. Wrap all sections in `Section` component
- Replace raw `<section className="py-24 bg-...">` wrappers with `<Section size="major">` or `<Section size="subsection">`
- Use `SectionHeader` for section titles instead of custom eyebrow + h2 + description markup

### C. Light backgrounds for most sections
- Scrollytelling: Change from `bg-foreground text-background` (dark) to `bg-muted/30` (light) — adjust all text colors from `text-background` to `text-foreground`
- Constellation: Already light — just wrap in `Section`
- Before/After slider: Already light — wrap in `Section`
- Audience tabs: Already light — wrap in `Section`
- Timeline: Change from `bg-foreground` (dark) to light, adjust text colors
- Keep ONE dark section: the manifesto CTA at the bottom — replace with `CTABand` component

### D. Replace pill buttons with `Button` component
- Import `Button` from `@/ui/Button` and use standard `variant="primary"` / `variant="outline"` with `asChild` + `Link`

### E. Remove monospace eyebrows
- Replace `font-mono uppercase tracking-widest` patterns with standard `SectionHeader` or plain `text-sm font-medium text-primary uppercase tracking-wider` (matching the site's label style)

### F. Replace manifesto section with `CTABand`
- Use the standard dark CTA section component that every other page uses

## What stays the same
- All interactive logic: scroll-driven phase switching, constellation SVG with hover tooltips, before/after drag slider, audience tabs, horizontal scroll timeline
- All data arrays (phases, tools, connections, before/after items, audience tabs, timeline nodes)
- Framer Motion animations (fade-in, stagger, scroll-linked transforms)
- Reduced motion fallbacks

## Files modified
- `src/pages/company/Technology.tsx` — re-skin to use site components and light theme

