# Verified environment facts and owner follow-up

Verified 4 October 2026 for Phase 0:

- Repository `DolaSivikari/ascentgroupconstruction` is private (GitHub API metadata).
- PR #46 / R1 merged as `bf6a40b`. The owner confirmed Lovable Publish → Update and a private-window check. The production baseline records that published commit separately from the capture tooling commit.
- The public production sitemap contains 85 URLs. Static public routes add the `/case-studies` redirect: 86 crawler URLs / 85 canonical content pages.
- Production accepted a public, anonymous read-only Chromium crawl from this cloud environment. This does not prove hosting will accept GitHub Actions IP ranges.
- The environment has Node 24, Bun 1.3.11 and Chromium. CI uses the existing frozen lockfile installer; browser tooling is isolated. Application dependencies, environment files, generated client/types and lockfiles are unchanged.
- No uploaded SQL has been applied by Codex. SQL files remain review material under `sql/`.

Still unverified; these are owner/Lovable follow-ups, not permission to make changes:

1. Whether preview and production share a Supabase database, and whether the plan supports staging/branching. Until confirmed, treat preview as live.
2. The exact published-version restore process, and whether it affects functions or data. Git reverts do not roll back databases.
3. Whether hosting supports `AscentSiteHealth/1.0` from GitHub Actions. A 403 stops the crawler.
4. Availability/setup of TOTP MFA for admin users.
5. The Cloud menu for adding function secrets and whether a redeploy is required. Do not share secret values.
6. A second super admin, a five-minute external uptime monitor and available private-repository Actions minutes/storage. Codex has not created users, external monitors or changed billing.

The ready-to-paste read-only Lovable questions are in master plan section 7A. These answers are needed before dependent later phases; they do not authorize migrations, role edits or secret changes in Phase 0.
