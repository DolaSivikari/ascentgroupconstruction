## Goal

Two things, in this order:

1. **Positioning check** — confirm nothing introduced in the recent Wave 1/2 work, nav refactor, or footer/services-index propagation describes Ascent as a single-trade contractor. Positioning must stay **"specialty contractor (multi-trade self-perform) transitioning to GC"**.
2. **Standards & template compliance audit** — verify every new/edited page and component obeys the project's established rules (memory: design system foundation, editorial standards, hero hierarchy, typography/colors, animation specs, SEO env standard, semantic tokens, admin UI consistency, etc.).

No new features. Audit + targeted fixes only.

## Scope of files to audit

**Positioning (copy + metadata):**
- `src/data/service-registry.ts` (nav labels + descriptions)
- `src/data/navigation-structure-enhanced.ts` (mega-menu copy)
- `src/components/Footer.tsx`
- `src/pages/Services.tsx` + `src/components/services/ServicesDataGrid.tsx`
- All 9 Wave 1/2 service pages under `src/pages/services/` and `src/components/services/Wave1ServicePage.tsx`
- DB SEO metadata for the 4 services we updated (`facade-remediation`, `interior-finishing-renovations`, `parking-garage-restoration`, `sealant-programs`)
- `public/llms.txt`, `public/sitemap.xml`

**Standards compliance (template/system):**
- Wave service pages — confirm they use `SectionHeader`, `ProofStrip`, unified `Card`, `FAQAccordion`, `CTABand` instead of ad-hoc markup
- Hero images — confirm dimensions/aspect, alt text, OptimizedImage usage, hero-hierarchy tier
- Color usage — no hardcoded `text-white/bg-black/orange/green-500` etc.; semantic tokens only
- Typography — Inter; Navy/Charcoal/Steel Blue tokens
- Animation — Framer Motion `whileInView` staggered pattern + `useReducedMotion`
- SEO — `SITE_URL` constant in canonical/OG, `<60` title, `140–160` description, single H1, FAQ JSON-LD where applicable
- Admin UI — any admin surface touched uses custom `ConfirmDialog` + toast (no `alert/confirm`)
- Routing — plain function route groups, no lazy-wrapping regressions
- Data formatting — `formatPhone`, project value formatting unchanged

## Deliverables

1. **`/mnt/documents/positioning-and-standards-audit.md`** — a single report with two sections:
   - **Positioning findings** — per-file lines that suggest single-trade framing, with the exact corrected wording.
   - **Standards findings** — per-file rule violations grouped by rule (design tokens, hero, typography, animation, SEO, admin UI, etc.), each with file:line and the fix.
2. **Targeted fixes** for every issue surfaced — copy/token/import edits only. No structural rewrites.
3. **Re-run** `bunx tsx scripts/audit-service-pages.ts` and confirm 0 failures after fixes.

## Method

1. Grep the codebase for positioning red-flag phrases ("painter", "painting contractor", "single trade", "we are a painting company", anything that narrows scope below "specialty contractor / multi-trade self-perform").
2. Grep for standards red flags (hardcoded colors, raw `<h2>`/`<section>` headers instead of `SectionHeader`, missing `useReducedMotion`, hardcoded site URLs, native `alert/confirm`, `text-white`, etc.).
3. Cross-check each Wave page against `Wave1ServicePage.tsx` template structure.
4. Compile report → apply fixes → re-run audit script.

## Out of scope

- New service pages, new components, new routes
- Homepage/About/Capabilities/Markets rewrites
- Schema migrations beyond fixing copy in the 4 already-edited DB rows
- RLS/auth/edge functions

## Question before I implement

What I have flagged so far from a quick pass on the registry/nav looks **clean for positioning** — labels like "Painting Services", "Tile & Flooring", etc. are scoped as trade capabilities under the Ascent Group umbrella, not as company identity. The only place I'd tighten is the Services index hero/meta and Wave page intros, to make sure every page reinforces "specialty contractor doing this trade as one of many," not "we are a [trade] contractor."

Approve this plan and I'll run the full audit + fixes in one pass.