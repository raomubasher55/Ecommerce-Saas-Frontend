import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify"; 
import "react-toastify/dist/ReactToastify.css";


export default function Wishlist() {
  const [wishlist, setWishlist] = useState([]);
  const navigate = useNavigate();
  // Fetch wishlist from localStorage on mount
  useEffect(() => {
    const storedWishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
    setWishlist(storedWishlist);
  }, []);

  // Remove item from wishlist
  const handleRemove = (id) => {
    toast.warning("Item removed from wishlist!", { autoClose: 2000 });
    const updatedWishlist = wishlist.filter((item) => item._id !== id);
    setWishlist(updatedWishlist);
    localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));
  };
  const Remove = (id) => {
    const updatedWishlist = wishlist.filter((item) => item._id !== id);
    setWishlist(updatedWishlist);
    localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));
  };

  // Add item to cart
  const handleAddToCart = (item) => {
    toast.success(`${item.name} added to cart!`, { autoClose: 2000 });
    navigate(`/AddtoCart/${item._id}`);
    // Remove(item._id);
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <ToastContainer />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        <div className="flex-1 bg-gray-50 p-6 overflow-y-auto">
          <h2 className="text-3xl font-bold text-center mb-8">Your Wishlist</h2>

          {wishlist.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {wishlist.map((item) => (
                <div
                  key={item._id}
                  className="bg-[#4222C4] bg-opacity-10 rounded-lg shadow-md p-4 flex flex-col border border-[#4222c47e]"
                >
                  {/* Product Image */}
                  <img
                    src={`${import.meta.env.VITE_APP}/${item?.images[0]?.url.replace(/\\/g, "/")}`}
                    alt={item.name}
                    className="w-full h-40 object-cover rounded"
                  />

                  {/* Product Details */}
                  <h3 className="mt-4 text-lg font-semibold text-gray-800">
                    {item.name}
                  </h3>
                  <p className="mt-2 text-lg font-bold text-blue-600">
                    ${item.discountedPrice || item.price}
                  </p>

                  {/* Action Buttons */}
                  <div className="mt-auto flex gap-4 justify-center">
                    <button
                      onClick={() => handleAddToCart(item)}
                      className="bg-[#4222C4] text-white p-1 sm:p-2 h-[30px] sm:h-[40px] mt-4 rounded hover:bg-[#4222C4]"
                    >
                     Buy Now
                    </button>
                    <button
                      onClick={() => handleRemove(item._id)}
                      className="bg-red-500 text-white p-1 sm:p-2 h-[30px] sm:h-[40px] mt-4 rounded hover:bg-red-600"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-600 text-lg">
              Your wishlist is currently empty.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}