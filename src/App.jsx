import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import 'leaflet/dist/leaflet.css';
import HomePage from "./pages/HomePage";
import UserDashboard from "./components/dashboard/UserDashboard";
import AdminDashboard from "./components/dashboard/AdminDashboard";
import ShopDashboard from "./components/dashboard/ShopDashboard";
import SingleProduct from "./pages/SingleProduct";
import UserRegister from "./pages/UserRegister";
import HelpCenter from "./components/Footers/HelpCenter";
import ContactUs from "./components/Footers/ContactUs";
import UserLogin from "./pages/UserLogin";
import RegisterStore from "./pages/RegisterStore";
import { ToastContainer } from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css'; 
import Forgetpassword from "./pages/Forgetpassword";
import PriceRangeFilterProducts from "./pages/PriceRangeFilterProducts";
import StoreLogin from "./pages/StoreLogin";
import UploadDocuments from "./pages/UploadDocuments";
import PackageSubscription from "./pages/PackageSubscription";
import AddtoCart from "./components/cart/AddtoCart";
import { SearchProvider } from './context/SearchContext';
import SearchResults from "./components/search/SearchResults";
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import PaymentSuccess from "./pages/PaymentSuccess";
import PaymentFailure from "./pages/paymentFailure";
import ResetPassword from './pages/ResetPassword';
import DealAndOffers from "./pages/DealAndOffers";
import Shipping from "./components/Footers/Shipping";
import ReturnPolicy from "./components/Footers/ReturnPolicy";
import AboutPlatform from "./components/Footers/AboutPlatform";
import TermConditions from "./components/Footers/TermConditions";
import PrivacyNotice from "./components/Footers/PrivacyNotice";
import SellonPlatform from "./components/Footers/SellonPlatform";
import StoreDetails from "./components/store/StoreDetails";
import StoreChatWindow from "./components/chat/StoreChatWindow";
import StoreFullChatWindow from "./components/chat/StoreFullChatWindow";
import UserChatWindow from "./components/chat/UserChatWindow";
import AdminStoreChatWindow from "./components/chat/AdminStoreChatWindow";
import StoreAdminChatWindow from "./components/chat/StoreAdminChatWindow";
import PaymentResult from "./pages/PaymentResult";
import PackageResult from "./pages/PackageResult";
import WatingForAp from "./pages/WatingForAp";
import StoreWiseProducts from "./pages/StoreWiseProducts";
import CategoryWiseProducts from "./pages/CategoryWiseProducts";
import VerifyEmail from "./pages/VerifyEmail";
import StoreEmailVerification from "./pages/StoreEmailVerification";
import { useEffect } from "react";
import { LanguageProvider } from "./context/LanguageContext";
import SuspendedStore from "./pages/SuspendedStore";

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

export default function App() {
  const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

  return (
      <SearchProvider>
        <LanguageProvider>
          <Elements stripe={stripePromise}>
            <ToastContainer />
            <ScrollToTop />
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/userdashboard/:pageName" element={<UserDashboard />} />
              <Route path="/admindashboard/:pageName" element={<AdminDashboard />} />
              <Route path="/shopdashboard" element={<ShopDashboard />} />
              <Route path="/single-product/:id" element={<SingleProduct />} />
              <Route path="/register" element={<UserRegister />} />
              <Route path="/login" element={<UserLogin />} />
              <Route path="/password/forgot" element={<Forgetpassword />} />
              <Route path="/register-store" element={<RegisterStore />} />
              <Route path="/login-store" element={<StoreLogin />} />
              <Route path="/upload-documents" element={<UploadDocuments />} />
              <Route path="/upload-documents/choose-plans" element={<PackageSubscription />} />
              <Route path="/search" element={<SearchResults />} />
              <Route path="/priceRange/products/:id" element={<PriceRangeFilterProducts />} />
              <Route path="/AddToCart/:id" element={<AddtoCart />} />
              <Route path="/success" element={<PaymentResult />} />
              <Route path="/cancel" element={<PaymentResult />} />
              <Route path="/package/success" element={<PackageResult />} />
              <Route path="/package/failed" element={<PackageResult />} />
              <Route path="/order/success/:orderNumber" element={<PaymentSuccess />} />
              <Route path="/order/failed/:orderNumber" element={<PaymentFailure />} />
              <Route path="/api/v1/password/reset/:token" element={<ResetPassword />} />
              <Route path="/cebelu/deals" element={<DealAndOffers />} />
              <Route path="/help-center" element={<HelpCenter />} />
              <Route path="/contact-us" element={<ContactUs />} />
              <Route path="/shipping-and-delivery" element={<Shipping />} />
              <Route path="/return-policy" element={<ReturnPolicy />} />
              <Route path="/about-us" element={<AboutPlatform />} />
              <Route path="/terms-and-conditions" element={<TermConditions />} />
              <Route path="/privacy-notice" element={<PrivacyNotice />} />
              <Route path="/sell-on-cebleu" element={<SellonPlatform />} />
              <Route path="/waiting-for-approval" element={<WatingForAp />} />
              <Route path="/store/:id" element={<StoreDetails />} />
              <Route path="/chat/store/:chatId" element={<StoreChatWindow />} />
              <Route path="/chat/store/full/:chatId" element={<StoreFullChatWindow />} />
              <Route path="/chat/user/:id" element={<UserChatWindow />} />
              <Route path="/chat/admin-store/:chatId" element={<AdminStoreChatWindow />} />
              <Route path="/chat/store-admin/:chatId" element={<StoreAdminChatWindow />} />
              <Route path="/store/products/:id" element={<StoreWiseProducts />} />
              <Route path="/products/:category/:id" element={<CategoryWiseProducts />} />
              <Route path='/verify/:token' element={<VerifyEmail />} />
              <Route path="/verify-email/:token" element={<StoreEmailVerification />} />
              <Route path="/suspend" element={<SuspendedStore />} />
              
            </Routes>
          </Elements>
        </LanguageProvider>
      </SearchProvider>
  );
}