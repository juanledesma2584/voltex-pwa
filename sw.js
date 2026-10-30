// Service Worker para VOLTEX - Alertas Repetitivas y Escandalosas
self.addEventListener('push', (event) => {
  let data = {};
  if (event.data) {
    try {
      data = event.data.json();
    } catch (e) {
      data = { title: "🚨 ¡ALERTA VOLTEX!", body: event.data.text() };
    }
  }

  const title = data.title || "🚨 ¡ALERTA VOLTEX CRÍTICA!";
  const options = {
    body: data.body || "¡Atención! Se detectó nivel por debajo del 50% en Don Félix.",
    icon: "./icon.png",
    badge: "./icon.png",
    // Patrón de vibración ruidoso (Largo - Corto - Largo)
    vibrate: [500, 100, 500, 100, 500, 100, 500],
    // Usamos el timestamp para que NUNCA agrupe las notificaciones y suene SIEMPRE
    tag: 'alerta-' + Date.now(),
    renotify: true,
    requireInteraction: true,
    priority: 'high',
    actions: [
      { action: 'open', title: '🔴 Abrir VOLTEX' }
    ]
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

// Manejo del clic en la notificación
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
      for (let client of windowClients) {
        if ('focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow('./');
      }
    })
  );
});
