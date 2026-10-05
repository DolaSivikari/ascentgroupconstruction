# R1 public-file and coverage reconciliation

PR #46 merged as `bf6a40b`; the owner confirmed it was published and checked in a private window on 4 October 2026. This is a retrospective review, not another R1 implementation.

**The ten comparisons were five distinct pages at 1440 and 390 px:** project detail (synthetic fixture), Certifications & Insurance, Contact, About and Privacy. Eight captures were pixel-identical. Project removes only the wholly unrecorded Performance card. These were production-build renders with synthetic backend responses, not production baseline captures.

- **Contact: covered** by `/contact` at both widths; its source was unchanged in R1. A separate R1 browser scenario verified edited fixture hours from a fresh visitor session with restricted column grants.
- **PhoneLink: covered** through `/privacy`, which renders `src/components/shared/PhoneLink.tsx` in its contact wording at both widths. PhoneLink itself was unchanged. The public-settings regression test confirms it uses the canonical `COMPANY_PHONE` constant and makes no Supabase query.
- **Global router/settings coverage was representative, not exhaustive.** R1 did not contain an all-pages comparison gate. The new Phase 0 owns that work; its requirements were supplied after R1.
- **The Certifications fixture missed a real schema error.** Phase 0's production crawl returned `42703: column about_page_settings.certifications does not exist` for R1's new projection. The fixture accepted the fictional field, so its unchanged text/pixels did not validate the deployed query. See the separate repair recorded in [Phase 0 status](PHASE-0-IMPLEMENTATION-STATUS.md); credential wording is unchanged in Phase 0.
- **Safe owner checklist correction:** preview and production can share a database. Do not alter Contact hours merely to test. Read existing Settings → Contact hours and compare `/contact` in a private window after publication. Prefer mocked checks for editor saves; if an owner chooses a manual create check, use `TEST – delete me`, leave it Draft, and delete it afterwards.

Every R1 file outside `src/pages/admin`, `src/components/admin` and `src/lib/admin` is listed below. Non-rendered files are identified rather than pretending a screenshot tests them.

