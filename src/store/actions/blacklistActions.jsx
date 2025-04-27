import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  BLACKLIST_PRODUCT_REQUEST,
  BLACKLIST_PRODUCT_SUCCESS,
  BLACKLIST_PRODUCT_FAILURE,
  FETCH_BLACKLIST_REQUEST,
  FETCH_BLACKLIST_SUCCESS,
  FETCH_BLACKLIST_FAILURE,
} from "../constants/blacklistTypes";
import { getUserConfig } from "../../utils/apiConfig";

export const blacklistProduct = (productId, storeId) => {
  return async (dispatch) => {
    dispatch({ type: BLACKLIST_PRODUCT_REQUEST });

    const config = getUserConfig(); 

    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_APP}/api/v1/store-products-blacklist/${storeId}`,
        { productId },
        config
      );

      dispatch({ type: BLACKLIST_PRODUCT_SUCCESS, payload: data });

      // ✅ Success Toast
      toast.success("Product has been blacklisted successfully!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "colored",
      });
    } catch (error) {
      dispatch({
        type: BLACKLIST_PRODUCT_FAILURE,
        payload: error.response?.data?.message || error.message,
      });

      // ❌ Error Toast
      toast.error(error.response?.data?.error.message || "Something went wrong!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "colored",
      });
    }
  };
};




export const fetchBlacklistRequest = () => ({ type: FETCH_BLACKLIST_REQUEST });

export const fetchBlacklistSuccess = (products) => ({
  type: FETCH_BLACKLIST_SUCCESS,
  payload: products,
});

export const fetchBlacklistFailure = (error) => ({
  type: FETCH_BLACKLIST_FAILURE,
  payload: error,
});

// Async Action (Thunk)
export const fetchBlacklistProducts = () => {
  const config = getUserConfig(); 
  return async (dispatch) => {
    dispatch(fetchBlacklistRequest());
    try {
      const response = await axios.get(`${import.meta.env.VITE_APP}/api/v1/store-products-blacklist` , config);
      dispatch(fetchBlacklistSuccess(response.data));
    } catch (error) {
      dispatch(fetchBlacklistFailure(error.message));
    }
  };
}



export const removeFromBlacklist = (storeId, productId) => async (dispatch) => {
  const config = getUserConfig(); 
  try {
    dispatch({ type: "REMOVE_BLACKLIST_REQUEST" });

    await axios.post(
      `${import.meta.env.VITE_APP}/api/v1/remove-product-from-blacklist/${storeId}`,
      { productId },
      config // Include headers for authentication
    );

    dispatch({ type: "REMOVE_BLACKLIST_SUCCESS", payload: productId });
      // ✅ Success Toast
      toast.success("Product has been blacklisted successfully!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "colored",
      });
    dispatch(fetchBlacklistProducts());
  } catch (error) {
    console.log(error)
    dispatch({
      type: "REMOVE_BLACKLIST_FAIL",
      payload: error.response?.data?.message || error.message,
    });
  }
};