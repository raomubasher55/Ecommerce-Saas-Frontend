import { CardBoarder } from "./CardBoarder";
import { Icon } from "@iconify/react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getCategories } from "../../store/actions/categoryActions";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../../context/LanguageContext";

export const CategoryNavigationMenu = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { error, categories, loading } = useSelector((state) => state.categories);
  const { selectedLanguage, translateText } = useLanguage(); 
  const [translatedCategories, setTranslatedCategories] = useState([]);

  useEffect(() => {
    dispatch(getCategories());
  }, [dispatch]);

  // Translate categories when language or categories change
  useEffect(() => {
    const translateCategoryNames = async () => {
      if (categories && categories.length > 0) {
        const translated = await Promise.all(
          categories.map(async (category) => ({
            ...category,
            translatedName: selectedLanguage === "English" 
              ? category.name 
              : await translateText(category.name)
          }))
        );
        setTranslatedCategories(translated);
      }
    };

    translateCategoryNames();
  }, [categories, selectedLanguage, translateText]);

  const uniqueCategories = [];
  const categoryMap = new Map();

  translatedCategories?.forEach((category) => {
    if (!categoryMap.has(category.name)) {
      categoryMap.set(category.name, []);
      uniqueCategories.push({
        ...category,
        name: category.translatedName || category.name
      });
    }
    categoryMap.get(category.name).push(category._id);
  });

  const handleCategoryClick = (originalName, id) => {
    navigate(`/products/${originalName}/${id}`);
  };

  return (
    <CardBoarder className="bg-primary-page-color w-full md:w-1/5 p-4 rounded-md border">
      <div
        className={`${
          uniqueCategories.length > 10 ? "max-h-[400px] overflow-y-auto" : ""
        }`}
      >
        {loading ? (
          // Placeholder Skeleton Loader
          [...Array(2)].map((_, index) => (
            <div
              key={index}
              className="flex items-center justify-start text-sm font-medium px-2 py-2 rounded-md bg-gray-200 animate-pulse mb-2 h-10"
            ></div>
          ))
        ) : uniqueCategories.length > 0 ? (
          uniqueCategories.map((category) => (
            <div
              key={category._id}
              onClick={() => handleCategoryClick(category.name, category.seller)}
              className="flex items-center text-gray-500 hover:text-[#4222c4de] justify-start text-sm md:text-[15px] font-medium px-2 py-2 rounded-md bg-white hover:bg-gray-100 transition mb-2 cursor-pointer"
            >
              <Icon icon="mdi:category" className="text-xl mr-2" color="#4222c4de" />
              {category.translatedName || category.name}
            </div>
          ))
        ) : (
          // Placeholder Categories (Fallback if no categories)
          [...Array(2)].map((_, index) => (
            <div
              key={index}
              className="flex items-center justify-start text-gray-400 text-sm font-medium px-2 py-6 rounded-md bg-gray-100 mb-2 cursor-not-allowed"
            ></div>
          ))
        )}
      </div>
    </CardBoarder>
  );
};