| File | Coverage / why a screenshot is not applicable |
| --- | --- |
| `_assessment/admin-upgrade/12-ADMIN-UPGRADE-CODEX-PROMPT.md` | Assessment/report/SQL draft or evidence metadata; not executable public-site code. No SQL was applied. |
| `_assessment/admin-upgrade/13-ADMIN-FEATURE-REALITY-AUDIT.md` | Assessment/report/SQL draft or evidence metadata; not executable public-site code. No SQL was applied. |
| `_assessment/admin-upgrade/14-ADMIN-REDESIGN-CODEX-PROMPT.md` | Assessment/report/SQL draft or evidence metadata; not executable public-site code. No SQL was applied. |
| `_assessment/admin-upgrade/R1-IMPLEMENTATION-STATUS.md` | Assessment/report/SQL draft or evidence metadata; not executable public-site code. No SQL was applied. |
| `_assessment/admin-upgrade/sql/0000_preflight_readonly.sql` | Assessment/report/SQL draft or evidence metadata; not executable public-site code. No SQL was applied. |
| `_assessment/admin-upgrade/sql/0001_inquiries_workflow.sql` | Assessment/report/SQL draft or evidence metadata; not executable public-site code. No SQL was applied. |
| `_assessment/admin-upgrade/sql/0002_about_page_fields.sql` | Assessment/report/SQL draft or evidence metadata; not executable public-site code. No SQL was applied. |
| `docs/archive/admin-r1/README.md` | Assessment/report/SQL draft or evidence metadata; not executable public-site code. No SQL was applied. |
| `docs/archive/admin-r1/browser-results.json` | Assessment/report/SQL draft or evidence metadata; not executable public-site code. No SQL was applied. |
| `docs/archive/admin-r1/public-comparison.json` | Assessment/report/SQL draft or evidence metadata; not executable public-site code. No SQL was applied. |
| `docs/archive/admin-r1/screenshots/admin/blog-390.png` | Evidence artifact: admin fixture screenshot, not a public change. |
| `docs/archive/admin-r1/screenshots/admin/crawler-files-desktop.png` | Evidence artifact: admin fixture screenshot, not a public change. |
| `docs/archive/admin-r1/screenshots/admin/dashboard-desktop.png` | Evidence artifact: admin fixture screenshot, not a public change. |
| `docs/archive/admin-r1/screenshots/admin/guard-390.png` | Evidence artifact: admin fixture screenshot, not a public change. |
| `docs/archive/admin-r1/screenshots/admin/monitoring-390.png` | Evidence artifact: admin fixture screenshot, not a public change. |
| `docs/archive/admin-r1/screenshots/admin/project-390.png` | Evidence artifact: admin fixture screenshot, not a public change. |
| `docs/archive/admin-r1/screenshots/admin/settings-390.png` | Evidence artifact: admin fixture screenshot, not a public change. |
| `docs/archive/admin-r1/screenshots/admin/sidebar-390.png` | Evidence artifact: admin fixture screenshot, not a public change. |
| `docs/archive/admin-r1/screenshots/admin/users-390.png` | Evidence artifact: admin fixture screenshot, not a public change. |
| `docs/archive/admin-r1/screenshots/after/about-1440.png` | Evidence artifact: one of the ten public before/after captures (five pages × two widths). |
| `docs/archive/admin-r1/screenshots/after/about-390.png` | Evidence artifact: one of the ten public before/after captures (five pages × two widths). |
| `docs/archive/admin-r1/screenshots/after/certifications-1440.png` | Evidence artifact: one of the ten public before/after captures (five pages × two widths). |
| `docs/archive/admin-r1/screenshots/after/certifications-390.png` | Evidence artifact: one of the ten public before/after captures (five pages × two widths). |
| `docs/archive/admin-r1/screenshots/after/contact-1440.png` | Evidence artifact: one of the ten public before/after captures (five pages × two widths). |
| `docs/archive/admin-r1/screenshots/after/contact-390.png` | Evidence artifact: one of the ten public before/after captures (five pages × two widths). |
| `docs/archive/admin-r1/screenshots/after/privacy-1440.png` | Evidence artifact: one of the ten public before/after captures (five pages × two widths). |
| `docs/archive/admin-r1/screenshots/after/privacy-390.png` | Evidence artifact: one of the ten public before/after captures (five pages × two widths). |
| `docs/archive/admin-r1/screenshots/after/project-1440.png` | Evidence artifact: one of the ten public before/after captures (five pages × two widths). |
| `docs/archive/admin-r1/screenshots/after/project-390.png` | Evidence artifact: one of the ten public before/after captures (five pages × two widths). |
| `docs/archive/admin-r1/screenshots/before/about-1440.png` | Evidence artifact: one of the ten public before/after captures (five pages × two widths). |
| `docs/archive/admin-r1/screenshots/before/about-390.png` | Evidence artifact: one of the ten public before/after captures (five pages × two widths). |
| `docs/archive/admin-r1/screenshots/before/certifications-1440.png` | Evidence artifact: one of the ten public before/after captures (five pages × two widths). |
| `docs/archive/admin-r1/screenshots/before/certifications-390.png` | Evidence artifact: one of the ten public before/after captures (five pages × two widths). |
| `docs/archive/admin-r1/screenshots/before/contact-1440.png` | Evidence artifact: one of the ten public before/after captures (five pages × two widths). |
| `docs/archive/admin-r1/screenshots/before/contact-390.png` | Evidence artifact: one of the ten public before/after captures (five pages × two widths). |
| `docs/archive/admin-r1/screenshots/before/privacy-1440.png` | Evidence artifact: one of the ten public before/after captures (five pages × two widths). |
| `docs/archive/admin-r1/screenshots/before/privacy-390.png` | Evidence artifact: one of the ten public before/after captures (five pages × two widths). |
| `docs/archive/admin-r1/screenshots/before/project-1440.png` | Evidence artifact: one of the ten public before/after captures (five pages × two widths). |
| `docs/archive/admin-r1/screenshots/before/project-390.png` | Evidence artifact: one of the ten public before/after captures (five pages × two widths). |
| `scripts/admin-r1-admin-browser.cjs` | Fixture-only verification runner; not bundled or executed on the public site. |
| `scripts/admin-r1-public-browser.cjs` | Fixture-only verification runner; not bundled or executed on the public site. |
| `src/App.tsx` | All five routes at both widths; R1 dashboard/Leads scenarios also exercise SPA navigation. This is representative coverage, not every public route. |
| `src/components/Footer.tsx` | Footer appears in all five compared pages; its projection retains every previously consumed field. |
| `src/hooks/publicSettingsSafety.test.ts` | Regression test only; not shipped to visitors. Its assertions are in the 435-test passing suite. |
| `src/hooks/useActiveSettings.ts` | Contact, Certifications and Footer callers run in the five-page capture; public projection tests also cover SEO/site/company consumers. |
| `src/hooks/useLocalDraft.ts` | Admin behavior only despite this file path: local-draft, navigation-guard and homepage cache tests/browser scenarios. No screenshot can prove background write behavior. |
| `src/hooks/useSettingsData.ts` | Contact, Certifications and Footer callers run in the five-page capture; public projection tests also cover SEO/site/company consumers. |
| `src/hooks/useUnsavedChanges.test.tsx` | Regression test only; not shipped to visitors. Its assertions are in the 435-test passing suite. |
| `src/hooks/useUnsavedChanges.ts` | Admin behavior only despite this file path: local-draft, navigation-guard and homepage cache tests/browser scenarios. No screenshot can prove background write behavior. |
| `src/hooks/useWhyChooseUsAdmin.ts` | Admin behavior only despite this file path: local-draft, navigation-guard and homepage cache tests/browser scenarios. No screenshot can prove background write behavior. |
| `src/pages/ProjectDetail.test.tsx` | Regression test only; not shipped to visitors. Its assertions are in the 435-test passing suite. |
| `src/pages/ProjectDetail.tsx` | Project detail at both widths; R1 fresh visitor RPC preview check separately covers draft/noindex behavior. |
| `src/pages/company/CertificationsInsurance.tsx` | Certifications & Insurance at both widths; text and pixels unchanged. |
| `src/routes/AppRoutes.admin.test.tsx` | Regression test only; not shipped to visitors. Its assertions are in the 435-test passing suite. |
| `src/routes/AppRoutes.tsx` | Five representative public routes; admin route tests verify removed placeholders. Public route declarations are unchanged; global coverage was not complete. |
| `src/utils/previewToken.ts` | No steady-state public rendering change. Fresh visitor project/blog preview checks and token persistence tests cover its behavior. |
