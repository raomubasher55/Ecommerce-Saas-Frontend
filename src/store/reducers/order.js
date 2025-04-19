// ... existing code ...

// Add missing imports
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
    PROCESS_PAYMENT_REQUEST,
    PROCESS_PAYMENT_SUCCESS,
    PROCESS_PAYMENT_FAIL,
    PROCESS_PAYMENT_RESET,
    CREATE_CHECKOUT_SESSION_REQUEST,
    CREATE_CHECKOUT_SESSION_SUCCESS,
    CREATE_CHECKOUT_SESSION_FAIL
} from '../constants/orderConstants';

// Update initialState
const initialState = {
    loading: false,
    order: null,
    error: null,
    paymentLoading: false,
    clientSecret: null,
    paymentError: null,
    checkoutSession: null,
    checkoutError: null,
    orders: [],
    storeOrders: [],
    allOrders: []
};

// Add getSingleOrderReducer
export const getSingleOrderReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'GET_SINGLE_ORDER_REQUEST':
            return {
                ...state,
                loading: true,
            };
        case 'GET_SINGLE_ORDER_SUCCESS':
            return {
                ...state,
                loading: false,
                order: action.payload,
            };
        case 'GET_SINGLE_ORDER_FAIL':
            return {
                ...state,
                loading: false,
                error: action.payload,
            };
        default:
            return state;
    }
};

// Rename this to allOrdersReducer since that's what's being imported elsewhere
export const allOrdersReducer = (state = initialState, action) => {
    switch (action.type) {
        // ... existing cases ...

        case GET_USER_ORDERS_REQUEST:
            return {
                ...state,
                loading: true
            };
        case GET_USER_ORDERS_SUCCESS:
            return {
                ...state,
                loading: false,
                orders: action.payload
            };
        case GET_USER_ORDERS_FAIL:
            return {
                ...state,
                loading: false,
                error: action.payload
            };

        case GET_STORE_ORDERS_REQUEST:
            return {
                ...state,
                loading: true
            };
        case GET_STORE_ORDERS_SUCCESS:
            return {
                ...state,
                loading: false,
                storeOrders: action.payload
            };
        case GET_STORE_ORDERS_FAIL:
            return {
                ...state,
                loading: false,
                error: action.payload
            };

        case UPDATE_ORDER_STATUS_REQUEST:
            return {
                ...state,
                loading: true
            };
        case UPDATE_ORDER_STATUS_SUCCESS:
            return {
                ...state,
                loading: false,
                order: action.payload
            };
        case UPDATE_ORDER_STATUS_FAIL:
            return {
                ...state,
                loading: false,
                error: action.payload
            };

        case UPDATE_PAYMENT_STATUS_REQUEST:
            return {
                ...state,
                loading: true
            };
        case UPDATE_PAYMENT_STATUS_SUCCESS:
            return {
                ...state,
                loading: false,
                order: action.payload
            };
        case UPDATE_PAYMENT_STATUS_FAIL:
            return {
                ...state,
                loading: false,
                error: action.payload
            };

        case ALL_ORDERS_REQUEST:
            return {
                ...state,
                loading: true
            };
        case ALL_ORDERS_SUCCESS:
            return {
                ...state,
                loading: false,
                allOrders: action.payload
            };
        case ALL_ORDERS_FAIL:
            return {
                ...state,
                loading: false,
                error: action.payload
            };

        default:
            return state;
    }
};

export const orderCreateReducer = (state = initialState, action) => {
    switch (action.type) {
        case CREATE_ORDER_REQUEST:
            return {
                ...state,
                loading: true
            };
        case CREATE_ORDER_SUCCESS:
            return {
                ...state,
                loading: false,
                success: true,
                order: action.payload
            };
        case CREATE_ORDER_FAIL:
            return {
                ...state,
                loading: false,
                error: action.payload
            };
        case 'RESET_ORDER':
            return {
                ...state,
                success: false,
                order: null,
                error: null
            };
        default:
            return state;
    }
};

export const orderStatusReducer = (state = initialState, action) => {
    switch (action.type) {
        case PROCESS_PAYMENT_REQUEST:
            return {
                ...state,
                paymentLoading: true
            };
        case PROCESS_PAYMENT_SUCCESS:
            return {
                ...state,
                paymentLoading: false,
                paymentInfo: action.payload
            };
        case PROCESS_PAYMENT_FAIL:
            return {
                ...state,
                paymentLoading: false,
                paymentError: action.payload
            };
        case PROCESS_PAYMENT_RESET:
            return {
                ...state,
                paymentLoading: false,
                paymentError: null,
                paymentInfo: null
            };
        default:
            return state;
    }
};

export const storeOrdersReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_STORE_ORDERS_REQUEST:
            return {
                ...state,  
                loading: true
            };
        case GET_STORE_ORDERS_SUCCESS:
            return {
                ...state,
                loading: false,
                storeOrders: action.payload
            };
        case GET_STORE_ORDERS_FAIL:
            return {
                ...state,
                loading: false,
                error: action.payload
            };
        default:
            return state;
    }
};

export const userOrdersReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_USER_ORDERS_REQUEST:
            return {
                ...state,
                loading: true   
            };
        case GET_USER_ORDERS_SUCCESS:
            return {
                ...state,
                loading: false,
                orders: action.payload
            };
        case GET_USER_ORDERS_FAIL:
            return {
                ...state,
                loading: false,
                error: action.payload
            };
        default:
            return state;
    }
};

// Add new reducer for checkout session
export const checkoutSessionReducer = (state = initialState, action) => {
    switch (action.type) {
        case CREATE_CHECKOUT_SESSION_REQUEST:
            return {
                ...state,
                loading: true,
                checkoutError: null
            };
        case CREATE_CHECKOUT_SESSION_SUCCESS:
            return {
                ...state,
                loading: false,
                checkoutSession: action.payload
            };
        case CREATE_CHECKOUT_SESSION_FAIL:
            return {
                ...state,
                loading: false,
                checkoutError: action.payload
            };
        default:
            return state;
    }
};

// Also export the original name to maintain backward compatibility
export const orderReducer = allOrdersReducer;