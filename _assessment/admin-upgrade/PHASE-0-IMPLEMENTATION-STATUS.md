# Phase 0: public website safety net

Scope: the latest [master plan](00-ADMIN-MASTER-PLAN.md), Phase 0 only, following the owner's confirmation that PR #46 / R1 was published and checked in a private window. Files 12–16 are reference material; the master plan takes precedence. All ten uploaded plan/SQL files are archived in this folder or `sql/`; identical existing files did not need a Git diff.

## Delivered

- Root `AGENTS.md` provides the short entry point, protected public scope, phase order and required checks.
- [R1 coverage reconciliation](R1-PUBLIC-COVERAGE-REVIEW.md) lists every one of the 56 R1 files outside the three admin directories. Contact and PhoneLink are covered. Ten captures meant five distinct pages at two widths, not ten distinct pages.
- A manual, anonymous production baseline workflow, public comparison workflow and admin-library bundle gate. Their operator instructions, limitations, artifacts and rollback are in [the baseline README](../baseline/README.md).
- The live sitemap plus the public route registry yields **85 content pages and one redirect: 86 URLs, 172 captures**. The plan's 88-page count is stale. Nothing was removed to reduce the count.
- Tests prove that equal captures pass, deliberate text/image changes fail, and Tiptap/chart code in a loaded public chunk fails the bundle check.

Two application/build changes support the guard:

1. `errorLogger.ts` skips database telemetry/interceptors for the crawler's user agent. Ordinary visitor logging retains its behavior. Network policy also blocks mutations before they leave the crawler browser.
2. Vite's manual vendor buckets pulled shared React helpers into the charts chunk, causing Recharts to load publicly. Removing those buckets lets the normal import graph preserve lazy admin chunks. The mapped build is for inspection only; ordinary production source maps remain disabled.

No page copy, credential wording, navigation, contact constants, public hero/video components or database schema changed. `intentional-changes.json` is empty. SQL remains unapplied reference material. No forms, real admin saves, emails, storage writes, deployments or publishing occurred.

## Verification

- Full Vitest: **444 tests / 67 files passed**.
- Selected and full app TypeScript: passed.
- Production build, route audit, service-worker validation and HTTP smoke checks: passed. The optional edge-function reachability check was skipped; it is not needed for this offline candidate verification.
- Lint: **279 errors / 32 warnings**, below the established ceiling; new files are clean. The existing lint debt is not claimed as a passing zero-error check.
- Admin fixture checks after chunk changes: **17 editor/admin scenarios plus 13 dashboard/Leads scenarios passed**, no runtime exceptions; dashboard and Leads fit 390 px. All writes in these scenarios were mocked.
- Public comparison acceptance requires a successful GitHub `compare` check across all **172 captures**, with its baseline/candidate/comparison artifacts. Locally the refined harness passed the ten focused desktop/phone captures of Home, Projects and the three affected project galleries, with **zero changed pixels**, exact text/SEO/schema and no runtime exceptions. GitHub runs the same final harness over the whole inventory; the PR description records its result.

The initial all-page comparisons correctly failed seven, then six captures because lazy gallery images and a timed homepage statistic were not stable between runs. Playwright's clock helper restored interval timers, and image downloads could finish before decoding/painting. The final harness fixes Date alone, suppresses interval callbacks, synchronously decodes eager images and scrolls them into view again before capture. This is test-browser behavior only, not an application change, and no threshold or declaration was relaxed. The operator summary and required coverage are in `../baseline/summary.json`; full authoritative PNGs and reports are GitHub artifacts rather than large committed binaries.

## Existing public defects discovered

These are recorded separately from Phase 0's preservation work:

- **R1 follow-up: Certifications & Insurance query.** `CertificationsInsurance.tsx` asks for `licenses,memberships,certifications` on `about_page_settings`. Production returns `42703: column about_page_settings.certifications does not exist`; generated schema types also lack that column. The page uses its fallback. R1's fixture accepted the fictional column and missed this defect. Fix the projection in a separate small repair PR, verify the actual returned fields, and compare the credential page without inventing or changing company claims.
- `/company/technology` logs SVG circle coordinates of `undefined`. This is an existing issue for a later repair.
- The crawler intentionally blocks embedded maps. Those resulting 403 console messages are expected capture artifacts, not production availability failures. Production itself was reachable during the cloud capture.

Existing errors are recorded; new runtime/console errors fail comparisons. This baseline is a preservation reference, not a claim that every existing public feature is defect-free.

## Owner handoff

Review the PR and artifacts, then merge and publish using Lovable when ready. Inspect the published site in a private window at desktop and phone widths. Once the approved version is published, run **Actions → Capture approved production baseline** on **main** with its published commit. Future public PRs require that manual main-branch artifact; only this first Phase 0 PR can bootstrap it. Optionally pin its run with `PUBLIC_BASELINE_RUN_ID` and require the `compare` check in branch protection.

The outstanding read-only Lovable questions, second-super-admin and external-uptime steps are recorded in [environment facts](ENVIRONMENT-FACTS.md). No dependent migration or secret/role change is authorized here. Phase 2/nightly checks have not started.
