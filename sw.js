/* ═══════════════════════════════════════════════════════════
   MuscleOS Service Worker — Offline Support & Caching
═══════════════════════════════════════════════════════════ */

const CACHE_VERSION = 'v1';
const CACHE_NAME = `muscleos-${CACHE_VERSION}`;

// Assets to cache on install
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/css/tokens.css',
  '/css/layout.css',
  '/css/components.css',
  '/js/auth.js',
  '/js/algorithms.js',
  '/js/data.js',
  '/js/app.js',
  'https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,400&display=swap',
];

/* INSTALL: Cache essential assets */
self.addEventListener('install', event => {
  console.log('[SW] Installing...');
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('[SW] Caching assets...');
      return cache.addAll(ASSETS_TO_CACHE).catch(err => {
        // If some assets fail (like fonts), continue
        console.warn('[SW] Some assets failed to cache:', err);
        return Promise.resolve();
      });
    })
  );
  self.skipWaiting();
});

/* ACTIVATE: Clean old caches */
self.addEventListener('activate', event => {
  console.log('[SW] Activating...');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames
          .filter(name => name.startsWith('muscleos-') && name !== CACHE_NAME)
          .map(name => {
            console.log('[SW] Deleting old cache:', name);
            return caches.delete(name);
          })
      );
    })
  );
  self.clients.claim();
});

/* FETCH: Network-first strategy for API, Cache-first for assets */
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  // API calls: Network first, fallback to cache
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(networkFirst(event.request));
  }
  // Fonts: Cache first, fallback to network
  else if (url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com') {
    event.respondWith(cacheFirst(event.request));
  }
  // HTML, CSS, JS: Network first with cache fallback
  else if (url.pathname.endsWith('.html') || url.pathname.endsWith('.css') || url.pathname.endsWith('.js')) {
    event.respondWith(networkFirst(event.request));
  }
  // Everything else: Cache first
  else {
    event.respondWith(cacheFirst(event.request));
  }
});

/* Cache-first strategy */
function cacheFirst(request) {
  return caches.match(request).then(response => {
    if (response) return response;

    return fetch(request).then(response => {
      // Don't cache failed requests
      if (!response || response.status !== 200 || response.type === 'error') {
        return response;
      }

      // Clone and cache successful response
      const responseToCache = response.clone();
      caches.open(CACHE_NAME).then(cache => {
        cache.put(request, responseToCache);
      });

      return response;
    }).catch(() => {
      // Return offline page or empty response
      if (request.destination === 'document') {
        return caches.match('/index.html');
      }
      return new Response('Offline', { status: 503 });
    });
  });
}

/* Network-first strategy */
function networkFirst(request) {
  return fetch(request)
    .then(response => {
      // Don't cache failed requests
      if (!response || response.status !== 200) {
        return response;
      }

      // Cache successful response
      const responseToCache = response.clone();
      caches.open(CACHE_NAME).then(cache => {
        cache.put(request, responseToCache);
      });

      return response;
    })
    .catch(() => {
      // Fallback to cache
      return caches.match(request).then(response => {
        if (response) return response;
        if (request.destination === 'document') {
          return caches.match('/index.html');
        }
        return new Response('Offline', { status: 503 });
      });
    });
}

/* Message handler: Skip waiting on update */
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
