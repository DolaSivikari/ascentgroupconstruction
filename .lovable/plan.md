

# Fix Build Errors from Merged Pull Requests

The build is broken due to botched git merges in three files. Here is exactly what happened and what needs to be fixed:

## 1. `src/pages/Index.tsx` — Duplicate imports (lines 9-10 duplicate lines 13-14)
Remove the duplicate `WhyChooseUs` and `CompanyOverviewHub` imports on lines 13-14.

## 2. `src/components/homepage/WhoWeServeHomepage.tsx` — Two component declarations merged together
Lines 10-66 declare `WhoWeServeHomepage` with data + hooks but no return. Lines 68-120 declare it again with the return but no data. These need to be merged into a single component: keep the hooks/data from the first block and the return JSX from the second block, removing the duplicate `const WhoWeServeHomepage = () => {` on line 68.

## 3. `src/components/homepage/CompanyOverviewHub.tsx` — Two return statements, broken JSX
The file has two `return` blocks (lines 61 and 88) from a bad merge. The second return uses `Section`, `SectionHeader`, `Card`, `TabsContent` but none are imported, and the JSX has mismatched closing tags (`</Card>` instead of `</div>`, `</div>` instead of `</div>` in wrong nesting). 

**Fix approach**: Keep only the first return block (lines 61-86 header), then restructure the tab content sections from lines 98-201 as simple stacked card sections (Approach, Values, Promise) under it — using plain `div` elements with proper closing tags. Remove the orphan second return and all references to unimported `Section`/`SectionHeader`/`Card`/`TabsContent`.

## Files modified
- `src/pages/Index.tsx` — remove 2 duplicate import lines
- `src/components/homepage/WhoWeServeHomepage.tsx` — merge two declarations into one
- `src/components/homepage/CompanyOverviewHub.tsx` — full rewrite to fix broken JSX structure

