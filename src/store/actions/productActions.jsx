// actions/productActions.js

import axios from "axios";
import {getAuthConfig, getUserConfig} from '../../utils/apiConfig'
import {
  ADD_PRODUCT_REQUEST,
  ADD_PRODUCT_SUCCESS,
  ADD_PRODUCT_FAIL,
  ALL_PRODUCTS_REQUEST ,
  ALL_PRODUCTS_SUCCESS ,
  ALL_PRODUCTS_FAIL ,
  STORE_PRODUCTS_REQUEST ,
  STORE_PRODUCTS_SUCCESS ,
  STORE_PRODUCTS_FAIL,
  UPDATE_PRODUCT_REQUEST, 
  UPDATE_PRODUCT_SUCCESS, 
  UPDATE_PRODUCT_FAIL,
  DELETE_PRODUCT,
  GET_SINGLE_PRODUCT_REQUEST,
  GET_SINGLE_PRODUCT_SUCCESS,
  GET_SINGLE_PRODUCT_FAIL,
  PRODUCTS_LOADING,
  GET_PRODUCTS_BY_CATEGORY,
  PRODUCTS_ERROR,
}
from '../constants/productConstants'
import { toast } from "react-toastify";


export const addProduct = (productDetails) => async (dispatch) => {
  try {
    dispatch({ type: ADD_PRODUCT_REQUEST });

    const getAuthConfig = () => {
      const token = localStorage.getItem('storeToken');
      return {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      };
    };

    const config = {
      ...getAuthConfig().headers,
      'Content-Type': 'multipart/form-data', 
    };

    const { data } = await axios.post(
      `${import.meta.env.VITE_APP}/api/v1/product/new`,
      productDetails,
      { headers: config } 
    );

    dispatch({ type: ADD_PRODUCT_SUCCESS, payload: data });
    toast.success('Product added successfully!');
  } catch (error) {
    dispatch({
      type: ADD_PRODUCT_FAIL,
      payload: error.response && error.response.data.message
      ? error.response.data.message
      : error.message,
    });
    toast.error(error.response?.data?.error?.message || 'Error adding Product');
  }
};




// get products 

export const getProducts = (query = "") => async (dispatch) => {
  try {
    const config = getAuthConfig()
    dispatch({ type: ALL_PRODUCTS_REQUEST });

    const { data } = await axios.get(`${import.meta.env.VITE_APP}/api/v1/products?${query}` ,config );
    dispatch({
      type: ALL_PRODUCTS_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: ALL_PRODUCTS_FAIL,
      payload: error.response?.data?.message || error.message,
    });
  }
};



// get store products by token 
export const getStoreProducts = (query = '') => async (dispatch) => {
  try {
    const config = getAuthConfig();
    dispatch({ type: STORE_PRODUCTS_REQUEST });

    const { data } = await axios.get(`${import.meta.env.VITE_APP}/api/v1/store/products?${query}`, config);
    dispatch({
      type: STORE_PRODUCTS_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: STORE_PRODUCTS_FAIL,
      payload: error.response?.data?.message || error.message,
    });
  }
};




// update product by id


export const updateProduct = (id, productData) => async (dispatch) => {
  try {

    const formData = new FormData();

        formData.append("name", productData.name);
    formData.append("description", productData.description);
    formData.append("price", productData.price);
    formData.append("category", productData.category);
    formData.append("subcategory", productData.subcategory);
    formData.append("stock", productData.stock);
    formData.append("discountPercentage", productData.discountPercentage);
    formData.append("discountStartDate", productData.discountStartDate);
    formData.append("discountEndDate", productData.discountEndDate);

    // Handle images
    productData.images.forEach((image) => {
      if (image instanceof File) {
        formData.append('images', image);
      } else if (typeof image === 'object' && image.url) {
        formData.append('existingImages[]', JSON.stringify(image));
      }
    });
    

    // Get authentication config
    const config = {
      ...getAuthConfig().headers,
      'Content-Type': 'multipart/form-data',
    };

    dispatch({ type: UPDATE_PRODUCT_REQUEST });

    const { data } = await axios.put(
      `${import.meta.env.VITE_APP}/api/v1/admin/product/${id}`,
      formData,
      { headers: config }
    );

    dispatch({
      type: UPDATE_PRODUCT_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: UPDATE_PRODUCT_FAIL,
      payload: error.response?.data?.message || error.message,
    });
  }
};




// delete product 


export const deleteProduct = (productId) => async (dispatch) => {
  console.log(productId)
  try {
    const config = getUserConfig() || localStorage.getItem('storeToken');
    console.log(config , 'token')
    await axios.delete(
      `${import.meta.env.VITE_APP}/api/v1/admin/product/${productId}`,
      config
    );

    dispatch({
      type: DELETE_PRODUCT,
      payload: productId,
    });
  } catch (error) {
    console.error("Error deleting product:", error);
  }
};


// Action to fetch a single product by ID
export const getSingleProduct = (id) => async (dispatch) => {
  try {
    dispatch({ type: GET_SINGLE_PRODUCT_REQUEST });

    const { data } = await axios.get(`${import.meta.env.VITE_APP}/api/v1/product/${id}`);
    dispatch({
      type: GET_SINGLE_PRODUCT_SUCCESS,
      payload: data.product,
    });
  } catch (error) {
    dispatch({
      type: GET_SINGLE_PRODUCT_FAIL,
      payload: error.response ? error.response.data.message : error.message,
    });
  }
};




export const getProductsByCategory = (categoryName) => async (dispatch) => {
  console.log(categoryName)
  try {
    dispatch({ type: PRODUCTS_LOADING });
    const response = await axios.get(`${import.meta.env.VITE_APP}/api/v1/products/category/${categoryName}`);
    dispatch({
      type: GET_PRODUCTS_BY_CATEGORY,
      payload: response.data.products, 
    });
  } catch (error) {
    dispatch({
      type: PRODUCTS_ERROR,
      payload: error.response && error.response.data.message ? error.response.data.message : error.message,
    });
  }
};
