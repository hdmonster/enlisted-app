// File to Save Cache

const staticCacheName = 'enlisted-v1.0';

const filesToCache = [
    '/playground/homepage',
    '/playground/offline',
    '/css/style.css'
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(staticCacheName)
            .then(cache => {
                return cache.addAll(filesToCache);
            })
    );
  });

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
        .then(response => {
            if (response) {
                return response;
            }
            return fetch(event.request)
        }).catch(error => {
            return caches.match('/playground/offline');
        })
    );
  });

self.addEventListener('activate', event => {
    console.log('Activating new service worker...');
  
    const cacheAllowlist = [staticCacheName];
  
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheAllowlist.indexOf(cacheName) === -1) {
                        return caches.delete(cacheName);
                    }
                })
            );
        }).catch(err =>{
            console.log(err)
        })
    );

});


