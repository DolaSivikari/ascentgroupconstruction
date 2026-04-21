

## Route All Form Submissions to Your Outlook (Option A)

You shared your Outlook setup:
- **Main inbox:** `hebun@ascentgroupconstruction.com`
- **Aliases (all land in the same Outlook):** `admin@`, `careers@`, `estimating@`, `info@`, `projects@`, `selim@`

Since all aliases route into your main Outlook inbox, I'll send each form type to the **most appropriate alias**. That way, you can use Outlook rules to auto-file by inbox folder (e.g., everything sent to `careers@` → "Careers" folder), and the customer-facing reply address looks purposeful.

## Routing map

| Form | Currently sends to | Will send to |
|---|---|---|
| Contact form | `info@` | `info@ascentgroupconstruction.com` |
| Quote request (homepage CTA, dialog) | `info@` | `estimating@ascentgroupconstruction.com` |
| Estimate flow (`/estimate`) | `info@` | `estimating@ascentgroupconstruction.com` |
| RFP submission (`/submit-rfp`) | `info@` | `estimating@ascentgroupconstruction.com` |
| Package request (vendor packet, prequal) | `info@` | `projects@ascentgroupconstruction.com` |
| Resume / job application | `info@` | `careers@ascentgroupconstruction.com` |

All six destinations land in your single Outlook inbox via your aliases.

## What changes in the code

Six Edge Functions get one constant updated each — the admin recipient address. No logic, validation, or template changes.

- `supabase/functions/send-contact-notification/index.ts` → `to: ["info@ascentgroupconstruction.com"]`
- `supabase/functions/send-package-notification/index.ts` → `to: ["projects@ascentgroupconstruction.com"]`
- `supabase/functions/send-resume-notification/index.ts` → `to: ["careers@ascentgroupconstruction.com"]`
- `supabase/functions/send-rfp-notification/index.ts` → `to: ["estimating@ascentgroupconstruction.com"]`
- `supabase/functions/send-admin-notification/index.ts` (estimator) → `to: ["estimating@ascentgroupconstruction.com"]`
- Any quote-request/notification function → `to: ["estimating@ascentgroupconstruction.com"]`

## Two important upgrades I'll add at the same time

**1. Set `reply_to` to the customer's email**
Right now the admin notification email "From" is the system, and there's no `reply_to`. That means hitting Reply in Outlook replies to Resend's `onboarding@resend.dev`, not the customer.

I'll add `reply_to: customerEmail` to every admin notification. After this change, you can hit Reply in Outlook and it goes straight to the customer — no copy-pasting their email out of the message body.

**2. Outlook-friendly subject lines**
Outlook truncates long subjects. I'll standardize them so they sort and filter cleanly:
- `[Contact] Hebun Yilmaz — Building envelope inquiry`
- `[RFP] Acme Corp — Office tower restoration`
- `[Estimate] Jane Doe — EIFS recoating`
- `[Package] Vendor Information Request — ABC Construction`
- `[Resume] John Smith — Project Coordinator`
- `[Quote] Mike Brown — Concrete restoration`

The `[Tag]` prefix lets you build one Outlook rule per type that auto-files into folders.

## What does NOT change

- Customer confirmation emails (the auto-reply customers get) — unchanged
- Database storage in Admin → Inbox — unchanged
- Form fields, validation, rate limiting — unchanged
- Sender domain (still `onboarding@resend.dev` until you verify your domain in Resend — separate task if you want to tackle that later)
- No new infrastructure, no Outlook OAuth, no Microsoft Graph integration

## Suggested Outlook rules (you set these up on your end after I deploy)

In Outlook, create rules based on subject prefix:
- Subject contains `[RFP]` → Move to folder "RFPs"
- Subject contains `[Estimate]` → Move to folder "Estimates"
- Subject contains `[Resume]` → Move to folder "Careers"
- Subject contains `[Package]` → Move to folder "Vendor Requests"
- Subject contains `[Contact]` → Move to folder "Contact Inquiries"
- Subject contains `[Quote]` → Move to folder "Quotes"

## Files I'll touch

1. `supabase/functions/send-contact-notification/index.ts`
2. `supabase/functions/send-package-notification/index.ts`
3. `supabase/functions/send-resume-notification/index.ts`
4. `supabase/functions/send-rfp-notification/index.ts`
5. `supabase/functions/send-admin-notification/index.ts`
6. Any other notification function found during implementation (I'll audit `supabase/functions/` for all `resend.emails.send` admin recipients)

Approve and I'll ship it.

