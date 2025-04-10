import axios from "axios";
import { getUserConfig } from "../../utils/apiConfig";
import { 
    ADD_REVIEW_FAIL,
    ADD_REVIEW_REQUEST,
    ADD_REVIEW_SUCCESS,
    CLEAR_ERRORS
 } from '../constants/reviewConstants'

// Add or update a review
export const addOrUpdateReview = (productId, reviewData) => async (dispatch) => {
  try {
    dispatch({ type: ADD_REVIEW_REQUEST });

    const config = getUserConfig()
    console.log(productId)

    const { data } = await axios.put(`${import.meta.env.VITE_APP}/api/v1/review/${productId}`, reviewData, config);

    dispatch({
      type: ADD_REVIEW_SUCCESS,
      payload: data.product,
    });

  } catch (error) {
    dispatch({
      type: ADD_REVIEW_FAIL,
      payload: error.response?.data?.message || "Something went wrong",
    });
  }
};

// Clear errors
export const clearErrors = () => (dispatch) => {
  dispatch({ type: CLEAR_ERRORS });
};




// get product reviews

export const getProductReviews = (productId) => async (dispatch) => {
  try {
    dispatch({ type: "REVIEWS_REQUEST" });

    const { data } = await axios.get(`${import.meta.env.VITE_APP}/api/v1/review/${productId}`);

    dispatch({
      type: "REVIEWS_SUCCESS",
      payload: data.reviews, 
    });
  } catch (error) {
    dispatch({
      type: "REVIEWS_FAIL",
      payload: error.response?.data?.message || "Failed to fetch reviews",
    });
  }
};
