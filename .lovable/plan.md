

# Hero Construction Geometry — Refined Plan

## Assessment

The concept is appropriate for Ascent's hero system. The current hero has strong left-aligned text with underutilized right-side space. A subtle SVG geometry layer will add depth and construction identity without competing with content.

**Element count:** 4-6 per slide is too many. Safer target is **2-3 primary elements + 1 micro accent** per slide. Start with Slide 1 only.

**Elements to avoid (too literal):** checklist ticks, compass rose, ruler graphics, any filled/illustrative shapes.

**Elements that work (architectural abstraction):** section cut lines, facade grid fragments, alignment/datum marks, measured offset ticks, thin right-angle brackets.

**Opacity/motion tuning:**
- Most elements at 4-6% opacity
- One accent line at 8-10% max
- Mixed motion: one draws in (stroke-dashoffset), one drifts slowly (20px over 20s), one stays static
- Rotation capped at 0-4 degrees, most elements at 0
- All fade out with slide transition (synced to existing 600ms fade)

**Performance risk:** Negligible — 3-4 SVG paths with CSS animations, no JS loops.
**Readability risk:** None at proposed opacity levels. Geometry is right-side only, never overlapping CTA cluster.

## Files to change

| File | Change |
|------|--------|
| `src/components/homepage/HeroGeometry.tsx` | **New.** SVG component with per-slide geometry sets |
| `src/components/homepage/EnhancedHero.tsx` | Import and render `HeroGeometry` between gradient overlay and text content |

## Layer order (confirmed)

1. Video background
2. Dark gradient overlay
3. **Geometry layer** (new, `z-5`, `pointer-events-none`)
4. Text/content (`z-10`)
5. Nav (above all)

## Implementation — Slide 1 only first

### `HeroGeometry.tsx`

Component accepts `slideIndex`, `isFadingOut`, `prefersReducedMotion`.

**Slide 1 elements (building envelope theme):**
- **Element A — Section cut line:** Vertical line with short horizontal ticks at intervals, positioned top-right. Draws in via `stroke-dashoffset` over 3s. Opacity 6%.
- **Element B — Facade grid fragment:** 4x3 rectangle grid suggesting a curtain wall pattern, right-center. Static. Opacity 5%.
- **Element C — Datum/alignment mark:** Short horizontal line with small perpendicular end-ticks, bottom-right. Drifts up 15px over 18s. Opacity 8%.

All elements: white stroke, no fill, 1-1.5px stroke-width, `stroke-linecap: round`.

Reduced motion: all elements render static at final position, no animation.

Fades out with slide transition via parent opacity sync.

**Slides 2 and 3:** Geometry sets defined but only activated after Slide 1 is validated. Slide 2 uses process-themed marks (right-angle brackets, offset ticks). Slide 3 uses network-themed marks (dot clusters with thin connecting segments).

### `EnhancedHero.tsx`

Insert between gradient overlay (line 391) and content div (line 394):

```tsx
<HeroGeometry
  slideIndex={currentSlide}
  isFadingOut={isFadingOut}
  prefersReducedMotion={prefersReducedMotion}
/>
```

No other changes to EnhancedHero.

## What is preserved

All existing hero logic: autoplay, parallax, progress bars, stat counter, swipe, keyboard nav, CMS cascade, video preloading, reduced motion, `hero-ready` events. No other pages or components affected.

