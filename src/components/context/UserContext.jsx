import axios from "axios";
import { createContext, useState, useEffect } from "react";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshData, setRefreshData] = useState(false);

  const token = localStorage.getItem("token");

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  const fetchUserData = async () => {
    try {
      setLoading(true);
      setError(null); 
  
      const response = await axios.get(`${import.meta.env.VITE_APP}/api/v1/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
  
      if (response.status !== 200) {
        if (response.status === 401) {
          logout();
        }
        throw new Error(response.data.message || "Failed to fetch user data");
      }
  
      if (response.data.message === 'Profile fetched successfully') {
        setUser(response.data.user); 
        
        localStorage.setItem("user", JSON.stringify(response.data.user)); 
      } else {
        throw new Error(response.data.message || "User data not available");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      setError(error.message);
      setUser(null);
    } finally {
      setLoading(false);
      setRefreshData(false); // Reset refresh flag
    }
  };
  

  useEffect(() => {
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    if (refreshData) {
      fetchUserData();
      return;
    }

    const storedUser = localStorage.getItem("user");

    if (storedUser && !refreshData) {
      setUser(JSON.parse(storedUser)); 
      setLoading(false);
    } else {
      fetchUserData(); 
    }

    const interval = setInterval(() => {
      fetchUserData();
    }, 10 * 60 * 1000);

    return () => clearInterval(interval);
  }, [token, refreshData]);

  return (
    <UserContext.Provider
      value={{
        user,
        loading,
        error,
        setUser,
        logout,
        setRefreshData,
        refreshUserData: fetchUserData, 
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;
