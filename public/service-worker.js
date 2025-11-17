/**
 * Permanent Service Worker - No dependencies
 * Ensures fresh HTML + cached assets never mix versions
 */

const CACHE_VERSION = '1.0.4';
const PRECACHE_NAME = `app-precache-${CACHE_VERSION}`;
const RUNTIME_CACHE = `app-runtime-${CACHE_VERSION}`;
const API_CACHE = `app-api-${CACHE_VERSION}`;

// Activate immediately & take control of all pages
self.skipWaiting();

self.addEventListener('install', event => {
  // Minimal precache: only critical assets that always exist
  const precacheUrls = [
    '/',
    '/index.html',
    '/hero-poster-1.webp',
    '/hero-poster-2.webp',
    '/hero-poster-3.webp',
    '/hero-poster-4.webp',
    '/hero-poster-5.webp',
    '/hero-poster-6.webp',
    '/hero-poster-7.webp',
    '/hero-poster-8.webp',
  ];
  
  event.waitUntil(
    caches.open(PRECACHE_NAME)
      .then(cache => {
        // Use addAll but catch failures gracefully
        return Promise.allSettled(
          precacheUrls.map(url => cache.add(url))
        ).catch(() => {
          // If precache fails, continue anyway
          console.warn('[SW] Precache failed, continuing');
        });
      })
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    (async () => {
      // Claim all clients immediately
      await self.clients.claim();
      
      // Delete old caches
      const cacheNames = await caches.keys();
      await Promise.all(
        cacheNames
          .filter(name => !name.includes(CACHE_VERSION))
          .map(name => caches.delete(name))
      );
    })()
  );
});

self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Filter out browser extensions and unsupported protocols
  if (
    url.protocol === 'chrome-extension:' ||
    url.protocol === 'moz-extension:' ||
    url.protocol === 'safari-extension:' ||
    url.protocol === 'edge-extension:' ||
    url.protocol === 'about:' ||
    url.protocol === 'data:' ||
    url.protocol === 'blob:'
  ) {
    return; // Don't cache these at all
  }

  // Only cache same-origin requests or specific allowed CDNs
  const allowedOrigins = [
    self.location.origin,
    'https://fonts.googleapis.com',
    'https://fonts.gstatic.com'
  ];

  const isSameOrigin = url.origin === self.location.origin;
  const isAllowedCDN = allowedOrigins.some(allowed => url.origin === allowed);

  if (!isSameOrigin && !isAllowedCDN) {
    return; // Don't cache third-party resources
  }

  // Skip analytics and tracking scripts
  if (
    url.hostname.includes('googletagmanager') ||
    url.hostname.includes('google-analytics') ||
    url.pathname.includes('/gtag/') ||
    url.pathname.includes('/analytics/')
  ) {
    return; // Don't cache analytics
  }

  // HTML pages: ALWAYS network-first, NEVER serve stale cache
  if (request.destination === 'document' || request.mode === 'navigate') {
    event.respondWith(
      fetch(request, { cache: 'no-cache' })
        .then(response => {
          // Don't cache HTML at all to prevent stale content
          return response;
        })
        .catch(() => {
          // Only use cache as last resort fallback when offline
          return caches.match(request)
            .then(cached => cached || new Response('Offline', { status: 503 }));
        })
    );
    return;
  }

  // API calls (Supabase, etc.): Network-first with timeout
  if (url.hostname.includes('supabase') || url.pathname.includes('/api/')) {
    event.respondWith(
      Promise.race([
        fetch(request),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('timeout')), 5000)
        ),
      ])
        .then(response => {
          if (response.ok) {
            const responseToCache = response.clone();
            caches.open(API_CACHE)
              .then(cache => cache.put(request, responseToCache))
              .catch(err => console.warn('[SW] API cache failed:', err));
          }
          return response;
        })
        .catch(() => {
          return caches.match(request)
            .then(cached => cached || new Response('API Offline', { status: 503 }));
        })
    );
    return;
  }

  // JS/CSS: Stale-while-revalidate (serve cached, fetch fresh in background)
  if (request.destination === 'script' || request.destination === 'style') {
    event.respondWith(
      caches.match(request)
        .then(cached => {
          const fetchPromise = fetch(request).then(response => {
            if (response.ok) {
              const responseToCache = response.clone();
              caches.open(RUNTIME_CACHE)
                .then(cache => cache.put(request, responseToCache))
                .catch(err => console.warn('[SW] Script cache failed:', err));
            }
            return response;
          }).catch(() => cached);
          
          return cached || fetchPromise;
        })
    );
    return;
  }

  // Images/fonts: Cache-first
  if (request.destination === 'image' || request.destination === 'font') {
    event.respondWith(
      caches.match(request)
        .then(cached => {
          if (cached) return cached;
          
          return fetch(request).then(response => {
            if (response.ok) {
              const responseToCache = response.clone();
              caches.open(RUNTIME_CACHE)
                .then(cache => cache.put(request, responseToCache))
                .catch(err => console.warn('[SW] Image cache failed:', err));
            }
            return response;
          });
        })
        .catch(() => new Response('Not found', { status: 404 }))
    );
    return;
  }

  // Default: Network-first
  event.respondWith(
    fetch(request)
      .then(response => {
        if (response.ok) {
          const responseToCache = response.clone();
          caches.open(RUNTIME_CACHE)
            .then(cache => cache.put(request, responseToCache))
            .catch(err => console.warn('[SW] Default cache failed:', err));
        }
        return response;
      })
      .catch(() => caches.match(request))
  );
});

// Handle messages from page
self.addEventListener('message', event => {
  if (event.data?.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
