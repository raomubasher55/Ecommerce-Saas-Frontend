import {
  BLACKLIST_PRODUCT_REQUEST,
  BLACKLIST_PRODUCT_SUCCESS,
  BLACKLIST_PRODUCT_FAILURE,
  FETCH_BLACKLIST_REQUEST,
  FETCH_BLACKLIST_SUCCESS,
  FETCH_BLACKLIST_FAILURE
} from "../constants/blacklistTypes";

const initialState = {
  blacklistedProducts: [],
  products: [],
  loading: false,
  error: null,
};

const blacklistReducer = (state = initialState, action) => {
  switch (action.type) {
    case BLACKLIST_PRODUCT_REQUEST:
      return { ...state, loading: true, error: null };

    case BLACKLIST_PRODUCT_SUCCESS:
      return {
        ...state,
        blacklistedProducts: [...state.blacklistedProducts, action.payload],
        loading: false,
      };

    case BLACKLIST_PRODUCT_FAILURE:
      return { ...state, loading: false, error: action.payload };

    case FETCH_BLACKLIST_REQUEST:
      return { ...state, loading: true };
    case FETCH_BLACKLIST_SUCCESS:
      return { ...state, loading: false, products: action.payload };
    case FETCH_BLACKLIST_FAILURE:
      return { ...state, loading: false, error: action.payload };

    default:
      return state;
  }
};

export default blacklistReducer;
