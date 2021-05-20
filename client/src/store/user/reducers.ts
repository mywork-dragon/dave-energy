import { UserActionTypes, UserState, UserActionEnum } from '.';
import { UserModel } from 'models';

export const initialState: UserState = {};

export function userReducer(
  state = initialState,
  action: UserActionTypes,
): UserState {
  switch (action.type) {
    case UserActionEnum.USER_LOGIN_ERROR:
      return {
        error: action.payload.error,
      };
    case UserActionEnum.USER_LOGIN_SUCCESS:
      return {
        instance: new UserModel(action.payload),
      };
    case UserActionEnum.USER_LOGIN_ERROR:
      return {
        error: action.payload.error,
      };
    case UserActionEnum.USER_LOGOUT:
      return {
        ...state,
      };
    case UserActionEnum.USER_LOGOUT_SUCCESS:
      return {
        ...state,
      };
    case UserActionEnum.USER_LOGOUT_ERROR:
      return {
        ...state,
        error: action.payload.error,
      };
    case UserActionEnum.USER_REGISTER_SUCCESS:
      return {
        instance: new UserModel({ email: action.payload.email }),
      };
    case UserActionEnum.USER_REGISTER_ERROR:
      // TODO: Handle specific error codes from the server
      return {
        error: action.payload.error,
      };
    case UserActionEnum.FETCH_USER_SUCCESS:
      return {
        instance: new UserModel(action.payload),
      };
    case UserActionEnum.USER_LOGIN:
    case UserActionEnum.USER_REGISTER:
    case UserActionEnum.FETCH_USER:
    case UserActionEnum.FETCH_USER_ERROR:
    default:
      return state;
  }
}
