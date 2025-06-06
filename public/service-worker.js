const CACHE_NAME = 'weather-app-cache-v1';
const STATIC_CACHE_NAME = 'weather-app-static-v1';
const DYNAMIC_CACHE_NAME = 'weather-app-dynamic-v1';

const STATIC_ASSETS = [
  '/',
  '/globals.css',
  '/favicon.svg',
  '/manifest.json',
  '/back.jpeg',
  '/service-worker.js'
];

// Cache size limit
const CACHE_SIZE_LIMIT = 50;

// Install event - cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE_NAME)
      .then((cache) => {
        console.log('Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== STATIC_CACHE_NAME && cacheName !== DYNAMIC_CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
          return Promise.resolve();
        })
      );
    })
  );
});

// Helper function to trim cache if it exceeds size limit
async function trimCache(cacheName) {
  const cache = await caches.open(cacheName);
  const keys = await cache.keys();
  if (keys.length > CACHE_SIZE_LIMIT) {
    await Promise.all(
      keys.slice(0, keys.length - CACHE_SIZE_LIMIT).map(key => cache.delete(key))
    );
  }
}

// Helper function to get cache response
async function getCacheResponse(request) {
  const staticCache = await caches.open(STATIC_CACHE_NAME);
  const dynamicCache = await caches.open(DYNAMIC_CACHE_NAME);
  
  // Try static cache first
  const staticResponse = await staticCache.match(request);
  if (staticResponse) return staticResponse;
  
  // Try dynamic cache
  const dynamicResponse = await dynamicCache.match(request);
  if (dynamicResponse) return dynamicResponse;
  
  return null;
}

// Fetch event - handle requests
self.addEventListener('fetch', (event) => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') return;

  // Skip cross-origin requests
  if (!event.request.url.startsWith(self.location.origin)) return;

  event.respondWith(
    (async () => {
      try {
        // Try to get from cache first
        const cachedResponse = await getCacheResponse(event.request);
        if (cachedResponse) {
          // Update cache in background
          fetch(event.request).then(response => {
            if (response.ok) {
              caches.open(DYNAMIC_CACHE_NAME).then(cache => {
                cache.put(event.request, response);
                trimCache(DYNAMIC_CACHE_NAME);
              });
            }
          }).catch(() => {});
          return cachedResponse;
        }

        // If not in cache, fetch from network
        const response = await fetch(event.request);
        
        // Cache successful responses
        if (response.ok) {
          const cache = await caches.open(DYNAMIC_CACHE_NAME);
          cache.put(event.request, response.clone());
          trimCache(DYNAMIC_CACHE_NAME);
        }
        
        return response;
      } catch (error) {
        // If network fails and it's a navigation request, return offline page
        if (event.request.mode === 'navigate') {
          const offlineResponse = await caches.match('/');
          if (offlineResponse) return offlineResponse;
        }
        
        // For other requests, return a custom offline response
        return new Response('Offline', {
          status: 503,
          statusText: 'Service Unavailable',
          headers: new Headers({
            'Content-Type': 'text/plain'
          })
        });
      }
    })()
  );
}); 