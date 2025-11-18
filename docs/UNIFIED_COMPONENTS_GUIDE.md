# Unified Components Guide
## Ascent Group Construction Design System

This guide documents the unified component library created to ensure design consistency across the entire website.

---

## 🎯 Purpose

The unified component system eliminates the "AI template feel" by:
- Using consistent card designs across all pages
- Standardizing layouts and spacing
- Ensuring predictable animations and interactions
- Making the site feel like one cohesive product

---

## 📦 Component Library

### 1. WhoWeServeCard

**Location:** `src/components/unified/WhoWeServeCard.tsx`

**Purpose:** Unified card component for displaying client segments with two variants:

#### Simple Variant
Used on: Services page, About page

```tsx
<WhoWeServeCard
  icon={Building}
  title="Commercial Clients"
  description="Retail, office, and industrial buildings"
  link="/commercial-clients"
  variant="simple"
/>
```

**Features:**
- Centered layout
- Icon in colored container
- Title + description
- Hover effect (lifts card, changes icon background)
- Full card is clickable

#### Detailed Variant
Used on: Homepage, ClientValueProposition section

```tsx
<WhoWeServeCard
  icon={Building2}
  title="Property Managers"
  description="Multi-family and commercial property solutions"
  link="/property-managers"
  variant="detailed"
  benefits={[
    "After-hours work coordination",
    "Minimal tenant disruption",
    "Multi-property maintenance contracts",
  ]}
  ctaText="Request Consultation"
/>
```

**Features:**
- Left-aligned layout
- Icon + title in header
- Description below
- Bulleted benefits list with checkmark icons
- CTA button at bottom
- Hover effect on entire card

---

### 2. WhoWeServeSection

**Location:** `src/components/unified/WhoWeServeSection.tsx`

**Purpose:** Unified section wrapper for "Who We Serve" areas with consistent layout and animations.

```tsx
<WhoWeServeSection
  title="Who We Serve"
  description="Specialized solutions tailored to your project requirements"
  columns={4}
  background="default"
>
  {/* Your WhoWeServeCard components */}
</WhoWeServeSection>
```

**Props:**
- `title`: Section heading (default: "Who We Serve")
- `description`: Section subheading
- `columns`: 2, 3, or 4 column grid
- `background`: "default" or "muted"
- `useCardGrid`: Whether to use CardGrid with stagger animation (default: true)

**Features:**
- Automatic responsive grid layout
- Centered section heading
- Built-in ScrollReveal animations with stagger
- Consistent padding using Section component
- Works with Design System spacing standards

---

## 🎨 Design System Integration

### Colors
All components use semantic color tokens:
- `text-primary`: Primary brand color for icons and accents
- `text-foreground`: Main text color
- `text-muted-foreground`: Secondary text color
- `bg-primary/10`: Icon container background (10% opacity)
- `bg-primary/20`: Icon container on hover (20% opacity)

### Spacing
- Uses `Section` component with `size="major"` (py-16 md:py-20 lg:py-24)
- Card padding: Automatically handled by `Card` variant and size props
- Grid gaps: 8 (gap-8) for consistent spacing between cards

### Typography
- Section titles: `text-3xl md:text-5xl font-bold tracking-tight`
- Section descriptions: `text-lg md:text-xl text-muted-foreground`
- Card titles: `text-xl md:text-2xl font-semibold`
- Card descriptions: `text-muted-foreground leading-relaxed`

### Animations
- **ScrollReveal**: Cards fade in from below with stagger delays (100ms increments)
- **Hover States**: 
  - Card: `-translate-y-2` lift + `shadow-lg`
  - Icon container: Background opacity increases from 10% to 20%
  - Title color change on simple variant
- **Transition Duration**: 300ms for all animations

### Border Radius
- Cards: `rounded-[var(--radius-lg)]`
- Icon containers: `rounded-[var(--radius-lg)]`

### Shadows
- Default: No shadow
- Hover: `shadow-[var(--shadow-lg)]`
- Uses CSS variables for consistency

