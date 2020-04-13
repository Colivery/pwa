self.addEventListener('activate', (event) => {

    event.waitUntil(
        caches.keys().then((cacheNames) => {
            console.log('evict cache name', cacheNames)
            return Promise.all(
                cacheNames.filter((cacheName) => {
                    return true; // evict all caches
                }).map((cacheName) => {
                    return caches.delete(cacheName);
                })
            );
        })
    );

    // unregister - we don't want to evict the cache every time
    self.registration.unregister();
});