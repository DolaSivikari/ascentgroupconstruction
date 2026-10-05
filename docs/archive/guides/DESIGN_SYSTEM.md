# Ascent Group Construction - Unified Design System

## Overview
This design system ensures visual and functional consistency across the entire Ascent Group Construction website. All components, layouts, and content follow these standards.

**Last Updated:** November 16, 2025  
**Status:** ✅ Phase 1-5 Complete (Component Unification 100% | Animation System 80% Implemented)

## Implementation Status

### ✅ Completed Phases
- **Phase 1-2:** Typography & Layout Standardization (100%)
- **Phase 3:** Button & CTA Unification (100%)
- **Phase 4:** Card Component Unification (100%)
- **Phase 5:** Hero Component Standardization (100%)
- **Phase 6:** Animation System Implementation (80% - Core pages complete)

### 🔄 In Progress
- **Phase 6:** Animation System (Remaining service and market pages)
- **Phase 7:** QA & Testing (Manual testing required)

### 📊 File Status
- **Core Pages:** 7/7 Complete ✅
- **Service Pages:** 9/9 Component unification complete, 6/9 animations added
- **Market Pages:** 8/8 Component unification complete, 5/8 animations added

## Core Philosophy
- **Consistency**: Every page feels part of the same professional product
- **Accessibility**: WCAG AA compliant colors and interactions
- **Performance**: Optimized animations and efficient component reuse
- **Maintainability**: Single source of truth for all design decisions

---

## Layout System

### Content Width
- **Standard**: `max-w-7xl` (1280px) - Used for most page content
- **Narrow**: `max-w-4xl` (896px) - Used for focused content like forms
- **Wide**: `max-w-[1400px]` - Used for project galleries
- **Full**: `w-full` - Used for full-width sections

### Section Spacing
Use the `<Section>` component with size prop:

```tsx
<Section size="major">     // py-16 md:py-20 lg:py-24 - Main page sections
<Section size="subsection"> // py-12 md:py-16 - Nested sections
<Section size="tight">      // py-8 md:py-12 - Compact sections
```

### Container Padding
Handled automatically by Section component: `px-4 sm:px-6 lg:px-8`

---

## Typography

### Hierarchy
- **H1**: Page titles (text-4xl md:text-5xl lg:text-6xl)
- **H2**: Section titles (text-3xl md:text-4xl)
- **H3**: Subsection titles (text-xl md:text-2xl)
- **Body**: Base text (text-base)
- **Small**: Secondary text (text-sm)

### Font Families
- **Headings**: Inter (system font stack)
- **Body**: Inter (system font stack)
- **Monospace**: Geist Mono (for code)

---

## Color System

### Brand Colors
- **Primary**: Deep Black `hsl(240 6% 10%)` - Main brand color
- **Accent**: Pure Orange `hsl(25 100% 50%)` - CTAs and highlights
- **Background**: Pure White `hsl(0 0% 100%)` - Page backgrounds

### Semantic Colors
- **Foreground**: Text on background `hsl(240 10% 15%)`
- **Muted**: Pure white `hsl(0 0% 100%)`
- **Border**: Light borders `hsl(210 15% 85%)`
- **Destructive**: Error states `hsl(0 84% 60%)`

### Usage
Always use HSL color tokens from `index.css`:
```tsx
className="bg-background text-foreground border-border"
// NOT: className="bg-white text-black border-gray-300"
```

---

## Components

### Unified Card
Standardized card component for consistent styling:

```tsx
import { UnifiedCard } from "@/components/shared/UnifiedCard";

// Base card
<UnifiedCard variant="base">Content</UnifiedCard>

// Elevated with shadow
<UnifiedCard variant="elevated">Content</UnifiedCard>

// Interactive with hover effect
<UnifiedCard variant="interactive">Content</UnifiedCard>
```

### Section Component
Enforces consistent layout and spacing:

```tsx
import { Section } from "@/components/sections/Section";

<Section size="major" maxWidth="standard">
  {/* Your content */}
</Section>
```

### Page Hero
Standardized page headers:

```tsx
import { UnifiedPageHero } from "@/components/sections/UnifiedPageHero";

<UnifiedPageHero
  title="Page Title"
  description="Page description"
  primaryCTA={{ text: "Get Started", href: "/contact" }}
  breadcrumbs={[
    { label: "Home", href: "/" },
    { label: "Current Page" }
  ]}
/>
```

### Form Fields
Consistent form styling:

