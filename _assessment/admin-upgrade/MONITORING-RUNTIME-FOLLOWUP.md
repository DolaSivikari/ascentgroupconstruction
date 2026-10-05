# Monitoring and runtime follow-up

2026-10-05. Base: merged PR #52, main `77266a7`.

## Evidence and changes

The owner supplied recorded error groups dated April–October 2026. These records are useful evidence of past failures, but do not prove they still occur in the current published build. This work uses current code and offline reproductions; it does not read, clear or alter live error records.

- **Projects WebSocket:** the SDK synchronously throws on socket construction, while the old hook called it inside an async function without awaiting/catching it. The new hook contains setup/status/cleanup failures and logs the handled failure with feature context. The normal published-project HTTP fetch remains available. Delivered row changes re-fetch the published snapshot rather than applying changes to the initial empty array. Initial fetches and refreshes reject stale/unmounted results. This does **not** verify or correct the production socket URL; realtime may remain unavailable until the host/backend configuration is checked.
- **Lazy chunks:** the homepage and optional app controls previously relied on the outer page error boundary. Independent boundaries now contain a rejected chunk or render failure. Homepage failures show a local refresh instruction while the hero, footer, other sections and entered form data in unaffected sections remain available. Optional controls can disappear on failure. No automatic page reload, cache deletion or loss of editor/form state is introduced. These boundaries do not guarantee that old deployed chunk URLs remain available.
- **Null homepage lists:** successful null list responses now become empty arrays. This closes a concrete list-contract weakness; the historical null-length event lacks a stack identifying its actual source, so it is not claimed as reproduced or conclusively fixed.
- **Monitoring:** default to the past seven days with a server date filter; retain an explicit older-records option. State the 50-record limit and distinguish recorded status from verified site health. Latest event details include browser, original stack and context. Existing stored records remain intact.
- **Diagnostics:** unhandled rejections keep their original stack and error name/message; future telemetry includes a bundle/module version. Crawler telemetry exclusion remains intact. No new diagnostic test writes to the database.
- **Site Health:** keep the truthful setup notice and add a direct link to the existing Phase 2 checklist. The current code reports that nightly monitoring is unavailable. Its schema, deployed functions, token and scheduler remain deferred backend activation. This PR does not connect or simulate nightly results.

The minified `this.o.at` and `Object Not Found Matching Id` messages cannot be assigned to application code from their messages alone. No current application `.at()` call was found. Refresh-token and older project/object errors were not reproduced. No speculative polyfill, role change, auth reset or error suppression was added.

## Verification and limits

- 16 focused offline tests across five files pass: lazy-import rejection containment and form-value preservation, WebSocket setup and cleanup failures, subscription callbacks, monitoring date/history access, rejection stack retention, crawler exclusion, visitor diagnostics and null list responses.
- Full app and selected strict TypeScript pass.
- Production build passes with existing chunk-size warnings.
- Scoped ESLint passes for new tests/components/hook and changed monitoring components.
- Service-worker validation, route audit and whitespace checks are recorded in the PR.
- Full suite, repository-wide lint/bundle comparisons, all-page browser/screenshot replay, authenticated admin and live reproduction are skipped, consistent with the owner's request for focused checks.

No SQL, database/storage writes, email, secrets, function deployment, merge or publishing is performed. Successful public content/design is unchanged; failure-state changes are declared for Home and Projects in the existing intentional-changes file. Optional app-control containment applies site-wide.
