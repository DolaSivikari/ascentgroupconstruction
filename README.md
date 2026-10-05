# Ascent Group Construction

Public website and administrative workspace for Ascent Group Construction, a specialty contractor serving the Greater Toronto Area. The website covers building envelope, restoration, protective coatings, interior trades and cladding services.

- Website: https://www.ascentgroupconstruction.com
- Repository: https://github.com/DolaSivikari/ascentgroupconstruction
- Lovable project: `e7a4ef17-a206-4eb3-aa01-840ca899c752`
- Expected Supabase project: `dinliarttwuzzozyvuiu`

Confirm the connected backend before any live database work. Repository code, deployed functions, database setup and published website state must be verified separately.

## Application

The application uses React 18, TypeScript, Vite, React Router, Tailwind CSS, Radix/shadcn components, TanStack Query and Supabase. Forms use react-hook-form and Zod.

Public routes include the homepage, services and service details, market pages, projects, About, company credentials, blog, service areas, Contact, Estimate and RFP submission. The route definitions and service registry are the source of truth; older service URLs may redirect.

The admin workspace includes lead management, content editing, media, credentials, settings and Site Health. A component, table declaration or checked-in function does not by itself prove that its feature is activated in production.

## Repository map

| Location | Purpose |
| --- | --- |
| `src/routes/AppRoutes.tsx` | Public and admin routes, lazy loading and redirects |
| `src/pages/`, `src/components/` | Page implementations and shared UI |
| `src/content/`, `src/data/` | Page content modules, service registry and supporting data |
| `src/design-system/` | Shared design components and tokens |
| `src/lib/`, `src/hooks/` | Data access, feature contracts and application behavior |
| `src/integrations/supabase/` | Generated Supabase client and types |
| `public/`, `src/assets/` | Website assets; some may be referenced by stored content |
| `supabase/functions/` | Backend function source |
| `supabase/migrations/` | Migration history and proposed schema changes; verify live application separately |
| `scripts/` | Dependency installation, route audits, baseline tooling and Site Health crawler |
| `.github/workflows/` | CI and scheduled/manual Site Health workflow |
| `_assessment/` | Master plans, implementation status, audit evidence and cleanup records |

Read [AGENTS.md](AGENTS.md) before changing the repository. For admin work, start with the [admin master plan](_assessment/admin-upgrade/00-ADMIN-MASTER-PLAN.md) and the relevant implementation-status document. Historical reports are dated evidence, not current deployment guarantees.

## Local development

Use Node.js 24 and Bun 1.3.11 to match the Site Health workflow. The frozen installer requires a fresh checkout without an existing `node_modules` directory:

```bash
node scripts/install-ci-dependencies.mjs
npm run dev
```

The development server uses port 8080. The installer uses the checked-in Bun lock graph without modifying the repository package or lock files. Use `node scripts/install-ci-dependencies.mjs --check` for an isolated installation check when dependencies already exist.

Lovable manages `.env` and the generated Supabase client/types. Do not commit secret values or manually rewrite those files. Frontend configuration uses `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY` and `VITE_SUPABASE_PROJECT_ID`. Service-role keys and function secrets must never enter the browser bundle.

## Verification

Run the required checks from the repository root:

```bash
npx vitest run
npm run typecheck:selected
npx tsc -p tsconfig.app.json --noEmit
npm run build
npm run validate:sw
node --import tsx scripts/audit-routes.ts
npm run lint
git diff --check
```

Public-facing changes also require the applicable baseline comparison and bundle gates described in [AGENTS.md](AGENTS.md). Browser verification must use offline fixtures; do not submit production forms or write to live storage while testing.

### Cleanup verification — 2026-10-05

[PR #54](https://github.com/DolaSivikari/ascentgroupconstruction/pull/54) removed seven confirmed unused source modules and one accidental shell artifact: **8 files / 18,755 bytes / 470 lines**. The [cleanup report](_assessment/cleanup/UNUSED-FILES-CLEANUP-2026-10-05.md) and [deletion ledger](_assessment/cleanup/unused-files-2026-10-05.json) document evidence, original hashes and recovery.

Build, selected/full application TypeScript, route audit and service-worker validation pass. Lint reports 266 errors and 34 warnings, within the existing ceiling. Full tests report 548 passes and 13 failures; the same failures reproduce with the original files restored. The focused public comparison has unresolved text/screenshot differences and does not constitute a passing full public gate. No production speed improvement is claimed.

The cleanup PR is merged into main. Its verification limits remain unresolved; merge status does not establish a completed production deployment. Uncertain assets, archived evidence, migrations and historical logs were preserved.

## Site Health activation

The repository contains the Site Health admin workspace, crawler, `ingest-site-health`, `health-ping` and the [Nightly Site Health workflow](.github/workflows/site-health.yml). Scheduled runs are configured for **07:00 UTC**, gated by the GitHub Actions variable `SITE_HEALTH_ENABLED=true`. Manual runs default to `upload=false`.

Activation requires separate verification of:

1. The three monitoring tables, constraints, indexes, RLS and grants against the [shared contract](src/lib/admin/site-health/contract.ts), with the correct Supabase project connected.
2. Deployment of the current `ingest-site-health` and `health-ping` source, including their shared authentication code.
3. Matching `SITE_HEALTH_INGEST_TOKEN` configuration in function secrets and GitHub Actions. Verify presence/status without exposing values.
4. A successful manual workflow run with `upload=true` and a real report visible in admin history.
5. `SITE_HEALTH_ENABLED=true` after the manual upload succeeds.

Keep `SITE_HEALTH_ALERTS_ENABLED=false`. Alert eligibility requires seven distinct complete nightly dates, verified recipients/sender and explicit activation. Database setup alone does not enable nightly checks or prove function readiness.

See the [Phase 2 implementation status](_assessment/admin-upgrade/PHASE-2-IMPLEMENTATION-STATUS.md) for implementation details. Its original deployment checklist is historical; do not run the entire reference `0003` SQL blindly because it also contains unrelated content-management objects. Prepare a minimal database change, verify backup/recovery and obtain approval for the concrete live SQL before applying it.

## Change and release boundaries

Preserve public design, content, forms, existing roles and authentication settings. Do not delete media based only on missing static imports: stored content and wildcard asset resolution may still use it. Preserve audit and recovery evidence unless a separately reviewed retention change authorizes removal.

Keep code review, database migrations, function deployment, secrets and website publishing as separate actions. **Merging a PR does not publish the website.** The owner publishes through Lovable **Publish → Update** and verifies the result in a private window.

## License

Proprietary — Ascent Group Construction.
