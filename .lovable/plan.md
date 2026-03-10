

# Fix Featured Projects: Random Rotation + HTML Stripping

## Problem 1: Featured projects never rotate
Line 185 of `Projects.tsx` always picks the same first 3 featured projects. No shuffle occurs on page load.

**Fix in `src/pages/Projects.tsx`:**
- Add a Fisher-Yates shuffle utility (same pattern used on the homepage)
- Apply it to the featured pool before slicing to 3, using `useMemo` so it shuffles once per page load

```typescript
const shuffled = useMemo(() => {
  const pool = filteredProjects.some(p => p.featured) 
    ? filteredProjects.filter(p => p.featured) 
    : [...filteredProjects];
  // Fisher-Yates shuffle
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return pool.slice(0, 3);
}, [filteredProjects]);
```

## Problem 2: Raw HTML showing in featured cards
`ProjectFeaturedCard` renders `description` directly on line 58 without stripping HTML. The `stripHtml` fix was applied to `ProjectCard` but missed here.

**Fix in `src/components/ProjectFeaturedCard.tsx`:**
- Add the same `stripHtml` utility
- Apply it on line 58: `{stripHtml(description)}`

## Files Changed
| File | Change |
|---|---|
| `src/pages/Projects.tsx` | Shuffle featured projects with Fisher-Yates on each page load |
| `src/components/ProjectFeaturedCard.tsx` | Strip HTML tags from description |

