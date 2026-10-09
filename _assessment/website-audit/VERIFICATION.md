# Verification and coverage

> This document records the original pre-merge verification against `49b719f`. For the subsequent update with main `e743d6a` and PR #61 conflict resolution, see [the merge verification](PR61-CONFLICT-RESOLUTION.md).

Baseline: freshly fetched main `49b719f`. Candidate: `seo/audit-verified-fixes`. All application checks use the exact frozen lock graph. Production builds use synthetic public Supabase bindings; all browser backend requests are intercepted with offline fixtures.

| Check | Result |
| --- | --- |
| Frozen dependency install | Passed; tracked package and lock unchanged |
| Full Vitest | 626 tests in 95 files passed; 24 new regression tests |
| Focused routing/404/sitemap/city tests | 24 tests in 4 files passed |
| Asset provenance regression tests | 7 passed |
| Full app TypeScript | Passed |
| Selected strict TypeScript | Passed |
| Production build with source maps | Passed |
| Service-worker validation | Passed |
| Route integrity audit | Passed |
| Changed source/test/tool lint | 0 errors, 0 warnings |
| Whole repository lint | 210 existing errors / 29 warnings, within 288 / 34 ceiling; whole lint is not a clean run |
| Whitespace/diff check | Passed |
| Extra browser routing checks | 7 passed: desktop/mobile EIFS alias, missing page recovery/noindex, three initial HTML responses |
| Source route-date extraction | 38 static content routes; zero missing source files; zero redirect components included |
| Public CSS | All 5 stylesheet files are byte-identical to pristine main |
| Public bundle gate | Passed across 85 routes and 159 loaded chunks; one verified data-only asset-metadata module |
| Full public comparison | 170 of 170 passed across 85 routes; no declarations/waivers; [evidence](evidence/public-comparison.json) |

Every one of the 85 checked-in sitemap URLs is captured at 1440px and 390px in both pristine and candidate production builds: 170 snapshots per build. Snapshot comparison covers text, titles, H1s, canonical URLs, normalized JSON-LD, route/status, runtime diagnostics and screenshots. No public design/text/metadata change is waived in the comparison; the JavaScript-disabled fallback changes are separately checked against actual initial HTML.

Capture uses reduced motion, stable time/randomness, completed image decoding and offline data. Initial scrolling/suppression timing left some reveal sections blank; affected captures were repeated after completing keyframes and, where needed, scrolling each reveal container into view and asserting computed opacity before capture. A final compositor-only mismatch was repeated with Chromium's normal graphics path and natural reduced-motion styles. None of these capture corrections changes application CSS; all five production stylesheets match pristine main byte-for-byte. The pristine city pages could not settle to network idle because of their repeated project reads, so comparison waits for DOM/content/image readiness rather than using network idle as a universal pass condition. This is fixture regression evidence, not a production performance measurement.

All 34 candidate city captures make exactly one project request. Pristine captures make dozens of requests because of the source-confirmed effect loop. No page errors or horizontal overflow were observed in either completed capture set.

## Limits and remaining work

- Chromium desktop/mobile simulation only; no Safari or Firefox claim.
- Synthetic CMS/auth-free public fixtures; no live project, testimonial, credential or form data used.
- No production domain/edge/crawler verification in this environment. The local initial HTML still demonstrates the shared shell and HTTP 200 for a made-up URL; these remain documented hosting issues.
- No form was filled or submitted and no authenticated production admin/storage action occurred. Conversion, database policy and email-delivery verification require their isolated environments/account access.
- Automated comparison does not replace Claude's qualitative visual/design or accessibility review. A source ZIP is prepared separately for that review; it excludes environment files, credentials, Git history and production CMS data.
- Existing build chunk/annotation warnings and React/jsdom diagnostics remain. All listed functional checks pass after resolving test fixture/typing issues.

Release is owner **Lovable → Publish → Update** after review/merge. No migration, function deployment or data write is included. Reverting the patch and publishing restores prior frontend behavior.
