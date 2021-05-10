import { api } from 'api';
import { BillingInformationDocument } from 'models';
import {
  FETCH_BILLING_INFORMATION,
  FETCH_BILLING_INFORMATION_SUCCESS,
  FETCH_BILLING_INFORMATION_ERROR,
  FETCH_BILLING_SOLAR_INFORMATION,
  FETCH_BILLING_SOLAR_INFORMATION_SUCCESS,
  FETCH_BILLING_SOLAR_INFORMATION_ERROR,
} from './types';
import { SHOW_TOAST_NOTIFICATION } from 'store/toastNotification';

export function getBillingInformation(buildingId: number, fromTime?: string) {
  return function(dispatch: Function) {
    dispatch({ type: FETCH_BILLING_INFORMATION });
    return api
      .get<BillingInformationDocument>(
        `building/${buildingId}/billing-information`,
        { fromTime },
      )
      .then(res => {
        dispatch({
          type: FETCH_BILLING_INFORMATION_SUCCESS,
          payload: res,
        });
      })
      .catch((err: any) => {
        dispatch({
          type: FETCH_BILLING_INFORMATION_ERROR,
          payload: err,
        });
        dispatch({ type: SHOW_TOAST_NOTIFICATION });
      });
  };
}

export function getBillingSolarInformation(buildingId: number, fromTime?: string) {
  return function(dispatch: Function) {
    dispatch({ type: FETCH_BILLING_SOLAR_INFORMATION });
    return api
      .get(`building/${buildingId}/solar-totals`, { fromTime })
      .then(res => {
        dispatch({
          type: FETCH_BILLING_SOLAR_INFORMATION_SUCCESS,
          payload: res,
        });
      })
      .catch((err: any) => {
        dispatch({
          type: FETCH_BILLING_SOLAR_INFORMATION_ERROR,
          payload: err,
        });
        dispatch({ type: SHOW_TOAST_NOTIFICATION });
      });
  }
}
