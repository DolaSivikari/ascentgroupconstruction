

# Projects Grid Section — Visual Overhaul

## Current Issues

1. **Duplicate filter UI** — FilterDrawer + FilterChips section AND the full FilterBar both appear, creating visual clutter and redundancy
2. **Raw HTML in descriptions** — Project descriptions contain `<p>`, `<ul>`, `<li>` tags that render as raw HTML blobs in card previews, looking broken
3. **Unstyled Quick View button** — A plain `<button>` element sits below each card, looking unprofessional
4. **Only 2-column grid** — No 3-column layout on large screens, wastes space
5. **No section heading** for the main project grid area
6. **Load More button** lacks visual refinement

## Plan

### 1. Consolidate Filter UI (Projects.tsx)
Remove the redundant FilterDrawer + FilterChips block (lines 234–271). The FilterBar already handles all filters including search, categories, year, delivery method, client type, value range, and performance badges. One clean filter bar is enough.

### 2. Fix HTML Description Rendering (ProjectCard.tsx)
Strip HTML tags from the description before rendering. Add a small utility to extract plain text:
```typescript
const stripHtml = (html: string) => html.replace(/<[^>]*>/g, '').trim();
```
Apply to the `line-clamp-2` description paragraph.

### 3. Integrate Quick View into ProjectCard (ProjectCard.tsx + Projects.tsx)
- Add an `onQuickView` optional prop to `ProjectCard`
- Render a subtle "Quick View" icon button inside the hover overlay (next to "View Project")
- Remove the orphaned `<button>` from Projects.tsx (lines 329–334)

### 4. Upgrade Grid to 3 Columns on Large Screens (Projects.tsx)
Change `grid md:grid-cols-2 gap-8` to `grid md:grid-cols-2 lg:grid-cols-3 gap-6` for the main project grid.

### 5. Add Section Header (Projects.tsx)
Add a "Our Portfolio" or "All Projects" heading with a subtitle and result count above the grid, matching the Featured Projects section style.

### 6. Polish Load More Button (Projects.tsx)
Replace the inline span with a cleaner design — use a secondary variant button with a progress indicator showing "Showing X of Y".

## Files Changed
| File | Change |
|---|---|
| `src/pages/Projects.tsx` | Remove duplicate filter block, upgrade grid, add section header, polish load more, remove orphan quick view button |
| `src/components/ProjectCard.tsx` | Strip HTML from description, add optional `onQuickView` prop with integrated button in hover overlay |

Two files, focused visual cleanup.

