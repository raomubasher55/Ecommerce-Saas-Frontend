import { FaQuestionCircle, FaUndoAlt, FaStore } from "react-icons/fa";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/autoplay";
import { Autoplay } from "swiper/modules";
import { getActiveAds } from "../../store/actions/adActions";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { Link } from "react-router-dom";

export const HelpCenterCard = () => {
	const { loading, ads, error } = useSelector((state) => state.adData);
	const dispatch = useDispatch();
  
	useEffect(() => {
	  dispatch(getActiveAds());
	}, [dispatch]);

	const adImages = ads.map((ad) => ({
    url: ad.image? `${import.meta.env.VITE_APP}/${ad?.image?.replace(/\\/g, "/")}` : `${import.meta.env.VITE_APP}/${ad?.product?.images[0]?.url.replace(/\\/g, "/")}` ,
		id: ad?.product?._id,
	  }));


  const moreAddLink = [
    {
      icon: <FaQuestionCircle className="text-2xl text-[#4222c4de]" />,
      titleLink: "Help Center",
      descriptionLink: "Guide To Customer Care",
      link:'/help-center'
    },
    {
      icon: <FaUndoAlt className="text-2xl text-[#4222c4de]" />,
      titleLink: "Easy Return",
      descriptionLink: "Quick Refund",
      link:'/return-policy'
    },
    {
      icon: <FaStore className="text-2xl text-[#4222c4de]" />,
      titleLink: "Sell On Cebleu",
      descriptionLink: "Millions of Visitors",
      link:'/sell-on-cebleu'
    },
  ];

  const helpMoreOptions = moreAddLink.map((link) => (
    <Link to={link.link}
      key={link.titleLink}
      className="flex items-center p-2 cursor-pointer bg-gray-50 rounded-md hover:bg-gray-100 transition-colors mb-2"
    >
      <div className="flex-shrink-0 w-[2.5rem] h-[2.5rem] flex items-center justify-center border rounded-full border-[#4222c4]">
        {link.icon}
      </div>
      <div className="ml-3">
        <h1 className="text-primary-font-color text-sm font-semibold uppercase">
          {link.titleLink}
        </h1>
        <p className="text-primary-font-color text-xs capitalize">
          {link.descriptionLink}
        </p>
      </div>
    </Link>
  ));

  return (
    <div className="w-full md:w-1/4 p-4">
      <div className="p-2 rounded space-y-3">{helpMoreOptions}</div>
      
      {/* Swiper for the image slider */}
      <div className="w-full h-[220px] mt-4">
        <Swiper
          spaceBetween={0}
          slidesPerView={1}
          loop={true}
          autoplay={{ delay: 3000, disableOnInteraction: false }}
          modules={[Autoplay]}
          className="w-full h-full"
        >
          {adImages.map((ad) => (
            <SwiperSlide key={ad.id}>
              <Link to={`/single-product/${ad.id}`} className="block overflow-hidden rounded">
                <img
                  src={ad.url}
                  alt="Ad"
                  className="w-full h-full object-cover rounded-md"
                />
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};
