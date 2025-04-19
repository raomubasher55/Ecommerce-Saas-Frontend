import {
  GET_ALL_PACKAGES,
  PACKAGE_ERROR,
  SUBSCRIBE_PACKAGE_FAIL,
  SUBSCRIBE_PACKAGE_REQUEST,
  SUBSCRIBE_PACKAGE_SUCCESS,
  UPDATE_PACKAGE_FAIL,
  UPDATE_PACKAGE_REQUEST,
  UPDATE_PACKAGE_SUCCESS
} from "../constants/packageconstants";


const initialState = {
  loading: false,
  success: false,
  error: null,
  packageData: null,
  packages: [],
};

export const packageReducer = (state = initialState, action) => {
  switch (action.type) {
    case SUBSCRIBE_PACKAGE_REQUEST:
      return {
        ...state,
        loading: true,
      };

    case SUBSCRIBE_PACKAGE_SUCCESS:
      return {
        ...state,
        loading: false,
        success: true,
        packageData: action.payload,
      };

    case SUBSCRIBE_PACKAGE_FAIL:
      return {
        ...state,
        loading: false,
        success: false,
        error: action.payload,
      };
    case GET_ALL_PACKAGES:
      return {
        ...state,
        packages: action.payload,
        loading: false,
      };
    case PACKAGE_ERROR:
      return {
        ...state,
        error: action.payload,
        loading: false,
      };
    case UPDATE_PACKAGE_REQUEST:
      return { ...state, loading: true };
    case UPDATE_PACKAGE_SUCCESS:
      return {
        ...state,
        loading: false,
        packages: state.packages.map((packageItem) =>
          packageItem.id === action.payload.id ? action.payload : packageItem
        ),
      };
    case UPDATE_PACKAGE_FAIL:
      return { ...state, loading: false, error: action.payload };

    default:
      return state;
  }
};

