// MusicFlip Service Worker
// Handles share targets, caching, and offline functionality

const CACHE_NAME = 'musicflip-v2';
const STATIC_CACHE = [
  '/',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
];

// Install event - cache static resources
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Service Worker: Caching static resources');
        return cache.addAll(STATIC_CACHE);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('Service Worker: Deleting old cache', cache);
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  // Handle share target requests
  if (event.request.url.includes('/share')) {
    event.respondWith(handleShareTarget(event.request));
    return;
  }

  // Handle regular requests with cache-first strategy for static assets
  if (event.request.destination === 'document' || 
      event.request.destination === 'script' ||
      event.request.destination === 'style' ||
      event.request.destination === 'image') {
    
    event.respondWith(
      caches.match(event.request)
        .then((response) => {
          // Return cached version or fetch from network
          return response || fetch(event.request).then((fetchResponse) => {
            // Cache successful responses
            if (fetchResponse.ok) {
              const responseClone = fetchResponse.clone();
              caches.open(CACHE_NAME).then((cache) => {
                cache.put(event.request, responseClone);
              });
            }
            return fetchResponse;
          });
        })
        .catch(() => {
          // Fallback for offline scenarios
          if (event.request.destination === 'document') {
            return caches.match('/');
          }
        })
    );
  }
});

// Handle Web Share Target API
async function handleShareTarget(request) {
  const url = new URL(request.url);
  const sharedUrl = url.searchParams.get('url');
  const sharedText = url.searchParams.get('text');
  const sharedTitle = url.searchParams.get('title');

  console.log('Share Target received:', { sharedUrl, sharedText, sharedTitle });

  // Extract music link from shared content
  let musicLink = null;
  
  if (sharedUrl) {
    musicLink = sharedUrl;
  } else if (sharedText) {
    // Try to extract URL from shared text
    const urlMatch = sharedText.match(/(https?:\/\/[^\s]+)/);
    if (urlMatch) {
      musicLink = urlMatch[1];
    }
  }

  // Redirect to main app with the music link pre-filled
  let redirectUrl = '/';
  if (musicLink) {
    redirectUrl = `/?link=${encodeURIComponent(musicLink)}&shared=true`;
  }

  return Response.redirect(redirectUrl, 302);
}

// Handle background sync for offline conversions (future enhancement)
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync-conversion') {
    event.waitUntil(handleBackgroundConversion());
  }
});

async function handleBackgroundConversion() {
  // This could handle queued conversions when the user comes back online
  console.log('Background sync: Processing queued conversions');
  // Implementation would depend on IndexedDB storage of queued requests
}

// Handle push notifications (future enhancement)
self.addEventListener('push', (event) => {
  if (event.data) {
    const data = event.data.json();
    const options = {
      body: data.body || 'Your music conversion is ready!',
      icon: '/icons/icon-192x192.png',
      badge: '/icons/icon-72x72.png',
      tag: 'musicflip-notification',
      actions: [
        {
          action: 'open',
          title: 'Open MusicFlip'
        }
      ]
    };

    event.waitUntil(
      self.registration.showNotification(data.title || 'MusicFlip', options)
    );
  }
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'open' || !event.action) {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

// Message handling for communication with main app
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'GET_VERSION') {
    event.ports[0].postMessage({ version: CACHE_NAME });
  }
});

console.log('Service Worker: Loaded');