const CACHE_NAME = 'notes-v1';  
const urlsToCache = [
  '/',
  '/index.html',
  '/style.css',
  '/app.js',
  '/manifest.json',
  '/icons/icon-192.png',
  '/icons/icon-512.png'
];

self.addEventListener('install', event => {
  console.log('[SW] Установка, кэшируем файлы');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('[SW] Кэширование:', urlsToCache);
        return cache.addAll(urlsToCache);
      })
      .catch(error => {
        console.error('[SW] Ошибка кэширования:', error);
      })
  );
  
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  console.log('[SW] Активация, чистим старый кэш');
  
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('[SW] Удаляем старый кэш:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  
  event.waitUntil(clients.claim());
});

self.addEventListener('fetch', event => {
  const request = event.request;
  
  if (request.method !== 'GET') {
    console.log('[SW] Пропускаем не-GET запрос:', request.method);
    return fetch(request);
  }
  
  event.respondWith(
    caches.match(request)
      .then(cachedResponse => {
        if (cachedResponse) {
          console.log('[SW] Из кэша:', request.url);
          return cachedResponse;
        }
        
        console.log('[SW] Из сети:', request.url);
        return fetch(request)
          .then(networkResponse => {
            if (!networkResponse || networkResponse.status !== 200) {
              return networkResponse;
            }
            
            const responseClone = networkResponse.clone();
            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(request, responseClone);
              });
            
            return networkResponse;
          })
          .catch(error => {
            console.error('[SW] Ошибка сети:', error);
          });
      })
  );
});