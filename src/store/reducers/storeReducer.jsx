// storeReducer.js

import {
  LOGIN_REQUEST, LOGIN_SUCCESS, LOGIN_FAILURE,
  STORE_REGISTER_REQUEST, STORE_REGISTER_SUCCESS, STORE_REGISTER_FAIL,
  FETCH_STORE_REQUEST, FETCH_STORE_SUCCESS, FETCH_STORE_FAILURE,
  UPDATE_STORE_REQUEST, UPDATE_STORE_SUCCESS, UPDATE_STORE_FAILURE,
  FETCH_STORES_REQUEST, FETCH_STORES_SUCCESS, FETCH_STORES_FAILURE,
  STORE_LIST_REQUEST, STORE_LIST_SUCCESS, STORE_LIST_FAIL,
  FETCH_STORE_PRODUCTS_REQUEST, FETCH_STORE_PRODUCTS_SUCCESS, FETCH_STORE_PRODUCTS_FAILURE,
  FETCH_STORE_SALES_REQUEST, FETCH_STORE_SALES_SUCCESS, FETCH_STORE_SALES_FAILURE,
  FETCH_STORE_DETAILS_REQUEST, FETCH_STORE_DETAILS_SUCCESS, FETCH_STORE_DETAILS_FAILURE,
  FETCH_BLACKIST_PRODUCTS_REQUEST, FETCH_BLACKIST_PRODUCTS_SUCCESS, FETCH_BLACKIST_PRODUCTS_FAILURE,
  SUSPEND_STORE_REQUEST, SUSPEND_STORE_SUCCESS, SUSPEND_STORE_FAILURE,
  RECOVER_STORE_REQUEST,
  RECOVER_STORE_SUCCESS,
  RECOVER_STORE_FAILURE,
  VERIFY_EMAIL_REQUEST,
  VERIFY_EMAIL_SUCCESS,
  VERIFY_EMAIL_FAIL
} from '../constants/StoreConstants';

const initialState = {
  store: {},
  user: null,
  loading: false,
  error: null,
  stores: [],
  products: [],
  sales: [],
  blacklistProducts: [],
  message: "",
  emailVerified: false,
};


const storeReducer = (state = initialState, action) => {
  switch (action.type) {
    // Store Registration Actions
    case STORE_REGISTER_REQUEST:
      return { ...state, loading: true, error: null };
    case STORE_REGISTER_SUCCESS:
      return { ...state, loading: false, store: action.payload, error: null };
    case STORE_REGISTER_FAIL:
      return { ...state, loading: false, error: action.payload };

    // Store Login Actions
    case LOGIN_REQUEST:
      return { ...state, loading: true, error: null };
    case LOGIN_SUCCESS:
      return { ...state, loading: false, user: action.payload, error: null };
    case LOGIN_FAILURE:
      return { ...state, loading: false, error: action.payload };

    //   get store by id 
    case FETCH_STORE_REQUEST:
      return { ...state, loading: true };

    case FETCH_STORE_SUCCESS:
      return { ...state, loading: false, store: action.payload };

    case FETCH_STORE_FAILURE:
      return { ...state, loading: false, error: action.payload };

    // update store info data 
    case UPDATE_STORE_REQUEST:
      return { ...state, loading: true };
    case UPDATE_STORE_SUCCESS:
      return { ...state, storeInfo: action.payload, loading: false, error: null };
    case UPDATE_STORE_FAILURE:
      return { ...state, loading: false, error: action.payload };

    // get all stores by superadmin
    case FETCH_STORES_REQUEST:
      return { ...state, loading: true, error: null };
    case FETCH_STORES_SUCCESS:
      return { ...state, loading: false, stores: action.payload };
    case FETCH_STORES_FAILURE:
      return { ...state, loading: false, error: action.payload };
    case FETCH_STORE_SALES_REQUEST:
      return { ...state, loading: true, error: null };
    case FETCH_STORE_SALES_SUCCESS:
      return { ...state, loading: false, sales: action.payload };
    case FETCH_STORE_SALES_FAILURE:
      return { ...state, loading: false, error: action.payload };
    case FETCH_STORE_DETAILS_REQUEST:
      return { ...state, loading: true, error: null };
    case FETCH_STORE_DETAILS_SUCCESS:
      return { ...state, loading: false, store: action.payload };
    case FETCH_STORE_DETAILS_FAILURE:
      return { ...state, loading: false, error: action.payload };
    case FETCH_BLACKIST_PRODUCTS_REQUEST:
      return { ...state, loading: true, error: null };
    case FETCH_BLACKIST_PRODUCTS_SUCCESS:
      return { ...state, loading: false, blackistProducts: action.payload };
    case FETCH_BLACKIST_PRODUCTS_FAILURE:
      return { ...state, loading: false, error: action.payload };

    default:
      return state;
  }
};

export default storeReducer;



export const storeListReducer = (state = { stores: [] }, action) => {
  switch (action.type) {
    case STORE_LIST_REQUEST:
      return { loading: true, stores: [] };

    case STORE_LIST_SUCCESS:
      return { loading: false, stores: action.payload.docs, pagination: action.payload };

    case STORE_LIST_FAIL:
      return { loading: false, error: action.payload };

    default:
      return state;
  }
};



export const ProductsByReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_STORE_PRODUCTS_REQUEST:
      return { ...state, loading: true };
    case FETCH_STORE_PRODUCTS_SUCCESS:
      return {
        loading: false,
        stores: action.payload.stores,
        products: action.payload.products,
        error: null
      };
    case FETCH_STORE_PRODUCTS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload
      };
    default:
      return state;
  }
};


export const storeSalesReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_STORE_SALES_REQUEST:
      return { ...state, loading: true, error: null };
    case FETCH_STORE_SALES_SUCCESS:
      return { ...state, loading: false, sales: action.payload };
    case FETCH_STORE_SALES_FAILURE:
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};


export const storeDetailsReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_STORE_DETAILS_REQUEST:
      return { ...state, loading: true, error: null };
    case FETCH_STORE_DETAILS_SUCCESS:
      return { ...state, loading: false, store: action.payload };
    case FETCH_STORE_DETAILS_FAILURE:
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

export const blacklistProductsReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_BLACKIST_PRODUCTS_REQUEST:
      return { ...state, loading: true, error: null };
    case FETCH_BLACKIST_PRODUCTS_SUCCESS:
      return { ...state, loading: false, blacklistProducts: action.payload };
    case FETCH_BLACKIST_PRODUCTS_FAILURE:
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

export const emailReducer = (state = initialState, action) => {
  switch (action.type) {
    case VERIFY_EMAIL_REQUEST:
      return { ...state, loading: true };

    case VERIFY_EMAIL_SUCCESS:
      return { loading: false, success: true, message: action.payload, error: "" };

    case VERIFY_EMAIL_FAIL:
      return { loading: false, success: false, message: "", error: action.payload };

    default:
      return state;
  }
};



export const storeEmailReducer = (state = initialState, action) => {
  switch (action.type) {
    case VERIFY_EMAIL_REQUEST:
      return {
        ...state,
        loading: true,
        error: null
      };
    
    case VERIFY_EMAIL_SUCCESS:
      return {
        ...state,
        loading: false,
        emailVerified: true,
        message: action.payload.message
      };
    
    case VERIFY_EMAIL_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
        emailVerified: false
      };
      
    
    default:
      return state;
  }
};
