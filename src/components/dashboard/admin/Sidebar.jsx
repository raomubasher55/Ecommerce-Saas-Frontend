import {
    FaBars, FaHome, FaUsers, FaStore, FaBox, FaTag, FaMoneyBillAlt,
    FaChartPie, FaCog, FaBullhorn, FaHandshake,
    FaComments,
  } from "react-icons/fa";
  
  export default function Sidebar({ toggleSidebar, isSidebarOpen, setActiveComponent, activeComponent }) {
    const menuItems = [
      { name: "Dashboard", icon: <FaHome /> },
      { name: "User Management", icon: <FaUsers /> },
      { name: "Shops Management", icon: <FaStore /> },
      { name: "Products", icon: <FaBox /> },
      { name: "Blacklist Products", icon: <FaBox /> },
      { name: "Orders & Transactions", icon: <FaMoneyBillAlt /> },
      { name: "Promotions", icon: <FaBullhorn /> },
      { name: "Customer Support", icon: <FaHandshake /> },
      { name: "Packages", icon: <FaChartPie /> },
      { name: "messages", icon: <FaComments /> },
      { name: "Withdrawal Approvals", icon: <FaMoneyBillAlt /> },
    ];
  
    return (
      <div
        className={`bg-gray-100 text-gray-800 border ${
          isSidebarOpen ? "w-16 sm:w-64" : "w-16"
        } flex flex-col transition-all duration-300`}
      >
        <div className="w-full flex justify-between items-center px-4 py-5">
          <h1
            className={`text-2xl font-bold text-[#4222C4] transition-opacity duration-300 ${
              isSidebarOpen ? "hidden sm:flex" : "hidden"
            }`}
          >
            Admin Panel
          </h1>
          <button
            onClick={toggleSidebar}
            className="text-gray-600 text-xl hover:text-[#4222C4]"
          >
            <FaBars />
          </button>
        </div>
  
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
                {isSidebarOpen && (
                  <span className="ml-4 text-sm font-medium hidden sm:block">{item.name}</span>
                )}
              </li>
            ))}
          </ul>
        </nav>
      </div>
    );
  }
  