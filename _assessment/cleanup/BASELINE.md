# Phase 0 baseline — 3 October 2026

Baseline source: `d504e40ed1815579fa06bf4c786b85dc19bfbcb5`, current `main` after PR #41. Branch: `cleanup/phase-0`. This PR adds evidence only. Application files, dependencies, assets, configuration and database schema are unchanged.

## Environment and installation

| Tool | Version |
| --- | --- |
| Node / npm | 24.19.0 / 11.9.0 |
| Bun | 1.3.11 |
| Vite / TypeScript / Vitest | 5.4.21 / 5.9.3 / 4.1.11 |
| Playwright / Knip (temporary tools outside the repository) | 1.63.0 / 6.39.0 |
| Chromium | 151.0.7922.173, Debian 13 |

Checks ran in `/workspace/cleanup-phase0-scratch`, made from the baseline commit using `git archive`, excluding `.env` and `.env.*`. The existing `scripts/install-ci-dependencies.mjs` installed 985 packages successfully. It changes the private mirror **URL prefix in a temporary lockfile**, preserves versions and integrity hashes, installs with `--frozen-lockfile`, and checks that the temporary lockfile was not regenerated. Repository lockfiles and manifests were untouched.

The production-mode scratch build uses a synthetic `.invalid` Supabase host and dummy public bindings. No environment files, real credentials, live database content or private inquiry records were copied into the evidence. Consequently bundle measurements are for this reproducible offline build, not a download of the published website.

## Quality checks

| Check | Result | Evidence |
| --- | --- | --- |
| `bun run build` | PASS, 22.66 seconds | [Build output](raw/build.log.txt) |
| `bun run typecheck:selected` | PASS, zero errors | [Selected strict check](raw/selected-types.log.txt) |
| `bun x vitest run` | PASS, 305 tests in 41 files | [Test output](raw/tests.log.txt) |
| `bun run validate:sw` | PASS | [Service-worker validation](raw/service-worker.log.txt) |
| `tsc -p tsconfig.app.json --noEmit` | PASS, zero errors | [Normal app check](raw/app-types.log.txt); successful command has no output |
| `bun run lint` | Existing failure: 288 errors, 34 warnings | [Output](raw/lint.log.txt), [diagnostics](raw/lint-diagnostics.json) |
| `tsc -p tsconfig.app.json --strict --noImplicitAny --noEmit` | Existing failure: 49 errors in 31 files | [Full strict output](raw/full-strict-all-types.log.txt) |
| Playwright offline route collection | PASS; 126 observations, zero unexpected render/network/write failures | [Baseline JSON](smoke/baseline.json) |

The full strict command explicitly overrides `noImplicitAny: false`; `--strict` by itself leaves that explicit option disabled and reports 48 errors. The normal app check, selected strict check and full strict diagnostic pass are distinct measurements. No TypeScript configuration was edited. ESLint's JSON formatter was also run to aggregate the same 288 errors / 34 warnings.

Vite reports pre-existing large-chunk warnings and outdated Browserslist data. Vitest reports existing configuration warnings and jsdom navigation warnings; all tests pass. This phase does not resolve existing lint, strict typing or build warnings.

### Lint totals by rule

| Rule | Errors | Warnings |
| --- | ---: | ---: |
| `@typescript-eslint/no-explicit-any` | 256 | 0 |
| `no-restricted-imports` | 13 | 0 |
| `no-var` | 8 | 0 |
| `no-empty` | 3 | 0 |
| `@typescript-eslint/ban-ts-comment` | 3 | 0 |
| `@typescript-eslint/no-empty-object-type` | 2 | 0 |
| `prefer-const` | 2 | 0 |
| `no-case-declarations` | 1 | 0 |
| `react-hooks/exhaustive-deps` | 0 | 22 |
| `react-refresh/only-export-components` | 0 | 12 |
| **Total** | **288** | **34** |

## Sizes and counts

Sizes below are bytes on disk; directory totals exclude symlinks. The TypeScript repository count excludes dependency directories, build output and archived assessments. Image extensions counted: PNG, JPG/JPEG, WebP, AVIF, GIF, SVG, ICO and BMP. Video files and fonts are separate from images.

