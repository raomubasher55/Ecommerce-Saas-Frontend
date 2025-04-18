import { useState, useEffect } from "react";
import Sidebar from "./shop/Sidebar";
import Topbar from "./shop/Topbar";
import Overview from "./shop/Overview";
import ProductCard from "./shop/ProductCard";
import { CostumerOrders } from "./shop/CostumerOrders";
import { Customers } from "./shop/Customers";
import { Analytics } from "./shop/Analytics";
import DiscountsAndPromotions from "./shop/DiscountsAndPromotions";
import Messages from "./shop/Messages";
import Settings from "./shop/Settings";
import Categories from "./shop/Categories";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Withdraw from "./shop/Withdraw";
import PaymentDetails from "./shop/PaymentDetails";
import BlacklistProducts from "./shop/BlacklistProducts";
const ShopDashboard = () => {
  const [activeComponent, setActiveComponent] = useState("Dashboard");
  const {store} = useSelector(state => state.store);
  const navigate = useNavigate();

  useEffect(() => {
    if (!store) {
      navigate("/register-store");
    }
    if (store && store?.documents && store.documents[0]?.status === "pending") {
      toast.info("Please upload your documents to continue");
      
      navigate("/waiting-for-approval");
    }
    if (store && store?.package && new Date(store?.package.expiresAt) < new Date()) {
      toast.info("Please confirm your payment to continue");
      navigate("/upload-documents/choose-plans");
    }

    if(store && store?.status == "suspended"){
      toast.info("Please contact to Admin");
      navigate('/suspend');
    }
  }, [store, navigate]);
  const renderContent = () => {
    switch (activeComponent) {
      case "Dashboard":
        return <Overview />;
      case "Products":
        return <ProductCard /> ;
        case "Categories":
          return <Categories /> ;
      case "Orders":
        return <CostumerOrders />;
      case "Customers":
        return <Customers /> ;
      case "Analytics":
        return  <Analytics /> ;
      case "Ads Data":
        return <DiscountsAndPromotions />;
      case "Messages":
        return <Messages /> ;
      case "Settings":
        return <Settings />;
      case "Withdraw":
        return <Withdraw />;
      case "Payment Details":
        return <PaymentDetails />;
      case "Blacklist Products":
        return <BlacklistProducts />;
      default:
        return <Overview />;
    }
  }


    const [isSidebarOpen, setSidebarOpen] = useState(true);
    const toggleSidebar = () => {
      setSidebarOpen(!isSidebarOpen);
    };

    return (
      <div className="flex overflow-y-scroll h-screen"> 
        {/* Sidebar */}

        <Sidebar toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} setActiveComponent={setActiveComponent} activeComponent={activeComponent} />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col">
          {/* Top Bar */}
          <Topbar />

          {/* Dynamic Content Area */}
          <main className="flex-1 bg-gray-100 overflow-auto">{renderContent()}</main>
        </div>
      </div>
    );
  };

  export default ShopDashboard;
