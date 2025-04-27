import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchStoreProducts } from "../../store/actions/storeActions";
import { getCategoryById } from "../../store/actions/categoryActions";
import { Link } from "react-router-dom";
import { useLanguage } from "../../context/LanguageContext";

export default function ProductsByCategory() {
  const dispatch = useDispatch();
  const { selectedLanguage, translateText } = useLanguage();
  const [translatedContent, setTranslatedContent] = useState({
    title: "Category Wise Products Here",
    newArrivals: "New Arrivals & Discounts",
    view: "View",
    loadingCategories: "Loading categories...",
    discountBadge: "-{percentage}%"
  });
  const [translatedCategories, setTranslatedCategories] = useState({});
  const [translatedProducts, setTranslatedProducts] = useState([]);

  const { products, error, loading } = useSelector((state) => state.ProductsByReducer);
  const { categories, categoryLoading } = useSelector((state) => state.categoryForStore);

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

  // Translate static content
  useEffect(() => {
    const translateAll = async () => {
      const translations = await Promise.all([
        translateText("Category Wise Products Here"),
        translateText("New Arrivals & Discounts"),
        translateText("View"),
        translateText("Loading categories..."),
        translateText("-{percentage}%")
      ]);

      setTranslatedContent({
        title: translations[0],
        newArrivals: translations[1],
        view: translations[2],
        loadingCategories: translations[3],
        discountBadge: translations[4].replace('{percentage}', '{0}')
      });
    };

    translateAll();
  }, [selectedLanguage, translateText]);

  // Translate category names and product names
  useEffect(() => {
    const translateNames = async () => {
      if (!products || !categories) return;

      // Translate category names
      const categoryTranslations = {};
      for (const category of categories) {
        try {
          categoryTranslations[category._id] = selectedLanguage === "English"
            ? category.name
            : await translateText(category.name);
        } catch (err) {
          categoryTranslations[category._id] = category.name;
        }
      }

      // Translate product names
      const productTranslations = [];
      for (const product of products) {
        try {
          productTranslations.push({
            ...product,
            translatedName: selectedLanguage === "English"
              ? product.name
              : await translateText(product.name)
          });
        } catch (err) {
          productTranslations.push({
            ...product,
            translatedName: product.name
          });
        }
      }

      setTranslatedCategories(categoryTranslations);
      setTranslatedProducts(productTranslations);
    };

    translateNames();
  }, [products, categories, selectedLanguage, translateText]);

  if (loading) {
    return (
      <div className="p-6 bg-white container mx-auto">
        <h3 className="text-xl font-semibold mb-4 text-center" style={{ color: "#4222C4" }}>
          {translatedContent.title}
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

  // Group products by unique category names
  const groupedProducts = (translatedProducts.length > 0 ? translatedProducts : products).reduce((acc, product) => {
    const category = categories?.find((cat) => cat._id === product.category);
    if (!category) return acc;

    const categoryName = translatedCategories[category._id] || category.name;

    if (!acc[categoryName]) {
      acc[categoryName] = {
        category: { ...category, translatedName: categoryName },
        products: []
      };
    }
    acc[categoryName].products.push(product);
    return acc;
  }, {});

  // Format product name with truncation
  const formatProductName = (name) => {
    return name?.length > 13 ? `${name.slice(0, 13)}...` : name;
  };

  return (
    <div className="p-6 bg-white container mx-auto">
      {Object.entries(groupedProducts).map(([categoryName, { category, products }]) => (
        <div key={category._id} className="mb-8">
          <h3 className="text-xl font-semibold mb-4 text-center" style={{ color: "#4222C4" }}>
            {categoryName} - {translatedContent.newArrivals}
          </h3>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {products.map((store, index) => (
              <div key={index} className="p-4">
                <div className="bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200 relative group">
                  {/* Discount Badge */}
                  {store.discountPercentage && store.discountPercentage > 0 && store.discountedPrice != store.price && (
                    <div className="absolute top-0 left-0 bg-green-500 text-white text-sm font-semibold px-2 py-1">
                      -{store.discountPercentage}%
                    </div>
                  )}

                  {/* Product Image */}
                  <Link to={`/single-product/${store._id}`}>
                    <img
                      src={`${import.meta.env.VITE_APP}/${store?.images[0]?.url.replace(/\\/g, "/")}`}
                      alt={store.translatedName || store.name}
                      className="w-full h-40 object-cover"
                    />
                  </Link>

                  {/* Product Info */}
                  <div className="p-4 flex flex-col">
                    <h3 className="text-[15px] font-semibold text-gray-800">
                      {formatProductName(store.translatedName || store.name)}
                    </h3>

                    <div className="flex justify-between items-center mt-2">
                      <p className="text-lg font-semibold text-gray-800">
                        {store.discountedPrice !== null && store.discountedPrice !== store.price ? (
                          <>
                            {store.discountedPrice.toFixed(1)}
                            <span className='text-sm'> A.D </span>
                          </>
                        ) : (
                          <>
                            {store.price.toFixed(1)}
                            <span className='text-sm'> A.D </span>
                          </>
                        )}
                      </p>

                      {store.discountedPrice !== null && store.discountedPrice !== store.price && (
                        <p className="text-sm text-gray-500 line-through">{store.price.toFixed(1)}</p>
                      )}
                    </div>

                  </div>

                  {/* View Button */}
                  <Link
                    to={`/single-product/${store._id}`}
                    className="absolute bottom-0 left-0 w-full bg-blue-600 text-white text-center py-2 opacity-0 translate-y-5 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0"
                  >
                    {translatedContent.view}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
      {categoryLoading && <div>{translatedContent.loadingCategories}</div>}
      {error && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {Array.from({ length: 12 }).map((_, index) => (
            <div key={index} className="p-4">
              <div className="bg-gray-200 animate-pulse shadow-lg rounded-lg overflow-hidden border border-gray-300 relative group">
                <div className="w-full h-40 bg-gray-300"></div>
                <div className="p-4 flex flex-col">
                  <div className="h-4 bg-gray-400 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-400 rounded w-1/2"></div>
                </div>
                <div className="absolute bottom-0 left-0 w-full bg-gray-500 h-10 opacity-50"></div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}