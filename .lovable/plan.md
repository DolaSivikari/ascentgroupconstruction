

## Fix Parallax Background Scroll Effect

### Root cause

Two issues prevent the parallax from being visible:

1. **CSS conflict**: The Tailwind class `inset-0` generates the shorthand `inset: 0px`, which can fight with the inline `top: -60px` / `bottom: -60px` style overrides depending on browser resolution order. The background div needs explicit positioning without the `inset-0` shorthand.

2. **Overlay too heavy**: `bg-primary/80` (80% opacity) makes the background image almost invisible, so even if parallax is working, the movement is barely perceptible.

### Changes

**File: `src/components/homepage/HomepageParallaxBreak.tsx`**

- Remove `inset-0` from the background div class; use explicit `left-0 right-0` instead, letting inline `top`/`bottom` control vertical bounds without shorthand conflict
- Reduce overlay from `bg-primary/80` to `bg-primary/60` so the background image and its movement are more visible
- Increase parallax range from 120px to 160px shift and extend the vertical buffer from 60px to 80px for more noticeable movement

