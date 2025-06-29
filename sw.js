// Service Worker for caching configuration files
const CACHE_NAME = 'martin-krutsky-cache-v1';
const CONFIG_FILES = [
    '/config/version.json',
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

// Fetch event - serve from cache first, then update from network
self.addEventListener('fetch', (event) => {
    // Only handle requests for configuration files
    if (CONFIG_FILES.some(file => event.request.url.includes(file))) {
        event.respondWith(
            caches.match(event.request)
                .then((cachedResponse) => {
                    // Always fetch from network to check for updates
                    const networkFetch = fetch(event.request)
                        .then((response) => {
                            // Update cache with new response if successful
                            if (response.status === 200) {
                                const responseClone = response.clone();
                                caches.open(CACHE_NAME)
                                    .then((cache) => {
                                        cache.put(event.request, responseClone);
                                        console.log('Updated cache for:', event.request.url);
                                    });
                            }
                            return response;
                        })
                        .catch(() => {
                            // Network failed, return null to use cache
                            return null;
                        });

                    // Return cached response immediately, network response will update cache in background
                    if (cachedResponse) {
                        return cachedResponse;
                    }
                    
                    // If no cache, wait for network response
                    return networkFetch;
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