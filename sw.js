// ============================================================================
// VOLTEX IoT Platform - Service Worker de Alertas Push Nativas en Segundo Plano
// ============================================================================

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

// Listener nativo del SO para recibir Push con la PWA cerrada o teléfono bloqueado
self.addEventListener('push', (event) => {
  let payload = {
    title: "🚨 ¡ALERTA CRÍTICA VOLTEX!",
    body: "Se ha detectado una anomalía en uno de los nodos de telemetría.",
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
    requireInteraction: true, // Mantiene la notificación fija en pantalla hasta que se atienda
    data: { url: "/" }
  };

  event.waitUntil(
    self.registration.showNotification(payload.title, options)
  );
});

// Al hacer clic sobre la notificación Push con la app cerrada
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
