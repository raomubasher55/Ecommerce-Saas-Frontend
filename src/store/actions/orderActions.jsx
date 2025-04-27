import axios from "axios";
import { CREATE_ORDER_FAIL, 
    CREATE_ORDER_REQUEST, 
    CREATE_ORDER_SUCCESS, 
    GET_USER_ORDERS_FAIL, 
    GET_USER_ORDERS_REQUEST,
    GET_USER_ORDERS_SUCCESS,
    GET_STORE_ORDERS_REQUEST, 
    GET_STORE_ORDERS_SUCCESS, 
    GET_STORE_ORDERS_FAIL, 
    UPDATE_ORDER_STATUS_REQUEST,
    UPDATE_ORDER_STATUS_SUCCESS,
    UPDATE_ORDER_STATUS_FAIL,
    UPDATE_PAYMENT_STATUS_FAIL,
    UPDATE_PAYMENT_STATUS_SUCCESS,
    UPDATE_PAYMENT_STATUS_REQUEST,
    ALL_ORDERS_REQUEST,
    ALL_ORDERS_SUCCESS,
    ALL_ORDERS_FAIL,
    PROCESS_PAYMENT_REQUEST,
    PROCESS_PAYMENT_SUCCESS,
    PROCESS_PAYMENT_FAIL
} from '../constants/orderConstants'
import { getAuthConfig, getUserConfig } from "../../utils/apiConfig";
import { toast } from "react-toastify";



export const processPayment = (paymentData) => async (dispatch) => {
  try {
      dispatch({ type: PROCESS_PAYMENT_REQUEST });

      const config = getAuthConfig();
      const { data } = await axios.post(
          `${import.meta.env.VITE_APP}/api/v1/payment/process`,
          paymentData,
          config
      );

      dispatch({ 
          type: PROCESS_PAYMENT_SUCCESS, 
          payload: data.clientSecret 
      });

  } catch (error) {
      dispatch({
          type: PROCESS_PAYMENT_FAIL,
          payload: error.response?.data.message || error.message
      });
      toast.error(error.response?.data.message || "Payment processing failed");
  }
};

// Create Order Action
export const createOrder = (order) => async (dispatch) => {
  try {
      dispatch({ type: CREATE_ORDER_REQUEST });
      const config = getUserConfig();
      if (!config) {
        toast.error("Please log in first as a user");
        return;
      }
      const { data } = await axios.post(
          `${import.meta.env.VITE_APP}/api/v1/order/new`,
          order,
          config
      );

      dispatch({ 
          type: CREATE_ORDER_SUCCESS, 
          payload: data.order 
      });

      // Clear cart after successful order
      // dispatch(clearCart());
      
  }catch (error) {
    const errorMessage = error.response?.data.error?.message || error.message;

    if (errorMessage === "Invalid or expired token.") {
      toast.error("Please log in first as a user");
    } else {
      toast.error(errorMessage || "Failed to create order");
    }

    dispatch({
      type: CREATE_ORDER_FAIL,
      payload: errorMessage,
    });
  }
};




// Action to fetch user orders
export const getUserOrders = () => async (dispatch) => {
  try {
    dispatch({ type: GET_USER_ORDERS_REQUEST });
    const config = getUserConfig()
    const { data } = await axios.get(`${import.meta.env.VITE_APP}/api/v1/order/user/orders`, config);
    dispatch({
      type: GET_USER_ORDERS_SUCCESS,
      payload: data.orders,
    });
  } catch (error) {
    dispatch({
      type: GET_USER_ORDERS_FAIL,
      payload: error.response && error.response.data.message ? error.response.data.message : error.message,
    });
  }
};



// get store orders

export const getStoreOrders = () => async (dispatch) => {
  try {
    dispatch({ type: GET_STORE_ORDERS_REQUEST });

    const config = getAuthConfig()

    const { data } = await axios.get(`${import.meta.env.VITE_APP}/api/v1/order/store/orders`, config);
    dispatch({
      type: GET_STORE_ORDERS_SUCCESS,
      payload: data.orders,
    });
  } catch (error) {
    dispatch({
      type: GET_STORE_ORDERS_FAIL,
      payload: error.response && error.response.data.message
        ? error.response.data.message
        : error.message,
    });
  }
};



// update order status 

export const updateOrderStatus = (orderId, status) => async (dispatch) => {
  try {
    dispatch({ type: UPDATE_ORDER_STATUS_REQUEST });

    const config = getAuthConfig()

    const { data } = await axios.put(`${import.meta.env.VITE_APP}/api/v1/order/${orderId}/status`, { status }, config);

    dispatch({
      type: UPDATE_ORDER_STATUS_SUCCESS,
      payload: data.order,
    });

    toast.success(data.message);
  } catch (error) {
    dispatch({
      type: UPDATE_ORDER_STATUS_FAIL,
      payload: error.response && error.response.data.message ? error.response.data.message : error.message,
    });

    toast.error(error.response && error.response.data.message ? error.response.data.message : error.message);
  }
};


// export const updateOrderStatus = (orderId, status) => async (dispatch) => {
//   try {
//     dispatch({ type: UPDATE_ORDER_STATUS_REQUEST });

//     const config = getAuthConfig()

//     const { data } = await axios.put(`${import.meta.env.VITE_APP}/api/v1/order/${orderId}/status`, { status }, config);

//     dispatch({
//       type: UPDATE_ORDER_STATUS_SUCCESS,
//       payload: data.order,
//     });

//     toast.success(data.message);
//   } catch (error) {
//     dispatch({
//       type: UPDATE_ORDER_STATUS_FAIL,
//       payload: error.response && error.response.data.error.message ? error.response.data.error.message : error.message,
//     });

//     toast.error(error.response && error.response.data.error.message ? error.response.data.error.message : error.message);
//   }
// };

// update payment method status 


export const updatePaymentStatus = (orderId, paymentStatus) => async (dispatch) => {
  try {
    dispatch({ type: UPDATE_PAYMENT_STATUS_REQUEST });


    const config = getAuthConfig()

    const { data } = await axios.put(
      `${import.meta.env.VITE_APP}/api/v1/order/payment-status/${orderId}`,
      { paymentStatus },
      config
    );

    dispatch({
      type: UPDATE_PAYMENT_STATUS_SUCCESS,
      payload: data.order,
    });

    toast.success(data.message);
  } catch (error) {
    const errorMsg =
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message;

    dispatch({
      type: UPDATE_PAYMENT_STATUS_FAIL,
      payload: errorMsg,
    });

    toast.error(errorMsg);
  }
};



// Fetch all orders for admin dashboard
export const getAllOrders = () => async (dispatch) => {
  try {
    dispatch({ type: ALL_ORDERS_REQUEST });
    const config = getUserConfig()
    const { data } = await axios.get(`${import.meta.env.VITE_APP}/api/v1/order/all` , config);

    dispatch({
      type: ALL_ORDERS_SUCCESS,
      payload: data.orders,
    });
  } catch (error) {
    dispatch({
      type: ALL_ORDERS_FAIL,
      payload: error.response?.data?.message || error.message,
    });
  }
};
