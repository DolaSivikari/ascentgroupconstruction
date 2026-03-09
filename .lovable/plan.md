

# Fix Technology Page Visual Issues

## What's broken (from screenshots)

### 1. Before/After Slider — Ascent Standard text is invisible
The "Ascent Standard" (right panel) uses `clipPath: inset(0 0 0 ${sliderPos}%)` which clips from the left. But the text content is left-aligned (`px-10`) inside the panel. At 50% slider position, all the text sits in the clipped (hidden) region. The user sees a solid dark rectangle with no content.

**Fix**: Right-align the Ascent Standard content so it's always visible in the revealed portion, or use a different layout where each panel's text is positioned within its own visible half.

### 2. Scrollytelling — Stats are nearly invisible
The stat numbers use `text-background/10` (10% opacity white on dark background), making "100%", "Bluebeam", "Day 1", "Daily" practically invisible. These are meant to be large watermark-style numbers but they're too faint to read.

**Fix**: Increase opacity to `text-background/20` or `/25` so they serve as visible background typography.

### 3. Scrollytelling — Reduced motion fallback has invisible text
When `useReducedMotion()` returns true, the stacked phase list (lines 373-388) renders outside the dark-bg wrapper, using `text-background` (white) on the default page background (also white/light). Titles and body text are completely invisible.

**Fix**: Wrap the rm fallback in a container with `bg-foreground` or change text colors to `text-foreground`.

### 4. Empty visual feel across sections
The constellation, scrollytelling, and slider sections lack any imagery, illustration, or visual weight. They're text-only on flat backgrounds, which makes them feel unfinished rather than "minimal."

**Fix** (lightweight): Add subtle geometric/grid visual elements to fill empty space in the scrollytelling left column and constellation section, similar to the grid texture already used in the hero and manifesto sections.

## Implementation plan

### File: `src/pages/company/Technology.tsx`

**A. Fix Before/After slider (lines 662-693)**
- Change layout from overlapping absolute panels to a side-by-side approach where each panel occupies its half
- Or: keep the clip approach but right-align the Ascent content using `text-right` and `items-end` / `flex-row-reverse` so content sits in the visible clipped area

**B. Fix scrollytelling stat opacity (line 318)**
- Change `text-background/10` to `text-background/20`

**C. Fix reduced-motion fallback (lines 373-388)**
- Add `bg-foreground` to the fallback container div, or change text classes from `text-background` to `text-foreground`

**D. Add visual weight to scrollytelling left panel**
- Add a subtle icon or geometric element behind the stat number to fill the empty space

## Files modified
- `src/pages/company/Technology.tsx` — 4 targeted fixes

