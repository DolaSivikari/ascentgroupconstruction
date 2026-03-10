

# Remove Navigation Badge Icons

## Problem
The ★ / "New" / sparkle badges on navigation menu items look unprofessional and template-like, conflicting with the editorial/enterprise design standard.

## Changes

### 1. Remove badge rendering from 3 navigation components

| File | Change |
|---|---|
| `src/components/navigation/MegaMenuSection.tsx` | Remove `NavBadge` import and the `{item.badge && ...}` JSX block |
| `src/components/navigation/MegaMenuAccordionCategory.tsx` | Remove `NavBadge` import and the `{item.badge && ...}` JSX block |
| `src/components/navigation/GridMegaMenuCard.tsx` | Remove `NavBadge` import, `badge` prop usage, and the `{badge && ...}` JSX block |

### 2. Remove badge data from navigation structure

| File | Change |
|---|---|
| `src/data/navigation-structure-enhanced.ts` | Remove `badge` property from the `SubItem` type and all `badge: "new"` / `"popular"` / `"important"` entries in the data |

### 3. Delete the NavBadge component

| File | Change |
|---|---|
| `src/components/ui/nav-badge.tsx` | Delete file — no longer used anywhere after the above removals |

Five files touched, zero new code added — pure removal.

