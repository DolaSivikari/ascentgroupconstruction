

# Fix: `forwardRef` Crash on Published Site

## Root Cause — Confirmed

The console error says it all:

```
Uncaught TypeError: Cannot read properties of undefined (reading 'forwardRef')
    at vendor-ui-core-BXN8F…js:1:2930
```

The `manualChunks` configuration in `vite.config.ts` splits React into `vendor-react` and Radix UI into `vendor-ui-core`. Rollup does **not guarantee chunk load order**. When `vendor-ui-core` executes before `vendor-react`, the React module is `undefined`, and every `React.forwardRef()` call in Radix crashes immediately. The app never mounts.

This is the exact bug introduced by the earlier chunking changes. The preview works because Vite dev uses esbuild (no manual chunks), but the production build uses Rollup with these broken splits.

## Plan

### 1. Remove `manualChunks` entirely from `vite.config.ts`
Delete lines 51-69 (the entire `manualChunks` block). Vite/Rollup's default automatic code-splitting handles chunk ordering correctly. Manual chunks that separate a library from its peer dependency (React) are fundamentally broken.

### 2. Simplify output file naming
Replace the `Date.now()` timestamp pattern with standard `[name]-[hash]` — the content hash already provides cache busting.

### 3. Remove stale preload links from `index.html`
The preload warnings for `hero-clipchamp.mp4` and `hero-poster-1.webp` indicate these are preloaded in `<head>` but React renders conditionally. Remove or change these to `prefetch` to eliminate the warnings.

### 4. Bump service worker cache version to `4.0.0`
Force cache invalidation again since the previous deploys cached the broken bundles.

## Files Changed

- **`vite.config.ts`** — Remove `manualChunks`, simplify output naming
- **`index.html`** — Change hero asset preloads to prefetch
- **`public/service-worker.js`** — Bump `CACHE_VERSION` to `4.0.0`

## After Implementation
Click **Publish > Update**, then hard-refresh the live site (Ctrl+Shift+R).

