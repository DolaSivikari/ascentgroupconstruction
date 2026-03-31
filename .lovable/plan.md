

## Passes 3–5: Foundation Fixes

These passes address the structural issues that undermine conversion even with a visually dominant homepage. Each pass is independent and can be implemented in any order after Pass 2.

---

### PASS 3 — /services Page Rebuild

**Problem:** The `/services` page is 7 static sections of hardcoded cards (ServicePillarsGrid, OperationalCapabilities, ClientSegments, TrustBar, FeaturedWork, ProcessSnapshot, CTA). It's long, repetitive, and doesn't pull from the database. Meanwhile, homepage service links (e.g., `/services/facade-remediation`, `/services/waterproofing`) redirect to generic category pages, losing intent. Several hardcoded service pages (PaintingServices, TileFlooring, CladdingSystems, InteriorBuildouts) duplicate content that should come from the DB `services` table.

**Changes:**

#### 3a. Make /services data-driven
**File:** `src/pages/Services.tsx`

- Replace `ServicePillarsGrid` (which reads from static `service-pillars.ts`) with a component that queries published services from the `services` table, grouped by `category`
- Each category renders as a section with its services as cards linking to `/services/:slug`
- Keep the hero, CTA section, and process snapshot — remove or merge `OperationalCapabilities`, `ClientSegments`, `TrustBar` (these repeat what the homepage already says)
- Result: shorter, scannable page that matches what's actually in the DB

#### 3b. Consolidate hardcoded service pages
**Files:** `src/pages/services/PaintingServices.tsx`, `TileFlooring.tsx`, `CladdingSystems.tsx`, `InteriorBuildouts.tsx`, `BuildingEnvelope.tsx`, `ProtectiveCoatings.tsx`, `SustainableBuilding.tsx`

- These pages use `ServicePageLayout` with hardcoded content. Replace with a single enriched `ServiceDetail` page that:
  - Fetches from DB by slug
  - Falls back to `merged-services-data.ts` for marketing copy (benefits, process steps, quick facts) when DB fields are empty
  - Uses `ServicePageTemplate` consistently
- Update `AppRoutes.tsx` to remove individual hardcoded routes and let everything fall through to `/services/:slug` → `ServiceDetail`

#### 3c. Fix homepage service links
**File:** `src/components/homepage/HomepageServiceHighlights.tsx`

- The 8 service cards link to slugs like `/services/facade-remediation` and `/services/metal-cladding` which redirect to category pages. Update `href` values to match actual DB slugs or the correct canonical routes
- Cross-reference against `services` table slugs to ensure no dead links

**Validation:**
- Every service card on homepage and /services page links to a page that renders real content (not a redirect to a generic page)
- `npm run build` passes
- No 404s when clicking through all service links

---

### PASS 4 — Data Quality: Blank Cards, NaN Metrics, Contact Info

**Problem:** Three data integrity issues affect credibility:
1. Project cards can render with missing images, blank descriptions, or `$NaN` values when `project_value` is malformed
2. Phone numbers are hardcoded as fallbacks in 11+ files with inconsistent formatting — some use `COMPANY_PHONE` from constants, others use inline `(647) 528-6804` or `647-528-6804`
3. SEO structured data uses hardcoded URLs instead of `SITE_URL` constant in `Index.tsx`

**Changes:**

#### 4a. Defensive project card rendering
**Files:** `src/components/ProjectCard.tsx`, `src/components/homepage/HomepageFeaturedProjects.tsx`, `src/components/services/ServicesFeaturedWork.tsx`

- Add guard: if `featured_image` is null/empty, render a branded placeholder (company icon on muted background) instead of nothing
- `formatProjectValue` already returns null for bad data — verify all call sites hide the element when null (audit the 4 files using it)
- Add `line-clamp` fallback for missing `summary` — show category or "View project details" instead of blank space

#### 4b. Centralize phone formatting
**Create:** `src/utils/formatPhone.ts` — single utility: `formatPhoneDisplay(raw: string): string` and `formatPhoneTel(raw: string): string`

