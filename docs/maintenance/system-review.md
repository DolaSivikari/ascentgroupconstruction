# Ascent Group Construction — codebase and architecture review

Assessed 10 October 2026. Checkout: `39b28800b511f02b55373869e6e2bb3cffd6734b` (`work`). This includes merged PRs #63 and #64 and the subsequent deletion of `_assessment/`. Assessment only: no application changes, SQL, live writes, emails, deployments or publishing.

## Overall judgment

Keep React + TypeScript + Supabase. Improve boundaries, save reliability, content loading and verification before considering a platform rewrite. There is substantial useful work already present, mixed with older paths and incomplete operational contracts. More languages would add deployment and integration work without fixing the identified defects.

## Coverage and verification

Repository-wide inventory: **679 TS/TSX/CSS files under src, 119,071 lines including tests/content/generated types; 104 test files; 30 Edge Function entry points; 36 Supabase SQL migration files.** Reviewed entrypoints/routing, public pages and heroes, key admin editors, Leads/intake/email, content publishing, auth, storage helpers, SQL contracts, monitoring, SEO, dependency/build and CI configuration. Critical paths were read in detail; this is not a claim that every line or every deployed endpoint was independently validated.

- Frozen dependency installation succeeded using Bun 1.3.11; package.json and bun.lock unchanged. The initial environment had a broken dependency symlink and Bun absent from PATH; reused the installed Bun binary.
- **653 tests / 104 files passed.**
- Full app TypeScript and selected strict TypeScript checks passed.
- Production build, route audit and service-worker validation passed. Build used dummy offline backend configuration, not live credentials.
- Lint **failed: 205 errors / 29 warnings** (155 errors under src, 50 under supabase). 177 messages are explicit-any violations.
- No production browser sweep, live schema/RLS verification, actual email delivery test, vulnerability advisory scan or deployed-function comparison. No restored comparison files or new screenshot comparisons.
- Build generated an incidental MCP file update; that change was restored to HEAD. Repository tracked files remain unchanged.

Raw local verification logs were retained in the execution workspace. See [delivery status](codebase-reliability.md) for implementation and activation boundaries. Auth-related markers in the function inventory are navigation aids, not an authorization audit verdict.

## Architecture and language choices

| Layer | Current choice | Recommendation |
|---|---|---|
| Public site and admin UI | React + TypeScript compiled to JavaScript | Keep. Browsers run JavaScript; Python/Ruby/Go do not replace React directly. |
| Server endpoints | Supabase Edge Functions / Deno / TypeScript | Keep for intake, alerts, publishing and integrations; strengthen contracts and tests. |
| Database | PostgreSQL / SQL / RLS | Use transactions and database constraints for atomic business operations. |
| Automation | Node/TypeScript, shell and GitHub Actions | Keep one supported toolchain; isolate browser tooling. |
| Possible future document/data pipelines | Not a reason to rewrite now | Python could suit OCR/data processing; Go high-throughput workers; Ruby a Rails backend if deliberately replacing the platform. Add only for a measured unmet need. |

This is consistent with a Lovable-generated React/Supabase project; the code alone cannot establish the original reasons each technology was selected. TypeScript is not the cause of long files. Weak typing, scattered business logic and duplicated workflow generations are the relevant issues.

## Prioritized findings

### F01: Deleting the assessment folder broke operational inputs

**High — confirmed broken repository dependency.** HEAD 39b2880 deletes 438 files. Both active inventory.json and intentional-changes.json now return ENOENT. The nightly crawler reads the former unconditionally after sitemap discovery; the PR comparison workflow explicitly passes the latter to a readFile call. The admin setup link, README and AGENTS also point to deleted documents. A normal application build does not exercise these paths.

**Recommended change:** Restore the small active contracts from history, or relocate them to maintained configuration directories and update every consumer in the same change. Archive bulky historical evidence separately. Do not restore hundreds of screenshots merely to recover two JSON contracts.

