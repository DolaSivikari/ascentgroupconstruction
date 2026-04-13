

## Fix Parallax Scroll Effect — Image Should Move Up as User Scrolls Down

### Why it looks fixed

The current code uses `useState` + `setOffset` to drive the `translateY` transform. Every scroll tick calls `setOffset()`, which triggers a full React re-render cycle. React batches these state updates, causing the transform to lag or appear frozen — the image looks static instead of smoothly gliding.

Additionally, the background image is loaded from an external Unsplash URL (slow to load, may flash blank), when the original plan called for the local asset `hero-construction-management.jpg`.

### Fix

**File: `src/components/homepage/HomepageParallaxBreak.tsx`**

Switch from React state (`useState`/`setOffset`) to a **direct DOM ref** approach — mutate `style.transform` on the background div ref inside `requestAnimationFrame`, bypassing React's render cycle entirely. This is the standard pattern for smooth scroll-driven parallax:

1. Add a second ref (`bgRef`) pointing to the background `<div>`
2. Inside the scroll handler's `requestAnimationFrame`, set `bgRef.current.style.transform = ...` directly instead of calling `setOffset`
3. Remove the `offset` state variable entirely
4. Replace the Unsplash URL with the local asset import (`hero-construction-management.jpg`) for faster load and consistency with the original plan

This keeps the same parallax math (40% speed, 160px max shift, 80px vertical buffer) but makes the movement buttery smooth because it skips React rendering completely.

