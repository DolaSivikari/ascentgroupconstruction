# Ascent Group Construction website: audit summary (read-only)

Nothing in the repository was changed; all output is in `_assessment/`: `01-REPORT.md` (inventory, run results), `02-FINDINGS.md` (50 findings), `03-PAGE-AUDIT.md`, `04-INBOX-READINESS.md`, and `screenshots/` (desktop and mobile).

**Stack.** Vite 5 + React 18 + TypeScript (strict mode off), a single-page app rendered entirely in the browser. React Router 6, Tailwind with shadcn/Radix, TanStack Query, react-helmet-async. There is no server of its own: the browser talks to Supabase ("Lovable Cloud") for Postgres with row-level security, Auth, Storage and 24 Deno edge functions. Email goes through Resend and a second Lovable email stack. Only `bun.lock` exists and it points at a private package mirror, so installs fail outside Lovable (I installed from a scratch copy). Lint: 360 errors. Strict typecheck: 6 errors. Tests: 1 file, passing. Build: succeeds (entry script 1,353 KB, 306 KB gzip).

**Hosting.** Lovable (per the README). The Netlify-style `_redirects` and `_headers` files do nothing there (the file says so), so legacy redirects happen only in JavaScript and the security headers probably don't apply. What the live host returns for unknown URLs is Unknown (`curl -I` would answer).

**How the contact form works.** `/contact` posts to the `submit-form` edge function (honeypot, 2-second gate, rate limit, link filter), which saves to `contact_submissions` with the service role. Then the visitor's browser makes a second call to `send-contact-notification`, which emails `info@` from Resend's shared test sender (`onboarding@resend.dev`) and never checks whether the send succeeded. Database triggers create only in-app notifications. If the tab closes, the call fails, or Resend refuses the sender, the lead is stored and nobody is emailed. The estimate wizard and quote dialog skip `submit-form` and write straight to the database with the public key; one estimate is saved in two tables.

**Findings:** Critical 6, High 13, Medium 23, Low 8. The top ten, in the order I would fix them:

1. **Lead alerts are unreliable** (F-06, F-12, F-13). Shared test sender, browser-triggered second call, send result ignored, and the contact email function can be called by anyone holding the public key. Unknown whether a sending domain is verified.
2. **The site contradicts itself on credentials** (F-02): "WSIB registration in progress" beside "WSIB compliant", "COR-ready" beside "COR certified", bonding "being established".
3. **Sto wording is stronger than the Sto document** (F-03): the linked PDF is a training certificate for six of ten modules; the site says "factory-certified" and "every installation qualifies for the Assured Performance Warranty".
4. **Dead and missing documents** (F-04, F-05): four download buttons on the certifications page do nothing; the vendor packet file is not in the repo.
5. **The footer overrides every page's SEO** (F-01): all pages end with the same title, and non-home pages carry two canonical tags. A scratch build without the two lines fixed it.
6. **A GC has no path built for them** (F-09), and the admin inbox cannot show a bid's scope or open uploaded drawings (F-11).
7. **No phone number or estimate button above the fold on a phone** (F-15); the sticky bar appears after 600 px.
8. **"Reject Analytics" doesn't stop Google Analytics** (F-16), verified in a browser run.
9. **Trust evidence is thin** (F-17, F-18, F-19): "24/7" against Monday to Friday hours, anonymous references on the prequal page, and no case studies in the repo (they sit in a database table whose contents are Unknown).
10. **Search engines see one generic page** (F-07, F-08): client-side rendering, a shared HTML shell, and a sitemap missing the architects, emergency, why-specialty, city and project pages.

Two items the brief expected, a placeholder phone number and a personal webmail address, are not in the code; live settings values are Unknown.

**Inbox recommendation (plan only).** Extend the existing Supabase setup rather than adding a vendor. The admin half already exists: login, roles, an inbox page with status and notes. Add one `inquiries` table with a type (estimate or bid invitation), a bid due time, the drawings link, and a database check that allows only the six statuses. Send every submission through `submit-form`, and send the alert from the server in the same call, recording success or failure on the row. Add a "Bids & estimates" tab sorted by due date with overdue cues. Fix email first: verify the sender domain and use one email stack. Alternative: an external tracker (Airtable or Notion) fed by `submit-form`; faster to stand up, but a second system that can fail silently and holds personal data off-platform. Unknowns to settle first: how migrations reach the live database, the live security policies, and the email domain status. `04-INBOX-READINESS.md` has the files to change, the risks and a ten-step build order.
