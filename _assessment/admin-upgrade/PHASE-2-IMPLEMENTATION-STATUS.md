# Phase 2 — Site Health

This phase builds nightly visitor checks and the admin workspace. The verified inventory is **85 canonical content pages plus `/case-studies`**, currently **86 URLs / 172 desktop-and-phone checks**. New sitemap URLs are added; known baseline URLs are retained so a sitemap omission cannot silently remove coverage.

## Delivered

- `Nightly Site Health`: 07:00 UTC, plus manual dispatch. Scheduling starts only after `SITE_HEALTH_ENABLED=true` is configured. A manual artifact-only run needs no ingest secret. Reports are retained for 90 days.
- Anonymous crawler: rejected consent, `AscentSiteHealth/1.0`, service workers/WebSockets blocked, only public content reads allowed. It never signs in or submits forms. Analytics, maps, geolocation, private tables, RPCs, functions and mutations are blocked in its browser.
- Checks: page/load errors, resources/images, titles, H1, canonical, descriptions, duplicate titles, alt attributes, image size when Content-Length is reported, phone overflow and runner navigation timing. Internal destinations in the inventory are checked against rendered results. Other links have bounded, read-only HEAD probes with no redirects; inconclusive destinations are labelled for review. Claim words are informational review flags, never judgments about credentials.
- Dedicated token-authenticated `ingest-site-health` validates bounded reports and stores completed, partial and blocked runs. It accepts results only for the fixed production origin. A duplicate run cannot insert a second set of results. Incomplete writes remain visible as aborted/running rather than healthy.
- Separate `health-ping`: read-only database reachability, available only to an admin JWT or the ingest token. No lead-path function changed.
- Existing `/admin/monitoring` becomes **Site Health**, retaining its real error/performance views. Added history, grouped findings, new-since-previous-night labels, per-page checks, Fixed/Ignore decisions with reasons and grouped visitor errors. Fixed findings stay visible if still detected; ignored decisions can be cleared.
- Dashboard summary uses measured run totals and explicitly reports setup, unavailable, blocked and partial states. Missing schema switches the feature off safely; permission failures remain visible.
- Seven **distinct complete nightly dates** are required before alerts are eligible. Manual, blocked and aborted runs do not count. Alerts also require an explicit server setting and configured recipients. New serious findings can email; Mondays can send a health-only digest. Existing lead and credential data are not included. Email retries use provider idempotency keys; delivery failures preserve the saved crawl and fail ingestion delivery status. Per-recipient delivery history belongs to the later lead-alert phase and is not invented here.

## SQL and deployment

`supabase/migrations/20261004050716_site_control_and_health.sql` contains the supplied reviewed `0003` v2 executable SQL unchanged. Only its commented rollback block is retained in the reference/PR rather than the migration. **Nothing has been applied or deployed.** The existing public site does not read these new content tables or flags in this phase.

### Owner setup, in order

1. Back up in Lovable Cloud. Review and have Lovable apply the supplied `0003` v2 migration. Run the verification queries in `_assessment/admin-upgrade/sql/0003_site_control_and_health.sql`; confirm `content_overrides=false`, `content_overrides_admin_only=true`, and anonymous draft reads are denied. Do not enable content overrides.
2. Generate a token locally with `openssl rand -hex 32`. Add the same value as **SITE_HEALTH_INGEST_TOKEN** in Lovable Cloud function secrets and GitHub → Settings → Secrets and variables → Actions → Repository secrets. Never paste it into chat or commit it. GitHub never receives the service-role key.
3. Have Lovable deploy **ingest-site-health** and **health-ping**, using their checked-in function configuration (`verify_jwt=false`; authentication is inside each function). Confirm the deployment bundles the shared contract at `src/lib/admin/site-health/contract.ts`; the per-function `deno.json` pins its Zod/Supabase imports. Existing functions remain unchanged.
4. Keep **SITE_HEALTH_ALERTS_ENABLED=false** in Lovable Cloud. Leave alerts off for at least seven complete nightly dates. For later activation only: configure `SITE_HEALTH_ALERT_RECIPIENTS` as comma-separated owner-approved addresses (maximum five), and verify the existing Lovable sender/API configuration. Its scaffold sender domains are used; their live verification has not been independently confirmed.
5. Merge this PR, then Lovable **Publish → Update**. Merging alone does not publish. Open the admin in a private window; Site Health should show “No nightly checks recorded yet,” rather than a fabricated green status. Check the dashboard and phone layout. Public content and lead forms should remain unchanged.
6. GitHub → Actions → **Nightly Site Health** → Run workflow on **main**, with **upload=true**. This is a monitoring run, not a form test. Check its report artifact and the Site Health history; use **Check database** to confirm the separate endpoint.
7. After setup works, set GitHub Actions repository variable **SITE_HEALTH_ENABLED=true**. This enables the nightly 07:00 UTC schedule. Review seven nightly results and tune ignored issues with reasons. Then, only if you want alerts and the sender is verified, set the Lovable secret **SITE_HEALTH_ALERTS_ENABLED=true**. The server still enforces the seven-night requirement.

The “Run check in GitHub” link opens the actual workflow page; it does not embed a GitHub PAT in the browser or claim a run was dispatched automatically.

## Limits and verification

The lengthy Phase 0 GitHub replay was cancelled at the owner's explicit request. Its independent full cloud comparison passed 172 captures with zero changed pixels, and the approved main production baseline passed. This Phase 2 changes no public route files and makes no intentional public presentation change. It does not repeat the all-pages replay.

Compiler/build/quick-check results are recorded in the PR. Live function/database behaviour and the seven-night pilot require the owner setup above and have not been claimed as tested. No live writes, forms, emails, migrations, function deployments or secret changes were performed by Codex.

Inspection timing is a runner measurement, not a Core Web Vitals score. Probes do not follow redirects or inspect unknown destinations' rendered views; those are labelled inconclusive. At most 100 unique extra destinations and 100 findings per viewport are retained. Missing size metadata and content age are not fabricated. Vault-backed claim verification awaits Phase 9. The visitor panel groups the latest 500 recorded entries in 24 hours, not unique visitors.

## Rollback

Set GitHub `SITE_HEALTH_ENABLED=false` and Lovable `SITE_HEALTH_ALERTS_ENABLED=false`. Revert the frontend PR and publish to restore Monitoring. The new schema may remain unused safely. If the owner needs a database rollback, export the new tables first and use the reviewed rollback in the supplied `0003` reference; that also removes future content tables and must not be run casually after those features hold data. Do not change or roll back lead tables/functions for this phase.
