// Ember — service worker : toujours chercher la version la plus récente sur le site,
// et ne se servir du cache qu'en secours (hors ligne). Changer CACHE force la mise à jour chez tout le monde.
const CACHE = 'ember-suite-v1';
const CORE = ['./', './index.html', './manifest.json', './css/style.css', './js/app.js', './js/utils.js', './js/storage.js',
  './js/charts.js', './js/ai.js', './js/background.js', './js/connect.js', './icons/icon-192.png', './icons/icon-512.png'];

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(CORE)).catch(() => {}));
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});

self.addEventListener('fetch', event => {
  const req = event.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== self.location.origin) return;
  event.respondWith(
    fetch(req, { cache: 'no-cache' }).then(res => {
      if (res.ok) { const copy = res.clone(); caches.open(CACHE).then(c => c.put(req, copy)); }
      return res;
    }).catch(() => caches.match(req, { ignoreSearch: true }).then(hit => hit || (req.mode === 'navigate' ? caches.match('./index.html') : Response.error())))
  );
});
