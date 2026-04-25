## Goal

Make the RFP submission flow trustworthy: a richer success screen, observable failures, and reliable delivery to **estimating@ascentgroupconstruction.com** using Lovable's built-in email infrastructure as the primary sender, with the existing Resend code path retained as a fallback.

---

## Batch A — Submit RFP success screen

**File:** `src/pages/SubmitRFPNew.tsx`

1. Capture the inserted row's `id` and `created_at` by chaining `.select('id, created_at').single()` on the insert.
2. Store `submissionRef` (short ID like `RFP-XXXXXXXX` derived from the UUID) and `submittedAt` in state.
3. Replace the current success block with an upgraded panel showing:
   - Big check icon + "RFP received"
   - **Reference ID** badge (monospace, copy-to-clipboard button)
   - **Submitted at** timestamp (formatted)
   - **Expected timeline** (3-step list: Review 24–48h → Initial contact within 2 business days → Proposal)
   - File-upload count line (kept)
   - Two CTAs: "Return Home" + "Contact Us"
   - **Conditional admin link**: if the current session has `is_admin`, show a "View in admin inbox" link to `/admin/inbox?tab=rfp&highlight=<id>`. Use existing `useAuth` / role hook; render nothing for public users.
4. Pass the reference ID into the email body so customers can reply with it.

---

## Batch B — Error logging + admin alerts on email failure

**Edge function:** `supabase/functions/send-rfp-notification/index.ts`

1. Wrap each Resend call in a try/catch that captures: status code, response body, recipient.
2. On any failure, insert a row into `public.error_logs` with:
   - `message`: `"send-rfp-notification: <stage> failed"`
   - `context`: `{ stage, status, response, rfp_email, recipient }`
3. Also write a row to `public.admin_notifications` via the existing `notify_admins(...)` RPC pattern (type `email_failure`) so the bell inbox surfaces it.
4. Return `200` to the client even if email fails (DB row already saved) but include `email_status: 'failed'` in the response so the UI can show the soft warning it already has.
5. Add structured `console.error` lines for the existing Edge Function logs view.

**Client side (`SubmitRFPNew.tsx`):** read `email_status` from the function response and adjust the toast wording accordingly (already partially in place).

---

## Batch C — Built-in email setup (primary sender)

This is the reliability fix. Steps:

1. **Set up the email domain** — present the email setup dialog so you can verify a sender subdomain (recommended: `notify.ascentgroupconstruction.com`). NS records get delegated to Lovable's nameservers; you add them once at your registrar.
2. **Provision email infrastructure** — creates the queue, suppression list, send log, unsubscribe tokens, and the dispatcher cron job.
3. **Scaffold transactional email** — creates the `send-transactional-email` Edge Function and the unsubscribe page route.
4. **Create two React Email templates** in `supabase/functions/_shared/transactional-email-templates/`:
   - `rfp-customer-confirmation.tsx` — branded confirmation to the submitter (Navy header, Inter font, reference ID, timeline, CTA to portfolio).
   - `rfp-internal-notification.tsx` — internal alert to `estimating@ascentgroupconstruction.com` with all RFP details and a deep link to `/admin/inbox?tab=rfp&highlight=<id>`.
5. **Register both** in `_shared/transactional-email-templates/registry.ts`.
6. **Deploy** `send-transactional-email`.

**Client wiring:** in `SubmitRFPNew.tsx`, after a successful insert, invoke `send-transactional-email` twice:
- Customer confirmation with `idempotencyKey: rfp-customer-<id>`, recipient = submitter's email.
- Internal alert with `idempotencyKey: rfp-internal-<id>`, recipient = `estimating@ascentgroupconstruction.com`, includes full `templateData`.

---

## Batch D — Resend kept as fallback

1. Keep the existing `send-rfp-notification` Edge Function deployed.
2. In the client, if `send-transactional-email` invocation fails (network/queue rejection), fall back to invoking `send-rfp-notification` (existing Resend code path). This gives a second delivery attempt while the built-in queue is the primary.
3. Confirm `RESEND_API_KEY` is already configured (it is — listed in project secrets). No new secret prompt needed.
4. Update `send-rfp-notification` to send the internal email to **estimating@ascentgroupconstruction.com** (already correct in the current code — verified in the file you pasted).
5. Add a comment block at the top of `send-rfp-notification/index.ts` clarifying it is now a **fallback** sender; primary is `send-transactional-email`.

> Note on Resend domain verification: Resend requires a verified sending domain to deliver to non-test recipients. Because we're delegating `notify.ascentgroupconstruction.com` to Lovable for the built-in system, Resend should verify a *different* subdomain (e.g., `mail.ascentgroupconstruction.com`) or the root domain. I'll flag this in chat after Batch C so you can decide; until Resend's domain is verified there, the fallback will only succeed when the recipient is on a Resend-allowed address. The built-in system covers the primary path regardless.

---

## Batch E — Admin inbox highlight (small UX polish)

**File:** `src/pages/admin/UnifiedInbox.tsx` (or the RFP tab component it uses)

1. Read `?highlight=<id>` from the URL.
2. Scroll the matching row into view and apply a brief ring highlight (`ring-2 ring-primary` for ~3s) so the link from the success screen / internal email lands on the right submission.

---

## Files to be edited / created

**Edited**
- `src/pages/SubmitRFPNew.tsx` — success screen rebuild, dual sender, fallback logic
- `supabase/functions/send-rfp-notification/index.ts` — error logging, admin alert, fallback header comment
- `src/pages/admin/UnifiedInbox.tsx` (and/or `EstimatesQuotesTable.tsx`) — `highlight` query param

**Created**
- `supabase/functions/_shared/transactional-email-templates/rfp-customer-confirmation.tsx`
- `supabase/functions/_shared/transactional-email-templates/rfp-internal-notification.tsx`
- `supabase/functions/_shared/transactional-email-templates/registry.ts` (or update if scaffold creates it)
- Unsubscribe page route (auto-created by scaffold tool)

**Infrastructure (tool-provisioned, not hand-written SQL)**
- Email domain `notify.ascentgroupconstruction.com`
- Email queue tables, cron job, suppression list, send log
- `send-transactional-email`, `handle-email-unsubscribe`, `handle-email-suppression`, `process-email-queue` Edge Functions

---

## What you'll need to do once approved

When I switch to default mode, the very first step is the **email domain setup dialog** — you'll click through it to choose `notify.ascentgroupconstruction.com` (or another subdomain), and after approval you'll add 2 NS records at your domain registrar. Everything else (templates, queue, fallback wiring, success screen, admin alerts) I handle without further input.
