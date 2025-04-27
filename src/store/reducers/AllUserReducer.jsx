import { SET_USERS, FILTER_USERS, TOGGLE_BLOCK, DELETE_USER, SET_LOADING, SET_ERROR , SET_TOTAL_USERS } from '../actions/AlluserActions';

const initialState = {
  users: [],
  totalUsers: 0,
  filteredUsers: [],
  search: '',
  role: 'All',
  loading: false,
  error: '',
};

const AllUserReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_USERS:
      return { ...state, users: action.payload, filteredUsers: action.payload };
      case SET_TOTAL_USERS:
        return {
          ...state,
          totalUsers: action.payload,
        };        
    case FILTER_USERS:
      const { search, role } = action.payload;
      const filteredUsers = state.users.filter(
        (user) =>
          (user.name.toLowerCase().includes(search.toLowerCase()) ||
            user.email.toLowerCase().includes(search.toLowerCase())) &&
          (role === 'All' || user.role === role)
      );
      return { ...state, filteredUsers, search, role };

    case TOGGLE_BLOCK:
      const updatedUsers = state.users.map((user) =>
        user._id === action.payload
          ? { ...user, isBlocked: !user.isBlocked, status: user.isBlocked ? 'Active' : 'Inactive' }
          : user
      );
      return { ...state, users: updatedUsers, filteredUsers: updatedUsers };

    case DELETE_USER:
      const remainingUsers = state.users.filter((user) => user._id !== action.payload); 
      return { ...state, users: remainingUsers, filteredUsers: remainingUsers };

    case SET_LOADING:
      return { ...state, loading: action.payload };

    case SET_ERROR:
      return { ...state, error: action.payload };

    default:
      return state;
  }
};

export default AllUserReducer;
