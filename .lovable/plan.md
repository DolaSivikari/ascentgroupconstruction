

## Orphaned Pages Audit

I cross-checked every file in `src/pages/` against `src/routes/AppRoutes.tsx` and all imports across the codebase. Note: your structure map (`REPO_STRUCTURE_MAP.md`) is **out of date** — `src/pages/services/` is already empty, and `admin/Testing.tsx` no longer exists. Ignore those entries.

### Orphaned page files (not routed, not imported anywhere)

These 4 files exist but are unreachable — no route declaration, no import:

| File | Status | Why orphan |
|---|---|---|
| `src/pages/Sustainability.tsx` | Orphan | `/sustainability` redirects to `/services/sustainable-building`; this page is never rendered |
| `src/pages/DynamicSpecialtyPage.tsx` | Orphan | Built for a `specialty_pages` DB table; no route uses it |
| `src/pages/ServiceSelectorPage.tsx` | Orphan | `/service-selector` redirects to `/services`; this page is never rendered |
| `src/pages/company/TechnologyInnovation.tsx` | Orphan | `/company/technology` uses `Technology.tsx`; this is an unused duplicate |

### Recommended action

**Delete all 4 orphan files.** They add maintenance noise, show up in search/replace, bloat repo grep results, and risk being accidentally re-imported. Each has been replaced by either a redirect or a different component.

### Files touched

- Delete `src/pages/Sustainability.tsx`
- Delete `src/pages/DynamicSpecialtyPage.tsx`
- Delete `src/pages/ServiceSelectorPage.tsx`
- Delete `src/pages/company/TechnologyInnovation.tsx`

### Also recommended (housekeeping, not orphans)

Update `documents/REPO_STRUCTURE_MAP.md` after deletion so it reflects reality. The map currently lists ~10 files that no longer exist (the entire `src/pages/services/` folder, `admin/Testing.tsx`, `Insights.tsx`, `LandingGateway.tsx`, `EquipmentResources.tsx`).

### Out of scope

- No route changes — all current redirects (`/sustainability`, `/service-selector`, `/company/equipment-resources`) stay in place
- No DB changes
- No component changes

