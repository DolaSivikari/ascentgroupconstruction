# Forms hardening + accessibility QA plan

Four related changes covering the Quick Contact form (`InteractiveCTA.tsx`), the RFP submission flow (`SubmitRFPNew.tsx` / `submit-form` edge function pattern), and a new internal QA checklist page.

---

## 1. Accessible labels for Quick Contact form

**File:** `src/components/homepage/InteractiveCTA.tsx`

The form already has `sr-only` `<label htmlFor>` pairs and `autoComplete` attributes (added in the prior round). Reinforce accessibility so screen readers and devtools both pass:

- Add `aria-label` as a backup on each `Input` / `Textarea` (in case a future style refactor drops the visible label wrapper).
- Add `aria-required="true"` on Name, Email, Phone (mirror what RFP Step 1 does).
- Add `aria-invalid={!!errors.field}` and `aria-describedby="<id>-error"` bindings when validation errors exist.
- Add `<form ... aria-label="Quick contact form" noValidate>` (already labelled) and ensure the submit button announces busy state via `aria-busy={isSubmitting}`.

No visual changes — purely semantic so AT users hear "Your Name, required, edit text" instead of an unlabeled input.

---

## 2. Inline client-side validation messages + success confirmation

**File:** `src/components/homepage/InteractiveCTA.tsx`

Currently the form only surfaces errors via a generic toast ("Failed to submit request"). Refactor to per-field messages:

- Introduce a `fieldErrors` state: `{ name?: string; email?: string; phone?: string; message?: string }`.
- On `handleQuickContact`, run `contactSchema.safeParse(formData)` and, on failure, map `result.error.flatten().fieldErrors` into `fieldErrors` (no toast for validation — leave toasts for network/server errors).
- Render a small `<p id="quick-contact-<field>-error" role="alert" className="text-sm text-destructive mt-1">` below each input when its error is present. Apply `aria-invalid` + `border-destructive` to the affected input.
- Clear a field's error in `onChange` so the message disappears as the user types.
- Add lightweight runtime checks beyond Zod where useful:
  - Phone: strip non-digits, require 10+ digits (matches RFP schema rule).
  - Email: keep Zod's `.email()`.

**Success confirmation (in-place, matches `lead-flow-hardening` memory):**

- Add a `submitted` boolean. On successful insert + email send, swap the form for a success panel showing:
  - Green check icon, "Request Received" heading.
  - A reference line ("We'll reach out within 24 hours at <email>").
  - "Submit another inquiry" button to reset state.
- Remove the auto-redirect to `/estimate` (current `setTimeout(navigate, 1500)` is jarring and hides confirmation). Instead, show the success panel and let users decide to navigate.

---

## 3. Honeypot + server-side spam filtering

### Quick Contact form

**Frontend (`InteractiveCTA.tsx`):**

- Add a hidden field that real users won't fill but bots will:
  ```tsx
  <input
    type="text"
    name="company_website"
    tabIndex={-1}
    autoComplete="off"
    aria-hidden="true"
    style={{ position: "absolute", left: "-10000px", width: "1px", height: "1px", opacity: 0 }}
    value={honeypot}
    onChange={(e) => setHoneypot(e.target.value)}
  />
  ```
- Track a `formStartedAt` timestamp on first keystroke. Submissions completed in < 2 seconds are almost certainly bots.
- Switch the submission path from a direct `supabase.from("contact_submissions").insert(...)` to `supabase.functions.invoke("submit-form", { body: { formType: "contact", honeypot, startedAt, data: {...} } })`. The `submit-form` edge function already understands the `honeypot` field (it returns a fake success when triggered) — we'll extend it (below) to also reject too-fast submissions.

**Server (`supabase/functions/submit-form/index.ts`):**

- Already filters honeypot ✅. Add three more lightweight spam checks:
  1. **Submit-too-fast:** if `payload.startedAt` exists and `Date.now() - startedAt < 2000`, log + return fake success.
  2. **Link spam:** if message body contains 3+ URLs (`/(https?:\/\/|www\.)/gi` matches), log + return fake success.
  3. **Repeat-content rate limit:** reuse the existing `check_and_update_rate_limit` RPC keyed by `clientId + sha256(message)` to drop identical resubmits within a 10-minute window.
