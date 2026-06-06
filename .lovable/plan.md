## Wave 2 — Dedicated Service Pages (AEO/GEO)

### Scope reconciliation
You listed 7 services. Two overlap with Wave 1 already live:
- **Caulking & Sealants** → already at `/services/caulking-sealants-toronto` (Wave 1)
- **Exterior commercial painting** → already covered by `/services/exterior-painting-toronto` (Wave 1, stucco/EIFS recoat slant) and `/services/commercial-painting-gta`

So Wave 2 builds **5 net-new pages**, and we add a "residential exterior" angle to the existing exterior page rather than duplicate it.

### New pages (5)
| Slug | Primary keyword | Audience |
|---|---|---|
| `/services/interior-painting-toronto` | interior painting contractor Toronto | Commercial + residential |
| `/services/residential-exterior-painting-gta` | exterior house painters GTA | Homeowners (stucco, siding, trim, doors) |
| `/services/tile-installation-toronto` | tile installation contractor Toronto | Commercial washrooms, residential bath/kitchen, lobbies |
| `/services/flooring-installation-gta` | flooring contractor GTA | LVT, laminate, hardwood refinish, commercial vinyl |
| `/services/handyman-patching-toronto` | drywall patching & handyman Toronto | Property managers, post-tenant turnovers, small punch-list |

Patching is folded into the handyman page (single intent: small-scope repairs). If you want patching split out as its own page later, easy to lift.

### Content payload per page (drives AI citation)
Each page ships with the exact Wave 1 structure, no new component work:
- `<title>` (≤60 char) + meta description (≤160 char)
- **Direct Answer paragraph** (60–90 words, citation-ready, leads with "Ascent Group provides…")
- Scope bullets (what's included)
- Materials/systems list (Benjamin Moore, Sherwin-Williams, Schluter, Mapei, etc.)
- **6–8 FAQs** with FAQPage JSON-LD
- Trust strip ($2M CGL, WSIB, 15+ yrs crew, self-perform)
- CTA → `/estimate?service=<slug>` (already attribution-wired)
- Related sibling links

### Files

**New:**
- `src/pages/services/InteriorPaintingToronto.tsx`
- `src/pages/services/ResidentialExteriorPaintingGTA.tsx`
- `src/pages/services/TileInstallationToronto.tsx`
- `src/pages/services/FlooringInstallationGTA.tsx`
- `src/pages/services/HandymanPatchingToronto.tsx`

**Edited:**
- `src/data/wave1-services.ts` → rename internal export to `WAVE_SERVICES` (keep `WAVE1_PAGES` alias for back-compat) and append 5 entries. Same `Wave1ServicePage` interface — no schema change.
- `src/routes/AppRoutes.tsx` → register 5 static routes BEFORE `/services/:slug` catch-all (same pattern as Wave 1).
- `public/sitemap.xml` → add 5 `<url>` entries.
- `public/llms.txt` → add 5 prose entries under Services.
- `src/components/HomepageServiceHighlights.tsx` + `src/data/services-data.ts` (or equivalent ServicesDataGrid source) → cross-link the new pages from the services grid.

### Out of scope (deferred)
- New components or template refactor (reuse `Wave1ServicePage.tsx` as-is)
- Database service rows (these are static SEO landing pages, like Wave 1)
- New imagery — reuse existing project gallery photos; AGC fallback where missing
- Splitting handyman vs patching into two pages
- Wave 3 (epoxy floors, pressure washing, masonry repair) — queued, not built

### Confirmations before build
1. **Handyman scope** — confirm we list: drywall patching, paint touch-ups, small carpentry, door/lock adjustments, fixture swaps, minor tile/grout repair. Exclude electrical/plumbing licensed work.
2. **Flooring scope** — install only, or include hardwood sand/refinish? Default plan: install (LVT/laminate/vinyl sheet) + hardwood refinish via partner, called out honestly.
3. **Tile scope** — confirm waterproofing systems (Schluter Kerdi, Mapei Mapelastic) for AI-citable specificity. OK to name?
4. **Residential exterior** — confirm we include door/trim/garage painting (typical homeowner ask) alongside full-house stucco/siding.

Reply "go" with any tweaks and I'll build it.
