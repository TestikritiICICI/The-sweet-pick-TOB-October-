/* Carousel Studio service worker — app shell offline, CDN assets cached on first use. */
const CACHE = 'carousel-studio-v1';
const SHELL = ['./', './index.html', './manifest.webmanifest', './icon.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys()
    .then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const { request } = e;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);

  /* app shell: network first so updates land, cache as fallback */
  if (url.origin === location.origin) {
    e.respondWith(
      fetch(request)
        .then(r => { const c = r.clone(); caches.open(CACHE).then(k => k.put(request, c)); return r; })
        .catch(() => caches.match(request).then(r => r || caches.match('./index.html')))
    );
    return;
  }
  /* fonts + CDN modules + model weights: cache first, they are versioned */
  e.respondWith(
    caches.match(request).then(hit => hit || fetch(request).then(r => {
      if (r.ok && (r.type === 'basic' || r.type === 'cors')) {
        const c = r.clone(); caches.open(CACHE).then(k => k.put(request, c));
      }
      return r;
    }).catch(() => hit))
  );
});
