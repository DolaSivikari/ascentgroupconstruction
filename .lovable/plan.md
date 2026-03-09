

# Hero System & Slide Strategy — Implementation Plan

## Files to Change

| File | Change |
|------|--------|
| `src/components/Navigation.tsx` | Add `'/estimate'` to `heroPages` (line ~76) |
| `src/data/enriched-hero-slides.ts` | Rewrite all 3 slides with new copy + add `secondaryCTA` field |
| `src/components/homepage/EnhancedHero.tsx` | Fix `mapAdminSlideToHero` to map `secondary_cta_text/url`; use per-slide secondary CTA instead of hardcoded "View Services"; add staggered animation delays |
| **DB update** (via insert tool) | Update 3 `hero_slides` rows with new headline, subheadline, CTAs, and secondary CTAs |

## Diagnosis Confirmed

**`/estimate` nav issue:** The route is simply missing from the `heroPages` array (lines 34-77). Every other hero page is listed. One-line fix.

**Secondary CTA data gap (end-to-end audit):**
- DB schema: `secondary_cta_text` and `secondary_cta_url` columns exist on `hero_slides` -- good
- `HeroSlide` TypeScript interface (`useHomepageData.ts` lines 38-39): includes both fields -- good
- `fetchHeroSlides` uses `select("*")` so both fields are returned -- good
- `mapAdminSlideToHero` (line 26-39): **does NOT map** `secondary_cta_text` or `secondary_cta_url` -- broken, must fix
- `EnhancedHero.tsx` render (lines 353-357): **hardcoded** `Link to="/services"` with text "View Services" -- must replace with per-slide data
- Fallback data (`enriched-hero-slides.ts`): **no `secondaryCTA` field** -- must add

## Exact Changes

### 1. Navigation — add `/estimate`
Add `'/estimate'` to the `heroPages` array. Single line.

### 2. Fallback slides — new copy + secondary CTAs

**Slide 1 — Positioning**
- Headline: "Specialty Contractor for Building Envelope, Restoration & Interior Trade Execution"
- Subheadline: "Self-performed and coordinated scopes for commercial, multi-unit, and selected residential projects across the GTA."
- Primary CTA: Submit RFP → /submit-rfp
- Secondary CTA: Explore Services → /services

**Slide 2 — Operational Trust**
- Headline: "Clear Scopes. Reliable Coordination. Professional Closeout."
- Subheadline: "Occupied-building sensitivity, schedule-aware execution, documented QA/QC, and practical communication from inquiry through closeout."
- Primary CTA: How We Work → /our-process
- Secondary CTA: For General Contractors → /for-general-contractors

**Slide 3 — Market Fit**
- Headline: "Built for GCs, Property Managers, Developers & Commercial Clients"
- Subheadline: "Envelope repairs, restoration scopes, coatings, interior buildouts, and coordinated trade packages where reliability matters."
- Primary CTA: View Markets → /markets
- Secondary CTA: Contact Us → /contact

### 3. EnhancedHero.tsx changes

**`mapAdminSlideToHero`** — add:
```
secondaryCTA: {
  label: slide.secondary_cta_text?.trim() || fallbackMedia.secondaryCTA.label,
  href: slide.secondary_cta_url?.trim() || fallbackMedia.secondaryCTA.href,
}
```

**Render** — replace hardcoded "View Services" button with:
```
{secondaryCTA && (
  <Button asChild ...>
    <Link to={secondaryCTA.href}>{secondaryCTA.label}</Link>
  </Button>
)}
```

**Staggered animation** — add `animation-delay` via inline styles:
- Badge: 0ms
- Headline: 50ms  
- Subheadline: 100ms
- CTAs: 150ms

**Overlay tuning** — current overlay is `from-black/70 via-black/60 to-black/80`. This is uniform for all slides. Since all three slides use the same video/poster currently, no per-slide tuning is needed now. If distinct images are added later, per-slide overlay can be data-driven. Current overlay strength is adequate for white text readability.

### 4. DB update — 3 hero_slides rows
Update all 3 active rows with matching new copy and secondary CTA values using the insert (data update) tool.

## What Will Be Preserved
- All autoplay, swipe, reduced-motion, play/pause, video preloading logic
- CMS → fallback cascade (admin DB overrides fallback file)
- `hero-ready` event dispatch
- Slide indicator dots and scroll indicator
- All form logic on all pages
- No other pages or components touched

## Checks
- `/estimate` nav transparent on load, solid on scroll
- Homepage slides render new copy
- Secondary CTAs appear per-slide from data
- Fallback slides work if DB returns empty
- Console error check
- No TypeScript type errors in the mapping chain

## Risk Notes
- DB update changes live public content immediately (intentional — new copy is aligned with positioning standards)
- If admin edits slides later via HomepageBuilder, those edits override; fallback file is safety net only

