## Fix the awkward Featured Image on every project page

### What's wrong (root cause)

In `src/pages/ProjectDetail.tsx` (lines 252–293), the featured-image block does this:

```tsx
<div className="aspect-[4/3] md:aspect-[2/1] ..."> // forces 2:1 box on desktop
  <OptimizedImage
    objectFit="contain"  // shrinks image to fit inside the box
    className="... object-contain ..."
  />
</div>
```

That combo (`aspect-[2/1]` + `object-contain`) is what's creating the awkward look you screenshotted:

- The container is forced into a **fixed 2:1 wide box**
- `object-contain` then **letterboxes** the real image inside it — leaving gray bars on the sides for portrait/square images, or top/bottom for non-2:1 landscape images
- The grey is `bg-muted/20` from `OptimizedImage` showing through behind the contained image
- Because admins upload images at all kinds of aspect ratios (phone shots, drone, panoramas), almost no image fits 2:1 perfectly → almost every project looks broken

This is rendered from a single component, so **fixing it once fixes every project — past, present, and future** with no per-project work.

### The fix — Editorial "cinematic banner" treatment

Replace the block with a polished, magazine-style featured hero used by enterprise construction sites (PCL, Turner, Lendlease):

1. **Cinematic 21:9 / 16:9 cropped banner**
   - Container: `aspect-[16/9] md:aspect-[21/9]` (wide cinematic ratio, not letterbox-tall 2:1)
   - Image: `object-cover` instead of `object-contain` — fills the frame edge-to-edge, no gray bars, ever
   - `object-position: center` so the most important part of the photo stays in frame
   - Use the existing `ASPECT_RATIOS` token from `src/design-system/image-system.ts` for consistency with cards

2. **Subtle gradient + caption overlay** (optional, looks premium)
   - Bottom-aligned dark-to-transparent gradient
   - Floating "Click to view full image" hint pill in the corner with a `Maximize2` icon (replaces the invisible `aria-label`)
   - Project title overlay is **not** added — the page already has a header above

3. **Branded fallback when no image is uploaded**
   - Currently if `featured_image` is missing the entire block disappears — looks like a layout bug
   - Add a graceful fallback: muted background with the AGC mark + "Project imagery coming soon" (matches the data-integrity standard already used on cards)

4. **Consistent container width & rounded corners**
   - Wrap in `container mx-auto px-4` (already there) and `rounded-xl` for editorial feel
   - Add a soft `shadow-md` to lift it off the page

5. **Reuse `OptimizedImage` correctly**
   - Drop `objectFit="contain"` → use `objectFit="cover"` (default-friendly)
   - Keep `priority` so it loads instantly (LCP element)
   - Keep the `InteractiveLightbox` integration so clicking still opens the full untouched image

### Code shape (single edit to `src/pages/ProjectDetail.tsx`, ~lines 252–293)

```tsx
{/* Featured Image — editorial cinematic banner */}
<div className="container mx-auto px-4 py-8">
  {project.featured_image ? (
    <button
      type="button"
      onClick={() => setLightboxOpen(true)}
      className="group relative block w-full overflow-hidden rounded-xl shadow-md
                 aspect-[16/9] md:aspect-[21/9] bg-muted
                 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      aria-label="View full image"
    >
      <OptimizedImage
        src={project.featured_image}
        alt={project.title}
        className="w-full h-full object-cover object-center
                   transition-transform duration-500 group-hover:scale-[1.03]"
        objectFit="cover"
        priority
      />
      {/* Subtle bottom gradient for premium feel */}
      <div className="absolute inset-x-0 bottom-0 h-24
                      bg-gradient-to-t from-black/40 to-transparent
                      pointer-events-none" />
      {/* Expand hint */}
      <div className="absolute bottom-4 right-4 inline-flex items-center gap-1.5
                      rounded-full bg-background/90 backdrop-blur px-3 py-1.5
                      text-xs font-medium text-foreground shadow-sm
                      opacity-0 group-hover:opacity-100 transition-opacity">
        <Maximize2 className="h-3.5 w-3.5" />
        View full image
      </div>
    </button>
  ) : (
    {/* Branded fallback for projects without a featured image */}
    <div className="w-full aspect-[16/9] md:aspect-[21/9] rounded-xl
                    bg-muted flex flex-col items-center justify-center text-muted-foreground">
      <span className="text-2xl font-bold tracking-wider">AGC</span>
      <span className="text-xs mt-1">Project imagery coming soon</span>
    </div>
  )}

  <InteractiveLightbox
    images={project.featured_image ? [{
      src: project.featured_image,
      alt: project.title,
      caption: project.title,
    }] : []}
    isOpen={lightboxOpen}
    onClose={() => setLightboxOpen(false)}
    initialIndex={0}
  />
</div>
```

Plus add `Maximize2` to the existing `lucide-react` import on line 20.

### Why this is the right fix

- **One file changes (`ProjectDetail.tsx`).** Every project page rendered through this route gets the new treatment instantly — including new projects you upload later. No per-project edits, no DB migration.
- **No more gray letterbox bars** — `object-cover` fills the frame regardless of upload dimensions.
- **Consistent shape across the site** — 16:9/21:9 matches the hero ratio token already defined in `design-system/image-system.ts`.
- **Graceful when no image is uploaded** — branded AGC fallback instead of the section disappearing.
- **Fully accessible** — `<button>` element, focus ring, keyboard-activated lightbox (Enter/Space work natively).
- **No breaking changes** — lightbox click-to-zoom still works; SEO `ogImage` and skeleton loading are untouched.

### Files touched
1. `src/pages/ProjectDetail.tsx` — replace the featured-image block (lines ~252–293) and add `Maximize2` to lucide import.

That's it. One file, applies everywhere.

Approve and I'll ship it.