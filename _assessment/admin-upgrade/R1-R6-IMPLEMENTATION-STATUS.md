# R1–R6 consolidated admin completion

Later master-plan application work is tracked in [MASTER-PLAN-APPLICATION-STATUS.md](MASTER-PLAN-APPLICATION-STATUS.md). The evidence below belongs to the earlier R1–R6 PR.

The owner requested one PR for the complete R1–R6 redesign, overriding the older one-phase-per-PR sequence. This implements the R phases in file 14; it does not claim that all nine phases of the master plan or the future inquiry intake rollout are complete.

**Code is ready for review. Database activation and Lovable publishing are separate owner steps.** No live data, storage, secrets, migrations, deployments or emails were changed during this work.

| Phase | Result | Activation remaining |
| --- | --- | --- |
| R1 | Reuses published PR #46: reliable explicit saves, local drafts, previews, staged gallery removal, honest monitoring and hidden unsupported controls. | None for the existing R1 code. |
| R2 | Real About editor with original per-field fallbacks; connected footer/social/metadata settings; unused Contact fields removed; visitor-only permission checks and matching cache refresh. Credential stats remain held. | Review/apply About columns and anonymous column grants. |
| R3 | Scoped light/dark theme, remembered sidebar, top bar with one search dialog, mobile drawer, common page states, 30-minute idle timeout with a 60-second warning. Existing Leads remains the list/detail workspace. | Merge and publish. |
| R4 | Tiptap 3 editors, one-page sections, sticky save/publication controls, required-field summaries, local recovery, typed structured service sections, case-study images/process, list filters/paging and confirmed row actions. Copies are hidden drafts. | Merge and publish; image alt text additionally needs 0004. |
| R5 | Real storage browsing/upload, picker, captions/alt fields, staged removal, separate cleanup offers, and reference checks that fail closed. Checks repeat immediately before deletion and include drafts/nested JSON. Shared document files are retained while another document references them. | Basic browsing/upload/picking works against existing storage permissions. Editable saved alt metadata needs 0004. |
| R6 | Actor names in Audit, read-only paged Email Delivery and suppression history, masked recipients/error details, current RFP links, atomic role RPC without a REST fallback, filtered/grouped monitoring. | Audit expansion needs 0004. Guarded role changes need 0005. Future `inquiry_id` links require the planned new-table Leads integration; this PR does not activate intake. |

## Public changes and holds

- About now consumes saved hero/story/founder/non-credential stats. Empty fields keep the existing text exactly.
- General/footer settings can supply a tagline and HTTPS social icons/profiles. Page metadata still wins over defaults.
- DB-driven service and article rich text is sanitized; legacy line breaks survive. Saved blog case-study Challenge/Solution/Results become visible. Blog client/budget controls were removed because they have no public consumer; existing stored values are retained.
- Project description/scope render once, and the recorded project status drives the sidebar. Gallery alt descriptions are used when available.
- The homepage hero/video, public navigation, brand tokens, contact constants and credential wording were preserved. The certifications page was left unchanged.
- Code-managed service publication controls explicitly refer to the directory entry; they do not claim to unpublish the dedicated code page. Restricted document activation keeps existing file permissions.
- Page/field declarations are in `../baseline/intentional-changes.json`, using the previously verified 86-route baseline inventory. No full production recapture or page-count claim was made here.

## Verification and evidence

The production-build browser harness blocks/intercepts **every external request** and uses synthetic backend records. Opening screens makes no writes. Functional editor checks make synthetic writes only. No verification sends email or touches live storage.

- Full Vitest, selected/full TypeScript, build, lint, route audit and service-worker results: [verification.json](r1-r6-evidence/verification.json).
- 27 active admin screens/variants × light/dark × 1440/390 px = **108 captures**, with no route crashes or horizontal overflow. Editors use their own sticky action header; ordinary pages use the shared page layout.
- Focused before/after comparison: seven public routes × two widths. Includes About, a DB service, project, article, Contact, certifications and Home. This is a representative fixture comparison, **not** the skipped full 86-page production replay.
- Public bundle gate checks source maps of scripts actually loaded by those seven routes; Tiptap/admin chart packages must stay out.
- [Screenshot archive](r1-r6-evidence/screenshots.zip), [contact sheet](r1-r6-evidence/admin-contact-sheet.jpg), [browser interactions](r1-r6-evidence/interactions.json), and focused comparison/bundle reports live alongside this file.
- Screenshot/permission checks do not prove live RLS, applied SQL, real email delivery or a timed 30-minute production session. SQL drafts have not been executed against Postgres. Build size/dependency warnings and existing lint errors are reported rather than concealed.

Reproduce local browser checks after building and starting Vite preview on port 4182:

```sh
PUPPETEER_CORE_PATH=/path/to/isolated/puppeteer-core node scripts/admin-r1-r6-browser.cjs
PUPPETEER_CORE_PATH=/path/to/isolated/puppeteer-core node scripts/admin-r1-r6-browser.cjs --public
PUPPETEER_CORE_PATH=/path/to/isolated/puppeteer-core node scripts/admin-r1-r6-browser.cjs --interact
```

The script refuses remote preview origins. Browser tooling is not an application dependency. The frozen installer and lockfile were preserved.

## Owner activation checklist

1. Review the PR and screenshot evidence. For SQL, use the uploaded read-only preflight, inspect current policies/function definitions and take a backup.
2. About: `supabase/migrations/20261004090000_about_page_fields.sql` is an unchanged copy of reviewed draft `sql/0002_about_page_fields.sql`. Apply through Lovable only after review. Its anonymous column grant is a commented follow-up; check it explicitly and grant only the public columns if needed. Until ready, the About editor explains setup and the public page retains its fallback.
3. Review new, **unapplied** drafts `sql/0004_admin_media_and_audit.sql` and `sql/0005_admin_role_guard.sql`. The first adds saved image descriptions and audit coverage; the second isolates atomic role changes and guards every roles-table write path. They are not auto-run migrations. Rollback notes are included. Do not test by demoting a real sole super admin.
4. Merge the PR, then use Lovable **Publish → Update**. Merging alone does not update the website.
5. Check an existing lead/detail, theme, phone drawer, draft editor/preview, Media picker and Email Delivery. Check Visitor view under Settings → Health. Use existing data for read-only checks; do not change Contact hours or credential claims to test.

Later work remains the master-plan intake/email rollout, new inquiries source, Pages hub/draft-history/kill-switch controls, and optional board. Those are intentionally not substituted for the reliable existing Leads workspace.
