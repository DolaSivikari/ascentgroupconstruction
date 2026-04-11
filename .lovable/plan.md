

## Rewrite: Horizontal-Scroll Project Showcase

Replace the current 3-column card grid in `HomepageFeaturedProjects.tsx` with a cinematic, scroll-driven horizontal gallery — pinned sticky section where vertical scrolling drives horizontal movement.

---

### How it works

The section occupies a tall vertical space (e.g. `height: 300vh`). Inside, a sticky container pins to the viewport. As the user scrolls through the tall wrapper, a `useEffect` with `scroll` listener (or `IntersectionObserver` + `requestAnimationFrame`) calculates progress and applies `translateX` to slide the project cards horizontally. Each card is ~60vw wide with the image taking ~70% of the card height and text overlaid at the bottom.

On mobile, this reverts to a simple horizontally swipeable row (CSS `overflow-x: auto` + `snap-x`).

Reduced motion: skip the sticky/translate mechanic entirely, show cards in a static row.

---

### Changes

**File: `src/components/homepage/HomepageFeaturedProjects.tsx`** — complete rewrite

1. **Data fetch stays the same** — keep the existing `useQuery` that merges featured + latest projects (bump limit to 5-6 for a longer scroll gallery)
2. **Desktop: Sticky horizontal scroll**
   - Outer wrapper: `relative` with dynamic height based on card count (e.g. `${cardCount * 100}vh`)
   - Inner sticky container: `sticky top-0 h-screen overflow-hidden flex items-center`
   - Track div: `flex gap-8` with `transform: translateX(...)` driven by scroll progress
   - Each card: `w-[60vw] flex-shrink-0` with large hero image (70% height) and overlaid text at bottom
   - Scroll progress calculated via `getBoundingClientRect()` of the outer wrapper in a `rAF` loop
3. **Mobile: Swipeable row**
   - `overflow-x-auto snap-x snap-mandatory` horizontal scroll
   - Each card: `w-[85vw] snap-center flex-shrink-0`
4. **Card design**
   - Full card is a `Link` to `/projects/:slug`
   - Image fills 70% height with gradient overlay at bottom
   - Category badge top-left
   - Title + location overlaid on bottom with `line-clamp` protection
5. **Header** — keep existing header with "Recent Work" / "Featured Projects" / "View all" link, positioned above the sticky area
6. **Reduced motion** — if `useReducedMotion()` is true, render the mobile swipeable layout on all screen sizes (no sticky pinning)

### Technical details

- Use `useRef` for the outer wrapper + `useEffect` with `scroll` listener + `requestAnimationFrame` for smooth 60fps updates
- `translateX` is clamped between 0 and `-(totalWidth - viewportWidth)`
- Progress = how far the wrapper's top has scrolled past the viewport top, divided by (wrapper height - viewport height)
- Clean up listeners on unmount
- No additional dependencies needed — pure React + CSS transforms

