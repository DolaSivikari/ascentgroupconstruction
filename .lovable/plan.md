## Project Gallery Lightbox — Fix Broken Image Viewer

### What's wrong (root cause)

The `ProjectGallery` component (`src/components/ProjectGallery.tsx`, lines 218–299) hand-rolls its own image viewer modal. It has three concrete problems:

1. **"Blue borders" everywhere** — The custom buttons (close/prev/next/download) use Tailwind defaults that show the browser's blue focus ring on click/tap, and the `bg-[hsl(var(--bg))]/10` translucent layer over the dark backdrop reads as faint blue rectangles.
2. **Have to scroll up to close** — The modal uses `fixed inset-0` but does **not lock body scroll**. On a long project page (especially mobile), the page underneath keeps its scroll position, and because the close button sits at `top-4 right-4` of the viewport, it's actually fine *if* the modal stays in view — but the missing `overflow: hidden` on `<body>` causes the layout to shift and the modal content (image + caption + counter + bottom action bar) to push downward, making the close button feel out of reach.
3. **Image stuck at the bottom** — The image wrapper is `<div className="max-w-7xl max-h-[85vh] px-4">` placed inside a parent `flex items-center justify-center`. But the wrapper also contains the caption, counter, and the bottom action bar is a separate absolutely-positioned element. The combination pushes the image visually toward the bottom of the screen instead of being truly centered.

Meanwhile, the project **already has a polished, working lightbox** — `InteractiveLightbox.tsx`, built on `yet-another-react-lightbox`. It's already used on `ProjectDetail.tsx` for the hero image (line 280). It correctly handles body scroll lock, fixed close button, true centering, zoom, image counter, keyboard navigation, and swipe gestures. The gallery just isn't using it.

### The fix

Replace the entire custom lightbox block in `ProjectGallery.tsx` with the existing `InteractiveLightbox` component. This is a clean swap — same props are available (images array, current index, open state, close handler).

**Concretely:**

1. **Import `InteractiveLightbox`** at the top of `ProjectGallery.tsx`.
2. **Delete** the custom lightbox JSX (lines 218–299) — the `<div className="fixed inset-0 z-50 ...">` block and everything inside it.
3. **Delete** the now-unused keyboard `useEffect` (lines 47–59), `handlePrevImage`, `handleNextImage` helpers, and unused icon imports (`ChevronLeft`, `ChevronRight`, `X`, `Download`, `Share2`). Keep `ZoomIn` for the hover overlay on grid cards.
4. **Render `<InteractiveLightbox>`** at the bottom, mapping `displayImages` to its `{ src, alt, caption }` shape and passing `isOpen={lightboxOpen}`, `initialIndex={currentImageIndex}`, `onClose={() => setLightboxOpen(false)}`.

That's it. The grid behavior (tabs, hover zoom, before/after slider, captions) stays untouched.

### What gets fixed automatically by switching

- ✅ No more blue focus rings — the library uses neutral-styled controls
- ✅ Close button is fixed in the top-right and always reachable
- ✅ Body scroll is locked while open, so closing returns you to your scroll position (no need to scroll up)
- ✅ Image is properly centered vertically and horizontally
- ✅ Pinch-zoom and scroll-to-zoom work on mobile and desktop
- ✅ Image counter at the bottom (e.g. "3 / 12")
- ✅ Keyboard arrows + Escape work out of the box
- ✅ Swipe to navigate on touch devices
- ✅ Backdrop click closes the lightbox

### What's removed (and why it's fine)

The custom lightbox had two extra buttons:
- **Download** — Removable. Users can long-press / right-click the image to save it. Optional and not standard for portfolio galleries; most case-study sites don't expose downloads.
- **Share** (Web Share API) — Removable. The whole project page already shares fine via the URL; sharing a single gallery image isn't a meaningful use case for B2B project portfolios. If you ever want it back, we can add it as a custom plugin button.

Removing these matches the cleaner experience already used by the hero image lightbox on the same page, so behavior is consistent across the project detail.

### Files I'll touch

1. `src/components/ProjectGallery.tsx` — swap custom lightbox for `InteractiveLightbox`, remove dead code

No new dependencies. No DB changes. No edge function changes. Roughly a 60-line net deletion.

### Result

Click any image in the project gallery → it opens in a true full-screen viewer that's centered, zoomable, swipeable, with a reachable close button and locked background scroll. Works identically on desktop and mobile, and matches the hero-image lightbox already in use on the same page.

Approve and I'll ship it.