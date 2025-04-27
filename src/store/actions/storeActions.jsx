// storeActions.js

import axios from 'axios';
import { 
    LOGIN_REQUEST, LOGIN_SUCCESS, LOGIN_FAILURE, 
    STORE_REGISTER_REQUEST, STORE_REGISTER_SUCCESS, STORE_REGISTER_FAIL, 
    UPLOAD_DOCUMENT_REQUEST, UPLOAD_DOCUMENT_SUCCESS, UPLOAD_DOCUMENT_FAIL,
    FETCH_STORE_REQUEST, FETCH_STORE_SUCCESS, FETCH_STORE_FAILURE,
    UPDATE_STORE_REQUEST, UPDATE_STORE_SUCCESS, UPDATE_STORE_FAILURE,
    FETCH_STORES_REQUEST, FETCH_STORES_SUCCESS,FETCH_STORES_FAILURE,
    STORE_LIST_REQUEST, STORE_LIST_SUCCESS, STORE_LIST_FAIL,
    FETCH_STORE_PRODUCTS_REQUEST, FETCH_STORE_PRODUCTS_SUCCESS, FETCH_STORE_PRODUCTS_FAILURE,
    FETCH_STORE_SALES_REQUEST, FETCH_STORE_SALES_SUCCESS, FETCH_STORE_SALES_FAILURE,
    FETCH_STORE_DETAILS_REQUEST, FETCH_STORE_DETAILS_SUCCESS, FETCH_STORE_DETAILS_FAILURE,
    WITHDRAW_REQUEST, WITHDRAW_SUCCESS, WITHDRAW_FAIL,
    FETCH_BLACKIST_PRODUCTS_REQUEST, FETCH_BLACKIST_PRODUCTS_SUCCESS, FETCH_BLACKIST_PRODUCTS_FAILURE, 
    SUSPEND_STORE_REQUEST,
    SUSPEND_STORE_SUCCESS,
    SUSPEND_STORE_FAILURE,
    RECOVER_STORE_REQUEST,
    RECOVER_STORE_SUCCESS,
    RECOVER_STORE_FAILURE,
    VERIFY_EMAIL_REQUEST,
    VERIFY_EMAIL_SUCCESS,
    VERIFY_EMAIL_FAIL
} from '../constants/StoreConstants';  
import { FETCH_PRODUCTS_FAILURE, FETCH_PRODUCTS_REQUEST, FETCH_PRODUCTS_SUCCESS } from '../constants/productConstants';
import { getAuthConfig } from '../../utils/apiConfig';
import { toast } from 'react-toastify';

export const uploadDocument = (formData) => async (dispatch) => {
  try {
    dispatch({ type: UPLOAD_DOCUMENT_REQUEST });


    if (!formData || !formData.get('documents')) {
      dispatch({ type: UPLOAD_DOCUMENT_FAIL, payload: 'File is required' });
      return;
    }

    const config = {
      headers: {
        ...getAuthConfig().headers,
        'Content-Type': 'multipart/form-data',
      },
    };
    const { data } = await axios.post(
      `${import.meta.env.VITE_APP}/api/v1/doc`, 
      formData, 
      config
    );


    dispatch({ type: UPLOAD_DOCUMENT_SUCCESS, payload: data });
  } catch (error) {
    toast.error(error?.response?.data?.error?.message)
    dispatch({
      type: UPLOAD_DOCUMENT_FAIL,
      payload: error?.response?.data?.error?.message ,
    });
  }
};

export const registerStore = (storeData) => async (dispatch) => {
  try {
    dispatch({ type: STORE_REGISTER_REQUEST });

    const { data } = await axios.post(
      `${import.meta.env.VITE_APP}/api/v1/store/register`,
      storeData,
      {
        headers: {
          "Content-Type": "multipart/form-data", 
        },
      }
    );

    localStorage.setItem("storeToken", data.token);
    dispatch({ type: STORE_REGISTER_SUCCESS, payload: data });
    
  } catch (error) {
    toast.error(error.response?.data?.error?.message)
    dispatch({
      type: STORE_REGISTER_FAIL,
      payload: error.response?.data?.error?.message || "Something went wrong",
    });
  }
};

