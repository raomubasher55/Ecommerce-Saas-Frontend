import { useEffect, useState } from "react";
import Sidebar from "./admin/Sidebar";
import Topbar from "./admin/Topbar";
import DashboardOverview from './admin/DashboardOverview'
import UserManagement from './admin/UserManagement'
import ShopManagement from './admin/ShopManagement';
import ProductManagement from './admin/ProductManagement';
import OrdersTransactions from './admin/OrdersTransactions';
import Promotions from './admin/Promotions';
import Packages from "./admin/Packages";
import Messages from "./admin/Messages";
import PaymentRecord from "./admin/PaymentRecord";
import PaymentApprove from "./admin/PaymentApprove";
import { useParams } from "react-router-dom";
import BlacklistProducts from "./admin/BlacklistProducts";
import CustomerSupport from "./admin/CustomerSupport";
import Info from "./admin/Info";
import StoreStatus from "./admin/StoreStauts";
import Subscription from "./admin/Subscription";

const AdminDashboard = () => {
  const [activeComponent, setActiveComponent] = useState("Dashboard");
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const { pageName } = useParams();
  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

    useEffect(() => {
      setActiveComponent(pageName || "profile");
    }, [pageName]);

  const renderContent = () => {
    switch (activeComponent) {
      case "Dashboard":
        return <DashboardOverview />;
      case "User Management":
        return <UserManagement />;
      case "Shops Management":
        return <ShopManagement />;
      case "Products":
        return <ProductManagement />;
        case "Blacklist Products":
          return <BlacklistProducts />;
      case "Orders & Transactions":
        return <OrdersTransactions />;
      case "Promotions":
        return <Promotions />;
      case "Customer Support":
        return <CustomerSupport />;
      // case "Packages":
      //   return <Packages />;
      case "messages":
        return <Messages />;
      case "Withdrawal Approvals":
        return <PaymentApprove />;
      case "Info":
        return <Info/>
      case "Store Status":
        return <StoreStatus/>
        case "Subscription":
          return <Subscription/>
      default:
        return <DashboardOverview />;
    }
  };

  return (
    <div className="flex h-screen ">
      <Sidebar
        toggleSidebar={toggleSidebar}
        isSidebarOpen={isSidebarOpen}
        setActiveComponent={setActiveComponent}
        activeComponent={activeComponent}
      />
      <div className="flex-1 flex flex-col">
        <Topbar />
        <main className="flex-1 bg-gray-100 h-max overflow-auto">{renderContent()}</main>
      </div>
    </div>
  );
};

export default AdminDashboard;
