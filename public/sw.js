const CACHE_NAME = 'fe-em-jesus-v2.0.0';
const urlsToCache = [
  '/',
  '/manifest.json',
  '/logo.png',
  '/patrocinador1.png',
  '/patrocinador2.png',
  '/offline.html',
  // Core CSS and JS files will be added by Vite
];

// Install event - cache resources
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Service Worker: Cache opened');
        return cache.addAll(urlsToCache);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Service Worker: Deleting old cache', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Fetch event - serve from cache when offline
self.addEventListener('fetch', (event) => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') {
    return;
  }

  // Handle API requests differently
  if (event.request.url.includes('/api/')) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          // If online, cache the response and return it
          if (response.status === 200) {
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseClone);
            });
          }
          return response;
        })
        .catch(() => {
          // If offline, try to get from cache
          return caches.match(event.request)
            .then((cachedResponse) => {
              if (cachedResponse) {
                return cachedResponse;
              }
              // Return offline fallback for API requests
              return new Response(
                JSON.stringify({ 
                  message: 'Você está offline. Conecte-se à internet para ver o conteúdo mais recente.',
                  offline: true 
                }),
                {
                  status: 200,
                  statusText: 'OK',
                  headers: { 'Content-Type': 'application/json' }
                }
              );
            });
        })
    );
    return;
  }

  // Handle static assets and pages
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return cached version or fetch from network
        return response || fetch(event.request)
          .then((fetchResponse) => {
            // Don't cache non-successful responses
            if (!fetchResponse || fetchResponse.status !== 200 || fetchResponse.type !== 'basic') {
              return fetchResponse;
            }

            // Clone the response for caching
            const responseToCache = fetchResponse.clone();
            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              });

            return fetchResponse;
          })
          .catch(() => {
            // If offline and no cache, return offline page
            if (event.request.destination === 'document') {
              return caches.match('/offline.html');
            }
          });
      })
  );
});

// Background sync for prayer requests and interactions
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync-prayer') {
    event.waitUntil(syncPrayerRequests());
  }
  if (event.tag === 'background-sync-interaction') {
    event.waitUntil(syncUserInteractions());
  }
});

// Push notifications
self.addEventListener('push', (event) => {
  const options = {
    body: event.data ? event.data.text() : 'Nova mensagem cristã disponível!',
    icon: '/icon-192x192.png',
    badge: '/icon-192x192.png',
    tag: 'daily-devotional',
    requireInteraction: false,
    actions: [
      {
        action: 'open',
        title: 'Abrir App',
        icon: '/icon-192x192.png'
      },
      {
        action: 'close',
        title: 'Fechar'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('Fé em Jesus BR', options)
  );
});

// Notification click handling
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'open' || !event.action) {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

// Sync functions
async function syncPrayerRequests() {
  // Sync offline prayer requests when online
  try {
    const cache = await caches.open(CACHE_NAME);
    const offlineRequests = await cache.match('/offline-prayers');
    
    if (offlineRequests) {
      const requests = await offlineRequests.json();
      
      for (const request of requests) {
        try {
          await fetch('/api/prayer-requests', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(request)
          });
        } catch (error) {
          console.log('Failed to sync prayer request:', error);
        }
      }
      
      // Clear offline storage after sync
      await cache.delete('/offline-prayers');
    }
  } catch (error) {
    console.log('Background sync failed:', error);
  }
}

async function syncUserInteractions() {
  // Sync offline user interactions when online
  try {
    const cache = await caches.open(CACHE_NAME);
    const offlineInteractions = await cache.match('/offline-interactions');
    
    if (offlineInteractions) {
      const interactions = await offlineInteractions.json();
      
      for (const interaction of interactions) {
        try {
          await fetch('/api/interactions', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(interaction)
          });
        } catch (error) {
          console.log('Failed to sync interaction:', error);
        }
      }
      
      // Clear offline storage after sync
      await cache.delete('/offline-interactions');
    }
  } catch (error) {
    console.log('Background sync failed:', error);
  }
}