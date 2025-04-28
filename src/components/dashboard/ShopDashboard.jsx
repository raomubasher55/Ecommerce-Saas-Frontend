import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

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
import Withdraw from "./shop/Withdraw";
import PaymentDetails from "./shop/PaymentDetails";
import BlacklistProducts from "./shop/BlacklistProducts";
import { fetchStore } from "../../store/actions/storeActions";
import Loader from "../../utils/Loader";

const ShopDashboard = () => {
  const [activeComponent, setActiveComponent] = useState("Dashboard");
  const { store } = useSelector(state => state.store);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!store || Object.keys(store).length === 0) {
      // Agar store ka data missing hai to fetch karo
      dispatch(fetchStore());
      return;
    }

    // Jab tak documents nahi aate, kuch mat karo
    if (!store.documents) {
      return;
    }

    // Ab safe check kar sakte hain
    if (store.documents.length === 0) {
      toast.info("Please upload your documents to continue");
      navigate("/upload-documents");
      return;
    }

    const docStatus = store.documents[0]?.status;

    if (docStatus === "pending") {
      toast.info("Please wait for admin approval of your documents.");
      navigate("/waiting-for-approval");
      return;
    }

    if (docStatus === "rejected") {
      toast.info("Your documents are rejected. Please upload your documents again.");
      navigate("/upload-documents");
      return;
    }

    if (store.status === "suspended") {
      toast.info("Please contact Admin");
      navigate("/suspend");
      return;
    }

    if (store.package?.expiresAt && new Date(store.package.expiresAt) < new Date()) {
      toast.info("Please confirm your payment to continue");
      navigate("/upload-documents/choose-plans");
      return;
    }

    // ✅ Sab kuch theek hai, loading hatao
    setLoading(false);

  }, [store, navigate, dispatch]);
  
  
  

  const renderContent = () => {
    switch (activeComponent) {
      case "Dashboard":
        return <Overview />;
      case "Products":
        return <ProductCard />;
      case "Categories":
        return <Categories />;
      case "Orders":
        return <CostumerOrders />;
      case "Customers":
        return <Customers />;
      case "Analytics":
        return <Analytics />;
      case "Ads Data":
        return <DiscountsAndPromotions />;
      case "Messages":
        return <Messages />;
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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div><Loader/></div> 
      </div>
    );
  }

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
