

# Fix: "Our Digital Toolkit" Constellation Appearing Empty

## Root Cause

The constellation SVG nodes all start with `initial={{ scale: 0, opacity: 0 }}` and only animate to visible when `showAnim` is `true`. The `showAnim` flag depends on `isInView` from framer-motion's `useInView` hook.

The problem: when `isInView` is `false`, the `animate` prop is `{}` (empty object). In framer-motion, an empty animate target does **not** reset to CSS defaults — the element stays at its `initial` state (`opacity: 0, scale: 0`). So if `useInView` fires late or doesn't trigger (due to scroll timing, `amount: 0.2` threshold, or the preceding 500vh scrollytelling section pushing it out of range), **every circle, label, and connection line remains invisible**.

The same pattern affects the connection lines (`opacity: 0, pathLength: 0`) and the pulse circles.

When `rm` (reduced motion) is true, `initial` is set to `false` (skipping initial state), but `animate` is still `showAnim ? {...} : {}` — so reduced motion users also see nothing until `isInView` fires.

## Fix

Two changes in `ConstellationSection`:

1. **Lower the `useInView` threshold** from `amount: 0.2` to `amount: 0.05` and add `margin: "100px"` so it triggers earlier as the user scrolls past the 500vh scrollytelling section.

2. **Change the animate fallback** from `{}` to the visible state. Instead of `animate={showAnim ? { scale: 1, opacity: 1 } : {}}`, use `animate={{ scale: showAnim ? 1 : 0, opacity: showAnim ? 1 : 0 }}` for animated elements, OR simpler: just use `animate={{ scale: 1, opacity: 1 }}` always and rely on `initial` + `transition.delay` for the staggered entrance (the `initial` state handles the "hidden before mount" and framer-motion auto-animates from initial to animate on mount). This way elements always animate in once mounted — no gate needed.

The simplest fix: remove the `showAnim` conditional from `animate` props entirely. Use `whileInView` instead of manual `isInView` + `animate`, which is the idiomatic framer-motion pattern and handles intersection automatically.

## Files Modified
- `src/pages/company/Technology.tsx` — update `ConstellationSection` animation logic

