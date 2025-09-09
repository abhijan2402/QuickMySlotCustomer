import {
  AUTH,
  TOKEN,
  LOG_OUT,
  USER,
} from './constant';
const initialState = {
  isAuth: false,
  userDetails: {},
  Token: '',
};
const todoReducer = (state = initialState, action) => {
  switch (action.type) {
    case AUTH: {
      const status = action.payload;
      return {
        ...state,
        isAuth: status.isAuth,
      };
    }
    case TOKEN: {
      const status = action.payload;
      return {
        ...state,
        Token: status.Token,
      };
    }
    case USER: {
      const status = action.payload;
      return {
        ...state,
        userDetails: status.userDetails,
      };
    }
    case LOG_OUT: {
      return {
        ...initialState,
        skipData: state.skipData,
      };
    }
    default:
      return state;
  }
};

export default todoReducer;
