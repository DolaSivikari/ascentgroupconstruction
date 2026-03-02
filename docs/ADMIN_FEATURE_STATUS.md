# Admin Feature Status (Truth-First)

| Surface | Current Status | Notes |
|---|---|---|
| Hero Slides Manager | Live | Public homepage hero consumes `hero_slides` with fallback. |
| Homepage Builder - Why Choose Us | Live | Mounted on homepage; reads `why_choose_us_items`. |
| Homepage Builder - Company Overview | Live | Mounted on homepage; reads `company_overview_sections/items`. |
| Homepage Builder - Stats | Not wired to public site | Kept for content prep only; not currently shown on homepage composition. |
| Navigation Builder | Internal / Non-authoritative | Not the live source for site navigation output. |
| Redirects Manager | Internal / Non-authoritative | DB-only records; no deployment/CDN rule generation pipeline in current architecture. |
| SEO Robots Controls | Internal / Verify before relying | Saves to `site_settings.robots_txt`; runtime/deploy output must be verified. |
| Testimonials Manager | Partially live | Only affects pages/components that query `testimonials` directly. |

## Recommended architecture follow-up

1. Define one authoritative source and deployment path for navigation and redirects.
2. Define robots runtime contract (DB -> served robots) with automated verification.
3. Add per-feature status badges in admin shell to keep operator expectations clear.
