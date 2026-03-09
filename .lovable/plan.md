

# Spread Hero Geometry Across Full Slide

## Problem
All geometry elements are clustered in the x=1500–1875 range of the 1920×1080 viewBox — everything sits on the far right. The geometry should surround the entire hero to create an atmospheric architectural layer.

## Approach
Redistribute elements across all four quadrants while keeping the right side populated. The text content occupies roughly x=100–900, y=300–700 (left-center), so geometry there should use lower opacity to avoid competing with CTAs/headlines.

## New Element Positions

### Slide 1 (Building Envelope)
| Element | Current Position | New Position |
|---------|-----------------|--------------|
| A – Section cut line (vertical + ticks) | x≈1580, y=80–520 | **x≈120, y=80–520** (top-left) |
| B – Facade grid (4×3) | x=1650–1830, y=340–580 | **x=1650–1830** (keep right) |
| C – Datum mark (drifting) | x=1500–1720, y≈860 | **x=200–420, y≈920** (bottom-left) |
| D – Diagonal grade line | x=1500–1820, y=600–700 | **x=1500–1820** (keep right) |
| **New E** – Corner bracket | — | **x≈1750, y≈900** (bottom-right corner) |
| **New F** – Horizontal datum | — | **x=80–350, y≈540** (left-center, low opacity) |

### Slide 2 (Precision)
| Element | Current Position | New Position |
|---------|-----------------|--------------|
| Right-angle bracket | x=1700–1840, y=120–280 | **x=100–240, y=120–280** (top-left) |
| Measurement ticks | x≈1760, y=440–640 | **x=1760** (keep right) |
| Crosshair (drifting) | x=1580–1680, y≈820 | **x=250–350, y≈850** (bottom-left) |
| Dimension arrows | x=1720–1820, y≈700 | **x=1720–1820** (keep right) |
| **New E** – Small grid fragment | — | **x=80–200, y=500–620** (left-center, low opacity) |

### Slide 3 (Network/Reach)
| Element | Current Position | New Position |
|---------|-----------------|--------------|
| Dot cluster + lines | x=1620–1820, y=140–310 | **Split**: half at x=100–300, y=120–280 (top-left), half stays right |
| Building silhouette | x=1660–1780, y=430–580 | Keep right |
| Alignment mark (pulsing) | x=1700–1800, y≈880 | **x=150–250, y≈900** (bottom-left) |
| Second silhouette | x=1800–1875, y=470–580 | **x=80–155, y=500–610** (left-center) |
| **New E** – Connecting line across | — | **x=300→1600, y≈200** (subtle long horizontal, very low opacity ~15%) |

## Opacity Strategy
- Elements near text zone (x=100–900, y=300–700): use **15–20%** opacity to avoid competing
- Elements in corners/edges away from text: keep **25–40%** as current
- New spanning elements: **12–15%** opacity

## File Changed
Only `src/components/homepage/HeroGeometry.tsx` — redistribute coordinates, add new corner/edge elements, adjust opacity for left-side placements.

