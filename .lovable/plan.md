

# Phase 4: Lead Flow Hardening + SEO Cleanup — Tightened Plan

## H1 Sanity Check (completed during inspection)

| Page | H1 | Verdict |
|---|---|---|
| `/estimate` | "Request Your Estimate" | Clean, aligned with intent |
| `/contact` | "Contact Us" (via PageHero) | Clean |
| `/submit-rfp` | "Submit Your RFP" (via PageHero) | Clean |
| `/faq` | "Frequently Asked Questions" (via PageHero) | Clean |

No H1 changes needed. All are distinct and match page purpose.

---

## Files to Change

| File | Changes |
|---|---|
| `src/pages/Estimate.tsx` | Replace auto-redirect with in-place success state; fix SEO description + keywords; consolidate notification warning into single toast |
| `src/pages/SubmitRFPNew.tsx` | Replace immediate `navigate("/")` with in-place success state; add notification failure user feedback; add `consent` to step 4 validation |
| `src/pages/Contact.tsx` | Fix SEO title (add "Construction"); shorten meta description to ~155 chars |
| `src/pages/FAQ.tsx` | Fix SEO title ("Painting & Construction" → "Building Envelope & Restoration"); tighten hero description to match positioning |

---

## Lead Flow Fixes

### 1. `/estimate` — Replace redirect with success state
**Current**: `setTimeout(() => navigate("/"), 2000)` — user may not read toast.
**Fix**: After successful submit, replace the form UI with an in-place success panel showing:
- "Your estimate request has been submitted"
- "We'll contact you within 24 hours to discuss your project"
- CTA buttons: "Return Home" and "Submit an RFP" (manual navigation)
- No automatic redirect

Also consolidate the two sequential toasts (success + notification warning) into one conditional toast, matching the `/contact` pattern.

### 2. `/submit-rfp` — Replace redirect with success state
**Current**: `navigate("/")` fires immediately — user likely never sees the success toast.
**Fix**: Set a `submitted` state flag. When true, render a success confirmation panel instead of the form:
- "Your RFP has been submitted successfully"
- "Our team will review your proposal and respond within 2 business days"
- CTA buttons: "Return Home" and "Contact Us"
- No automatic redirect

Add notification failure feedback: if email fails, show conditional description in the success toast (same pattern as `/contact`).

Add `"consent"` to step 4 `fieldsToValidate` array (line 80).

### 3. `/contact` — No functional changes
**Current**: Already uses the best pattern — shows conditional toast, resets form, stays on page. No redirect.
**Verdict**: No lead-flow changes needed. Only SEO metadata fixes.

### Post-Submit Clarity Summary

| Page | Current Success Message | Assessment | Change |
|---|---|---|---|
| `/contact` | "Message sent! We'll get back to you within 24 hours." | Clear, professional | No change |
| `/estimate` | "Estimate Request Submitted! We'll contact you within 24 hours to schedule a site visit." | Good but user may miss it due to redirect | Move to in-place panel |
| `/submit-rfp` | "RFP Submitted Successfully. We'll review your request and contact you within 2 business days." | Good but invisible due to immediate redirect | Move to in-place panel |

The Estimate vs RFP distinction is clear from context: Estimate is for quick pricing on defined scopes; RFP is for formal project proposals. The success messages reinforce this appropriately.

---

## SEO/Metadata Fixes

| Page | Field | Current | New |
|---|---|---|---|
| `/estimate` | description | "Get an instant estimate for your painting or stucco project…" | "Request a project estimate for building envelope, restoration, or specialty trade work. Fast, accurate pricing with no obligation. Licensed and insured contractors serving Ontario." |
| `/estimate` | keywords | "painting quote, stucco quote…" | "construction estimate, building envelope quote, restoration estimate, project estimate, GTA contractors" |
| `/contact` | title | "Contact Us - Request Proposal \| Ascent Group" | "Contact Us \| Ascent Group Construction" |
| `/contact` | description | 250+ chars, service-list heavy | "Contact Ascent Group Construction for building envelope, restoration, and specialty trade services across Ontario. Request a consultation or get a project quote." (~155 chars) |
| `/faq` | title | "Frequently Asked Questions - Painting & Construction \| Ascent Group" | "Frequently Asked Questions \| Building Envelope & Restoration" |
| `/faq` | hero description | "…about construction, painting, EIFS, stucco, and restoration services across the GTA." | "…about building envelope, restoration, and specialty trade services across Ontario and the GTA." |

---

## Not Changed in This Phase
- Newsletter code (verified real, DB-persisted)
- Navigation Builder / Redirects Manager / robots control-plane
- Orphaned components cleanup
- Admin panel wording
- Broad copy rewrites
- H1s (all clean)

## Checks After Coding
1. Build passes
2. `/estimate` shows in-place success panel after submit (no redirect)
3. `/submit-rfp` shows in-place success panel after submit (no redirect)
4. `/contact` still works as before (no redirect, form resets)
5. RFP consent checkbox is validated before submission allowed
6. RFP notification failure shows user-facing feedback
7. SEO titles/descriptions updated on all 4 pages
8. No console errors on any lead-flow page

