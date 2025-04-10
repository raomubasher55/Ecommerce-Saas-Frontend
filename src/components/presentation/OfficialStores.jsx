import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { listStores } from "../../store/actions/storeActions";
import { Link, useNavigate } from 'react-router-dom';

export default function OfficialStores() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [shownStores, setShownStores] = useState(12);

  const storeList = useSelector((state) => state.storeList);
  const { stores, loading, error } = storeList;

  useEffect(() => {
    dispatch(listStores(1, 24, '-createdAt'));
  }, [dispatch]);

  const loadMoreStores = () => {
    setShownStores(shownStores + 6);
  };

  const RenderPage = (storeId) => {
    navigate(`/store/products/${storeId}`);
  };
  

  return (
    <div className="p-6 bg-white container mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-center" style={{ color: "#4222C4" }}>
        Official Stores
      </h2>

      {loading ? (
        <p className="text-center text-lg">Loading...</p>
      ) : error ? (
        <p className="text-center text-red-500">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {Array.from({ length: 12 }).map((_, index) => (
            <div key={index} className="p-4">
              <div className="bg-gray-200 animate-pulse shadow-lg rounded-lg overflow-hidden border border-gray-300 relative group">
                {/* Placeholder Image */}
                <div className="w-full h-40 bg-gray-300"></div>

                {/* Placeholder Info */}
                <div className="p-4 flex flex-col">
                  <div className="h-4 bg-gray-400 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-400 rounded w-1/2"></div>
                </div>

                {/* Placeholder Button */}
                <div className="absolute bottom-0 left-0 w-full bg-gray-500 h-10 opacity-50"></div>
              </div>
            </div>
          ))}
        </div>
        </p>
      ) : stores && stores?.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {stores?.slice(0, shownStores).map((store) => (
            <div key={store._id} className="p-4">
              <div className="bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200 relative group">
                {/* Product Image */}
                <Link to={`/store/products/${store._id}`}>
                <img
                  src={`${import.meta.env.VITE_APP}${store.photo.url}`}
                  alt={store.name}
                  className="w-full h-40 object-cover"
                />
                </Link>

                {/* Product Info */}
                <div className="p-4 flex flex-col">
                  <h3 className="text-[16px] font-semibold text-gray-800">
                    {store.name.length > 13 ? store.name.slice(0, 12) + "..." : store.name}
                  </h3>
                </div>

                {/* View Button (Hidden by default, shows on hover) */}
                <button
                  onClick={() => RenderPage(store._id)}
                  className="absolute bottom-0 left-0 w-full bg-blue-600 text-white text-center py-2 opacity-0 translate-y-5 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0"
                >
                  Visit Store
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        // Show 5 placeholder cards when no stores are available
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {Array.from({ length: 12 }).map((_, index) => (
            <div key={index} className="p-4">
              <div className="bg-gray-200 animate-pulse shadow-lg rounded-lg overflow-hidden border border-gray-300 relative group">
                {/* Placeholder Image */}
                <div className="w-full h-40 bg-gray-300"></div>

                {/* Placeholder Info */}
                <div className="p-4 flex flex-col">
                  <div className="h-4 bg-gray-400 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-400 rounded w-1/2"></div>
                </div>

                {/* Placeholder Button */}
                <div className="absolute bottom-0 left-0 w-full bg-gray-500 h-10 opacity-50"></div>
              </div>
            </div>
          ))}
        </div>
      )}

      {shownStores < stores?.length && stores?.length > 0 && (
        <button
          onClick={loadMoreStores}
          className="mt-4 bg-[#4222C4] text-white px-6 py-2 rounded-md block mx-auto"
        >
          See More
        </button>
      )}
    </div>
  );
}
