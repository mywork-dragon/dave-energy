import { ADMIN, AdminActionEnum } from '.';

export const initialState = {
  reports: [],
};

export function adminReducer(state = initialState, action: any) {
  const { type } = action;
  switch (type) {
    case ADMIN:
      return {
        ...state,
      };
    case AdminActionEnum.FETCH_DISPLAY_REPORTS:
      return {
        ...state,
        loading: true,
      };
    case AdminActionEnum.FETCH_DISPLAY_REPORTS_SUCCESS:
      return {
        ...state,
        reports: action.payload,
        loading: false,
      };
    case AdminActionEnum.FETCH_DISPLAY_REPORTS_ERROR:
      return {
        ...state,
        error: action.payload,
        loading: false,
      };
    default:
      return state;
  }
}
