self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const cacheNames = await caches.keys();
      await Promise.all(cacheNames.map((cacheName) => caches.delete(cacheName)));

      const registrations = await self.registration.scope ? [self.registration] : [];
      await Promise.all(registrations.map((registration) => registration.unregister()));

      const clients = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
      clients.forEach((client) => client.navigate(client.url));
    })()
  );
});

self.addEventListener('fetch', () => {
  // No-op on purpose: this worker exists only to replace and remove stale localhost registrations.
});
