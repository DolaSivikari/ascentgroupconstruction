

## Auto-Reply Confirmation Emails — Audit & Gap Fix

**Good news:** Most forms already send a customer auto-reply. There are a few gaps to close and some quality improvements needed. Here's the full picture:

### Current state (what already works)

| Form | Customer auto-reply? | Notes |
|---|---|---|
| Contact form (`/contact`) | ✅ Yes | "Thank you for reaching out!" |
| Resume / job application | ✅ Yes | "Application Received" |
| Vendor / Prequalification package | ✅ Yes | "Your {Package} Request" |
| RFP submission (`/submit-rfp`) | ✅ Yes | "RFP Received" |
| **Homepage Quick Contact** (InteractiveCTA) | ✅ Yes (uses contact function) | Same as Contact |
| **Estimate flow** (`/estimate`) | ❌ **No** | Saves to DB, sends admin notification, but customer gets no email |
| **Quote Request Dialog** (from Services) | ❌ **No** | Saves to DB only, no email at all to customer or admin |

### What I'll change

**1. Add customer auto-reply to the Estimate flow** *(gap fix)*
After someone completes `/estimate`, send them an "Estimate Request Received" confirmation email with:
- Their estimated price range (the min/max we calculate)
- Summary of what they requested (project type, location, timeline)
- Next steps + 24-48h response promise
- Phone number for urgent needs

**2. Add customer auto-reply to the Quote Request Dialog** *(gap fix)*
Currently this dialog (used on service detail pages for "request quote" CTAs) saves to DB and goes silent. I'll wire it to send both:
- A customer confirmation: "Quote Request Received for {Service}"
- An admin notification to `estimating@ascentgroupconstruction.com` (with `[Quote]` subject prefix, matching the routing scheme we just set up)

**3. Polish the existing auto-reply emails** *(quality upgrade)*
The current auto-replies are functional but plain. I'll bring them up to a consistent professional standard across all 6 confirmations:
- **Branded header** with your logo/wordmark
- **Consistent footer** with address, phone, email, and a small "Why Ascent" trust line
- **Reply-to** set to `info@ascentgroupconstruction.com` so customer replies go to your Outlook (currently no `reply_to` is set, so replies bounce to the Resend sandbox address)
- **Mobile-friendly** layout with proper width and font sizes
- **Plain-text version** alongside HTML (improves deliverability — currently HTML-only)
- **Subject lines** standardized:
  - `Thanks for contacting Ascent Group Construction — we'll respond within 1 business day`
  - `Estimate request received — {Service Type}`
  - `Quote request received — {Service Type}`
  - `RFP received — {Project Name}`
  - `Application received — thank you, {Name}`
  - `Your vendor information package is on the way`

### Important caveat about deliverability

All emails currently send from `onboarding@resend.dev` (Resend's sandbox sender). This works, but:
- Some inbox providers flag it as "via resend.dev"
- Deliverability is decent but not as strong as a verified domain

To send from `noreply@ascentgroupconstruction.com` (which would look fully professional), your domain needs to be verified in Resend — this is a separate one-time DNS task. **I'll keep the current sandbox sender for now** so nothing breaks. Once you're ready, we can do the domain verification as a small follow-up task.

### What does NOT change

- Admin notification routing (the routing to `info@`, `estimating@`, `careers@`, `projects@` we set up last round stays exactly as is)
- Form fields, validation, rate limiting, database storage
- The `send-review-request` function (that's for post-project review requests, not form confirmations)
- No new dependencies, no new infrastructure, no Outlook integration needed

### Files I'll touch

1. `supabase/functions/send-contact-notification/index.ts` — polish customer email (template + reply_to + plain text)
2. `supabase/functions/send-resume-notification/index.ts` — polish customer email
3. `supabase/functions/send-package-notification/index.ts` — polish customer email
4. `supabase/functions/send-rfp-notification/index.ts` — polish customer email
5. **New:** `supabase/functions/send-estimate-confirmation/index.ts` — admin + customer emails for `/estimate`
6. **New:** `supabase/functions/send-quote-confirmation/index.ts` — admin + customer emails for Quote Dialog
7. `src/pages/Estimate.tsx` — invoke the new estimate-confirmation function on submit
8. `src/components/estimator/QuoteRequestDialog.tsx` — invoke the new quote-confirmation function on submit
9. **New:** `supabase/functions/_shared/emailTemplate.ts` — shared header/footer HTML so all 6 emails look consistent

### Result

Every single form on your site will:
1. Save the submission to the database (Admin → Inbox)
2. Email you (or the right alias) a `[Tag]`-prefixed notification with reply-to set to the customer
3. Email the customer a branded "we received your message" confirmation within seconds

Approve and I'll ship it.

