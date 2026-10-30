// Service Worker para VOLTEX - Alertas Escandalosas
importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-messaging.js');

firebase.initializeApp({
  messagingSenderId: "TU_MESSAGING_SENDER_ID"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const title = payload.notification?.title || "🚨 ¡ALERTA VOLTEX CRÍTICA!";
  const options = {
    body: payload.notification?.body || "¡Atención! Se ha detectado una falla en los sensores de agua.",
    icon: "/icon.png",
    badge: "/icon.png",
    // Patrón de vibración ruidoso e intermitente (Largo - Corto - Largo)
    vibrate: [500, 110, 500, 110, 450, 110, 200, 110, 170, 40, 450, 110, 200, 110, 170],
    tag: "alerta-voltex-critica",
    renotify: true, // Forzar a sonar/vibrar aunque ya exista una notificación previa
    requireInteraction: true, // Queda fija en pantalla hasta que la toques o descartes manualmente
    priority: "high",
    data: {
      url: self.registration.scope
    },
    actions: [
      { action: "open", title: "🔴 Abrir VOLTEX" }
    ]
  };

  self.registration.showNotification(title, options);
});

// Abrir la app al tocar la notificación
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
      for (let client of windowClients) {
        if (client.url === event.notification.data.url && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(event.notification.data.url);
      }
    })
  );
});
