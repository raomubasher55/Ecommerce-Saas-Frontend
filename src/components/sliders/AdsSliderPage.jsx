import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function AdsSliderPage({ ads }) {
  const [currentAdIndex, setCurrentAdIndex] = useState(0);

  useEffect(() => {
    if (ads.length > 1) {
      const interval = setInterval(() => {
        setCurrentAdIndex((prevIndex) => (prevIndex + 2) % ads.length);
      }, 30000);
      return () => clearInterval(interval);
    }
  }, [ads]);

  return (
    <div className="w-[95%] mx-auto mt-10 p-2">
      <div className="w-full h-max bg-[#5e37fa] rounded">
        <h1 className="text-[17px] font-medium text-center p-2 text-white">
          Take care of yourself with our selection
        </h1>

        {/* Ads images */}
        <div className="w-full overflow-hidden bg-white p-2 grid grid-cols-1 sm:grid-cols-2 gap-2">
          {/* First Ad */}
          {ads.length > 0 && (
            <Link to={`/single-product/${ads[currentAdIndex]?.product?._id}`}>
              <img
                className="w-full h-[150px] md:h-[400px] transform transition-transform duration-300 hover:scale-[1.02]"
                src={
                  ads[currentAdIndex]?.image
                    ? `${import.meta.env.VITE_APP}/${ads[currentAdIndex]?.image.replace(/\\/g, "/")}`
                    : `${import.meta.env.VITE_APP}/${ads[currentAdIndex]?.product?.images[0]?.url.replace(/\\/g, "/")}`
                }
                alt={ads[currentAdIndex]?.title || "Ad Image"}
              />
            </Link>
          )}

          {/* Second Ad */}
          {ads.length > 1 && (
            <Link to={`/single-product/${ads[(currentAdIndex + 1) % ads.length]?.product?._id}`}>
              <img
                className="w-full h-[150px] md:h-[400px] transform transition-transform duration-300 hover:scale-[1.02]"
                src={
                  ads[(currentAdIndex + 1) % ads.length]?.image
                    ? `${import.meta.env.VITE_APP}/${ads[(currentAdIndex + 1) % ads.length]?.image.replace(/\\/g, "/")}`
                    : `${import.meta.env.VITE_APP}/${ads[(currentAdIndex + 1) % ads.length]?.product?.images[0]?.url.replace(/\\/g, "/")}`
                }
                alt={ads[(currentAdIndex + 1) % ads.length]?.title || "Ad Image"}
              />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
