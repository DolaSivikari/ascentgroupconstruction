# Brand Guidelines - Ascent Painting

## Color System

### Corporate Color Palette

**Deep Black (`--brand-primary`)**
- **HSL:** `0 0% 10%`
- **Hex:** `#1A1A1A`
- **Usage:** Primary brand color for headers, navigation, text, emphasis elements
- **RGB:** `26, 26, 26`

**Pure Orange (`--brand-accent`)**
- **HSL:** `25 100% 50%`
- **Hex:** `#FF6600`
- **Usage:** Accent color for CTAs, highlights, active states, interactive elements
- **RGB:** `255, 102, 0`

**Medium Gray (`--brand-gray`)**
- **HSL:** `0 0% 40%`
- **Hex:** `#666666`
- **Usage:** Secondary text, borders, muted UI elements
- **RGB:** `102, 102, 102`

### When to Use Each Color
1. **Deep Black**: Main sections, navigation, headers, body text, professional content
2. **Pure Orange**: Call-to-action buttons, important highlights, badges, hover states
3. **Medium Gray**: Secondary text, borders, subtle UI elements, disabled states

## Typography

### Font Families
- **Display/Headings (H1, H2)**: 'Playfair Display' - Traditional serif that conveys stability, craftsmanship, and heritage. Used for major section headings to differentiate from tech startups.
- **Subheadings (H3, H4)**: 'Inter' - Clean, professional sans-serif for subsection headings and navigation
- **Body/UI**: 'Inter' - Modern sans-serif for body text, buttons, and interface elements

### Implementation
```css
h1, h2 {
  font-family: 'Playfair Display', serif;
  font-weight: 800;
}

h3, h4 {
  font-family: 'Inter', sans-serif;
  font-weight: 700;
}

body, p, li, button {
  font-family: 'Inter', sans-serif;
}
```

### Typography Scale
- **Hero/Landing**: `text-4xl` to `text-6xl` (2.25rem - 3.75rem)
- **Section Headings**: `text-3xl` to `text-4xl` (1.875rem - 2.25rem)
- **Subsection Headings**: `text-2xl` to `text-3xl` (1.5rem - 1.875rem)
- **Body Text**: `text-base` to `text-lg` (1rem - 1.125rem)
- **Small Text**: `text-sm` (0.875rem)

### Line Height Guidelines
- Headings: `1.2` to `1.3` for tight, impactful text
- Body: `1.5` to `1.6` for optimal readability
- Display Text: `1` for dramatic effect (landing numbers)

## Spacing System

### Section Spacing
- **Major Sections**: `py-20` (5rem top/bottom)
- **Subsections/CTAs**: `py-16` (4rem top/bottom)
- **Content Blocks**: `py-12` (3rem top/bottom) - DEPRECATED, use py-16 instead

### Container Spacing
- Desktop: `container mx-auto px-4`
- Content max-width: `max-w-7xl` or `max-w-4xl` (depending on content type)

### Gap/Grid Spacing
- Grid gaps: `gap-6` or `gap-8` (1.5rem or 2rem)
- Flex gaps: `gap-4` (1rem)
- Tight spacing: `gap-2` (0.5rem)

## Button Hierarchy

### Button Variants (Use Design System)
1. **Primary** (`variant="default"`): Main actions, form submissions
2. **Secondary** (`variant="secondary"`): Important CTAs like "Get Estimate"
3. **Outline** (`variant="outline"`): Secondary actions, alternative choices
4. **Ghost** (`variant="ghost"`): Subtle actions, navigation items

### Button Sizes
- Large CTAs: `size="lg"` with `px-8` or `px-10`
- Standard: `size="default"`
- Compact: `size="sm"`
- Icon only: `size="icon"`

### Border Radius
- Buttons: `rounded-md` (0.375rem / 6px)
- Cards: `rounded-lg` (0.5rem / 8px)
- Small elements: `rounded` (0.25rem / 4px)
- Circular: `rounded-full`

## Shadow System

### Standard Shadows (Use CSS Variables)
- **Card Shadow**: `shadow-[var(--shadow-card)]`
- **Card Hover**: `shadow-[var(--shadow-card-hover)]`
- **Elevated**: `shadow-lg` for important floating elements
- **Dramatic**: `shadow-2xl` for modals and major overlays

