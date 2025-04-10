import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getProducts } from "../../store/actions/productActions";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

export default function BestOffers() {
  const dispatch = useDispatch();
  const { products } = useSelector((state) => state.allProducts);
  useEffect(() => {
    dispatch(getProducts());
  }, [dispatch]);

  const bestOffers = products?.filter(product =>
    product.discountPercentage && product.discountPercentage >= 30
  );

  const swiperSettings = {
    slidesPerView: 2, // Default for mobile
    spaceBetween: 10, // Smaller space for better fit
    loop: true,
    navigation: true,
    breakpoints: {
      1024: {
        slidesPerView: 9, // For tablets and above
        spaceBetween: 20,
      },
      768: {
        slidesPerView: 5, // For medium-sized screens
        spaceBetween: 15,
      },
      480: {
        slidesPerView: 2, // For small screens
        spaceBetween: 10,
      },
    },
  };

  return (
    <div className="w-full container p-4 bg-[#f3f4f6] mt-10 mb-10">
      <h2 className="text-center text-xl font-bold text-[#4222C4] mb-4">
        Best Offers <br className="block sm:hidden" />
        <span className="text-sm">(Discount More Than 30%)</span>
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
                          return <p key={idx}>Image not available</p>;
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
                    <p>Image not available</p>
                  )}
                </div>
                <p className="mt-2 text-sm text-gray-800">{product.name}</p>
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
