// Service Worker for push notifications
self.addEventListener('push', function(event) {
  const data = event.data ? event.data.json() : {};
  const options = {
    body: data.body || 'You have a new message',
    icon: data.icon || '/favicon.ico',
    badge: '/favicon.ico',
    tag: data.tag || 'message',
    requireInteraction: false,
    data: {
      url: data.url || '/inbox'
    }
  };

  event.waitUntil(
    self.registration.showNotification(data.title || 'New Message', options)
  );
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  event.waitUntil(
    clients.openWindow(event.notification.data.url || '/inbox')
  );
});
