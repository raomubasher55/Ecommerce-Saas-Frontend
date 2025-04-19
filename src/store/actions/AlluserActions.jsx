import axios from 'axios';
export const SET_USERS = "SET_USERS";
export const SET_TOTAL_USERS = "SET_TOTAL_USERS";
export const FILTER_USERS = "FILTER_USERS";
export const TOGGLE_BLOCK = "TOGGLE_BLOCK";
export const DELETE_USER = "DELETE_USER";
export const SET_LOADING = "SET_LOADING";
export const SET_ERROR = "SET_ERROR";

// Action to set users
export const setUsers = (users) => ({
  type: SET_USERS,
  payload: users,
});

// Action to set total users count
export const setTotalUsers = (totalUsers) => ({
  type: SET_TOTAL_USERS,
  payload: totalUsers,
});


// Action to filter users
export const filterUsers = (search, role) => ({
  type: FILTER_USERS,
  payload: { search, role },
});

// Action to toggle user block status
export const toggleBlock = (id) => ({
  type: TOGGLE_BLOCK,
  payload: id,
});



// Action to set loading state
export const setLoading = (loading) => ({
  type: SET_LOADING,
  payload: loading,
});

// Action to set error state
export const setError = (error) => ({
  type: SET_ERROR,
  payload: error,
});

// Async action to fetch users
export const fetchUsers = () => async (dispatch) => {
  const token = localStorage.getItem("token");
  const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };

  try {
    dispatch(setLoading(true));
    const response = await axios.get(`${import.meta.env.VITE_APP}/api/v1/admin/users`, config);
    dispatch(setTotalUsers(response.data.totalUsers));
    dispatch(setUsers(response.data.users)); 
    dispatch(setLoading(false));
  } catch (error) {
    dispatch(setError("Error fetching users"));
    dispatch(setLoading(false));
  }
};


export const updateUserRole = (userId, role) => async (dispatch) => {
    try {
        const token = localStorage.getItem("token");
        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }

      const response = await axios.put( `${import.meta.env.VITE_APP}/api/v1/admin/users/${userId}/${role}`, { role } , config);
      dispatch({
        type: 'UPDATE_USER_ROLE',
        payload: response.data, 
      });

      setTimeout(() => {
        dispatch(fetchUsers()); // Fetch updated user data
      }, 500);

    } catch (error) {
      console.error(error);
    }
  };



  export const deleteUser = (userId) => async (dispatch) => {
    try {
      const token = localStorage.getItem("token");
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
  
      await axios.delete(`${import.meta.env.VITE_APP}/api/v1/admin/users/${userId}`, config);
  
      dispatch({
        type: 'DELETE_USER',
        payload: userId,
      });
  
      dispatch(fetchUsers()); 
    } catch (error) {
        const errorMessage = error.response && error.response.data.message
        ? error.response.data.message
        : 'Error deleting user';
      dispatch(setError(errorMessage)); 
      console.error("Error deleting user: ", errorMessage);
    }
  };
  