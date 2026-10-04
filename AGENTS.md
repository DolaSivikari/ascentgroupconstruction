# Ascent Group Construction

- Read `_assessment/admin-upgrade/00-ADMIN-MASTER-PLAN.md` first for admin work. It governs phase order and scope; files 12–16 supply referenced details. Read the relevant implementation status before editing. Trust verified code and deployed inventory over stale counts in the documents.
- One named phase per branch/PR. Do not merge, publish, deploy functions, change secrets, run migrations, or write to live databases/storage. Treat Lovable preview as production. Keep tests offline with fixtures. Production baseline capture is public, anonymous and read-only.
- Preserve public design and the master plan's protected components, navigation, contact constants and credential wording. Declare any intended public change by page and field in `_assessment/baseline/intentional-changes.json` and include comparison artifacts.
- Do not change `.env`, generated Supabase client/types, `.lovable`, or hand-edit lockfiles. Uploaded SQL under `_assessment/admin-upgrade/sql/` is unapplied reference material unless the owner authorizes its specific migration phase.
- Use the existing frozen dependency installer (`scripts/install-ci-dependencies.mjs`) for CI. Browser tooling is isolated from the application packages. Do not add application dependencies for the baseline.
- Required checks: full Vitest, selected and full app TypeScript, production build, service-worker validation, route audit, applicable public comparison and bundle gates, lint at or below 288 errors / 34 warnings with new files clean, and `git diff --check`.
- Report failures, skips, coverage limits and current page counts precisely. A merge does not publish; the owner uses Lovable Publish → Update and checks in a private window.
