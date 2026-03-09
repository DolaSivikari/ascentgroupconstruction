

# Restore Dynamic Featured Projects on Homepage

## Problem
The current `HomepageFeaturedProjects` uses hardcoded static placeholder projects instead of fetching real published projects from the database. The user had a working version that pulled real projects (Oakley Ridge, Queensland Condos, etc.) and wants it restored.

## Changes — `src/components/homepage/HomepageFeaturedProjects.tsx`

### Replace static data with database query
- Remove the hardcoded `featuredProjects` array
- Add a `useQuery` call (same pattern as `ServicesFeaturedWork`) fetching from `projects` table: `publish_state = 'published'`, `featured = true`, ordered by `created_at desc`, limit 3
- Fallback: if fewer than 3 featured, backfill with latest published

### Restore the target layout
Match the HTML the user provided:
- **Header**: side-by-side flex layout (`flex-col md:flex-row md:items-end md:justify-between`) with title left, "View all projects" link right
- **Eyebrow**: `text-sm font-medium uppercase tracking-wider text-accent` — "Recent Work"
- **Title**: "Featured Projects" (not "Work We're Proud Of")
- **Subtitle**: "Selected projects demonstrating our scope of work across Ontario."
- **Grid**: `grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8`
- **Cards**: design-system `Card` with `variant="elevated"`, `hover`, aspect `16/10` image, category badge, title, location text — no description paragraph, no MapPin icon
- Remove the bottom-center "View all projects" link (moved to header)

### Keep scroll animations
Retain the existing `useScrollFadeIn` and `useStaggerAnimation` hooks for entrance animations, applied to the new markup.

## Files modified
- `src/components/homepage/HomepageFeaturedProjects.tsx` — full rewrite

