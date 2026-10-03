/** Public asset caching only. HTML and private/API requests always use the network. */
const CACHE_VERSION = '5.0.0';
const PRECACHE_NAME = `app-precache-${CACHE_VERSION}`;
const RUNTIME_CACHE = `app-runtime-${CACHE_VERSION}`;
const OWNED_PREFIXES = ['app-precache-', 'app-runtime-', 'app-api-'];
const CURRENT_CACHES = [PRECACHE_NAME, RUNTIME_CACHE];
const MAX_RUNTIME_ENTRIES = 100;

// Leave updates waiting while existing tabs are open. Even a legacy page's
// SKIP_WAITING message must not interrupt an unsaved inquiry or admin editor.
self.addEventListener('install', event => {
  event.waitUntil(caches.open(PRECACHE_NAME)
    .then(cache => Promise.allSettled(['/hero-poster-1.webp'].map(url => cache.add(url)))));
});

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const names = await caches.keys();
    await Promise.all(names
      .filter(name => OWNED_PREFIXES.some(prefix => name.startsWith(prefix)) && !CURRENT_CACHES.includes(name))
      .map(name => caches.delete(name)));
    await self.clients.claim();
  })());
});

const saveAsset = async (request, response) => {
  const cache = await caches.open(RUNTIME_CACHE);
  await cache.put(request, response);
  const keys = await cache.keys();
  await Promise.all(keys.slice(0, Math.max(0, keys.length - MAX_RUNTIME_ENTRIES)).map(key => cache.delete(key)));
};

self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);
  if (request.method !== 'GET' || !['http:', 'https:'].includes(url.protocol)) return;
  if (request.headers.has('authorization') || request.headers.has('range')) return;
  const sameOrigin = url.origin === self.location.origin;
  const fontCDN = ['https://fonts.googleapis.com', 'https://fonts.gstatic.com'].includes(url.origin);
  if (!sameOrigin && !fontCDN) return;

  // No caching or fallback for documents, JSON, inquiries, auth or API responses.
  // The browser retains its normal network error handling for these requests.
  if (request.mode === 'navigate' || request.destination === 'document' || url.pathname.startsWith('/api/')) return;
  if (!['script', 'style', 'image', 'font'].includes(request.destination)) return;

  // Revalidate mutable asset URLs; hashed bundles still benefit from HTTP caching.
  // CacheStorage is a fallback only when the network is unavailable.
  event.respondWith(fetch(request, { cache: 'no-cache' })
    .then(response => {
      if (response.ok && response.type !== 'opaque') {
        event.waitUntil(saveAsset(request, response.clone()).catch(() => undefined));
      }
      return response;
    })
    .catch(async () => {
      const runtime = await caches.open(RUNTIME_CACHE);
      const precache = await caches.open(PRECACHE_NAME);
      return await runtime.match(request) || await precache.match(request)
        || new Response('Asset unavailable offline', { status: 503 });
    }));
});
