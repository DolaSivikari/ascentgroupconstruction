# Development

## Requirements and install

Use Node.js 24 and Bun 1.3.11, matching `.github/workflows/`. From the repository root:

```sh
node scripts/install-ci-dependencies.mjs
```

The installer follows `bun.lock` and includes the repository's package-mirror handling. Do not replace the lockfile to work around an installation failure. Report the failed package or registry request and use the supported environment configuration.

Use the configured frontend variables:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`
- `VITE_SUPABASE_PROJECT_ID`

Use project-approved values through your local environment. Production and Lovable preview may share the same database. Unit tests use mocks; do not test mutations against the real backend.

## Run

```sh
npm run dev
```

Vite uses port 8080. To serve a production build locally:

```sh
npm run build
npm run preview
```

## Verify

```sh
npm run typecheck:selected
node node_modules/typescript/bin/tsc --noEmit -p tsconfig.app.json
npm exec -- vitest run
npm run build
npm run validate:sw
node --import tsx scripts/audit-routes.ts
npm run lint
```

Existing lint debt is recorded in the implementation reports. Preserve test assertions and report failed or skipped checks accurately. A successful build alone does not verify live database permissions, email delivery or deployed functions.

Browser comparison tools are installed separately from application dependencies. Follow [baseline instructions](../../_assessment/baseline/README.md) or [cleanup fixture instructions](../../_assessment/cleanup/README.md) when a task requires them.

## Editing rules

- Read [AGENTS.md](../../AGENTS.md) and the relevant current plan.
- Register routes in `src/routes/AppRoutes.tsx`; preserve deliberate redirects.
- Use the [design system](../design/README.md) and [contribution conventions](../../CONTRIBUTING.md).
- Keep generated Supabase client/types, platform configuration, credentials, assets and migration history intact unless their specific change is authorized.
- Treat database-stored asset paths as references: an image with no source import may still be in use.

See the [repository map](../maintenance/repository-map.md) for where new work belongs.
