import { HIDE_TOAST_NOTIFICATION, SHOW_TOAST_NOTIFICATION } from '.';

export function showToastNotification() {
  return { type: SHOW_TOAST_NOTIFICATION };
}

export function hideToastNotification() {
  return { type: HIDE_TOAST_NOTIFICATION };
}
