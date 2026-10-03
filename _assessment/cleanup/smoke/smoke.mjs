/** Local, read-only Phase 0 route baseline. No request may reach a remote server. */
import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { createHash } from 'node:crypto';

const options = Object.fromEntries(process.argv.slice(2).reduce((pairs, arg, i, args) => {
  if (arg.startsWith('--')) pairs.push([arg.slice(2), args[i + 1]]);
  return pairs;
}, []));
const repo = resolve(options.repo || process.cwd());
const output = resolve(options.out || dirname(fileURLToPath(import.meta.url)));
// Read comparison evidence before generating anything; never compare a file to itself after overwriting it.
const previous = options.compare ? JSON.parse(await readFile(resolve(options.compare), 'utf8')) : null;
const screenshotDirectory = previous ? 'comparison' : 'baseline';
const base = new URL(options.base || 'http://127.0.0.1:4190');
if (base.protocol !== 'http:' || !['127.0.0.1', 'localhost'].includes(base.hostname)) {
  throw new Error('Only an HTTP loopback preview is allowed.');
}
const { chromium } = await import(options['playwright-module']
  ? pathToFileURL(resolve(options['playwright-module'])).href : 'playwright');
const routesSource = await readFile(resolve(repo, 'src/routes/AppRoutes.tsx'), 'utf8');
const registrySource = await readFile(resolve(repo, 'src/data/service-registry.ts'), 'utf8');
const redirectsSource = await readFile(resolve(repo, 'src/data/service-redirects.ts'), 'utf8');
const citiesSource = await readFile(resolve(repo, 'src/data/service-area-cities.ts'), 'utf8');
const services = [...registrySource.matchAll(/\{\s*slug: "([^"]+)"([\s\S]*?)source: "(db|static)"/g)]
  .map(([, slug, fields, source], i) => ({
    id: `00000000-0000-4000-8000-${String(i + 1).padStart(12, '0')}`,
    slug, source, name: fields.match(/navLabel: "([^"]+)"/)[1],
    category: fields.match(/category: "([^"]+)"/)[1],
    publish_state: 'published', is_active: true, featured: true, display_order: i,
    short_description: 'Offline baseline fixture content.',
    long_description: '<p>Offline baseline fixture content.</p>',
    service_overview: 'Offline baseline fixture content.',
    featured_image: null, icon_name: null, seo_title: null, seo_description: null,
    seo_keywords: [], process_steps: [], what_we_provide: [], typical_applications: [],
    key_benefits: [], faq_items: [],
  }));
