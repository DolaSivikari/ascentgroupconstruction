

## Fix Homepage Featured Project Images — Edge-to-Edge Fill

### Root cause

The `OptimizedImage` component receives `width={800} height={600}`, which generates an inline style of `width: 800px; height: 600px` on its wrapper div. This creates a **fixed-size 800x600px container** that overflows or misaligns inside the responsive `aspect-[4/3]` parent div. The image ends up showing a random cropped section because the container is larger than the visible card area.

The **Services page works correctly** because it uses a plain `<img>` tag with `w-full h-full object-cover` and no fixed pixel dimensions — the image simply fills whatever its parent container is.

### Fix

**File: `src/components/homepage/HomepageFeaturedProjects.tsx`** (lines 107-115)

Replace the `OptimizedImage` component with a plain `<img>` tag, matching the services page pattern exactly:

```tsx
// BEFORE (broken)
<OptimizedImage
  src={project.featured_image}
  alt={project.title}
  width={800}
  height={600}
  className="w-full h-full object-center hover-scale"
  objectFit="cover"
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
/>

// AFTER (matches services page)
<img
  src={project.featured_image}
  alt={project.title}
  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
  loading="lazy"
/>
```

This removes the fixed-dimension wrapper entirely. The image will fill the `aspect-[4/3]` container edge-to-edge with `object-cover`, cropping proportionally from center — exactly like the services page behaves.

One file, one block changed. The `OptimizedImage` import can be removed if no longer used elsewhere in the file.