### Shadow Progression
- Resting: `shadow-md` (--shadow-card)
- Hover: `shadow-lg` (--shadow-card-hover)
- Active/Focus: `shadow-xl`
- Modals: `shadow-2xl`

## Animation Guidelines

### Timing Functions
- **Quick Feedback** (hover highlights): `duration-200` (0.2s)
- **Standard Transitions** (most interactions): `duration-300` (0.3s)
- **Dramatic Reveals** (page loads, modals): `duration-500` (0.5s)

### Easing
- Default: `ease-out` for most transitions
- Smooth: `cubic-bezier(0.4, 0, 0.2, 1)` for complex animations
- Bounce: `cubic-bezier(0.68, -0.55, 0.265, 1.55)` for playful effects

### Common Animations
- **Fade In**: `animate-fade-in` - opacity and translate
- **Scale In**: `animate-scale-in` - scale and opacity
- **Hover Lift**: `.hover-lift` utility class
- **Hover Scale**: `.hover-scale` utility class

## Z-Index Hierarchy

Use semantic z-index variables from design system:
- **Base**: `z-base` (0) - Default layer
- **Dropdown**: `z-dropdown` (10) - Dropdown menus
- **Sticky**: `z-sticky` (20) - Sticky headers
- **Fixed**: `z-fixed` (30) - Fixed elements
- **Overlay**: `z-overlay` (40) - Floating contact, overlays
- **Navigation**: `z-navigation` (50) - Main navigation
- **Mega Menu**: `z-mega-menu` (60) - Mega menus
- **Modal Backdrop**: `z-modal-backdrop` (70) - Modal backgrounds
- **Modal**: `z-modal` (80) - Modal content
- **Popover**: `z-popover` (90) - Popovers and tooltips
- **Toast**: `z-toast` (100) - Toast notifications

## Accessibility

### Contrast Requirements
- Normal text: Minimum 4.5:1 contrast ratio
- Large text (18pt+): Minimum 3:1 contrast ratio
- Always test dark/light mode contrast

### Focus States
- Use `focus-visible:ring-2` for keyboard navigation
- Ring color: `ring-ring` (uses --ring variable)
- Ring offset: `ring-offset-2` for clear separation

### Motion
- Respect `prefers-reduced-motion` for animations
- Provide pause/stop controls for auto-playing content
- Use semantic HTML for screen readers

## Best Practices

### DO
✓ Use semantic color tokens (primary, secondary, accent)
✓ Use CSS variables for shadows and complex values
✓ Consolidate button variants into design system
✓ Maintain consistent spacing rhythm
✓ Test in both light and dark modes
✓ Use proper semantic HTML

### DON'T
✗ Use hardcoded colors (e.g., `text-white`, `bg-black`)
✗ Mix custom classes with design system variants
✗ Create one-off shadow values
✗ Use inconsistent spacing (py-12, py-14, py-18, etc.)
✗ Override button styles with utility classes
✗ Forget to test accessibility contrast

## Component-Specific Guidelines

### Cards
- Background: `bg-card` (uses --card variable)
- Border: `border-border` (uses --border variable)
- Shadow: `shadow-[var(--shadow-card)]`
- Hover: `hover:shadow-[var(--shadow-card-hover)]`
- Border radius: `rounded-lg`

### Forms
- Inputs: `rounded-md` with `border-input`
- Focus: `focus-visible:ring-2 ring-ring`
- Labels: `text-sm font-medium`
- Helper text: `text-sm text-muted-foreground`

### Navigation
- Desktop nav: `bg-background/95 backdrop-blur-md`
- Sticky: `sticky top-0 z-navigation`
- Mega menu: `z-mega-menu` with `backdrop-blur-lg`
- Mobile menu: Full-screen overlay with slide animation

### Sections
- Hero: Full viewport height with gradient overlay
- Content: `py-20` major sections, `py-16` subsections
- Background patterns: Subtle opacity (0.02 - 0.05)
- Gradients: `from-primary via-primary-dark to-charcoal`
