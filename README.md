<img src="public/brand/icon-monument.png" alt="Ascent Group Construction" width="64" />

# Ascent Group Construction

The public website and admin workspace for Ascent Group Construction. Visitors can explore services, projects and service areas and submit inquiries. The admin manages content, projects, leads and monitoring.

[Website](https://www.ascentgroupconstruction.com) · [Documentation](docs/README.md) · [Admin master plan](_assessment/admin-upgrade/00-ADMIN-MASTER-PLAN.md) · [Contributing](CONTRIBUTING.md)

## Start here

| Task | Read |
| --- | --- |
| Develop or troubleshoot locally | [Development guide](docs/development/README.md) |
| Understand the folder structure | [Repository map](docs/maintenance/repository-map.md) |
| Follow the website's visual rules | [Design system](docs/design/README.md) |
| Continue admin work | [Master plan](_assessment/admin-upgrade/00-ADMIN-MASTER-PLAN.md) and [implementation status](_assessment/admin-upgrade/MASTER-PLAN-APPLICATION-STATUS.md) |
| Publish or activate backend features | [Operations guide](docs/operations/README.md) |
| Explore page access and navigation | [Navigation audit](docs/navigation/site-navigation-audit.md) and [interactive map](docs/navigation/site-navigation-map.html) |

## Local development

Use **Node.js 24** and **Bun 1.3.11**, matching GitHub Actions. Install through the repository's frozen dependency installer:

```sh
node scripts/install-ci-dependencies.mjs
npm run dev
```

Use the project-approved local environment configuration. The frontend reads `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY` and `VITE_SUPABASE_PROJECT_ID`. Keep server secrets out of frontend variables and commits. The full setup and verification commands are in the [development guide](docs/development/README.md).

## Stack

| Area | Tools |
| --- | --- |
| Application | React, TypeScript, Vite, React Router |
| UI | Tailwind CSS, Radix/shadcn components, Framer Motion |
| Data and forms | TanStack Query, Supabase, React Hook Form, Zod |
| Backend | Supabase database, storage and Edge Functions through Lovable Cloud |
| Hosting | Lovable |

## Repository layout

```text
src/          Application, admin workspace, content defaults and tests
public/       Public assets and hosting files
supabase/     Edge Functions and migration history
drizzle/      Separate database tooling and migration history
docs/         Current guides, navigation documents and historical archive
_assessment/  Owner assessments, admin plans and comparison evidence
scripts/      Build, verification, baseline and monitoring utilities
.github/      GitHub Actions workflows
```

## Publishing and feature activation

Merging a PR does not publish the website. The owner publishes with **Lovable → Publish → Update** and verifies the result as a visitor.

Database migrations, Edge Function deployment, secrets and GitHub Actions scheduling are separate steps. Code availability does not prove a feature is operational. New intake, content overrides and nightly Site Health have their own setup requirements; use the [operations guide](docs/operations/README.md) and current implementation status.

Historical guides and prior validation results live in [the archive](docs/archive/README.md). Original owner assessments remain in [_assessment](_assessment/README.md); their observations must be rechecked against current code.
