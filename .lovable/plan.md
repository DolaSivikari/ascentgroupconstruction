# Simplify Services Menu + Auto-Sync Nav + SEO/GEO Service Page Audit

Three related changes, in one pass.

---

## 1. Simplify the Services mega menu

Today the Services column shows 4 categories × 5 items = **20 links**, with painting alone exposing 5 near-duplicate entries (Commercial / Interior / Exterior / Residential Exterior / Fire Retardant). That's the "messy" feel.

Collapse to **3 categories, max 4 visible links each** (12 total), grouping similar services under one parent and pushing the long tail to a "View all" link.

```text
Building Envelope                Restoration & Repair             Interior & Finishes
─────────────────                ────────────────────             ───────────────────
Building Envelope Solutions      Façade Remediation               Painting Services  ▸
Cladding Systems                 Masonry Restoration              Interior Finishing
Waterproofing Systems            Parking Garage Restoration       Tile & Flooring    ▸
EIFS & Stucco                    Caulking & Sealants              Patching & Handyman

                                                                  → View all services
```

- **Painting Services ▸** is a single nav entry that points to a roll-up page (`/services?category=painting` or the existing `/services` filtered view). The 5 painting sub-pages still exist and are still indexable — they just don't all surface in the top nav.
- **Tile & Flooring ▸** rolls tile + flooring into one link going to `/services?category=flooring` (or a simple landing); both detail pages remain.
- Sealant Programs / Sustainable Construction / Emergency Repair move out of the mega menu into the all-services index page only.
- Mobile sheet mirrors the same 3-group structure.

## 2. Single source of truth: nav auto-syncs with routes

Today `src/data/navigation-structure-enhanced.ts` and `src/routes/AppRoutes.tsx` + `src/data/wave1-services.ts` drift independently. New Wave 2 pages had to be hand-added to the nav, which is why this thread happened.

Introduce a **service registry** as the single source of truth:

- New file `src/data/service-registry.ts` exports `SERVICE_REGISTRY: ServiceRegistryEntry[]` with one entry per public service page:
  ```ts
  { slug, path, title, navLabel, navDescription, icon, category, showInNav, navOrder, source: "static" | "db" }
  ```
- `AppRoutes.tsx` maps over `SERVICE_REGISTRY.filter(e => e.source === "static")` to register the Wave 1+2 routes (replaces the hand-written `<Route>` list).
- `scripts/generate-sitemap.ts` reads the same registry instead of a hardcoded list.
- `src/data/navigation-structure-enhanced.ts` becomes mostly a layout file: it declares the 3 visible categories and which **registry slugs** belong in each; labels/descriptions/icons resolve from the registry at build time via a helper `buildServicesMegaMenu()`.
- DB-driven services (`source: "db"`) feed only the `/services` index page and sitemap — they don't auto-add to the top nav (top nav stays curated and short).

Effect: adding a new Wave 3 page is a one-line addition to `service-registry.ts`. Route, sitemap, all-services page, and (if `showInNav: true`) the mega menu all update together.

## 3. SEO/GEO audit on every service page + report

Build an audit script that statically analyzes each service page and reports mismatches. No runtime browser, no network.

Scope: all `/services/*` pages — 9 Wave 1+2 static pages + every DB service page reachable via `/services/:slug`.

Per page, the audit checks:

- **`<title>`** — present, ≤ 60 chars, contains primary keyword, not the default `"Lovable App"`.
- **`<meta name="description">`** — present, 120–160 chars, not the default.
- **Canonical** — present, absolute, uses `SITE_URL` constant, matches the route.
- **H1** — exactly one, contains primary keyword.
- **Heading order** — no skipped levels (h1 → h2 → h3 only).
- **DirectAnswer block** — rendered, ≥ 40 words, includes service area (GTA / Toronto / Ontario as applicable).
- **FAQ JSON-LD** — `@type: FAQPage` present, every visible FAQ question has a matching `mainEntity` entry, answers non-empty.
- **Service/LocalBusiness JSON-LD** — present where applicable, `name`, `areaServed`, `provider` populated.
- **Hero image** — `alt` non-empty, image asset exists.
- **Internal links** — `RelatedLinksGrid` present with ≥ 2 valid sibling slugs.
- **GEO signals** — page mentions at least one GTA city (Toronto/Mississauga/Brampton/Vaughan/Markham) in either DirectAnswer or FAQs.

Implementation:

- New file `scripts/audit-service-pages.ts`.
- Walks `SERVICE_REGISTRY` (static pages → import the page module & inspect the data payload from `wave1-services.ts`; DB pages → query Supabase via existing client with anon key).
- Writes `/mnt/documents/service-seo-geo-audit.md` with one table per page: ✅ pass / ⚠️ warn / ❌ fail per check, plus a summary at the top (pages clean / pages with warnings / pages failing).
- Also writes `/mnt/documents/service-seo-geo-audit.json` for machine reuse.
- Surface both as `<presentation-artifact>` tags in the final reply so you can open them.

Run-on-demand only (script invoked manually); not wired into the build.

---

## Out of scope

- No copy rewrites on service pages.
- No changes to Markets / Company / Trade Partners menus.
- No DB schema changes.
- No new dependencies.

## Files touched (build phase)

- **New**: `src/data/service-registry.ts`, `scripts/audit-service-pages.ts`
- **Edited**: `src/data/navigation-structure-enhanced.ts` (3-category layout + registry resolver), `src/routes/AppRoutes.tsx` (map static services from registry), `scripts/generate-sitemap.ts` (read registry), `src/components/navigation/MobileNavSheet.tsx` only if the data shape change requires a render tweak.
- **Generated artifacts** (not in repo): `/mnt/documents/service-seo-geo-audit.md`, `.json`
