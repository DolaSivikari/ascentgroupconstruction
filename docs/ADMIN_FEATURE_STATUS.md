# Admin Feature Status (Truth-First)

| Surface | Current Status | Notes |
|---|---|---|
| Hero Slides Manager | Live | Public homepage hero consumes `hero_slides` with fallback. |
| Homepage Builder - Why Choose Us | Live | Mounted on homepage; reads `why_choose_us_items`. |
| Homepage Builder - Company Overview | Live | Mounted on homepage; reads `company_overview_sections/items`. |
| SEO Robots Controls | Internal / Verify before relying | Saves to `site_settings.robots_txt`; runtime/deploy output must be verified. |
| Testimonials Manager | Partially live | Only affects pages/components that query `testimonials` directly. |

## Removed 2026-04
The following admin surfaces were removed because none were wired to live output (or were redundant duplicates of existing tools):
- Navigation Menu builder
- Redirects Manager
- Stats & Badges (Homepage Builder tab)
- Performance Dashboard (covered by Monitoring)
- Notifications page (covered by header notification bell)
- Search Analytics page (no actionable insight beyond SEO Dashboard)
- Content Versioning page (read-only orphan, no restore action)

Underlying database tables were preserved (no data loss); only frontend admin surfaces were cleaned up. Old paths now redirect to the closest live equivalent.

## Recommended architecture follow-up

1. Define robots runtime contract (DB -> served robots) with automated verification.
2. Add per-feature status badges in admin shell to keep operator expectations clear.
