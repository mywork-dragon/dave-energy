export const HIDE_TOAST_NOTIFICATION = 'HIDE_TOAST_NOTIFICATION';
export const SHOW_TOAST_NOTIFICATION = 'SHOW_TOAST_NOTIFICATION';

export interface ToastNotificationState {
  isShown: boolean;
}

interface ShowToastNotificationAction {
  type: typeof SHOW_TOAST_NOTIFICATION;
}

interface HideToastNotificationAction {
  type: typeof HIDE_TOAST_NOTIFICATION;
}

export type ToastNotificationActionTypes =
  | ShowToastNotificationAction
  | HideToastNotificationAction;
