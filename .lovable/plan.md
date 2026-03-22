

## Plan: Add 4th Hero Slide (Truthful Content Only)

### Verified facts from `llms.txt` and `constants/company.ts`
- Founded: 2025
- WSIB compliant, $2M CGL — verified across multiple pages
- 85% self-performed — already used in slide 2
- 48-hour quote turnaround — documented in llms.txt
- Free site assessments — already used in slide 3
- 15+ years combined crew experience — already used in slide 1

### 4th Slide Content

The remaining differentiator not yet highlighted in a slide is the **documentation and responsiveness** angle — 48-hour quotes, pilot projects for new GC relationships, and prequalification-ready documentation. All verifiable from llms.txt.

```
stat: "$2M"
statLabel: "CGL Insured"
headline: "Prequalification-Ready. Documentation On Demand."
subheadline: "WSIB registered, $2M CGL coverage, 48-hour quote turnaround, and pilot projects available for new partnerships."
primaryCTA: { label: "Prequalify Now", href: "/prequalification" }
secondaryCTA: { label: "For General Contractors", href: "/for-general-contractors" }
```

Every claim is verified:
- $2M CGL — canonical across site and llms.txt
- WSIB registered — documented credential
- 48-hour quote turnaround — from llms.txt "Why Choose Us"
- Pilot projects — from llms.txt "Why Choose Us"

### Files to edit

**1. `src/data/enriched-hero-slides.ts`**
- Append the 4th slide object to the array

**2. `src/components/homepage/HeroGeometry.tsx`**
- Add `Slide4Geometry` function with a shield/document-themed SVG pattern
- Add `{slideIndex === 3 && <Slide4Geometry animated={!prefersReducedMotion} />}` to the render

No other files need changes — `EnhancedHero.tsx` dynamically maps over the slides array.

