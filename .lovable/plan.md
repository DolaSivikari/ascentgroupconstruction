## Goal

Eliminate letterboxing, layout shift, and inconsistent featured-image rendering across projects by:

1. Validating image dimensions at upload time (admin)
2. Adding loading skeletons + branded fallbacks for featured images and gallery thumbnails
3. Refactoring all "featured image" rendering to one shared component so any new project automatically inherits the same styling

---

## 1. New shared component: `src/components/projects/ProjectFeaturedImage.tsx`

A single source of truth for featured image rendering across the site.

**Props:**
```ts
interface ProjectFeaturedImageProps {
  src?: string | null;
  alt: string;
  variant?: "banner" | "card" | "thumbnail"; // banner = detail page, card = grid, thumbnail = small
  priority?: boolean;
  onClick?: () => void;
  className?: string;
}
```

**Behavior:**
- **Aspect ratios per variant** (locked, no layout shift):
  - `banner`: `aspect-[16/9] md:aspect-[21/9]` (detail page hero)
  - `card`: `aspect-[4/3]` (grid cards — Projects page, Homepage Featured, FeaturedProjects, ServicesFeaturedWork)
  - `thumbnail`: `aspect-square` (small lists, related projects)
- **Skeleton state**: animated `Skeleton` fills the container while `OptimizedImage` resolves (uses existing `useImageLoad` hook signal). No flash, no jump — container reserves space via aspect-ratio.
- **Fallback state**: when `src` is missing or fails, render branded placeholder — `bg-muted` + centered "AGC" mark + small caption — already used in `ProjectDetail` and `HomepageFeaturedProjects`. Standardized here.
- **Object-fit**: always `object-cover object-center` (no letterboxing).
- **Hover zoom**: subtle `group-hover:scale-[1.03]` for `banner`, `scale-105` for `card`.
- Wraps `OptimizedImage` internally so AVIF/WebP/srcset/fetchpriority continue to work.

---

## 2. Refactor existing featured-image renderers to use the shared component

Replace inline `<img>` / `<OptimizedImage>` blocks with `<ProjectFeaturedImage />`:

| File | Variant | Notes |
|---|---|---|
| `src/pages/ProjectDetail.tsx` (lines 252–297) | `banner` | Keep lightbox button wrapper + gradient overlay + Maximize2 hint outside the component |
| `src/components/homepage/HomepageFeaturedProjects.tsx` (lines 105–118) | `card` | Replace inline `<img>` + AGC fallback |
| `src/components/FeaturedProjects.tsx` (lines 27–35) | `card` | Add fallback (currently renders nothing if missing) |
| `src/components/services/ServicesFeaturedWork.tsx` (line 55–60 area) | `card` | Standardize |
| `src/pages/Projects.tsx` → `ProjectCard.tsx` (currently uses `OptimizedImage` directly) | `card` | Swap inner image renderer |
| `src/components/ProjectFeaturedCard.tsx` | `banner`-ish (large featured) | Use `card` variant or extend with `wide` if needed |

**Result:** any new project posted from admin automatically gets identical styling everywhere — no per-page tweaks needed.

---

## 3. Loading skeletons & graceful fallbacks for gallery thumbnails

In `src/components/ProjectGallery.tsx`:
- Wrap each gallery thumbnail in a fixed `aspect-[4/3]` container with `Skeleton` underneath.
- On image load error → swap to AGC fallback (same branded placeholder as featured).
- Reserve space so the grid never jumps as images stream in.

In `src/components/admin/ProjectImageManager.tsx`:
- Same skeleton + fallback for admin previews so editors see consistent layout.

---

## 4. Aspect-ratio & size validation on upload (admin)

Update `src/components/admin/ImageUploadField.tsx` (already has partial validation via `validateAspectRatio`):

**Featured image upload (in `ImagesTab.tsx`):**
- Pass `targetAspectRatio="21/9"` with `tolerance: 0.15` — wide tolerance accepts 16/9 through 21/9 without warning.
- **Hard reject** images narrower than 4/3 (portrait or near-square) with toast: *"Featured images must be landscape (minimum 4:3). Current ratio: X:Y. Please crop before uploading."*
- **Min dimensions**: 1200×675 px. Reject smaller with toast.
- **Soft warning** (not block): if ratio differs from 16/9 by >5%, show existing warning panel suggesting crop, but allow upload — `object-cover` will handle it cleanly.

**Gallery image upload (in `ProjectImageManager.tsx`):**
- Min dimensions: 800×600 px.
- No strict aspect ratio (gallery accepts variety), but warn if extreme (>3:1 or <1:3).
- Strip oversized files (>10MB) with clear error.

**Why this combination works:**
- `object-cover` in the renderer handles small ratio mismatches gracefully.
- Upload validation prevents the worst cases (tiny images, wrong orientation) that even `object-cover` can't save.
- No images already in the DB break — validation is upload-time only; existing images render via the new `cover`-based component without letterboxing.

---

## 5. Files to be edited / created

**New:**
- `src/components/projects/ProjectFeaturedImage.tsx`

**Edited:**
- `src/pages/ProjectDetail.tsx`
- `src/components/homepage/HomepageFeaturedProjects.tsx`
- `src/components/FeaturedProjects.tsx`
- `src/components/services/ServicesFeaturedWork.tsx`
- `src/components/ProjectCard.tsx`
- `src/components/ProjectFeaturedCard.tsx`
- `src/components/ProjectGallery.tsx` (skeletons + fallback)
- `src/components/admin/ImageUploadField.tsx` (stricter validation, min-dimension check)
- `src/components/admin/project-tabs/ImagesTab.tsx` (pass targetAspectRatio + min dims)
- `src/components/admin/ProjectImageManager.tsx` (gallery validation + skeleton previews)

**Memory updates:**
- New memory: `mem://design/project-featured-image-system` documenting the shared component + validation rules so future work stays consistent.

---

## What stays the same

- `OptimizedImage` remains the low-level renderer (AVIF/WebP/srcset).
- `InteractiveLightbox` still handles full-image viewing.
- Existing gallery categorization, before/after slider, lightbox UX — untouched.
- No DB migration needed; validation is client-side at upload.

Approve to proceed.