import { UserModel } from 'models';

export enum UserActionEnum {
  USER_LOGIN = 'USER_LOGIN',
  USER_LOGIN_SUCCESS = 'USER_LOGIN_SUCCESS',
  USER_LOGIN_ERROR = 'USER_LOGIN_ERROR',
  USER_REGISTER = 'USER_REGISTER',
  USER_REGISTER_SUCCESS = 'USER_REGISTER_SUCCESS',
  USER_REGISTER_ERROR = 'USER_REGISTER_ERROR',
  FETCH_USER = 'FETCH_USER',
  FETCH_USER_SUCCESS = 'FETCH_USER_SUCCESS',
  FETCH_USER_ERROR = 'FETCH_USER_ERROR',
}

export interface UserLoginFields {
  email: string;
  password: string;
}

export interface UserRegisterFields {
  // sync this with component form data
  email: string;
  password: string;
}

/**
 * @key activeBuildingId - the building id to show information for in the app
 * @key instance - the UserModel singleton
 * @key error - the error returned from any
 */
export interface UserState {
  activeBuildingId?: number | null;
  instance?: UserModel | null;
  error?: any; // TODO: Handle errors from server
}

interface UserLoginAction {
  type: typeof UserActionEnum.USER_LOGIN;
  payload: UserLoginFields;
}

interface UserLoginSuccess {
  type: typeof UserActionEnum.USER_LOGIN_SUCCESS;
  payload: {
    email: string;
  };
}

interface UserLoginError {
  type: typeof UserActionEnum.USER_LOGIN_ERROR;
  payload: {
    error: any;
  };
}

interface UserRegisterAction {
  type: typeof UserActionEnum.USER_REGISTER;
  payload: UserLoginFields;
}

interface UserRegisterSuccess {
  type: typeof UserActionEnum.USER_REGISTER_SUCCESS;
  payload: {
    email: string;
  };
}

interface UserRegisterError {
  type: typeof UserActionEnum.USER_REGISTER_ERROR;
  payload: {
    error: any;
  };
}

interface FetchUserAction {
  type: typeof UserActionEnum.FETCH_USER;
  payload: UserLoginFields;
}

interface FetchUserSuccess {
  type: typeof UserActionEnum.FETCH_USER_SUCCESS;
  payload: {
    email: string;
  };
}

interface FetchUserError {
  type: typeof UserActionEnum.FETCH_USER_ERROR;
  payload: {
    error: any;
  };
}

export type UserActionTypes =
  | UserLoginAction
  | UserLoginSuccess
  | UserLoginError
  | UserRegisterAction
  | UserRegisterSuccess
  | UserRegisterError
  | FetchUserAction
  | FetchUserSuccess
  | FetchUserError;
