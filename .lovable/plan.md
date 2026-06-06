# Site-Wide Propagation of Today's Service-Page Changes

Audit found **6 components / data files still out of sync** with the new service-registry, new Wave 2 pages, and simplified nav. Plan groups them by surface.

---

## 1. Footer (currently DB-only — misses all 9 Wave 1+2 pages)

`src/components/Footer.tsx` fetches services from `supabase.from('services')` and passes them to `UnifiedFooter`. Wave 1+2 static pages (commercial-painting-gta, caulking-sealants-toronto, …) never appear because they aren't DB rows.

**Fix:** Merge DB results with `SERVICE_REGISTRY` entries that have `showInNav: true`. The footer's "featured services" then matches the top-nav menu. Dedupe by slug, sort by category, cap at 6 visible + "View all".

## 2. `/services` index page (hardcoded categories + static cards)

`src/pages/Services.tsx` ships a hardcoded `SERVICE_CATEGORIES` array with 3 cards. `ServicesDataGrid` underneath also queries DB only.

**Fix:**
- Replace the local `SERVICE_CATEGORIES` constant with `SERVICE_CATEGORIES` + `getNavServicesByCategory()` from the registry so the three roll-up cards and their bullets stay aligned with the mega menu (Building Envelope / Restoration & Repair / Interior & Finishes).
- In `ServicesDataGrid`, append registry entries (filtered to those NOT in the DB result, by slug) so the 9 Wave pages render alongside DB services. Tag each card with its category so the existing filter chips work.

## 3. `public/sitemap.xml` (legacy slugs, hand-edited, partly wrong)

Current sitemap contains URLs that are now permanent redirects (`/services/building-envelope`, `/services/eifs-stucco`, `/services/interior-buildouts`, `/services/metal-cladding`, `/services/protective-coatings`, `/services/exterior-cladding`, `/services/exterior-siding`, `/services/exterior-envelope`, `/services/sustainable-construction`). Crawlers shouldn't be sent to redirected URLs.

**Fix:** Rewrite the `<!-- Services -->` block by enumerating `SERVICE_REGISTRY` + every `publish_state='published'` row from `services`. Drop legacy/redirected slugs. Keep `lastmod` as today, `changefreq=monthly`, `priority=0.8`. Hand-edited file stays hand-edited (per sitemap rules — no migration to a generator without explicit OK).

## 4. `public/llms.txt` (mostly fine, 3 DB pages missing)

Has all Wave 1+2 entries. Missing: `facade-remediation`, `interior-finishing-renovations`, `sealant-programs`. Append three bullet lines under `## Services`.

## 5. Navigation search (`src/hooks/useNavigationSearch.ts`)

Reads `megaMenuDataEnhanced` only. Since the simplified menu drops Emergency Repair / Sealant Programs / Sustainable / 5 painting sub-pages from the visible list, search no longer finds them.

**Fix:** Augment the search index with **all** `SERVICE_REGISTRY` entries (including `showInNav: false`) so users typing "fire retardant" or "tile installation" still get a hit.

## 6. Backend / DB content gaps (4 published services with empty SEO)

From the audit:

| Slug | Missing |
|---|---|
| facade-remediation | seo_title, seo_description |
| interior-finishing-renovations | seo_title, seo_description |
| parking-garage-restoration | seo_title, seo_description |
| sealant-programs | seo_title, seo_description |

**Fix:** Single migration that fills `seo_title` (≤60 chars) and `seo_description` (140–160 chars) for these 4 rows using broad-trade language consistent with the SEO Meta Standardization memory. Content is editable later from the admin Services Manager (no schema change).

## 7. Defensive cleanups

- **`DynamicServicesMegaMenu.tsx`** — appears unused after today's changes. Confirm via `rg` and delete if zero imports, else leave alone.
- **Admin Services Manager** — surface a small read-only "Static page" badge next to the 9 Wave slugs so editors know those pages aren't DB-editable (matches the Operational Transparency Labels memory). Just a UI nudge, no behavior change.

---

## Out of scope

- No copy rewrites on Wave 1+2 pages (already audited clean).
- No changes to RLS / auth / edge functions — backend is healthy, no schema changes were made today.
- No new connectors, no new routes.
- No homepage / about / capabilities / markets pages — they don't reference service slugs directly.

## Files touched

- **Edited**: `src/components/Footer.tsx`, `src/pages/Services.tsx`, `src/components/services/ServicesDataGrid.tsx`, `src/hooks/useNavigationSearch.ts`, `public/sitemap.xml`, `public/llms.txt`
- **Possibly deleted**: `src/components/navigation/DynamicServicesMegaMenu.tsx` (only if unused)
- **New migration**: fill `seo_title` + `seo_description` for 4 services rows
- **Re-run**: `bunx tsx scripts/audit-service-pages.ts` to confirm clean report; attach updated artifact

## Validation

After edits: rerun the audit script (expect failing pages → 0), open `/services` to confirm Wave pages render as cards, open footer to confirm new links appear, open `/sitemap.xml` to confirm no redirected URLs.
