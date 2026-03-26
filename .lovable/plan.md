

## Plan: Make Logo Larger Without Increasing Nav Height

### Approach
Use **negative vertical margins** on the logo so it visually overflows the nav bar without increasing the bar's height. This is a common pattern used by enterprise construction sites (e.g., Turner, Skanska) where the logo "breaks out" of the header slightly.

### Changes — Single file: `src/components/Navigation.tsx`

**Desktop logo (line ~188):**
- Change `h-10 md:h-11 lg:h-12` → `h-12 md:h-14 lg:h-16`
- Add `-my-2 md:-my-3 lg:-my-4` (negative margins absorb the extra height so the nav bar stays the same size)

**Mobile logo (line ~316):**
- Change `h-9` → `h-11 -my-1` (slightly larger without affecting the mobile nav height)

### Why this works
- `h-16` on the logo = 64px, but the nav is 80px at `lg:` — so the logo stays within bounds
- Negative margins tell the layout engine to ignore the extra height, keeping the nav bar at exactly `h-16 md:h-18 lg:h-20`
- No other elements shift or break

### What stays the same
- Nav bar height unchanged
- All nav links, buttons, spacing unchanged
- Mega menu positioning unchanged
- Mobile menu unchanged

