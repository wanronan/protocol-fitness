const CACHE = 'protocol-fitness-v3';
const ASSETS = [
  './',
  './index.html',
  './treino.html',
  './progresso.html',
  './orientacoes.html',
  './css/style.css',
  './js/treino-data.js',
  './js/storage.js',
  './js/app.js',
  './js/treino.js',
  './js/progresso.js',
  './manifest.json',
  './assets/icons/protocol-fitness-logo.png',
  './assets/icons/icon-192.png',
  './assets/icons/icon-512.png',
  './assets/covers/quadriceps-card-v3.png',
  './assets/covers/push-card-v3.png',
  './assets/covers/posterior-card-v3.png',
  './assets/covers/pull-card-v3.png',
  './assets/covers/completo-card-v3.png'
];

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(key => key !== CACHE).map(key => caches.delete(key))))
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    caches.match(event.request).then(cached => cached || fetch(event.request).then(response => {
      const copy = response.clone();
      caches.open(CACHE).then(cache => cache.put(event.request, copy));
      return response;
    }).catch(() => caches.match('./index.html')))
  );
});
