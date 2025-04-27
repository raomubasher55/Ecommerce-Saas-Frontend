import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchStoreProducts } from "../../../store/actions/storeActions";
import { BsThreeDotsVertical } from "react-icons/bs";
import PromotionModal from "../../presentation/modals/PromotionModal";
import { toast } from "react-toastify";
import Loader from '../../layout/Loader';
import BlacklistModal from "../../presentation/modals/BlacklistModal";

const Products = () => {
  const dispatch = useDispatch();
  const { loading, stores, products, error } = useSelector((state) => state.ProductsByReducer);

  const [allProducts, setAllProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedStore, setSelectedStore] = useState("All Stores");
  const [hoveredProductId, setHoveredProductId] = useState(null);
  const [toggleMenu, setToggleMenu] = useState(null);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [isPromotionModalOpen, setIsPromotionModalOpen] = useState(false);
  const [isBlacklistModalOpen, setIsBlacklistModalOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  useEffect(() => {
    dispatch(fetchStoreProducts());
  }, [dispatch]);

  useEffect(() => {
    if (stores.length > 0 && products.length > 0) {

      const flattenedProducts = stores.flatMap((store) =>
        products
          .filter((product) => store.products.includes(product._id))
          .map((product) => ({
            ...product,
            storeName: store.name,
          }))
      );

      setAllProducts(flattenedProducts);
      setFilteredProducts(flattenedProducts);
    }
  }, [stores, products]);

  useEffect(() => {
    setFilteredProducts([...filteredProducts]);
  }, [searchTerm]);


  const handleStoreChange = (event) => {
    const storeName = event.target.value;
    setSelectedStore(storeName);

    if (storeName === "All Stores") {
      setFilteredProducts(allProducts);
    } else {
      setFilteredProducts(allProducts.filter((product) => product.storeName === storeName));
    }
  };

  const handleCopy = (productId) => {
    navigator.clipboard.writeText(productId).then(() => {
      toast.success("Product ID copied to clipboard!");
    });
  };

  const handlePromotionClick = (productId) => {
    setSelectedProductId(productId);
    setIsPromotionModalOpen(true);
  };

  const handleBlacklistClick = (product) => {
    setSelectedProductId(product);
    setIsBlacklistModalOpen(true)
  };

  const handleSearchChange = (event) => {
    const searchValue = event.target.value.toLowerCase();
    setSearchTerm(searchValue);

    let filtered = allProducts.filter((product) => {
      return (
        (product.name?.toLowerCase().includes(searchValue) || "") ||
        (product._id?.toLowerCase().includes(searchValue) || "") ||
        (product.storeName?.toLowerCase().includes(searchValue) || "") ||
        (product.seller?.toLowerCase().includes(searchValue) || "")
      );
    });

    setFilteredProducts(filtered);
  };


  if (loading)
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader />
      </div>
    );

  if (error) return <div>Error: {error}</div>;

  return (
    <div className="container mx-auto p-4 pt-14 pb-6 rounded bg-gray-100">
      <h1 className="text-2xl font-bold text-center my-4 text-[#4222C4]">Products</h1>

      <div className="flex justify-around flex-wrap">

        {/* Store Dropdown */}
        <div className="mb-4 text-center">
          <label className="mr-2 text-lg font-semibold text-[#351e91]">Filter by Store:</label>
          <div className="relative inline-block w-64">
            {/* Custom Select Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 border-2 border-[#351e91] rounded-lg bg-white text-[#351e91] font-semibold focus:outline-none focus:ring-2 focus:ring-[#351e91] transition w-full text-left"
            >
              {selectedStore || "Select Store"}
            </button>

            {/* Dropdown List (Only Shows When isOpen is True) */}
            {isOpen && (
              <div className="absolute w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-[200px] overflow-y-auto z-50">
                <div
                  onClick={() => {
                    handleStoreChange({ target: { value: "All Stores" } });
                    setIsOpen(false);
                  }}
                  className="p-2 text-gray-700 font-semibold hover:bg-[#351e91] hover:text-white cursor-pointer"
                >
                  All Stores
                </div>
                {stores.map((store) => (
                  <div
                    key={store._id}
                    onClick={() => {
                      handleStoreChange({ target: { value: store.name } });
                      setIsOpen(false);
                    }}
                    className="p-2 text-gray-700 font-semibold hover:bg-[#351e91] hover:text-white cursor-pointer"
                  >
                    {store.name}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>


        {/* Search Input */}
        <div className="mb-4 text-center">
          <input
            type="text"
            placeholder="Search by Product Name, ID, Store Name, Store ID..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="p-2 border-2 border-[#351e91] rounded-lg bg-white text-[#351e91] font-semibold w-64 focus:outline-none focus:ring-2 focus:ring-[#351e91] transition"
          />
        </div>
      </div>



      {(!allProducts || filteredProducts.length === 0) ? (
        <div className="text-center text-gray-600 text-xl">No products available</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {filteredProducts.map((product) => (
            <div key={product._id} className="p-4 border rounded-lg shadow hover:shadow-lg transition relative">
              {/* Three Dots Menu */}
              <div className="absolute z-50 top-1 right-0">
                <BsThreeDotsVertical
                  className="text-[#351e91] cursor-pointer text-xl"
                  onClick={() => setToggleMenu(toggleMenu === product._id ? null : product._id)}
                />
                {toggleMenu === product._id && (
                  <div className="absolute right-0 mt-2 w-max bg-white overflow-hidden border rounded-lg shadow-lg z-50">
                    {/* <button className="block w-full text-left px-4 py-2 text-sm hover:bg-[#351e91] hover:bg-opacity-10 hover:text-[#351e91]" onClick={() => alert(`Deleting ${product.name}`)}>Delete</button> */}
                    {/* <button className="block w-full text-left px-4 py-2 text-sm hover:bg-[#351e91] hover:bg-opacity-10 hover:text-[#351e91]" onClick={() => alert(`Updating ${product.name}`)}>Update</button> */}
                    <button
                      className="block w-full text-left px-4 py-2 text-sm hover:bg-[#351e91] hover:bg-opacity-10 hover:text-[#351e91]"
                      onClick={() => handlePromotionClick(product._id)}
                    >
                      Promotion
                    </button>
                    <button
                      className="block w-full text-left px-4 py-2 text-sm hover:bg-red-600 hover:bg-opacity-10 hover:text-red-600"
                      onClick={() => handleBlacklistClick(product)}
                    >
                      Blacklist Product
                    </button>
                  </div>
                )}
              </div>

              <div
                className="relative h-60 rounded-lg shadow-lg overflow-hidden group"
                style={{
                  backgroundImage: `url(${import.meta.env.VITE_APP}/${product.images[0].url.replace(/\\/g, "/")})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
                onMouseEnter={() => setHoveredProductId(product._id)}
                onMouseLeave={() => setHoveredProductId(null)}
              >
                <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col justify-between p-4 text-white">
                  <div>
                    <h3 className="text-lg font-semibold">{product.name}</h3>
                    <p className="text-sm truncate">{product.description}</p>
                  </div>
                  <div className="flex justify-between items-center">
                    <div
                      className="hover:underline"
                      style={{
                        color: "white",
                        textShadow:
                          "0 0 8px rgba(255, 255, 255, 0.8), 0 0 20px rgba(255, 255, 255, 0.6), 0 0 30px rgba(255, 255, 255, 0.4)",
                      }}
                    >
                      {product.storeName}
                    </div>
                    {product.discountPercentage && (
                      <div
                        className="rounded-full text-center p-1 animate-pulse"
                        style={{
                          backgroundColor: "#4222C4",
                          color: "white",
                          fontSize: "10px",
                          width: "auto",
                        }}
                      >
                        {product.discountPercentage}% OFF
                      </div>
                    )}
                  </div>
                  {/* Copy ID Button */}
                  {hoveredProductId === product._id && (
                    <div
                      className="absolute bottom-2 right-2 bg-gray-800 text-white p-1 rounded-md shadow-md cursor-pointer transition-transform transform translate-x-full group-hover:translate-x-0"
                      onClick={() => handleCopy(product._id)}
                    >
                      Copy ID
                    </div>
                  )}
                </div>
              </div>

              {/* Promotion Modal */}
              {isPromotionModalOpen && selectedProductId && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
                  <PromotionModal store={product.seller} productId={selectedProductId} setIsPromotionModalOpen={setIsPromotionModalOpen} />
                </div>
              )}

              {isBlacklistModalOpen && selectedProductId && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
                  <BlacklistModal  product={selectedProductId} setIsBlacklistModalOpen={setIsBlacklistModalOpen} />
                </div>
              )}
              

            </div>

          ))}
        </div>
      )}

    </div>
  );
};

export default Products;
