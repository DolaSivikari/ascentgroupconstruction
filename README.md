# Ascent Group Construction Web Platform

## 1) Project overview

This repository contains the public website and admin platform for Ascent Group Construction. It is a React + TypeScript single-page application (SPA) with Supabase-backed data, forms, and admin modules.

At a high level, the codebase currently includes:
- Public marketing and service pages
- Lead-generation flows (contact, estimate, RFP, newsletter)
- Admin content and settings management under `/admin/*`
- CI smoke and route-audit checks intended to catch route drift and deployment regressions

Recent stabilization work focused on route integrity, CI/smoke truthfulness, and surfacing silent failure states in lead flows/settings.

---

## 2) Tech stack

### Frontend
- React 18 + TypeScript
- Vite 5 (`@vitejs/plugin-react-swc`)
- React Router v6
- Tailwind CSS + shadcn/ui + Radix UI
- TanStack Query

### Backend / data / integrations
- Supabase (`@supabase/supabase-js`)
  - PostgreSQL
  - Auth
  - Storage
  - Edge Functions (for submission/notification workflows)
- Form validation with `react-hook-form` + `zod`

### Build / quality / CI
- ESLint
- GitHub Actions (`smoke-test.yml`, `lighthouse-ci.yml`)
- Custom scripts:
  - `scripts/smoke-test.sh`
  - `scripts/audit-routes.ts`
  - `scripts/validate-sw.js`

### Hosting / deployment
- **Confirmed:** Lovable project linkage and documentation for manual publish/domain management exists in-repo.
- **Not fully proven from repo alone:** whether production is always auto-deployed from `main`, or requires manual Lovable publish in some cases.

---

## 3) Key features

### Public site
- Core pages: home, about, services, projects, contact, estimate, RFP, insights/blog, legal pages
- Service detail and service-related redirect paths
- Route-level fallbacks (`/404` and catch-all)

### Lead generation
- Contact submission flow
- Estimate request flow
- RFP submission flow
- Newsletter subscription persistence to Supabase (`newsletter_subscribers`)

### Admin capabilities (`/admin/*`)
- Dashboard and unified admin layout
- Services, projects, blog, media, users
- Unified inbox for submissions
- Settings, SEO, redirects, performance/search analytics, monitoring/audit views
- Homepage/navigation management modules

### Settings / business modules
- Company/site settings hooks with explicit error/warning behavior when expected rows are missing
- Business/admin pages and utilities for operations workflows (see docs map below)

---

## 4) Project structure

```text
src/
  components/        UI, navigation, admin, homepage, blog, etc.
  pages/             Route components (public + admin)
  hooks/             Data/settings hooks
  integrations/      External integration clients (including Supabase)
  data/              Navigation and static configuration data
  utils/             Route and shared utility helpers

public/
  _redirects         Redirect + SPA fallback rules

scripts/
  smoke-test.sh      Production smoke checks (SPA + optional Supabase endpoint reachability)
  audit-routes.ts    Route/link integrity audit against src/App.tsx
  validate-sw.js     Service-worker validation utility

.github/workflows/
  smoke-test.yml
  lighthouse-ci.yml
```

Primary route definitions are in `src/App.tsx`; keep route-related links/data aligned with it.

---

## 5) Local development

### Prerequisites
- Node.js 18+
- npm

### Install and run
```bash
npm install
npm run dev
```

The dev server is configured for `http://localhost:8080`.

### Required environment variables
Create a `.env.local` with project-specific values:

```bash
VITE_SUPABASE_URL=...
VITE_SUPABASE_PUBLISHABLE_KEY=...
# Optional but used by smoke workflow/checks
VITE_SUPABASE_PROJECT_ID=...
```

### Common commands
```bash
npm run dev
npm run build
npm run preview
npm run lint
npm run validate:sw
```

---

## 6) Quality checks

Run these before opening/merging release-sensitive changes:

```bash
# Production build sanity
npm run build

# Route-link integrity audit
npx ts-node scripts/audit-routes.ts

# Smoke checks (example against production domain)
./scripts/smoke-test.sh https://ascentgroupconstruction.com

# Lint
npm run lint
```

Notes:
- `smoke-test.sh` is SPA-focused and does **not** rely on nonexistent local `/api/*` endpoints.
- Supabase edge function reachability in smoke is conditional on `VITE_SUPABASE_PROJECT_ID`.

---

## 7) Deployment notes

### Confirmed in repository
- CI smoke workflow targets `main` and PRs to `main`.
- Docs and project context still reference Lovable publish/domain controls.

### Operational reality to confirm per release
Because the repo does not conclusively prove the production trigger path, treat deployment as **potentially hybrid**:
- Merge to `main` may be sufficient **or**
- A manual Lovable publish may still be required

### Recommended release discipline
1. Merge to `main`
2. Confirm whether hosting auto-deployed that commit SHA
3. If not, perform manual publish in Lovable
4. Run post-deploy smoke checks and verify lead/admin critical paths

---

## 8) Known risks / operational notes

- **Route integrity discipline:** keep navigation data, redirects, and hard-coded links aligned with `src/App.tsx`.
- **Deployment drift risk:** merged code may not be live if manual publish is still required.
- **Supabase/RLS-sensitive areas:** newsletter, contact, estimate, and inbox-related flows depend on backend policy/function correctness.
- **Notification side-effects:** some lead flows can persist successfully even when downstream notifications partially fail; monitor warnings and logs.
- **Admin route churn:** avoid adding stale admin shortcuts; prefer canonical admin destinations used in `App.tsx`.

---

## 9) Documentation map (related docs)

- `docs/ARCHITECTURE_OVERVIEW.md` — high-level system architecture and domain model
- `docs/ADMIN_GUIDE.md` — admin workflows and usage patterns
- `docs/BUSINESS_MODULE_GUIDE.md` — operations/business module behavior
- `docs/COMPANY_SETTINGS.md` — company/site settings model
- `docs/DATABASE_ERD.md` — schema/domain reference
- `docs/DEPLOYMENT.md` — Lovable/domain deployment guidance
- `docs/DEVELOPER_ONBOARDING.md` — onboarding reference (contains some legacy deployment assumptions; validate against current release process)
- `docs/AUDIT_IMPLEMENTATION_COMPLETE.md` — stabilization/audit implementation summary

---

## License

Proprietary — Ascent Group Construction.
