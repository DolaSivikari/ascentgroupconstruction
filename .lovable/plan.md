

# Add Framer Motion Micro-Interactions to Homepage Components

## What changes

Port the polished hover and entrance animations from the Technology page to four homepage components. The existing scroll-reveal system stays — this adds Framer Motion `whileHover` and `whileInView` enhancements on top.

## Components to enhance

### 1. `HomepageServiceHighlights.tsx`
- Wrap each service card `Link` in `motion.div` with `whileHover={{ y: -6, transition: { type: "spring", stiffness: 300, damping: 20 } }}`
- Add `whileInView={{ opacity: 1, y: 0 }}` with staggered delay per card (replaces the inline style animation with Framer Motion's more fluid spring physics)
- Icon container gets `whileHover={{ scale: 1.1 }}` for a subtle pop

### 2. `HomepageFeaturedProjects.tsx`
- Wrap each project card in `motion.div` with `whileHover={{ y: -6 }}` spring
- Add `whileInView` staggered entrance (same pattern)
- Keep existing CSS `group-hover:scale-105` on images (works well already)

### 3. `WhyChooseUs.tsx`
- Wrap each differentiator card in `motion.div` with `whileHover={{ y: -4 }}` spring
- Add `whileInView` staggered entrance
- Icon container gets `whileHover={{ scale: 1.1, rotate: 3 }}` for subtle movement

### 4. `HomepageFinalCta.tsx`
- Wrap each CTA card in `motion.div` with `whileHover={{ y: -4, scale: 1.02 }}` spring
- Add `whileInView` entrance with slight scale-in (matching Technology's `{ opacity: 0, scale: 0.95 }` → `{ opacity: 1, scale: 1 }`)

## Animation specs (matching Technology page)

- **Entrance**: `initial={{ opacity: 0, y: 24 }}`, `whileInView={{ opacity: 1, y: 0 }}`, `viewport={{ once: true, amount: 0.1 }}`, `transition={{ delay: index * 0.08, duration: 0.4 }}`
- **Hover lift**: `whileHover={{ y: -6 }}`, `transition={{ type: "spring", stiffness: 300, damping: 20 }}`
- **Reduced motion**: All use `initial={rm ? false : ...}` pattern from Technology page, with `rm` from `useReducedMotion()`
- Removes the old inline `style={{ opacity, transform, transition }}` approach in favour of Framer Motion's declarative model

## What stays the same
- All content, data, layout grids, section structure
- `useScrollFadeIn` on section headers (lightweight, works well)
- Process Strip keeps its current CSS animations (mixing Framer and CSS there would be redundant)

## Files modified
- `src/components/homepage/HomepageServiceHighlights.tsx`
- `src/components/homepage/HomepageFeaturedProjects.tsx`
- `src/components/homepage/WhyChooseUs.tsx`
- `src/components/homepage/HomepageFinalCta.tsx`

