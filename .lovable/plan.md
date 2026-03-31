

## The Real Problem: Your Website Talks AT Visitors Instead of Converting Them

### Root Cause Analysis

After deep inspection, your site has **four structural conversion failures**:

**1. Hero slides are a brochure, not a conversion engine**
Your 4 hero slides have these primary CTAs: "Submit RFP", "How We Work", "View Markets", "Prequalify Now". Three of four send visitors to informational pages. Not a single slide says "Get a Free Quote" or "Book a Site Visit". The hero — where 60-80% of visitors form their decision — is doing zero lead capture.

**2. The InteractiveCTA form component (your only inline form) is dead code**
`InteractiveCTA.tsx` exists with a working "Request Site Assessment" form, but **it is not imported or rendered anywhere** in the app. Your homepage has 8 sections and zero forms.

**3. Six content sections with no conversion opportunity**
After the hero, visitors scroll through ProofStrip → ServiceHighlights → WhoWeServe → FeaturedProjects → WhyChooseUs → ProcessStrip — all pure content. The first conversion opportunity is `HomepageFinalCta` at the very bottom, which links to `/contact` (another full page). Most visitors never get there.

**4. No persistent conversion element**
Once someone scrolls past the hero buttons, there is no visible way to take action until they reach the page bottom or open the nav menu. No sticky CTA, no floating button, no tap-to-call.

---

### The Fix — 4 Changes, Ordered by Impact

#### 1. Fix the hero CTAs (highest impact, zero new components)
Change hero slide CTAs so at least 2 of 4 slides have a direct conversion CTA:
- Slide 1: "Submit RFP" → **"Get a Free Quote"** → `/estimate`
- Slide 3: "View Markets" → **"Book a Site Assessment"** → `/contact`

Edit: `src/data/enriched-hero-slides.ts`

#### 2. Bring back the inline form on the homepage
The `InteractiveCTA` component already works. Import it into `Index.tsx` and place it between WhyChooseUs and ProcessStrip — the trust-building sweet spot.

Edit: `src/pages/Index.tsx` — add import + render `<InteractiveCTA />`

#### 3. Add a floating sticky CTA bar (every page)
A slim bar fixed to the bottom of the screen with two actions:
- **Mobile**: Large "Tap to Call" button + small "Get Quote" button
- **Desktop**: "Call (647) 528-6804" + "Get a Free Quote" button that scrolls to the nearest form or links to `/contact`

Visible after 3 seconds of scrolling. Hidden on `/admin/*` routes. Uses `PhoneLink` for the phone number.

Create: `src/components/FloatingCTA.tsx`
Edit: `src/App.tsx` — add `<FloatingCTA />` inside `BrowserRouter`

#### 4. Add exit-intent popup
When cursor moves to leave (desktop) or after 45s idle (mobile), show a simple overlay: "Before you go — get a free site assessment" with 3 fields (name, phone, email). Submits to existing `contact_submissions` table. Shows once per session via `sessionStorage`.

Create: `src/components/ExitIntentPopup.tsx`
Edit: `src/App.tsx` — add `<ExitIntentPopup />`

---

### Technical Notes

- All forms submit to existing `contact_submissions` table with distinct `submission_type` values (`quick_quote`, `exit_intent`) — no DB changes needed
- FloatingCTA uses `fixed bottom-0 z-50` with `useLocation()` to hide on admin routes
- Exit-intent uses `mouseleave` on `documentElement` (desktop) + idle timer (mobile), gated by `sessionStorage` flag
- Phone number pulled from `useSettingsData('site_settings')` for consistency

