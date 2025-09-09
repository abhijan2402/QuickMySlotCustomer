import {
  TOKEN,
  USER,
  LOG_OUT,
  AUTH,
} from './constant';

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
export const logOut = () => ({
  type: LOG_OUT,
});
