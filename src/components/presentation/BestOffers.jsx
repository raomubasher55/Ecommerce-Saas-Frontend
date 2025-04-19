import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getProducts } from "../../store/actions/productActions";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { useLanguage } from '../../context/LanguageContext';

export default function BestOffers() {
  const dispatch = useDispatch();
  const { products } = useSelector((state) => state.allProducts);
  const { selectedLanguage, translateText } = useLanguage();
  const [translatedContent, setTranslatedContent] = useState({
    bestOffers: "Best Offers",
    discountText: "Discount More Than 30%",
    imageNotAvailable: "Image not available"
  });
  const [translatedProducts, setTranslatedProducts] = useState([]);

  useEffect(() => {
    dispatch(getProducts());
  }, [dispatch]);

  // Translate static content
  useEffect(() => {
    const translateAll = async () => {
      const translations = await Promise.all([
        translateText("Best Offers"),
        translateText("Discount More Than 30%"),
        translateText("Image not available")
      ]);

      setTranslatedContent({
        bestOffers: translations[0],
        discountText: translations[1],
        imageNotAvailable: translations[2]
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

  const bestOffers = (translatedProducts.length > 0 ? translatedProducts : products)?.filter(product =>
    product.discountPercentage && product.discountPercentage >= 30
  );

  const swiperSettings = {
    slidesPerView: 2,
    spaceBetween: 10,
    loop: true,
    navigation: true,
    breakpoints: {
      1024: {
        slidesPerView: 9,
        spaceBetween: 20,
      },
      768: {
        slidesPerView: 5,
        spaceBetween: 15,
      },
      480: {
        slidesPerView: 2,
        spaceBetween: 10,
      },
    },
  };

  return (
    <div className="w-full container p-4 bg-[#f3f4f6] mt-10 mb-10">
      <h2 className="text-center text-xl font-bold text-[#4222C4] mb-4">
        {translatedContent.bestOffers} <br className="block sm:hidden" />
        <span className="text-sm">({translatedContent.discountText})</span>
      </h2>
  
      {bestOffers?.length > 0 ? (
        <Swiper {...swiperSettings}>
          {bestOffers?.map((product) => (
            <SwiperSlide key={product._id}>
              <Link to={`/single-product/${product._id}`} className="text-center px-2">
                <div className="w-28 h-28 mx-auto rounded-full overflow-hidden border bg-[#F1EBDD] border-[#4222c494]">
                  {product.images && product.images.length > 1 ? (
                    <div>
                      {product.images.map((image, idx) => {
                        if (image?.url) {
                          const imageUrl = `${import.meta.env.VITE_APP}/${image.url.replace(/\\/g, "/")}`;
                          return (
                            <div key={idx} className="w-full h-full">
                              <img
                                src={imageUrl}
                                alt={`Image ${idx + 1}`}
                                className="w-full h-full object-cover rounded-full m-0"
                              />
                            </div>
                          );
                        } else {
                          return <p key={idx}>{translatedContent.imageNotAvailable}</p>;
                        }
                      })}
                    </div>
                  ) : product.images[0]?.url ? (
                    <img
                      src={`${import.meta.env.VITE_APP}/${product.images[0].url.replace(/\\/g, "/")}`}
                      alt={product.name}
                      className="w-full h-full object-cover rounded-full m-0"
                    />
                  ) : (
                    <p>{translatedContent.imageNotAvailable}</p>
                  )}
                </div>
                <p className="mt-2 text-sm text-gray-800">
                  {product.translatedName || product.name}
                </p>
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
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