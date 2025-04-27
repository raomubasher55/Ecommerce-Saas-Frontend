import axios from 'axios';
import {
  REGISTER_USER_REQUEST,
  REGISTER_USER_SUCCESS,
  REGISTER_USER_FAILURE,
  LOGIN_REQUEST, 
  LOGIN_SUCCESS, 
  LOGIN_FAIL,
  LOGOUT_REQUEST,
  LOGOUT_SUCCESS,
  LOGOUT_FAIL,
  FORGOT_PASSWORD_REQUEST,
  FORGOT_PASSWORD_SUCCESS,
  FORGOT_PASSWORD_FAIL,
  RESET_PASSWORD_REQUEST,
  RESET_PASSWORD_SUCCESS,
  RESET_PASSWORD_FAIL,
} from '../constants/userConstants';
import { toast } from 'react-toastify';
import { getUserConfig } from '../../utils/apiConfig';

export const registerUser = (userData) => async (dispatch) => {
  try {
    dispatch({ type: REGISTER_USER_REQUEST });

    const config = {
      headers: {
        "Content-Type": "multipart/form-data", 
      },
    };

    const { data } = await axios.post(`${import.meta.env.VITE_APP}/api/v1/register`, userData, config);
    console.log(data)
    localStorage.setItem("token", data.token);
    dispatch({ type: REGISTER_USER_SUCCESS, payload: data });


  } catch (error) {
    console.log(error)
    dispatch({
      type: REGISTER_USER_FAILURE,
      payload: error.response?.data?.error.message || error.response?.data?.error,
    });
    // Show error toast
    toast.error(` ${error.response?.data?.error.message || error.response?.data?.error}`);
  }
};






// login 


// Login action
export const login = (email, password) => async (dispatch) => {
    try {
        dispatch({ type: LOGIN_REQUEST });

        const config = {
            headers: {
                'Content-Type': 'application/json',
            },
        };

        const { data } = await axios.post(`${import.meta.env.VITE_APP}/api/v1/login`, { email, password }, config);

        dispatch({
            type: LOGIN_SUCCESS,
            payload: data,
        });
        localStorage.setItem('token', data.token);

    } catch (error) {
      dispatch({
        type: LOGIN_FAIL,
        payload: error.response?.data?.error.message || "Something went wrong!",
    });
    
    }
};

// Logout action
export const logout = () => async (dispatch) => {
    try {
        dispatch({ type: LOGOUT_REQUEST });

        await axios.get(`${import.meta.env.VITE_APP}/api/v1/logout`);
        
        localStorage.removeItem('token');
        
        dispatch({ type: LOGOUT_SUCCESS });
        
        toast.success("Logged out successfully!");
        
    } catch (error) {
        dispatch({
            type: LOGOUT_FAIL,
            payload: error.response?.data?.message || error.message,
        });
        toast.error(`Logout failed: ${error.response?.data?.message || error.message}`);
    }
};

// Forgot Password action
export const forgotPassword = (email) => async (dispatch) => {
    try {
        dispatch({ type: FORGOT_PASSWORD_REQUEST });

        const config = {
            headers: {
                'Content-Type': 'application/json',
            },
        };

        const { data } = await axios.post(
            `${import.meta.env.VITE_APP}/api/v1/password/forgot`,
            { email },
            config
        );

        dispatch({
            type: FORGOT_PASSWORD_SUCCESS,
            payload: data.message,
        });

        toast.success(data.message);

    } catch (error) {
        dispatch({
            type: FORGOT_PASSWORD_FAIL,
            payload: error.response?.data?.message || error.message,
        });
        toast.error(`Failed: ${error.response?.data?.message || error.message}`);
    }
};

// Reset Password action
export const resetPassword = (token, passwords) => async (dispatch) => {
    try {
        dispatch({ type: RESET_PASSWORD_REQUEST });

        const config = {
            headers: {
                'Content-Type': 'application/json',
            },
        };

        const { data } = await axios.put(
            `${import.meta.env.VITE_APP}/api/v1/password/reset/${token}`,
            passwords,
            config
        );

        dispatch({
            type: RESET_PASSWORD_SUCCESS,
            payload: data.success,
        });

        toast.success("Password reset successful!");

    } catch (error) {
        dispatch({
            type: RESET_PASSWORD_FAIL,
            payload: error.response?.data?.message || error.message,
        });
        toast.error(`Reset failed: ${error.response?.data?.message || error.message}`);
    }
};






export const updateUserProfile = (userData) => async (dispatch) => {
    console.log(userData)
  try {
    dispatch({ type: "USER_UPDATE_REQUEST" });

    const config = {
      headers: {
        ...getUserConfig().headers,
        "Content-Type": "multipart/form-data",
      },
      withCredentials: true, 
    };

    const { data } = await axios.put(
      `${import.meta.env.VITE_APP}/api/v1/update-profile`,
      userData,
      config
    );

    dispatch({ type: "USER_UPDATE_SUCCESS", payload: data.user });
  } catch (error) {
    dispatch({
      type: "USER_UPDATE_FAIL",
      payload: error.response?.data?.message || "Failed to update profile",
    });
  }
};


