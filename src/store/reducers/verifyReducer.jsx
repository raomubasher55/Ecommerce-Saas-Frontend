import { VERIFY_FAIL, VERIFY_REQUEST, VERIFY_SUCCESS } from "../constants/verifyConstants";

const initialState = {
    loading: false,
    success: false,
    error: null,
    emailVerification: {
        loading: false,
        message: "",
        error: null,
      },
};

export const verifyReducer = (state = initialState, action) => {
    switch (action.type) {
        case VERIFY_REQUEST:
            return { loading: true, success: false, error: null };
        case VERIFY_SUCCESS:
            return { loading: false, success: true, error: null };
        case VERIFY_FAIL:
            return { loading: false, success: false, error: action.payload };
        default:
            return state;
    }
};





export const emailVerificationReducer = (state = initialState.emailVerification, action) => {
    switch (action.type) {
      case "EMAIL_VERIFY_REQUEST":
        return { ...state, loading: true };
      case "EMAIL_VERIFY_SUCCESS":
        return { loading: false, message: action.payload, error: null };
      case "EMAIL_VERIFY_FAIL":
        return { loading: false, message: "", error: action.payload };
      default:
        return state;
    }
  };