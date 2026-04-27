## Goal
Restore the intended parallax behavior on `HomepageParallaxBreak`: as the visitor scrolls down through the "Our Commitment / We Protect & Improve the Buildings People Depend On" section, the background image should slowly **translate downward relative to scroll**, gradually revealing the lower portion of the image — a classic slow-parallax reveal.

## Root cause (confirmed by reading `src/components/homepage/HomepageParallaxBreak.tsx`)
1. **Wrong translate direction.** Line 53 uses `translateY(-${offset}px)`, which moves the image **up** as the user scrolls down. That hides the bottom of the image instead of revealing it. The correct sign for a "reveal-downward" parallax is positive (or the offset itself should be centered around 0 from `-max` to `+max`).
2. **Incorrect progress normalization.** Line 26 (`(windowH - rect.top) / (windowH + rect.height)`) never reaches a clean 0→1 across the section's actual on-screen lifetime, so most of the 160px translation budget is unused — the motion looks static.
3. **Insufficient overflow buffer.** The background layer's `top: -80px; bottom: -80px` slack is too tight for a 160px translate range on a single axis; at scroll extremes a dark band from the section background can peek through.

## Changes (single file: `src/components/homepage/HomepageParallaxBreak.tsx`)

1. **Rewrite the progress calc** so `progress` goes cleanly from `0` (section's top edge enters viewport bottom) to `1` (section's bottom edge exits viewport top):
   ```ts
   const total = windowH + rect.height;
   const traveled = windowH - rect.top;          // 0 → total across full pass
   const progress = Math.max(0, Math.min(1, traveled / total));
   ```

2. **Center the offset around 0** so the image reveals symmetrically (top half visible at entry → bottom half visible at exit):
   ```ts
   const MAX_SHIFT = 120;                        // px per side, tuned to look natural
   const offset = (progress - 0.5) * 2 * MAX_SHIFT;  // -120 → +120
   ```

3. **Flip the translate sign** so a positive `offset` moves the image **down** (revealing the bottom):
   ```tsx
   transform: rm ? "none" : `translate3d(0, ${offset}px, 0)`
   ```
   Using `translate3d` also promotes the layer to its own compositor layer, eliminating subpixel jitter.

4. **Increase the bleed buffer** on the background layer to fully cover the motion range:
   - Change `top: -80px; bottom: -80px` → `top: -140px; bottom: -140px` (slightly larger than `MAX_SHIFT` to guarantee no edge band shows).

5. **Tighten scroll listener correctness:**
   - Keep the `rAF + ticking` pattern (already good).
   - Also call the handler on `resize` so `windowH` changes (mobile URL-bar collapse, rotation) re-sync the offset.
   - Keep the early `if (rm) return;` so reduced-motion users get a static image (no transform).

6. **No changes** to the content layer, overlay, or surrounding `Index.tsx` Suspense boundary. The section remains lazy-loaded.

## Verification (after switch to default mode)
- Scroll the homepage on desktop (1366×768) and mobile (390×844) and confirm the background visibly moves opposite to scroll, with the bottom of the image gradually revealed.
- Toggle `prefers-reduced-motion: reduce` in DevTools → confirm the image stays static (no transform applied).
- Resize the window mid-scroll → confirm no flash or misaligned edge band appears.
- Quick `tsc --noEmit` to confirm no type regressions.

## Out of scope
- No changes to copy ("Our Commitment", headline, subhead).
- No changes to the Unsplash image URL or overlay opacity.
- No changes to the lazy-loading boundary in `Index.tsx`.
