import { getActiveAds } from "../../store/actions/adActions";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/autoplay";
import { Autoplay, Navigation, Pagination } from "swiper/modules";

export const WelcomeSalesSlider = () => {
  const { loading, ads, error } = useSelector((state) => state.adData);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getActiveAds());
  }, [dispatch]);

  // Default image URL
  const defaultImage =
    "https://media.istockphoto.com/id/2098359215/photo/digital-marketing-concept-businessman-using-laptop-with-ads-dashboard-digital-marketing.jpg?s=612x612&w=0&k=20&c=OdQP1rq-YcNN2nIuC8slL1BJKEwdYb7rT5mqTUNSTZQ=";

  // If error occurs or no ads are available, use the default image
  const adImages =
    error || ads.length === 0
      ? [{ url: defaultImage, id: "default" }]
      : ads.map((ad) => ({
          url: ad.image? `${import.meta.env.VITE_APP}/${ad?.image?.replace(/\\/g, "/")}` : `${import.meta.env.VITE_APP}/${ad?.product?.images[0]?.url.replace(/\\/g, "/")}` ,
          id: ad?.product?._id,
        }));

  return (
    <div className="w-full md:w-3/5 px-2 md:h-[500px] rounded overflow-hidden z-0 ">
      {/* {loading && <p>Loading...</p>} */}

      <Swiper
        spaceBetween={20}
        slidesPerView={1}
        pagination={false}
        loop={true}
        autoplay={{ delay: 3000, disableOnInteraction: false }}
        modules={[Autoplay, Navigation, Pagination]}
        className="w-full max-w-full mx-auto h-full overflow-hidden"
      >
        {adImages.map((ad) => (
          <SwiperSlide key={ad.id}>
            {ad.id === "default" ? (
              <img
                src={ad.url}
                alt="Default Ad"
                className="w-full h-[300px] md:h-[470px] object-cover rounded-lg shadow-lg cursor-pointer z-0"
              />
            ) : (
              <Link
                to={`/single-product/${ad.id}`}
                className="block overflow-hidden rounded"
              >
                <img
                  src={ad.url}
                  alt="Ad"
                  className="w-full h-[300px] md:h-[470px] object-cover rounded-lg shadow-lg cursor-pointer"
                />
              </Link>
            )}
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};
