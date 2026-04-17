

## Rotate Featured Projects on Every Page Load

### Current state

Both Featured Projects sections technically shuffle, but the rotation feels "fixed" because:

1. **Homepage** (`HomepageFeaturedProjects.tsx`) — pool is capped at 12 most-recent featured + 12 most-recent published. If you have ~10–15 published projects total, the same items sit in the pool every time → only the order of the same 3 varies.
2. **Projects page** (`Projects.tsx`) — `useMemo` shuffles client-side, so navigating away and back inside the same session can replay the same shuffle (React state lifecycle), and the carousel + spotlight share one shuffle so they always mirror each other.
3. **React Query caching** — homepage uses `useQuery` with a static key. Even with `staleTime: 0`, the cached data may flash before refetch, masking rotation.

### Fix

**Single principle:** every page load draws a fresh random sample from the *entire* published-projects pool, not just the latest 12.

#### Homepage — `src/components/homepage/HomepageFeaturedProjects.tsx`
- Remove the `featured=true` + `latest 12` two-tier query. Replace with a single query that fetches **all published projects** (id, title, slug, category, location, featured_image, summary, year only — small payload).
- Prefer `featured=true` projects first: take all featured, then backfill from non-featured if fewer than 3 featured exist.
- Shuffle the selected pool, slice 3.
- Add a per-mount random seed to the React Query key (e.g. `["homepage-featured", mountId]` where `mountId = useState(() => Math.random())`) so every mount fetches fresh and ignores any stale cache.

#### Projects page — `src/pages/Projects.tsx`
- Keep `useMemo` shuffle but add a per-mount random seed in the dependency array so it re-shuffles on every mount, not only when `allProjects` changes.
- Pull the spotlight sample from `featured=true` first (matching homepage logic), backfilled from any published — prevents the spotlight from showing low-priority projects when featured ones exist.
- **Decouple** the `PremiumProjectHero` carousel and the spotlight grid: give them two independent random samples so visitors see 6 different projects (3 in hero, 3 in spotlight) instead of the same 3 twice.

### Out of scope
- No DB changes, no admin changes.
- No layout/visual changes — same 3-card grid.
- `ServicesFeaturedWork` (services page) already does tier-1/tier-2 logic correctly; leaving it alone unless you want it to rotate too.

### Files touched (2)
- `src/components/homepage/HomepageFeaturedProjects.tsx`
- `src/pages/Projects.tsx`

### Result
- Every refresh / revisit / navigation back to home or `/projects` shows a different random sample.
- All published projects get fair rotation exposure over time, with featured projects prioritized.
- Hero carousel and spotlight grid on `/projects` no longer duplicate each other.

