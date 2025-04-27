import axios from "axios";

// Action to fetch documents
export const fetchPendingDocuments = () => async (dispatch) => {
  try {
    dispatch({ type: "DOCUMENTS_REQUEST" });
    const token = localStorage.getItem("token");
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    const { data } = await axios.get(
      `${import.meta.env.VITE_APP}/api/v1/pending-doc`, 
      config
    );
    dispatch({ type: "DOCUMENTS_SUCCESS", payload: data.documents}); 
  } catch (error) {
    dispatch({
      type: "DOCUMENTS_FAILURE",
      payload: error.response?.data?.message || "Error fetching documents",
    });
  }
};

// Action to approve document
export const approveDocument = (documentId, storeId) => async (dispatch) => {
    try {
      const token = localStorage.getItem("token");
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
  
      const { data } = await axios.put(
        `${import.meta.env.VITE_APP}/api/v1/store/${storeId}/document/${documentId}/approve`,
        {},
        config
      );
      dispatch({ type: "DOCUMENT_APPROVED", payload: documentId });
  
      dispatch(fetchPendingDocuments());
  
    } catch (error) {
      console.error("Error approving document:", error);
    }
  };
  
  // Action to reject document
  export const rejectDocument = (documentId, storeId) => async (dispatch) => {
    try {
      const token = localStorage.getItem("token");
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
  
      const { data } = await axios.put(
        `${import.meta.env.VITE_APP}/api/v1/store/${storeId}/document/${documentId}/reject`,
        {},
        config
      );
  
      // Dispatch action for document rejection
      dispatch({ type: "DOCUMENT_REJECTED", payload: documentId });
  
      // After rejection, fetch the updated documents
      dispatch(fetchPendingDocuments()); // Re-fetch the documents after rejection
  
    } catch (error) {
      console.error("Error rejecting document:", error);
    }
  };
  

  