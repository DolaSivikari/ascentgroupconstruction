# Admin Leads workspace

The default `/admin/inbox` tab brings together RFPs, general inquiries, estimates,
service quotes and prequalification requests. It reads the existing four intake
tables, so this release needs no database migration or new public form.

## List and navigation

- Pages contain at most 50 records. Each source reads at most 51 records, using
  a received-time/table/id cursor rather than offsets. PostgreSQL microsecond
  timestamps and missing dates retain stable ordering.
- Search, request type and status filters run on the server. Estimates and quotes
  stored in Contacts appear alongside quote-table records. Wizard records with
  UTM JSON in `source` are classified using their existing request type.
- Failed sources are named explicitly. Export and older-page navigation remain
  unavailable until all required sources recover.
- Notification and dashboard links open the full request independently of the
  current page or filters. The previous estimates route and inbox tabs remain
  compatible. Resumes and newsletter subscriptions retain their existing tabs.
- Realtime subscriptions refresh the list, with a 60-second polling fallback.
  Received times use Toronto time, including daylight saving time. CSV export
  contains only the displayed page and uses the existing safe column allowlist.

## Detail panel

Opening a request waits for a fresh read before creating its editor. Subsequent
background reads preserve the editing baseline and draft. Status and existing
admin notes are saved with conditions on the original values of the fields being
edited; a concurrent update cannot be silently overwritten. Failed saves retain
the draft, and closing an edited panel asks whether to discard it.

The panel retains the submitted fields and existing private RFP attachment
signing. It hides hard deletion. Quote and prequalification tables have no admin
notes column, so their panels expose only supported edits. The list becomes cards
on small screens, and the panel fits a 390px viewport without horizontal overflow.

## Scope and remaining work

This is the list/detail stage. The optional board, unified `inquiries` schema,
assignment, bid due dates, archive, threaded notes and email delivery workspace
remain separate work. No migration, RLS policy, function secret, business claim or
credential was changed.

The current estimate wizard writes a Contact record and a Quote record for the
same request. Both existing records remain visible; this release does not guess
which records are duplicates or delete historical data. A later durable intake
workflow should provide an explicit shared request identifier.

The anonymous quote insert fix was merged separately in PR #43, and this branch
includes that updated base. The website still requires Lovable publication after
merging the Leads workspace PR.

## Verification

- 331 tests across 45 files passed, including cursor paging, partial failures,
  classification, stale-cache handling, optimistic save guards and old links.
- Selected strict type checking, full application type checking and the
  production build passed. Changed files pass ESLint; the repository-wide lint
  baseline remains 288 errors and 34 warnings.
- Production-build Chromium checks passed 14 scenarios on desktop and at 390px:
  paging, filtering, source recovery, fresh details, failed and concurrent saves,
  draft discard, successful persistence, closed-record links, attachment signing
  and non-admin denial. No runtime exceptions or mobile horizontal overflow.
- Browser requests and mutations used synthetic fixtures with external backend
  traffic blocked. These checks did not submit real leads, send email, alter the
  live database or validate production permissions.