| Measurement | Baseline | After this evidence-only PR |
| --- | ---: | ---: |
| Entry JS, `/assets/index-7stgXnhG.js` | 1,382,075 bytes | Unchanged |
| Entry JS gzip, Node zlib default level 6 | 306,363 bytes | Unchanged |
| `dist/` | 269 files / 22,000,466 bytes | Unchanged |
| `src/` | 710 files / 18,649,251 bytes | Unchanged |
| `public/` | 34 files / 3,130,610 bytes | Unchanged |
| Images in `src/` + `public/` | 95 files / 15,940,509 bytes | Unchanged |
| Videos in `src/` + `public/` | 2 files / 1,157,104 bytes | Unchanged |
| `.ts` / `.tsx` in `src/` | 187 / 430, total 617 | Unchanged |
| `.ts` / `.tsx` across repository code and tooling | 658 | Unchanged |
| Declared runtime / dev dependencies | 69 / 25, total 94 | Unchanged |
| Deleted files | 0 | 0 |

The [machine-readable inventory](raw/metrics.json) includes each source/public/build file's size, full strict diagnostic totals by code and file, and the entry bundle's SHA-256. Vite's display rounds the entry to 1,382.04 kB / 306.36 kB gzip; the table uses the emitted file's actual bytes. Application/source and public assets were compared with the scratch copy byte for byte: no differences. The evidence folder itself is additional repository storage, including the 18 requested PNGs.

Final gates were repeated with the evidence folder present in the scratch copy: build, selected typing, service-worker validation and all 305 tests pass; lint remains 288 / 34 with zero helper diagnostics. The rebuilt entry hash and every build/source/public size inventory match the initial measurements exactly. See [verification.json](raw/verification.json) and the `raw/final-*.log.txt` outputs.

## Route coverage and screenshots

[smoke.mjs](smoke/smoke.mjs) extracts **50 static public route declarations and five dynamic patterns** from `AppRoutes.tsx`, excluding authenticated admin routes and the DEV-only token preview. It expands all 33 service redirect entries, all 22 registry services, all 17 city routes and an unknown-path control. After deduplication this gives **117 desktop URLs**. Nine required mobile observations bring the total to **126**. These are tested URLs, including aliases and utilities, not a revised count of public content pages.

Every observation records requested/resolved path, local HTTP status, title, canonical count and targets, first H1 and H1 count, console errors, failed requests/responses, unavailable/not-found/error views, and a SHA-256 of rendered visible text. Desktop viewport is 1440×900; mobile is 390×844. The 18 full-page screenshots cover:

- `/`, `/services`, `/contact`, `/estimate`, `/submit-rfp`, `/projects`
- `/services/painting-services`, `/service-areas/toronto`, `/privacy`

See the [screenshot manifest](smoke/baseline.json) and [image folder](smoke/baseline/).

### Recorded existing exceptions

- `/company/technology` and its `/company/equipment-resources` redirect each render successfully but log **14 SVG coordinate errors** (`circle` `cx`/`cy` is initially `undefined`). Source: `src/pages/company/technology/sections/ConstellationSection.tsx:73`. These diagnostics remain in the baseline and its comparison contract; they were not repaired.
- `/unsubscribe`, `/tekev` and `/.lovable/oauth/consent` have zero canonical tags. Login and OAuth have no H1. These utility-page observations are retained without adding metadata or headings.
- `/company/developers` supplies the relative canonical `/company/developers` (`src/pages/company/Developers.tsx:100`). The browser resolves it against loopback rather than `SITE_URL`. This host-dependent source behavior is preserved; the baseline does not establish the canonical served by the published host.
- OAuth consent without an `authorization_id` deliberately shows “Something went wrong” and the missing-reference message (`src/pages/OAuthConsent.tsx:48`). This expected utility state is distinguished from an application error boundary.
- `/404` and the unknown-path control deliberately show the not-found view. The local SPA server returns HTTP 200 for them; this is not evidence of the live host's HTTP status.

