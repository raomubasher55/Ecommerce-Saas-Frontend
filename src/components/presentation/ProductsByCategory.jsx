import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchStoreProducts } from "../../store/actions/storeActions";
import { getCategoryById } from "../../store/actions/categoryActions";
import { Link } from "react-router-dom";

export default function ProductsByCategory() {
  const dispatch = useDispatch();

  const { products, error, loading } = useSelector((state) => state.ProductsByReducer);
  const { categories, categoryError, categoryLoading } = useSelector((state) => state.categoryForStore);

  useEffect(() => {
    dispatch(fetchStoreProducts());
  }, [dispatch]);

  useEffect(() => {
    if (products && products.length > 0) {
      const categoryIds = products.map((store) => store.category);
      if (categoryIds.length > 0) {
        dispatch(getCategoryById(categoryIds));
      }
    }
  }, [dispatch, products]);

  if (loading) {
    return (
      <div className="p-6 bg-white container mx-auto">
        <h3 className="text-xl font-semibold mb-4 text-center" style={{ color: "#4222C4" }}>
          Category Wise Products Here
        </h3>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="p-4">
              <div className="bg-gray-200 shadow-lg rounded-lg overflow-hidden border border-gray-300 animate-pulse">
                <div className="h-40 bg-gray-300"></div>
                <div className="p-4">
                  <div className="h-4 bg-gray-400 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-400 rounded w-1/2"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }



  // ✅ Group products by unique category names
  const groupedProducts = products.reduce((acc, product) => {
    const category = categories?.find((cat) => cat._id === product.category);
    if (!category) return acc;

    if (!acc[category.name]) {
      acc[category.name] = { category, products: [] };
    }
    acc[category.name].products.push(product);
    return acc;
  }, {});

  return (
    <div className="p-6 bg-white container mx-auto">
      {Object.entries(groupedProducts).map(([categoryName, { category, products }]) => (
        <div key={category._id} className="mb-8">
          <h3 className="text-xl font-semibold mb-4 text-center" style={{ color: "#4222C4" }}>
            {categoryName} - New Arrivals & Discounts
          </h3>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {products.map((store, index) => (
              <div key={index} className="p-4">
                <div className="bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200 relative group">
                  {/* Discount Badge */}
                  {store.discountPercentage && store.discountPercentage > 0 && (
                    <div className="absolute top-0 left-0 bg-green-500 text-white text-sm font-semibold px-2 py-1">
                      -{store.discountPercentage}%
                    </div>
                  )}

                  {/* Product Image */}
                <Link to={`/single-product/${store._id}`}>
                <img
                    src={`${import.meta.env.VITE_APP}/${store?.images[0]?.url.replace(/\\/g, "/")}`}
                    alt={`Store ${index + 1}`}
                    className="w-full h-40 object-cover"
                  />
                </Link>

                  {/* Product Info */}
                  <div className="p-4 flex flex-col">
                    <h3 className="text-[15px] font-semibold text-gray-800">
                      {store.name.length > 13 ? `${store.name.slice(0, 13)}...` : store.name}
                    </h3>

                    <div className="flex justify-between items-center mt-2">
                      <p className="text-lg font-semibold text-gray-800">
                        {store.discountedPrice && `${store.discountedPrice.toFixed(1)}`}
                        <span className='text-sm'>A.D </span>
                      </p>
                      {store.discountedPrice != null && store.discountedPrice !== store.price && (
                        <p className="text-sm text-gray-500 line-through">{store.price}</p>
                      )}
                    </div>
                  </div>

                  {/* View Button (Hidden by default, shows on hover) */}
                  <Link to={`/single-product/${store._id}`} className="absolute bottom-0 left-0 w-full bg-blue-600 text-white text-center py-2 opacity-0 translate-y-5 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">
                    View
                  </Link>
                </div>
              </div>

            ))}
          </div>
        </div>
      ))}
      {categoryLoading && <div>Loading categories...</div>}
      {error && <div>
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
      </div>}
    </div>
  );
}
