

## Scroll-Activated Vertical Process Timeline

Replace the static 4-step grid (lines 95-124) with an alternating left/right vertical timeline that activates each step as it scrolls into view. The 3-column cards below and footer link remain unchanged.

### Design

```text
Desktop layout:

     [Step 01 card]
           |          ← vertical line draws down
           ●          ← dot scales up when active
           |
                    [Step 02 card]
           |
           ●
           |
     [Step 03 card]
           |
           ●
           |
                    [Step 04 card]
```

On mobile: single column, all steps left-aligned along the timeline.

### Behavior

- Each step has its own `IntersectionObserver` (threshold 0.4) via `useScrollFadeIn`
- When a step enters the viewport:
  - The step number scales from `scale(0.5)` to `scale(1)` (the circle/dot)
  - The card slides in from the left (odd steps) or right (even steps) with fade
  - The connecting line segment transitions from `scaleY(0)` to `scaleY(1)` with `transform-origin: top`
- Stagger: each step gets a 150ms delay after intersection triggers
- `prefers-reduced-motion`: all animations disabled, everything visible immediately

### Implementation

**File: `src/components/homepage/HomepageProcessStrip.tsx`**

Replace lines 95-124 (the `grid grid-cols-2 md:grid-cols-4` block) with:

- A `relative` container with a central vertical line (`absolute left-1/2` on desktop, `left-6` on mobile)
- 4 timeline step items, each using a dedicated ref + `useScrollFadeIn({ threshold: 0.3 })`
- Each step renders:
  - A circle/dot on the center line that scales in
  - A card on the left or right side (alternating via `md:flex-row-reverse` on even steps)
  - The card contains the step number watermark, icon box, title, and description (same content as now)
- The vertical line uses 3 segments between steps, each with `scaleY` tied to whether the *next* step is visible
- Mobile: all cards stack left of the line using `pl-16` with the line at `left-6`

No new files, no new dependencies. Uses existing `useScrollFadeIn` and `useReducedMotion` hooks.