export const loginRequest = () => ({
  type: LOGIN_REQUEST,
});

export const loginSuccess = (userData) => ({
  type: LOGIN_SUCCESS,
  payload: userData,
});

export const loginFailure = (error) => ({
  type: LOGIN_FAILURE,
  payload: error,
});

export const loginStore = (formData) => async (dispatch) => {
  dispatch(loginRequest());
  try {
      const response = await axios.post(`${import.meta.env.VITE_APP}/api/v1/store/login`, formData);
      if (response?.data) {
        dispatch(loginSuccess(response.data));

        // ✅ Save Token inside the check
        localStorage.setItem('storeToken', response.data.token);

        // ✅ Success Toast
        toast.success('Login successful!', {
            position: "top-right",
            autoClose: 3000,
        });
    }

  } catch (err) {
      dispatch(loginFailure(err.response?.data?.error?.message || 'Login failed.'));
      // ❌ Error Toast
      toast.error(err?.response?.data?.error?.message || 'Login failed.', {
          position: "top-right",
          autoClose: 3000,
      });
  }
};




// get store by token


export const fetchStore = () => async (dispatch) => {
    dispatch({ type: FETCH_STORE_REQUEST });

    try {
        const token = localStorage.getItem("storeToken");
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };
        const response = await axios.get(`${import.meta.env.VITE_APP}/api/v1/store/profile`, config);
        
        dispatch({ type: FETCH_STORE_SUCCESS, payload: response.data.store });
    } catch (error) {
        dispatch({
            type: FETCH_STORE_FAILURE,
            payload: error.response?.data?.message || "Something went wrong",
        });
    }
};


// get store by id 

export const getStore = (storeId) => async (dispatch) => {
  dispatch({ type: FETCH_STORE_REQUEST });
  try {
    const response = await axios.get(`${import.meta.env.VITE_APP}/api/v1/store/store/${storeId}`);
    dispatch({ type: FETCH_STORE_SUCCESS, payload: response.data.store });
  } catch (error) {
    dispatch({
      type: FETCH_STORE_FAILURE,
      payload: error.response?.data?.message || "Something went wrong",
    });
  }
};




// update store info data 


export const updateStoreProfile = (storeData) => {
    return async (dispatch) => {
      dispatch({ type: UPDATE_STORE_REQUEST });
  
      try {
        const token = localStorage.getItem("storeToken");
        const response = await fetch(
          `${import.meta.env.VITE_APP}/api/v1/store/update-profile`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: token ? `Bearer ${token}` : "",
            },
            credentials: "include",  
            body: JSON.stringify(storeData),
          }
        );
  
        const data = await response.json();
        console.log(data);
  
        if (response.ok && data.success) {
          dispatch({ type: UPDATE_STORE_SUCCESS, payload: data.store });
        } else {
          dispatch({
            type: UPDATE_STORE_FAILURE,
            payload: data.message || "Failed to update profile",
          });
        }
      } catch (error) {
        dispatch({
          type: UPDATE_STORE_FAILURE,
          payload: error.message || "Something went wrong",
        });
      }
    };
  };
  
  


  // fetch all store with admin access 


  export const fetchStores = () => async (dispatch) => {
    dispatch({ type: FETCH_STORES_REQUEST });
    try {
      const token = localStorage.getItem("token");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.get(`${import.meta.env.VITE_APP}/api/v1/store/all`, config);
      dispatch({ type: FETCH_STORES_SUCCESS, payload: response.data.stores.docs }); 
    } catch (error) {
      dispatch({
        type: FETCH_STORES_FAILURE,
        payload: error.response?.data?.message || error.message,
      });
    }
  };
  


  // Action to fetch all stores
export const listStores = (page = 1, limit = 10, sortBy = '-createdAt') => async (dispatch) => {
  try {
    dispatch({ type: STORE_LIST_REQUEST });

    const { data } = await axios.get(`${import.meta.env.VITE_APP}/api/v1/store/all-store`, {
      params: { page, limit, sortBy },
    });

    dispatch({
      type: STORE_LIST_SUCCESS,
      payload: data.stores, 
    });

  } catch (error) {
    dispatch({
      type: STORE_LIST_FAIL,
      payload: error.response && error.response.data.message 
        ? error.response.data.message 
        : error.message,
    });
  }
};




