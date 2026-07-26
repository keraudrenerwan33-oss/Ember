// ===================== sw.js =====================
// Met en cache les fichiers de l'app pour qu'Ember fonctionne hors-ligne
// et soit installable comme une vraie application.
const CACHE_NAME = 'ember-cache-v1';
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './css/style.css',
  './js/storage.js',
  './js/utils.js',
  './js/connect.js',
  './js/charts.js',
  './js/ai.js',
  './js/app.js',
  './icons/icon-192.png',
  './icons/icon-512.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(
      keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))
    )).then(() => self.clients.claim())
  );
});

// Stratégie : réseau d'abord pour les ressources externes (polices, Chart.js),
// cache d'abord pour les fichiers de l'app (rapide + fonctionne hors-ligne).
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  const isSameOrigin = url.origin === self.location.origin;

  if (!isSameOrigin) {
    // CDN externes (fonts, Chart.js) : réseau, avec repli sur le cache si hors-ligne
    event.respondWith(
      fetch(event.request).then((res) => {
        const clone = res.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
        return res;
      }).catch(() => caches.match(event.request))
    );
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;
      return fetch(event.request).then((res) => {
        const clone = res.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
        return res;
      });
    }).catch(() => caches.match('./index.html'))
  );
});
