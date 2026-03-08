

# Phase 3: Homepage Strengthening + Safe CMS Wiring — Final Plan

## Tightening Notes Resolved

**Note 1: Shared source of truth for service pillars.**
Extract `SERVICE_PILLARS` from `ServicePillarsGrid.tsx` into a new shared data file `src/data/service-pillars.ts`. Both `ServicePillarsGrid` (on `/services`) and the new `HomepageServiceHighlights` (on homepage) import from it. One array, two renderings — homepage shows a lighter variant (no scopes list).

**Note 2: Component reuse check — complete.**
- `WhyChooseUs` — used only on homepage (`Index.tsx`) + admin manager. Safe to remove CTA block directly.
- `CompanyOverviewHub` — used only on homepage (`Index.tsx`). Safe to remove CTA block directly.
- `Homeowners.tsx` has its own inline `whyChooseUs` array — completely separate, not affected.

---

## Files to Change

### New files
| File | Purpose |
|---|---|
| `src/data/service-pillars.ts` | Shared `SERVICE_PILLARS` array (titles, descriptions, scopes, routes, icons) |
| `src/components/homepage/HomepageServiceHighlights.tsx` | Curated 8-card grid — imports from shared data, renders without scopes list |
| `src/components/homepage/HomepageFeaturedProjects.tsx` | 2-3 published projects from DB with 3-tier fallback, returns null if empty |
| `src/components/homepage/HomepageFinalCta.tsx` | 3 conversion paths: Submit RFP, Request Estimate, Contact Us |

### Modified files
| File | Change |
|---|---|
| `src/components/services/ServicePillarsGrid.tsx` | Import `SERVICE_PILLARS` from shared data instead of inline definition |
| `src/components/homepage/WhyChooseUs.tsx` | Remove bottom CTA card (lines 87-107) |
| `src/components/homepage/CompanyOverviewHub.tsx` | Remove bottom 3-CTA block (lines 193-217) |
| `src/pages/Index.tsx` | Replace `ServicesExplorer` with `HomepageServiceHighlights`, replace `PrequalPackage` with `HomepageFinalCta`, add `HomepageFeaturedProjects` between highlights and final CTA |

### No longer imported on homepage (components still exist)
- `ServicesExplorer`
- `PrequalPackage`

---

## Homepage Section Order (new)

```
Hero (EnhancedHero — unchanged, CMS-wired)
TrustBadgeBar (unchanged)
WhoWeServeHomepage (unchanged)
WhyChooseUs (CMS-wired, bottom CTA removed)
CompanyOverviewHub (CMS-wired, bottom CTAs removed)
HomepageServiceHighlights (new — curated 8 pillars, lighter than /services)
HomepageFeaturedProjects (new — DB query, hide if empty)
HomepageFinalCta (new — 3 conversion paths)
```

---

## CMS Wiring Status

All three already live with fallback. No changes needed:
- Hero Slides: `hero_slides` → `EnhancedHero` → static fallback ✅
- Why Choose Us: `why_choose_us_items` → `useWhyChooseUs()` → static fallback ✅
- Company Overview: `company_overview_*` → `useCompanyOverview()` → static fallback ✅

---

## Checks
1. Homepage renders all sections, no console errors
2. Service highlight cards link to correct routes (same routes as `/services` pillars)
3. Featured projects shows data or hides cleanly
4. No duplicate CTA blocks remain on homepage
5. `/services` page still works (imports from shared data)
6. Responsive at mobile/tablet/desktop