// get product by store name 


export const fetchStoreProducts = () => {
  return async (dispatch) => {
    dispatch({ type: FETCH_STORE_PRODUCTS_REQUEST });
    try {
      // Fetch stores
      const storesResponse = await fetch(`${import.meta.env.VITE_APP}/api/v1/store/all-store`);
      const storesData = await storesResponse.json();
      // Collect product IDs
      const productIds = storesData.stores.docs.flatMap(store => store.products);
      if (productIds.length === 0) {
        console.log("No product IDs found.");
        return;
      }
      
      const idsQueryString = `ids=${productIds.join(',')}`; 
      
      const productsResponse = await fetch(`${import.meta.env.VITE_APP}/api/v1/products/bystore?${idsQueryString}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      const productsData = await productsResponse.json();

      dispatch({
        type: FETCH_STORE_PRODUCTS_SUCCESS,
        payload: {
          stores: storesData.stores.docs,
          products: productsData.products || []
        }
      });
    } catch (error) {
      dispatch({
        type: FETCH_STORE_PRODUCTS_FAILURE,
        payload: error.message
      });
    }
  };
};



export const fetchProductsRequest = () => ({
  type: FETCH_PRODUCTS_REQUEST,
});

export const fetchProductsSuccess = (products) => ({
  type: FETCH_PRODUCTS_SUCCESS,
  payload: products,
});

export const fetchProductsFailure = (error) => ({
  type: FETCH_PRODUCTS_FAILURE,
  payload: error,
});

export const fetchProductsByStore = (storeId) => {
  return async (dispatch) => {
    if (!storeId) {
      return; 
    }
    
    dispatch(fetchProductsRequest());
    
    try {
      const response = await fetch(`${import.meta.env.VITE_APP}/api/v1/store/${storeId}/products`);
      const data = await response.json();

      if (data.success) {
        dispatch(fetchProductsSuccess(data.products));
      } else {
        dispatch(fetchProductsFailure('Failed to fetch products.'));
      }
    } catch (error) {
      dispatch(fetchProductsFailure(error.message));
    }
  };
};

export const fetchBlackistProductsByStore = () => async (dispatch) => {
  dispatch({ type: FETCH_BLACKIST_PRODUCTS_REQUEST });

  const token = localStorage.getItem("storeToken");
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  try {
    const response = await fetch(`${import.meta.env.VITE_APP}/api/v1/store/get-all-blacklist-products`, config);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    const data = await response.json();
    
    dispatch({ type: FETCH_BLACKIST_PRODUCTS_SUCCESS, payload: data });

  } catch (error) {
    dispatch({ type: FETCH_BLACKIST_PRODUCTS_FAILURE, payload: error.message });
  }
};




export const fetchStoreSales = (storeId) => {
  return async (dispatch) => {
    if (!storeId) {
      return;
    }
    dispatch({ type: FETCH_STORE_SALES_REQUEST });
    try {
      const response = await fetch(`${import.meta.env.VITE_APP}/api/v1/store/sales/${storeId}`);
      const data = await response.json();
      dispatch({ type: FETCH_STORE_SALES_SUCCESS, payload: data });
    } catch (error) {
      dispatch({ type: FETCH_STORE_SALES_FAILURE, payload: error.message });
    }
  };
};

export const fetchStoreDetails = (storeId) => async (dispatch) => {
  dispatch({ type: FETCH_STORE_DETAILS_REQUEST });
  try {
    const response = await fetch(`${import.meta.env.VITE_APP}/api/v1/store/store/${storeId}`);
    const data = await response.json();
    if (data.success) {
      dispatch({ type: FETCH_STORE_DETAILS_SUCCESS, payload: data.store });
    } else {
      dispatch({ type: FETCH_STORE_DETAILS_FAILURE, payload: data.message });
    }
  } catch (error) {
    dispatch({ type: FETCH_STORE_DETAILS_FAILURE, payload: error.message });
  }
};

export const paymentWithdraw = (amount) => async (dispatch) => {
  try {
    dispatch({ type: WITHDRAW_REQUEST });

    const config = {
      headers: {
        ...getAuthConfig().headers,
        'Content-Type': 'application/json'
      }
    };

    const { data } = await axios.post(
      `${import.meta.env.VITE_APP}/api/v1/store/payment-withdraw`,
      { amount },
      config
    );
    dispatch({
      type: WITHDRAW_SUCCESS,
      payload: data.message
    });

  } catch (error) {
    dispatch({
      type: WITHDRAW_FAIL,
      payload: error.response?.data?.error.message
    });
    throw error;
  }
};





// Action Creator for suspending a store
export const suspendStore = (storeId) => async (dispatch) => {
  dispatch({ type: SUSPEND_STORE_REQUEST });

  const token = localStorage.getItem("token"); 
  const config = {
    method: "POST", 
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  };

  try {
    const response = await fetch(
      `${import.meta.env.VITE_APP}/api/v1/store-suspension/${storeId}`,
      config
    );

    if (!response.ok) {
      throw new Error(`Failed to suspend store! Status: ${response.status}`);
    }

    const data = await response.json();
    dispatch({ type: SUSPEND_STORE_SUCCESS, payload: data });
    toast.success("Store suspeded successfully! ✅");

  } catch (error) {
    dispatch({ type: SUSPEND_STORE_FAILURE, payload: error.message });
    toast.error(`Error: ${error.message} ❌`); 
  }
};



// recover store by admin 

export const recoverStoreById = (storeId) => {
  return async (dispatch) => {
    dispatch({ type: RECOVER_STORE_REQUEST });

    const token = localStorage.getItem("token"); 

    try {
      const response = await fetch(
        `${import.meta.env.VITE_APP}/api/v1/recover-store/${storeId}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to recover store");
      }

      dispatch({ type: RECOVER_STORE_SUCCESS });
      toast.success("Store recovered successfully! ✅");
    } catch (error) {
      dispatch({ type: RECOVER_STORE_FAILURE, payload: error.message });
      toast.error(`Error: ${error.message} ❌`); 
    }
  };
};


