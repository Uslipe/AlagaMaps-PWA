const OFFLINE_VERSION = 1;
const CACHE_NAME = 'offline';
// Customize this with a different URL if needed.
const OFFLINE_URL = 'index.html';
const ASSETS = [
    '/index.html',
    '/telaCadastro.html',
    '/telaContatosUteis.html',
    '/telaPrincipal.html',
    '/telaConfig.html',
  
    './Css/contatosUteis.css',
    './Css/main.css',
    './Css/mapa.css',
    './Css/telaLogin-Cadastro.css',
    './Css/telaConfig.css',
  
    './Javascript/pontos.js',
    './Javascript/responsividade.js',
  
    './dist/leaflet.markercluster-src.js',
    './dist/leaflet.markercluster-src.js.map',
    './dist/leaflet.markercluster.js',
    './dist/leaflet.markercluster.js.map',
    './dist/MarkerCluster.css',
    './dist/MarkerCluster.Default.css'
  ];

// self.oninstall = function (evt) {
//   evt.waitUntil(caches.open('offline-cache-name').then(function (cache) {
//     return cache.addAll(ASSETS);
//   }))
// };
this.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open('v1').then(function(cache) {
      return cache.addAll(ASSETS);
    })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    // Enable navigation preload if it's supported.
    // See https://developers.google.com/web/updates/2017/02/navigation-preload
    if ('navigationPreload' in self.registration) {
      await self.registration.navigationPreload.enable();
    }
  })());


  self.clients.claim();
});

self.addEventListener('fetch', (event) => {

  if (event.request.mode === 'navigate') {
    event.respondWith((async () => {
      try {
       
        const preloadResponse = await event.preloadResponse;
        if (preloadResponse) {
          return preloadResponse;
        }

        const networkResponse = await fetch(event.request);
        return networkResponse;
      } catch (error) {
       
        console.log('Fetch failed; returning offline page instead.', error);

        const cache = await caches.open(CACHE_NAME);
        const cachedResponse = await cache.match(OFFLINE_URL);
        return cachedResponse;
      }
    })());
  }

});