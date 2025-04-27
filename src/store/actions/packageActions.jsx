import axios from 'axios';
import {
  GET_ALL_PACKAGES,
    PACKAGE_ERROR,
    SUBSCRIBE_PACKAGE_FAIL,
    SUBSCRIBE_PACKAGE_REQUEST,
    SUBSCRIBE_PACKAGE_SUCCESS,
    UPDATE_PACKAGE_FAIL,
    UPDATE_PACKAGE_REQUEST,
    UPDATE_PACKAGE_SUCCESS
} from '../constants/packageconstants'
import { getAuthConfig } from '../../utils/apiConfig';

export const subscribePackage = (packageType, paymentMethod) => async (dispatch) => {
  console.log(packageType)
  try {
    dispatch({ type: SUBSCRIBE_PACKAGE_REQUEST });
    console.log(packageType, paymentMethod)
    const config = getAuthConfig();
    console.log(config)

    const {data} = await axios.post(
      `${import.meta.env.VITE_APP}/api/v1/package`, 
      { packageType, paymentMethod }, 
      config
    );

    console.log('Response:', data.package.data.paymentUrl);
    if (data.package.success) {
      dispatch({
        type: SUBSCRIBE_PACKAGE_SUCCESS,
        payload: data.package,
      });
      window.location.href = data.package.data.paymentUrl;
      
      // Check if payment URL exists before redirecting
      if (data.package.data && data.package.data.paymentUrl) {
        window.location.href = data.package.data.paymentUrl;
      } else {
        console.error('Payment URL not found in response');
      }
    } else {
      dispatch({
        type: SUBSCRIBE_PACKAGE_FAIL,
        payload: data.package.message || 'Subscription failed',
      });
    }

  } catch (error) {
    console.error('Subscription error:', error?.response?.data?.message);
    // dispatch({
    //   type: SUBSCRIBE_PACKAGE_FAIL,
    //   payload: error.response?.data?.message || 'Subscription failed',
    // });
  }
};



// Action to fetch all packages
export const getAllPackages = () => async (dispatch) => {
  try {
    const token = localStorage.getItem("token"); 
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };
    
    const response = await axios.get(`${import.meta.env.VITE_APP}/api/v1/package`, config);
    dispatch({
      type: GET_ALL_PACKAGES,
      payload: response.data.data,
    });
  } catch (error) {
    dispatch({
      type: PACKAGE_ERROR,
      payload: error.response ? error.response.data.message : error.message,
    });
  }
};


export const updatePackage = (id, packageData) => async (dispatch) => {
  try {
    dispatch({ type: UPDATE_PACKAGE_REQUEST });
    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`, 
      },
    };
    const { data } = await axios.put(`${import.meta.env.VITE_APP}/api/v1/package/${id}`, packageData, config);
    dispatch({
      type: UPDATE_PACKAGE_SUCCESS,
      payload: data.data, 
    });
  } catch (error) {
    dispatch({
      type: UPDATE_PACKAGE_FAIL,
      payload: error.response ? error.response.data.message : error.message,
    });
  }
};