- All spam responses return `{ success: true }` so bots don't learn the filter exists.
- Add a `spam_blocked` log line with `clientId`, reason, and (truncated) email so admins can review in Edge Function logs.

### RFP form

**Frontend (`src/pages/SubmitRFPNew.tsx`):**

- Add the same hidden honeypot field (`company_website`) inside the `<form>` plus a `formStartedAt` ref.
- Pass both into a new `verify-rfp-submission` step before the existing `supabase.from("rfp_submissions").insert(...)` call. Two implementation options — pick **(a)** for least churn:
  - **(a) Extend `submit-form` edge function** with a new `formType: "rfp"` branch that performs the insert server-side (mirrors contact/resume/prequal). Replaces the direct client insert. Keeps spam logic centralized.
  - (b) Add a tiny new `check-spam` edge function the client hits for a yes/no verdict before inserting from the client.

Going with **(a)**: add an `rfpSchema` to `submit-form/index.ts` and an `'rfp'` case that inserts into `rfp_submissions`, returning the new row id so the client can keep generating its `RFP-XXXXXXXX` reference.

---

## 4. Internal QA checklist page

**New route:** `/admin/qa/quick-contact-form` (admin-only via existing `useAdminRoleCheck`).

**File:** `src/pages/admin/QAQuickContactForm.tsx` + register in the admin router.

Content (rendered as a styled checklist, not a doc dump):

### Field reference
| Field | `id` | `name` | `autoComplete` | `aria-label` |
|-------|------|--------|----------------|--------------|
| Name | `quick-contact-name` | `name` | `name` | "Your full name" |
| Email | `quick-contact-email` | `email` | `email` | "Email address" |
| Phone | `quick-contact-phone` | `phone` | `tel` | "Phone number" |
| Message | `quick-contact-message` | `message` | `off` | "Project description" |
| Honeypot | `company_website` (hidden) | `company_website` | `off` | n/a |

### Expected autofill behaviour
- **Chrome (desktop & Android):** triggering autofill on Name should populate Name, Email, Phone in one click via Chrome's Address profile. Verify the yellow autofill background appears.
- **Safari (macOS & iOS):** Contact Card autofill prompt appears above keyboard on iOS for Name/Email/Phone. macOS Safari uses iCloud Keychain — Email + Phone autofill from the user's "My Card".
- **Firefox:** falls back to per-field history; no Contact Card.
- **Password managers (1Password, Bitwarden):** detect via `name` attributes and offer to fill identity items.

### Manual test checklist (interactive checkboxes, persisted to `localStorage`)
- [ ] Tabbing order: Name → Email → Phone → Message → Submit (skips honeypot).
- [ ] Empty submit shows inline errors under Name, Email, Phone.
- [ ] Invalid email shows "Invalid email address" only on the email field.
- [ ] Phone with letters shows "Invalid phone number" only on phone field.
- [ ] Successful submit shows the green "Request Received" panel (no auto-redirect).
- [ ] Honeypot filled → request silently succeeds with no DB row (verify in `contact_submissions`).
- [ ] Submission < 2 s after first keystroke → silently dropped.
- [ ] Screen reader (VoiceOver) announces each field name and "required".
- [ ] Lighthouse Accessibility score ≥ 95 on the homepage.

The page is admin-only, lives outside the marketing site, and is purely an internal ops tool.

---

## Files touched

1. `src/components/homepage/InteractiveCTA.tsx` — aria attrs, inline errors, success panel, honeypot, edge-function call.
2. `src/pages/SubmitRFPNew.tsx` — honeypot + startedAt; switch insert to `submit-form` edge fn.
3. `supabase/functions/submit-form/index.ts` — add `rfp` formType, time-gate, link-spam check, repeat-content rate limit.
4. `src/pages/admin/QAQuickContactForm.tsx` — new admin page.
5. Admin router (likely `src/routes/AdminRoutes.tsx` or equivalent — confirm during implementation) — register the QA page.

## Out of scope
- No new database tables (reuses `contact_submissions`, `rfp_submissions`, existing `rate_limits`).
- No new secrets.
- No changes to the public `/contact` form — that already routes through `submit-form` and has its own validation; happy to extend if you want parity afterward.
