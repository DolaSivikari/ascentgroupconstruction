

## Lead Generation Plan — B2B Specialty Contractor Approach

### What's Actually Wrong

Your site looks like a GC-level firm but **converts like a brochure**. The problem isn't missing popups — it's that your conversion paths don't match how GCs, PMs, and owners actually buy:

1. **"Request Unit Pricing" for GCs goes to `/contact`** — a generic form. A GC procurement team wants to submit a scope, not fill out a contact form.
2. **InteractiveCTA (your only inline form) is dead code** — never imported anywhere.
3. **No mid-page conversion** — 6 content sections between the hero and the bottom CTA. A PM reading your services list has no way to act without scrolling to the bottom or navigating away.
4. **Hero CTAs are fine for B2B** ("Submit RFP", "Prequalify Now") — but slide 3 sends to `/markets` (informational) instead of a conversion path.
5. **Prequalification docs require a page visit** — GCs want to download your prequal package and vendor packet quickly, not browse a page.

### The Fix — 4 Changes (Professional B2B)

#### 1. Restore the inline form on the homepage
Import existing `InteractiveCTA` into `Index.tsx`, placed between WhyChooseUs and ProcessStrip. Update its heading from "Request Site Assessment" to **"Start a Project Conversation"** and button from "Request a Proposal" to **"Submit Inquiry"** — matching your professional CTA language standards.

**Edit:** `src/pages/Index.tsx` — add import + render  
**Edit:** `src/components/homepage/InteractiveCTA.tsx` — update heading/button copy

#### 2. Fix hero slide 3 CTA
Change slide 3 primary CTA from "View Markets" → `/markets` to **"Request Site Assessment"** → `/contact`. This slide targets PMs/developers/commercial clients — they need a direct conversion path, not an informational page.

**Edit:** `src/data/enriched-hero-slides.ts` — update slide 3 primaryCTA

#### 3. Add a professional sticky inquiry bar
Not a consumer popup — a slim, understated bar at the bottom of the viewport (like PCL/Turner/EllisDon sites use). Two variants:
- **Desktop:** "Looking for a trade partner? Request unit pricing or submit a scope →" with a single link to `/submit-rfp`
- **Mobile:** Tap-to-call button + "Submit Scope" button

Appears after scrolling past the hero. Hidden on `/admin/*` routes. Uses your existing design tokens and professional language.

**Create:** `src/components/StickyInquiryBar.tsx`  
**Edit:** `src/App.tsx` — add globally inside BrowserRouter

#### 4. Add quick-access credential downloads in the proof strip
Add a small "Download Prequal Package" link directly in the `HomepageProofStrip` — GC procurement teams scanning for credentials can grab docs without navigating to `/prequalification`. Links to the existing prequalification page.

**Edit:** `src/components/homepage/HomepageProofStrip.tsx` — add a subtle download/link row below the 3-stat grid

---

### What This Does NOT Include (intentionally)
- No exit-intent popups (unprofessional for B2B)
- No "Get a Free Quote" language (violates your CTA standards)
- No floating chat widgets (wrong audience)
- No consumer-grade urgency tactics

### Technical Notes
- All forms submit to existing `contact_submissions` table — no DB changes
- StickyInquiryBar uses `fixed bottom-0 z-40` with `useLocation()` to hide on admin routes
- Phone number from `useCompanySettings()` for consistency
- Professional CTA copy per your established language standards

