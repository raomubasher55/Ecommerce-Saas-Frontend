import { useContext, useState } from "react";
import { FaBell, FaChevronDown, FaUserCircle } from "react-icons/fa";
import { Link, Navigate, useNavigate } from "react-router-dom";
import UserContext from "../../context/UserContext";
import logo from "../../../assets/logo.png";
import { AiOutlineUser } from "react-icons/ai";
import NotificationBell from "../../notifications/NotificationBell";
export default function Topbar() {
  const navigate = useNavigate()
  const [isNotificationOpen, setNotificationOpen] = useState(false);
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);
  const { user } = useContext(UserContext);



  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
    window.location.reload();
  };

  return (
    <div className="w-full bg-white shadow h-[80px] flex justify-between items-center px-2 sm:px-6 text-gray-800">
      <Link to={'/'} className="text-2xl font-bold text-[#4222C4]">
        <img className="w-24 md:w-28 h-8 md:h-10 m-0 p-0" src={logo} alt="cebelu logo" />
      </Link>

      {/* Search Bar */}
      <h1 className="text-2xl font-bold text-[#4222C4] hidden md:block">User Dashboard</h1>


      {/* Action Buttons */}
      <div className="flex items-center space-x-4 md:space-x-6">
        {/* Notifications */}
        <div className="relative">
          <button
            className="relative"
            onClick={() => setNotificationOpen(!isNotificationOpen)}
          >
            <NotificationBell />
          </button>


        </div>

        {/* User Dropdown */}
        <div className="relative">
          <button
            className="flex items-center space-x-3"
            onClick={() => setDropdownOpen(!isDropdownOpen)}
          >
            {user ? (

              <img src={`${import.meta.env.VITE_APP}${user?.avatar?.url}`} alt="User" className="w-10 h-10 rounded-full m-0" />
            ) : (
              <FaUserCircle className="text-3xl text-gray-500" />
            )}

            {user ?
              <span className="hidden sm:block text-[#4222C4] font-bold">
                {user.name.split(' ')[0]}
              </span>
              :
              <span className="hidden sm:block text-[#4222C4] font-bold">User</span>
            }
            <FaChevronDown className="text-lg font-bold text-[#4222C4]" />
          </button>
          {isDropdownOpen && (
            <div className="absolute right-0 z-50 mt-2 w-48 bg-white text-gray-700 rounded-lg shadow-lg">
              {/* <Link
                to="/userdashboard/profile"
                className="block px-4 py-2 hover:bg-gray-50 text-gray-800"
              >
                Profile
              </Link> */}
              {/* <Link
                to="/settings"
                className="block px-4 py-2 hover:bg-gray-50 text-gray-800"
              >
                Settings
              </Link> */}
              <button
                onClick={() => setModalOpen(true)}
                className="block px-4 py-2 hover:bg-gray-50 text-gray-800"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Modal for Logout Confirmation */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50 px-4">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm sm:max-w-md md:max-w-lg">
            <h2 className="text-lg font-semibold text-center">
              Are you sure you want to logout?
            </h2>
            <div className="flex justify-center sm:justify-end space-x-4 mt-4">
              <button
                onClick={() => setModalOpen(false)}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition"
              >
                No
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
