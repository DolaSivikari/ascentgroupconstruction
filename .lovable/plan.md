

# Hero Slides Interactivity Enhancement

## What to add

Four interaction layers to the existing `EnhancedHero.tsx`, all restrained and premium:

### 1. Animated progress bar
Replace the current dot indicators with a segmented progress bar. Each segment represents one slide. The active segment fills left-to-right over the 7-second autoplay duration using a CSS animation. Clicking a segment jumps to that slide and resets the fill. Pausing stops the fill mid-progress. The dots' current styling (accent color, rounded) carries over.

### 2. Parallax mouse-tracking
Track mouse position over the hero section. Apply a subtle `transform: translate()` offset to two layers:
- **Video background**: shifts opposite to cursor (max ~8px), creating depth
- **Text content**: shifts slightly with cursor (max ~4px)

Only on `pointer: fine` devices (no touch). Respects `prefers-reduced-motion`. Uses `requestAnimationFrame` for smooth 60fps updates with lerp damping.

### 3. Keyboard navigation + swipe hints
- Add `onKeyDown` handler: ArrowLeft/Right to navigate slides, Space to toggle play/pause
- On mobile first visit, show a brief "Swipe to explore" hint with a horizontal arrow animation that fades out after 3 seconds (stored in `sessionStorage` so it only appears once per session)
- Add `tabIndex={0}` and `role="region"` with `aria-roledescription="carousel"` for accessibility

### 4. Stat counter animation
The per-slide stat (e.g. "15+", "85%", "Free") gets a counting-up animation on slide entry:
- Parse numeric prefix from stat string (15 from "15+", 85 from "85%")
- If numeric: animate from 0 to target over ~1.2s using `requestAnimationFrame` with easing, then append the suffix ("+", "%")
- If non-numeric (like "Free"): just fade in normally
- Counter resets and replays on each slide change
- Stat + label rendered as a floating badge in the top-right area of the content block (glassmorphism style matching the trust badge)

## File changes

| File | Change |
|------|--------|
| `src/components/homepage/EnhancedHero.tsx` | All four features integrated into existing component |

No new files needed. No other files touched.

## What is preserved
- All autoplay, video preloading, CMS data cascade, touch swipe, play/pause, reduced-motion, `hero-ready` event logic
- All existing transitions (600ms fade, 1200ms transition guard)
- All CTA rendering and data mapping
- Admin slide override behavior

## Technical notes
- Mouse tracking uses a single `mousemove` listener with `useRef` for position, updated via `rAF` — no state-driven re-renders
- Progress bar animation uses CSS `@keyframes` with `animation-play-state: paused/running` tied to `isPlaying` state — no JS timers for the fill
- Swipe hint uses a small inline element with `opacity` transition, removed from DOM after timeout
- Counter uses `useEffect` triggered by `currentSlide` changes, with cleanup to cancel in-flight animations

