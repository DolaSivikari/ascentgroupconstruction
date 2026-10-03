# Navigation and page discovery

These changes follow the October 2 audit without expanding the main menu or changing the design foundations from PR #37.

- Known city names on service pages link to the 17 existing city pages. Unknown locations stay as text.
- Ordinary project cards have native React Router links, including keyboard activation and opening in a new tab. Quick View stays a separate button.
- The Services directory and menu use the service registry's three categories: Building Envelope, Restoration & Repair, and Interior & Finishes. Unregistered future database services remain visible in their database category.
- Interior Finishing & Renovations is registered for mobile navigation search.
- Painting links to five painting specialties; Tile & Flooring links to tile and flooring installation; Caulking & Sealants links to Sealant Programs; Building Envelope links to Sustainable Construction; Interior Finishing links to Interior Finishing & Renovations. Specialty pages have a parent breadcrumb, also reflected in structured data.
- The repository sitemap covers all 85 audited public content destinations, adding the 36 missing URLs. Admin, login, utilities, aliases, redirect routes, and future-dated articles are excluded.

## Refresh the sitemap

Run `npm run sitemap:generate` from the repository root after publishing, unpublishing, or changing service, project, or article content, and before a frontend release. Review and commit `public/sitemap.xml`, then publish the website. The normal build remains independent of network availability.

The command reads production Vite environment bindings (`VITE_SUPABASE_URL` and the public publishable/anonymous key) and uses read-only requests for published records. Blog dates match the Insights directory's publication cutoff. It includes static content routes and known cities, preserves existing slugs, deduplicates URLs, and uses actual database modification dates or source history rather than inventing dates. If a request fails or a content table unexpectedly returns no published rows, it leaves the existing sitemap unchanged. Proxy-based environments using Node 24 can run `NODE_USE_ENV_PROXY=1 npm run sitemap:generate`.

This change makes no database writes. Merging the PR updates GitHub; the public site still needs Lovable's **Publish → Update** step. The sitemap and HTML map describe repository coverage; the live domain returned HTTP 403 to this environment during the original audit, so live indexing or deployment parity is not implied.

The [interactive map](site-navigation-map.html) and [CSV inventory](site-page-inventory.csv) reflect these fixes. The [original audit](site-navigation-audit.md) remains a dated record of the findings.
