# Hero Slide Layout Refactor — Reduce Visual Clutter

## Goal
Tighten the homepage hero by removing redundant chrome and merging overlapping indicators into a single, clearer control row. The current layout stacks **5 separate visual blocks** above the headline+CTAs (trust badge → stat badge → headline → separator → subheadline → CTAs → progress dots → counter → play/pause → scroll indicator), which competes with the actual message.

## Audit — What's currently on screen
1. Static trust badge ("Building Envelope & Restoration Specialists" w/ Shield icon) — duplicates the SEO title and never changes per slide
2. Per-slide stat pill (e.g., "15+ Years Experience")
3. Headline + accent separator line + subheadline
4. Primary + Secondary CTA
5. Progress bar dots + numeric slide counter (`01 / 04`)
6. Floating play/pause button (bottom-right)
7. Scroll indicator (bottom-center)
8. Unused `HeroGeometry` import (dead code)
9. Unused `Shield` import (after badge removal)

## Changes — `src/components/homepage/EnhancedHero.tsx`

### 1. Remove the static trust badge entirely (lines 520–526)
The `<div>` with `Shield` + "Building Envelope & Restoration Specialists" gets deleted. It's redundant with page metadata, never changes per slide, and pushes the headline down ~70px.

### 2. Consolidate the stat badge into the progress-indicator row
Currently the stat pill sits alone above the headline (order 1) AND the progress dots sit alone below the CTAs (order 5). Merge them: the progress row becomes a single horizontal control strip containing **stat → progress dots → slide counter**, all aligned on one line below the CTAs.

- The `<StatBadge>` is removed from its standalone position above the headline.
- A more compact inline stat (no pill background, just `accent`-colored number + muted label) is placed at the **left** of the progress row.
- Progress dots stay center, counter stays right.
- Result: one clean control strip instead of two separate badge stacks.

### 3. Remove the floating play/pause button (lines 642–652)
Keyboard space-bar already toggles, autoplay pauses on manual nav, and removing this de-clutters the bottom-right corner. Accessibility preserved via `aria-roledescription="carousel"` + keyboard handler already in place.

### 4. Drop the decorative accent separator line (line 550)
The `w-12 h-px bg-accent/60` divider between headline and subheadline adds visual noise. Subheadline `mt-6` margin handles the spacing on its own.

### 5. Cleanup
- Remove unused imports: `Shield`, `HeroGeometry`
- Remove the now-unused `StatBadge` sub-component (lines 690–715) — replaced by inline stat in the control strip
- `useStatCounter` hook stays (still used inline)

## Visual outcome (above the fold)
**Before:** Trust badge → Stat pill → Headline → Divider → Subhead → CTAs → Progress dots → Counter (+ floating play/pause)

**After:** Headline → Subhead → CTAs → [Stat | Progress dots | Counter] single strip

Five visual blocks reduced to four, with the headline now closer to the top of the viewport.

## Out of scope (deferred)
- Overlay lightening, headline cap at `text-6xl`, autoplay timing change to 9s, `useStatCounter` "Free" fix → tracked separately under the original Pass A; can be folded into a follow-up if you want them combined.
- No new media assets, no DB changes.

## Files touched
- `src/components/homepage/EnhancedHero.tsx` (only)
