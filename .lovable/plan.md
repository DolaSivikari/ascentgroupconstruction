

## Match Homepage Featured Projects Image Style to Services Page

### What's different

The **Services page** (`ServicesFeaturedWork`) uses a plain `<img>` tag with `object-cover` — the image fills the entire container edge-to-edge, cropping as needed to fit. No grey background gaps.

The **Homepage** (`HomepageFeaturedProjects`) uses `OptimizedImage` with `objectFit="contain"` — the image shrinks to fit inside the container without cropping, leaving grey (`bg-muted`) gaps around it.

### Changes

**File: `src/components/homepage/HomepageFeaturedProjects.tsx`**

- Change `objectFit="contain"` to `objectFit="cover"` on the `OptimizedImage` component (line 113)
- This makes the image fill the entire `aspect-[4/3]` container edge-to-edge, matching how the services page handles its `aspect-[16/9]` image containers

One line change. The `bg-muted` fallback stays in case an image fails to load.

