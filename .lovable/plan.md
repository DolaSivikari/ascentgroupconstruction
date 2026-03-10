

# Enhance Estimator Step 0 — Quote Type Selection

## Current Issues
The Step 0 quote type selector has several visual weaknesses:
- Cards use basic flat layout with small icons and cramped text
- No visual hierarchy between the selected and unselected states beyond a thin ring
- The "Project Details" section that appears after selection feels disconnected — plain form fields in a muted box
- Icon containers are small (w-6 h-6) and don't create strong visual anchors
- Badge placement is squeezed into the title row, competing for attention
- No step number indicator or visual numbering on the cards
- Missing the editorial/enterprise aesthetic the rest of the site uses (8px radius, restrained styling)

## Plan

### `src/components/estimator/EstimatorStep0.tsx` — Visual overhaul

1. **Larger, bolder card layout**: Switch from horizontal icon+text to a vertical layout with a prominent icon area at top, title centered below, and description underneath. Larger icons (w-8 h-8) in bigger containers.

2. **Stronger selected state**: Selected cards get a solid left border accent (4px primary), elevated shadow, and a subtle checkmark indicator in the corner — not just a ring.

3. **Better badge placement**: Move the range badge below the description as a standalone element so it doesn't compete with the title.

4. **Numbered cards**: Add a subtle step number (01, 02, 03, 04) in the top-right corner of each card for visual anchoring and professional feel.

5. **Project Details section polish**: 
   - Add a subtle divider or step transition between the quote type selection and the details form
   - Use a cleaner card with left-aligned header and a subtle icon
   - Organize fields in a 2-column grid on desktop (company + role on one row, budget on the next)

6. **Left-align the header** per the editorial design standard (currently center-aligned)

7. **Add a subtle helper text** below the heading: a one-line trust signal like "No obligation — estimates provided within 24 hours"

### Files modified
- `src/components/estimator/EstimatorStep0.tsx` — UI/layout changes only, no logic changes

