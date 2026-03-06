

# Fix: Remove `react-quill` / `quill` from Vite manual chunks

The build fails because `vite.config.ts` lists `"react-quill"` and `"quill"` in `manualChunks` (the `vendor-editor` chunk), but neither package is installed.

## Fix

In `vite.config.ts`, delete this line from `manualChunks`:

```
"vendor-editor": ["react-quill", "quill"],
```

That's the only change needed. The build will succeed after removing this reference.

