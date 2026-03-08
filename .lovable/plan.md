

# Fix Services Mega Menu Scrolling

## Problem
The `.mega-menu-sections-wrapper` CSS class sets `max-height: 520px; overflow-y: auto;`. The Services menu has the most content (13 sub-items across 4 categories), so it overflows and scrolls. The other menus (Company, Resources, Who We Serve) have fewer items and fit within 520px, so they appear fixed.

## Fix
**File:** `src/index.css` (lines 448-454)

Increase `max-height` from `520px` to `80vh` — this gives the menu enough room to display all Services items without scrolling, while still preventing the menu from exceeding the viewport on very small screens. The `overflow-y: auto` stays as a safety net.

| Property | Current | New |
|---|---|---|
| `max-height` | `520px` | `80vh` |

One line change. No other files affected.

