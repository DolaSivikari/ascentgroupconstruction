# Unused file cleanup — 2026-10-05

Base: `5c79160bd66f6afc532360a6e411d5a3db7d64d0` (origin/main).

## Result and proof

Remove seven unreachable source modules and the documented accidental root shell artifact `0===`: 8 files, 18,755 bytes and 470 source lines. The JSON ledger records each original SHA-256 for recovery and review. Knip found 188 unreachable source candidates using the existing cleanup configuration after the frozen dependency install. Each selected module also has no filename/stem references in other tracked text. Historical cleanup inventories were excluded because they list candidates rather than consume them. Other documentation, scripts, configuration, source, workflows and function references were included. 181 uncertain candidates remain.

No public behavior or design change is intended. Assets with wildcard loading or possible database references, archived evidence, migrations, functions, uploaded media and historical logs remain. No package, lockfile, environment, authentication, role, database, storage or publication change is included.

## Validation

- Production builds pass before and after. All 220 emitted JavaScript chunks match as a multiset after replacing eight-character asset hashes in import filenames; no executable code was removed from the live module graph.
- The main generated CSS shrinks from 187,088 to 186,540 bytes. Removed selectors are `tracking-[0.14em]`, `group-hover:translate-x-0.5` and `md:mb-10`, all absent from retained application source. Equivalent remaining hover selectors are combined by minification. Asset-name changes propagate through imports; this is not a byte-identical build claim.
- Selected and full application TypeScript pass.
- Service-worker validation and internal route audit pass.
- Lint: 266 errors / 34 warnings, within the existing ceiling of 288 / 34. No new application source files.
- Full Vitest: 84 files pass / 3 fail; 548 tests pass / 13 fail (561 total). Re-running the three failing files after restoring the original source reproduces all 13 failures with 4 passing tests. Failures are in Estimate, Dashboard and LeadsWorkspace; this cleanup does not repair them.
- `git diff --check` passes.

## Coverage limits

The historical full-route browser harness has an unhandled new credential-package parameter. A first expanded scratch run was interrupted after its preview rebuilt mid-run, so it is invalid comparison evidence and is not counted as a passing check. Focused public comparison results are recorded separately below. Full archived production response replay and the original manifest-based bundle gate were not run because the required response-fixture baseline is unavailable; the direct emitted-JavaScript comparison above provides narrower module-graph evidence. No performance or production-publication result is claimed.

## Recovery

Revert the cleanup commit to restore all original files. Do not reset production or delete storage records. This branch is for review and must not be merged or published automatically.

## Focused public comparison

Nine routes at desktop and mobile (18 observations / 18 screenshots per build): every route returned HTTP 200. Compared title, H1, canonical, resolved route, visible text hash, utility/error views and browser failure counts. Observation differences: 3. Screenshot byte differences: 2. Both builds have two failures on Projects because the fixture harness blocks automatic error-log writes with HTTP 403. No external requests were forwarded. These are comparison evidence, not an all-green smoke claim. The accompanying JSON records the summaries.
