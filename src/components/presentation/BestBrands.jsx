import { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { listStores } from "../../store/actions/storeActions";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { useLanguage } from "../../context/LanguageContext";

export default function BestBrands() {
  const dispatch = useDispatch();
  const { selectedLanguage, translateText } = useLanguage();

  const [translatedContent, setTranslatedContent] = useState({
    title: "Our Best Stores",
    loading: "Loading...",
    notAvailable: "Not Available yet",
    loadMore: "Load More"
  });

  const [translatedStoreNames, setTranslatedStoreNames] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const storeList = useSelector((state) => state.storeList);
  const { loading, error, stores } = storeList;

  const sortBy = "-createdAt";

  // ✅ Fetch stores only once on mount
  useEffect(() => {
    dispatch(listStores(sortBy));
  }, [dispatch]);

  // ✅ Translate static content when language changes
  useEffect(() => {
    const translateStaticContent = async () => {
      const translations = await Promise.all([
        translateText("Our Best Stores"),
        translateText("Loading..."),
        translateText("Not Available yet"),
        translateText("Load More")
      ]);
      setTranslatedContent({
        title: translations[0],
        loading: translations[1],
        notAvailable: translations[2],
        loadMore: translations[3]
      });
    };

    translateStaticContent();
  }, [selectedLanguage]);

  // ✅ Translate dynamic store names when stores or language changes
  useEffect(() => {
    const translateNames = async () => {
      if (!stores || stores.length === 0) return;

      const translations = {};
      for (const store of stores) {
        if (store.name) {
          translations[store._id] =
            selectedLanguage === "English"
              ? store.name
              : await translateText(store.name);
        }
      }
      setTranslatedStoreNames(translations);
    };

    translateNames();
  }, [stores, selectedLanguage]);

  // ✅ Memoize verifiedStores to avoid recalculating on every render
  const verifiedStores = useMemo(() => {
    return (
      stores?.filter(
        (store) =>
          store.status === "active" &&
          store.documents?.[0]?.status === "approved"
      ) || []
    );
  }, [stores]);

  const [visibleStores, setVisibleStores] = useState([]);

  // ✅ Sync visible stores when currentPage or verifiedStores changes
  useEffect(() => {
    const startIdx = 0;
    const endIdx = currentPage * itemsPerPage;
    setVisibleStores(verifiedStores.slice(startIdx, endIdx));
  }, [currentPage, verifiedStores]);

  const handleLoadMore = () => {
    setCurrentPage((prev) => prev + 1);
  };

  const formatStoreName = (storeId, originalName) => {
    const name = translatedStoreNames[storeId] || originalName || "";
    return {
      short: name.length > 10 ? `${name.slice(0, 11)}...` : name,
      medium: name.length > 10 ? `${name.slice(0, 13)}...` : name,
    };
  };

  const swiperSettings = {
    slidesPerView: 2,
    spaceBetween: 10,
    loop: true,
    navigation: true,
    breakpoints: {
      1024: { slidesPerView: 9, spaceBetween: 20 },
      768: { slidesPerView: 5, spaceBetween: 15 },
      480: { slidesPerView: 2, spaceBetween: 10 },
    },
  };

  return (
    <div className="w-full container p-4 bg-[#f3f4f6]">
      <h1 className="text-center text-2xl font-bold text-[#4222C4] mb-6">
        {translatedContent.title}
      </h1>

      {loading ? (
        <p className="text-center text-lg">{translatedContent.loading}</p>
      ) : error ? (
        <p className="text-center text-gray-500">
          {translatedContent.notAvailable}
        </p>
      ) : verifiedStores.length > 0 ? (
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-6 pb-2">
            {visibleStores.map((store) => {
              const name = formatStoreName(store._id, store.name);
              return (
                <Link
                  to={`/store/products/${store._id}`}
                  key={store._id}
                  className="relative h-[120px] rounded-lg overflow-hidden shadow-md transition-transform duration-300 transform hover:scale-105"
                  style={{
                    backgroundImage: store?.photo?.url
                      ? `url(${import.meta.env.VITE_APP}${store.photo.url})`
                      : "none",
                    backgroundPosition: "center",
                    backgroundSize: "cover",
                  }}
                >
                  <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                    <p className="text-white text-lg font-bold text-center">
                      {name.short}
                    </p>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 bg-white bg-opacity-80 py-1 text-center">
                    <p className="text-gray-800 font-medium">{name.medium}</p>
                  </div>
                </Link>
              );
            })}
          </div>

          {visibleStores.length < verifiedStores.length && (
            <div className="flex justify-center mt-6">
              <button
                onClick={handleLoadMore}
                className="px-6 py-2 border rounded bg-white text-gray-800 hover:bg-[#4222C4] hover:text-white transition"
              >
                {translatedContent.loadMore}
              </button>
            </div>
          )}
        </>
      ) : (
        <Swiper {...swiperSettings}>
          {[...Array(9)].map((_, index) => (
            <SwiperSlide
              key={index}
              className="relative swiper-card flex flex-col items-center border-2 rounded-lg p-2 border-gray-200 shadow-xl"
            >
              <div className="w-28 h-28 bg-gray-300 animate-pulse rounded-full"></div>
              <div className="w-3/4 h-4 bg-gray-300 animate-pulse rounded my-2"></div>
              <div className="w-1/2 h-4 bg-gray-300 animate-pulse rounded"></div>
            </SwiperSlide>
          ))}
        </Swiper>
      )}
    </div>
  );
}
