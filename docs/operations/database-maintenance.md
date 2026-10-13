# Database maintenance and Site Health compatibility

Prepared from `main` **1f38aa4ebc53111eabfc33a438b85e4a12c49752**, October 13, 2026. This is one maintenance phase, separate from public design work. Lovable project: `e7a4ef17-a206-4eb3-aa01-840ca899c752`; expected backend: `dinliarttwuzzozyvuiu`.

**No live database changes have been executed.** Current runtime exposes no direct Lovable/Supabase MCP tools, including `get_database_status`. No CLI, application key, browser session or Lovable AI prompt was used as a substitute. The repository's `supabase/config.toml` matches the expected backend, but that is not live identity verification. Database/function/secret/backup/scheduler readiness remains unverified.

## Evidence and boundaries

The owner supplied this read-only October 13 snapshot; it has **not been independently rechecked in this session**:

| Item | Supplied snapshot | Interpretation |
| --- | --- | --- |
| Public tables | 65, all primary-keyed/RLS-enabled; approximately 6.73 MiB including indexes | Small database; no evidence for a broad cleanup or blocking compaction. RLS does not protect TRUNCATE. |
| Indexes/constraints | No invalid public indexes or unvalidated constraints | No repair proposed without a new discrepancy. |
| TRUNCATE | anon/authenticated have effective access on 63 tables | Inspect direct, PUBLIC, inherited and reachable-role access before removal. |
| Site Health | Three tables absent | Check catalog separately from API cache and permissions. |
| Performance | 2,422 rows, 2,149 older than 90 days | Proposed fixed boundary below needs its own count and fingerprint. |
| Error history | 1,938 rows, 1,908 older than 90 days | Retain all; no deletion proposed. |
| Audit/content history | 85 audit rows; 71 content versions | Retain all. |
| Recommendation cache | Empty | Retain; emptiness does not establish absence of dependencies. |

No public presentation, homepage, navigation, form, role, authentication setting, existing migration, generated Supabase file or deployment configuration changes are included. Source SQL is outside automatic migrations. Existing migrations are preserved even where historical documentation says they were not activated.

## Recheck before approval

1. Enable the direct MCP connection. **Call `get_database_status` first**, bound to the supplied Lovable project. Record identity/status metadata proving backend `dinliarttwuzzozyvuiu`. Stop on mismatch. Do not execute SQL against an unconfirmed backend.
2. Run [read-only preflight](sql/database-maintenance-preflight.sql). It returns schema/grant/policy/index/function/trigger/dependency metadata, definition hashes and aggregate counts. It does not return telemetry bodies, customer rows, routine bodies, scheduled commands or secret values. Run the conditional cron/storage/migration/health queries only when their catalogs exist.
3. Inspect deployed function inventory/source dependencies using direct tools. Record only names, versions/status and hashes. Inspect function-secret names/presence and GitHub secret/variable presence/status; never print values. Confirm `SITE_HEALTH_ALERTS_ENABLED=false`. Presence alone does not prove matching ingest tokens.
4. Check backend routines, views, triggers, cron commands, workflows, storage references and planned features. Catalog dependencies can miss dynamic SQL/external consumers; routine text-match metadata complements them and cannot prove a table unused. No table is proposed for dropping.
5. **Confirm backup and recovery availability before asking for live approval:** provider backup/export timestamp, backend identity, usable restore/PITR coverage and documented recovery steps. Establish a tested protected export/restore path for retention. An old backup, a frontend publish rollback or a repository migration is not database recovery evidence. This session has no evidence that a current backup exists.
6. Freeze an exact approval packet: rechecked catalog fingerprint; specific revoke/rollback statements and any inherited-grant blockers; owner-reviewed Site Health SQL hash and missing-object diff; fixed retention cutoff/count/set fingerprint and archive/recovery plan; backup evidence. Request **one explicit approval** of the concrete set, with C independently identified as optional. Do not infer deletion approval from the request to propose retention.
7. Execute only the approved scripts through direct tools, transactionally. Stop on any mismatch or failure; verify transaction rollback before proceeding. Do not run unrelated migrations, change roles/memberships, deploy functions, set secrets/variables, dispatch uploads or enable schedules as part of these transactions.

## A — Revoke browser TRUNCATE

[Exact guarded proposal](sql/revoke-browser-truncate.proposal.sql). It removes only TRUNCATE from PUBLIC, anon and authenticated on the reviewed public table inventory. Normal reads/writes, references, triggers, RLS policies and all roles are unchanged. Assertions preserve effective normal permissions for every role, and server/executor/table-owner TRUNCATE. Identify any additional required server roles during the live review.

The draft refuses execution until the approved catalog fingerprint is frozen. It uses RESTRICT: dependent grant chains fail rather than cascading. Effective or reachable inherited TRUNCATE causes rollback; do not revoke role membership or shared server grants to make it pass. Resolve such a finding in the approval packet with its concrete dependency evidence first. No new grants are invented automatically.

