

# Merge Final CTA — 6 Cards, Two Rows

## Concept

Combine the current 3 dark-background cards (Request a Proposal, View Our Portfolio, Get Prequalified) with the old 3 light-style cards (Submit an RFP, Request an Estimate, Contact Our Team) into one unified section with 6 cards across two visual rows.

## Design

Use the user's preferred **light style** (`bg-primary/5`, `bg-card` cards with border hover) for all 6 cards, arranged in a **2-row × 3-column grid**.

### Section layout
- Background: `bg-primary/5` (light, not dark gradient)
- Centered header with title + subtitle
- Grid: `grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto`

### The 6 cards

**Row 1 — Action CTAs (from old style)**
1. **Submit an RFP** → `/submit-rfp` — FileText icon — "Send us your project documents for a detailed scope review and pricing proposal."
2. **Request an Estimate** → `/estimate` — Calculator icon — "Get a preliminary estimate for your commercial, multi-unit, or residential scope."
3. **Contact Our Team** → `/contact` — MessageSquare icon — "Reach our project team to discuss timelines, capabilities, or general inquiries."

**Row 2 — Explore CTAs (from current)**
4. **Request a Proposal** → `/contact` — ClipboardList icon — "Tell us about your project and get a detailed, itemised estimate with transparent pricing."
5. **View Our Portfolio** → `/projects` — FolderOpen icon — "Browse completed building envelope, restoration, and specialty trade projects across Ontario."
6. **Get Prequalified** → `/prequalification` — ClipboardList icon — "General contractors: download our prequalification package and add us to your approved trade list."

### Card style (matching old HTML)
- `<Link>` wrapper with `group` class
- `bg-card border hover:border-primary/50 hover:shadow-[var(--shadow-lg)]` 
- Circular icon badge: `w-14 h-14 rounded-full bg-primary/10`
- Title, description, text-link with arrow (not a full Button)
- Keep `useScrollFadeIn` + `useStaggerAnimation` for entrance animations

## File changed
- `src/components/homepage/HomepageFinalCta.tsx` — full rewrite

