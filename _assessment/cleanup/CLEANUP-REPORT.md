# Cleanup report

## Phase 0 — baseline and safety net

Date: 3 October 2026, America/New_York. Source commit: `d504e40ed1815579fa06bf4c786b85dc19bfbcb5` (merged PR #41). Branch: `cleanup/phase-0`.

The owner's uploaded prompt specifies `PHASE = 0`. This work records the current repository and creates the local browser safety net before any cleanup. It does not perform Phase 1 or any later phase.

### Added

- [Baseline](BASELINE.md): build sizes, file/dependency counts, tool versions, quality results and corrections to stale assessment claims.
- [Playwright script](smoke/smoke.mjs), [126 route observations](smoke/baseline.json), and 18 desktop/mobile screenshots. External requests and every write method are blocked.
- [Raw import-graph output](raw/knip.json), separated candidate lists, lint/strict diagnostics and check logs. The graph reports 175 file candidates, 219 value-export candidates and 27 dependency candidates; none was acted on.
- [Measurement collector](raw/collect-baseline.mjs), [reproduction instructions](README.md), [quarantine notes](QUARANTINE.md) and [deletion ledger](DELETIONS.md).
- [Archived Phase 0 request](PHASE-0-REQUEST.md), retained for the phase boundaries and protected areas.

### Before and after

| Item | Before | After |
| --- | --- | --- |
| Application / public asset bytes | Baseline commit | Identical |
| Entry JS / gzip | 1,382,075 / 306,363 bytes | Identical |
| `dist/` files / bytes | 269 / 22,000,466 | Identical |
| Runtime / dev dependency declarations | 69 / 25 | Identical |
| Deleted / modified existing files | 0 / 0 | 0 / 0 |
| New repository content | — | Evidence under `_assessment/cleanup/` only |

Build, selected strict typecheck, all 305 tests and service-worker validation pass. The normal app typecheck also passes. Existing baseline failures are 288 lint errors / 34 warnings and 49 full strict app errors; this evidence-only phase does not fix them. The new JavaScript helpers pass syntax and targeted ESLint checks.

Route collection records 117 desktop URLs and nine mobile pages. A second independent run matches all 126 comparison observations exactly. All return local HTTP 200 with no failed network requests/responses, writes or unexpected render failures. Technology and its redirect each retain 14 SVG console errors. OAuth consent without a request ID retains its expected error message; login, unsubscribe and OAuth retain their existing metadata/heading exceptions. The Developers canonical derives from the current host. Details and limitations are in [BASELINE.md](BASELINE.md).

### Boundaries preserved

No changes to hero/video logic, navigation, design tokens, credentials wording, admin authorization, manifests/locks, environment files, platform files, workflows, migrations or assets. No deployment, publishing, database access/writes, production endpoint requests, submitted forms or authenticated account access. Analysis packages were installed only outside the repository.

No quality check was unavailable. Browser checks use local synthetic fixtures and cannot establish the live database, admin account, email or published-host behavior. No deletion evidence test was attempted because no deletion is authorized in Phase 0.

### Next phase

Stop after this PR. Phase 1 requires a new task/branch. Re-check current code rather than replaying historical fixes: CI installation and several defect candidates are already addressed. Phase 2a must present the evidence for each proposed deletion; Phase 2b requires the owner's written approved path list. Images and the two referenced hero-video copies remain protected.
