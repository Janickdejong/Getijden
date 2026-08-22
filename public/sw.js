/* Eenvoudige offline-cache. Verhoog VERSIE na elke nieuwe versie. */
const VERSIE = "getijden-v1-3-3";

self.addEventListener("install", (e) => {
  self.skipWaiting();
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((k) =>
      Promise.all(k.filter((n) => n !== VERSIE).map((n) => caches.delete(n)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (e) => {
  if (e.request.method !== "GET") return;
  e.respondWith(
    caches.open(VERSIE).then(async (cache) => {
      const uitCache = await cache.match(e.request);
      const vanHetNet = fetch(e.request)
        .then((r) => {
          if (r && r.status === 200) cache.put(e.request, r.clone());
          return r;
        })
        .catch(() => uitCache);
      return uitCache || vanHetNet;
    })
  );
});
