# Scripts

Run scripts from the repository root. CI entry points are defined in `.github/workflows/`; optional utilities are grouped below so they are not mistaken for required setup steps.

## Install and routine verification

| Script | Purpose |
| --- | --- |
| `install-ci-dependencies.mjs` | Frozen Bun/Node dependency installation, including package-mirror handling |
| `audit-routes.ts` | Internal links and registered route checks |
| `validate-sw.js` | Service-worker lifecycle and open-tab update safeguards |
| `verify-headers.js` | Hosting header-file validation |
| `smoke-test.sh` | Availability/SPA route smoke checks for the chosen host |
| `generate-sitemap.ts` | Build the local sitemap from published page metadata |

See [development commands](../docs/development/README.md). A host smoke check does not submit inquiry forms or prove authenticated admin/database behavior.

## Public comparisons and monitoring

- `baseline/capture.ts`: anonymous production or local-fixture baseline capture.
- `baseline/compare.ts`: compare against a captured baseline.
- `baseline/self-test.ts`: prove deliberate differences are detected.
- `baseline/bundle-check.ts`: check public-loaded JavaScript against the bundle policy.
- `site-health/crawl.ts`: collect nightly public-page checks; upload only with explicit configuration.

Use the [baseline guide](../_assessment/baseline/README.md) and [Site Health setup checklist](../_assessment/admin-upgrade/PHASE-2-IMPLEMENTATION-STATUS.md). Browser tooling stays outside application dependencies.

## Admin fixture runners

`admin-r1-admin-browser.cjs`, `admin-r1-public-browser.cjs` and `admin-r1-r6-browser.cjs` preserve earlier offline verification procedures. Their fixture contracts may need updating as the application evolves. The corresponding historical evidence is in [the R1 archive](../docs/archive/admin-r1/README.md) and `_assessment/admin-upgrade/r1-r6-evidence/`.

## Optional maintenance tools

- `check-console-errors.js`: browser console scan for a running URL.
- `design-audit.js`, `design-lint.js`: design consistency inspection.
- `audit-service-pages.ts`: service-page source audit.
- `audit-rls-policies.sql`: database policy inspection SQL; separate from migrations.
- `convert-images.js`: local image conversion.
- `auto-fix-imports.js`: import/class migration utility, dry-run by default.

Optional utilities are retained for explicit use; this cleanup does not run their mutations, deploy functions, generate a new sitemap or alter public images.
