

# Consolidate Mega Menu Size

## Current State
Each mega menu is 800px wide with 4 columns. Every item shows an icon, name, description, and optional badge. The Services menu alone has 13 items across 4 categories. This makes the panels feel oversized for what is essentially a navigation aid.

## Strategy: Tighten, Don't Remove

Three changes that compound to reduce the mega menu footprint by roughly 40% without removing any content or breaking the layout:

### 1. Remove item descriptions from the dropdown
The descriptions ("Complete envelope systems", "Metal panel & ACM installation", etc.) double the vertical height of every row. They add little value in a hover menu — users scan link names, not paragraphs. The descriptions can remain on the actual service pages.

**File:** `src/components/navigation/MegaMenuSection.tsx`
- Remove the `{item.description && ...}` block (lines 91-94)
- Tighten row padding from `py-2` to `py-1.5`

### 2. Reduce menu width and internal spacing
**File:** `src/data/navigation-structure-enhanced.ts`
- Services: 800 → 680, keep 4 columns
- Markets: 800 → 680, keep 4 columns
- Company: 700 → 580, keep 3 columns
- Resources: 600 → 520, keep 3 columns

**File:** `src/index.css` (`.mega-menu-sections-wrapper`)
- Reduce padding from `p-6` to `p-4`
- Reduce grid gap in `.mega-menu-section-categories` from `gap-5` to `gap-4`

### 3. Consolidate Services data — merge "Quick Links" into footer CTA area
The "Quick Links" column (Service Selector + View All Services) wastes an entire column for 2 items. Move "Service Selector" as a featured link in the CTA footer bar, and drop "View All Services" since the section header already links to `/services`.

**File:** `src/data/navigation-structure-enhanced.ts`
- Remove the "Quick Links" category from services
- Services columns: 4 → 3

This brings Services from a 4-column 800px panel down to a 3-column ~580px panel — matching Company.

## Summary of Changes

| File | What changes |
|---|---|
| `navigation-structure-enhanced.ts` | Reduce all widths, remove Quick Links category, Services → 3 columns |
| `MegaMenuSection.tsx` | Remove description text, tighten row padding |
| `index.css` | Reduce wrapper padding and grid gap |

## What stays the same
- Mega menu component structure and animation
- All navigation links and routes
- Icons and badges
- Mobile navigation (unaffected)
- CTA buttons in each menu footer

