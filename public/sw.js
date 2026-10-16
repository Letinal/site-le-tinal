// Service worker : reseau prioritaire, coquille hors-ligne. v3 (purge les anciens caches).
const CACHE = 'tinal-v3';
const SHELL = ['/', '/programme', '/concerts', '/association', '/adherer', '/manifest.webmanifest', '/favicon.svg'];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE)
      .then(c => Promise.allSettled(SHELL.map(u => c.add(u))))
      .then(() => self.skipWaiting())
  );
});
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});
self.addEventListener('fetch', (e) => {
  const url = new URL(e.request.url);
  if (e.request.method !== 'GET') return;          // POST : jamais en cache
  if (url.pathname.startsWith('/api/')) return;    // donnees : toujours reseau
  if (url.pathname.startsWith('/bureau')) return;  // gestion : toujours reseau, jamais en cache
  e.respondWith(
    fetch(e.request)
      .then(r => {
        if (r && r.status === 200 && r.type === 'basic') {
          const cp = r.clone();
          caches.open(CACHE).then(c => c.put(e.request, cp));
        }
        return r;
      })
      .catch(() => caches.match(e.request).then(m => m || caches.match('/')))
  );
});
