import { BillingInformationModel, BillingInformationDocument } from 'models';

export const FETCH_BILLING_INFORMATION = 'FETCH_BILLING_INFORMATION';
export const FETCH_BILLING_INFORMATION_SUCCESS =
  'FETCH_BILLING_INFORMATION_SUCCESS';
export const FETCH_BILLING_INFORMATION_ERROR =
  'FETCH_BILLING_INFORMATION_ERROR';
export const FETCH_BILLING_SOLAR_INFORMATION = 'FETCH_BILLING_SOLAR_INFORMATION';
export const FETCH_BILLING_SOLAR_INFORMATION_SUCCESS =
  'FETCH_BILLING_SOLAR_INFORMATION_SUCCESS';
export const FETCH_BILLING_SOLAR_INFORMATION_ERROR =
  'FETCH_BILLING_SOLAR_INFORMATION_ERROR';

export interface BillingState {
  billingInformation?: BillingInformationModel | null;
  billingSolarInformation?: BillingInformationModel | null;
  loading?: boolean;
  error?: any;
}

interface FetchBillingInformationAction {
  type: typeof FETCH_BILLING_INFORMATION;
}

interface FetchBillingInformationSuccess {
  type: typeof FETCH_BILLING_INFORMATION_SUCCESS;
  payload: BillingInformationDocument;
}

interface FetchBillingInformationError {
  type: typeof FETCH_BILLING_INFORMATION_ERROR;
  payload: {
    loading: false;
    error: any;
  };
}

interface FetchBillingSolarInformationAction {
  type: typeof FETCH_BILLING_SOLAR_INFORMATION;
}

interface FetchBillingSolarInformationSuccess {
  type: typeof FETCH_BILLING_SOLAR_INFORMATION_SUCCESS;
  payload: any;
}

interface FetchBillingSolarInformationError {
  type: typeof FETCH_BILLING_SOLAR_INFORMATION_ERROR;
  payload: {
    loading: false;
    error: any;
  };
}

export type BillingActionTypes =
  | FetchBillingInformationAction
  | FetchBillingInformationSuccess
  | FetchBillingInformationError
  | FetchBillingSolarInformationAction
  | FetchBillingSolarInformationSuccess
  | FetchBillingSolarInformationError;