Evidence: [scripts/site-health/crawl.ts:165](https://github.com/DolaSivikari/ascentgroupconstruction/blob/39b28800b511f02b55373869e6e2bb3cffd6734b/scripts/site-health/crawl.ts#L165) · [.github/workflows/public-safety.yml:112](https://github.com/DolaSivikari/ascentgroupconstruction/blob/39b28800b511f02b55373869e6e2bb3cffd6734b/.github/workflows/public-safety.yml#L112) · [scripts/baseline/compare.ts:38](https://github.com/DolaSivikari/ascentgroupconstruction/blob/39b28800b511f02b55373869e6e2bb3cffd6734b/scripts/baseline/compare.ts#L38) · [src/components/admin/SiteHealthWorkspace.tsx:290](https://github.com/DolaSivikari/ascentgroupconstruction/blob/39b28800b511f02b55373869e6e2bb3cffd6734b/src/components/admin/SiteHealthWorkspace.tsx#L290)

### F02: Some email failures are ignored by the public forms

**High — confirmed error-handling defect; legacy path.** Estimate awaits functions.invoke but does not inspect its returned error. Contact similarly races an invoke result against a timeout without checking that result. Supabase function failures commonly resolve as {data,error}; they need not throw. Consequently the catch/warning path misses those failures. This does not mean the lead itself failed to save, and it does not prove current email delivery is failing.

**Recommended change:** Introduce one checked function-call helper immediately. Then move remaining legacy notifications behind durable server intake, with delivery records and retries, following the existing newer inquiry implementation.

Evidence: [src/pages/Estimate.tsx:427](https://github.com/DolaSivikari/ascentgroupconstruction/blob/39b28800b511f02b55373869e6e2bb3cffd6734b/src/pages/Estimate.tsx#L427) · [src/pages/Contact.tsx:161](https://github.com/DolaSivikari/ascentgroupconstruction/blob/39b28800b511f02b55373869e6e2bb3cffd6734b/src/pages/Contact.tsx#L161) · [src/hooks/useInquirySubmit.ts:27](https://github.com/DolaSivikari/ascentgroupconstruction/blob/39b28800b511f02b55373869e6e2bb3cffd6734b/src/hooks/useInquirySubmit.ts#L27) · [supabase/functions/_shared/inquiry-alerts.ts:14](https://github.com/DolaSivikari/ascentgroupconstruction/blob/39b28800b511f02b55373869e6e2bb3cffd6734b/supabase/functions/_shared/inquiry-alerts.ts#L14)

### F03: A project can be partly published after a failed Save

**High — confirmed non-atomic save design; failure-dependent.** ProjectEditor writes the main project record, including publish_state, before saveProjectRelationships saves images and services through multiple REST calls. A later failure retains the editor draft and reports an error, but cannot undo the already committed project change. The project update also lacks an expected updated_at condition, unlike the newer inquiry editor: concurrent editors can overwrite each other. No live partial-save experiment was performed.

**Recommended change:** Use one transactional project-save RPC with a version/updated_at guard for the record and relationships. Keep it draft until publication can be committed consistently. This improvement would require a separately reviewed database change; none was applied here.

Evidence: [src/pages/admin/ProjectEditor.tsx:302](https://github.com/DolaSivikari/ascentgroupconstruction/blob/39b28800b511f02b55373869e6e2bb3cffd6734b/src/pages/admin/ProjectEditor.tsx#L302) · [src/lib/admin/projectPersistence.ts:59](https://github.com/DolaSivikari/ascentgroupconstruction/blob/39b28800b511f02b55373869e6e2bb3cffd6734b/src/lib/admin/projectPersistence.ts#L59) · [src/lib/inquiry/api.ts:32](https://github.com/DolaSivikari/ascentgroupconstruction/blob/39b28800b511f02b55373869e6e2bb3cffd6734b/src/lib/inquiry/api.ts#L32)

### F04: Published page edits can be skipped on a slow first visit

**High — code-traced timing defect; overrides must be enabled.** bootstrapContent gives the override fetch 600 ms before mounting React. useResolvedContent then freezes the initial values and enabled flag using a memo keyed only by module.id. If the first published response arrives after that mount, the store emits but the mounted page continues using its initial defaults. Lazy routes that mount after the response may behave differently. Thus network timing can determine whether saved edits appear. This is source-level tracing, not a reproduction against the production backend.

**Recommended change:** Define a deliberate loading contract: preload a compact per-route published snapshot, or permit one controlled transition when initial content arrives. Avoid fetching the entire site to render one page. Add a delayed-response regression test.

Evidence: [src/main.tsx:20](https://github.com/DolaSivikari/ascentgroupconstruction/blob/39b28800b511f02b55373869e6e2bb3cffd6734b/src/main.tsx#L20) · [src/lib/content/store.ts:87](https://github.com/DolaSivikari/ascentgroupconstruction/blob/39b28800b511f02b55373869e6e2bb3cffd6734b/src/lib/content/store.ts#L87) · [src/lib/content/store.ts:154](https://github.com/DolaSivikari/ascentgroupconstruction/blob/39b28800b511f02b55373869e6e2bb3cffd6734b/src/lib/content/store.ts#L154)

### F05: Route import failures become a permanent placeholder for that session

**Medium — confirmed failed-import behavior.** lazyWithFallback catches the rejected import and resolves to a component saying Failed to load. React.lazy caches this resolved fallback; navigating away and back does not automatically retry the module. The original exception is discarded, and the placeholder offers no recovery action. This is especially relevant to the historical missing-chunk incidents, but their original live causes were not reproduced.

**Recommended change:** Use a route loading boundary that records the original error and presents an explicit safe retry/reload action. Preserve unsaved forms; do not introduce unconditional automatic refreshes.

Evidence: [src/routes/AppRoutes.tsx:11](https://github.com/DolaSivikari/ascentgroupconstruction/blob/39b28800b511f02b55373869e6e2bb3cffd6734b/src/routes/AppRoutes.tsx#L11) · [src/components/DeferredBoundary.tsx:1](https://github.com/DolaSivikari/ascentgroupconstruction/blob/39b28800b511f02b55373869e6e2bb3cffd6734b/src/components/DeferredBoundary.tsx#L1)

### F06: TypeScript is present, but much of its protection is disabled

**Medium — verified quality debt.** The full app config sets strict=false and noImplicitAny=false. The selected strict config names only eight entry files (their imported dependencies are included too). Current lint reports 205 errors and 29 warnings; 177 messages are no-explicit-any. Optional content/inquiry tables have handwritten schema facades and casts because generated types do not describe all of them. Passing the full compiler therefore does not imply comprehensive strict type safety.

**Recommended change:** Regenerate types only from a verified schema through the approved workflow, retain explicit optional-feature capability checks, validate runtime boundaries, and expand strict checking feature by feature. Start with inquiry intake and publishing rather than changing every file in one PR.

Evidence: [tsconfig.app.json:14](https://github.com/DolaSivikari/ascentgroupconstruction/blob/39b28800b511f02b55373869e6e2bb3cffd6734b/tsconfig.app.json#L14) · [tsconfig.selected-strict.json:1](https://github.com/DolaSivikari/ascentgroupconstruction/blob/39b28800b511f02b55373869e6e2bb3cffd6734b/tsconfig.selected-strict.json#L1) · [src/lib/admin/optionalDatabase.ts:5](https://github.com/DolaSivikari/ascentgroupconstruction/blob/39b28800b511f02b55373869e6e2bb3cffd6734b/src/lib/admin/optionalDatabase.ts#L5) · [src/lib/inquiry/types.ts:1](https://github.com/DolaSivikari/ascentgroupconstruction/blob/39b28800b511f02b55373869e6e2bb3cffd6734b/src/lib/inquiry/types.ts#L1)

### F07: The checked-in CI does not enforce all documented checks

**Medium — verified CI coverage gap.** The smoke workflow runs Vitest, build, route audit and service-worker checks; the other build workflow builds again. None of the checked-in workflows runs the full/selected tsc commands or lint. Vitest is configured around src tests; some shared backend helpers are tested through those tests, but this is not a complete Edge Function or RLS/database integration suite. HTTP smoke checks can pass when a SPA route returns an HTML shell but its React page fails.

**Recommended change:** Use one reusable quality job for build/type/lint/test tasks, retain a controlled lint-debt baseline, and add targeted disposable-database/Edge Function contract tests for save/publish/roles/intake. Restore and maintain browser replay fixtures instead of interpreting HTTP 200 as successful rendering.

Evidence: [.github/workflows/smoke-test.yml:44](https://github.com/DolaSivikari/ascentgroupconstruction/blob/39b28800b511f02b55373869e6e2bb3cffd6734b/.github/workflows/smoke-test.yml#L44) · [.github/workflows/lighthouse-ci.yml:1](https://github.com/DolaSivikari/ascentgroupconstruction/blob/39b28800b511f02b55373869e6e2bb3cffd6734b/.github/workflows/lighthouse-ci.yml#L1) · [vitest.config.ts:7](https://github.com/DolaSivikari/ascentgroupconstruction/blob/39b28800b511f02b55373869e6e2bb3cffd6734b/vitest.config.ts#L7) · [scripts/smoke-test.sh:40](https://github.com/DolaSivikari/ascentgroupconstruction/blob/39b28800b511f02b55373869e6e2bb3cffd6734b/scripts/smoke-test.sh#L40)

### F08: The entry JavaScript is large

**Medium — measured optimization opportunity.** A fresh production build emits an entry script of approximately 1.90 MB minified, reported by Vite as 471.65 kB gzip. The PDF chunk is about 1.24 MB, but that is a separate lazy feature and must not be confused with initial loading. Large chunks are a performance concern, not proof of a bad user experience on a particular device. This audit did not measure live LCP/INP or map every dependency to its byte cost.

**Recommended change:** Use module-provenance analysis to identify the largest eager dependencies and data. Keep admin/editor/PDF features lazy, trim public startup work, and measure transfer plus parse/execute time on a midrange phone. Do not hide the warning by increasing the chunk limit.

Evidence: [vite.config.ts:54](https://github.com/DolaSivikari/ascentgroupconstruction/blob/39b28800b511f02b55373869e6e2bb3cffd6734b/vite.config.ts#L54) · [src/routes/AppRoutes.tsx:8](https://github.com/DolaSivikari/ascentgroupconstruction/blob/39b28800b511f02b55373869e6e2bb3cffd6734b/src/routes/AppRoutes.tsx#L8) · [src/pages/Index.tsx:1](https://github.com/DolaSivikari/ascentgroupconstruction/blob/39b28800b511f02b55373869e6e2bb3cffd6734b/src/pages/Index.tsx#L1)

### F09: The content layer loads the whole site for individual pages

**Medium — confirmed scaling/design issue.** The public override loader selects all published entries in 1,000-row batches up to 20,000. The admin Pages workspace similarly loads all entries, and its content-module registry loads every page module. This is workable at current scale but makes initial loading and admin startup grow with all content, exacerbating the 600 ms race.

**Recommended change:** Separate a small page directory from per-page fields; query only the current page plus shared modules, use caching/versioned published snapshots, and load editor modules on demand.

Evidence: [src/lib/content/store.ts:54](https://github.com/DolaSivikari/ascentgroupconstruction/blob/39b28800b511f02b55373869e6e2bb3cffd6734b/src/lib/content/store.ts#L54) · [src/lib/content/admin.ts:8](https://github.com/DolaSivikari/ascentgroupconstruction/blob/39b28800b511f02b55373869e6e2bb3cffd6734b/src/lib/content/admin.ts#L8) · [src/content/registry.ts:8](https://github.com/DolaSivikari/ascentgroupconstruction/blob/39b28800b511f02b55373869e6e2bb3cffd6734b/src/content/registry.ts#L8) · [src/pages/admin/Pages.tsx:47](https://github.com/DolaSivikari/ascentgroupconstruction/blob/39b28800b511f02b55373869e6e2bb3cffd6734b/src/pages/admin/Pages.tsx#L47)

### F10: Several screens still combine too many responsibilities

**Medium — maintainability.** ProjectDetail is 833 lines, BlogPostEditor 823, ProjectImageManager 762, Estimate 761, EnhancedHero 735 and ServiceDetail 691. These combine display, state, validation, data access or business rules to varying degrees. There are 140 src files importing the main Supabase client; this is a coupling signal, not 140 defects. Some lengthy components contain legitimate detailed UI and should not be split arbitrarily.

**Recommended change:** Organize by feature: page composition, section components, data queries/mutations, schemas and pure business rules. Extract save/intake behavior first, because it carries correctness risk. Reuse the existing lib/leads and lib/inquiry patterns rather than adding a second framework.

Evidence: [src/pages/admin/BlogPostEditor.tsx:84](https://github.com/DolaSivikari/ascentgroupconstruction/blob/39b28800b511f02b55373869e6e2bb3cffd6734b/src/pages/admin/BlogPostEditor.tsx#L84) · [src/pages/Estimate.tsx:325](https://github.com/DolaSivikari/ascentgroupconstruction/blob/39b28800b511f02b55373869e6e2bb3cffd6734b/src/pages/Estimate.tsx#L325) · [src/pages/ServiceDetail.tsx:1](https://github.com/DolaSivikari/ascentgroupconstruction/blob/39b28800b511f02b55373869e6e2bb3cffd6734b/src/pages/ServiceDetail.tsx#L1)

### F11: Opaque content keys make editing harder to understand

**Low/medium — maintainability.** Content files use keys such as f001/f002 and separate metadata records, then pages reference c.f005. This supports the generic editor but makes source changes hard to follow and creates many lines of mechanical mapping. The longest files are often content/defaults or generated database types, not inefficient algorithms.

**Recommended change:** Use semantic names for new content, and gradually introduce structured section schemas for repeated patterns. Existing keys may be persisted in the database: never blindly rename them or delete defaults. Migrate aliases deliberately and keep protected wording locked.

Evidence: [src/content/pages/about.ts:1](https://github.com/DolaSivikari/ascentgroupconstruction/blob/39b28800b511f02b55373869e6e2bb3cffd6734b/src/content/pages/about.ts#L1) · [src/pages/About.tsx:217](https://github.com/DolaSivikari/ascentgroupconstruction/blob/39b28800b511f02b55373869e6e2bb3cffd6734b/src/pages/About.tsx#L217) · [src/content/pages/privacy.ts:1](https://github.com/DolaSivikari/ascentgroupconstruction/blob/39b28800b511f02b55373869e6e2bb3cffd6734b/src/content/pages/privacy.ts#L1)

### F12: Local editor autosave serializes the entire form on every change

**Low/medium — code-confirmed synchronous work.** useLocalDraft runs JSON.stringify and synchronous localStorage.setItem each time data changes. It correctly keeps drafts local, but rich text and image-heavy forms can make this more expensive as content grows. Actual typing latency has not been benchmarked.

**Recommended change:** Debounce local saves, show pending/saved state accurately, flush safely on explicit save/navigation, and consider IndexedDB only if measured data sizes justify it.

Evidence: [src/hooks/useLocalDraft.ts:20](https://github.com/DolaSivikari/ascentgroupconstruction/blob/39b28800b511f02b55373869e6e2bb3cffd6734b/src/hooks/useLocalDraft.ts#L20) · [src/pages/admin/BlogPostEditor.tsx:102](https://github.com/DolaSivikari/ascentgroupconstruction/blob/39b28800b511f02b55373869e6e2bb3cffd6734b/src/pages/admin/BlogPostEditor.tsx#L102)

### F13: Telemetry needs explicit redaction and reliable write handling

**Medium — hardening; no breach demonstrated.** The logger stores window.location.href including query parameters, arbitrary context/additional console arguments and raw errors. These can contain contact information or capability-like URLs. It also awaits insert without inspecting the returned error. Private prequalification package pages intentionally skip logger initialization, which is a useful safeguard, but does not provide general redaction.

**Recommended change:** Allowlist diagnostic fields, strip query/hash and sensitive values, deduplicate/rate-limit reports, and distinguish telemetry write failure without recursively logging it. Define retention. Do not interpret old log groups as active failures.

Evidence: [src/utils/errorLogger.ts:13](https://github.com/DolaSivikari/ascentgroupconstruction/blob/39b28800b511f02b55373869e6e2bb3cffd6734b/src/utils/errorLogger.ts#L13) · [src/utils/errorLogger.ts:100](https://github.com/DolaSivikari/ascentgroupconstruction/blob/39b28800b511f02b55373869e6e2bb3cffd6734b/src/utils/errorLogger.ts#L100) · [src/main.tsx:16](https://github.com/DolaSivikari/ascentgroupconstruction/blob/39b28800b511f02b55373869e6e2bb3cffd6734b/src/main.tsx#L16)

### F14: Abuse controls fail open and legacy intake remains broad

**Medium — security/resilience tradeoff; live state unverified.** The shared rate limiter explicitly returns allowed=true on RPC errors and exceptions. The legacy estimate still writes directly to public insert tables; historical migrations allow those inserts with CHECK(true). Newer submit-form has validation/spam checks, but direct writes do not automatically inherit them. Live grants/policies and gateway header trust were not inspected, so this is not a claim of a currently exploitable live endpoint.

**Recommended change:** Choose fail-open/fail-closed behavior per operation: preserve a durable lead where possible while restricting costly email/AI operations. Complete the server intake transition before reviewing retirement of anonymous legacy inserts. Test actual permissions in an isolated database.

Evidence: [supabase/functions/_shared/rateLimiter.ts:34](https://github.com/DolaSivikari/ascentgroupconstruction/blob/39b28800b511f02b55373869e6e2bb3cffd6734b/supabase/functions/_shared/rateLimiter.ts#L34) · [src/pages/Estimate.tsx:367](https://github.com/DolaSivikari/ascentgroupconstruction/blob/39b28800b511f02b55373869e6e2bb3cffd6734b/src/pages/Estimate.tsx#L367) · [supabase/functions/submit-form/index.ts:13](https://github.com/DolaSivikari/ascentgroupconstruction/blob/39b28800b511f02b55373869e6e2bb3cffd6734b/supabase/functions/submit-form/index.ts#L13)

### F15: SEO still depends heavily on JavaScript rendering

**Medium — architecture limitation; hosting behavior unverified.** This build is a client-rendered SPA with route metadata supplied by Helmet. The emitted index.html contains generic company title/social metadata; the Vite configuration has no route HTML prerender step. A crawler that does not execute JavaScript cannot get route-specific content from this build alone. The hosting platform may apply behavior not represented here; this audit did not verify it or diagnose rankings.

**Recommended change:** First inspect initial HTML from real service/city/article URLs. If generic, consider static prerendering those public pages, keeping the interactive admin as a SPA. This can remain TypeScript; a Python/Ruby/Go rewrite is not required.

Evidence: [index.html:95](https://github.com/DolaSivikari/ascentgroupconstruction/blob/39b28800b511f02b55373869e6e2bb3cffd6734b/index.html#L95) · [src/components/SEO.tsx:1](https://github.com/DolaSivikari/ascentgroupconstruction/blob/39b28800b511f02b55373869e6e2bb3cffd6734b/src/components/SEO.tsx#L1) · [vite.config.ts:54](https://github.com/DolaSivikari/ascentgroupconstruction/blob/39b28800b511f02b55373869e6e2bb3cffd6734b/vite.config.ts#L54) · [scripts/verify-public-html.ts:1](https://github.com/DolaSivikari/ascentgroupconstruction/blob/39b28800b511f02b55373869e6e2bb3cffd6734b/scripts/verify-public-html.ts#L1)

### F16: Dependency and tooling ownership needs tightening

**Low — cleanup candidates, not confirmed runtime defects.** react-spring is declared but a repository source/config import search found no consumer; the direct Tiptap Link package is not imported separately because StarterKit already supplies Link. Drizzle has configuration/history but a blank generated schema, while Supabase owns the active application schema. These are review candidates, not permission to delete history or blindly remove transitive packages. The test runner also emits future Vite config/deprecation warnings.

**Recommended change:** Remove only verified unused direct dependencies through the normal lockfile workflow; document Drizzle ownership; plan compatible tooling updates as a separate task. Package age, file length and warnings alone do not prove a security vulnerability. No current registry/advisory audit was performed.

Evidence: [package.json:1](https://github.com/DolaSivikari/ascentgroupconstruction/blob/39b28800b511f02b55373869e6e2bb3cffd6734b/package.json#L1) · [src/components/admin/RichTextEditor.tsx:40](https://github.com/DolaSivikari/ascentgroupconstruction/blob/39b28800b511f02b55373869e6e2bb3cffd6734b/src/components/admin/RichTextEditor.tsx#L40) · [drizzle/schema.ts:1](https://github.com/DolaSivikari/ascentgroupconstruction/blob/39b28800b511f02b55373869e6e2bb3cffd6734b/drizzle/schema.ts#L1) · [vitest.config.ts:14](https://github.com/DolaSivikari/ascentgroupconstruction/blob/39b28800b511f02b55373869e6e2bb3cffd6734b/vitest.config.ts#L14)

## What should be preserved

- New inquiry submissions have validation, stable retry keys and server result checks. Lead updates use optimistic concurrency; list loading uses bounded cursor pagination.
- Rich text is sanitized, and the current Tiptap editor configures Link once through StarterKit. Do not add a second Link extension.
- Public settings use a separate anonymous client with explicit column projections. Admin authorization rechecks roles rather than trusting a cached UI flag.
- Published content uses draft/publish RPCs and history contracts; this is a good foundation despite the loading defect.
- Service-worker updates preserve open forms/editors. Optional deferred UI has error containment.
- Shared hero components, scoped admin layout, UI primitives and theme tokens already exist. Button/Card compatibility files are often re-exports, not duplicate implementations.
- Keep actual project photography, protected content and credential wording. No visual redesign is justified by this structural review.

## Recommended delivery order

1. **Repair active repository contracts:** inventory, comparison declarations and setup links. Keep runtime configuration separate from historical audit evidence.
2. **Fix reliability:** checked function results, recoverable route loading and deterministic published-content loading. Add narrow failure-path regressions.
3. **Make project saves atomic and concurrency-safe:** prepare the RPC contract and review SQL separately. Preserve user edits on rejection.
4. **Consolidate features incrementally:** intake/notifications first; project/blog/service editor persistence next; shared data/query boundaries afterward. Do not remove legacy reads until the migration and usage evidence support retirement.
5. **Improve typing and CI:** generate verified schema types, expand strict coverage and enforce a shrinking lint baseline. Test critical SQL/function contracts against disposable fixtures.
6. **Optimize measured bottlenecks:** entry bundle, route-specific content fetches, editor autosave and initial public HTML. Benchmark before/after.

Suggested destination, introduced gradually rather than by mass moves:

```text
src/
  app/                 routing, providers, startup
  features/
    leads/             components, queries, mutations, schemas
    projects/          editor, public presentation, persistence
    content/           contracts, publishing, page settings
  components/          shared UI and page primitives
  content/             defaults and field definitions
  integrations/        Supabase clients and generated contracts
supabase/              migrations, functions, shared backend helpers
config/                active route/comparison/monitoring contracts
docs/                  maintained guides; archive for historical reports
```

One application with clear feature boundaries is enough. Microservices and a multi-language rewrite are not warranted by the evidence.

## Matters that remain unverified

Live schema/grants/triggers, enabled content/intake flags, deployed function revisions, provider sender verification, token/secret configuration, successful nightly ingestion and seven-night alert pilot. Migration files and passing unit tests cannot establish these. Historical WebSocket, refresh-token, this.o.at and object-not-found log causes remain unverified by this audit. Keep these distinct from the current code-confirmed findings.
