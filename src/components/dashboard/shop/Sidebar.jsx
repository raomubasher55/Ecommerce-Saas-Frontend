import { FaBars, FaHome, FaBox, FaClipboardList, FaUsers, FaCog, FaChartPie, FaTag, FaEnvelope, FaCreditCard, FaBan } from "react-icons/fa";

export default function Sidebar({ toggleSidebar, isSidebarOpen, setActiveComponent, activeComponent }) {
  const menuItems = [
    { name: "Dashboard", icon: <FaHome /> },
    { name: "Categories", icon: <FaBox /> },
    { name: "Products", icon: <FaBox /> },
    { name: "Orders", icon: <FaClipboardList /> },
    { name: "Customers", icon: <FaUsers /> },
    { name: "Analytics", icon: <FaChartPie /> },
    { name: "Ads Data", icon: <FaTag /> },
    { name: "Messages", icon: <FaEnvelope /> },
    { name: "Settings", icon: <FaCog /> },
    { name: "Payment Details", icon: <FaCreditCard /> },
    { name: "Blacklist Products", icon: <FaBan /> },
  ];

  return (
    <div
      className={` bg-gray-100 text-gray-800 border overflow-y-scroll ${
        isSidebarOpen ? "w-14 sm:w-64" : "w-12 sm:w-16"
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
          <li
            onClick={() => setActiveComponent("Withdraw")}
            className={`flex items-center px-4 py-3 cursor-pointer hover:bg-[#2d179b6b] transition ${
              activeComponent === "Withdraw" ? "bg-[#4830c09c] text-white" : "text-[#2e179b]"
            }`}
          >
            <span className="text-xl">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
              </svg>
            </span>
            <div className="hidden sm:block">
              {isSidebarOpen && (
                <span className="ml-4 text-sm font-medium">Withdraw Funds</span>
              )}
            </div>
          </li>
        </ul>
      </nav>
    </div>
  );
}
