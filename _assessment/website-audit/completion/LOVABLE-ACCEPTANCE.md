# Keep Lovable: rendering and routing acceptance

The owner requires Lovable hosting. The existing application is a browser-dependent Vite/React SPA, and Lovable does not apply its Netlify `_redirects` file. React Router navigation cannot set the HTTP status of a response already delivered. No callable Lovable project-upgrade/hosting tool is available in this environment; an unsupported framework replacement would not establish compatibility with the current host.

Use the existing project's supported upgrade flow or Lovable support with this concrete request:

> Upgrade this existing project in place to Lovable's supported server rendering platform while keeping its custom domain and Lovable hosting. Preserve all 85 existing public URLs, CMS records, Supabase authentication and authorization, the admin editor, preview tokens, form drafts, uploads, service worker and Technology/Capabilities models. Render each published service, city, project and article in the initial HTML with its own actual content, title, description, H1, canonical, og:url, og:image and valid JSON-LD. Return permanent HTTP 301 redirects using `src/data/service-redirects.ts`, preserving repeated query parameters; fragments remain browser-side. Unknown routes and missing published records must return HTTP 404 and noindex. Backend failures must return a server error, not a fabricated missing record. Keep sign-in, admin and preview/package content non-indexable and access-controlled. Confirm the canonical www domain, non-www redirect, published revision and rollback procedure. Client navigation and crawler-user-agent spoofing are not acceptance evidence.

Run the added read-only check against an isolated supported preview, then the published canonical origin:

```sh
node_modules/.bin/tsx scripts/verify-public-html.ts https://www.ascentgroupconstruction.com node_modules/.cache/public-html/published.json
```

For a preview that intentionally canonicalizes to production, supply its preview origin, report path, and `https://www.ascentgroupconstruction.com` as the third argument. The checker still requires every route to have its own matching canonical path.

The script inventories the checked-in sitemap (currently 85 URLs), uses ordinary GET requests without executing JavaScript, checks distinct readable content and route metadata/schema/social tags, verifies an invented URL returns 404, checks all 33 service aliases return direct HTTP 301 with query parameters preserved, and requires initial sign-in noindex. It exits nonzero on failure. It does not spoof a verified Google crawler or submit forms. Supply only the canonical HTTPS origin (local loopback HTTP is allowed for regression checks).

Before release, also verify missing dynamic records versus failed-backend responses; canonical domain/cache behavior; social-image GET retrieval; authenticated admin editing, saved old project links, previews, media processing, drafts, and service-worker updates in an isolated environment. The script cannot certify these workflows or production authorization. Owner Search Console inspection is deferred as requested.

The current local build **fails by design as an acceptance target**: all 85 sitemap URLs still share client-rendered initial HTML, unknown URLs return 200, and aliases are client redirects. This honest failing baseline prevents the same architectural problem being called solved by another client patch.

Cloud environment note: GitHub API and git access work. Earlier live-site and Lovable documentation GET requests were denied by the managed network policy. A narrow environment network configuration draft was saved for user review; saving a draft does not apply it to the running session. No live edge response or production CMS capture is certified by this branch's offline evidence.
