

## Site-Wide Animation & Interaction Polish — All 5 Layers

Implementing all 5 layers in one batch. Order is sequenced so foundational pieces (Button ripple, OptimizedImage fade) land before pages that consume them.

### Step 1 — Foundational primitives (new files)

**`src/components/animations/MagneticButton.tsx`** (new)
Wrapper that applies subtle cursor-follow (max 8px pull) on desktop hover via Framer Motion. Falls back to plain render on touch devices and `prefers-reduced-motion`.

**`src/components/animations/ReadingProgressBar.tsx`** (new — replaces ad-hoc usage)
Top-fixed 2px primary-color bar that fills as user scrolls. Wires into `BlogPost.tsx`.

### Step 2 — Core component upgrades

**`src/ui/Button.tsx`** — integrate `RippleEffect` for primary/secondary variants (skip ghost/link). Respect reduced motion.

**`src/components/OptimizedImage.tsx`** — strengthen the existing fade transition (blur-sm → blur-0 with 400ms ease-out) when `isLoaded` flips true.

**`src/components/Navigation.tsx`** — sticky shrink: animate height from `h-20` → `h-16` after `window.scrollY > 100`, with logo scale `0.9`. 200ms transition.

### Step 3 — Page transitions

**`src/routes/AppRoutes.tsx`** — wrap `<Routes>` with `<PageTransition type="fade" duration={300}>` so route changes cross-fade.

### Step 4 — Card hover standardization

Standardize lift + image zoom across:
- `src/components/services/ServiceCard.tsx`
- `src/components/blog/BlogCard.tsx`
- `src/components/ProjectCard.tsx` (verify, already partial)

Pattern: `group hover:-translate-y-2 transition-transform duration-300`, inner image `group-hover:scale-105 transition-transform duration-500`.

### Step 5 — Section reveals on internal pages

Wrap major sections with `ScrollReveal` (direction `up`, stagger card grids):
- `About.tsx`, `Capabilities.tsx`, `Contact.tsx`, `Careers.tsx`
- `OurProcess.tsx`, `Prequalification.tsx`, `WhySpecialtyContractor.tsx`
- `ForGeneralContractors.tsx`, `CommercialClients.tsx`, `PropertyManagers.tsx`, `Homeowners.tsx`
- `ProjectDetail.tsx`, `BlogPost.tsx`
- `Services.tsx` (cards already animate; wrap intro/CTA sections)

Pattern: header `<ScrollReveal direction="up">`, card grids `<StaggerContainer type="fade">`, sidebars `direction="left"` or `"right"`.

### Step 6 — Scroll-driven enhancements

- **`BlogPost.tsx`** — mount `<ReadingProgressBar />` at top.
- **Hero parallax** — apply `ParallaxSection speed="slow"` to hero background images on Tier 1/2 pages (About, Capabilities, ProjectDetail, BlogPost).
- **Stat count-ups** — verify `AnimatedCounter` is wired wherever stats appear (`ProofStrip`, About stats, service stats).

### Step 7 — Magnetic CTAs + form polish

- Apply `<MagneticButton>` wrapper to primary CTAs on hero sections (Contact, Estimate, Submit RFP, About).
- **`src/ui/Input.tsx` + `Textarea.tsx`** — add focus state: `focus:ring-2 focus:ring-primary/30 focus:scale-[1.01]` with 200ms transition.

### Files touched (summary)

**New (2):** MagneticButton.tsx, ReadingProgressBar.tsx
**Edit core (5):** Button.tsx, OptimizedImage.tsx, Navigation.tsx, Input.tsx, Textarea.tsx
**Edit routing (1):** AppRoutes.tsx
**Edit cards (3):** ServiceCard, BlogCard, ProjectCard
**Edit pages (~13):** internal pages listed in Step 5
**Edit hero parallax (4):** About, Capabilities, ProjectDetail, BlogPost

Total: ~28 files

### Out of scope

- Homepage (already animated well)
- Admin panel (stays utilitarian)
- No new dependencies (Framer Motion v12 already installed)
- No 3D libraries

### Risk + mitigation

- All animations gated by `useReducedMotion` — accessibility preserved.
- `PageTransition` already has initial-render guard, so first paint won't fade.
- `ScrollReveal` skips animation when element is already in viewport on mount, preventing flash.
- Card hover changes use `group` + Tailwind only — no JS overhead.

