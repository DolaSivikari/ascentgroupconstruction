

# Build Error Fix Plan

Your website can't publish because several files have duplicate/overlapping code causing build failures. Here are the fixes needed:

## 1. `src/App.tsx` -- Delete duplicate route tree (lines 54-226)

Lines 31-53 contain the correct App component using `<AppRoutes />`. Lines 54-226 are a stale duplicate with inline routes and references to components that aren't imported. Delete lines 54-226 entirely, keeping only the clean version that properly closes all JSX tags.

## 2. `src/hooks/useActiveSettings.ts` -- Consolidate duplicate function

The file has two overlapping `fetchActiveSettingsRow` declarations tangled together. Rewrite as a single clean function using `tableName as any` cast.

## 3. `src/routes/AppRoutes.tsx` -- Fix duplicate declarations

Lines 83-84 have `const serviceRoutes = (` immediately followed by `const ServiceRouteGroup = () => (` -- two overlapping declarations. Same issue at lines 123-124 with admin routes. And lines 192-193 and 224-225 reference both old and new names. Fix: keep only the component versions (`ServiceRouteGroup`, `AdminRouteGroup`) and remove the stale `const` variable assignments and their duplicate references.

## 4. `src/data/service-faqs-enriched.ts` -- Remove duplicate answer property

Lines 35-37 have two `answer:` properties for the same FAQ object -- one using backticks (line 36) and one using single quotes (line 37). Remove the backtick version (line 36) and keep the escaped single-quote version (line 37) which is syntactically correct.

## 5. `src/pages/admin/DocumentsLibrary.tsx` -- Remove duplicate JSX tags

Line 243 is a duplicate `<Dialog>` opening tag (line 242 already has it). Remove line 243.

## 6. `supabase/functions/_shared/errorHandler.ts` -- Fix `unknown` type access

All `error` parameters typed as `unknown` need casting. Change `error: unknown` to `error: any` in all three functions (`sanitizeErrorMessage`, `createErrorResponse`, `logSecurityError`) to resolve the 11 TS2339 property-access errors.

---

All fixes are duplicate-line removals or simple type changes with no logic changes.

