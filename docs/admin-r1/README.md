# R1 browser evidence

These are production-build Chromium checks with **synthetic data**, fake sessions, intercepted backend responses and blocked external traffic. They do not describe production records or prove production database grants. No migration, live write, email or publication occurred.

## Public comparison

Before: main `12ca712`. After: R1. Same fixtures, cookie consent and viewport sizes; animation is frozen for comparable screenshots. Eight unchanged screenshots are pixel-identical. Project desktop changes only in the Performance card area; mobile gets shorter when that card is removed. [Pixel comparison data](public-comparison.json).

| Page | 1440 px | 390 px | Result |
| --- | --- | --- | --- |
| Project detail | [Before](screenshots/before/project-1440.png) · [After](screenshots/after/project-1440.png) | [Before](screenshots/before/project-390.png) · [After](screenshots/after/project-390.png) | Intended: hide wholly unrecorded Performance card |
| Certifications & Insurance | [Before](screenshots/before/certifications-1440.png) · [After](screenshots/after/certifications-1440.png) | [Before](screenshots/before/certifications-390.png) · [After](screenshots/after/certifications-390.png) | Identical |
| Contact | [Before](screenshots/before/contact-1440.png) · [After](screenshots/after/contact-1440.png) | [Before](screenshots/before/contact-390.png) · [After](screenshots/after/contact-390.png) | Identical |
| About | [Before](screenshots/before/about-1440.png) · [After](screenshots/after/about-1440.png) | [Before](screenshots/before/about-390.png) · [After](screenshots/after/about-390.png) | Identical |
| Privacy | [Before](screenshots/before/privacy-1440.png) · [After](screenshots/after/privacy-1440.png) | [Before](screenshots/before/privacy-390.png) · [After](screenshots/after/privacy-390.png) | Identical |

Contact, About and Privacy also exercise the global Footer projection change. Public hero/video, navigation, brand tokens and credential wording are untouched.

## Admin behavior

[Scenario results](browser-results.json) cover blank dates, local drafts, failed saves, staged deletion, fresh visitor previews, required-field validation, blog metadata, visitor-safe Contact reads after Save, settings/tab guards, missing records, homepage Cancel, crawler files, Monitoring failures/recovery and role-based controls. The guard also verifies no full document navigation for confirmed Back. Project, Blog, Settings, Users, Monitoring, guard and sidebar fit 390 px.

- [Dashboard at 1440 px](screenshots/admin/dashboard-desktop.png)
- [Crawler files at 1440 px](screenshots/admin/crawler-files-desktop.png)
- At 390 px: [Project](screenshots/admin/project-390.png), [Blog](screenshots/admin/blog-390.png), [Settings](screenshots/admin/settings-390.png), [Users](screenshots/admin/users-390.png), [Monitoring](screenshots/admin/monitoring-390.png), [Leave/Stay](screenshots/admin/guard-390.png), [Sidebar](screenshots/admin/sidebar-390.png)

## Repeat the fixture checks

The browser runner needs Chromium and `puppeteer-core` available outside the repository's dependencies. Set `PUPPETEER_CORE_PATH` to its module directory and `CHROMIUM_PATH` if Chromium is elsewhere. This is test tooling; R1 adds no package or lockfile change.

Build the checkout and start `vite preview --host 127.0.0.1 --port 4176`. Then:

```sh
PUPPETEER_CORE_PATH=/path/to/puppeteer-core node scripts/admin-r1-admin-browser.cjs
PUPPETEER_CORE_PATH=/path/to/puppeteer-core node scripts/admin-r1-public-browser.cjs after
```

Use `R1_PREVIEW_ORIGIN` for another **local** preview port and `R1_QA_OUTPUT` for a different output directory. By default artifacts go under `node_modules/.cache/`. The admin runner uses the existing `.env` only to identify which backend requests to intercept; it never sends authentication or mutations to that backend. Host resolver rules also redirect Supabase hostnames to localhost. For baseline public screenshots, run the public script with `before` against a separately built main checkout.

Full gate results and known phase boundaries are in [R1 implementation status](../../_assessment/admin-upgrade/R1-IMPLEMENTATION-STATUS.md).
