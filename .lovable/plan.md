

## Fix Featured Projects Card Visual Issues

### Problems identified

1. **Images not fitting to card border**: Conflicting CSS — `aspect-[4/3] md:aspect-[16/9] md:h-64` creates unpredictable sizing. The `md:h-64` fixed height fights with the aspect ratio classes, and OptimizedImage's internal wrapper may add extra spacing.

2. **Card sizes uneven**: Varying summary lengths + inconsistent image sizing means cards don't align in the grid.

3. **Badge text invisible**: The `glass` badge variant (used for Location) renders `text-white` — on a white card background this is unreadable. The badge was designed for dark/image overlays, not white card content areas.

### Changes

**File: `src/components/homepage/HomepageFeaturedProjects.tsx`**

- **Image container** (line 106): Replace `aspect-[4/3] md:aspect-[16/9] md:h-64` with a consistent `aspect-[4/3]` only — no fixed height override. This ensures all images have the same proportional container regardless of source dimensions.
- **Card structure** (line 103): Add `h-full flex flex-col` to the Card so all cards stretch to the same height in the grid.
- **CardContent** (line 119): Add `flex-1 flex flex-col` so content fills remaining space evenly.
- **Summary** (line 143): Add `flex-1` so the text area absorbs height differences, keeping footers aligned.
- **Location badge** (line 122): Change `variant="glass"` to `variant="secondary"` — glass uses white text meant for overlays on dark backgrounds, secondary uses dark text on light background which is readable on white cards.

**File: `src/components/OptimizedImage.tsx`** — No changes needed; the component respects `w-full h-full object-cover` when given proper container sizing.

### Result

- All three cards will have identical height (flexbox stretch)
- Images will have a consistent 4:3 aspect ratio edge-to-edge
- All badge text will be readable on white card backgrounds
- The CTA button (outline variant with navy text/border) is already readable — no change needed there

