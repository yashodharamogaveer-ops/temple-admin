/* Admin PWA service worker — Only caches this app's own files. Supabase requests always go to the network. */
const CACHE = 'temple-admin-v1';
self.addEventListener('install', e => { self.skipWaiting(); });
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const req = e.request;
  const url = new URL(req.url);
  if (req.method !== 'GET' || url.origin !== self.location.origin) return;   // Supabase etc. go straight to network
  const isAsset = url.pathname.startsWith('/assets/') || url.pathname.startsWith('/icons/');
  if (isAsset) {                                      // hashed build files: cache-first
    e.respondWith(caches.match(req).then(hit => hit || fetch(req).then(res => { const c = res.clone(); caches.open(CACHE).then(ch => ch.put(req, c)); return res; })));
  } else if (req.mode === 'navigate') {                // pages: network-first, fall back to cached shell when offline
    e.respondWith(fetch(req).then(res => { const c = res.clone(); caches.open(CACHE).then(ch => ch.put('/', c)); return res; }).catch(() => caches.match('/')));
  }
});
