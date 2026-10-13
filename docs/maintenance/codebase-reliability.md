# Codebase reliability fixes

This PR addresses the review of commit `39b2880` while keeping the current React/TypeScript/Supabase architecture. It changes application code and CI, prepares an optional SQL function, and makes no live database, storage, email, function-deployment or publishing changes.

## Findings and delivery status

| Finding | Result in this PR | Remaining boundary |
| --- | --- | --- |
| F01: deleted operational inputs | Monitoring inventory/comparison declarations moved to `config/page-safety/`; active plans/setup guides recovered under `docs/`; consumers and CI input checks updated. Historical screenshots remain in Git history/Actions artifacts. | Nightly schema/functions/token/scheduler still need their existing activation checklist. |
| F02: unchecked notification failures | A shared checked invocation handles returned HTTP/provider errors, blocked results and timeouts. Contact, Estimate, quick contact, quick quote and resume notifications use it. Resume intake also checks the saved result before claiming success. | Server delivery logs/retries for every legacy form require the existing intake rollout; actual mailbox delivery unverified. |
| F03: partial publication/concurrent project edits | New projects stay draft until relationships save. Existing saves compare exact loaded `updated_at`, preventing stale editors from entering relationship writes. Persistence extracted from the screen; writable fields allowlisted. Atomic RPC adapter and draft SQL supplied. | Full atomicity for already-published project relationships requires reviewed SQL plus `VITE_ATOMIC_PROJECT_SAVE_ENABLED=true`. The compatibility path still consists of separate requests. |
| F04: late published content | Mounted content consumers update when the first response arrives after the startup deadline. Generation checks stop disabled/stale requests from restoring overrides. | Enabled content can transition once from defaults to published values; no automatic production flag activation. |
| F05: unrecoverable lazy route errors | Original error retained; page-level boundary offers explicit retry and reload without automatic refresh. | A truly removed asset may require the explicit reload. |
| F06: weak typing | Expanded strict entrypoints to invocation, project-save controller, field contract, autosave, icons and telemetry. Optional table inserts require key fields. | Full strict conversion and generated schema refresh remain staged work requiring verified live schema. |
| F07: CI omissions | Smoke CI now runs both type checks, per-file/rule lint baseline, operational-input validation and entry budget. Added PostgreSQL service job tests atomic-save draft against disposable fixtures. | This is targeted database coverage, not all live RLS/function integration coverage. |
| F08: heavy startup | Direct imports for 41 navigation/common icons; uncommon CMS icons load on demand. Entry shrank from 1,904,284 to approximately 1,047,000 minified bytes. A budget preserves the improvement. | Midrange-device performance measurement and other eager dependency reductions remain useful. |
| F09: whole-site content reads | Public content fetches are scoped by `page_id`, deduplicated and cached for visited modules. | Admin's full inventory remains bounded but aggregate/paged workspace redesign is deferred. |
| F10: mixed responsibilities | Project persistence moved into a tested controller; shared notification, route-recovery, rate-limit and telemetry contracts extracted. | Larger presentation screens will be split incrementally; no mass folder moves. |
| F11: opaque field IDs | About header uses semantic aliases while preserving persisted IDs. | Other mappings remain stable; broad persisted-key renaming would require a migration plan. |
| F12: synchronous autosave | Coalesces typing for 500 ms; flushes on hiding/unmount/key changes; explicit clear cannot be resurrected by a pending timer. | No IndexedDB dependency added without measured need. |
| F13: raw/noisy telemetry | Removes query/hash/credentials/contact details; allowlists context; deduplicates and caps reports; checks returned insert errors without recursion. | Existing stored records and retention policy unchanged. |
| F14: fail-open costly operations | Shared limiter requires valid decisions for costly endpoints; validated lead intake explicitly keeps availability on limiter outages. Pure contract tests cover both choices. | Backend source must be deployed; anonymous legacy insert permissions are not changed in this PR. |
| F15: initial HTML/SEO architecture | Existing read-only initial-HTML diagnostic retained and documented. | Hosting/prerendering decisions remain open; a generic SPA shell does not prove how Lovable serves crawlers. No platform rewrite/prerender activation is claimed. |
| F16: dependency/tooling ownership | Removed `__dirname` config assumptions; documented candidate packages and Drizzle's status. | Unused dependency removal/toolchain updates deferred to the supported package/lock workflow. No lockfiles or generated Supabase files changed. |

