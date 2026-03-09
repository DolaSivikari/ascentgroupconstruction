

# Bug: Hero Content Invisible Due to Animation Implementation

## Root Cause

The `staggerStyle` helper in `PageHero.tsx` (line 105-109) sets `opacity: 0` as an **inline style** on every content element. The animation is applied via the Tailwind class `motion-safe:animate-fade-in`, which only activates when `prefers-reduced-motion: no-preference`.

**Critical issue:** The Tailwind `animate-fade-in` class definition is `fade-in 0.3s ease-out` — this does NOT include `animation-fill-mode: both`. So even though `staggerStyle` sets `animationFillMode: 'both'` in the style object, there's a conflict:

1. Inline `opacity: 0` is always applied
2. The `motion-safe:animate-fade-in` class fires the animation (0.3s ease-out) — but the animation duration is only 300ms with NO fill-mode in the Tailwind definition
3. The inline style `animationFillMode: 'both'` should theoretically work, but the `animationDelay` means elements stay at `opacity: 0` until their delay fires, and if the animation class doesn't properly compose with the inline styles, content stays invisible

Additionally — the `animate-fade-in` animation is `0.3s` long but the delays go up to `300ms`. By the time the last element starts animating, the CSS animation defined by the class may have already been evaluated.

## The Fix

Remove the `opacity: 0` from inline styles entirely. Instead, use only CSS animation with `animation-fill-mode: both` to handle initial opacity. The `motion-safe:` prefix will handle reduced-motion users — they'll see content immediately (no animation class = no opacity manipulation).

### Changes to `src/components/shared/PageHero.tsx`

**Replace the `staggerStyle` helper** with one that does NOT set `opacity: 0` inline. Instead, apply all animation properties via inline styles so they compose correctly:

```typescript
const staggerStyle = (delayMs: number): React.CSSProperties => ({
  animationDelay: `${delayMs}ms`,
  animationFillMode: 'both',
});
```

But this alone won't fix it — the `animate-fade-in` keyframes start at `opacity: 0`, and `animation-fill-mode: both` means the element takes the `0%` keyframe state before the animation starts. This should work IF the animation-fill-mode is properly applied.

The actual robust fix:

1. Remove `opacity: 0` from `staggerStyle` — it's redundant when `animation-fill-mode: both` is used (the `0%` keyframe already sets `opacity: 0`)
2. Change from `motion-safe:animate-fade-in` (Tailwind class) to applying the full animation via inline styles so delay + fill-mode + animation-name all compose together without class conflicts
3. For `prefers-reduced-motion` users, skip the inline styles entirely so content appears immediately

```typescript
const staggerStyle = (delayMs: number): React.CSSProperties => ({
  animation: `fade-in 0.5s ease-out ${delayMs}ms both`,
});
```

And wrap elements with a simpler class approach: `motion-safe:` prefix on a wrapper, or check via a media query style. The cleanest approach:

- Each element gets `style={staggerStyle(delay)}` with the full animation shorthand
- Each element gets `className="motion-safe:..."` — but since we're using inline `animation`, we need a different reduced-motion approach

**Cleanest fix:**

```typescript
const staggerStyle = (delayMs: number): React.CSSProperties => ({
  opacity: 0,
  animation: `fade-in 0.5s ease-out ${delayMs}ms both`,
});
```

Then add a CSS rule:
```css
@media (prefers-reduced-motion: reduce) {
  [style*="animation"] {
    animation: none !important;
    opacity: 1 !important;
  }
}
```

**But the simplest correct fix** that works with existing infrastructure:

Remove `opacity: 0` from staggerStyle. Remove `motion-safe:animate-fade-in` from classNames. Instead, apply the full animation inline and add a reduced-motion CSS override in `animations.css`.

### Implementation

**File 1: `src/components/shared/PageHero.tsx`**
- Change `staggerStyle` to return `{ animation: 'fade-in 0.5s ease-out Xms both' }` (no explicit `opacity: 0`)
- Remove all `motion-safe:animate-fade-in` from element classNames (the animation is now in the inline style)
- Add a wrapper class `hero-stagger` on the content container for reduced-motion targeting

**File 2: `src/styles/animations.css`**
- Add a reduced-motion rule that sets `.hero-stagger *` to `animation: none !important; opacity: 1 !important;` when `prefers-reduced-motion: reduce`

### Files changed
| File | Change |
|------|--------|
| `src/components/shared/PageHero.tsx` | Fix staggerStyle, remove broken class+inline conflict |
| `src/styles/animations.css` | Add reduced-motion override for hero stagger |

### Risk
- Low — only changes animation delivery method, no structural/layout changes
- All hero content (Markets CTAs, breadcrumbs, titles, descriptions) will become visible again
- Reduced-motion users see instant content with no animation

