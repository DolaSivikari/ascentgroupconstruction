import { describe, expect, it } from "vitest";
import { createSitemapXml, extractSitemapRoutes } from "../sitemap";

describe("public sitemap", () => {
  it("excludes redirects, aliases, utilities, admin and dynamic route patterns", () => {
    const source = [
      ['/', 'Index'], ['/for-architects', 'ForArchitects'], ['/services/tile-installation-toronto', 'Tile'],
      ['/old-page', 'Navigate'], ['/tekev', 'Auth'], ['/.lovable/oauth/consent', 'OAuthConsent'],
      ['/unsubscribe', 'Unsubscribe'], ['/email-unsubscribe', 'EmailUnsubscribe'],
      ['/case-studies', 'Blog'], ['/blog/:slug', 'BlogPost'], ['/404', 'NotFound'],
      ['/admin', 'UnifiedAdminLayout'], ['/admin/users', 'Users'], ['/dev/tokens', 'TokenPreview'],
      ['users', 'Users'], ['*', 'NotFound'],
    ].map(([path, component]) => `<Route path="${path}" element={<${component} />} />`).join('\n');
    expect(extractSitemapRoutes(source).map(route => route.path)).toEqual([
      '/', '/for-architects', '/services/tile-installation-toronto',
    ]);
  });

  it("deduplicates entries, preserves the latest real date and escapes XML", () => {
    const xml = createSitemapXml('https://example.com/', [
      { path: '/projects/site', lastmod: '2026-09-10T14:32:00Z' },
      { path: '/projects/site', lastmod: '2026-09-11' },
      { path: '/projects/site', lastmod: 'invalid' },
      { path: '/service-areas/toronto' }, { path: '/a&b' },
    ]);
    const document = new DOMParser().parseFromString(xml, 'application/xml');
    expect(document.querySelector('parsererror')).toBeNull();
    expect([...document.querySelectorAll('loc')].map(node => node.textContent)).toEqual([
      'https://example.com/a&b', 'https://example.com/projects/site', 'https://example.com/service-areas/toronto',
    ]);
    expect(document.querySelectorAll('lastmod')).toHaveLength(1);
    expect(document.querySelector('lastmod')?.textContent).toBe('2026-09-11');
    expect(xml).toContain('/a&amp;b');
  });

  it.each(['//other-site.com', '/services/:slug', '/projects?draft=true', '/blog#heading'])(
    "rejects noncanonical path %s", path => {
      expect(() => createSitemapXml('https://example.com', [{ path }])).toThrow('Invalid sitemap path');
    },
  );
});