export const verifyEmail = (token) => async (dispatch) => {
  try {
    dispatch({ type: VERIFY_EMAIL_REQUEST });

    const { data } = await axios.get(
      `${import.meta.env.VITE_APP}/api/v1/verify-email/${token}`
    );

    dispatch({ type: VERIFY_EMAIL_SUCCESS, payload: data.message });
  } catch (error) {
    dispatch({
      type: VERIFY_EMAIL_FAIL,
      payload: error.response?.data?.message || "Verification failed",
    });
  }
};



export const verifyStoreEmail = (token) => {
  return async (dispatch) => {
    dispatch({ type: VERIFY_EMAIL_REQUEST });
    
    try {
      const response = await axios.get(`${import.meta.env.VITE_APP}/api/v1/store/verify-email/${token}`);
      
      dispatch({
        type: VERIFY_EMAIL_SUCCESS,
        payload: response.data
      });
      
      return Promise.resolve(response.data);
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Email verification failed';
      
      dispatch({
        type: VERIFY_EMAIL_FAIL,
        payload: errorMessage
      });
      
      return Promise.reject(new Error(errorMessage));
    }
  };
};



export const sendReminder = (storeEmail) => async (dispatch) => {
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_APP}/api/v1/store/reminder-email`,
      { email: storeEmail }
    );

    dispatch({
      type: "REMINDER_EMAIL_SUCCESS",
      payload: response.data.message,
    });

    // Show success toast
    toast.success("Reminder email sent successfully!", {
      position: "top-right",
      autoClose: 3000,
    });

  } catch (error) {
    dispatch({
      type: "REMINDER_EMAIL_FAIL",
      payload: error.response?.data?.message || "Failed to send reminder email",
    });

    // Show error toast
    toast.error(error.response?.data?.message || "Failed to send reminder email", {
      position: "top-right",
      autoClose: 3000,
    });
  }
};