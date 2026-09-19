/* TripUp service worker: enables installability and local notifications. */
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (event) => event.waitUntil(self.clients.claim()));

/* Focus the app when a notification is tapped and deep-link into it
   (e.g. the "New poll" banner opens the voting page). */
self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const action = event.notification.data && event.notification.data.action;
  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((clients) => {
      const client = clients.find((c) => "focus" in c);
      if (client) {
        if (action) client.postMessage({ type: "notification-click", action });
        return client.focus();
      }
      return self.clients.openWindow("/");
    }),
  );
});
