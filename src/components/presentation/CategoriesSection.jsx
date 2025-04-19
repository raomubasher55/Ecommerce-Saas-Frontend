import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { listStores } from "../../store/actions/storeActions";
import { getCategoryById } from "../../store/actions/categoryActions";
import { useLanguage } from "../../context/LanguageContext"; 

export default function CategoriesSection() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { selectedLanguage, translateText } = useLanguage();

  const { stores, error, loading } = useSelector((state) => state.storeList);
  const { categories, error: categoryError, loading: categoryLoading } = useSelector((state) => state.categoryForStore);

  const [visibleCount, setVisibleCount] = useState(12);
  const [translatedContent, setTranslatedContent] = useState({
    title: "Stores by Categories",
    showMore: "Show More",
    placeholder: "Category Placeholder"
  });
  const [translatedCategories, setTranslatedCategories] = useState({});

  // Filter only stores with a valid category
  const filteredStores = stores?.filter(store => categories?.some(cat => cat._id === store.category)) || [];

  useEffect(() => {
    dispatch(listStores());
  }, [dispatch]);

  useEffect(() => {
    if (stores && stores.length > 0) {
      const categoryIds = stores.map(store => store.category);
      if (categoryIds.length > 0) {
        dispatch(getCategoryById(categoryIds));
      }
    }
  }, [dispatch, stores]);

  // Translate static content
  useEffect(() => {
    const translateAll = async () => {
      const translations = await Promise.all([
        translateText("Stores by Categories"),
        translateText("Show More"),
        translateText("Category Placeholder")
      ]);

      setTranslatedContent({
        title: translations[0],
        showMore: translations[1],
        placeholder: translations[2]
      });
    };

    translateAll();
  }, [selectedLanguage, translateText]);

  // Translate category names
  useEffect(() => {
    const translateCategoryNames = async () => {
      if (!categories || categories.length === 0) return;
      
      const translations = {};
      for (const category of categories) {
        if (category.name) {
          translations[category._id] = selectedLanguage === "English" 
            ? category.name 
            : await translateText(category.name);
        }
      }
      setTranslatedCategories(translations);
    };

    translateCategoryNames();
  }, [categories, selectedLanguage, translateText]);

  const handleCategoryClick = (categoryName) => {
    navigate(`/search?category=${encodeURIComponent(categoryName)}`);
  };

  const handleShowMore = () => {
    setVisibleCount((prev) => prev + 6);
  };

  return (
    <div className="p-6 mt-20 bg-gray-100 container">
      <h2 className="text-center text-2xl font-bold mb-6" style={{ color: "#4222C4" }}>
        {translatedContent.title}
      </h2>

      <div className="grid gap-4 max-w-6xl mx-auto md:grid-cols-6 sm:grid-cols-2 grid-cols-1">
        {loading || categoryLoading ? (
          Array(6).fill(null).map((_, index) => (
            <div key={index} className="h-40 rounded-lg bg-gray-300 animate-pulse"></div>
          ))
        ) : filteredStores.length > 0 ? (
          filteredStores.slice(0, visibleCount).map((store) => {
            const category = categories?.find(cat => cat._id === store.category);
            const translatedName = translatedCategories[category?._id] || category?.name;
            
            return (
              <div
                key={store._id}
                className="relative h-40 rounded-lg shadow-lg overflow-hidden group cursor-pointer"
                onClick={() => handleCategoryClick(translatedName || category?.name)}
                style={{
                  backgroundImage: `url(${import.meta.env.VITE_APP}${store?.photo?.url})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
                <div className="absolute inset-0 transition-transform duration-500 group-hover:scale-110 bg-black bg-opacity-40 flex items-center justify-center">
                  <h3 className="text-white text-lg font-semibold text-center" style={{ textShadow: "1px 1px 4px rgba(0, 0, 0, 0.8)" }}>
                    {translatedName || category?.name}
                  </h3>
                </div>
              </div>
            );
          })
        ) : (
          // Placeholder when no stores are available
          Array(6).fill(null).map((_, index) => (
            <div key={index} className="h-40 rounded-lg bg-gray-200 flex items-center justify-center">
              <span className="text-gray-500">{translatedContent.placeholder}</span>
            </div>
          ))
        )}
      </div>

      {/* Show More Button */}
      {filteredStores.length > visibleCount && (
        <div className="text-center mt-6">
          <button
            onClick={handleShowMore}
            className="px-6 py-2 bg-purple-600 text-white font-semibold rounded-lg shadow-md hover:bg-purple-700 transition duration-300"
          >
            {translatedContent.showMore}
          </button>
        </div>
      )}
    </div>
  );
}