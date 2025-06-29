// Service Worker for caching configuration files
const CACHE_NAME = 'martin-krutsky-cache-v1';
const CONFIG_FILES = [
    '/config/site.json',
    '/config/personal.json',
    '/config/research.json',
    '/config/papers.json',
    '/config/talks.json',
    '/config/social.json'
];

// Install event - cache configuration files
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('Caching configuration files');
                return cache.addAll(CONFIG_FILES);
            })
            .catch((error) => {
                console.log('Cache failed:', error);
            })
    );
});

// Fetch event - serve from cache if available
self.addEventListener('fetch', (event) => {
    // Only handle requests for configuration files
    if (CONFIG_FILES.some(file => event.request.url.includes(file))) {
        event.respondWith(
            caches.match(event.request)
                .then((response) => {
                    // Return cached version if available
                    if (response) {
                        return response;
                    }
                    
                    // Otherwise fetch from network
                    return fetch(event.request)
                        .then((response) => {
                            // Cache the response for future use
                            if (response.status === 200) {
                                const responseClone = response.clone();
                                caches.open(CACHE_NAME)
                                    .then((cache) => {
                                        cache.put(event.request, responseClone);
                                    });
                            }
                            return response;
                        });
                })
                .catch(() => {
                    // If both cache and network fail, return a basic response
                    return new Response(JSON.stringify({}), {
                        headers: { 'Content-Type': 'application/json' }
                    });
                })
        );
    }
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
}); 