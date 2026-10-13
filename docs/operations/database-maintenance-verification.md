# Maintenance verification — October 13, 2026

Base: `1f38aa4ebc53111eabfc33a438b85e4a12c49752`. Isolated branch: `maintenance/database-site-health-compat`.

| Check | Result |
| --- | --- |
| Frozen dependency graph | Passed with repository installer and Bun 1.3.11; manifests/lockfiles unchanged. Initial missing-Bun setup failure resolved; reusable install instructions tested. |
| Full Vitest | **716 tests / 115 files passed**, including 28 new compatibility cases. |
| Full app / selected strict TypeScript | Both passed. |
| Production build | Passed; inherited large-chunk warnings remain. |
| Service-worker validation / route audit | Passed. |
| Operational inputs | Passed; current safety inventory **86 URLs**. |
| Entry budget | Passed: **1,019,546 bytes**, **305,083 bytes gzip**. |
| Lint | **201 inherited errors / 29 warnings**, zero per-file/rule regressions. Changed/new TypeScript files clean. Whole ESLint is not claimed error-free. |
| Local production smoke | Passed six route responses, static SEO assets and homepage brand/response checks. Optional backend probe deliberately skipped. This checks local serving, not live HTTP routing or database readiness. |
| PostgreSQL 16 proposal fixtures | Passed approval guards, direct/inherited TRUNCATE, normal/server preservation, count/set drift, FK/trigger refusal, archive failure rollback, cutoff/NULL preservation, exact recovery and collision refusal. Network-isolated disposable container only. |
| Read-only SQL | Preflight executed against disposable fixtures. Site Health verifier detected all 29 absent columns, then zero column mismatches against a local historical-contract fixture; catalog/aggregate queries executed. This does not certify the absent owner-reviewed activation SQL. |
| `git diff --check` | Passed. |
| Full public comparison / bundle gate | Not rerun: public route/design/content/style/import files and dependencies unchanged; all application changes stay within admin Site Health. **Zero pages compared** in this maintenance phase. This is not a fresh production-baseline or bundle certification. |
| Live identity/catalog/grants/RLS/dependencies | **Not run**: direct Lovable/Supabase MCP tools unavailable, including required first `get_database_status`. Supplied October 13 counts remain an unrechecked snapshot. |
| Backup/restore/PITR confirmation | **Not verified**; required before exact live approval. |
| Function deployment / secret status | **Not verified** through live tools; source/config only. No deploy or secret change. |
| Real report / nightly schedule / alerts | **Not verified**; no upload, schedule change or email. Keep alerts disabled. |
| Live mutations / merge / publish | **None.** SQL files are proposals and fail closed until reviewed values are frozen. |

Raw logs are retained outside Git under `/workspace/db-maintenance-evidence/`. No customer rows, telemetry bodies, secret values or production fixture dumps are included in this PR.

## Reproduce the disposable database checks

Use a fresh local PostgreSQL 16 container, **not a live connection**. No host port is published. Use the managed environment's local Docker socket and preserve Docker registry/proxy configuration. Clear inherited endpoint/context/TLS selectors for each Docker command as shown in the runtime skill; do not disable HTTPS verification for network operations.

```sh
docker --host=unix:///var/run/docker.sock run -d --rm --network none \
  --name agc-maintenance-fixture -e POSTGRES_HOST_AUTH_METHOD=trust postgres:16
docker --host=unix:///var/run/docker.sock exec -i agc-maintenance-fixture \
  psql -U postgres -X -v ON_ERROR_STOP=1 < scripts/sql/maintenance-fixture.sql
docker --host=unix:///var/run/docker.sock exec -i agc-maintenance-fixture \
  psql -U postgres -X -v ON_ERROR_STOP=1 < docs/operations/sql/database-maintenance-preflight.sql
python3 scripts/sql/check-maintenance-proposals.py
docker --host=unix:///var/run/docker.sock rm -f agc-maintenance-fixture
```

The harness uses only that explicit container and refuses a network mode other than `none`. It supplies fixture-derived approval values to in-memory copies; checked-in SQL retains its refusal guards. Historical Site Health DDL is used only to validate the verifier in the fixture, never as a substitute live activation transaction. The restored fixture ends with synthetic data and should be removed.

## Limits

Unit tests prove the UI/data adapter distinguishes missing schema, cache ambiguity, permission, loading, empty and failure states. They do not prove an authenticated production user's grants, provider backup status, deployed function source, matching tokens, nightly execution or delivery. No production forms are submitted. The new checklist replaces a setup link that led to historical full-0003 instructions; it does not activate monitoring.
