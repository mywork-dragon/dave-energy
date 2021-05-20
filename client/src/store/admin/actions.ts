import { AdminActionEnum } from '.';
import { api } from 'api';
import { SHOW_TOAST_NOTIFICATION } from 'store/toastNotification';

export function getDisplayReports() {
  return function(dispatch: Function) {
    dispatch({ type: AdminActionEnum.FETCH_DISPLAY_REPORTS });
    return api
      .get('/get-display-reports')
      .then(res => {
        dispatch({
          type: AdminActionEnum.FETCH_DISPLAY_REPORTS_SUCCESS,
          payload: res['reportsToDisplay'],
        });
      })
      .catch(err => {
        dispatch({
          type: AdminActionEnum.FETCH_DISPLAY_REPORTS_ERROR,
          payload: err,
        });
        dispatch({ type: SHOW_TOAST_NOTIFICATION });
      });
  }
}
