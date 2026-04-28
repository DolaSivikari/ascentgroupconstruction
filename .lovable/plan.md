## Goal
Show a "back to top" arrow button on every public page so visitors can jump to the top from anywhere — without each page having to opt in.

## Current state
- Two duplicate components exist: `src/components/BackToTop.tsx` and `src/components/ui/scroll-to-top.tsx` (both are floating ↑ buttons that appear after scroll).
- It's only mounted on 5 pages: Home, Projects, Accessibility, Privacy, Terms.
- Most pages (About, Services, Contact, Capabilities, Markets, Blog, BlogPost, ProjectDetail, ServiceDetail, Careers, OurProcess, FAQ, Estimate, etc.) have no scroll-to-top button — that's why it's missing.
- Note: `src/components/ScrollToTop.tsx` (used in `App.tsx`) is unrelated — it just resets scroll on route change.

## Plan

1. **Mount globally in `App.tsx`** — Add the floating button once inside `<BrowserRouter>` so it appears on every route (including any future pages) without per-page changes. Place it near `<StickyInquiryBar />`.

2. **Use the polished version** — Standardize on `src/components/ui/scroll-to-top.tsx` (smooth fade/slide-in, primary color, `aria-label`, hover-scale). Lazy-load it like `StickyInquiryBar` so it doesn't affect initial load.

3. **Remove the now-duplicate per-page mounts** to prevent two buttons stacking:
   - Remove `<ScrollToTop />` import + render from `src/pages/Index.tsx` and `src/pages/Projects.tsx`
   - Remove `<BackToTop />` import + render from `src/pages/Privacy.tsx`, `src/pages/Terms.tsx`, `src/pages/Accessibility.tsx`
   - Delete the unused `src/components/BackToTop.tsx` file (cleans up the duplicate)

4. **Z-index check** — The button uses `z-50` and sits at `bottom-8 right-8`. The `StickyInquiryBar` typically anchors to the bottom edge full-width; if they overlap on mobile, nudge the back-to-top button up (e.g. `bottom-24`) on small screens so it sits above the sticky bar. Will verify on mobile viewport during implementation.

## Result
A single, consistent ↑ button appears on every page after scrolling ~300px down, smoothly scrolls to top when clicked, and is keyboard-accessible.