**Update these files** to use the utility + `COMPANY_PHONE` from `constants/company.ts` as the single fallback (instead of inline strings):
- `src/components/StickyInquiryBar.tsx` (line 16-17)
- `src/components/homepage/InteractiveCTA.tsx` (line 57-58)
- `src/components/seo/DirectAnswer.tsx` (line 17-18)
- `src/components/shared/PhoneLink.tsx` (line 21)
- `src/pages/Contact.tsx` (line 145)
- `src/pages/resources/LocationPage.tsx` (line 230 — hardcoded in SEO description string)

#### 4c. Fix hardcoded URLs in structured data
**File:** `src/pages/Index.tsx`

- Lines 61, 93, 113: replace `"https://ascentgroupconstruction.com"` with `SITE_URL` from `constants/company.ts`
- Same for `mailto:` on line 62 — use `COMPANY_EMAIL`

**Validation:**
- No `$NaN` visible on any project card or detail page
- All phone numbers render consistently as `(647) 528-6804`
- `grep -r "647-528-6804\|647\.528\|6475286804" src/` returns only `constants/company.ts` and the `formatPhone` utility

---

### PASS 5 — Admin Wiring & Domain Hygiene

**Problem:** Several admin features are labeled "saved to database only" (navigation builder, redirects, stats). The `_redirects` file handles domain canonicalization but only works on Netlify — if deployed elsewhere, `www.` and `http://` aren't redirected. Some admin sidebar links don't match actual routes.

**Changes:**

#### 5a. Admin feature status audit
**File:** `src/components/admin/UnifiedSidebar.tsx`

- Audit each sidebar link against `AppRoutes.tsx` admin routes — ensure every sidebar item has a matching route
- Remove or hide sidebar items that link to non-existent admin pages
- Ensure the "saved to database only" warning banners are present on: Navigation Builder, Redirects Manager, Stats Manager (per existing memory)

#### 5b. Admin services wiring
**Files:** `src/routes/AppRoutes.tsx`, admin service-related components

- `/admin/services` currently redirects to `/admin/services-manager` — verify `ServicesManager` can actually create/edit/delete services and that changes reflect on the public `/services` page
- Ensure the `useServicesAdmin` hook's CRUD operations match the fields the public `ServiceDetail` page expects (e.g., `publish_state`, `slug`, `category`, `service_overview`, `process_steps`, `benefits`)

#### 5c. Domain/deployment consistency
**File:** `public/_redirects`

- This file is Netlify-specific. If deploying via Lovable's built-in hosting, these rules may not apply
- Add a note comment at top: `# These redirects only work on Netlify. For other hosts, configure at the server/CDN level.`
- Verify the published URL (`ascentgroupconstruction.lovable.app`) doesn't compete with the custom domain for SEO — canonical tags should always point to the custom domain

**File:** `src/components/SEO.tsx`

- Verify `canonical` prop always uses `SITE_URL` prefix, never `lovable.app`

#### 5d. Remove legacy route clutter
**File:** `src/routes/AppRoutes.tsx`

- Lines 94-118 contain 25 redirect routes for legacy service URLs. Many of these are already handled by `_redirects`. The React Router redirects only fire after the SPA loads (slower, causes flash). Remove the ones that are duplicated in `_redirects` — let the server handle them before the SPA boots.

**Validation:**
- Every admin sidebar link navigates to a real page (no blank screens)
- Admin service edits (create, update publish state) reflect on public `/services` and `/services/:slug`
- `canonical` tags never contain `lovable.app`
- Build passes

---

### Execution Order

```text
Pass 1  →  Pass 2  →  Pass 3  →  Pass 4  →  Pass 5
(visual)   (scroll)   (services)  (data)     (admin)
                      ↑
                      Start here if /services is
                      actively losing leads
```

Pass 4 (data quality) can run in parallel with Pass 3. Pass 5 is lowest priority but prevents admin confusion.