Verification: rerun the direct-grant/effective/reachable-role preflight queries. Expect no PUBLIC/anon/authenticated TRUNCATE grants and zero effective/reachable browser access. Compare every required normal/server privilege with its pre-change value. This guards against direct-only revocation appearing to fix inherited access.

**Separate rollback:** preflight returns exact GRANT statements with original grantor/grantee/grant option. Save them before approving A. After fresh rollback approval, execute those statements in a separate BEGIN/COMMIT transaction as their original grantors; verify the original ACL/effective-permission inventory. Never grant ALL or restore a blanket privilege list. Default privileges are inspected, not changed: if creator-wide/global defaults would reintroduce the problem, prepare explicit creator-specific default-grant SQL for review. A per-schema REVOKE cannot cancel a global default grant.

## B — Missing Site Health objects only

The owner-reviewed standalone activation transaction is referenced in `docs/operations/README.md` but is **not supplied in this chat or present in current main**. Its exact contents/hash and rollback cannot be certified. **B is blocked; no replacement activation SQL or full 0003 execution is proposed.** Provide that reviewed transaction before forming the final live approval set.

Compare the supplied SQL against:

- `src/lib/admin/site-health/contract.ts`, `types.ts` and `data.ts`;
- `supabase/functions/ingest-site-health/index.ts` and `health-ping/index.ts`;
- historical `supabase/migrations/20261004050716_site_control_and_health.sql`, **as contract evidence only**;
- [read-only contract and aggregate verification](sql/site-health-verification.sql).

Only create confirmed missing monitoring objects. Existing objects must match rather than being silently overwritten or ignored with IF NOT EXISTS. Expected contract:

| Object | Required behavior |
| --- | --- |
| `site_health_runs` | UUID PK, run timestamps/kind/origin/commit, nonnegative counts, status enum running/passed/warnings/failed/aborted/blocked; `(kind, started_at desc)` index. |
| `site_health_results` | UUID PK; run FK with cascade; desktop/mobile viewport; path/timing/title/H1/canonical/hash/errors/issues/checked timestamp; bounded strings/JSON array; run/path-time indexes. |
| `site_health_issue_states` | Fingerprint PK; fixed/ignored state; bounded reason; timestamp; nullable updater with `profiles(id)` FK and delete-set-null. |
| Permissions | RLS on all three; no anonymous access; authenticated admin SELECT on runs/results; admin decision CRUD only on issue states; service-role ingestion; browser TRUNCATE denied. |
| Prerequisites | Existing `public.is_admin(uuid)`, `auth.uid()`, compatible profiles FK and server permissions; preserve installed role safeguards. |

There are 29 required columns in the current contract verification. Compare defaults, checks, indexes, FKs, policy predicates, grantors and effective permissions as well as types/nullability. An authenticated RLS response containing zero rows does not prove admin permissions work; use authorized offline policy fixtures before any live authenticated validation.

Do not activate `site_flags`, `content_entries`, `content_entry_versions`, content publish functions or unrelated objects in full 0003. Do not repeat existing migrations. Reconcile any manual monitoring subset with migration history before a future full migration, without marking unapplied content objects as applied.

**Separate rollback/recovery:** prefer reverting the frontend and leaving new inactive monitoring objects in place. No tables need dropping to recover this compatibility patch. If schema removal is later necessary, first export any monitoring data, inspect live dependencies, identify only objects newly created by this exact transaction, and obtain separate approval for its reviewed rollback. Never use full 0003 rollback or CASCADE. The absent reviewed SQL prevents exact object-removal statements from being approved now.

## C — Optional 90-day performance retention

[Exact guarded proposal](sql/performance-retention.proposal.sql); [separate guarded recovery](sql/performance-retention.recovery.sql). This is a proposal, **not approval to delete**.

- Reference time: **October 13, 2026, 00:00 UTC**. Fixed cutoff: **July 15, 2026, 00:00 UTC**. Delete only `performance_metrics.recorded_at < cutoff`; preserve the boundary and NULL dates. Do not use a moving `now()` cutoff in the approved transaction.
- Affected count: **pending live recheck at that exact cutoff**. The supplied 2,149 older-than-90-day rows may use a different time of day; it is not substituted for this proposal's count. Freeze both count and aggregate set fingerprint. Refuse drift.
- Recovery: confirm provider recovery plus protected export first. The optional transaction locks the small metrics table with a two-second lock timeout, archives each removed row into a separate restricted schema in the same transaction, and verifies counts before commit. Archive errors roll back deletion. No archive contents are returned through MCP or committed to Git.
- Dependency gates: reject referencing FKs and enabled noninternal triggers until their effects are reviewed. Inspect views, SQL routines, jobs and external dependencies even where deletion would not mechanically violate a constraint.
- Recovery is a separate approved transaction. It refuses ID collisions, restores explicit columns and verifies row equivalence. Keep archive/backup until recovery has been verified; archive disposal is a separate decision.
- Limitation: ordinary DELETE normally makes pages reusable after autovacuum, rather than shrinking files immediately. The in-database archive can increase total allocated size. At approximately 6.73 MiB across all tables/indexes, no disk-space savings are promised. No VACUUM FULL, blocking compaction, recurring retention job or archive drop is included.

