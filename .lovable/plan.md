

# Route Discoverability & Navigation Hygiene — Mini-Phase

## Summary

Small, focused cleanup: fix 2 mega-menu redirect links, remove 1 dead sitemap entry, add 2 footer links, and make page-level decisions on 2 weak pages. No new pages, no layout changes, no schema changes.

---

## Changes

### 1. Fix mega-menu redirect links
**File:** `src/data/navigation-structure-enhanced.ts`

Change two links in the Services mega menu "Restoration Services" category:
- "Façade Remediation" link: `/services/facade-remediation` → `/services/building-envelope`
- "Parking Garage Restoration" link: `/services/parking-garage-restoration` → `/services/building-envelope`

This eliminates the silent redirect bounce when users click these items.

### 2. Remove `/services/waterproofing` from sitemap
**File:** `public/sitemap.xml`

Delete the `<url>` block for `https://ascentgroupconstruction.com/services/waterproofing`. Confirmed: no published DB record with slug `waterproofing` exists. This is a dead sitemap entry.

### 3. Add `/faq` to footer Company links
**File:** `src/components/footer/UnifiedFooter.tsx`

Add `{ label: "FAQ", href: "/faq" }` to the `companyLinks` array (after "Contact").

### 4. Add `/accessibility` to footer legal bar
**File:** `src/components/footer/UnifiedFooter.tsx`

Add an "Accessibility" link next to "Privacy Policy" and "Terms of Service" in the bottom bar (both mobile and desktop).

### 5. `/why-specialty-contractor` — demote from sitemap
**File:** `public/sitemap.xml`

Remove the `<url>` block for `/why-specialty-contractor`. The page will remain routable for anyone with the direct URL, but will not be indexed or promoted. It has zero internal links and no clear discovery path. If you later decide to promote it, re-add to sitemap and link from About/Services.

### 6. `/capabilities` — no change now
This page has one CTA linking to it and is in the sitemap. It is not broken — just weakly discoverable. Recommend keeping it as-is for now and revisiting when content strategy is clearer. No code change.

---

## Files touched

| File | Change |
|---|---|
| `src/data/navigation-structure-enhanced.ts` | 2 link fixes (lines 69, 70) |
| `public/sitemap.xml` | Remove 2 URL blocks (waterproofing, why-specialty-contractor) |
| `src/components/footer/UnifiedFooter.tsx` | Add FAQ to company links, add Accessibility to legal bar |

## What is NOT done
- No new pages or components
- No admin changes
- No database changes
- No route additions or removals
- No layout or styling changes beyond the footer additions

