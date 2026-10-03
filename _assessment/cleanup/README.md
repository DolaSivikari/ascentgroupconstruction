# Cleanup evidence entry point

Start with [CLEANUP-REPORT.md](CLEANUP-REPORT.md), then [BASELINE.md](BASELINE.md). This folder records **Phase 0 only**, based on `d504e40` after PR #41. The [owner's request](PHASE-0-REQUEST.md) defines the phases and protected areas. Do not infer approval for later cleanup from the raw candidate lists.

## Reproduce without production access

Make a scratch checkout/archive of the commit being tested outside the working tree, **excluding all `.env` files**. Use the existing frozen dependency installer with Bun 1.3.11 and Node 24:

```sh
node scripts/install-ci-dependencies.mjs
```

Run the normal quality commands there. For a fixture-only production build, provide these deliberately synthetic values directly to the command; do not copy real bindings:

```sh
VITE_SUPABASE_URL=https://baseline.invalid \
VITE_SUPABASE_PUBLISHABLE_KEY=offline-fixture-key \
VITE_SUPABASE_PROJECT_ID=offline-baseline \
bun run build

bun run typecheck:selected
bun x vitest run
bun run validate:sw
bun run lint
node node_modules/typescript/bin/tsc -p tsconfig.app.json --strict --noImplicitAny --noEmit
bun run preview -- --host 127.0.0.1 --port 4190 --strictPort
```

Lint and full strict typing have the recorded baseline failures; required selected typing passes. Do not change configuration to hide these diagnostics.

Install Playwright **in a separate temporary tools directory**, not in this repository. This baseline used Playwright 1.63.0 with system Chromium 151.0.7922.173. Point the script to the temporary module and scratch preview:

```sh
node _assessment/cleanup/smoke/smoke.mjs \
  --repo /path/to/scratch-repository \
  --base http://127.0.0.1:4190 \
  --playwright-module /path/to/temporary-tools/node_modules/playwright/index.mjs \
  --browser /usr/bin/chromium \
  --out /path/to/temporary-results \
  --commit COMMIT_BEING_TESTED \
  --compare /path/to/repository/_assessment/cleanup/smoke/baseline.json
```

`--compare` writes `comparison.json` and a `comparison/` screenshot folder; it reads the old baseline before generating evidence. Omit `--compare` only to create a new baseline intentionally in a separate output folder. Existing evidence must remain archived. A non-loopback base URL is rejected. There is no live-data mode.

The script navigates only; it does not click or submit forms. External HTTP requests are fulfilled with local fixture responses and external WebSockets never connect. All non-read methods are blocked, including loopback writes. Service workers are blocked, analytics consent rejected, reduced motion enabled, and browser date/timezone fixed for comparison. See the baseline's limitations before interpreting a screenshot as live CMS evidence.

The collection checks HTTP/network failures, unexpected render failures and write attempts. Existing console errors are recorded; a comparison fails when their counts change, alongside changes in requested/resolved routes, title, canonical tags, H1, visible-text hash and error views. It deliberately does not require a clean console baseline that the current site lacks. Exact PNG-byte comparison is not automated; browser versions, graphics and fonts can affect pixels. Inspect screenshots when investigating a visual difference.

## Reproduce measurements and graph candidates

[collect-baseline.mjs](raw/collect-baseline.mjs) reads the emitted files plus previously captured JSON/logs. It never reads environment files. Arguments are scratch repository, log directory, output directory and source commit. The [metrics JSON](raw/metrics.json) documents the measured definitions. Keep logs named `build.log`, `selected-types.log`, `tests.log`, `service-worker.log`, `app-types.log`, `install.log`, `full-strict-all-types.log`, `lint.json` and `knip.json` for the collector.

Capture ESLint JSON with the scratch-installed ESLint; it is equivalent to the package's `eslint .` command with a JSON formatter. Capture strict diagnostics with the explicit full strict command above.

Knip 6.39.0 was installed alongside Playwright in the temporary tools directory and invoked without a fix flag:

```sh
node /path/to/temporary-tools/node_modules/knip/bin/knip.js \
  --directory /path/to/scratch-repository \
  --config /path/to/repository/_assessment/cleanup/raw/knip.config.json \
  --reporter json --no-progress
```

Its exit code 1 indicates candidate findings. The full output and separated candidate lists are retained under `raw/`. A candidate is not a deletion permission. Rule 10 requires a complete import/string/config check and unchanged build/smoke results after removal; asset/database limitations and owner approval also apply.
