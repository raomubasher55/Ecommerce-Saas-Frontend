import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { listStores } from "../../store/actions/storeActions";
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from "../../context/LanguageContext";

export default function OfficialStores() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { selectedLanguage, translateText } = useLanguage();
  const [shownStores, setShownStores] = useState(12);
  const [translatedContent, setTranslatedContent] = useState({
    title: "Official Stores",
    loading: "Loading...",
    error: "Error loading stores",
    visitStore: "Visit Store",
    seeMore: "See More"
  });
  const [translatedStoreNames, setTranslatedStoreNames] = useState({});

  const storeList = useSelector((state) => state.storeList);
  const { stores, loading, error } = storeList;

  useEffect(() => {
    dispatch(listStores(1, 1000, '-createdAt'));
  }, [dispatch]);

  // Translate static content
  useEffect(() => {
    const translateAll = async () => {
      const translations = await Promise.all([
        translateText("Official Stores"),
        translateText("Loading..."),
        translateText("Error loading stores"),
        translateText("Visit Store"),
        translateText("See More")
      ]);

      setTranslatedContent({
        title: translations[0],
        loading: translations[1],
        error: translations[2],
        visitStore: translations[3],
        seeMore: translations[4]
      });
    };

    translateAll();
  }, [selectedLanguage, translateText]);

  // Translate store names
  useEffect(() => {
    const translateNames = async () => {
      if (!stores || stores.length === 0) return;
      
      const translations = {};
      for (const store of stores) {
        if (store.name) {
          translations[store._id] = selectedLanguage === "English" 
            ? store.name 
            : await translateText(store.name);
        }
      }
      setTranslatedStoreNames(translations);
    };

    translateNames();
  }, [stores, selectedLanguage, translateText]);

  const loadMoreStores = () => {
    setShownStores(prev => prev + 6);
  };

  const RenderPage = (storeId) => {
    navigate(`/store/products/${storeId}`);
  };

  const filteredStores = stores?.filter(
    (store) =>
      store.status === "active" &&
      store.documents &&
      store.documents[0]?.status === "approved"
  ) || [];

  // Format store name with truncation
  const formatStoreName = (storeId, originalName) => {
    const name = translatedStoreNames[storeId] || originalName || "";
    return name.length > 13 ? `${name.slice(0, 12)}...` : name;
  };

  return (
    <div className="p-6 bg-white container mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-center" style={{ color: "#4222C4" }}>
        {translatedContent.title}
      </h2>

      {loading ? (
        <p className="text-center text-lg">{translatedContent.loading}</p>
      ) : error ? (
        <div className="text-center text-red-500">{translatedContent.error}</div>
      ) : filteredStores.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {filteredStores.slice(0, shownStores).map((store) => (
            <div key={store._id} className="p-4">
              <div className="bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200 relative group">
                <Link to={`/store/products/${store._id}`}>
                  <img
                    src={`${import.meta.env.VITE_APP}${store?.photo?.url}`}
                    alt={translatedStoreNames[store._id] || store.name}
                    className="w-full h-40 object-cover"
                  />
                </Link>
                <div className="p-4 flex flex-col">
                  <h3 className="text-[16px] font-semibold text-gray-800">
                    {formatStoreName(store._id, store.name)}
                  </h3>
                </div>
                <button
                  onClick={() => RenderPage(store._id)}
                  className="absolute bottom-0 left-0 w-full bg-blue-600 text-white text-center py-2 opacity-0 translate-y-5 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0"
                >
                  {translatedContent.visitStore}
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
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

      {shownStores < filteredStores.length && (
        <button
          onClick={loadMoreStores}
          className="mt-4 bg-[#4222C4] text-white px-6 py-2 rounded-md block mx-auto"
        >
          {translatedContent.seeMore}
        </button>
      )}
    </div>
  );
}