## Atomic project-save activation

The draft [save-project-atomic.sql](../operations/sql/save-project-atomic.sql) is outside `supabase/migrations/`: it is not automatically applied. It creates one `SECURITY INVOKER` function and preserves existing RLS/grants. It refuses replacing an existing function, validates writable fields, compares the loaded version, and commits project/images/services together. New failed saves roll back the draft row. It does not delete storage objects.

1. Review live prerequisites: existing project/image/service tables, `project_images.alt_text`, compatible `is_admin(uuid)`, grants/policies, triggers and recovery availability. The local fixture is deliberately smaller than the production database.
2. Review/approve the exact SQL through the established database process and apply it transactionally. Do not run the commented rollback as part of activation.
3. Verify the RPC using isolated test fixtures first. Set the build variable `VITE_ATOMIC_PROJECT_SAVE_ENABLED=true` only after backend readiness is confirmed, then publish the frontend.
4. If the switch is enabled and the function is unavailable, the editor retains edits and fails closed. It never falls back to non-atomic writes. Disable the switch before separately reviewing function removal.

The disposable tests live in `scripts/sql/project-save-fixture.sql` and `project-save-check.sql`. Run them only against a fresh local PostgreSQL 16 database. CI performs fixture setup, draft application and assertions in a new service container. Tests cover successful publication, rollback after relationship failure, failed new insertion, stale versions, non-admin rejection and denied anonymous execution. They do not establish the production trigger/policy contract.

## Operations and repository structure

- `config/page-safety/` is runtime configuration. Do not delete it when archiving reports.
- `docs/admin-upgrade/` holds recovered authoritative plan/status/checklist snapshots. Their old phase observations are historical; this file records this PR's final scope.
- `config/lint-baseline.json` records existing debt by file/rule. The CI budget permits no new files/rules or per-file increases and caps the existing total. Reduce the baseline when debt is fixed; never increase it to hide a regression.
- `react-spring`, the direct Tiptap Link package and Drizzle are review candidates. Tiptap still configures Link once through StarterKit. Do not remove convention-loaded MCP integrations, generated contracts or migration history based only on import scans.
- Long content/default files and generated types are not performance defects merely because of their length. Keep current public design, copy and protected credential wording.

## Public behavior and verification limits

Normal visitor design/copy is intended to remain identical. Declared behavior changes are error-only route recovery, accurate form submission/notification handling, sanitized visitor telemetry, and published-content loading when its existing switch is enabled. Admin draft/save behavior and repository tooling also change. Site-wide credential, navigation, hero imagery and factual copy are preserved.

Offline comparison uses public fixture responses and does not submit forms or contact the backend. This supplements the existing recorded-production CI gate; it does not replace its approved baseline. Missing production fixtures still fail closed. No actual emails, live mutations or automatic publishing are used for verification.

## Validation recorded for this PR

- 680 tests passed across 112 test files. Both compiler checks passed with expanded strict coverage.
- Production build, route audit, service-worker validation and new entry budget passed.
- Lint: 201 existing errors / 29 warnings; zero new per-file/rule regressions (down from 205 errors).
- Offline 85-page browser comparison at 1440/390: 170 identical captures, zero unexpected differences. The homepage was recaptured after freezing its existing periodic statistic rotation; the initial one-text difference was not waived or changed in application copy.
- Public bundle gate passed for 229 loaded chunks with no forbidden admin/editor/chart code.
- Deno checked submit-form and shared dependencies. Existing dependency deprecation warnings remain.
- Isolated PostgreSQL 16 tests passed for draft SQL; CI repeats them using a disposable service.

Compact machine-readable results are in [reliability-evidence](reliability-evidence/summary.json). Screenshots and raw fixture responses remain in the execution workspace; production-fixture CI uses its existing approved artifact and can still report missing fixtures. These local checks do not declare all 16 architectural recommendations fully complete or all backend features activated.
