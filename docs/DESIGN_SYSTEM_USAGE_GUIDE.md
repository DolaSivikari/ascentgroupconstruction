# Unified Design System - Usage Guide

## 🎯 Quick Reference

This guide shows you exactly how to use the unified design system for Ascent Group Construction. Follow these patterns to maintain enterprise-level consistency.

---

## 1. Border Radius

### ✅ ONLY Use These Values

```tsx
// Cards, large features, hero sections
rounded-[var(--radius-lg)]  // 16px

// Buttons, badges, small elements
rounded-[var(--radius-sm)]  // 8px

// Circles ONLY (icons, avatars, loading spinners)
rounded-full
```

### ❌ NEVER Use

```tsx
rounded-xl   // ❌ Wrong
rounded-2xl  // ❌ Wrong
rounded-3xl  // ❌ Wrong
rounded-md   // ❌ Use radius-lg for cards
```

### Examples

```tsx
// ✅ Correct
<Card className="rounded-[var(--radius-lg)]">...</Card>
<Button className="rounded-[var(--radius-sm)]">Click</Button>
<Avatar className="rounded-full" />

// ❌ Wrong
<Card className="rounded-xl">...</Card>
<Button className="rounded-2xl">Click</Button>
```

---

## 2. Animation Durations

### ✅ ONLY Use These Speeds

```tsx
duration-[150ms]  // Fast - Hover states, micro-interactions
duration-300      // Base - Standard transitions (DEFAULT)
duration-500      // Slow - Page transitions ONLY
```

### ❌ NEVER Use

```tsx
duration-200  // ❌ Use 150ms or 300ms
duration-400  // ❌ Use 300ms
duration-700  // ❌ Use 500ms
duration-1000 // ❌ Too slow
```

### Examples

```tsx
// ✅ Correct
<button className="hover:opacity-90 transition-opacity duration-[150ms]">
  Quick Hover
</button>

<div className="transition-all duration-300">
  Standard Animation
</div>

<section className="animate-fade-in duration-500">
  Page Load Only
</section>

// ❌ Wrong
<button className="transition-all duration-200">Wrong</button>
<div className="transition-all duration-700">Too Slow</div>
```

---

## 3. Shadows (Elevation System)

### ✅ ONLY Use These 3 Levels

```tsx
shadow-[var(--shadow-sm)]  // Subtle - Resting cards
shadow-[var(--shadow-md)]  // Standard - Most cards (DEFAULT)
shadow-[var(--shadow-lg)]  // Prominent - Hover states
```

### ❌ NEVER Use

```tsx
shadow-xl      // ❌ Use shadow-[var(--shadow-lg)]
shadow-2xl     // ❌ Use shadow-[var(--shadow-lg)]
shadow-[...]   // ❌ No custom shadows
shadow-elegant // ❌ Legacy class removed
```

### Examples

```tsx
// ✅ Correct
<Card className="shadow-[var(--shadow-md)]">
  Standard Card
</Card>

<Card className="shadow-[var(--shadow-md)] hover:shadow-[var(--shadow-lg)]">
  Interactive Card
</Card>

// ❌ Wrong
<Card className="shadow-xl">...</Card>
<Card className="shadow-[0_8px_30px_rgb(0,0,0,0.12)]">...</Card>
```

---

## 4. Section Spacing

### ✅ Use These Standard Sizes

```tsx
// Major sections (homepage, main content)
py-16 md:py-20 lg:py-24  // 96-150px

// Subsections (nested content)
py-12 md:py-16  // 72-96px

// Tight sections (compact areas)
py-8 md:py-12  // 48-72px
```

### Use the Section Component (Recommended)

```tsx
import { Section } from "@/components/sections/Section";

// ✅ Correct - Uses design system automatically
<Section size="major">
  <h2>Main Content</h2>
  <p>Content here...</p>
</Section>

<Section size="subsection">
  <h3>Subsection</h3>
  <p>Nested content...</p>
</Section>

<Section size="tight">
  <p>Compact area</p>
</Section>
```

### Or Use LAYOUT Constants Directly

