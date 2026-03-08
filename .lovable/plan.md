

# Phase 4 Implementation Plan — Information Architecture & Navigation Consolidation

## Files to Change

### Create (1)
| File | Purpose |
|---|---|
| `src/pages/Markets.tsx` | New Markets landing page using `SectionHeader`, `SegmentCard`, `CTABand` |

### Modify (11)
| File | Change |
|---|---|
| `src/data/navigation-structure-enhanced.ts` | Restructure mega-menus: add `tradePartners`, simplify `company` (remove Sustainability, Why Specialty Contractor), remove `resources`, rename markets sectionTitle, update `mainNavItems` to new 6-item order |
| `src/components/Navigation.tsx` | Reorder desktop nav to About → Services → Markets → Projects → Trade Partners → Contact; CTA label → "Submit RFP"; remove `/sustainability` and `/insights` from heroPages; add `/markets` to heroPages; replace Resources mega-menu block with Trade Partners; change Markets from `<button>` to `<Link to="/markets">` |
| `src/components/navigation/MobileNavSheet.tsx` | Replace Resources accordion section with Trade Partners; rename "Who We Serve" to "Markets"; update bottom CTA to "Submit RFP" linking to `/submit-rfp`; update category filter list |
| `src/routes/AppRoutes.tsx` | Add `/markets` route; convert `/sustainability`, `/insights`, `/service-selector` to `<Navigate>` redirects |
| `src/routes/registry.ts` | Add `/markets`; remove `/sustainability`, `/service-selector`, `/insights` |
| `src/pages/company/Developers.tsx` | Fix "100+ multi-unit projects" → "multi-unit projects across the GTA" |
| `src/components/footer/UnifiedFooter.tsx` | Update companyLinks: remove "Why Specialty Contractor", add "Trade Partners" → `/for-general-contractors`; change CTA from "Request a Proposal" → "Submit RFP" linking to `/submit-rfp` |
| `src/components/insights/InsightsFeed.tsx` | Change `to="/insights"` → `to="/blog"` (line 283) |
| `public/_redirects` | Add server-side redirects: `/sustainability` → `/services/sustainable-construction`, `/insights` → `/blog`, `/service-selector` → `/services` |
| `public/sitemap.xml` | Remove `/sustainability`, `/insights` entries; add `/markets` |
| `supabase/functions/generate-sitemap/index.ts` | Remove `/sustainability` from staticPages; add `/markets` |

## Issues Found in Current Code

1. **`/sustainability` link in navigation-structure-enhanced.ts** (line 153) — links to fabricated sustainability page
2. **`/insights` link in navigation-structure-enhanced.ts** (line 201) — links to redundant page overlapping `/blog`
3. **`/service-selector` link in navigation-structure-enhanced.ts** (line 208) — low-value tool page
4. **`to="/insights"` in InsightsFeed.tsx** (line 283) — internal link to soon-redirected page
5. **`Developers.tsx` line 31** — "100+ multi-unit projects" overclaim
6. **Nav CTA says "Request Proposal"** — inconsistent with "Submit RFP" direction
7. **Mobile nav bottom CTA says "Request a Proposal"** — same inconsistency
8. **Footer CTA says "Request a Proposal"** — same inconsistency
9. **"Who We Serve" has no landing page** — dropdown-only button, no `/markets` route
10. **`/sustainability` still in heroPages** (Navigation.tsx line 78) and registry

## Exact Changes

### 1. `navigation-structure-enhanced.ts`
- **markets**: Change `sectionTitle` from "Who We Serve" to "Markets"; add `sectionLink: "/markets"`; remove "By Sector" category (projects filter links, not market pages)
- **company**: Remove Sustainability and Why Specialty Contractor items from "About Us" category; remove "Join Us" category (those items move to Trade Partners or stay in footer); rename "Capabilities" category items
- **resources**: Keep in data for backward compat but strip `/insights` and `/service-selector` items
- **Add `tradePartners`**: New mega-menu with categories: "Get Started" (Submit RFP, Request Estimate, Prequalification) and "Resources" (Contractor Portal, FAQ, Blog)
- **`mainNavItems`**: Change to `About → Services → Markets → Projects → Trade Partners → Contact`

### 2. `Navigation.tsx`
- Reorder nav items: About (mega-menu=company) → Services → Markets (link to /markets) → Projects → Trade Partners (mega-menu=tradePartners) → Contact
- Remove Resources mega-menu block entirely
- CTA button: "Request Proposal" → "Submit RFP"
- Remove `/sustainability`, `/insights` from heroPages; add `/markets`
- Remove "Client Portal" utility link (moves to Trade Partners menu)

### 3. `MobileNavSheet.tsx`
- Remove Resources accordion section
- Add Trade Partners accordion section using `tradePartners` mega-menu data
- Rename "Who We Serve" → "Markets"
- Bottom sticky CTA: "Request a Proposal" → "Submit RFP", link → `/submit-rfp`
- Update category filter list: remove "Resources", add "Trade Partners"

### 4. `AppRoutes.tsx`
- Add: `<Route path="/markets" element={<Markets />} />`
- Change: `/sustainability` from `<Sustainability />` to `<Navigate to="/services/sustainable-construction" replace />`
- Change: `/insights` from `<Insights />` to `<Navigate to="/blog" replace />`
- Change: `/service-selector` from `<ServiceSelectorPage />` to `<Navigate to="/services" replace />`

### 5. `Markets.tsx` (new)
- Uses `SectionHeader`, `SegmentCard`, `CTABand` from Phase 3 design system
- 5 segment cards: Property Managers, Commercial Clients, Homeowners, Developers, General Contractors
- SEO metadata, Navigation, Footer, PageHero

### 6. Other cleanup files as listed above

## Intentionally NOT Changed
- `src/ui/Card.tsx`, `src/components/ui/card.tsx` — Phase 3 decision
- All service detail pages — out of scope
- Homepage — out of scope
- Admin pages — out of scope
- `/capabilities`, `/why-specialty-contractor` — remain accessible, just demoted from primary nav
- Sustainability page file — kept in codebase, route becomes redirect
- Service selector page file — kept, route becomes redirect
- Insights page file — kept, route becomes redirect

## Manual/External Verification Needed
- Server-side `_redirects` entries only work on deployed hosting
- Whether "Markets" label resonates vs "Who We Serve" is a branding choice

## Checks
1. TypeScript build passes
2. All 3 redirects work via `<Navigate>`
3. Desktop nav renders 6 items in correct order
4. Markets page renders with design-system components
5. No console errors
6. Grep: zero internal links to `/sustainability`, `/insights`, `/service-selector` (outside of redirect routes and kept-but-unused page files)
7. Mobile nav matches desktop structure
8. CTA reads "Submit RFP" everywhere
9. Sitemap no longer lists redirected URLs

