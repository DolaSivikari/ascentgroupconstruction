# Publishing and backend operations

## Publish the website

1. Review and merge the relevant GitHub PR.
2. In Lovable, select **Publish → Update**.
3. Check the published website in a private window at desktop and phone widths.

GitHub main, Lovable preview and the production domain may show different builds. A merged PR does not establish publication. Record the commit actually published when capturing a baseline.

## Backend changes are separate

Edge Functions live under `supabase/functions/`. Deploy the intended versions explicitly through the available platform tools; do not assume a Git commit or frontend publish deployed them. Use their checked-in configuration and shared dependencies.

Database schemas and secrets also need explicit activation. Before executing SQL, compare the proposed objects with the live catalog and the application contract, establish recovery availability, and obtain approval for the exact transaction. Preserve existing migrations and role safeguards. Never run an activation script followed immediately by its rollback script.

A manually applied subset of an older migration must be reconciled with migration history before the remaining migration is applied. In particular, standalone Site Health activation creates objects also defined in `0003`; applying that original file afterward without reconciliation would conflict.

## Nightly Site Health

Use the [Phase 2 setup checklist](../../_assessment/admin-upgrade/PHASE-2-IMPLEMENTATION-STATUS.md#owner-setup-in-order).

The setup has separate parts:

- The `site_health_runs`, `site_health_results` and `site_health_issue_states` schema and permissions.
- Deployed `ingest-site-health` and `health-ping` functions.
- Matching `SITE_HEALTH_INGEST_TOKEN` secrets in the function environment and GitHub Actions.
- A successful real manual workflow upload.
- GitHub Actions variable `SITE_HEALTH_ENABLED=true` for the 07:00 UTC schedule.

Keep `SITE_HEALTH_ALERTS_ENABLED=false` through the seven-night pilot. Do not create synthetic passing records or treat historical browser errors as current failures without evidence. Store secret values only in the platform's secret settings.

The owner's database conversation reported the tables missing and prepared a standalone activation transaction. This repository cleanup does not apply or independently verify that transaction.

## Intake and content activation

The [application status](../../_assessment/admin-upgrade/MASTER-PLAN-APPLICATION-STATUS.md) records the required schema, functions and switches. Keep new inquiry intake, content overrides and newsletter server paths disabled until their own prerequisites are verified.

Do not apply `0001` unchanged over the installed role safeguards; the status document explains the collision. Credential claims and owner-supplied business facts remain owner decisions.

See [historical deployment material](../archive/guides/DEPLOYMENT.md) for older host notes. Confirm current platform behavior before relying on those notes.
