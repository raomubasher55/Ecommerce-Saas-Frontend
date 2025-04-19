import { useEffect, useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { getProducts } from "../../store/actions/productActions";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { useLanguage } from "../../context/LanguageContext";

const NextArrow = ({ onClick }) => (
  <div
    className="absolute top-1/2 right-4 md:right-2 transform -translate-y-1/2 bg-[#4222C4] text-white p-3 md:p-2 rounded-full cursor-pointer shadow-md z-50"
    onClick={onClick}
  >
    <FaChevronRight size={20} />
  </div>
);

const PrevArrow = ({ onClick }) => (
  <div
    className="absolute top-1/2 left-4 md:left-2 transform -translate-y-1/2 bg-[#4222C4] text-white p-3 md:p-2 rounded-full cursor-pointer shadow-md z-50"
    onClick={onClick}
  >
    <FaChevronLeft size={20} />
  </div>
);

export default function FlashSales() {
  const dispatch = useDispatch();
  const { products } = useSelector((state) => state.allProducts);
  const [visibleCount, setVisibleCount] = useState(12);
  const { selectedLanguage, translateText } = useLanguage();
  const [translatedContent, setTranslatedContent] = useState({
    flashSales: "🔥 Flash Sales",
    limitedOffer: "⏳ Limited Time Offer!",
    hrsLeft: "hrs left",
    off: "OFF",
    price: "Price",
    view: "View",
    noProducts: "No discounted products available",
    imageNotAvailable: "Image not available",
    seeMore: "See More"
  });
  const [translatedProducts, setTranslatedProducts] = useState([]);

  useEffect(() => {
    dispatch(getProducts());
  }, [dispatch]);

  // Translate static content
  useEffect(() => {
    const translateAll = async () => {
      const translations = await Promise.all([
        translateText("🔥 Flash Sales"),
        translateText("⏳ Limited Time Offer!"),
        translateText("hrs left"),
        translateText("OFF"),
        translateText("Price"),
        translateText("View"),
        translateText("No discounted products available"),
        translateText("Image not available"),
        translateText("See More")
      ]);

      setTranslatedContent({
        flashSales: translations[0],
        limitedOffer: translations[1],
        hrsLeft: translations[2],
        off: translations[3],
        price: translations[4],
        view: translations[5],
        noProducts: translations[6],
        imageNotAvailable: translations[7],
        seeMore: translations[8]
      });
    };

    translateAll();
  }, [selectedLanguage, translateText]);

  // Translate product names
  useEffect(() => {
    const translateProductNames = async () => {
      if (products && products?.length > 0) {
        const translated = await Promise.all(
          products.map(async (product) => ({
            ...product,
            translatedName: selectedLanguage === "English"
              ? product.name
              : await translateText(product.name)
          }))
        );
        setTranslatedProducts(translated);
      }
    };

    translateProductNames();
  }, [products, selectedLanguage, translateText]);

  const filterDiscountedProducts = (products) => {
    const currentTime = new Date();
    return products?.filter((product) => {
      const discountEnd = new Date(product.discountEndDate);
      const timeDifference = (discountEnd - currentTime) / (1000 * 60 * 60);
      return timeDifference <= 24 && timeDifference > 0;
    });
  };

  const discountedProducts = filterDiscountedProducts(translatedProducts?.length > 0 ? translatedProducts : products);
  const visibleProducts = discountedProducts?.slice(0, visibleCount);
  const canShowMore = visibleCount < discountedProducts?.length;

  // Format product name with truncation
  const formatProductName = (name) => {
    const displayName = name || "";
    return displayName?.length > 10 ? `${displayName.slice(0, 14)}...` : displayName;
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="bg-red-500 text-white py-4 px-6 md:px-10 rounded-lg flex flex-col md:flex-row justify-between items-center shadow-lg mb-6">
        <h2 className="text-2xl md:text-3xl font-bold">{translatedContent.flashSales}</h2>
        <div className="bg-white text-red-500 font-bold px-5 py-2 rounded-full text-lg shadow-md animate-pulse mt-3 md:mt-0">
          {translatedContent.limitedOffer}
        </div>
      </div>
      {discountedProducts?.length > 0 ? (
        <>
          <div className="relative">
            <Swiper
              modules={[Navigation, Autoplay]}
              spaceBetween={20}
              slidesPerView={1}
              loop={true}
              autoplay={{ delay: 3000, disableOnInteraction: false }}
              navigation={{
                nextEl: ".swiper-button-next-custom",
                prevEl: ".swiper-button-prev-custom",
              }}
              breakpoints={{
                1280: { slidesPerView: 6 },
                1024: { slidesPerView: 4 },
                768: { slidesPerView: 3 },
                640: { slidesPerView: 2 },
                480: { slidesPerView: 1 },
              }}
            >
              {visibleProducts?.map((product) => (
                <SwiperSlide key={product._id} className="p-4 border-2 rounded-lg shadow-md bg-white relative group">
                  <span className="absolute top-2 left-2 bg-red-600 text-white px-3 py-1 text-xs font-bold rounded-md">
                    {Math.floor((new Date(product.discountEndDate) - new Date()) / (1000 * 60 * 60))} {translatedContent.hrsLeft}
                  </span>
                  <span className="absolute top-2 right-2 bg-[#6425C4] text-white px-3 py-1 text-xs font-bold rounded-md">
                    {product.discountPercentage}% {translatedContent.off}
                  </span>

                  {product.images && product.images.length > 1 ? (
                    <Swiper spaceBetween={10} slidesPerView={1} autoplay={{ delay: 2000 }} loop={true} navigation={false}>
                      {product.images.map((image, idx) => (
                        image?.url ? (
                          <SwiperSlide key={idx}>
                            <img
                              src={`${import.meta.env.VITE_APP}/${image.url.replace(/\\/g, "/")}`}
                              alt={`Product Image ${idx + 1}`}
                              className="w-full object-cover h-[150px] md:h-[150px] rounded-lg"
                            />
                          </SwiperSlide>
                        ) : (
                          <p key={idx} className="text-center">{translatedContent.imageNotAvailable}</p>
                        )
                      ))}
                    </Swiper>
                  ) : product.images?.[0]?.url ? (
                    <img
                      src={`${import.meta.env.VITE_APP}/${product.images[0].url.replace(/\\/g, "/")}`}
                      alt={product.translatedName || product.name}
                      className="w-full h-[150px] object-cover rounded-lg"
                    />
                  ) : (
                    <p className="text-center">{translatedContent.imageNotAvailable}</p>
                  )}

                  <h3 className="text-lg font-bold mt-4 text-center">
                    {formatProductName(product.translatedName || product.name)}
                  </h3>

                  <p className="text-[#6425C4] font-bold text-center text-lg mt-1">
                    {translatedContent.price}: <span className='text-sm'>A.D </span>{product.discountedPrice.toFixed(1)}
                  </p>
                  <p className="text-gray-500 line-through text-center text-sm mt-1">
                    {translatedContent.price}: <span className='text-sm'>A.D </span>{product.price}
                  </p>

                  {/* View Button on Hover */}
                  <button
                    onClick={() => window.location.href = `/single-product/${product._id}`}
                    className="absolute bottom-0 left-0 w-full bg-[#4222C4] text-white text-center py-2 opacity-0 group-hover:opacity-100 transition-all duration-300 ease-in-out"
                  >
                    {translatedContent.view}
                  </button>
                </SwiperSlide>
              ))}
            </Swiper>

            {/* Custom Navigation Arrows */}
            <div className="swiper-button-prev-custom">
              <PrevArrow />
            </div>
            <div className="swiper-button-next-custom">
              <NextArrow />
            </div>
          </div>
          {canShowMore && (
            <div className="text-center mt-6">
              <button
                onClick={() => setVisibleCount(prev => prev + 6)}
                className="bg-[#4222C4] text-white px-6 py-2 rounded-lg font-semibold hover:bg-[#351ca2] transition-all duration-300"
              >
                {translatedContent.seeMore}
              </button>
            </div>
          )}

        </>
      ) : (
        <p className="text-center text-gray-500 text-lg">{translatedContent.noProducts}</p>
      )}
    </div>
  );
}