```tsx
import { UnifiedFormField } from "@/components/forms/UnifiedFormField";

<UnifiedFormField label="Email" required error={errors.email}>
  <Input type="email" />
</UnifiedFormField>
```

### Buttons
Always import from unified location:

```tsx
import { Button } from "@/ui/Button";

<Button variant="primary">Primary Action</Button>
<Button variant="outline">Secondary Action</Button>
<Button variant="ghost">Tertiary Action</Button>
```

---

## Animation System

### Scroll Reveal Animations
Use the `ScrollReveal` component to add scroll-triggered reveal animations:

```tsx
import { ScrollReveal } from "@/components/animations/ScrollReveal";

// Basic usage
<ScrollReveal direction="up">
  <YourContent />
</ScrollReveal>

// With delay for stagger effect
<ScrollReveal direction="up" delay={100}>
  <YourContent />
</ScrollReveal>

// Available directions: "up", "left", "right"
```

### Hover Animations
All interactive cards automatically have hover effects:

```tsx
// UnifiedCard with hover
<UnifiedCard variant="interactive">
  Content automatically gets hover:scale-[1.02]
</UnifiedCard>

// Custom hover on other elements
<div className="hover:shadow-xl transition-all duration-300">
  Content
</div>
```

### Animation Timing Standards
- **Fast transitions:** `duration-200` (0.2s) - For hover effects
- **Standard transitions:** `duration-300` (0.3s) - For most animations
- **Slow transitions:** `duration-500` (0.5s) - For page transitions

### Common Animation Patterns

**Card Grid with Stagger:**
```tsx
<div className="grid md:grid-cols-3 gap-6">
  {items.map((item, index) => (
    <ScrollReveal key={index} direction="up" delay={index * 100}>
      <UnifiedCard variant="elevated" className="hover:shadow-xl transition-all duration-300">
        {item.content}
      </UnifiedCard>
    </ScrollReveal>
  ))}
</div>
```

**Process Steps with Sequential Reveal:**
```tsx
{processSteps.map((step, index) => (
  <ScrollReveal key={index} direction="left" delay={index * 100}>
    <UnifiedCard variant="elevated">
      {step.content}
    </UnifiedCard>
  </ScrollReveal>
))}
```

---

## Call-to-Action (CTA) Standards

Use constants from `@/design-system/constants`:

```tsx
import { CTA_TEXT } from "@/design-system/constants";

CTA_TEXT.primary     // "Request Site Assessment"
CTA_TEXT.project     // "Request Project Quote"
CTA_TEXT.gc          // "For GCs: Request Unit Pricing"
CTA_TEXT.contact     // "Contact Us"
CTA_TEXT.secondary   // "View Services"
```

### CTA Placement
- **Hero sections**: Primary + optional secondary CTA
- **Mid-page CTAs**: Primary only
- **Footer CTAs**: Primary + secondary

---

## Animation System

### Durations
- **Fast**: `duration-200` (hover states, quick transitions)
- **Standard**: `duration-300` (page transitions, section reveals)

### Easing
All animations use: `cubic-bezier(0.4, 0, 0.2, 1)`

### Standard Animations
```tsx
import { ANIMATIONS } from "@/design-system/constants";

className={ANIMATIONS.fadeIn}    // Fade in on load
className={ANIMATIONS.slideUp}   // Slide up reveal
className={ANIMATIONS.hover}     // Standard hover scale
```

---

## Brand Voice & Positioning

### Company Positioning
Always describe Ascent Group as:
> "Lead/specialty contractor for building envelope & restoration"

**NOT**:
- "Full-service general contractor"
- "GC" or "general contractor"
- "Construction company" (too generic)

### Tone Guidelines
- **Professional**: Clear, competent, no hype
- **Competent**: Demonstrate expertise through specifics
- **Accessible**: Jargon-free where possible
- **Honest**: No unverified claims

### What to Avoid
- ❌ Unverified numbers ("15+ years", "$100M+")
- ❌ Certifications not held ("COR certified")
- ❌ Inconsistent CTA wording
- ❌ Positioning as full GC

---

## Responsive Breakpoints

- **sm**: 640px and up (mobile landscape)
- **md**: 768px and up (tablet)
- **lg**: 1024px and up (desktop)
- **xl**: 1280px and up (large desktop)
- **2xl**: 1536px and up (extra large)

---

## Usage Examples

