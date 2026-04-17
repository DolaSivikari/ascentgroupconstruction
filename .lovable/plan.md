
User wants to delete 4 orphan page files + update the repo structure map. Simple cleanup, no clarification needed.

Files to verify they exist and have no imports — already confirmed in prior audit.

## Delete Orphaned Page Files

### What to delete (4 files)

| File | Why orphan |
|---|---|
| `src/pages/Sustainability.tsx` | `/sustainability` redirects to `/services/sustainable-building` |
| `src/pages/DynamicSpecialtyPage.tsx` | No route or import uses it |
| `src/pages/ServiceSelectorPage.tsx` | `/service-selector` redirects to `/services` |
| `src/pages/company/TechnologyInnovation.tsx` | `/company/technology` uses `Technology.tsx` instead |

### Safety check before delete

Final grep across `src/` to confirm zero imports of each filename. If any stray import exists, remove it from that file too (none expected based on prior audit).

### Documentation update

Update `documents/REPO_STRUCTURE_MAP.md` to reflect current reality:
- Remove the 4 deleted page entries
- Remove already-stale entries: `src/pages/services/` folder, `admin/Testing.tsx`, `Insights.tsx`, `LandingGateway.tsx`, `EquipmentResources.tsx`
- Update file counts in the summary section

### Out of scope

- No route changes — existing redirects in `AppRoutes.tsx` stay
- No DB changes
- No component or design changes
- No memory updates (covered by existing `repository-hygiene-and-cleanup` memory)

### Result

4 dead files removed. Repo structure map matches reality. Cleaner search results, no risk of accidentally re-importing dead code.
