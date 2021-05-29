const FILES_TO_CACHE = [
    "/",
    "/index.html",
    "/styles.css",
    "/db.js",
    "/index.js",
];

const PRECACHE = "precache-v1";
const RUNTIME = "runtime";

self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open(RUNTIME)
            .then((cache) => cache.addAll(FILES_TO_CACHE))
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

self.addEventListener('fetch', (event) => {
    if (event.request.url.includes("/api/")) {
        event.respondWith(
            caches.open(PRECACHE).then((cache) => {
                return fetch(event.request)
                .then((response) => {
                    if (response.status === 200) {
                        cache.put(event.request.url, response.clone());
                    }
                    return response;
                })
                .catch((err) => {
                    return cache.match(event.request);
                });
            })
        );
            return;
        }

        event.respondWith(
            caches.open(RUNTIME).then((cache) => {
                return cache.match(event.request).then((response) => {
                    return response || fetch(event.request);
                });
            })
        );
    });
        
