

# Fix Hero Navigation Transparency for New Pages

The `heroPages` array in `src/components/Navigation.tsx` controls which pages get the transparent/blending navigation over the hero. The new pages are missing from this list.

## Change

**File:** `src/components/Navigation.tsx` (line 78, before `'/projects'`)

Add these entries to the `heroPages` array:
- `'/for-architects'`
- `'/emergency-repair'`

Also need to handle dynamic service area city pages (e.g. `/service-areas/king-city`). The current check uses `heroPages.includes(location.pathname)` which won't match dynamic routes. Will add a `location.pathname.startsWith('/service-areas/')` fallback to the `isHeroPage` check on line 80.

## Summary
- Add 2 static routes to the array
- Add startsWith check for `/service-areas/` dynamic routes
- One file, ~3 lines changed

