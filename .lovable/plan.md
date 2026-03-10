

# Fix: Featured Projects Should Use All Projects

## Problem
The current logic on line 186-188 prioritizes projects marked `featured: true` and only falls back to all projects when none are marked featured. The user wants the featured spotlight to always shuffle from the **entire** project pool — every project, regardless of the `featured` flag.

## Change

**File: `src/pages/Projects.tsx`** — lines 185-195

Replace the conditional pool logic with a simple shuffle of all projects:

```typescript
const featuredProjects = useMemo(() => {
  const pool = [...allProjects];
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return pool.slice(0, 3);
}, [allProjects]);
const regularProjects = filteredProjects;
```

Key changes:
- Use `allProjects` instead of `filteredProjects` so the spotlight always draws from the full database (unaffected by filters)
- Remove the `featured` flag conditional — all projects are eligible
- `regularProjects` becomes all `filteredProjects` (no exclusion needed since the spotlight is a separate showcase)
- New projects added to the database will automatically enter the rotation pool

One file, three lines changed.

