const CACHE = 'wan-performance-v3-20260716-4';

const PRECACHE = [
  './',
  './index.html',
  './css/style.css?v=20260716-4',
  './js/app.js?v=20260716-4',
  './manifest.json?v=20260716-4',
  './assets/icons/icon-192.png',
  './assets/icons/icon-512.png',
  './assets/covers/quadriceps.webp',
  './assets/covers/push.webp',
  './assets/covers/posterior.webp',
  './assets/covers/pull.webp',
  './assets/covers/pernas.webp'
];

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(PRECACHE)));
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(
      keys.filter(key => key !== CACHE).map(key => caches.delete(key))
    );

    await self.clients.claim();

    const clients = await self.clients.matchAll({ type: 'window' });
    for (const client of clients) {
      client.postMessage({ type: 'APP_UPDATED', version: '20260716-4' });
    }
  })());
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;

  const request = event.request;
  const url = new URL(request.url);

  if (request.mode === 'navigate' || request.destination === 'document') {
    event.respondWith((async () => {
      try {
        const fresh = await fetch(request, { cache: 'no-store' });
        const cache = await caches.open(CACHE);
        cache.put('./index.html', fresh.clone());
        return fresh;
      } catch {
        return (await caches.match(request)) || (await caches.match('./index.html'));
      }
    })());
    return;
  }

  if (url.origin === self.location.origin) {
    event.respondWith((async () => {
      const cached = await caches.match(request);
      const network = fetch(request, { cache: 'no-store' })
        .then(async response => {
          if (response && response.ok) {
            const cache = await caches.open(CACHE);
            cache.put(request, response.clone());
          }
          return response;
        })
        .catch(() => null);

      return cached || (await network) || Response.error();
    })());
  }
});
