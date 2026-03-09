

# Fix and Enhance Hero Geometry — All 3 Slides + Additional Elements

## Problems to fix

1. **Invisible geometry**: Current opacity values (4-8%) are imperceptible against the `from-black/70 via-black/60 to-black/80` gradient. Need to increase to 12-20% range.
2. **Broken draw animation**: The `geo-draw` keyframe references `var(--dash-length)` which is never defined. The inline `strokeDashoffset` gets overridden by the animation's `from` value resolving to `0`, so the draw effect never plays. Fix: use a fixed pixel value in the keyframe or set the CSS variable.

## Changes to `src/components/homepage/HeroGeometry.tsx`

### Fix the `geo-draw` keyframe
Replace `var(--dash-length)` with a concrete value (e.g. `600`) or switch approach: set `--dash-length` as an inline CSS variable on each element and reference it in the keyframe. Cleaner approach: use `stroke-dashoffset: 1` in the `from` block with percentage-based values, or just hardcode `600` since all elements use similar lengths.

### Increase opacity across all slides
| Element | Current | New |
|---------|---------|-----|
| Slide 1: Section cut | 6% | 14% |
| Slide 1: Facade grid | 5% | 10% |
| Slide 1: Datum mark | 8% | 18% |
| Slide 2: Right-angle bracket | 6% | 14% |
| Slide 2: Measurement ticks | 5% | 10% |
| Slide 2: Crosshair | 7% | 16% |
| Slide 3: Node cluster | 6% | 14% |
| Slide 3: Building silhouette | 4% | 8% |
| Slide 3: Alignment mark pulse | 4-7% | 8-14% |

### Add one more element to each slide

- **Slide 1**: Add a thin diagonal construction reference line (bottom-left to mid-right area of the right zone) — static, ~10% opacity. Suggests a slope or grade line.
- **Slide 2**: Add a small dimension arrow pair (two arrowheads with a line between them) below the measurement ticks — static, ~10% opacity. Architectural dimension notation.
- **Slide 3**: Add a second smaller building silhouette fragment offset from the first — static, ~6% opacity. Creates a skyline cluster effect.

### File changes
Only `src/components/homepage/HeroGeometry.tsx` is modified. No other files touched.

