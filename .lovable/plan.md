

# Fix Services Mega Menu Alignment

## Problem
The Services mega menu uses the same `MegaMenuWithSections` component as the other menus, but its config makes it visually inconsistent:
- **Services**: 900px wide, 4 columns (13 sub-items across 4 categories)
- **Who We Serve**: 800px wide, 4 columns
- **Company**: 700px wide, 3 columns
- **Resources**: 600px wide, 3 columns

The extra width and dense content make it feel off compared to the others.

## Fix
Update the Services mega menu config in `src/data/navigation-structure-enhanced.ts`:

1. **Reduce width from 900px to 800px** — matches "Who We Serve" (the other 4-column menu)
2. **Keep 4 columns** — Services has 4 categories, same as Who We Serve, so this is correct

That single change (900→800) aligns the Services box width with the other wide menu. No component or CSS changes needed — the `MegaMenuWithSections` component already handles everything via the config object.

### File changed
| File | Change |
|---|---|
| `src/data/navigation-structure-enhanced.ts` | `services.width: 900 → 800` |

