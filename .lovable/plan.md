

## Admin cleanup — remove unused / non-functional sections

### What I audited

I cross-referenced every admin route, sidebar item, and sub-component against:
- Whether any **public-facing page** actually consumes its data
- Whether the underlying logic does anything meaningful (or just writes to an orphan table)
- Your own `docs/ADMIN_FEATURE_STATUS.md` truth document
- Memory: `system-hygiene-and-domain-integrity` (sidebar must stay synced with real routes)

### Findings — what to remove

| # | Item | Where it lives | Why remove |
|---|------|----------------|-----------|
| 1 | **Redirects Manager** | sidebar Website group, `/admin/redirects`, `RedirectsManager.tsx` | Writes to `redirects` table but **nothing reads it**. No edge function, no middleware, no server applies these. Already flagged "Internal / Non-authoritative" in your status doc. Pure dead weight. |
| 2 | **Navigation Menu builder** | sidebar Website group, `/admin/navigation`, `NavigationBuilder.tsx` | Site nav is hard-coded in `data/navigation-structure-enhanced.ts`. Editing this UI changes nothing on the live site. Flagged "Non-authoritative" in your doc. |
| 3 | **Stats tab** in Homepage Builder | `HomepageBuilder.tsx` "stats" tab + `StatsManager.tsx` | Already labeled with a "not displayed on public homepage" warning by you. Stats never render anywhere public. |
| 4 | **Performance Dashboard** | sidebar Tools group, `/admin/performance-dashboard` | Reads `performance_metrics` (web vitals collection works) but the dashboard duplicates what Monitoring already shows. Keeping one is enough. |
| 5 | **Content Versioning** page | `/admin/content-versions`, `ContentVersioning.tsx` | The `RevisionHistory` component is **not mounted in any editor** (search confirms zero usages). The page just lists rows from `content_versions` with no restore action. Read-only orphan. |
| 6 | **Notifications** page | sidebar Tools group, `/admin/notifications`, `Notifications.tsx` | `NotificationBellInbox` already shows notifications in the header. The full page is redundant. |
| 7 | **Search Analytics** page | sidebar Tools group, `/admin/search-analytics`, `SearchAnalytics.tsx` | The `search_analytics` table IS populated and used by `usePopularSearches`/`usePopularServices` on the public site, but the admin page just shows a list with no actionable insight beyond what SEO Dashboard analytics tab covers. Can fold into SEO Dashboard later, but no one uses it now. |

### Findings — what to KEEP (verified live)

- Dashboard, Inbox, Projects, Services, Blog Posts, **Testimonials** (live — read by `Testimonials.tsx` + `useAggregateRating`), Media, Documents, Homepage Builder (Hero/WhyChooseUs/CompanyOverview tabs only), SEO Dashboard, Settings, Users, Email Templates, Monitoring, Audit Log
- All `<Navigate />` redirects from old admin paths stay (preserve bookmarks)

### Changes to make (when you approve)

**Sidebar** — `src/components/admin/UnifiedSidebar.tsx`
- Remove nav items: Navigation Menu, Redirects, Performance, Search Analytics, Notifications
- Keep Website group (now: Homepage Builder, SEO Dashboard) — still useful as a group
- Keep Tools group (now: Monitoring, Audit Log) — slimmed down

**Routes** — `src/routes/AppRoutes.tsx`
- Remove route registrations + lazy imports for: `RedirectsManager`, `NavigationBuilder`, `PerformanceDashboard`, `SearchAnalytics`, `ContentVersioning`, `Notifications`
- Add `<Navigate to="/admin" replace />` redirects for the removed paths so old bookmarks/links don't 404

**Homepage Builder** — `src/pages/admin/HomepageBuilder.tsx`
- Delete the "stats" tab + its TabsTrigger/TabsContent
- Drop import of `StatsManager`
- Update tab grid from `grid-cols-4` → `grid-cols-3`
- Strip the `?tab=stats` from the allowed-tabs Set

**Files to delete** (no remaining importers after the above):
- `src/pages/admin/RedirectsManager.tsx`
- `src/pages/admin/NavigationBuilder.tsx`
- `src/pages/admin/PerformanceDashboard.tsx`
- `src/pages/admin/SearchAnalytics.tsx`
- `src/pages/admin/ContentVersioning.tsx`
- `src/pages/admin/Notifications.tsx`
- `src/pages/admin/StatsManager.tsx`
- `src/components/admin/RevisionHistory.tsx` (zero usages)

**Documentation** — `docs/ADMIN_FEATURE_STATUS.md`
- Remove rows for Navigation Builder, Redirects, Stats (now gone)
- Add a one-liner: "Removed YYYY-MM: Navigation/Redirects/Stats/Performance/Notifications/SearchAnalytics/ContentVersioning admin surfaces — none were wired to live output."

### Out of scope (explicitly not touching)

- **Hero Slides Manager** — live, public hero reads from it
- **Testimonials** — live, public Testimonials component reads from it
- **SEO Dashboard robots.txt controls** — left alone (you flagged "verify before relying" but the rest of SEO Dashboard is heavily used)
- Nothing in DB — only frontend cleanup. All tables stay (`redirects`, `navigation_menu_items`, `stats`, `content_versions`, `admin_notifications`, `performance_metrics`, `search_analytics`) so no data loss and existing collectors keep writing.
- No changes to `/admin/inbox`, dashboard widgets, or any content editor

### Result

Sidebar drops from ~17 nav items to ~12. Every remaining admin page either edits live public content or operates a real backend function. No more "is this even doing anything?" surfaces.

