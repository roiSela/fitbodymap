const CACHE = 'fitbodymap-v1'
const BASE = '/fitbodymap/'
const APP_SHELL = [BASE, `${BASE}index.html`, `${BASE}manifest.json`, `${BASE}icon.svg`]

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(APP_SHELL)))
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))),
  )
  self.clients.claim()
})

self.addEventListener('fetch', (event) => {
  const req = event.request
  if (req.method !== 'GET') return

  // Page navigations: network first, fall back to cached app shell when offline.
  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req).catch(() => caches.match(`${BASE}index.html`)),
    )
    return
  }

  // Everything else (JS/CSS bundle, exercise images/data from the CDN):
  // stale-while-revalidate so previously viewed content works offline.
  event.respondWith(
    caches.open(CACHE).then(async (cache) => {
      const cached = await cache.match(req)
      const network = fetch(req)
        .then((res) => {
          if (res.ok) cache.put(req, res.clone())
          return res
        })
        .catch(() => cached)
      return cached ?? network
    }),
  )
})
