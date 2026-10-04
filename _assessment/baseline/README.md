# Public website safety net

Phase 0 compares the published site with a PR production build before later admin phases. The current inventory is **85 canonical content pages plus `/case-studies`, a redirect to `/projects`: 86 URLs, 172 captures**. The master plan's 88-page count is stale. See [inventory.json](inventory.json) and [Phase 0 status](../admin-upgrade/PHASE-0-IMPLEMENTATION-STATUS.md).

## What is captured

At 1440 and 390 px: full-page PNG, visible text, document title, every H1, canonical URL, JSON-LD hash, HTTP status, final path, runtime/console errors and loaded application scripts. Paths are the union of the live sitemap and resolved static public routes; private/admin, utilities and unresolved dynamic patterns are excluded. Missing or duplicate captures fail the gate.

The anonymous crawler identifies itself as `AscentSiteHealth/1.0`. It never logs in, submits forms, clicks action buttons or opens WebSockets. It rejects network mutations, private backend reads, functions, RPCs and signed storage. Public data reads and public images/fonts are recorded for replay. Analytics, maps and geolocation are blocked; the site's error logger ignores this crawler so checks do not write visitor telemetry. Existing map-block console errors are recorded, not mistaken for new site failures.

Candidate checks run against a local production build with **recorded public responses only**. Missing fixtures fail; there is no live backend fallback. Each browser uses the same Date, locale, timezone, seeded randomness, rejected cookie consent and reduced-motion setting. CSS animations stop, periodic callbacks are suppressed, videos pause, lazy sections are revealed and all image elements load and decode synchronously before a second scroll paints them. This stabilizes screenshots; it does not verify autoplay, real-time changes, form submissions, authenticated admin behavior or the normal-motion animation experience. Those require their own isolated tests.

## Running the checks

Install application dependencies using `node scripts/install-ci-dependencies.mjs`. CI installs pinned Playwright outside the application's dependencies with `.github/actions/baseline-tools/action.yml`. For local use, provide `BASELINE_PLAYWRIGHT` as the installed Playwright module path and, if needed, `CHROMIUM_PATH` and `BASELINE_PROXY`. These tools add no application packages or lockfile changes.

Read-only production capture, after the owner confirms which commit is published:

```bash
node --import tsx scripts/baseline/capture.ts --mode=production --out=/tmp/public-baseline --published-sha=<published-commit>
```

Build with source provenance for the bundle check. Serve this build on port 4176, then replay and compare:

```bash
npm run build -- --sourcemap --manifest
node node_modules/vite/bin/vite.js preview --host 127.0.0.1 --port 4176
# In another terminal:
node --import tsx scripts/baseline/capture.ts --mode=replay --baseline=/tmp/public-baseline --out=/tmp/public-candidate
node --import tsx scripts/baseline/compare.ts /tmp/public-baseline /tmp/public-candidate /tmp/public-comparison _assessment/baseline/intentional-changes.json
node --import tsx scripts/baseline/bundle-check.ts dist /tmp/public-candidate /tmp/bundle-results.json
node --import tsx scripts/baseline/self-test.ts /tmp/public-baseline /tmp/comparison-proof
```

The comparison requires exact text/SEO/schema and at most **0.1% changed pixels per capture**, including alpha. Image dimensions must match. New runtime/console errors cannot be waived. The bundle gate checks source maps for Tiptap, Recharts, Visx and Chart.js in every application chunk loaded during the public crawl. Normal production builds still have source maps disabled; the gate's mapped build is not published.

## Intentional changes

`intentional-changes.json` is empty for Phase 0. A later PR must explicitly declare each changed page, its reason and the fields allowed to differ, and include before/after evidence. Example:

```json
[
  { "path": "/faq", "reason": "Owner-approved FAQ correction", "fields": ["visibleText", "screenshot", "jsonLdHash"] }
]
```

Do not carry unrelated declarations into later PRs. HTTP or runtime failures cannot be allowed through a declaration. New URLs, changed data queries or assets without recorded fixtures require an owner-reviewed baseline update; do not remove pages or relax the gate to make it green.

## GitHub operation

- `Public comparison and bundle gates` runs on PRs changing public source/assets, Vite configuration or the gate itself. Admin-only changes skip the crawl unless a shared/public file changes.
- Only the first PR introducing Phase 0 may bootstrap a read-only production baseline. Future PRs require a successful manual `Capture approved production baseline` run **on main**. They use the latest unexpired artifact or the run selected by the optional repository variable `PUBLIC_BASELINE_RUN_ID`.
- After merging and publishing an approved change, open **Actions → Capture approved production baseline → Run workflow**, choose **main**, and enter the published Git commit. Inspect the summary/screenshots before treating it as the next accepted baseline. A pinned run makes the chosen baseline explicit.
- Baseline artifacts (`public-baseline`) retain snapshots and public-response fixtures for 90 days. Candidate artifacts (`public-safety-results`) retain comparisons, candidate captures, bundle report and preview log for 14 days. Expired/missing baselines fail closed. These are private repository artifacts; large image fixtures are not committed to Git.
- HTTP 403 from production stops capture and reports blocking. Do not bypass hosting controls. Ask Lovable whether it supports this user agent/GitHub Actions IP ranges; keep any affected PR blocked until the capture can run normally.

Workflow checks do not enforce themselves through branch protection. The owner should require the `compare` check if it must prevent merging; Codex has not changed repository rules. Owner publishing and acceptance remain separate from PR creation.

## Rollback

Revert the Phase 0 PR to remove its workflows/tooling and restore the previous Vite chunk configuration and error logger. No database/schema rollback is needed. If a later baseline is wrong, pin a previously accepted successful manual run while its artifact is retained, or capture the correctly restored published version. Never replace the baseline silently inside a PR.
