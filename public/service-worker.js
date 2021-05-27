const staticBudgetToCache = [
    "/",
    "/index.html",
    "/styles.css",
    "/db.js",
    "/index.js",
    "/manifest.webmanifest",

];

const PRECACHE = "precache-v1";
const RUNTIME = "runtime";

self.addEventListener("install", (installEvent) => {
    installEvent.waitUntil(
        caches.open(PRECACHE)
            .then((cache) => cache.addAll(staticBudgetToCache))
            .then(self.skipWaiting())
    );
});

self.addEventListener("activate", (event) => {
    const currentCaches = [PRECACHE, RUNTIME];
    event.waitUntil(
        caches
        .keys()
        .then((cacheNames) => {
            return cacheNames.filter((cacheName) => !currentCaches.includes(cacheName));
    })
    .then((cachesToDelete) => {
        return Promise.all(
            cachesToDelete.map((cachesToDelete) => {
                return caches.delete(cachesToDelete);
            })
        );
    })
    .then(() => self.clients.claim())
    );
});

self.addEventListener('fetch', (fetchEvent) => {
    if (fetchEvent.request.url.startsWith(self.location.origin)) {
        fetchEvent.respondWith(
            caches.match(fetchEvent.request).then((cachedResponse) => {
                if (cachedResponse) {
                    return cachedResponse;
                }

                return caches.open(RUNTIME).then((cache) => {
                    return fetch(fetchEvent.request).then((response) => {
                        return cache.put(fetchEvent.request, response.clone()).then(() => {
                            return response;
                        });
                    });
                });
            })
        );
    }
});