---

## 📍 Current Implementation Status

### ✅ Updated Pages

1. **Homepage** (`src/pages/Index.tsx`)
   - Uses `WhoWeServeSection` via `ClientSelector` component
   - 3-column detailed variant
   - Displays: Property Managers, Property Owners, Contractors & Developers

2. **Services Page** (`src/pages/Services.tsx`)
   - Uses `WhoWeServeSection` directly
   - 4-column simple variant
   - Displays: Commercial Clients, Property Managers, Homeowners, General Contractors

3. **About Page** (`src/pages/About.tsx`)
   - Uses `WhoWeServeSection` directly
   - 2-column simple variant (wider cards)
   - Displays: General Contractors, Property Managers, Commercial Owners, Homeowners

4. **ClientValueProposition Component** (`src/components/homepage/ClientValueProposition.tsx`)
   - Uses `WhoWeServeCard` detailed variant
   - 2-column layout
   - Displays: Developers & Building Owners, Property Managers & Asset Owners

---

## 🔧 Usage Guidelines

### When to Use Simple Variant
- Overview pages (Services, About)
- When you need to show many client types (4+)
- When the goal is quick navigation to dedicated pages
- When space is limited

### When to Use Detailed Variant
- Homepage or landing pages
- When you want to provide more information upfront
- When displaying 2-3 key segments
- When conversion is the primary goal

### Column Selection
- **4 columns**: Services overview, all client types shown equally
- **3 columns**: Homepage, highlighting top 3 segments
- **2 columns**: Detailed content, larger cards with more information

### Background Selection
- **default (white)**: Use on most pages for clean look
- **muted (light gray)**: Use to create visual separation between sections

---

## 🚫 What NOT to Do

### ❌ Don't Create One-Off Card Designs
```tsx
// BAD - Creating custom card inline
<Card className="p-6 hover:shadow-lg">
  <div className="flex items-center">
    <Icon className="w-8 h-8" />
    <h3>{title}</h3>
  </div>
</Card>

// GOOD - Use unified component
<WhoWeServeCard
  icon={Icon}
  title={title}
  description={description}
  link={link}
  variant="simple"
/>
```

### ❌ Don't Use Inline Client Data
```tsx
// BAD - Inline data scattered across files
{[
  { icon: Building, title: "Commercial", ...},
  { icon: Users, title: "Property Managers", ...}
].map(...)}

// GOOD - Use WhoWeServeSection with unified components
<WhoWeServeSection>
  <WhoWeServeCard icon={Building} title="Commercial" ... />
  <WhoWeServeCard icon={Users} title="Property Managers" ... />
</WhoWeServeSection>
```

### ❌ Don't Skip Animation Wrappers
The `WhoWeServeSection` component automatically handles animations. If you need to create a custom layout, still use `ScrollReveal` or `CardGrid` components.

---

## 🎯 Benefits of This System

1. **Consistency**: All "Who We Serve" sections look and feel the same
2. **Maintainability**: Update once in unified components, changes apply everywhere
3. **Efficiency**: No need to rewrite card layouts for each page
4. **Professional Feel**: Predictable patterns create trust and polish
5. **Scalability**: Easy to add new client segments or update existing ones

---

## 🔄 Future Enhancements

Consider creating additional unified components for:
- **Benefits/Features cards** (currently using mix of Card components)
- **Service cards** (currently have multiple service card variants)
- **Process/Step cards** (for methodology sections)
- **Testimonial cards** (when customer testimonials are added)
- **Team member cards** (if team profiles are added)

---

## 📞 Questions?

When in doubt about which component to use:
1. Check existing implementations in `src/pages/Index.tsx`, `src/pages/Services.tsx`, or `src/pages/About.tsx`
2. Review this guide's usage guidelines
3. Refer to the component prop interfaces in `src/components/unified/WhoWeServeCard.tsx`

**Remember:** The goal is consistency. If a pattern exists, use it. If it doesn't, consider whether it should be added to the unified component library.
