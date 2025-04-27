import { useState, useEffect, useContext } from "react";
import {
  FaRegUser,
  FaEnvelope,
  FaPhoneAlt,
  FaRegListAlt,
  FaHeart,
  FaCog,
  FaSignOutAlt,
  FaUserCircle,
} from "react-icons/fa";
import { Link, Navigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import axios from "axios";
import { updateUserProfile } from "../../../store/actions/userActions";
import UserContext from "../../context/UserContext";

export default function Profile() {
  const dispatch = useDispatch();
  const [isModalOpen, setModalOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [userForm, setUserForm] = useState({
    name: "",
    email: "",
    phone: "",
    image: null,
  });

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [updateTrigger, setUpdateTrigger] = useState(false); // State to re-fetch data on update
  const { logout } = useContext(UserContext);

  const handleLogout = () => {
    logout();
    setModalOpen(!isModalOpen)
    Navigate("/");
  };
  const fetchUserData = async () => {
    const token = localStorage.getItem('token')
    try {
      const response = await axios.get(`${import.meta.env.VITE_APP}/api/v1/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.status === 200 && response.data.message === "Profile fetched successfully") {
        setUser(response.data.user);
        localStorage.setItem("user", JSON.stringify(response.data.user));
      } else {
        throw new Error(response.data.message || "User data not available");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  useEffect(() => {
    if (updateTrigger) {
      fetchUserData();
      setUpdateTrigger(false); 
    }
  }, [updateTrigger]);

  useEffect(() => {
    if (user) {
      setUserForm({
        name: user.name || "",
        email: user.email || "",
        phone: user.mobile || "",
        image: user?.avatar?.url
          ? `${import.meta.env.VITE_APP}${user.avatar.url.replace(/\\/g, "/")}`
          : "https://via.placeholder.com/150",
      });
    }
  }, [user]);

  // Handle input changes
  const handleInputChange = (e) => {
    setUserForm({
      ...userForm,
      [e.target.name]: e.target.value,
    });
  };

  // Handle image selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUserForm((prevForm) => ({
        ...prevForm,
        image: file,
      }));
    }
  };

  // Handle form submission
  const handleSave = () => {
    const formData = new FormData();
    formData.append("name", userForm.name);
    formData.append("email", userForm.email);
    formData.append("phone", userForm.phone);

    if (userForm.image instanceof File) {
      formData.append("image", userForm.image);
    }

    dispatch(updateUserProfile(formData));
    fetchUserData();
    setUpdateTrigger(true);
    setIsEditModalOpen(false);
  };

  return (
    <div className="flex flex-col lg:flex-row bg-gray-100 min-h-screen">
      <div className="w-full max-w-7xl mx-auto py-6 px-4 md:px-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="w-full lg:w-1/3 bg-white rounded-lg shadow-lg p-6 flex flex-col items-center">
            <div className="w-28 h-28 rounded-full border-4 border-[#4222C4] overflow-hidden flex items-center justify-center">
              {user?.avatar?.url ? (
                <img
                  src={
                    userForm.image instanceof File
                      ? URL.createObjectURL(userForm.image)
                      : userForm.image
                  }
                  alt="User Avatar"
                  className="w-full h-full object-cover m-0"
                />
              ) : (
                <FaUserCircle className="w-20 h-20 text-gray-400" />
              )}
            </div>
            <div className="text-center mt-4">
              <h2 className="text-xl font-semibold text-[#4222C4]">
                {userForm.name}
              </h2>
              <p className="text-sm text-gray-600">{userForm.email}</p>
            </div>

            {/* Profile Details */}
            <div className="mt-6 space-y-4 w-full">
              <div className="flex items-center space-x-3">
                <FaRegUser className="text-[#4222C4]" />
                <p className="text-gray-700">{userForm.name}</p>
              </div>
              <div className="flex items-center space-x-3">
                <FaEnvelope className="text-[#4222C4]" />
                <p className="text-gray-700">{userForm.email}</p>
              </div>
              <div className="flex items-center space-x-3">
                <FaPhoneAlt className="text-[#4222C4]" />
                <p className="text-gray-700">{userForm.phone}</p>
              </div>
            </div>
            <button
              onClick={() => setIsEditModalOpen(true)}
              className="mt-6 w-full py-2 bg-[#4222C4] text-white rounded-lg hover:bg-[#3C8D5A] transition"
            >
              Edit Profile
            </button>
          </div>

          <div className="w-full lg:w-2/3 bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-semibold text-[#4222C4] mb-4">
              Account Settings
            </h3>
            <div className="space-y-6">
              <div>
                <h4 className="text-lg font-semibold text-gray-700 mb-2">
                  Order History
                </h4>
                <Link
                  to="/userdashboard/orders"
                  className="flex items-center space-x-2 text-[#4222C4] hover:text-[#3C8D5A]"
                >
                  <FaRegListAlt />
                  <span>View Orders</span>
                </Link>
              </div>
              <div>
                <h4 className="text-lg font-semibold text-gray-700 mb-2">
                  Wishlist
                </h4>
                <Link
                  to="/userdashboard/wishlist"
                  className="flex items-center space-x-2 text-[#4222C4] hover:text-[#3C8D5A]"
                >
                  <FaHeart />
                  <span>View Wishlist</span>
                </Link>
              </div>
              <div>
                <h4 className="text-lg font-semibold text-gray-700 mb-2">
                  Settings
                </h4>
                <Link
                  to="/password/forgot"
                  className="flex items-center space-x-2 text-[#4222C4] hover:text-[#3C8D5A]"
                >
                  <FaCog />
                  <span>Change Password</span>
                </Link>
              </div>
              <button onClick={() => setModalOpen(true)} className="w-full mt-4 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition flex items-center justify-center">
                <FaSignOutAlt className="mr-2" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 px-4">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Update Profile
            </h3>
            <form className="space-y-4">
              <input
                name="name"
                type="text"
                value={userForm.name}
                onChange={handleInputChange}
                placeholder="Name"
                className="w-full p-2 border border-gray-300 rounded-md"
              />
              <input
                name="email"
                type="email"
                value={userForm.email}
                onChange={handleInputChange}
                placeholder="Email"
                className="w-full p-2 border border-gray-300 rounded-md"
              />
              <input
                name="phone"
                type="tel"
                value={userForm.phone}
                onChange={handleInputChange}
                placeholder="Phone"
                className="w-full p-2 border border-gray-300 rounded-md"
              />
              <input type="file" accept="image/*" onChange={handleImageChange} />

                <div className="flex justify-between w-full">

                <button
                type="button"
                onClick={handleSave}
                className="py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                Save
              </button>
              <button
              onClick={()=> setIsEditModalOpen(false)}
                className="py-2 px-4 bg-red-500 text-white rounded-md hover:bg-red-600">
                 Cancel
              </button>
                </div>
            </form>
          </div>
        </div>
      )}



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
