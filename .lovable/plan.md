

# Rotating Featured Projects on Every Page Load

## Change
Update `HomepageFeaturedProjects.tsx` to fetch a larger pool of published projects (up to 12) and randomly select 3 on each page load. Every refresh shows a different combination.

## How it works
- Fetch up to 12 published projects (featured first, then latest as backfill)
- Use `Math.random()` to shuffle the pool, then take the first 3
- If 3 or fewer projects exist, all are shown (no shuffle needed)

## File modified
- `src/components/homepage/HomepageFeaturedProjects.tsx` — change query limit from 3→12, add a Fisher-Yates shuffle, slice to 3

