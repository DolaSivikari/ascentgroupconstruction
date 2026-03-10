

# Navigation Cleanup: 10 Fixes Across 4 Files

## Changes

### 1. MobileNavSheet.tsx (6 fixes)

| # | Issue | Fix |
|---|---|---|
| 1 | "Request Quote" links to `/contact` (duplicate of Contact button) | Change to `/estimate` |
| 2 | `showMoreServices` / `visibleServiceItems` never used in render | Remove state + computed value |
| 3 | Unused imports: `Phone`, `ChevronDown`, `ChevronUp` | Remove from import |
| 5 | Inconsistent badge rendering (Company has 2 if-blocks; Markets/Trade Partners drop "new"/"popular") | Unify all 4 sections to use the same single ternary pattern from Services |
| 6 | Accordion announcement missing section name | Change `"Section expanded"` → `"${sectionName} section expanded"` using the accordion value |
| 8 | `delays` from `useStaggerAnimation` never applied | Remove the hook call and import |
| 7 | Flat gradients on Company (`from-steel-blue to-steel-blue`) and Trade Partners (`from-secondary to-secondary`) | Change to `from-steel-blue to-steel-blue/70` and `from-secondary to-secondary/70` |

### 2. MegaMenuWithSections.tsx + MegaMenuSection.tsx (dead props)

- Remove `expandedCategories` state and `handleToggleCategory` from `MegaMenuWithSections`
- Remove those props from `MegaMenuSection` interface and destructuring
- The mega menu renders a flat grid, not accordions — these props are vestigial

### 3. navigation-structure-enhanced.ts (2 fixes)

| # | Issue | Fix |
|---|---|---|
| 3 | 5 duplicate URLs pointing to `/services/building-envelope` | Give each a unique URL: Waterproofing → `/services/waterproofing`, EIFS & Stucco → `/services/eifs-stucco`, Façade Remediation → `/services/facade-remediation`, Parking Garage → `/services/parking-garage-restoration`, Sealant Programs → `/services/sealant-programs` |
| 9 | `mainNavItems` export unused anywhere | Remove it |

### 4. Shared `getIcon` utility (DRY)

- Extract `getIcon` from `MegaMenuSection.tsx` line 16 and `MobileNavSheet.tsx` line 72 into a new `src/utils/getIcon.ts`
- Both files import from the shared utility

## Files touched

| File | Action |
|---|---|
| `src/utils/getIcon.ts` | **Create** — shared icon resolver |
| `src/components/navigation/MobileNavSheet.tsx` | Fix bugs #1, #2, #3, #5, #6, #7, #8, #10 |
| `src/components/navigation/MegaMenuWithSections.tsx` | Remove dead expandedCategories state/props |
| `src/components/navigation/MegaMenuSection.tsx` | Remove dead props, use shared getIcon |
| `src/data/navigation-structure-enhanced.ts` | Fix duplicate URLs, remove mainNavItems |

**Note on duplicate URLs (#3):** These new service slugs (`/services/waterproofing`, etc.) will need corresponding service pages or database entries to resolve. If those pages don't exist yet, these links will 404 — but they're currently all pointing to the same page anyway, which is worse UX. The correct URLs are ready for when the service detail pages are created.