```tsx
import { LAYOUT } from "@/design-system/constants";

// ✅ Correct
<section className={LAYOUT.sectionSpacing.major}>
  <div className={cn("mx-auto", LAYOUT.maxWidth, LAYOUT.containerPadding)}>
    Content
  </div>
</section>
```

### ❌ NEVER Use Random Values

```tsx
// ❌ Wrong
<section className="py-20">...</section>
<section className="py-32">...</section>
<section className="py-40">...</section>
```

---

## 5. Hover States

### ✅ Use HOVER_STATES Constants

```tsx
import { HOVER_STATES } from "@/design-system/constants";

// ✅ Correct
<Card className={HOVER_STATES.card}>
  Interactive Card
</Card>

<button className={HOVER_STATES.button}>
  Button Hover
</button>

<a href="#" className={HOVER_STATES.link}>
  Link Hover
</a>

<div className={HOVER_STATES.scale}>
  Scale Effect
</div>

<div className={HOVER_STATES.lift}>
  Lift Effect
</div>
```

### Available HOVER_STATES:

```typescript
export const HOVER_STATES = {
  card: 'hover:-translate-y-2 hover:shadow-[var(--shadow-lg)] transition-all duration-300',
  button: 'hover:opacity-90 transition-opacity duration-[150ms]',
  link: 'hover:text-primary transition-colors duration-[150ms]',
  scale: 'hover:scale-105 transition-transform duration-300',
  lift: 'hover:-translate-y-1 transition-transform duration-300',
}
```

### ❌ NEVER Create Custom Hover States

```tsx
// ❌ Wrong
<Card className="hover:shadow-2xl hover:-translate-y-4 hover:scale-110">
  Too Much
</Card>

<button className="hover:brightness-150 hover:scale-125">
  Over-animated
</button>
```

---

## 6. Card Styling

### ✅ Use CARD_STYLES Constants

```tsx
import { CARD_STYLES } from "@/design-system/constants";
import { cn } from "@/lib/utils";

// ✅ Correct - Base card
<Card className={CARD_STYLES.base}>
  Simple Card
</Card>

// ✅ Correct - Elevated card with shadow
<Card className={CARD_STYLES.elevated}>
  Elevated Card
</Card>

// ✅ Correct - Interactive card with hover
<Card className={cn(CARD_STYLES.elevated, CARD_STYLES.hover)}>
  Interactive Card
</Card>

// ✅ Correct - Interactive with active state
<Card className={CARD_STYLES.interactive}>
  Fully Interactive
</Card>
```

### Available CARD_STYLES:

```typescript
export const CARD_STYLES = {
  base: 'rounded-[var(--radius-lg)] border border-border bg-card',
  elevated: 'rounded-[var(--radius-lg)] border shadow-[var(--shadow-md)]',
  hover: 'transition-all duration-300 hover:shadow-[var(--shadow-lg)] hover:-translate-y-2',
  interactive: 'cursor-pointer transition-all duration-300 hover:shadow-[var(--shadow-lg)] hover:-translate-y-2 active:scale-[0.98]',
}
```

---

## 7. Component Import Paths

### ✅ Always Import from Design System

```tsx
// ✅ Correct
import { Card } from "@/design-system/components/Card";
import { Button } from "@/ui/Button";
import { Section } from "@/components/sections/Section";
import { CARD_STYLES, HOVER_STATES, LAYOUT } from "@/design-system/constants";

// ❌ Wrong (legacy paths)
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
```

---

## 8. Common Patterns

### Interactive Service Card

```tsx
import { Card } from "@/design-system/components/Card";
import { CARD_STYLES, HOVER_STATES } from "@/design-system/constants";
import { cn } from "@/lib/utils";

<Card className={cn(CARD_STYLES.elevated, HOVER_STATES.card)}>
  <CardHeader>
    <div className="w-16 h-16 rounded-[var(--radius-lg)] bg-primary/10 flex items-center justify-center">
      <Icon className="w-8 h-8 text-primary" />
    </div>
    <CardTitle>Service Name</CardTitle>
  </CardHeader>
  <CardContent>
    <p>Service description...</p>
  </CardContent>
</Card>
```

### Page Section

