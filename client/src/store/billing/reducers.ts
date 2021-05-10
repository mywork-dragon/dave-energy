import {
  BillingActionTypes,
  BillingState,
  FETCH_BILLING_INFORMATION,
  FETCH_BILLING_INFORMATION_SUCCESS,
  FETCH_BILLING_INFORMATION_ERROR,
  FETCH_BILLING_SOLAR_INFORMATION,
  FETCH_BILLING_SOLAR_INFORMATION_SUCCESS,
  FETCH_BILLING_SOLAR_INFORMATION_ERROR,
} from '.';
import { BillingInformationModel } from 'models';

export const initialState: BillingState = {
  billingInformation: null,
  billingSolarInformation: null,
};

export function billingReducer(
  state = initialState,
  action: BillingActionTypes,
): BillingState {
  switch (action.type) {
    case FETCH_BILLING_INFORMATION:
      return {
        ...state,
        loading: true,
      };
    case FETCH_BILLING_INFORMATION_SUCCESS:
      return {
        ...state,
        billingInformation: new BillingInformationModel(action.payload),
        loading: false,
      };
    case FETCH_BILLING_INFORMATION_ERROR:
      return {
        ...state,
        error: action.payload.error ?? null,
        loading: false,
      };
    case FETCH_BILLING_SOLAR_INFORMATION:
      return {
        ...state,
        loading: true,
      };
    case FETCH_BILLING_SOLAR_INFORMATION_SUCCESS:
      return {
        ...state,
        billingSolarInformation: new BillingInformationModel(action.payload),
        loading: false,
      };
    case FETCH_BILLING_SOLAR_INFORMATION_ERROR:
      return {
        ...state,
        error: action.payload.error ?? null,
        loading: false,
      };
    default:
      return state;
  }
}
