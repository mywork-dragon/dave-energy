import { UserLoginFields, UserRegisterFields, UserActionEnum } from '.';
import { api } from 'api';
import { UserDocument } from 'models';
import { SHOW_TOAST_NOTIFICATION } from 'store/toastNotification';

export function loginUser(fields: UserLoginFields, history: any) {
  return function(dispatch: Function) {
    dispatch({ type: UserActionEnum.USER_LOGIN });
    return api
      .post<UserDocument>('/login', fields)
      .then(res => {
        dispatch({
          type: UserActionEnum.USER_LOGIN_SUCCESS,
          payload: res,
        });
        history.push('/control-room');
      })
      .catch(err => {
        dispatch({
          type: UserActionEnum.USER_LOGIN_ERROR,
          payload: err,
        });
        dispatch({ type: SHOW_TOAST_NOTIFICATION });
      });
  };
}

export function logoutUser(history: any) {
  return function(dispatch: Function) {
    dispatch({ type: UserActionEnum.USER_LOGOUT });
    return api
      .post('/logout')
      .then(res => {
        dispatch({
          type: UserActionEnum.USER_LOGOUT_SUCCESS,
          payload: res,
        });
        history.push('/login');
      })
      .catch(err => {
        dispatch({
          type: UserActionEnum.USER_LOGOUT_ERROR,
          payload: err,
        });
        dispatch({ type: SHOW_TOAST_NOTIFICATION })
      });
  }
}

export function registerUser(fields: UserRegisterFields, history: any) {
  return function(dispatch: Function) {
    dispatch({ type: UserActionEnum.USER_REGISTER });
    return api
      .post<UserDocument>('/register', fields)
      .then(() => {
        dispatch({
          type: UserActionEnum.USER_REGISTER_SUCCESS,
          payload: {
            email: fields.email, // most likely should change to user object
            // returned from the server,
          },
        });
        history.push('/control-room');
      })
      .catch(err => {
        dispatch({
          type: UserActionEnum.USER_REGISTER_ERROR,
          payload: err,
        });
        dispatch({ type: SHOW_TOAST_NOTIFICATION });
      });
  };
}

export function getUser() {
  return function(dispatch: Function) {
    dispatch({ type: UserActionEnum.FETCH_USER });
    return api
      .get<UserDocument>('/user')
      .then(res => {
        dispatch({
          type: UserActionEnum.FETCH_USER_SUCCESS,
          payload: res,
        });
      })
      .catch(err => {
        dispatch({
          type: UserActionEnum.FETCH_USER_ERROR,
          payload: err,
        });
      });
  };
}
