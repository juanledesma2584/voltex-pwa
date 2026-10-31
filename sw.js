// ============================================================================
// VOLTEX IoT Platform - Service Worker de Alertas Push en Segundo Plano
// ============================================================================

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

// Escuchar eventos Push desde Firebase
self.addEventListener('push', (event) => {
  let payload = {
    title: "🚨 ¡ALERTA CRÍTICA VOLTEX!",
    body: "El nivel de agua descendió bajo el 50%.",
    icon: "https://img.icons8.com/fluency/48/bolt.png"
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
    icon: payload.icon || "https://img.icons8.com/fluency/48/bolt.png",
    badge: "https://img.icons8.com/fluency/48/bolt.png",
    vibrate: [500, 200, 500, 200, 500, 200, 1000],
    tag: "alerta-voltex-critica",
    renotify: true,
    requireInteraction: true, // Mantiene la notificación fija en pantalla hasta que se atienda
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
