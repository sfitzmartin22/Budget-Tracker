const staticBudgetToCache = [
    "/",
    "/index.html",
    "/styles.css",
    "/db.js",
    "/index.js"
];

const PRECACHE = "precache-v1";
const RUNTIME = "runtime";

self.addEventListener("install", (event) => {
    event.waitUntil(
        caches
            .open(PRECACHE)
            .then((cache) => cache.addAll(staticBudgetToCache))
            .then(self.skipWaiting())
    );
});