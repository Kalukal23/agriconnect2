// Service Worker for offline support
const CACHE_NAME = "agriconnect-v1"
const urlsToCache = [
  "/",
  "/dashboard",
  "/market",
  "/weather",
  "/knowledge",
  "/community",
  "/auth/login",
  "/auth/register",
]

// Install event - cache resources
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("[v0] Service Worker: Caching files")
      return cache.addAll(urlsToCache)
    }),
  )
})

// Activate event - clean up old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log("[v0] Service Worker: Clearing old cache")
            return caches.delete(cacheName)
          }
        }),
      )
    }),
  )
})

// Fetch event - serve from cache, fallback to network
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // Return cached version or fetch from network
      return (
        response ||
        fetch(event.request).then((fetchResponse) => {
          // Cache new requests
          return caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, fetchResponse.clone())
            return fetchResponse
          })
        })
      )
    }),
  )
})
