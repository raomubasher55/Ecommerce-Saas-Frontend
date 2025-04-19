import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Sidebar from "./user/Sidebar";
import Topbar from "./user/Topbar";
import Profile from "./user/Profile";
import UserOrders from "./user/UserOrders";
import Wishlist from "./user/Wishlist";
import UserCart from "./user/UserCart";
import UserChatDashbaord from "../chat/UserChatDashboard";
import UserChats from "../chat/UserChats";

export default function Dashboard() {
  const { pageName } = useParams();
  const navigate = useNavigate();
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [activeComponent, setActiveComponent] = useState("profile");
  const [showModal, setShowModal] = useState(false);
  const [user, setUser] = useState('')

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    setUser(storedUser)
    if (!storedUser || storedUser.role !== "user") {
      setShowModal(true);
    }
  }, []);

  useEffect(() => {
    setActiveComponent(pageName || "profile");
  }, [pageName]);

  const renderContent = () => {
    switch (activeComponent) {
      case "cart":
        return <UserCart />;
      case "profile":
        return <Profile />;
      case "orders":
        return <UserOrders />;
      case "wishlist":
        return <Wishlist />;
      case "chat":
        return <UserChatDashbaord user={user} />;
      case "messages":
        return <UserChats />;
      default:
        return <UserOrders />;
    }
  };

  return (
    <div className="h-screen flex bg-gray-50">
      {showModal ? (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <h2 className="text-xl font-bold text-red-500">Oops! You are not logged in</h2>
            <p className="text-gray-600 mt-2">Please register or login first to access the dashboard.</p>
            <div className="mt-4 flex justify-center gap-4">
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded"
                onClick={() => navigate("/login")}
              >
                Login
              </button>
              <button
                className="bg-gray-500 text-white px-4 py-2 rounded"
                onClick={() => navigate("/")}
              >
                Home
              </button>
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* Sidebar */}
          <Sidebar
            toggleSidebar={() => setSidebarOpen(!isSidebarOpen)}
            isSidebarOpen={isSidebarOpen}
            setActiveComponent={setActiveComponent}
            activeComponent={activeComponent}
          />

          {/* Main Section */}
          <div className="flex-1 flex flex-col">
            {/* Top Navbar */}
            <Topbar />

            <main className="flex-1 bg-gray-100 overflow-auto">{renderContent()}</main>
          </div>
        </>
      )}
    </div>
  );
}
