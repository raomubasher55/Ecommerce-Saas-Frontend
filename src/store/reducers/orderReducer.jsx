import { 
    CREATE_ORDER_REQUEST, 
    CREATE_ORDER_SUCCESS, 
    CREATE_ORDER_FAIL, 
    GET_USER_ORDERS_REQUEST,
    GET_USER_ORDERS_SUCCESS,
    GET_USER_ORDERS_FAIL,
    GET_STORE_ORDERS_REQUEST,
    GET_STORE_ORDERS_SUCCESS,
    GET_STORE_ORDERS_FAIL,
    UPDATE_ORDER_STATUS_REQUEST,
    UPDATE_ORDER_STATUS_SUCCESS,
    UPDATE_ORDER_STATUS_FAIL,
    UPDATE_PAYMENT_STATUS_REQUEST,
    UPDATE_PAYMENT_STATUS_SUCCESS,
    UPDATE_PAYMENT_STATUS_FAIL,
    ALL_ORDERS_REQUEST,
    ALL_ORDERS_SUCCESS,
    ALL_ORDERS_FAIL,
} from "../constants/orderConstants";

const initialState = {
    orders: [],
    order: {},
    loading: false,
    error: null,
  };

export const orderCreateReducer = (state = {}, action) => {
    switch (action.type) {
        case CREATE_ORDER_REQUEST:
            return { loading: true };

        case CREATE_ORDER_SUCCESS:
            return { loading: false, success: true, order: action.payload };

        case CREATE_ORDER_FAIL:
            return { loading: false, error: action.payload };

        default:
            return state;
    }
};



export const userOrdersReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_USER_ORDERS_REQUEST:
      return { ...state, loading: true };
    case GET_USER_ORDERS_SUCCESS:
      return { ...state, loading: false, orders: action.payload };
    case GET_USER_ORDERS_FAIL:
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};


export const storeOrdersReducer = (state = { orders: [] }, action) => {
  switch (action.type) {
    case GET_STORE_ORDERS_REQUEST:
      return { loading: true, orders: [] };
    case GET_STORE_ORDERS_SUCCESS:
      return { loading: false, orders: action.payload };
    case GET_STORE_ORDERS_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};
  

  export const orderStatusReducer = (state = initialState, action) => {
    switch (action.type) {
      case UPDATE_ORDER_STATUS_REQUEST:
        return { ...state, loading: true };
  
      case UPDATE_ORDER_STATUS_SUCCESS:
        return { ...state, loading: false, order: action.payload };
  
      case UPDATE_ORDER_STATUS_FAIL:
        return { ...state, loading: false, error: action.payload };
  
      default:
        return state;
    }
  };


  export const paymentStatusReducer = (state = {}, action) => {
    switch (action.type) {
      case UPDATE_PAYMENT_STATUS_REQUEST:
        return { loading: true };
      case UPDATE_PAYMENT_STATUS_SUCCESS:
        return { loading: false, success: true, order: action.payload };
      case UPDATE_PAYMENT_STATUS_FAIL:
        return { loading: false, error: action.payload };
      default:
        return state;
    }
  };
  


  // reducers/orderReducer.js


  export const allOrdersReducer = (state = { orders: [] }, action) => {
    switch (action.type) {
      case ALL_ORDERS_REQUEST:
        return { loading: true, orders: [] };
  
      case ALL_ORDERS_SUCCESS:
        return { loading: false, orders: action.payload };
  
      case ALL_ORDERS_FAIL:
        return { loading: false, error: action.payload };
  
      default:
        return state;
    }
  };