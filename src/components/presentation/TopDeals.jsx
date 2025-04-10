import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { Navigation } from "swiper/modules";
import { Link, useNavigate } from "react-router-dom";
import { getProducts } from "../../store/actions/productActions";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Slider from "react-slick";
import sliderSettings from "../sliders/sliderSettings";

export default function TopDeals() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { products } = useSelector((state) => state.allProducts);

  useEffect(() => {
    dispatch(getProducts());
  }, [dispatch]);

  const handleProductClick = (id) => {
    navigate(`/single-product/${id}`);
  };

  const discountedProducts = products?.filter(
    (product) =>
      product.discountPercentage && product.discountPercentage > 0
  );

 

    return (
      <div className="container px-4 mb-10 mt-[120px]">
        <h1 className="font-bold text-[#4222C4] text-2xl mb-5">Top Deals</h1>
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
                          return <p key={idx}>Image not available</p>;
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
                      <p>Image not available</p>
                    )
                  )}
                </div>
                {product.discountPercentage > 0 && (
                  <div className="absolute top-5 right-0 bg-red-500 bg-opacity-80 text-white text-xs px-2 py-1 rounded-bl-lg">
                    {product.discountPercentage}% OFF
                  </div>
                )}
                <div className="w-full text-black p-2 text-sm">
                  <div className="text-[#4222C4] font-semibold">
                    {product.name}
                  </div>
                  <div className="text-lg font-semibold">
                    {product.discountedPrice} <span className='text-sm'>A.D </span>
                  </div>
                  <div className="text-xs line-through text-gray-400">
                    {product.price} $
                  </div>
                </div>
                <button
                  className="absolute swiper-button bottom-[-50px] left-1/2 transform -translate-x-1/2 bg-[#4222C4] text-white px-2 py-1 text-[12px] rounded hover:bg-[#3218a2] transition-all duration-300"
                  onClick={() => handleProductClick(product._id)}
                >
                  View Details
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
