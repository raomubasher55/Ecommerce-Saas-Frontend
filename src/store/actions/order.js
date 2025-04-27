import axios from "axios";
import {
    CREATE_ORDER_REQUEST,
    CREATE_ORDER_SUCCESS,
    CREATE_ORDER_FAIL,
    PROCESS_PAYMENT_REQUEST,
    PROCESS_PAYMENT_SUCCESS,
    PROCESS_PAYMENT_FAIL,
    CREATE_CHECKOUT_SESSION_REQUEST,
    CREATE_CHECKOUT_SESSION_SUCCESS,
    CREATE_CHECKOUT_SESSION_FAIL,
    GET_USER_ORDERS_REQUEST,
    GET_USER_ORDERS_SUCCESS,
    GET_USER_ORDERS_FAIL,
    GET_STORE_ORDERS_REQUEST,
    GET_STORE_ORDERS_SUCCESS,
    GET_STORE_ORDERS_FAIL,
    GET_ALL_ORDERS_REQUEST,
    GET_ALL_ORDERS_SUCCESS,
    GET_ALL_ORDERS_FAIL,
    UPDATE_ORDER_STATUS_REQUEST,
    UPDATE_ORDER_STATUS_SUCCESS,
    UPDATE_ORDER_STATUS_FAIL,
    UPDATE_PAYMENT_STATUS_REQUEST,
    UPDATE_PAYMENT_STATUS_SUCCESS,
    UPDATE_PAYMENT_STATUS_FAIL




} from '../constants/orderConstants';
import { getUserConfig, getAuthConfig } from "../../utils/apiConfig";


// Create checkout session
export const createCheckoutSession = (orderItems, shippingInfo) => async (dispatch) => {
    try {
        dispatch({ type: CREATE_CHECKOUT_SESSION_REQUEST });

        const { data } = await axios.post(`${import.meta.env.VITE_APP}/api/v1/order/create-checkout-session`, {
            orderItems,
            shippingInfo
        });

        dispatch({
            type: CREATE_CHECKOUT_SESSION_SUCCESS,
            payload: data
        });

        return data;
    } catch (error) {
        dispatch({
            type: CREATE_CHECKOUT_SESSION_FAIL,
            payload: error.response?.data?.message || "Checkout session creation failed"
        });
        throw error;
    }
};

// Create order (for both COD and after successful online payment)
export const createOrder = (orderData) => async (dispatch) => {
    try {
        dispatch({ type: CREATE_ORDER_REQUEST });

        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        };

        const { data } = await axios.post(`${import.meta.env.VITE_APP}/api/v1/order/new`, orderData, config);

        dispatch({
            type: CREATE_ORDER_SUCCESS,
            payload: data
        });
    } catch (error) {
        dispatch({
            type: CREATE_ORDER_FAIL,
            payload: error.response?.data?.message || "Order creation failed"
        });
    }
};

// Process payment (if needed for direct payment integration)
export const processPayment = (paymentData) => async (dispatch) => {
    try {
        dispatch({ type: PROCESS_PAYMENT_REQUEST });

        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        };

        const { data } = await axios.post(`${import.meta.env.VITE_APP}/api/v1/payment/process`, paymentData, config);

        dispatch({
            type: PROCESS_PAYMENT_SUCCESS,
            payload: data
        });
    } catch (error) {
        dispatch({
            type: PROCESS_PAYMENT_FAIL,
            payload: error.response?.data?.message || "Payment processing failed"
        });
    }
}; 

// Get user orders
export const getUserOrders = () => async (dispatch) => {
    try {
        dispatch({ type: GET_USER_ORDERS_REQUEST });
        const config = getUserConfig();
        const { data } = await axios.get(`${import.meta.env.VITE_APP}/api/v1/user/orders`, config);
        dispatch({
            type: GET_USER_ORDERS_SUCCESS,
            payload: data
        });
    } catch (error) {
        dispatch({
            type: GET_USER_ORDERS_FAIL,
            payload: error.response?.data?.message || "Failed to fetch user orders"
        });
    }
};

// Get store orders
export const getStoreOrders = () => async (dispatch) => {
    try {
        dispatch({ type: GET_STORE_ORDERS_REQUEST });
        const config = getAuthConfig();
        const { data } = await axios.get(`${import.meta.env.VITE_APP}/api/v1/store/orders`, config);
        console.log(data)
        dispatch({
            type: GET_STORE_ORDERS_SUCCESS,
            payload: data
        });
    } catch (error) {
        dispatch({
            type: GET_STORE_ORDERS_FAIL,
            payload: error.response?.data?.message || "Failed to fetch store orders"
        });
    }
};

export const getAllOrders = () => async (dispatch) => {
    try {
        dispatch({ type: GET_ALL_ORDERS_REQUEST });
        const config = getUserConfig();
        const { data } = await axios.get(`${import.meta.env.VITE_APP}/api/v1/order/all`, config);
        dispatch({
            type: GET_ALL_ORDERS_SUCCESS,
            payload: data
        });
    } catch (error) {
        dispatch({
            type: GET_ALL_ORDERS_FAIL,
            payload: error.response?.data?.message || "Failed to fetch all orders"
        });
    }
};


// Update order status
export const updateOrderStatus = (orderId, status) => async (dispatch) => {
    try {
        dispatch({ type: UPDATE_ORDER_STATUS_REQUEST });
        const config = getUserConfig();
        const { data } = await axios.put(`${import.meta.env.VITE_APP}/api/v1/order/${orderId}/status`, { status }, config);
        dispatch({
            type: UPDATE_ORDER_STATUS_SUCCESS,
            payload: data
        }); 
    } catch (error) {
        dispatch({
            type: UPDATE_ORDER_STATUS_FAIL,
            payload: error.response?.data?.message || "Failed to update order status"
        });
    }
};


// Update payment status
export const updatePaymentStatus = (orderId, paymentStatus) => async (dispatch) => {
    try {
        dispatch({ type: UPDATE_PAYMENT_STATUS_REQUEST });
        const config = getUserConfig();
        const { data } = await axios.put(`${import.meta.env.VITE_APP}/api/v1/order/${orderId}/payment-status`, { paymentStatus }, config);
        dispatch({
            type: UPDATE_PAYMENT_STATUS_SUCCESS,
            payload: data
        });
    } catch (error) {
        dispatch({
            type: UPDATE_PAYMENT_STATUS_FAIL,
            payload: error.response?.data?.message || "Failed to update payment status"
        });
    }
};

