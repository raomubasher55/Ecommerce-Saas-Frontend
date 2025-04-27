import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { Navigation } from "swiper/modules";
import { Link, useNavigate } from "react-router-dom";
import { getProducts } from "../../store/actions/productActions";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Slider from "react-slick";
import sliderSettings from "../sliders/sliderSettings";
import { useLanguage } from "../../context/LanguageContext";

export default function TopDeals() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { selectedLanguage, translateText } = useLanguage();
  const [translatedContent, setTranslatedContent] = useState({
    topDeals: "Top Deals",
    viewDetails: "View Details",
    off: "OFF",
    imageNotAvailable: "Image not available"
  });
  const [translatedProducts, setTranslatedProducts] = useState([]);

  const { products } = useSelector((state) => state.allProducts);

  useEffect(() => {
    dispatch(getProducts());
  }, [dispatch]);

  // Translate static content
  useEffect(() => {
    const translateAll = async () => {
      const translations = await Promise.all([
        translateText("Top Deals"),
        translateText("View Details"),
        translateText("OFF"),
        translateText("Image not available")
      ]);

      setTranslatedContent({
        topDeals: translations[0],
        viewDetails: translations[1],
        off: translations[2],
        imageNotAvailable: translations[3]
      });
    };

    translateAll();
  }, [selectedLanguage, translateText]);

  // Translate product names
  useEffect(() => {
    const translateProductNames = async () => {
      if (products && products.length > 0) {
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

  const handleProductClick = (id) => {
    navigate(`/single-product/${id}`);
  };

  const discountedProducts = (translatedProducts.length > 0 ? translatedProducts : products)?.filter((product) => {
    const isDiscounted = product.discountedPrice !== product.price;
    const isDiscountActive = !product.discountExpiry || new Date(product.discountExpiry) > new Date();
    return isDiscounted && isDiscountActive;
  });

  return (
    <div className="container px-4 mb-10 mt-[120px]">
      <h1 className="font-bold text-[#4222C4] text-2xl mb-5">
        {translatedContent.topDeals}
      </h1>
      <Swiper
        modules={[Navigation]}
        spaceBetween={10}
        slidesPerView={2}
        breakpoints={{
          640: { slidesPerView: 3 },
          768: { slidesPerView: 4 },
          1024: { slidesPerView: 6 },
        }}
        loop={true}
        grabCursor={true}
        navigation
        className="mySwiper"
      >
        {discountedProducts?.length > 0 ? (
          discountedProducts?.map((product) => (
            <SwiperSlide
              key={product._id}
              className="relative swiper-card overflow-hidden flex flex-col items-center border-2 rounded-lg p-2 border-[#4222c41f] shadow-xl"
            >
              <div className="w-full h-[160px] md:h-[210px]">
                {product.images && product.images.length > 1 ? (
                  <Slider {...sliderSettings}>
                    {product.images.map((image, idx) => {
                      if (image?.url) {
                        const imageUrl = `${import.meta.env.VITE_APP}/${image.url.replace(/\\/g, '/')}`;
                        return (
                          <div key={idx}>
                            <Link to={`/single-product/${product._id}`}>
                              <img
                                src={imageUrl}
                                alt={`Image ${idx + 1}`}
                                className="w-full h-[150px] md:h-[200px] object-fit rounded-lg m-0"
                              />
                            </Link>
                          </div>
                        );
                      } else {
                        return <p key={idx}>{translatedContent.imageNotAvailable}</p>;
                      }
                    })}
                  </Slider>
                ) : (
                  product.images[0]?.url ? (
                    <Link to={`/single-product/${product._id}`}>
                      <img
                        src={`${import.meta.env.VITE_APP}/${product.images[0].url.replace(/\\/g, '/')}`}
                        alt={product.name}
                        className="w-full h-[150px] md:h-[200px] object-fit rounded-lg m-0"
                      />
                    </Link>
                  ) : (
                    <p>{translatedContent.imageNotAvailable}</p>
                  )
                )}
              </div>
              {product.discountPercentage > 0 && (
                <div className="absolute top-5 right-0 bg-red-500 bg-opacity-80 text-white text-xs px-2 py-1 rounded-bl-lg">
                  {product.discountPercentage}% {translatedContent.off}
                </div>
              )}
              <div className="w-full text-black p-2 text-sm">
                <div className="text-[#4222C4] font-semibold">
                  {product.translatedName || product.name}
                </div>
                <div className="text-lg font-semibold">
                  {product.discountedPrice} <span className='text-sm'>A.D </span>
                </div>
                <div className="text-xs line-through text-gray-400">
                  {product.price} A.D
                </div>
              </div>
              <button
                className="absolute swiper-button bottom-[-50px] left-1/2 transform -translate-x-1/2 bg-[#4222C4] text-white px-2 py-1 text-[12px] rounded hover:bg-[#3218a2] transition-all duration-300"
                onClick={() => handleProductClick(product._id)}
              >
                {translatedContent.viewDetails}
              </button>
            </SwiperSlide>
          ))
        ) : (
          [...Array(6)].map((_, index) => (
            <SwiperSlide key={index} className="relative swiper-card flex flex-col items-center border-2 rounded-lg p-2 border-gray-200 shadow-xl">
              <div className="w-full h-[160px] md:h-[210px] bg-gray-300 animate-pulse rounded-lg"></div>
              <div className="w-3/4 h-4 bg-gray-300 animate-pulse rounded my-2"></div>
              <div className="w-1/2 h-4 bg-gray-300 animate-pulse rounded"></div>
            </SwiperSlide>
          ))
        )}
      </Swiper>
    </div>
  );
}