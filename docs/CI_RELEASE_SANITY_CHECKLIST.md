# CI & Release Sanity Checklist

Use this lightweight checklist before merging release-sensitive changes.

## Command parity

- [ ] Commands used in CI workflows are available in `package.json` scripts or project dependencies.
- [ ] Route audit command in CI matches local execution method.
- [ ] Build command in CI matches local production build command.

## Script/doc parity

- [ ] `scripts/README.md` reflects scripts that actually exist.
- [ ] Deprecated/missing script references are removed.

## Runtime asset sanity

- [ ] Service worker precache list references files that exist in `public/`.
- [ ] Redirect and header files (`public/_redirects`, `public/_headers`) were validated after edits.

## Merge gate

- [ ] `npm run build` passes.
- [ ] Route audit passes.
- [ ] Smoke test run completed against target environment (or intentionally skipped with reason).
