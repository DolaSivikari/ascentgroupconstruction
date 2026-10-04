# P4a: dashboard over existing intake tables

Implemented from section 2.4 and the P4a instructions in the owner's revised
`12-ADMIN-UPGRADE-CODEX-PROMPT.md`. PR #43 and PR #44 were already merged.

## Behavior

- Today counts every new lead record from Contacts, RFPs, Quotes and
  Prequalifications. Null status is treated as New, consistently with Leads.
  Unopened and Needs action both use New status in this phase; simply opening a
  legacy request cannot mark it viewed.
- Status and source cards open matching Leads filters. The new `status` and
  `lead_source` URL parameters are validated independently of the existing
  `source` parameter used to locate a detail record. Source filters run on the
  server and preserve cursor paging.
- Pipeline counts cover all current statuses across these four sources. They
  read only IDs and statuses, page by ID, and use exact count headers to detect
  a REST response cap. A failed or incomplete source makes affected totals
  Unavailable; healthy source cards remain visible.
- Recent activity shows the latest ten received lead requests, with correct
  estimate labels and Toronto times. Complete details and editing remain in
  the existing Leads workspace.
- Content tiles use one combined query function with a five-minute stale time.
  A failed content count does not hide the remaining tiles.
- Dashboard subscriptions specify the four active lead tables. The broad
  all-public-tables subscription and the dashboard's per-query 60-second polling
  are removed. Refresh, window focus and lead events update request data.

For sources with no more than 1,000 rows, the request-data loader makes twelve
reads (four new-count queries, four status pages, four activity queries).
Content makes nine separate head/count reads, cached together. Larger sources
require additional status pages; this phase does not claim one database call.
Authentication, sidebar and notification queries are separate from these counts.

## Deliberately unavailable

Existing intake tables cannot supply bid closing times, assignments, linked
alert-delivery outcomes, reliable closing dates, submitted bid amounts or actor
history. Their cards show Unavailable with an explanation. No project start date
or requested deadline is treated as a bid closing time; no win rate is invented.
These unavailable cards have no misleading filter links.

The future `admin_inquiry_summary` wrapper is disabled by default and unused by
P4a. Explicit opt-in is reserved for P4b. Its capability check treats a missing
function as not yet available and preserves permission errors as failures.

Legacy forms and all inbox tabs stay active. Resumes and newsletters remain
under their existing tabs and in the sidebar's communication count; they are not
included in Leads totals. Existing Contact/Quote duplicates are retained.
PR #44 had already redirected the former estimates route; P4a preserves that
merged behavior rather than changing routing again.

## Verification

- Full Vitest suite: **360 tests / 47 files passed**.
- `bun run typecheck:selected` and full application `tsc --noEmit`: passed.
- `bun run build`, `bun run validate:sw`, and `bun scripts/audit-routes.ts`: passed.
- Repository-wide lint: **288 errors / 34 warnings**, matching the baseline.
  All changed and new files are lint-clean. `git diff --check` passed.
- Production-build Chromium: **13 scenarios passed**, zero runtime exceptions,
  and no horizontal overflow at 390px, including partial failure. Checks cover
  exact card filters, source paging, full details, cache reuse, source/content
  recovery and non-admin denial.
- Browser backend responses were synthetic, with external backend traffic
  blocked. No live leads were read or changed; no email was sent.

## Owner steps

Review and merge this P4a PR, check Dashboard and its card links in Lovable
preview, then use **Lovable Publish → Update**. Merging does not publish.
P4a requires no migration, function deployment, setting or secret change. The
attached draft SQL and preflight have not been run or copied into migrations.
P5, P1 and subsequent phases remain separate work.
