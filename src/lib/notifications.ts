/**
 * Local notifications for the demo journey (the two banners from Figma).
 * On iOS these only work once the PWA is installed to the home screen
 * (iOS 16.4+); in desktop browsers they work right away.
 */

export function registerServiceWorker() {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("/sw.js").catch(() => {});
  }
}

/** Ask for permission — must be called from a user gesture (e.g. Start poll). */
export async function ensureNotificationPermission(): Promise<boolean> {
  if (!("Notification" in window)) return false;
  if (Notification.permission === "granted") return true;
  if (Notification.permission === "denied") return false;
  try {
    return (await Notification.requestPermission()) === "granted";
  } catch {
    return false;
  }
}

export async function notify(title: string, body: string) {
  if (!("Notification" in window) || Notification.permission !== "granted") return;
  const options: NotificationOptions = { body, icon: "/icon-192.png", badge: "/icon-192.png" };
  try {
    const reg = await navigator.serviceWorker?.getRegistration();
    if (reg) {
      await reg.showNotification(title, options);
      return;
    }
  } catch {
    /* fall through to the window-level API */
  }
  try {
    new Notification(title, options);
  } catch {
    /* not supported (e.g. iOS Safari tab) — silently skip */
  }
}
