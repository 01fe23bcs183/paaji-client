// Service Worker - Unregistration
// This service worker will unregister itself to prevent errors

self.addEventListener('install', () => {
    console.log('[SW] Service worker installing (will self-destruct)');
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    console.log('[SW] Service worker activating (clearing caches)');

    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    console.log('[SW] Deleting cache:', cacheName);
                    return caches.delete(cacheName);
                })
            );
        }).then(() => {
            console.log('[SW] All caches cleared');
            return self.registration.unregister();
        }).then(() => {
            console.log('[SW] Service worker unregistered');
            return self.clients.claim();
        })
    );
});

// Skip all fetch requests - don't intercept anything
self.addEventListener('fetch', () => {
    // Do nothing - let requests pass through normally
    return;
});
