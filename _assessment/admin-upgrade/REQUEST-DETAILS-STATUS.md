# Direct request opening and refreshed details

This admin interface improvement follows the section screens in PR #58. It addresses the owner's request to open submitted information directly from the current inbox view and replace the older detail presentation.

## Behavior

- Click a request row, client name or mobile Leads card to open its details. This works from Leads and each existing inbox tab without switching to All. Enter and Space also open a focused row/card.
- Email, phone, delete, status and drag controls retain their own actions. Selecting text does not open the request. Notification links and current filters remain supported.
- Legacy submissions and new workflow inquiries share a wider detail panel with client information, labelled request cards, email/call actions and a separate scrolling body. Section navigation, the client header and footer actions stay available during long requests.
- Submitted information, attachments, workflow fields and notes retain their existing behavior. New inquiries also retain delivery results and history, with honest loading, empty and failed-loading states.
- Switching internal sections preserves unsaved edits. Save failures retain edits; closing dirty details still asks before discarding. Opening another request resets its section to Submitted request.

There are no changes to public forms, database schema, save payloads, email sending, credential wording or publishing. Opening a new workflow inquiry still performs the existing first-viewed update in normal use; verification intercepts this against synthetic data.

## Verification

- **602 tests across 91 files passed**, including opening from filtered lists, keyboard access, nested actions, save payloads and dirty-edit protection.
- Full app and selected strict TypeScript, production build, service-worker validation, route audit and whitespace checks passed.
- Lint remains at **211 existing errors / 29 warnings**; new source, test and browser files are clean. Existing build warnings remain.
- Offline Chromium at 1440, 1024 and 390 px opened legacy and new inquiry panels, tested Leads/All opening and unsaved-note retention, and confirmed visible header/footer actions without horizontal overflow or runtime errors. External requests and first-viewed updates were intercepted; no live database/storage writes occurred.
- Seven representative public fixture routes at two widths passed **14 before/after comparisons** with no undeclared differences. The bundle gate checked 75 public chunks and found no forbidden admin packages.

Evidence is in [request-details-evidence](request-details-evidence/verification.json). Browser coverage uses synthetic authentication/data and does not prove live backend permissions, every request type's attachments, every delivery action or every public page. Full live-site comparisons were not repeated.

The browser check is reproducible with a synthetic production build and loopback Vite preview:

```sh
REQUEST_DETAILS_ORIGIN=http://127.0.0.1:4192 \
PUPPETEER_CORE_PATH=/path/to/isolated/puppeteer-core \
node scripts/admin-request-details-browser.cjs
```

Merge and Lovable **Publish → Update** remain separate owner actions. After publishing, open a request from Leads and another from All at desktop and phone width; check section navigation and closing an unsaved note without saving test data.
