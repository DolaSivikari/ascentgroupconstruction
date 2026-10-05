# Repository map

| Location | Purpose | Where to start |
| --- | --- | --- |
| `src/pages/` | Public pages and admin screens | `src/routes/AppRoutes.tsx` |
| `src/components/` | Mounted public/admin components and shared UI | Feature folders; `shared/` for page primitives |
| `src/content/` | Typed defaults and editable field contracts | `types.ts`, `registry.ts`, `pages/` |
| `src/lib/`, `src/hooks/` | Data contracts, application helpers and hooks | The feature's existing module |
| `src/design-system/`, `src/styles/`, `src/ui/` | Approved tokens, typography and UI primitives | [Design guide](../design/README.md) |
| `src/lib/mcp/` | Lovable's convention-loaded MCP integration | `index.ts`; ordinary import scans can miss it |
| `public/`, `src/assets/` | Public and bundled assets | Preserve CMS/database URL references |
| `supabase/functions/` | Server functions and shared helpers | Function `index.ts`, `deno.json`, shared code and `supabase/config.toml` |
| `supabase/migrations/` | Supabase migration history | Inspect live state before application |
| `drizzle/`, `drizzle.config.ts` | Separate database tooling/history | Retained; not a second automatic setup step |
| `scripts/` | Build, verification and operational scripts | [Scripts index](../../scripts/README.md) |
| `.github/` | Build, comparison and nightly workflows | Workflow files and Actions results |
| `docs/` | Current guides, navigation material and archives | [Documentation index](../README.md) |
| `_assessment/` | Owner uploads, master plans, status and evidence | [Assessment index](../../_assessment/README.md) |
| `documents/` | Supplied company document | Retained; do not infer an unused document from missing imports |

## Why some folders are retained

Assessment images, baseline manifests and historical screenshots support prior comparisons. Database migrations retain deployment history. Reusable UI primitives can be part of the component library even when no current page mounts them. The Lovable plugin discovers MCP entry points by convention.

None of those are safe deletion candidates based only on an ordinary import graph. The cleanup report records the removed files and the remaining limitations.

## Keep new work organized

- Put current guidance in `docs/`; put superseded guides in `docs/archive/` with a clear entry point.
- Keep owner assessment uploads and active plan paths stable.
- Put temporary logs, coverage and local browser output in ignored directories or outside the checkout.
- Do not commit a `dist/` build or `node_modules/`.
- Verify imports, tests, configuration and platform discovery before deleting a source file. Keep asset URL and live-schema decisions separate.
