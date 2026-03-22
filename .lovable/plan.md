

## Plan: Smooth Homepage Section Flow

### Problem

Every section has its own hard background color (`bg-background`, `bg-muted/30`, gradient) creating sharp visual cuts between them. Combined with each section having both top AND bottom padding (two adjacent `py-20` sections create 160px of whitespace between them), the page feels like 8 disconnected blocks stacked on top of each other instead of one cohesive scroll.

### Current Spacing Audit

| Section | Padding | Background | Issue |
|---------|---------|------------|-------|
| Hero | viewport | dark | -- |
| ProofStrip | `py-6` | none | Too tight, feels orphaned |
| ServiceHighlights | `py-20 md:py-28` | `bg-background` | Hard cut from proof strip |
| WhoWeServe | `py-20 md:py-28 lg:py-32` | `bg-muted/30` | Hard bg switch |
| FeaturedProjects | `py-20 md:py-28 lg:py-32` | `bg-muted/30` | Same bg as above but double padding between |
| WhyChooseUs | `py-20 md:py-28 lg:py-32` | `bg-muted/30` | Same bg again, triple stacking |
| ProcessStrip | `py-20 md:py-28 lg:py-32` | gradient `muted/40 -> background` | Gradient helps but still cuts |
| FinalCTA | `py-20 md:py-28` | primary gradient | Intentionally distinct (keep) |

### Solution: 3 Changes

**1. Group sections into visual "zones" with shared backgrounds**

Instead of each section owning its own background, wrap groups of sections in a shared background container in `Index.tsx`. This eliminates hard color cuts:

- **Zone A** (white): Hero + ProofStrip + ServiceHighlights
- **Zone B** (muted): WhoWeServe + FeaturedProjects + WhyChooseUs
- **Zone C** (gradient): ProcessStrip (gradient from muted to white)
- **Zone D** (primary): FinalCTA (keep as-is)

**2. Reduce section padding to use only top-padding (except first/last in zone)**

Replace symmetric `py-*` with asymmetric padding so adjacent sections within a zone share space naturally. Each section gets `pt-16 md:pt-20` instead of `py-20 md:py-28`, with only the last section in a zone getting bottom padding.

**3. Connect the ProofStrip to the ServiceHighlights visually**

Increase ProofStrip padding from `py-6` to `pt-8 pb-0` and remove its own `<section>` border, letting it breathe into the section below.

### Technical Details

**Files changed:**

| File | Change |
|------|--------|
| `src/pages/Index.tsx` | Wrap sections in zone `<div>`s with shared backgrounds |
| `src/components/homepage/HomepageProofStrip.tsx` | Adjust padding: `py-6` -> `pt-10 pb-2` for flow into next section |
| `src/components/homepage/HomepageServiceHighlights.tsx` | Change `py-20 md:py-28` -> `pt-12 md:pt-16 pb-20 md:pb-28`, remove `bg-background` |
| `src/components/homepage/WhoWeServeHomepage.tsx` | Remove `bg-muted/30` from Section className (zone handles it), reduce top padding |
| `src/components/homepage/HomepageFeaturedProjects.tsx` | Remove `bg-muted/30`, reduce to `pt-8 md:pt-12 pb-20 md:pb-28` |
| `src/components/homepage/WhyChooseUs.tsx` | Remove `bg-muted/30`, adjust padding |
| `src/components/homepage/HomepageProcessStrip.tsx` | Adjust gradient to flow from zone B bg into white, reduce top padding |
| `src/components/homepage/HomepageFinalCta.tsx` | Keep as-is (intentionally distinct) |

### What This Achieves
- Sections within the same zone feel connected, not cut apart
- Reduced total whitespace between sections (no more double-padding)
- Background transitions happen at zone boundaries only (2-3 transitions instead of 7)
- ProofStrip flows naturally into service highlights
- No content removed, no reordering, just spacing and background fixes

