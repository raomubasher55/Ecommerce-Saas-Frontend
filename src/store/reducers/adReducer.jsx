import {
  GET_ACTIVE_ADS_REQUEST,
  GET_ACTIVE_ADS_SUCCESS,
  GET_ACTIVE_ADS_FAILURE,
  FETCH_ADS_SUCCESS,
  FETCH_AD_BY_ID_SUCCESS,
  FETCH_ADS_FAILURE,
  CREATE_AD_REQUEST,
  CREATE_AD_SUCCESS,
  CREATE_AD_FAIL,
  UPDATE_AD_REQUEST,
  UPDATE_AD_SUCCESS,
  UPDATE_AD_FAIL,
  FETCH_UNCONFIRMED_ADS_REQUEST,
  FETCH_UNCONFIRMED_ADS_SUCCESS,
  FETCH_UNCONFIRMED_ADS_FAILURE,
} from '../constants/AdsConstants';

const initialState = {
  ad: null,
  ads: [],
  loading: false,
  error: null,
};

const adReducer = (state = initialState, action) => {
  switch (action.type) {
    case CREATE_AD_REQUEST:
    case GET_ACTIVE_ADS_REQUEST:
    case UPDATE_AD_REQUEST:
      return { ...state, loading: true };

    case CREATE_AD_SUCCESS:
      return { ...state, loading: false, ad: action.payload };

    case GET_ACTIVE_ADS_SUCCESS:
      return { ...state, loading: false, ads: action.payload, error: null };

    case UPDATE_AD_SUCCESS:
      return {
        ...state,
        loading: false,
        ads: state.ads.map((ad) =>
          ad.id === action.payload.id ? action.payload : ad
        ),
      };

    case CREATE_AD_FAIL:
    case GET_ACTIVE_ADS_FAILURE:
    case UPDATE_AD_FAIL:
      return { ...state, loading: false, error: action.payload };

    case FETCH_ADS_SUCCESS:
      return { ...state, loading: false, ads: action.payload, error: null };

    case FETCH_AD_BY_ID_SUCCESS:
      return { ...state, loading: false, ad: action.payload, error: null };

    case FETCH_ADS_FAILURE:
      return { ...state, loading: false, ads: [], ad: null, error: action.payload };

      case FETCH_UNCONFIRMED_ADS_REQUEST:
        return { ...state, loading: true };
  
      case FETCH_UNCONFIRMED_ADS_SUCCESS:
        return { ...state, loading: false, ads: action.payload };
  
      case FETCH_UNCONFIRMED_ADS_FAILURE:
        return { ...state, loading: false, error: action.payload };
        
    default:
      return state;
  }
};

export default adReducer;