### Standard Page Structure
```tsx
import { Section } from "@/components/sections/Section";
import { UnifiedPageHero } from "@/components/sections/UnifiedPageHero";
import { UnifiedCard } from "@/components/shared/UnifiedCard";
import { CTA_TEXT } from "@/design-system/constants";

<UnifiedPageHero
  title="Service Name"
  description="Service description"
  primaryCTA={{ text: CTA_TEXT.project, href: "/estimate" }}
/>

<Section size="major">
  <h2>Section Title</h2>
  <div className="grid md:grid-cols-3 gap-6">
    {items.map(item => (
      <UnifiedCard key={item.id} variant="elevated">
        {item.content}
      </UnifiedCard>
    ))}
  </div>
</Section>
```

### CTA Section
```tsx
<Section size="subsection" className="border-t border-border">
  <div className="text-center max-w-3xl mx-auto">
    <h2>Ready to Get Started?</h2>
    <p className="text-muted-foreground mb-8">
      Contact us for a site assessment.
    </p>
    <div className="flex gap-4 justify-center">
      <Button variant="primary" asChild>
        <Link to="/estimate">{CTA_TEXT.primary}</Link>
      </Button>
      <Button variant="outline" asChild>
        <Link to="/contact">{CTA_TEXT.contact}</Link>
      </Button>
    </div>
  </div>
</Section>
```

---

## File Structure

```
src/
├── design-system/
│   └── constants.ts          # Design tokens and standards
├── components/
│   ├── shared/
│   │   └── UnifiedCard.tsx   # Unified card component
│   ├── sections/
│   │   ├── Section.tsx       # Layout section component
│   │   └── UnifiedPageHero.tsx # Page hero component
│   └── forms/
│       └── UnifiedFormField.tsx # Form field component
└── ui/
    └── Button.tsx            # Unified button component
```

---

## Implementation Checklist

When creating or updating a page:

- [ ] Use `<Section>` for all layout sections
- [ ] Import buttons from `@/ui/Button`
- [ ] Use `<UnifiedCard>` for all card components
- [ ] Use CTA constants from `@/design-system/constants`
- [ ] Apply consistent max-width (`max-w-7xl`)
- [ ] Use semantic color tokens (not direct colors)
- [ ] Apply standard animation timing
- [ ] Follow brand positioning guidelines
- [ ] Remove any unverified claims
- [ ] Test responsive behavior

---

---

## QA & Testing Checklist

### Visual Consistency
- [ ] Typography matches across all pages (H1, H2, body text)
- [ ] All sections use Section component with correct spacing
- [ ] All cards use UnifiedCard component
- [ ] All CTAs use CTA_TEXT constants
- [ ] Color scheme is consistent (using semantic tokens)

### Responsive Testing
Test at these breakpoints:
- [ ] 375px (Mobile)
- [ ] 768px (Tablet)
- [ ] 1024px (Desktop)
- [ ] 1440px (Large Desktop)

### Animation Testing
- [ ] Scroll reveals trigger at appropriate scroll position
- [ ] Hover effects work smoothly on all interactive elements
- [ ] Stagger animations create pleasing sequential reveal
- [ ] No animation jank or performance issues
- [ ] Animations respect `prefers-reduced-motion` setting

### Accessibility
- [ ] All interactive elements have proper focus states
- [ ] Color contrast meets WCAG AA standards
- [ ] Animations can be disabled for users who prefer reduced motion
- [ ] All images have appropriate alt text

---

## Maintenance Guidelines

### When Creating New Pages
1. **Always use UnifiedPageHero** for page headers
2. **Wrap all sections** in `<Section>` component
3. **Use UnifiedCard** for all card-based content
4. **Import CTA_TEXT** constants for all call-to-action buttons
5. **Add ScrollReveal** to card grids and major sections
6. **Use semantic color tokens** from index.css (never hardcode colors)

### When Updating Existing Pages
1. **Check for outdated components:**
   - Replace `Card` from `@/components/ui/card` with `UnifiedCard`
   - Replace `PageHeader` with `UnifiedPageHero`
   - Replace custom `<section>` tags with `<Section>` component
2. **Add animations if missing:**
   - Wrap card grids with `ScrollReveal`
   - Add hover effects: `className="hover:shadow-xl transition-all duration-300"`
3. **Verify typography consistency:**
   - H1: `text-4xl md:text-5xl lg:text-6xl font-bold`
   - H2: `text-3xl md:text-4xl font-bold`

### When to Update This Document
- Adding new reusable components
- Changing design tokens or constants
- Modifying animation standards
- Updating brand positioning
- Adding new CTA text options

### Regular Reviews
Review this document quarterly to ensure:
- All pages follow standards
- New features are documented
- Examples are up-to-date
- No outdated information remains

---

Last updated: November 16, 2025