All 126 navigations return local HTTP 200. There are zero failed network requests, failed HTTP responses, attempted writes, unexpected not-found/content-unavailable views, or unexpected application error views. Other than the Technology observations, there are no console errors.

A second independent run with `--compare` reproduced all 126 route observations exactly for the comparison fields, including visible-text hashes and console error counts. It wrote its JSON and screenshots outside the repository and preserved the committed baseline. See the [collection log](raw/smoke.log.txt) and [comparison log](raw/smoke-comparison.log.txt).

### Scope and limits of browser evidence

All external HTTP requests are intercepted and fulfilled locally. External WebSockets are closed before connecting. Browser DNS is restricted to loopback, the Supabase build host is `.invalid`, service workers are blocked, and all non-read HTTP methods are rejected. **Zero external requests are forwarded; no forms are submitted.** Analytics consent is rejected. Read fixtures consist of public service labels from the registry, one clearly named synthetic project/article, empty optional collections, and built-in settings fallbacks.

Screenshots therefore show the source-controlled design and fallback state with synthetic content, not the current live CMS records. Maps are blank local placeholders. Reduced motion is enabled and the date is fixed to 3 October 2026 for repeatability; hero video playback is not validated by these screenshots. Authenticated admin behavior, live RLS, storage permissions, emails, deployed edge functions, Google Analytics delivery and live host headers are outside this phase. Service-worker code is validated statically by the existing checker; browser lifecycle behavior is not exercised.

## Import-graph output

Knip completed in the scratch copy with [this configuration](raw/knip.config.json). Application entry, all edge-function entrypoints, scripts and Drizzle config were treated as roots; Vite/Vitest and other detected plugins add their own entries. Exit code 1 means candidates were found, not that the tool failed.

| Raw candidate type | Count | List |
| --- | ---: | --- |
| Files | 175 | [Files](raw/unused-files-candidates.json) |
| Value exports | 219 | [Exports](raw/unused-exports-candidates.json) |
| Runtime dependencies | 23 | [Dependencies](raw/unused-dependencies-candidates.json) |
| Dev dependencies | 4 | [Dev dependencies](raw/unused-devDependencies-candidates.json) |
| Type exports | 57 | [Types](raw/unused-types-candidates.json) |
| Unlisted imports | 30 | [Unlisted](raw/unused-unlisted-candidates.json) |
| Unresolved imports | 0 | [Unresolved](raw/unused-unresolved-candidates.json) |

[Full raw output](raw/knip.json) preserves other issue types too. These lists do not prove the deletion evidence rule. Edge-function URL imports, type-only dependencies, tooling and configuration can produce candidates requiring interpretation. Asset glob lookup and database string references are not resolved by the graph. No removal test was performed.

## Audit reconciliation

The October 2 assessments remain archived and unchanged. Current code supersedes these older claims:

- Tests are now 305 across 41 files, rather than five in one file. Selected strict types now pass. Lint is 288 errors / 34 warnings rather than 360 / 44.
- Both named GitHub workflows now use Node 24, Bun 1.3.11 and the frozen-lock installer. They no longer run `npm ci`. The smoke workflow builds and tests the branch; production availability runs only on its schedule.
- The three historical dead headers (`sections/PageHero.tsx`, `PageHeader.tsx`, `ContentPageHeader.tsx`) are already absent. The live shared `PageHero.tsx` remains.
- Footer SEO overrides, the five named native confirmation calls and several other later-phase candidates were addressed in previous PRs; Phase 0 does not reapply them.
- The homepage fallback hero now imports the source video. The public video is also referenced by `index.html`, video metadata and the slide editor. The two copies have identical bytes and remain protected.
- The requested `_assessment/08-SEO-AEO-GEO-PLAN.md` is not present. The archived SEO assessment is [_assessment/seo/08-SEO-AEO-GEO-AUDIT.md](../seo/08-SEO-AEO-GEO-AUDIT.md), with its implementation status beside it.
- The repository already has Vite chunk configuration. It was left unchanged.

The eleven F-44 components remain raw candidates in the current graph, including `CompanyIntroduction.tsx`; it is not imported by the current `Index.tsx`. None is approved for deletion in this phase.
