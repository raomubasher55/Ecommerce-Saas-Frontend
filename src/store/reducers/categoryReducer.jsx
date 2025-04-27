import {
  ADD_CATEGORY, CATEGORY_ERROR, GET_ALL_CATEGORIES,
  CATEGORY_LIST_REQUEST, CATEGORY_LIST_SUCCESS, CATEGORY_LIST_FAIL
} from '../constants/categoryConstants';

const initialState = {
  categories: [],
  error: null,
  loading: false,
  category: {},
};

const categoryReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_ALL_CATEGORIES:
      return {
        ...state,
        categories: action.payload,
      };
    case ADD_CATEGORY:
      return {
        ...state,
        categories: [...state.categories, action.payload], 
      };
    case 'DELETE_CATEGORY':
      return {
        ...state,
        categories: state.categories.filter(
          (category) => category._id !== action.payload
        ),
      };
    case CATEGORY_ERROR:
      return {
        ...state,
        error: action.payload,
      };
    case CATEGORY_LIST_REQUEST:
      return { ...state, loading: true };
      case CATEGORY_LIST_SUCCESS:
        return { loading: false, categories: action.payload }; 
    case CATEGORY_LIST_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export default categoryReducer;
