# Scripts Reference

This folder contains operational and developer utility scripts used by CI and local verification.

## Active scripts

- `scripts/smoke-test.sh`
  - Production-oriented SPA smoke checks (availability, route fallback, core assets, optional Supabase function reachability).

- `scripts/audit-routes.ts`
  - Route integrity audit; extracts route paths from `src/App.tsx` and checks internal `to`/`href` links in `src/`.

- `scripts/validate-sw.js`
  - Validates that the built service worker contains required lifecycle handlers.

- `scripts/verify-headers.js`
  - Verifies `_headers` syntax/consistency.

- `scripts/check-console-errors.js`
  - Optional browser-based console error scanner for a running URL.

- `scripts/design-audit.js`, `scripts/design-lint.js`
  - Optional design-system consistency checks.

- `scripts/convert-images.js`
  - Optional image conversion utility.

- `scripts/auto-fix-imports.js`
  - Optional codemod utility for import and class migration (dry-run by default).

## Notes

- Some scripts are optional tooling and are not part of required CI gates.
- CI-required checks are defined in `.github/workflows/*.yml`.
