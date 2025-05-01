import { IoIosSearch } from "react-icons/io";
import { CgShoppingCart } from "react-icons/cg";
import { FaSignInAlt, FaSignOutAlt, FaStore, FaTachometerAlt, FaUserCircle, FaUserPlus } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useContext, useEffect, useState, useRef } from "react";
import UserContext from "../context/UserContext";
import { useSearch } from "../../context/SearchContext";
import logo from "../../assets/logo 2.png";
import { AiOutlineHeart, AiOutlineClose } from "react-icons/ai";
import NotificationBell from "../notifications/NotificationBell";
import { useLanguage } from "../../context/LanguageContext";

const Navbar = () => {

  const { user } = useContext(UserContext);
  const { searchQuery, setSearchQuery, handleSearch, searchResults } = useSearch();
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const { selectedLanguage, translateText } = useLanguage();
  const navigate = useNavigate();
  const [isSearchOpen, setSearchOpen] = useState(false);
  const [isUserDropdownOpen, setUserDropdownOpen] = useState(false);
  const [storeToken, setStoreToken] = useState(null)
  const [token, setToken] = useState(null)
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [wishlist, setWishlist] = useState(
    JSON.parse(localStorage.getItem("wishlist")) || []
  );

  const [translatedContent, setTranslatedContent] = useState({
    searchPlaceholder: "Search for products, categories, brands...",
    dealsOffers: "Deals & Offers",
    login: "Login",
    register: "Register",
    userDashboard: "User Dashboard",
    adminDashboard: "Admin Dashboard",
    logout: "Logout",
    wishlist: "Wishlist",
    cart: "Cart",
    yourWishlist: "Your Wishlist",
    wishlistEmpty: "Your wishlist is empty",
    price: "Price",
    inStock: "In Stock",
    outOfStock: "Out of Stock",
    total: "Total",
    addToCart: "Add to Cart",
    becomeSeller: "Become a Seller",
    shopDashboard: "Shop Dashboard",
    registerStore: "Register Store",
    loginStore: "Login Store"
  });

  useEffect(() => {
  const translateAll = async () => {
    const translations = await Promise.all([
      translateText("Search for products, categories, brands..."),
      translateText("Deals & Offers"),
      translateText("Login"),
      translateText("Register"),
      translateText("User Dashboard"),
      translateText("Admin Dashboard"),
      translateText("Logout"),
      translateText("Wishlist"),
      translateText("Cart"),
      translateText("Your Wishlist"),
      translateText("Your wishlist is empty"),
      translateText("Price"),
      translateText("In Stock"),
      translateText("Out of Stock"),
      translateText("Total"),
      translateText("Add to Cart"),
      translateText("Become a Seller"),
      translateText("Shop Dashboard"),
      translateText("Register Store"),
      translateText("Login Store")
    ]);

    setTranslatedContent({
      searchPlaceholder: translations[0],
      dealsOffers: translations[1],
      login: translations[2],
      register: translations[3],
      userDashboard: translations[4],
      adminDashboard: translations[5],
      logout: translations[6],
      wishlist: translations[7],
      cart: translations[8],
      yourWishlist: translations[9],
      wishlistEmpty: translations[10],
      price: translations[11],
      inStock: translations[12],
      outOfStock: translations[13],
      total: translations[14],
      addToCart: translations[15],
      becomeSeller: translations[16],
      shopDashboard: translations[17],
      registerStore: translations[18],
      loginStore: translations[19]
    });
  };
  translateAll();
}, [selectedLanguage, translateText]);



  useEffect(() => {
    const fetchWishlist = () => {
      setWishlist(JSON.parse(localStorage.getItem("wishlist")) || []);
    };

    const interval = setInterval(fetchWishlist, 1000);

    return () => clearInterval(interval);
  }, []);

  // Toggle Search Input
  const toggleSearchInput = () => {
    setSearchOpen(!isSearchOpen);
    setUserDropdownOpen(false)
  }

  // Toggle User Dropdown
  const toggleUserDropdown = () => {
    setUserDropdownOpen(!isUserDropdownOpen);
    setSearchOpen(false);
  }

  useEffect(() => {
    const storeToken = localStorage.getItem('storeToken')
    if (storeToken) {
      setStoreToken(storeToken)
    }
    const token = localStorage.getItem('token')
    if (token) {
      setToken(token)
    }
  }, [])

  // Handle click outside search suggestions
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle search input change
  const handleSearchInput = async (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (query.length > 2) {
      await handleSearch(query);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  // Handle search submission
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setShowSuggestions(false);
      navigate(`/search?query=${encodeURIComponent(searchQuery)}`);
    }
  };

  // Navigate to product detail
  const handleProductClick = (productId) => {
    setShowSuggestions(false);
    setSearchQuery('');
    navigate(`/single-product/${productId}`);
  };

  const Logout = () => {
    localStorage.removeItem('storeToken');
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    window.location.reload();
  };


  const handleRemoveFromWishlist = (productId) => {
    const updatedWishlist = wishlist.filter((item) => item._id !== productId);
    localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));
    setWishlist(updatedWishlist);
  };




  return (
    <div className="w-full bg-white shadow-md px-5">
      {/* Navbar */}
      <div className="max-w-screen-xl mx-auto py-4 flex justify-around items-center">
        {/* Logo */}

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="relative flex items-center gap-2 px-4 py-2 hover:underline"
        >
          <FaStore className="text-[#4222C4] text-xl" />
          {storeToken ? translatedContent.shopDashboard : translatedContent.becomeSeller}

          {/* Dropdown Menu */}
          {isOpen && (
            <div className="absolute left-0 z-50 mt-36 w-max bg-white border rounded-md shadow-lg">
              {/* If user is not logged in */}
              {!storeToken && (
                <>
                  <button
                    onClick={() => navigate("/register-store")}
                    className="flex items-center gap-2 w-full px-4 py-2 text-gray-700 hover:bg-gray-100"
                  >
                    <FaUserPlus className="text-[#4222C4]" /> {translatedContent.registerStore}
                  </button>
                  <button
                    onClick={() => navigate("/login-store")}
                    className="flex items-center gap-2 w-full px-4 py-2 text-gray-700 hover:bg-gray-100"
                  >
                    <FaSignInAlt className="text-[#4222C4]" /> {translatedContent.loginStore}
                  </button>
                </>
              )}

              {/* If storeToken exists, show dashboard option */}
              {storeToken && (
                <div>
                  <button
                    className="flex items-center gap-2 w-full px-4 py-2 text-gray-700 hover:bg-gray-100"
                    onClick={() => navigate("/shopdashboard/")}
                  >
                    <FaTachometerAlt className="text-[#4222C4]" /> {translatedContent.shopDashboard}
                  </button>

                  <button
                    onClick={Logout}
                    className="flex items-center gap-2 w-full px-4 py-2 text-gray-700 hover:bg-red-100"
                  >
                    <FaSignOutAlt className="text-red-500" /> {translatedContent.logout}
                  </button>
                </div>
              )}
            </div>
          )}

        </button>





        {/* Search Input (Mobile) */}
        {isSearchOpen && (
          <div className="md:hidden absolute left-0 w-full z-10 bg-white shadow-md px-2 transition-all duration-300 top-28" ref={searchRef}>
            <form onSubmit={handleSearchSubmit}>
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearchInput}
                placeholder="Search for products, categories, brands..."
                className="px-4 py-2 rounded-full w-full text-gray-700 placeholder-gray-500 border border-[#4222C4] focus:outline-none focus:ring-2 focus:ring-[#4222C4]"
              />
            </form>

            {/* Mobile Search Suggestions Box */}
            {showSuggestions && searchResults?.products?.length > 0 && (
              <div className="bg-white mt-1 rounded-lg shadow-lg border  max-h-96 overflow-y-auto z-50">
                {searchResults.products.map((product) => (
                  <div
                    key={product._id}
                    onClick={() => handleProductClick(product._id)}
                    className="p-3 hover:bg-gray-50 cursor-pointer border-b last:border-b-0"
                  >
                    <div className="flex items-center space-x-3">
                      <img
                        src={product.images[0]?.url
                          ? `${import.meta.env.VITE_APP}/${product.images[0]?.url.replace(/\\/g, '/')}`
                          : '/placeholder.png'}
                        alt={product.name}
                        className="w-12 h-12 object-cover rounded"
                      />
                      <div>
                        <p className="text-sm font-medium text-gray-800">{product.name}</p>
                        <p className="text-sm text-gray-500"><span className='text-sm'>A.D </span>{product.price}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Search Bar (Desktop) */}
        <div className="hidden md:flex items-center w-full max-w-md space-x-3" ref={searchRef}>
          <div className="relative flex-1">
            <form onSubmit={handleSearchSubmit}>
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearchInput}
                placeholder={translatedContent.searchPlaceholder}
                className="px-8 py-2 rounded-full w-full text-gray-700 placeholder-gray-500 border border-[#4222C4] focus:outline-none focus:ring-2 focus:ring-[#4222C4]"
              />
              <IoIosSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
            </form>

            {/* Search Suggestions Box */}
            {showSuggestions && searchResults?.products?.length > 0 && (
              <div className="absolute top-full left-0 right-0 bg-white mt-1 rounded-lg shadow-lg border z-50 max-h-96 overflow-y-auto">
                {searchResults.products.map((product) => (
                  <div
                    key={product._id}
                    onClick={() => handleProductClick(product._id)}
                    className="p-3 hover:bg-gray-50 cursor-pointer border-b last:border-b-0"
                  >
                    <div className="flex items-center space-x-3">
                      <img
                        src={product.images[0]?.url
                          ? `${import.meta.env.VITE_APP}/${product.images[0]?.url.replace(/\\/g, '/')}`
                          : '/placeholder.png'}

                        alt={product.name}
                        className="w-12 h-12 object-cover rounded"
                      />
                      <div>
                        <p className="text-sm font-medium text-gray-800">{product.name}</p>
                        <p className="text-sm text-gray-500"><span className='text-sm'>A.D </span>{product.price}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Navbar Right Section */}
        <div className="flex items-center w-max">
          <div className="flex items-center space-x-2 text-gray-800 text-sm">

            {/* Deals & Offers */}
            <Link to={'/cebelu/deals'} className=" w-max flex mr-5 md:mr-0">{translatedContent.dealsOffers}</Link>
            {!storeToken && (
              <>
                <span className="hidden md:flex text-gray-400">|</span>

                <div className="relative cursor-pointer" onClick={toggleUserDropdown}>
                  <FaUserCircle className="text-xl text-[#4222C4]" />
                  {isUserDropdownOpen && (
                    <div className="absolute top-full right-[-30px] bg-white border shadow-lg w-max mt-2 rounded-md z-10">
                      <ul className="text-gray-700  w-28 ">
                        {!storeToken && !user && (
                          <>
                            <li
                              className="p-2 hover:bg-blue-100 cursor-pointer"
                              onClick={() => navigate("/login")}
                            >
                              {translatedContent.login}
                            </li>
                            <li
                              className="p-2 hover:bg-blue-100 cursor-pointer"
                              onClick={() => navigate("/register")}
                            >
                              {translatedContent.register}
                            </li>
                          </>
                        )}

                        {user && user.role === "user" && (
                          <li
                            className="p-2 hover:bg-blue-100 cursor-pointer"
                            onClick={() => navigate("/userdashboard/profile")}
                          >
                            {translatedContent.userDashboard}
                          </li>
                        )}

                        {user && user.role === "admin" && (
                          <li
                            className="p-2 hover:bg-blue-100 cursor-pointer"
                            onClick={() => navigate("/admindashboard/Dashboard")}
                          >
                            {translatedContent.adminDashboard}
                          </li>
                        )}

                        {user && token && (
                          <li
                            onClick={Logout}
                            className="p-2 hover:bg-blue-100 cursor-pointer"
                          >
                            {translatedContent.logout}
                          </li>
                        )}

                      </ul>
                    </div>
                  )}
                </div>
              </>
            )}

          </div>

     

          <span className="hidden md:flex text-gray-400 ml-1">|</span>

          {/* Shortlist Icon */}
          <div onClick={() => setIsWishlistOpen(!isWishlistOpen)} className="relative hidden md:flex items-center space-x-1 cursor-pointer ml-3 mr-2">
            <AiOutlineHeart className="text-[#4222C4] text-xl" />
            <span>{translatedContent.wishlist}</span>

            {wishlist.length > 0 && (
              <span className="absolute -top-3 -left-2 bg-red-500 bg-opacity-90 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                {wishlist.length}
              </span>
            )}
          </div>


          <span className="hidden md:flex text-gray-400">|</span>

          {/* Cart Icon */}
          {user ?
            <div className="hidden md:flex items-center space-x-1 cursor-pointer ml-3" onClick={() => navigate("/userdashboard/cart")}>
              <CgShoppingCart className="text-[#4222C4]" />
              <span>{translatedContent.cart}</span>
            </div>
            :
            <div className="hidden md:flex items-center space-x-1 cursor-pointer ml-3">
              <CgShoppingCart className="text-[#4222C4]" />
              <span>{translatedContent.cart}</span>
            </div>
          }

        </div>


        {/* Search Bar (Mobile) */}
        <div className="md:hidden flex items-center ml-2 sm:ml-10">
          <IoIosSearch className="text-gray-500 text-[24px] cursor-pointer" onClick={toggleSearchInput} />
        </div>
      </div>




      {/* Wishlist Drawer */}
      {isWishlistOpen && (
        <div
          className={`fixed top-0 right-0 w-80 h-full bg-white shadow-lg p-4 z-50 transition-transform transform ${isWishlistOpen ? "translate-x-0" : "translate-x-full"
            }`}
        >
          {/* Close Button */}
          <button
            onClick={() => setIsWishlistOpen(false)}
            className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
          >
            <AiOutlineClose size={20} />
          </button>

          {/* Wishlist Title */}
          <h2 className="text-lg font-bold text-[#4222C4] mb-3">{translatedContent.yourWishlist}</h2>

          {/* Wishlist Items */}
          {wishlist.length > 0 ? (
            <>
              <ul className="overflow-y-auto max-h-[70vh]">
                {wishlist.map((product, index) => (
                  <li key={index} className="border-b py-3 flex items-center justify-between">
                    <div className="flex items-center">
                      <img
                        src={`${import.meta.env.VITE_APP}/${product?.images[0]?.url.replace(/\\/g, "/")}`}
                        alt={product.name}
                        className="w-14 h-14 object-cover rounded-md mr-3"
                      />
                      <div>
                        <h3 className="text-sm font-medium">{product.name}</h3>
                        <p className="text-xs text-gray-600">
                          {translatedContent.price}:{" "}
                          <span className="font-semibold">
                            <span className='text-sm'>A.D </span>{product.discountedPrice || product.price}
                          </span>
                        </p>
                        {product.stock > 0 ? (
                          <p className="text-xs text-green-600">{translatedContent.inStock}</p>
                        ) : (
                          <p className="text-xs text-red-600">{translatedContent.outOfStock}</p>
                        )}
                      </div>
                    </div>

                    {/* Remove Button */}
                    <button
                      onClick={() => handleRemoveFromWishlist(product._id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <AiOutlineClose size={18} />
                    </button>
                  </li>
                ))}
              </ul>

              {/* Total Price & Add to Cart Button */}
              <div className="absolute bottom-7 left-0 w-full flex gap-2 justify-center items-center bg-white p-4 border-t shadow-md">
                <p className="text-md font-semibold">
                {translatedContent.total}: A.D
                  {wishlist.reduce(
                    (total, product) => total + (product.discountedPrice || product.price),
                    0
                  )}
                </p>
                <Link to={`/userdashboard/cart`} className=" w-max bg-[#4222C4] text-white py-1 px-2 rounded-md hover:bg-[#34189a]">
                {translatedContent.addToCart}
                </Link>
              </div>
            </>
          ) : (
            <p className="text-gray-500 text-sm">Your wishlist is empty.</p>
          )}
        </div>
      )}


    </div>
  );
};

export default Navbar;
