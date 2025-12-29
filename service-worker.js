const CACHE_VERSION = 2
const CACHE_NAME = `snake-v${CACHE_VERSION}`
const RESOURCES = [
  '/',
  '/index.html',
  '/style.css',
  '/main.js',
  '/game-components/Game.js',
  '/game-components/Renderer.js',
  '/game-components/InputHandler.js',
  '/game-components/Snake.js',
  '/game-components/Fruit.js',
  '/service-worker-registration.js',
  '/assets/imgs/snake.png',
  '/assets/fonts/Jersey10-Regular.ttf',
  '/manifest.json'
]
const CACHE_KEEP_LIST = [CACHE_NAME]

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => {
    return cache.addAll(RESOURCES)
  }))
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  event.waitUntil(caches.keys().then((cacheNames) => {
    const cachesToDelete = cacheNames.filter((name) => !CACHE_KEEP_LIST.includes(name))

    return Promise.all(
      cachesToDelete.map((cacheName) => caches.delete(cacheName))
    )
  }))
})

async function putInCache(request, response) {
  const cache = await caches.open(CACHE_NAME)
  await cache.put(request, response)
}

async function cacheFirst(request, event) {
  const cachedResponse = await caches.match(request)
  if (cachedResponse) {
    return cachedResponse
  }

  const networkResponse = await fetch(request)

  event.waitUntil(putInCache(request, networkResponse.clone()))

  return networkResponse
}

self.addEventListener('fetch', (event) => {
  event.respondWith(cacheFirst(event.request, event))
})
