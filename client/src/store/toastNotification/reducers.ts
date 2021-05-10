import {
  ToastNotificationActionTypes,
  ToastNotificationState,
  HIDE_TOAST_NOTIFICATION,
  SHOW_TOAST_NOTIFICATION,
} from '.';

export const initialState: ToastNotificationState = {
  isShown: false,
};

export function toastNotificationReducer(
  state = initialState,
  action: ToastNotificationActionTypes,
): ToastNotificationState {
  switch (action.type) {
    case SHOW_TOAST_NOTIFICATION:
      return {
        isShown: true,
      };
    case HIDE_TOAST_NOTIFICATION:
      return {
        isShown: false,
      };
    default:
      return state;
  }
}
