

# Why Your Site Still Doesn't Feel Like PCL or Turner -- Honest Diagnosis

## The Core Issue

The previous professionalization audit addressed the *right problems* (removing splash screens, reducing trust badges, simplifying animations), but it was mostly **surface-level cleanup**. The deeper issues that separate your site from enterprise construction firms remain untouched. Here's what's still off:

---

## Problem 1: Stock Video + Same Video on Every Slide

**What PCL does:** Each hero slide shows a *real completed project* -- a restaurant they built, a hospital, a stadium. The imagery tells a story about their *actual work*.

**What your site does:** All 3 hero slides use the exact same stock construction video (`hero-clipchamp.mp4`). The video shows a generic building under construction with cranes -- it could be any company's site. When a visitor clicks through the slides, the background never changes. This is the single biggest "template" signal.

**Fix:** Replace with 2-3 short clips or high-quality photos of *your actual projects*. Even phone-shot drone footage of a real job site is more credible than polished stock video.

---

## Problem 2: Hero Content is Center-Aligned and Generic

**What PCL does:** Text is left-aligned, uses a *project-specific* headline ("Crafting a World-Class Dining Experience"), and has a minimal "READ THE STORY" link. Clean, editorial, confident.

**What your site does:** Center-aligned headline ("Building Excellence Across Ontario"), a pill badge, two CTA buttons, stat numbers, slide dots, a play/pause button, and a scroll indicator -- all competing for attention on one screen. This is visual clutter.

**Fix:**
- Left-align hero content
- Remove the "Building Envelope & Restoration Specialists" pill badge (redundant with the headline)
- Remove the scroll indicator (unnecessary)
- Reduce to 1 CTA button (the primary one)
- Remove stat numbers from hero (move them to a dedicated section)

---

## Problem 3: The Services Section Has Search/Filter UI on the Homepage

Enterprise sites show 4-6 curated service cards on the homepage. Your homepage shows a full search bar, filter pills, a "12 of 14 services" counter bar, and a results grid. This is an *application interface*, not a marketing page.

**Fix:** On the homepage, show a curated grid of 6 featured services (no search, no filters, no counter). Save the full explorer for `/services`.

---

## Problem 4: Too Many Sections Competing

Your homepage has 5 sections: Hero, Trust Badges, Who We Serve (4 cards), Services Explorer (full search UI), and Vendor Package (complex form + 6 items + 4 related links). Each section tries to do too much.

**PCL's homepage:** Hero (project story) then a clean grid of 3-4 content blocks, then a simple CTA. That's it.

**Fix:** 
- Remove Trust Badge Bar as a standalone section (integrate those 3 data points into the hero or footer)
- Simplify Vendor Package to a 2-line CTA band ("Need our vendor packet? Request it here.")
- Remove "Related Resources" grid from the CTA section (it's redundant with navigation)

---

## Problem 5: Card Styling is Too Rounded and "App-Like"

Your cards use `border-radius: 16px` (--radius-lg), gradient overlays on hover, backdrop-blur effects, and translateY lift animations. Enterprise construction sites use flat cards with minimal or no border-radius (4-8px max), no blur effects, and minimal hover states.

**Fix:**
- Reduce card border-radius to 8px
- Remove backdrop-blur from cards
- Remove gradient hover overlays from service cards
- Reduce hover lift from -translate-y-1 to -translate-y-0.5 or remove it

---

## Problem 6: Orange Accent is Overused

Orange icons, orange bullets, orange borders, orange gradients, orange hover states, orange buttons -- it's everywhere. Enterprise sites use their accent color sparingly (PCL uses green only for their logo and occasional small accents).

**Fix:** Use orange only for primary CTAs and the logo. All other icons and accents should use the navy/charcoal palette.

---

## Implementation Plan

### Phase 1: Hero Overhaul
- Left-align hero content
- Remove the pill badge, scroll indicator, and stat numbers
- Keep only 1 CTA button (primary)
- Add a "View Our Work" text link as secondary action
- Keep the slide system but note that real project imagery is needed (manual upload by you)

### Phase 2: Homepage Simplification
- Replace `ServicesExplorer` on homepage with a simple `FeaturedServicesGrid` (6 cards, no search/filters)
- Remove TrustBadgeBar as a standalone section; move data points into footer or a subtle line in the hero
- Simplify PrequalPackage to a clean CTA band (title + description + 1 button)

### Phase 3: Visual Refinement
- Reduce --radius-lg from 16px to 8px
- Remove backdrop-blur from service cards
- Remove gradient hover overlays
- Tone down orange usage: icons in Who We Serve cards change to navy, bullet points change to charcoal
- Reduce hover lift animations

### Phase 4: Typography and Spacing Polish
- Ensure section headers are left-aligned (not centered) to match enterprise editorial style
- Reduce the "SectionBadge" pill components (enterprise sites don't use colored pills above every heading)

---

## Technical Details

### Files to Modify
1. **`src/components/homepage/EnhancedHero.tsx`** -- Left-align, remove clutter, simplify CTAs
2. **`src/pages/Index.tsx`** -- Remove `TrustBadgeBar`, replace `ServicesExplorer` with simpler grid, simplify `PrequalPackage`
3. **`src/components/homepage/PrequalPackage.tsx`** -- Reduce to minimal CTA band
4. **`src/styles/tokens.css`** -- Reduce `--radius-lg` from 16px to 8px, `--radius-xl` from 20px to 12px
5. **`src/components/services/TieredServicesGrid.tsx`** -- Remove backdrop-blur, gradient overlay, reduce hover effects
6. **`src/components/homepage/WhoWeServeHomepage.tsx`** -- Left-align header, change icon colors from orange to navy
7. **`src/components/unified/ClientSegmentCard.tsx`** -- Change icon background from orange to navy tones
8. **`src/components/homepage/TrustBadgeBar.tsx`** -- May be removed or integrated elsewhere

### What You Need to Provide
- 2-3 real project photos or short video clips (even phone quality is fine)
- These replace the stock video and immediately elevate credibility

### What Won't Change
- Navigation structure (already professional)
- Footer (already well-structured)
- Design tokens and color palette (fundamentally sound)
- All service pages and internal pages