if (services.length !== 22) throw new Error('Service registry parsing needs review.');
const redirects = [...redirectsSource.matchAll(/^\s*(?:"([^"]+)"|(\w+)): "([^"]+)"/gm)]
  .map(([, quoted, bare, destination]) => ({ path: `/services/${quoted || bare}`, destination }));
const cities = [...citiesSource.split('export const primaryServiceCities')[0].matchAll(/"([^"]+)"/g)]
  .map(([, city]) => `/service-areas/${city.toLowerCase().replace(/\s+/g, '-')}`);
const examples = {
  '/services/:slug': '/services/painting-services',
  '/projects/:slug': '/projects/baseline-fixture-project',
  '/blog/:slug': '/blog/baseline-fixture-article',
  '/case-study/:slug': '/case-study/baseline-fixture-article',
  '/service-areas/:city': '/service-areas/toronto',
};
const declaredPublicRoutes = [...routesSource.matchAll(/<Route\s+path="([^"]+)"/g)]
  .map(([, path]) => path)
  .filter(path => path.startsWith('/') && !path.startsWith('/admin') && path !== '/dev/tokens');
const paths = [...new Set([
  ...declaredPublicRoutes.map(path => examples[path] || path),
  ...redirects.map(({ path }) => path), ...services.map(service => `/services/${service.slug}`),
  ...cities, '/baseline-unknown-route',
])];
if (paths.some(path => path.includes(':'))) throw new Error('A dynamic route needs an example.');
const screenshotPaths = ['/', '/services', '/contact', '/estimate', '/submit-rfp', '/projects',
  '/services/painting-services', '/service-areas/toronto', '/privacy'];
const fixtureDate = '2026-10-03T16:00:00.000Z';
const project = {
  id: '10000000-0000-4000-8000-000000000001', slug: 'baseline-fixture-project',
  title: 'Baseline fixture project', summary: 'Offline baseline fixture content.',
  description: 'Offline baseline fixture content.', featured_image: '/hero-poster-1.webp',
  category: 'Commercial', publish_state: 'published', featured: true, is_featured: true,
  year: 2026, created_at: fixtureDate, updated_at: fixtureDate,
  tags: [], before_images: [], after_images: [], content_blocks: [],
  highlights: [], seo_keywords: [], team_credits: [],
};
const article = {
  id: '20000000-0000-4000-8000-000000000001', slug: 'baseline-fixture-article',
  title: 'Baseline fixture article', summary: 'Offline baseline fixture content.',
  content: '<p>Offline baseline fixture content.</p>', category: 'Fixture',
  publish_state: 'published', published_at: fixtureDate, created_at: fixtureDate,
  updated_at: fixtureDate, featured_image: null, tags: [], seo_keywords: [],
};
const tables = { services: services.filter(service => service.source === 'db'),
  projects: [project], blog_posts: [article] };
const browser = await chromium.launch({
  executablePath: options.browser || '/usr/bin/chromium', headless: true,
  args: ['--no-sandbox', '--disable-background-networking',
    '--host-resolver-rules=MAP * ~NOTFOUND, EXCLUDE 127.0.0.1, EXCLUDE localhost'],
});
await mkdir(resolve(output, screenshotDirectory), { recursive: true });
const results = [];
const screenshots = [];
const summarizeUrl = value => {
  const url = new URL(value);
  return `${url.origin === base.origin ? 'local' : 'external'}:${url.pathname}`;
};

async function visit(path, viewport, screenshotName) {
  const context = await browser.newContext({ viewport, reducedMotion: 'reduce',
    colorScheme: 'light', locale: 'en-CA', timezoneId: 'America/New_York',
    serviceWorkers: 'block' });
  const mockedRequests = [];
  const blockedSockets = [];
  const writes = [];
  await context.routeWebSocket(/.*/, socket => {
    blockedSockets.push(summarizeUrl(socket.url()));
    socket.close();
  });
  await context.route('**/*', async route => {
    const request = route.request();
    const url = new URL(request.url());
    const method = request.method();
    // Even loopback writes are blocked. This script never clicks or submits forms.
    if (!['GET', 'HEAD', 'OPTIONS'].includes(method)) {
      writes.push(`${method} ${summarizeUrl(request.url())}`);
      return route.fulfill({ status: 403, contentType: 'application/json',
        body: JSON.stringify({ message: 'Writes disabled in baseline.' }) });
    }
    if (url.origin === base.origin) return route.continue();
    mockedRequests.push(`${method} ${summarizeUrl(request.url())}`);
    const headers = { 'access-control-allow-origin': '*',
      'access-control-allow-headers': '*', 'access-control-expose-headers': 'content-range' };
    if (method === 'OPTIONS') return route.fulfill({ status: 204, headers });
    if (url.pathname.startsWith('/rest/v1/')) {
      const table = url.pathname.slice('/rest/v1/'.length);
      let rows = [...(tables[table] || [])];
      for (const [key, filter] of url.searchParams) {
        if (filter.startsWith('eq.')) rows = rows.filter(row => String(row[key]) === filter.slice(3));
        if (filter.startsWith('neq.')) rows = rows.filter(row => String(row[key]) !== filter.slice(4));
      }
      const count = rows.length;
      if (url.searchParams.has('limit')) rows = rows.slice(0, Number(url.searchParams.get('limit')));
      const single = request.headers().accept?.includes('application/vnd.pgrst.object+json');
      return route.fulfill({ status: 200, contentType: 'application/json', headers: {
        ...headers, 'content-range': count ? `0-${rows.length - 1}/${count}` : '*/0',
      }, body: JSON.stringify(single ? rows[0] || null : rows) });
    }
    if (request.resourceType() === 'image') {
      return route.fulfill({ status: 200, headers, contentType: 'image/svg+xml',
        body: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"><rect width="16" height="16" fill="#eeeeee"/></svg>' });
    }
    return route.fulfill({ status: 200, headers, contentType: 'text/html', body: '' });
  });
  await context.addInitScript(() => {
    // Sandboxed maps have opaque origins and cannot use localStorage.
    if (window !== window.top) return;
    try { localStorage.setItem('cookie-consent', 'rejected'); } catch { /* Essential UI still renders. */ }
  });
  const page = await context.newPage();
  await page.clock.setFixedTime(new Date(fixtureDate));
  const consoleErrors = [];
  const failedRequests = [];
  const failedResponses = [];
  page.on('console', message => { if (message.type() === 'error') consoleErrors.push(message.text()); });
  page.on('pageerror', error => consoleErrors.push(error.message));
  page.on('requestfailed', request => failedRequests.push({
    url: summarizeUrl(request.url()), error: request.failure()?.errorText,
  }));
  page.on('response', response => {
    if (response.status() >= 400) failedResponses.push({
      url: summarizeUrl(response.url()), status: response.status(),
    });
  });
  let observation;
  try {
    const response = await page.goto(new URL(path, base).href, { waitUntil: 'networkidle', timeout: 20000 });
    await page.locator('h1').first().waitFor({ state: 'visible', timeout: 6000 }).catch(() => {});
    await page.waitForTimeout(350);
    observation = await page.evaluate(() => {
      const visibleText = document.body.innerText.replace(/\s+/g, ' ').trim();
      const canonical = [...document.querySelectorAll('link[rel="canonical"]')].map(link => link.href);
      return {
        resolvedPath: location.pathname + location.search, title: document.title,
        canonicalCount: canonical.length, canonicals: canonical,
        h1: document.querySelector('h1')?.innerText.replace(/\s+/g, ' ').trim() || null,
        h1Count: document.querySelectorAll('h1').length,
        somethingWentWrong: /something went wrong/i.test(visibleText),
        notFoundView: /Oops! Page not found|This project or case study doesn't exist/.test(visibleText),
        unavailableView: /Article unavailable|Project unavailable|Article not found|Project not found/.test(visibleText),
        failedLazyView: /Failed to load (?:Admin Layout|page|Blog|Project)/i.test(visibleText),
        visibleText,
      };
    });
    observation.visibleTextSha256 = createHash('sha256').update(observation.visibleText).digest('hex');
    delete observation.visibleText;
    observation.httpStatus = response?.status() ?? null;
    if (screenshotName) {
      await page.screenshot({ path: resolve(output, screenshotDirectory, screenshotName),
        fullPage: true, animations: 'disabled', timeout: 20000 });
      screenshots.push({ path, viewport, file: `${screenshotDirectory}/${screenshotName}` });
    }
  } catch (error) {
    observation = { exception: error.message };
  } finally {
    await context.close();
  }
  const expectedNotFound = ['/404', '/baseline-unknown-route'].includes(path);
  const expectedUtilityError = path === '/.lovable/oauth/consent'; // No OAuth request parameters supplied.
  return { path, viewport, expectedNotFound, expectedUtilityError, ...observation,
    consoleErrorCount: consoleErrors.length, consoleErrors,
    failedNetworkRequestCount: failedRequests.length, failedNetworkRequests: failedRequests,
    failedResponses, mockedRequestCount: mockedRequests.length,
    mockedRequests: [...new Set(mockedRequests)].sort(),
    blockedSockets: [...new Set(blockedSockets)].sort(), blockedWriteAttempts: writes };
}

try {
  for (const path of paths) {
    const name = screenshotPaths.includes(path)
      ? `${path === '/' ? 'home' : path.slice(1).replaceAll('/', '--')}-desktop.png` : null;
    const result = await visit(path, { width: 1440, height: 900 }, name);
    results.push(result);
    console.log(`${result.httpStatus || 'ERR'} ${path} -> ${result.resolvedPath || '?'} | ${result.h1 || '(no H1)'}`);
  }
  for (const path of screenshotPaths) {
    const name = `${path === '/' ? 'home' : path.slice(1).replaceAll('/', '--')}-mobile.png`;
    results.push(await visit(path, { width: 390, height: 844 }, name));
  }
} finally {
  await browser.close();
}
const failures = results.filter(row => row.exception || row.httpStatus !== 200 || (row.somethingWentWrong && !row.expectedUtilityError)
  || row.failedLazyView || (!row.expectedNotFound && (row.notFoundView || row.unavailableView))
  || row.blockedWriteAttempts.length || row.failedResponses.length
  || row.failedNetworkRequestCount);
const baseline = {
  schemaVersion: 1, sourceCommit: options.commit || 'unspecified',
  mode: 'Local production build with synthetic public fixtures; external requests and all writes blocked.',
  declaredPublicRoutes, excluded: ['/admin/* (authentication required)', '/dev/tokens (DEV only)'],
  fixtureDate, serviceWorkers: 'blocked', reducedMotion: 'reduce', colorScheme: 'light',
  screenshots, summary: { desktopRoutes: paths.length, mobileRoutes: screenshotPaths.length,
    observations: results.length, failures: failures.length,
    observationsWithConsoleErrors: results.filter(row => row.consoleErrorCount).length,
    externalRequestsForwarded: 0,
    blockedWriteAttempts: results.reduce((total, row) => total + row.blockedWriteAttempts.length, 0) },
  results,
};
await writeFile(resolve(output, previous ? 'comparison.json' : 'baseline.json'), JSON.stringify(baseline, null, 2) + '\n');
if (previous) {
  const fields = ['path', 'viewport', 'resolvedPath', 'title', 'httpStatus', 'canonicalCount', 'canonicals',
    'h1', 'h1Count', 'somethingWentWrong', 'notFoundView', 'unavailableView', 'failedLazyView',
    'visibleTextSha256', 'consoleErrorCount', 'failedNetworkRequestCount', 'failedResponses'];
  const projectRows = data => data.results.map(row => Object.fromEntries(fields.map(field => [field, row[field]])));
  if (JSON.stringify(projectRows(previous)) !== JSON.stringify(projectRows(baseline))) {
    console.error('Route observations differ from the comparison baseline.');
    process.exitCode = 1;
  }
}
console.log(JSON.stringify(baseline.summary));
if (failures.length) {
  console.error(JSON.stringify(failures.map(row => ({ path: row.path, viewport: row.viewport,
    exception: row.exception, httpStatus: row.httpStatus, consoleErrors: row.consoleErrors,
    failedNetworkRequests: row.failedNetworkRequests, failedResponses: row.failedResponses }))));
  process.exitCode = 1;
}