Historical error logs, audit records, content versions, all inquiries, projects, documents, media, accounts and roles are retained.

## Repository dependency evidence

| Relation | Verified repository consumers / planned purpose | Action |
| --- | --- | --- |
| `performance_metrics` | `src/lib/webVitals.ts` writes measured telemetry behind existing flag/consent; `src/pages/admin/Monitoring.tsx` reads latest 100; `analyze-performance` reads last seven days. | Retention proposal only; preserve current writers/readers and tracking switch. |
| `error_logs` | Visitor telemetry, admin monitoring/Site Health, `send-rfp-notification`; historical `cleanup_old_error_logs()` deletes >30-day rows. | Retain all. Recheck whether the historical cleanup routine/job still exists/is scheduled; do not invoke it or silently alter its schedule. |
| `audit_log` | Historical security/audit routines and triggers, admin activity workflows. | Retain; frontend import counts do not determine dependency status. |
| `content_versions` | Historical version-writing routine and editor/history feature. | Retain. |
| `service_recommendations_cache` | Original recommendation RPC read cache; later migration rewrites RPC to popularity reads, and a later cache-policy migration retains it. Live routine version and external consumers unknown. | Retain, including when empty. |
| Site Health objects | Admin tile/workspace and Pages status; ingestion stores actual crawler output; health-ping checks database reachability via `site_settings`, independently of monitoring tables. | Reviewed missing-object activation pending. |

Repository reference searches cover `src`, all migrations/functions, `scripts`, `.github` and current operations/plans. Live routine/trigger/job/storage evidence is still required; this is not an unused-table certification.

## Frontend compatibility change

- Confirmed missing relation (`42P01`) shows setup. Missing column (`42703`) shows contract mismatch.
- API lookup/cache errors (`PGRST204/205`) state that missing objects and stale cache must be distinguished in the database catalog; cache service errors remain separate failures. A lookup error cannot prove stale cache or prove missing schema by itself.
- Permission/authentication and request failures stay visible; a denied prerequisite is not hidden by another missing table.
- Accessible empty history, loading history/results, failed results and an empty run result list have distinct honest messages. A failed or empty read never shows “No issues detected.”
- Function HTTP auth/not-found/service errors and network/relay failures give specific next steps. Successful ping requires measured nonnegative latency and a valid timestamp. Database reachability does not prove Site Health schema, ingestion, a real report or scheduler readiness.
- The setup link uses this monitoring-only checklist, avoiding the old full-0003 instructions. Existing authenticated Supabase paths and generated types are preserved.

## Readiness checkpoints

| Area | Current evidence | Required next evidence |
| --- | --- | --- |
| Database readiness | Supplied missing-table snapshot; repository project ID matches; no direct MCP recheck | Confirm identity/catalog/backup; approve/apply missing-object SQL; verify contracts/RLS/grants. |
| Functions readiness | Two source functions and `verify_jwt=false` config exist; live inventory unverified | Deployment versions/status and secret presence through direct tools, without deployment or secret changes. |
| First real report | Not verified | Correlate a real GitHub workflow upload with stored completed run and desktop/phone coverage. Do not insert synthetic records or dispatch an upload without authorization. |
| Nightly scheduling | Source cron 07:00 UTC; job gated by `SITE_HEALTH_ENABLED=true`; live variable unknown | Verify variable/status and actual nightly workflow history. Database setup alone does not enable scheduling. |
| Alert pilot | Code needs seven distinct complete nonmanual nightly dates plus server activation; live flag unknown | Keep `SITE_HEALTH_ALERTS_ENABLED=false`; record actual pilot nights. No emails or secret changes authorized. |

If the alert flag is found enabled, report it and request specific authorization to change it rather than modifying secrets silently. No deployment, publishing, schedule change, first-run upload or alert activation is part of the database approval set.

## Offline verification

Results and limits: [maintenance verification](database-maintenance-verification.md). Fixtures never access Supabase or submit production forms. PostgreSQL tests run only in a disposable **network-none** container and validate guarded proposal behavior; they do not establish production dependencies, policies, backups or identities.

Frontend rollback: revert this maintenance commit/PR and have the owner publish separately. No public design restoration or database rollback is necessary for the frontend compatibility change. Creating/merging a PR does not deploy functions, apply SQL or publish the website.
