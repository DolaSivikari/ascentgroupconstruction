
User endorses Tier 1 with two refinements:
1. Card hover — verify scale(1.02) against grid layout, watch for subpixel jitter / shadow clipping. Add transform-origin and verify gaps before merge.
2. Scroll indicator — gate render on viewport height (>85% hero occupancy), avoid showing on short laptops/tablets.

Both are correct. Folding them into the spec.

## Tier 1 Motion Pass — final spec

### What ships

**1. `src/lib/motion-presets.ts`** — single source of truth
- `EASE_EXPO_OUT = [0.22, 1, 0.36, 1] as const`
- `STAGGER = { tight: 0.04, base: 0.06, loose: 0.08 }`
- `DURATION = { fast: 0.3, base: 0.5, slow: 0.7 }`
- Framer Motion variants: `fadeUp`, `fadeIn`, `staggerContainer`, `wordReveal`
- All variants pre-wired to expo-out

**2. `src/components/ui/RevealText.tsx`** — word-by-word entrance
- Splits children string on spaces, wraps each word in `motion.span`
- Stagger 60ms, Y translate 16px, expo-out
- Reduced-motion fallback: renders plain text, no animation
- Uses `whileInView` with `viewport={{ once: true, margin: "-50px" }}`

**3. `src/design-system/components/SectionHeader.tsx`** — wire `<RevealText>` into the title
- One change → every section heading on the site upgrades
- Description and badge stay as-is (no over-animation)

**4. `src/design-system/components/Card.tsx` + `src/components/ui/card.tsx`** — hover upgrade on `interactive` variant
- Duration 200ms → 500ms
- Add `hover:scale-[1.015]` (lower than 1.02 to avoid jitter), `transform-origin-center`, `hover:brightness-[1.03]`
- Easing: expo-out via Tailwind arbitrary `ease-[cubic-bezier(0.22,1,0.36,1)]`
- **Refinement #1**: audit `ProjectCard` grid (`/projects` and homepage Featured Projects) at 1440px to confirm no shadow clipping or neighbor jitter before merge; bump grid `gap` from current value to `gap-8` if needed

**5. `src/components/homepage/AnimatedScrollIndicator.tsx`** — pulsing scroll cue
- Vertical line (1px × 32px) with opacity pulse 2s loop
- "SCROLL" label, `text-xs tracking-widest`, subtle 4px Y bounce
- **Refinement #2**: render gated by `useMediaQuery('(min-height: 800px)')` — hidden on short laptops, tablets landscape, anything where hero doesn't fully dominate viewport
- Reduced-motion: static line + label, no pulse/bounce

**6. `src/components/homepage/EnhancedHero.tsx`** — swap existing scroll cue for `<AnimatedScrollIndicator />`

### Files

**New (3)**
- `src/lib/motion-presets.ts`
- `src/components/ui/RevealText.tsx`
- `src/components/homepage/AnimatedScrollIndicator.tsx`

**Edited (4)**
- `src/design-system/components/SectionHeader.tsx`
- `src/design-system/components/Card.tsx`
- `src/components/ui/card.tsx`
- `src/components/homepage/EnhancedHero.tsx`

### Out of scope (locked)

- No horizontal scroll — permanent no for B2B procurement audience
- No shared-element / page transitions
- No cursor parallax
- No giant numeral crossfade (deferred ≥60 days post-Tier-1 launch)
- No layout, color, font, navigation, DB, or routing changes
- No motion additions beyond this PR — 60-day quiet period before reassessing

### QA checklist before merge

- ProjectCard grid at 1440px / 1280px / 768px — no jitter, no shadow clipping
- SectionHeader reveal works on homepage, /projects, /services, /capabilities, /contact
- `prefers-reduced-motion: reduce` disables all word-reveal, scroll-pulse, and hover-scale extensions
- Scroll indicator hidden on viewport height <800px
- Hero loads without layout shift from indicator mount

### Result

Every heading reveals word-by-word with cinematic easing. Every interactive card hovers with the slow, layered "expensive" feel. Hero gets a living scroll cue (only where it earns its place). Zero risk to scannability, accessibility, or B2B conversion. One PR, four edited files, three new files, ~150 LOC total.
