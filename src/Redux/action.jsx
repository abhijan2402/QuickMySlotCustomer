import {TOKEN, USER, LOG_OUT, AUTH, CURRENT_LOCATION} from './constant';

export const isAuth = status => ({
  type: AUTH,
  payload: {
    isAuth: status,
  },
});
export const userDetails = status => ({
  type: USER,
  payload: {
    userDetails: status,
  },
});
export const Token = status => ({
  type: TOKEN,
  payload: {
    Token: status,
  },
});
export const currentLocation = status => ({
  type: CURRENT_LOCATION,
  payload: {
    currentLocation: status,
  },
});
export const logOut = () => ({
  type: LOG_OUT,
});
