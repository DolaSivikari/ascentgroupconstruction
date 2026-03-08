

# Update All npm Dependencies

## Approach

Review every dependency in `package.json` and bump version specifiers to the latest compatible releases. Key considerations:

- **React** stays at 18.x (React 19 would require migration work across many libraries)
- **Vite** stays at 5.x (6.x has breaking changes)
- **Tailwind** stays at 3.x (4.x is a full rewrite)
- All other packages get bumped to latest within their current major version range
- Packages already on latest will be left as-is

## Notable Updates Expected

| Package | Current | Target | Notes |
|---|---|---|---|
| `lucide-react` | ^0.554.0 | latest 0.x | Frequent releases |
| `@tanstack/react-query` | ^5.90.10 | latest 5.x | |
| `framer-motion` | ^12.23.24 | latest 12.x | |
| `date-fns` | ^3.6.0 | latest 3.x or 4.x | Check breaking changes |
| `zod` | ^4.1.12 | latest 4.x | |
| `react-hook-form` | ^7.66.1 | latest 7.x | |
| `sonner` | ^1.7.4 | latest 1.x | |
| `recharts` | ^3.4.1 | latest 3.x | |
| DevDeps (`eslint`, `typescript`, etc.) | current | latest compatible | |

Since all versions use `^` (caret ranges), `npm install` already resolves to latest compatible. The actual change is bumping the **minimum** specifier in `package.json` to document current baseline and catch any issues.

## Risk

Low — all updates stay within semver-compatible ranges. The build will validate that nothing breaks.

