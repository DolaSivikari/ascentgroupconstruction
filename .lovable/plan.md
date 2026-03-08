

# Phase 2: /services Page Rebuild — Revised Plan

## A. Hero Spec — Locked

```
Eyebrow: "Services"
H1: "Specialty contracting services for envelope, restoration, and interior trade execution"
Support: "Self-performed and coordinated scopes across commercial, multi-unit, and residential projects in Ontario."
Primary CTA: "Submit an RFP" → /submit-rfp
Secondary CTA: "Request an Estimate" → /estimate
Height: medium
```

---

## B. All 8 Pillars Confirmed — Exact Route Mapping

| # | Pillar Title | Route | Exists? | How it resolves |
|---|---|---|---|---|
| 1 | Building Envelope & Restoration | `/services/building-envelope` | Yes | Static page `BuildingEnvelope.tsx` |
| 2 | EIFS, Stucco & Cladding | `/services/cladding-systems` | Yes | Static page `CladdingSystems.tsx` |
| 3 | Masonry & Concrete Repair | `/services/masonry-restoration` | Redirect | Route redirects to `/services/building-envelope`. DB slug `masonry-restoration` is published. Change: remove the redirect, let it fall through to `/services/:slug` → `ServiceDetail` which renders the published DB record. |
| 4 | Interior Buildouts & Finish Trades | `/services/interior-buildouts` | Yes | Static page `InteriorBuildouts.tsx` |
| 5 | Painting & Protective Coatings | `/services/painting-services` | Yes | Static page `PaintingServices.tsx` |
| 6 | Tile, Flooring & Surface Finishes | `/services/tile-flooring` | Yes | Static page `TileFlooring.tsx` |
| 7 | Condo & Multi-Unit Work | `/services/painting-services` | Yes | No dedicated page. Links to `PaintingServices.tsx` as closest scope. Card description will clarify this covers multi-unit painting and finishing scopes. |
| 8 | Renovation & Retrofit Packages | `/services/interior-finishing-renovations` | Via catch-all | No static page, but DB has published slug `interior-finishing-renovations` ("Residential Renovations"). Resolves via `/services/:slug` → `ServiceDetail`. |

No slugs are invented. Every route either has a static page, a published DB record caught by the `:slug` catch-all, or (pillar 7) explicitly links to the closest existing page.

**One route change required**: Remove the redirect on line 88 of `AppRoutes.tsx` (`/services/masonry-restoration` → `/services/building-envelope`) so that pillar 3 can reach the published `masonry-restoration` DB record via `ServiceDetail`. This is a small, safe change — the masonry service has its own published page content in the DB.

---

## C. Featured Work Selection Logic — Tightened

Current DB state: 6 published projects, zero featured. Categories: Residential (2), Institutional (2), Retail (1), Commercial (1).

**Selection rule (in order):**
1. Query `projects` where `featured = true` AND `publish_state = 'published'`, limit 2
2. If fewer than 2 results: backfill with `publish_state = 'published'` ordered by `created_at DESC`, limit 2 total
3. If zero published projects exist: return `null` (hide section entirely)

**Why no category filter now**: With only 6 published projects and none featured, filtering by envelope/interior/restoration categories would exclude most of the portfolio (4 of 6 are Residential/Institutional which are relevant to interior and renovation scopes anyway). Once the portfolio grows and projects are tagged as featured, the query naturally improves. Adding a hard category filter now risks showing 0-1 projects and weakening the section.

---

## D. Pillar Count: 8 confirmed

All 8 pillars from the approved brief will be built. No reduction.

---

## Files to Change

### Modified
- `src/pages/Services.tsx` — Full rebuild with 8-section layout
- `src/routes/AppRoutes.tsx` — Remove masonry-restoration redirect (line 88) so it falls through to `ServiceDetail`

### New (all under `src/components/services/`)
- `ServicePillarsGrid.tsx` — 8 static cards with the mapping above
- `OperationalCapabilities.tsx` — 6 items: self-performed work, occupied-building sensitivity, schedule coordination, phased delivery, QC, closeout/documentation
- `ServicesClientSegments.tsx` — 5 segments: GCs, Property Managers, Developers, Commercial Clients, Homeowners
- `ServicesTrustBar.tsx` — 5 proof items: self-performed core scopes, WSIB/insurance/compliance, Ontario coverage, commercial + multi-unit + residential experience, envelope + interior trade focus
- `ServicesFeaturedWork.tsx` — DB query with the 3-tier logic above
- `ServicesProcessSnapshot.tsx` — 4 steps: Review scope → Assess site/documents → Price & coordinate → Mobilize & deliver
- `ServicesCtaSection.tsx` — 3 conversion paths: Submit RFP, Request Estimate, Contact Team

### No longer imported on Services page (still exist)
- `MarketSegmentedServices`
- `ServicePromotionsSection`

## Checks
1. All 8 pillar links resolve (no 404, no blank pages)
2. Featured work shows projects or hides cleanly
3. Responsive at mobile/tablet/desktop
4. No console errors on `/services`
5. Masonry route change does not break other redirects

