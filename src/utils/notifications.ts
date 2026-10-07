import { NotificationSound } from '../types';
import { playNotificationSound } from './audio';

export async function requestBrowserNotificationPermission(): Promise<boolean> {
  if (!('Notification' in window)) {
    return false;
  }

  if (Notification.permission === 'granted') {
    return true;
  }

  if (Notification.permission !== 'denied') {
    const perm = await Notification.requestPermission();
    return perm === 'granted';
  }

  return false;
}

export function isBrowserNotificationSupported(): boolean {
  return typeof window !== 'undefined' && 'Notification' in window;
}

export function getNotificationPermissionStatus(): NotificationPermission | 'unsupported' {
  if (!isBrowserNotificationSupported()) return 'unsupported';
  return Notification.permission;
}

export interface TriggerNotificationParams {
  title: string;
  body: string;
  sound: NotificationSound;
  volume: number;
  browserNotificationsEnabled: boolean;
  tag?: string;
}

export function triggerAlert({
  title,
  body,
  sound,
  volume,
  browserNotificationsEnabled,
  tag,
}: TriggerNotificationParams): void {
  // 1. Play synthesized audio tone
  playNotificationSound(sound, volume);

  // 2. Trigger browser system notification if enabled & permission granted
  if (browserNotificationsEnabled && isBrowserNotificationSupported() && Notification.permission === 'granted') {
    try {
      new Notification(title, {
        body,
        icon: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="%234f46e5"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>',
        tag: tag || 'campusbell-alert',
        badge: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="%234f46e5"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path></svg>',
      });
    } catch (e) {
      console.warn('System notification failed', e);
    }
  }
}
