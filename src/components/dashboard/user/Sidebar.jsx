import {
    FaUser,
    FaShoppingCart,
    FaHeart,
    FaCog,
    FaRegListAlt,
    FaBars,
    FaEnvelope,
  } from "react-icons/fa";
  
  export default function Sidebar({ toggleSidebar, isSidebarOpen , setActiveComponent, activeComponent }) {
    
      const menuItems = [
        { name: "profile", icon: <FaUser /> },
        { name: "orders", icon: <FaRegListAlt /> },
        { name: "wishlist", icon: <FaHeart /> },
        { name: "cart", icon: <FaShoppingCart /> },
        { name: "chat", icon: <FaEnvelope /> },
        // { name: "setting", icon: <FaCog /> },
        // { name: "Analytics", icon: <FaChartPie /> },
        // { name: "Discounts", icon: <FaTag /> },
        { name: "messages", icon: <FaEnvelope /> },
        // { name: "Settings", icon: <FaCog /> },
      ];

    return (
      <div
      className={`bg-gray-100 text-gray-800 border ${
        isSidebarOpen ? "w-12 sm:w-64" : "w-12"
      } flex flex-col transition-all duration-300`}
    >
      {/* Sidebar Header */}
      <div className="w-full flex justify-between items-center px-4 py-5">
        <h1
          className={`text-2xl font-bold text-[#4222C4] transition-opacity duration-300 ${
            isSidebarOpen ? "hidden sm:flex" : "hidden"
          }`}
        >
          Dashboard
        </h1>
        <button
          onClick={toggleSidebar}
          className="text-gray-600 text-xl hover:text-[#4222C4]"
        >
          <FaBars className="mt-0 sm:mt-3 text-[#4222C4]" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 w-full">
        <ul className="space-y-4 mt-4">
          {menuItems.map((item) => (
            <li
              key={item.name}
              onClick={() => setActiveComponent(item.name)}
              className={`flex items-center px-4 py-3 cursor-pointer hover:bg-[#2d179b6b] transition ${
                activeComponent === item.name ? "bg-[#4830c09c] text-white" : "text-[#2e179b]"
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              <div className="hidden sm:block">
              {isSidebarOpen && (
                <span className="ml-4 text-sm font-medium">{item.name}</span>
              )}
              </div>
            </li>
          ))}
        </ul>
      </nav>
    </div>
    );
  }
  