import { afterEach, describe, expect, it, vi } from 'vitest';
import workerSource from '../../public/service-worker.js?raw';
import { initializeServiceWorker } from './serviceWorker';

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe('service worker registration', () => {
  it('registers after load once and leaves a waiting update alone', async () => {
    const postMessage = vi.fn();
    const register = vi.fn().mockResolvedValue({ waiting: { postMessage } });
    vi.stubGlobal('navigator', { serviceWorker: { register } });
    vi.spyOn(document, 'readyState', 'get').mockReturnValue('loading');
    const cleanup = initializeServiceWorker();
    expect(register).not.toHaveBeenCalled();
    window.dispatchEvent(new Event('load'));
    window.dispatchEvent(new Event('load'));
    await Promise.resolve();
    expect(register).toHaveBeenCalledExactlyOnceWith('/service-worker.js', { updateViaCache: 'none' });
    expect(postMessage).not.toHaveBeenCalled();
    cleanup();
  });

  it('also registers if the load event already happened', () => {
    const register = vi.fn().mockResolvedValue({});
    vi.stubGlobal('navigator', { serviceWorker: { register } });
    vi.spyOn(document, 'readyState', 'get').mockReturnValue('complete');
    initializeServiceWorker();
    expect(register).toHaveBeenCalledTimes(1);
  });
});

const makeWorker = () => {
  const listeners = new Map<string, (event: Record<string, unknown>) => void>();
  const waits: Promise<unknown>[] = [];
  const runtime = {
    add: vi.fn().mockResolvedValue(undefined),
    put: vi.fn().mockResolvedValue(undefined),
    keys: vi.fn().mockResolvedValue([]),
    delete: vi.fn().mockResolvedValue(true),
    match: vi.fn().mockResolvedValue(undefined),
  };
  const precache = { ...runtime, match: vi.fn().mockResolvedValue(undefined) };
  const caches = {
    keys: vi.fn().mockResolvedValue(['app-runtime-4.0.0', 'app-api-4.0.0', 'app-runtime-5.0.0', 'unrelated-widget-cache']),
    delete: vi.fn().mockResolvedValue(true),
    open: vi.fn((name: string) => Promise.resolve(name.startsWith('app-precache-') ? precache : runtime)),
  };
  const skipWaiting = vi.fn();
  const claim = vi.fn().mockResolvedValue(undefined);
  const fetch = vi.fn().mockResolvedValue(new Response('fresh asset'));
  // Execute the exact deployed source with isolated worker APIs and fixture data.
  const runWorker = new Function('self', 'caches', 'fetch', workerSource);
  runWorker({
      location: { origin: 'https://site.test' },
      clients: { claim }, skipWaiting,
      addEventListener: (name: string, listener: (event: Record<string, unknown>) => void) => listeners.set(name, listener),
  }, caches, fetch);
  const waitUntil = (promise: Promise<unknown>) => waits.push(promise);
  const request = (overrides: Record<string, unknown> = {}) => {
    const respondWith = vi.fn();
    listeners.get('fetch')?.({
      request: {
        url: 'https://site.test/assets/main-hash.js', method: 'GET',
        headers: new Headers(), destination: 'script', mode: 'cors', ...overrides,
      },
      respondWith, waitUntil,
    });
    return respondWith;
  };
  return { listeners, caches, runtime, precache, skipWaiting, claim, fetch, waits, waitUntil, request };
};

describe('deployed service worker', () => {
  it('never force-activates on install or a legacy SKIP_WAITING message', async () => {
    const worker = makeWorker();
    worker.listeners.get('install')?.({ waitUntil: worker.waitUntil });
    worker.listeners.get('message')?.({ data: { type: 'SKIP_WAITING' }, waitUntil: worker.waitUntil });
    await Promise.all(worker.waits);
    expect(worker.skipWaiting).not.toHaveBeenCalled();
    expect(worker.claim).not.toHaveBeenCalled();
  });

  it('removes only older app caches when activation is safe', async () => {
    const worker = makeWorker();
    worker.listeners.get('activate')?.({ waitUntil: worker.waitUntil });
    await Promise.all(worker.waits);
    expect(worker.caches.delete.mock.calls.map(([name]) => name)).toEqual(['app-runtime-4.0.0', 'app-api-4.0.0']);
    expect(worker.claim).toHaveBeenCalledTimes(1);
  });

  it.each([
    { url: 'https://site.test/admin/inbox', destination: 'document', mode: 'navigate' },
    { url: 'https://site.test/api/inquiries', destination: 'script' },
    { url: 'https://site.test/rest/v1/contacts', destination: '' },
    { headers: new Headers({ Authorization: 'Bearer fixture' }) },
    { headers: new Headers({ Range: 'bytes=0-99' }), destination: 'image' },
    { url: 'https://project.supabase.co/rest/v1/contacts' },
    { method: 'POST' },
  ])('does not intercept private, document, API or range requests: %j', overrides => {
    const worker = makeWorker();
    expect(worker.request(overrides)).not.toHaveBeenCalled();
    expect(worker.fetch).not.toHaveBeenCalled();
    expect(worker.caches.open).not.toHaveBeenCalled();
  });

  it('returns fresh assets online and preserves an offline fallback', async () => {
    const worker = makeWorker();
    worker.runtime.match.mockResolvedValue(new Response('old asset'));
    const online = worker.request();
    expect(await (await online.mock.calls[0][0]).text()).toBe('fresh asset');
    await Promise.all(worker.waits);
    expect(worker.runtime.put).toHaveBeenCalledTimes(1);
    worker.fetch.mockRejectedValue(new Error('Offline'));
    const offline = worker.request();
    expect(await (await offline.mock.calls[0][0]).text()).toBe('old asset');
  });

  it('returns a real response when an offline asset has no cached copy', async () => {
    const worker = makeWorker();
    worker.fetch.mockRejectedValue(new Error('Offline'));
    const respondWith = worker.request();
    expect((await respondWith.mock.calls[0][0]).status).toBe(503);
  });

  it('bounds runtime cache growth', async () => {
    const worker = makeWorker();
    worker.runtime.keys.mockResolvedValue(Array.from({ length: 102 }, (_, index) => `asset-${index}`));
    const respondWith = worker.request();
    await respondWith.mock.calls[0][0];
    await Promise.all(worker.waits);
    expect(worker.runtime.delete.mock.calls.map(([key]) => key)).toEqual(['asset-0', 'asset-1']);
  });
});
