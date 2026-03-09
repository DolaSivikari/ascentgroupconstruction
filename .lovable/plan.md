

## Diagnosis

`/projects` is missing from the `heroPages` array in `src/components/Navigation.tsx` (lines 34-78). Every other hero-based page is listed. This is why the nav renders solid instead of transparent over the Projects hero.

## Fix

Add `'/projects'` to the `heroPages` array. One line, no other changes needed.

**File:** `src/components/Navigation.tsx`  
**Location:** Line 78, before the closing `]`  
**Change:** Add `'/projects'` to the array

No changes to the Projects page, hero slideshow, or any other component.

## Verification checklist
1. `/projects` loads with transparent nav over the hero
2. Nav transitions to solid on scroll
3. No regressions on other hero pages
4. Mobile nav behavior unchanged

