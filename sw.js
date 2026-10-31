// ============================================================================
// VOLTEX IoT Platform - Service Worker de Alertas Push en Segundo Plano
// ============================================================================

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

// Escuchar eventos Push desde Firebase / Servidor
self.addEventListener('push', (event) => {
  let payload = {
    title: "⚡ VOLTEX SYSTEM ALERT",
    body: "Se ha detectado una anomalía crítica en uno de los nodos de telemetría.",
    icon: "https://img.icons8.com/fluency/96/flash-on.png"
  };

  if (event.data) {
    try {
      payload = event.data.json();
    } catch (e) {
      payload.body = event.data.text();
    }
  }

  const options = {
    body: payload.body,
    icon: payload.icon,
    badge: payload.icon,
    vibrate: [600, 200, 600, 200, 600, 200, 1000],
    tag: "voltex-critical-alert",
    renotify: true,
    requireInteraction: true,
    data: { url: "/" }
  };

  event.waitUntil(
    self.registration.showNotification(payload.title, options)
  );
});

// Al hacer clic en la notificación Push
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      if (clientList.length > 0) {
        return clientList[0].focus();
      }
      return clients.openWindow('/');
    })
  );
});
