import {
  ADD_PRODUCT_REQUEST,
  ADD_PRODUCT_SUCCESS,
  ADD_PRODUCT_FAIL,
  ALL_PRODUCTS_REQUEST,
  ALL_PRODUCTS_SUCCESS,
  ALL_PRODUCTS_FAIL,
  STORE_PRODUCTS_REQUEST,
  STORE_PRODUCTS_SUCCESS,
  STORE_PRODUCTS_FAIL,
  UPDATE_PRODUCT_REQUEST,
  UPDATE_PRODUCT_SUCCESS,
  UPDATE_PRODUCT_FAIL,
  GET_SINGLE_PRODUCT_REQUEST,
  GET_SINGLE_PRODUCT_SUCCESS,
  GET_SINGLE_PRODUCT_FAIL,
  FETCH_PRODUCTS_REQUEST,
  FETCH_PRODUCTS_SUCCESS,
  FETCH_PRODUCTS_FAILURE,
  PRODUCTS_LOADING,
  PRODUCTS_ERROR,
  GET_PRODUCTS_BY_CATEGORY
} from "../constants/productConstants";


const initialState = {
  products: [],
  product: null,
  loading: false,
  error: null,
};


// Reducer for adding a product
export const addProductReducer = (state = {}, action) => {
  switch (action.type) {
    case ADD_PRODUCT_REQUEST:
      return { loading: true };
    case ADD_PRODUCT_SUCCESS:
      return { loading: false, success: true, product: action.payload };
    case ADD_PRODUCT_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

// Reducer for handling all products
export const allProductsReducer = (state = { products: [] }, action) => {
  switch (action.type) {
    case ALL_PRODUCTS_REQUEST:
      return { loading: true, products: [] };
    case ALL_PRODUCTS_SUCCESS:
      return {
        loading: false,
        products: action.payload.products,
        productsCount: action.payload.productsCount,
        resPerPage: action.payload.resPerPage,
        filteredProductsCount: action.payload.filteredProductsCount,
      };
    case ALL_PRODUCTS_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

// Reducer for handling store products separately
// export const storeProductsReducer = (state = { stores: [] }, action) => {
//   switch (action.type) {
//     case STORE_PRODUCTS_REQUEST:
//       return { loading: true, stores: [] };
//     case STORE_PRODUCTS_SUCCESS:
//       return {
//         loading: false,
//         stores: action.payload.products.products,  
//         totalStores: action.payload.products.productsCount,
//         resPerPage: action.payload.products.resPerPage,
//         filteredProductsCount: action.payload.products.filteredProductsCount,
//       };
//     case STORE_PRODUCTS_FAIL:
//       return { loading: false, error: action.payload };
//     default:
//       return state;
//   }
// };


export const storeProductsReducer = (state = { stores: [] }, action) => {
  switch (action.type) {
    case STORE_PRODUCTS_REQUEST:
      return { loading: true, stores: [] };
    case STORE_PRODUCTS_SUCCESS:
      return {
        loading: false,
        stores: action.payload.products,  
        totalStores: action.payload.productsCount,  
        resPerPage: action.payload.resPerPage,  
        filteredProductsCount: action.payload.filteredProductsCount,
      };
    case STORE_PRODUCTS_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};


// update product by id 

export const updateProductReducer = (state = {}, action) => {
  switch (action.type) {
    case UPDATE_PRODUCT_REQUEST:
      return { loading: true };

    case UPDATE_PRODUCT_SUCCESS:
      return { loading: false, success: true, product: action.payload.product };

    case UPDATE_PRODUCT_FAIL:
      return { loading: false, error: action.payload };

    default:
      return state;
  }
};


// delete product 

const productDeleteReducer = (state = initialState, action) => {
  switch (action.type) {
      case 'DELETE_PRODUCT':
          return {
              ...state,
              products: state.products.filter(
                  (product) => product.id !== action.payload
              ),
          };
      default:
          return state;
  }
};

export default productDeleteReducer;


export const productReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_SINGLE_PRODUCT_REQUEST:
      return { ...state, loading: true };

    case GET_SINGLE_PRODUCT_SUCCESS:
      return { ...state, loading: false, product: action.payload };

    case GET_SINGLE_PRODUCT_FAIL:
      return { ...state, loading: false, error: action.payload };
      case FETCH_PRODUCTS_REQUEST:
        return { ...state, loading: true, };
      case FETCH_PRODUCTS_SUCCESS:
        return { ...state, loading: false, products: action.payload, };
      case FETCH_PRODUCTS_FAILURE:
        return { ...state, loading: false, error: action.payload, };
        case PRODUCTS_LOADING:
          return { ...state, loading: true };
        case GET_PRODUCTS_BY_CATEGORY:
          return { ...state, loading: false, products: action.payload };
        case PRODUCTS_ERROR:
          return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};