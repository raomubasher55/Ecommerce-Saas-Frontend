import axios from "axios";
import { toast } from "react-toastify";
import {
  VERIFY_FAIL,
  VERIFY_REQUEST,
  VERIFY_SUCCESS,
  EMAIL_VERIFY_REQUEST,
  EMAIL_VERIFY_SUCCESS,
  EMAIL_VERIFY_FAIL,
} from "../constants/verifyConstants";

const API_BASE_URL = import.meta.env.VITE_APP; // Ensure consistency

// Verify User Email
export const verifyUser = (token) => async (dispatch) => {
  try {
    dispatch({ type: VERIFY_REQUEST });

    const { data } = await axios.get(
      `${API_BASE_URL}/api/v1/email/verify/${token}`,
    );

    dispatch({ type: VERIFY_SUCCESS, payload: data.message });

    toast.success("Email verified successfully!");

    window.location.href = "/"; 
  } catch (error) {
    const errorMsg = error.response?.data?.message || error.message || "Verification failed";

    dispatch({ type: VERIFY_FAIL, payload: errorMsg });

    toast.error(errorMsg);
  }
};

// Resend Verification Email
export const verifyEmail = (email) => async (dispatch) => {
  try {
    dispatch({ type: EMAIL_VERIFY_REQUEST });

    const { data } = await axios.post(
      `${API_BASE_URL}/api/v1/email/resend-verify-email`,
      { email },
      {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      }
    );

    dispatch({ type: EMAIL_VERIFY_SUCCESS, payload: data.message });

    toast.success("Verification email sent successfully!");
  } catch (error) {
    const errorMsg = error.response?.data?.message || error.message || "Failed to resend verification email";

    dispatch({ type: EMAIL_VERIFY_FAIL, payload: errorMsg });

    toast.error(errorMsg);
  }
};
