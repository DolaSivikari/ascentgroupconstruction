

## Fix: Project Card Image Consistency + Featured Card Text Overflow

Two distinct bugs causing visual inconsistency on the `/projects` page.

---

### Problem 1: New project images don't match existing card style

**Root cause:** In `ProjectCard.tsx`, the image is wrapped in a `ScrollReveal` component (line 75-85) which adds an extra `div` without `w-full h-full`. The parent has `aspect-[4/3]`, but the `ScrollReveal` div breaks the height chain, causing `OptimizedImage` to not fill the container. Older projects may have images that happen to work, but newly uploaded images with different dimensions render incorrectly.

**Fix in `src/components/ProjectCard.tsx`:**
- Remove the `ScrollReveal` wrapper from around the `OptimizedImage` inside the card (lines 75-85). The card itself is already inside a `ScrollReveal` on the Projects page grid — double-wrapping is redundant and breaks the image fill.
- Ensure `OptimizedImage` uses `className="w-full h-full object-cover"` without the extra `animate-fade-in` and hover scale (move scale to the parent container via `group-hover:scale-105` on the image directly).

### Problem 2: Featured Projects text overflows card borders

**Root cause:** In `ProjectFeaturedCard.tsx`, the bottom content overlay (lines 58-77) is absolutely positioned with `p-6` but has no overflow protection. Long project titles (`text-3xl font-bold`), descriptions, and the stats pill row (`flex-wrap gap-4`) can collectively exceed the card height, pushing content outside the visible area.

**Fix in `src/components/ProjectFeaturedCard.tsx`:**
- Add `overflow-hidden` to the bottom content container
- Constrain the title with `line-clamp-2` (already has `text-3xl font-bold`, just add the clamp)
- Ensure description keeps `line-clamp-2`
- Add `max-h` and `overflow-hidden` to the stats row so it doesn't push below the card
- Reduce the stats pills to a simpler layout: use `flex-wrap` with `max-h-[3.5rem] overflow-hidden` so at most 2 rows of pills show

### Future-proofing

Both fixes make the layout resilient to any image dimensions or text lengths from the admin panel — no special image prep or text truncation needed when adding new projects.

---

### Technical Details

**File 1: `src/components/ProjectCard.tsx`**
- Lines 74-85: Remove `ScrollReveal` wrapper, keep `OptimizedImage` directly inside the `aspect-[4/3]` container
- Add `group-hover:scale-105 transition-transform duration-300` to the image for hover effect

**File 2: `src/components/ProjectFeaturedCard.tsx`**
- Line 58: Add `overflow-hidden` to the bottom overlay div
- Line 59: Add `line-clamp-2` to the title h3
- Lines 63-76: Add `max-h-[3rem] overflow-hidden` to the stats flex container
- Reduce stats padding from `px-3 py-1` to `px-2 py-0.5` and text to `text-xs` for tighter fit

