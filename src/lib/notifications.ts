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

export type NotificationAction = "open-poll";

export async function notify(title: string, body: string, action?: NotificationAction) {
  if (!("Notification" in window) || Notification.permission !== "granted") return;
  const options: NotificationOptions = {
    body,
    icon: "/icon-192.png",
    badge: "/icon-192.png",
    // one tag: the winner notification replaces the "New poll" one
    tag: "tripup-poll",
    data: action ? { action } : undefined,
  };
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
    const n = new Notification(title, options);
    if (action) {
      n.onclick = () => {
        window.focus();
        window.dispatchEvent(new CustomEvent("tripup:notification", { detail: { action } }));
      };
    }
  } catch {
    /* not supported (e.g. iOS Safari tab) — silently skip */
  }
}

/** Retire delivered notifications (e.g. once the poll is decided). */
export async function closeAppNotifications() {
  try {
    const reg = await navigator.serviceWorker?.getRegistration();
    const shown = await reg?.getNotifications();
    shown?.forEach((n) => n.close());
  } catch {
    /* nothing to close */
  }
}

/** Tapping a notification deep-links into the app (SW + window-level paths). */
export function onNotificationAction(handler: (action: NotificationAction) => void): () => void {
  const fromSw = (e: MessageEvent) => {
    if (e.data?.type === "notification-click" && e.data.action) handler(e.data.action);
  };
  const fromWindow = (e: Event) => handler((e as CustomEvent).detail.action);
  navigator.serviceWorker?.addEventListener("message", fromSw);
  window.addEventListener("tripup:notification", fromWindow);
  return () => {
    navigator.serviceWorker?.removeEventListener("message", fromSw);
    window.removeEventListener("tripup:notification", fromWindow);
  };
}
