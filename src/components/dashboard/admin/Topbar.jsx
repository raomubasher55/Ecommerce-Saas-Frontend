import { useContext, useState } from "react";
import { FaChevronDown, FaUserCircle, FaSignOutAlt, FaUser, FaCog } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import UserContext from "../../context/UserContext";
import logo from "../../../assets/logo.png";
import NotificationBell from "../../notifications/NotificationBell";

export default function Topbar() {
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
    window.location.reload(); // Reload the page after navigating
  };
  

  return (
    <div className="w-full bg-white shadow h-[80px] flex justify-between items-center px-2 sm:px-6 text-gray-800">
      {/* Dashboard Title */}
      <Link to="/" className="text-2xl font-bold text-[#4222C4]">
        <img className="w-24 md:w-28 h-8 md:h-10 m-0 p-0" src={logo} alt="cebelu logo" />
      </Link>

      {/* Search Bar */}
      {/* <div className="hidden md:flex items-center bg-gray-100 text-gray-600 rounded-lg overflow-hidden">
        <input type="text" placeholder="Search..." className="px-4 py-2 w-64 focus:outline-none bg-gray-100" />
        <button className="bg-[#4222C4] hover:bg-[#4222C4] px-4 py-2 text-white">Search</button>
      </div> */}
      <h1 className="text-2xl font-bold text-[#4222C4] hidden md:block">Admin Dashboard</h1>

      {/* Action Buttons */}
      <div className="flex items-center space-x-4 md:space-x-6">
        {/* Notifications - Use the general NotificationBell component */}
        <NotificationBell />

        {/* User Dropdown */}
        <div className="relative">
          <button className="flex items-center space-x-3" onClick={() => setDropdownOpen(!isDropdownOpen)}>
            {user ? (

              <img src={`${import.meta.env.VITE_APP}${user?.avatar?.url}`} alt="User" className="w-10 h-10 rounded-full m-0" />
            ) : (
              <FaUserCircle className="text-3xl text-gray-500" />
            )}
            <span className="hidden sm:block text-[#4222C4] font-bold">
              {user ? user.name.split(" ")[0] : "User"}
            </span>
            <FaChevronDown className="text-lg font-bold text-[#4222C4]" />
          </button>
          {isDropdownOpen && (
            <div className="absolute right-0 z-50 mt-2 w-48 bg-white text-gray-700 rounded-lg shadow-lg">
              {/* <Link to="/profile" className="flex items-center px-4 py-2 hover:bg-gray-50 text-gray-800">
                <FaUser className="mr-2" /> Profile
              </Link>
              <Link to="/settings" className="flex items-center px-4 py-2 hover:bg-gray-50 text-gray-800">
                <FaCog className="mr-2" /> Settings
              </Link> */}
              <button
                className="flex items-center px-4 py-2 w-full text-left border hover:bg-gray-50 text-gray-800"
                onClick={() => setShowLogoutModal(true)}
              >
                <FaSignOutAlt className="mr-2" /> Logout
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg p-6 w-80 text-center shadow-lg">
            <h3 className="text-lg font-semibold">Are you sure you want to logout?</h3>
            <div className="mt-4 flex justify-between">
              <button onClick={() => setShowLogoutModal(false)} className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400">
                Cancel
              </button>
              <button onClick={handleLogout} className="px-4 py-2 rounded bg-red-500 text-white hover:bg-red-600">
                Yes, Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}