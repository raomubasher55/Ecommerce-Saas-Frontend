import { 
    ADD_REVIEW_REQUEST, 
    ADD_REVIEW_SUCCESS, 
    ADD_REVIEW_FAIL, 
    CLEAR_ERRORS 
  } from "../constants/reviewConstants";
  
  const initialState = {
    loading: false,
    product: null,
    error: null,
    reviews: [],
  };
  
  export const reviewReducer = (state = initialState, action) => {
    switch (action.type) {
      case ADD_REVIEW_REQUEST:
        return { ...state, loading: true };
  
      case ADD_REVIEW_SUCCESS:
        return { ...state, loading: false, product: action.payload, error: null };
  
      case ADD_REVIEW_FAIL:
        return { ...state, loading: false, error: action.payload };
  
      case CLEAR_ERRORS:
        return { ...state, error: null };
        
        case "REVIEWS_REQUEST":
          return { ...state, loading: true, error: null };
    
        case "REVIEWS_SUCCESS":
          return { ...state, loading: false, reviews: action.payload };
    
        case "REVIEWS_FAIL":
          return { ...state, loading: false, error: action.payload };
  
      default:
        return state;
    }
  };
  