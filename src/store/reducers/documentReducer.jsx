import { UPLOAD_DOCUMENT_FAIL, UPLOAD_DOCUMENT_REQUEST, UPLOAD_DOCUMENT_SUCCESS } from "../constants/StoreConstants";

// documentReducer.jsx
const initialState = {
    documents: [],
    loading: false,
    error: null,
    success: false,
    documentData: null,
  };
  
  export const documentReducer = (state = initialState, action) => {
    switch (action.type) {
      case "DOCUMENTS_REQUEST":
        return { ...state, loading: true };
      case "DOCUMENTS_SUCCESS":
        return { ...state, loading: false, documents: action.payload };
      case "DOCUMENTS_FAILURE":
        return { ...state, loading: false, error: action.payload };
      case "DOCUMENT_APPROVED":
        return {
          ...state,
          documents: state.documents.map((doc) =>
            doc._id === action.payload ? { ...doc, status: "approved" } : doc
          ),
        };
      case "DOCUMENT_REJECTED":
        return {
          ...state,
          documents: state.documents.map((doc) =>
            doc._id === action.payload ? { ...doc, status: "rejected" } : doc
          ),
        };
      default:
        return state;
    }
  };
  
  

  // reducers/uploadDocumentReducer.js

export const uploadDocumentReducer = (state = initialState, action) => {
  switch (action.type) {
    case UPLOAD_DOCUMENT_REQUEST:
      return { ...state, loading: true };
    case UPLOAD_DOCUMENT_SUCCESS:
      return { ...state, loading: false, success: true, documentData: action.payload };
    case UPLOAD_DOCUMENT_FAIL:
      return { ...state, loading: false, success: false, error: action.payload };
    default:
      return state;
  }
};
