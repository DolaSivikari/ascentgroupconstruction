

# Fix Hero Geometry Visibility — Boost All 3 Slides

## Root cause

The hero has a dark gradient overlay at 60-80% black opacity. White SVG strokes at 6-18% opacity against that background produce an effective visible contrast of roughly 2-7% — nearly invisible to the eye. The geometry IS rendering, it's just too faint.

## Solution

**Significantly increase opacity** across all elements to the 25-45% range. This will make the geometry clearly visible as a design element while still remaining secondary to the text/CTAs (which are at full opacity with z-10).

Also add **thicker stroke weights** (1.5-2px instead of 0.8-1px) for better visibility, and boost the fade-pulse keyframe range.

## Changes — `src/components/homepage/HeroGeometry.tsx` only

### Opacity increases

| Element | Current | New |
|---------|---------|-----|
| **Slide 1** | | |
| Section cut line (A) | 0.14 | **0.35** |
| Facade grid (B) | 0.10 | **0.25** |
| Datum mark (C) | 0.18 | **0.40** |
| Diagonal grade (D) | 0.10 | **0.25** |
| **Slide 2** | | |
| Right-angle bracket | 0.14 | **0.35** |
| Measurement ticks | 0.10 | **0.25** |
| Crosshair | 0.16 | **0.35** |
| Dimension arrows (D) | 0.10 | **0.25** |
| **Slide 3** | | |
| Node cluster | 0.14 | **0.35** |
| Building silhouette | 0.08 | **0.20** |
| Alignment mark pulse | 0.08-0.14 | **0.20-0.35** |
| Second silhouette (D) | 0.06 | **0.18** |

### Stroke weight increases

- Lines currently at `0.8` → **1.5**
- Lines currently at `1` → **1.5-2**
- Lines currently at `1.5` → **2**

### Keyframe update

The `geo-fade-pulse` keyframe currently oscillates between 0.08 and 0.14. Update to **0.20 and 0.35**.

### No other files changed

Integration in EnhancedHero.tsx is correct and stays as-is.

