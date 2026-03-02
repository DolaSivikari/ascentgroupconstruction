

# Build Error Fix Plan

Two files have syntax errors preventing the build:

## 1. `src/components/navigation/AppLink.tsx` - Duplicate/Malformed Code

The file contains two overlapping route validation blocks (lines 59-71) - the newer `isKnownRoute` check and the older `KNOWN_ROUTES.some()` check are tangled together, and the function is missing its closing brace. 

**Fix:** Remove the duplicate legacy validation block and properly close the `if` statement and function. The file should use only the `isKnownRoute` check from `@/routes/registry`, making the hardcoded `KNOWN_ROUTES` array and the old validation block unnecessary.

## 2. `src/data/service-faqs-enriched.ts` - Unescaped Apostrophes in String

Line 36 contains a massive single-quoted string (~7000+ chars) with unescaped apostrophes (e.g., `team's`, `don't`) that break the string literal at column 6753+.

**Fix:** Escape all apostrophes in the line 36 answer string (replace `'` with `\'` inside the string), or convert it to use backtick template literals to avoid escaping issues entirely.

Both are straightforward syntax fixes with no logic changes.

