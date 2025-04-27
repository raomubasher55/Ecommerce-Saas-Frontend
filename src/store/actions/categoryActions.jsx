import {
  CATEGORY_ERROR,
  GET_ALL_CATEGORIES,
  CATEGORY_LIST_REQUEST, CATEGORY_LIST_SUCCESS, CATEGORY_LIST_FAIL
} from '../constants/categoryConstants';
import axios from 'axios';
import { toast } from 'react-toastify';
import {getAuthConfig} from '../../utils/apiConfig'





// Action to add a new category
export const addCategory = (categoryData) => async (dispatch) => {
  try {

    const config = getAuthConfig();

    await axios.post(`${import.meta.env.VITE_APP}/api/v1/category`, categoryData, config);

    dispatch(getAllCategories()); 
    toast.success('Category added successfully!');
  } catch (error) {
    console.log(error)
    dispatch({
      type: CATEGORY_ERROR,
      payload: error.response?.data?.error.message || 'Error adding category',
    });

    toast.error(error.response?.data?.error.message || 'Error adding category');
  }
};

// Action to fetch all categories and their subcategories
export const getAllCategories = () => async (dispatch) => {
  try {
    const config = getAuthConfig();

    const response = await axios.get(
      `${import.meta.env.VITE_APP}/api/v1/category`,
      config
    );
    dispatch({
      type: GET_ALL_CATEGORIES,
      payload: response.data.categories,
    });
  } catch (error) {
    dispatch({
      type: CATEGORY_ERROR,
      payload: error.response?.data?.message || 'Error fetching categories',
    });

    toast.error(error.response?.data?.message || 'Error fetching categories');
  }
};

export const getCategories = () => async (dispatch) => {
  try {

    const response = await axios.get(
      `${import.meta.env.VITE_APP}/api/v1/allcategory` );
    dispatch({
      type: GET_ALL_CATEGORIES,
      payload: response.data.categories,
    });
  } catch (error) {
    dispatch({
      type: CATEGORY_ERROR,
      payload: error.response?.data?.message || 'Error fetching categories',
    });

    console.log(error.response?.data?.message || 'Error fetching categories');
  }
};

// Action to delete a category
export const deleteCategory = (id) => async (dispatch) => {
  try {
    await axios.delete(`${import.meta.env.VITE_APP}/api/v1/category/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('storeToken')}`,
      },
    });

    dispatch(getAllCategories()); 
    toast.success('Category deleted successfully!');
  } catch (error) {
    dispatch({
      type: CATEGORY_ERROR,
      payload: error.response?.data?.message || 'Error deleting category',
    });

    toast.error(error.response?.data?.message || 'Error deleting category');
  }
};

// Action to add a subcategory
export const addSubCategory = (subCategoryData) => async (dispatch) => {
  try {
    const config = getAuthConfig();

    await axios.post(
      `${import.meta.env.VITE_APP}/api/v1/category/${subCategoryData.mainCategoryId}/subcategories`,
      {
        name: subCategoryData.name,
        description: subCategoryData.description,
      },
      config
    );

    dispatch(getAllCategories()); 
    toast.success('Subcategory added successfully!');
  } catch (error) {
    dispatch({
      type: CATEGORY_ERROR,
      payload: error.response?.data?.message || 'Error adding subcategory',
    });

    toast.error(error.response?.data?.message || 'Error adding subcategory');
  }
};

// Action to update a category
export const updateCategory = (categoryId , formData) => async (dispatch) => {
  try {
    const config = getAuthConfig();

    await axios.put(
      `${import.meta.env.VITE_APP}/api/v1/category/${categoryId}`,
      {
        name: formData.name,
      },
      config
    );

    dispatch(getAllCategories());
    toast.success('Category updated successfully!');
  } catch (error) {
    dispatch({
      type: CATEGORY_ERROR,
      payload: error.response?.data?.message || 'Error updating category',
    });

    toast.error(error.response?.data?.message || 'Error updating category');
  }
};

// Action to update a subcategory
export const updateSubCategory = (categoryId, subCategoryData) => async (dispatch) => {
  try {
    const config = getAuthConfig();

    await axios.put(
      `${import.meta.env.VITE_APP}/api/v1/category/${categoryId}/subcategory/${subCategoryData.id}`, 
      {
        name: subCategoryData.name,
        description: subCategoryData.description,
      },
      config
    );

    dispatch(getAllCategories());
    toast.success('Subcategory updated successfully!');
  } catch (error) {
    dispatch({
      type: CATEGORY_ERROR,
      payload: error.response?.data?.message || 'Error updating subcategory',
    });

    toast.error(error.response?.data?.message || 'Error updating subcategory');
  }
};



// Redux action to fetch category by categoryId
export const getCategoryById = (categoryIds) => async (dispatch) => {
  try {
    dispatch({ type: CATEGORY_LIST_REQUEST });

    // Send category IDs to the backend
    const { data } = await axios.post(`${import.meta.env.VITE_APP}/api/v1/categories`, { categoryIds });
    dispatch({
      type: CATEGORY_LIST_SUCCESS,
      payload: data.categories, 
    });
  } catch (error) {
    dispatch({
      type: CATEGORY_LIST_FAIL,
      payload: error.response && error.response.data.message
        ? error.response.data.message
        : error.message,
    });
  }
};
