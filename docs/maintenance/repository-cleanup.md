# Repository cleanup

2026-10-05. Base: `5c79160bd66f6afc532360a6e411d5a3db7d64d0` (merged PR #53). The owner's current request authorizes repository cleanup and a clearer GitHub landing page. The older cleanup Phase 0 candidate lists remain preserved as historical evidence.

## Result

- Removed **156 unused source modules** plus the unreferenced `0===` shell artifact: **157 files / 669,727 bytes**. The [deletion ledger](deleted-files.json) records every path, size and original SHA-256.
- Reorganized **55 guide/evidence files** into `docs/archive/`, `docs/design/` and `docs/navigation/`; the [move map](document-moves.json) records old and new paths. Moved Markdown links were rebased. Active owner plans, SQL references, baseline artifacts and the master-plan-linked Leads guide retain their paths.
- Replaced the long root README with a concise GitHub landing page: website, current guides, local setup, stack, repository layout and the distinction between code merge, publishing and backend activation. The entire old README is [archived unchanged](../archive/repository-overview-before-cleanup.md).
- Added current development/operations guides, an explicit historical-guide index and a repository map. Updated assessment/scripts entry points and maintained status links. Corrected the contribution guide's unsupported automatic-function-deployment claim.
- Ignore future local coverage/cache/browser outputs. Existing approved screenshots and original assessments are retained.

## Removal evidence

A fresh Knip scan found 188 file candidates. Every proposed removal was also checked using TypeScript module resolution over string literals in retained source, scripts and configuration. Five test files had obsolete mocks for retired components/hooks; only those mock statements were removed, preserving their assertions. No remaining code reference resolves to a removed module.

The post-cleanup graph retains **32 deliberately preserved candidates**: reusable UI library modules, the explicitly selected-typechecked navigation component, and Lovable's convention-loaded MCP integration. Ordinary import graphs do not establish that platform-discovered modules are unused. Package declarations and both lockfiles remain intact.

No public image/video/font, supplied company document, generated Supabase client/types, platform configuration, database migration or Edge Function was removed or modified. The owner's credential wording, facts and draft plans were not rewritten. Source changes consist of verified dead-file removal and test fixture maintenance.

## Exact production output comparison

Built main and the cleaned branch using identical synthetic frontend settings and `vite build --manifest`. Both produce **340 files**, with **identical paths and byte-for-byte identical contents**, including HTML, manifests, JavaScript, CSS and assets. [Verification summary](verification.json).

Removing unused components initially caused Tailwind to purge utilities. A small [compatibility list](retained-utility-classes.txt) preserves 249 utility tokens, including two whose classes also occur in global CSS. Database-authored content may still reference these classes. Tailwind reads that list; the existing public-safety workflow now also watches it and the Tailwind configuration. This retains the approved output while removing the obsolete source code. Removing the list's entries requires a separate content/style review.

## Tests and checks

- **561 tests / 87 files pass** with a synthetic backend configuration. Full app and selected strict TypeScript pass; production build, service-worker validation, route audit and documentation entry-point links pass.
- The first full test run exposed 13 failures across Estimate, Dashboard and Leads fixtures. The same 13 reproduced against unchanged main. Those fixtures were updated for the current query provider, combined-summary interface, optional inquiry source and pagination arguments. No assertions were disabled. The rich-text test also now supplies its own synthetic backend origin rather than assuming production environment settings; its image-safety assertions remain intact.
- ESLint still reports **213 errors / 29 warnings**, within the repository ceiling of 288/34. The lint command is not clean; existing unrelated debt was not repaired.
- Full live/public browser replay, authenticated admin, SQL/RLS/storage/email checks, function deployment, migration-history reconciliation and publication were not performed. Exact fixture-build parity establishes unchanged generated output, not a live deployment result.

## Retained material

Owner assessments and large comparison images remain because they record previous work and feed reproducible comparisons. Historical guides are explicitly archived rather than silently deleted. Database/asset cleanup requires evidence outside an import scan and is not part of this PR.

No SQL, live database/storage writes, emails, secrets, function deployment, merge or publishing were performed.
