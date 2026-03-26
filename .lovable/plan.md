

## Plan: Increase Homepage Text Sizes

### Problem
Multiple homepage sections use undersized text:
- **`text-xs` (12px)** used for: highlight card descriptions, service area labels, proof strip labels, process card value descriptions, Our Values/Promise descriptions
- **`text-sm` (14px)** used for: body paragraphs in ServiceHighlights, benefit descriptions in WhoWeServe, process step descriptions, approach items, CTA card descriptions, footer links
- The brand guideline specifies body text should be `text-base` to `text-lg` (16-18px)

### Changes

Bump every instance one step up across all homepage section components:
- `text-xs` → `text-sm` (12px → 14px) for labels, card sub-descriptions, compact items
- `text-sm` → `text-base` (14px → 16px) for body paragraphs, card descriptions, benefit text
- Keep `text-lg` / `text-xl` headers and section descriptions as-is (already correct)

**Files to edit (6 files):**

| File | What changes |
|---|---|
| `HomepageServiceHighlights.tsx` | Body paragraphs `text-sm` → `text-base`; highlight card titles `text-sm` → `text-base`; highlight card descriptions `text-xs` → `text-sm`; service area strip `text-xs` → `text-sm`; service card descriptions `text-sm` → `text-base`; footer link `text-sm` → `text-base` |
| `HomepageProofStrip.tsx` | Stat labels `text-xs` → `text-sm` |
| `WhoWeServeHomepage.tsx` | Benefit descriptions `text-sm` → `text-base` |
| `HomepageProcessStrip.tsx` | Step descriptions `text-sm` → `text-base`; approach items `text-sm` → `text-base`; values titles `text-sm` → `text-base`, values descriptions `text-xs` → `text-sm`; promise titles `text-sm` → `text-base`, promise descriptions `text-xs` → `text-sm`; footer link `text-sm` → `text-base` |
| `HomepageFinalCta.tsx` | CTA card descriptions `text-sm` → `text-base` |
| `WhyChooseUs.tsx` | Already uses `text-base` for descriptions — no changes needed |

### What stays the same
- All heading sizes (H2, H3) unchanged
- Section lead paragraphs (`text-lg`, `text-xl`) unchanged
- `typography.css` and design system files unchanged

