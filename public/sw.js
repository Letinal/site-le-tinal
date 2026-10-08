// Service worker minimal : coquille hors-ligne, reseau prioritaire pour l'API.
const CACHE = 'tinal-v2';
const SHELL = ['/', '/programme', '/adherer', '/association', '/admin', '/manifest.webmanifest', '/favicon.svg'];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', (e) => {
  const url = new URL(e.request.url);
  if (e.request.method !== 'GET') return;                 // POST (adhesion, statut) : jamais en cache
  if (url.pathname.startsWith('/api/')) return;            // donnees : toujours reseau
  e.respondWith(
    fetch(e.request)
      .then(r => { const cp = r.clone(); caches.open(CACHE).then(c => c.put(e.request, cp)); return r; })
      .catch(() => caches.match(e.request).then(m => m || caches.match('/')))
  );
});
