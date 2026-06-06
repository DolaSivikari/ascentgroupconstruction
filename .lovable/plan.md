## Bring the 9 Wave 1+2 SEO pages in line with the standard service layout

### What's wrong today
The Wave 1+2 pages use a custom `Wave1ServicePage.tsx` template that bypasses the project's canonical service page composition (`src/pages/ServiceDetail.tsx`). Specifically they:

- Use `PageHero` without an `image` — flat hero, no overlay, no imagery
- Skip the **Hero Badges System** (frosted-glass pills) — violates `mem://design/hero-badges-system`
- Use `ProofStrip` standalone instead of `TrustRibbon` (the standard service-page trust band)
- Hand-roll their own related-services + final CTA blocks instead of `RelatedLinksGrid` + `CTABand`
- Skip `DirectAnswer`, `QuickFacts`, `PeopleAlsoAsk`, `ServiceAreaSection` — the four AEO blocks the rest of the site (and ServiceDetail.tsx) ships
- Skip the Service + HowTo JSON-LD pair that ServiceDetail emits

### The fix (per your choices)
1. **Delete** `src/components/services/Wave1ServicePage.tsx`.
2. **Convert each of the 9 pages** to a direct, self-contained component that mirrors `ServiceDetail.tsx`'s composition exactly — same imports, same section order, same components. Content still comes from `src/data/wave1-services.ts` (no copy rewrite — just rebind to the standard components).
3. **Generate 9 branded hero images** via `imagegen` (one per service) at `src/assets/heroes/wave-<slug>.jpg`, then wire each into the page's `PageHero image` prop with the standard dark gradient overlay + hero badges.

### Final page composition (matches ServiceDetail.tsx)
```text
Navigation
PageHero  (image + overlay="dark" + eyebrow + breadcrumbs + hero badges + primary/secondary CTA)
TrustRibbon  ($2M CGL · WSIB · Self-Perform · 15+ yrs)
DirectAnswer  (citation paragraph)
QuickFacts  (scope bullets → quick-facts grid)
[Materials chips section]  (keep as-is, restyled to match Card pattern)
PeopleAlsoAsk  (3-5 of the FAQ entries promoted)
ServiceAreaSection  (GTA city grid)
FAQAccordion  (full FAQ set, emits FAQPage JSON-LD)
RelatedLinksGrid  (siblings from related[] + EIFS anchor)
CTABand  (variant="dark", CTA → /estimate?service=<slug>)
Footer
```

### Data layer (`src/data/wave1-services.ts`)
- **Extend** the `Wave1ServicePage` interface with optional `quickFacts` (4-6 items) and `peopleAlsoAsk` (3-5 promoted FAQs). Default both from existing `scopeBullets` and `faqs` so no content rewriting is required.
- **Add** `heroImage` field per entry pointing to the generated asset path.
- No copy changes — directAnswer, scope, materials, FAQs, related all stay byte-identical.

### Files

**Deleted:**
- `src/components/services/Wave1ServicePage.tsx`

**Rewritten (9 — same filenames, new bodies):**
- `src/pages/services/CommercialPaintingGTA.tsx`
- `src/pages/services/ExteriorPaintingToronto.tsx`
- `src/pages/services/CaulkingSealantsToronto.tsx`
- `src/pages/services/FireRetardantCoatingsOntario.tsx` (keeps the `splitSections` rendering for its dual-audience scope)
- `src/pages/services/InteriorPaintingToronto.tsx`
- `src/pages/services/ResidentialExteriorPaintingGTA.tsx`
- `src/pages/services/TileInstallationToronto.tsx`
- `src/pages/services/FlooringInstallationGTA.tsx`
- `src/pages/services/HandymanPatchingToronto.tsx`

**Edited:**
- `src/data/wave1-services.ts` — add `heroImage`, optional `quickFacts`, optional `peopleAlsoAsk`
- Optionally extract a small `Wave1Sections.tsx` helper for the shared section sequence so each page file stays a one-liner that passes its slug — keeps maintenance trivial without resurrecting a monolithic template

**Generated (9 new image assets):**
- `src/assets/heroes/wave-commercial-painting.jpg`
- `src/assets/heroes/wave-exterior-painting.jpg`
- `src/assets/heroes/wave-caulking-sealants.jpg`
- `src/assets/heroes/wave-fire-retardant.jpg`
- `src/assets/heroes/wave-interior-painting.jpg`
- `src/assets/heroes/wave-residential-exterior.jpg`
- `src/assets/heroes/wave-tile-installation.jpg`
- `src/assets/heroes/wave-flooring-installation.jpg`
- `src/assets/heroes/wave-handyman-patching.jpg`

Image style brief (shared across all 9): professional documentary photography of GTA jobsite work, daylight, neutral Navy/Charcoal-friendly color grading, no faces, no logos, no AI-template gloss. 16:9, 1920x1080.

### Out of scope
- Copy rewrites (Direct Answers and FAQs stay as-is)
- Schema changes to the existing `services` Supabase table (these pages remain static)
- Route registry changes — `AppRoutes.tsx` and sitemap entries already point to the same filenames
- Wave 3 services

### Reply "go" and I'll build it.