```tsx
import { Section } from "@/components/sections/Section";

<Section size="major" maxWidth="standard">
  <h2 className="text-3xl md:text-5xl font-bold mb-6">
    Section Title
  </h2>
  <p className="text-lg text-muted-foreground">
    Section content...
  </p>
</Section>
```

### CTA Button

```tsx
import { Button } from "@/ui/Button";
import { HOVER_STATES } from "@/design-system/constants";

<Button 
  variant="primary" 
  size="lg"
  className={HOVER_STATES.button}
>
  Get Free Quote
</Button>
```

---

## 9. Before & After Examples

### Example 1: Card Component

```tsx
// ❌ Before (inconsistent)
<div className="rounded-xl border bg-card shadow-xl hover:shadow-2xl hover:-translate-y-4 transition-all duration-700">
  <div className="p-6">
    Content
  </div>
</div>

// ✅ After (standardized)
import { Card } from "@/design-system/components/Card";
import { CARD_STYLES, HOVER_STATES } from "@/design-system/constants";

<Card className={cn(CARD_STYLES.elevated, HOVER_STATES.card)}>
  <CardContent>
    Content
  </CardContent>
</Card>
```

### Example 2: Section Spacing

```tsx
// ❌ Before (random)
<section className="py-20 px-4">
  <div className="container mx-auto max-w-7xl">
    Content
  </div>
</section>

// ✅ After (standardized)
import { Section } from "@/components/sections/Section";

<Section size="major">
  Content
</Section>
```

### Example 3: Button Hover

```tsx
// ❌ Before (custom)
<button className="bg-primary text-white px-4 py-2 rounded-xl hover:brightness-110 hover:scale-110 transition-all duration-500">
  Click Me
</button>

// ✅ After (standardized)
import { Button } from "@/ui/Button";
import { HOVER_STATES } from "@/design-system/constants";

<Button variant="primary" className={HOVER_STATES.button}>
  Click Me
</Button>
```

---

## 10. Checklist for New Components

When creating a new component, verify:

- [ ] Border radius uses `var(--radius-sm)` or `var(--radius-lg)` ONLY
- [ ] Animations use `duration-[150ms]`, `duration-300`, or `duration-500` ONLY
- [ ] Shadows use `var(--shadow-sm/md/lg)` ONLY
- [ ] Section spacing uses `LAYOUT.sectionSpacing` values
- [ ] Hover states use `HOVER_STATES` constants
- [ ] Card styling uses `CARD_STYLES` constants
- [ ] Component imports from design system paths
- [ ] No custom shadow implementations
- [ ] No `rounded-xl`, `rounded-2xl`, or `rounded-3xl`
- [ ] No `duration-200`, `duration-700`, or other non-standard values

---

## 11. Quick Reference Table

| Element | Correct Value | Wrong Values |
|---------|--------------|--------------|
| **Card Border Radius** | `rounded-[var(--radius-lg)]` | `rounded-xl`, `rounded-2xl` |
| **Button Border Radius** | `rounded-[var(--radius-sm)]` | `rounded-lg`, `rounded-xl` |
| **Fast Animation** | `duration-[150ms]` | `duration-200` |
| **Base Animation** | `duration-300` | `duration-400`, `duration-500` |
| **Slow Animation** | `duration-500` | `duration-700`, `duration-1000` |
| **Card Shadow** | `shadow-[var(--shadow-md)]` | `shadow-lg`, `shadow-xl` |
| **Hover Shadow** | `hover:shadow-[var(--shadow-lg)]` | `hover:shadow-2xl` |
| **Major Section** | `py-16 md:py-20 lg:py-24` | `py-20`, `py-32` |
| **Subsection** | `py-12 md:py-16` | `py-16`, `py-20` |
| **Tight Section** | `py-8 md:py-12` | `py-12`, `py-16` |

---

## 12. Getting Help

**Questions?**
1. Check this guide first
2. Review `docs/PHASE_6_COMPLETE.md` for full context
3. Look at existing components for examples
4. Ask in team chat with specific questions

**Found a violation?**
1. Fix it using this guide
2. Update component to use design system
3. Test hover states and animations
4. Verify visual consistency

---

*Last Updated: Phase 6 Complete*
*Design System Version: 2.0*
