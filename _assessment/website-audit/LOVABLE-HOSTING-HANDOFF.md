# Hosting and search verification still required

The current repository is a Vite/React client application. Client Navigate and noindex tags cannot change the HTTP status of a response already delivered by Lovable. `_redirects` is not applied on this host. Changing React Router from v6 to v7 also does not add server rendering.

Use this handoff with Lovable before choosing a framework migration:

> Confirm whether this existing project is eligible for the documented in-place TanStack Start upgrade, and whether every dynamic published service, city, project and blog URL will receive its own server-rendered HTML. Show the supported rollout and rollback for this existing custom domain, Supabase auth, admin routes, CMS previews, assets and service worker. Preserve all existing public URLs, visuals, CMS records and credential wording. Use the existing `src/data/service-redirects.ts` map to return permanent HTTP redirects directly to canonical routes, retaining query strings. Unknown routes and missing published records must return HTTP 404 and noindex; backend failures must not be treated as missing content. Keep preview-token/admin content non-indexable and private. Confirm the primary www domain, the non-www redirect, and the published build/cache revision. Do not treat client navigation or a static Netlify file as proof of an HTTP 301/404.

Migration acceptance requires GET responses without JavaScript for a service, city, project and article. Check each body for its actual content, title, canonical, og:url, social image and JSON-LD. Confirm an invented URL returns 404; confirm `/services/eifs-stucco` returns a permanent redirect to `/services/eifs-stucco-systems`; confirm no redirect chains or lost UTM parameters. Confirm authenticated editor flows, old saved project links, media processing, previews, and form drafts remain functional in an isolated test environment.

In Google Search Console, inspect the homepage plus those four page types using View crawled page and rendered output. Submit the sitemap and inspect duplicate/soft-404 reports. A spoofed Googlebot user agent alone does not establish what a verified Google crawler receives.

GBP needs the owner's actual business eligibility, service-area/customer-access decision, hours, category and account verification. Membership/certification claims and testimonials need evidence and approval from their owners. These are not code fixes and no account actions were taken.
