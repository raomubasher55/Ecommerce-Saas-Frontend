import {
  REGISTER_USER_REQUEST,
  REGISTER_USER_SUCCESS,
  REGISTER_USER_FAILURE,
  LOGIN_REQUEST,
  LOGIN_SUCCESS, 
  LOGIN_FAIL,
  LOGOUT_REQUEST,
  LOGOUT_SUCCESS,
  LOGOUT_FAIL,
  FORGOT_PASSWORD_REQUEST,
  FORGOT_PASSWORD_SUCCESS,
  FORGOT_PASSWORD_FAIL,
  RESET_PASSWORD_REQUEST,
  RESET_PASSWORD_SUCCESS,
  RESET_PASSWORD_FAIL,
} from '../constants/userConstants';

const initialState = {
  loading: false,
  user: null,
  error: null,
};

export const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case REGISTER_USER_REQUEST:
      return { ...state, loading: true };
    case REGISTER_USER_SUCCESS:
      return { ...state, loading: false, user: action.payload, error: null };
    case REGISTER_USER_FAILURE:
      return { ...state, loading: false, error: action.payload };
      case "USER_UPDATE_REQUEST":
        return { ...state, loading: true };
      case "USER_UPDATE_SUCCESS":
        return { ...state, loading: false, userProfile: action.payload };
      case "USER_UPDATE_FAIL":
        return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};


export const userLoginReducer = (state = {}, action) => {
    switch (action.type) {
        case LOGIN_REQUEST:
        case LOGOUT_REQUEST:
            return { loading: true };
        case LOGIN_SUCCESS:
            return { loading: false, userInfo: action.payload };
        case LOGOUT_SUCCESS:
            return {};
        case LOGIN_FAIL:
          return { loading: false, error: action.payload };
        case LOGOUT_FAIL:
            return { loading: false, error: action.payload };
        default:
            return state;
    }
};

export const forgotPasswordReducer = (state = {}, action) => {
    switch (action.type) {
        case FORGOT_PASSWORD_REQUEST:
            return { loading: true };
        case FORGOT_PASSWORD_SUCCESS:
            return { loading: false, message: action.payload };
        case FORGOT_PASSWORD_FAIL:
            return { loading: false, error: action.payload };
        default:
            return state;
    }
};

export const resetPasswordReducer = (state = {}, action) => {
    switch (action.type) {
        case RESET_PASSWORD_REQUEST:
            return { loading: true };
        case RESET_PASSWORD_SUCCESS:
            return { loading: false, success: true };
        case RESET_PASSWORD_FAIL:
            return { loading: false, error: action.payload };
        default:
            return state;
    }
};
