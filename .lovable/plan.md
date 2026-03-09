

# Add Missing Pages to Navigation & Footer

## Problem
Several key business pages have routes but are not linked in the main navigation mega menus or footer. The most notable missing pages:

- **`/capabilities`** — not in any menu or footer
- **`/why-specialty-contractor`** — not in any menu or footer  
- **`/blog`** — only appears buried in Trade Partners → Resources
- **`/company/developers`** — in Markets mega menu but missing from footer

## Changes

### 1. Navigation Mega Menu (`src/data/navigation-structure-enhanced.ts`)

**Company (About) mega menu** — add to "Company" category:
- "Capabilities" → `/capabilities` (icon: "Hammer", description: "What we deliver")
- "Why Specialty?" → `/why-specialty-contractor` (icon: "Award", description: "Our advantage")

**Trade Partners mega menu** — add to "Resources" category:
- "Blog" → `/blog` (icon: "BookOpen") is already there, no change needed

### 2. Footer (`src/components/footer/UnifiedFooter.tsx`)

**Company links** — add:
- "Capabilities" → `/capabilities`
- "Why Specialty Contractor" → `/why-specialty-contractor`
- "Blog" → `/blog`

**Resource links** — add:
- "Developers" → `/company/developers`

### 3. Mobile Nav (`src/components/navigation/MobileNavSheet.tsx`)

No changes needed — it reads from `megaMenuDataEnhanced`, so adding items there will automatically populate the mobile menu.

### Files changed
- `src/data/navigation-structure-enhanced.ts` — add 2 items to Company mega menu
- `src/components/footer/UnifiedFooter.tsx` — add 4 links to footer sections

