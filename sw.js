const NOMBRE_CACHE = 'bep-pwa-v1';
const ARCHIVOS_CACHE = [
  './',
  './index.html',
  './manifest.json'
];

self.addEventListener('install', evento => {
  evento.waitUntil(
    caches.open(NOMBRE_CACHE)
      .then(cache => cache.addAll(ARCHIVOS_CACHE))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', evento => {
  evento.waitUntil(
    caches.keys().then(clavesCache => {
      return Promise.all(
        clavesCache.filter(clave => clave !== NOMBRE_CACHE)
          .map(clave => caches.delete(clave))
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', evento => {
  evento.respondWith(
    caches.match(evento.request)
      .then(respuestaCache => {
        return respuestaCache || fetch(evento.request)
          .then(respuestaRed => {
            return caches.open(NOMBRE_CACHE).then(cache => {
              cache.put(evento.request, respuestaRed.clone());
              return respuestaRed;
            });
          });
      })
  );
});
