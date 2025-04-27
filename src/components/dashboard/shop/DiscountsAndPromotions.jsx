import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUnconfirmedAds } from "../../../store/actions/adActions";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loader from '../../layout/Loader';

export default function DiscountsAndPromotions() {
  const dispatch = useDispatch();
  const { loading, ads, error } = useSelector((state) => state.adData);

  const [selectedAd, setSelectedAd] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchUnconfirmedAds());
  }, [dispatch]);

  const handleConfirmClick = (ad) => {
    setSelectedAd(ad);
    setIsModalOpen(true);
  };

  const confirmAdRequest = async () => {
    const token = localStorage.getItem("storeToken");
    try {
      await axios.put(
        `${import.meta.env.VITE_APP}/api/v1/ads/confirm/${selectedAd._id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Ad confirmed successfully!");
      setIsModalOpen(false);
      dispatch(fetchUnconfirmedAds());
    } catch (error) {
      console.log(error.response?.data?.error?.message)
      toast.error(error.response?.data?.error?.message);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
        Unconfirmed Ads
      </h1>
      {loading && <p className="text-blue-500 text-center"> <Loader /> </p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {ads.length > 0 ? (
          ads.map((ad) => (
            <div
              key={ad._id}
              className="relative bg-white/30 backdrop-blur-lg shadow-lg rounded-xl p-6 border border-gray-300 transition-all hover:shadow-2xl"
            >
              {/* Status Badge in Top-Right Corner */}
              <span
                className={`absolute top-2 right-2 px-3 py-1 text-sm font-semibold text-white rounded ${
                  ad.status === "active" ? "bg-green-500" : "bg-red-500"
                }`}
              >
                {ad.status.toUpperCase()}
              </span>

              <h2 className="text-2xl font-semibold text-gray-700">{ad.title}</h2>
              <p className="text-gray-600 mt-2">{ad.description}</p>

              {/* Product ID */}
              <p className="text-sm text-gray-500 mt-1">
                <strong>Product ID:</strong> {ad.product}
              </p>

              <p className="text-sm text-gray-500 mt-1">
                <strong>Price:</strong> A.D {ad.price}
              </p>

              <button
                className="mt-4 w-full bg-blue-600 text-white py-2 rounded-md font-semibold shadow-md hover:bg-blue-700 transition duration-200"
                onClick={() => handleConfirmClick(ad)}
              >
                Confirm Ad
              </button>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-center col-span-2">
            No unconfirmed ads found.
          </p>
        )}
      </div>

      {/* Confirmation Modal */}
      {isModalOpen && selectedAd && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 transition-opacity">
          <div className="bg-white p-6 rounded-xl shadow-xl w-[90%] sm:max-w-sm transform transition-all scale-105">
            <h2 className="text-xl font-semibold text-gray-800 mb-3">
              Confirm Ad
            </h2>
            <p className="text-gray-600">
              After approval, <strong>A.D {selectedAd.price}</strong> will be
              deducted from your account. Your ad will be active from{" "}
              <strong>
                {new Date(selectedAd.startDate).toLocaleDateString()}
              </strong>{" "}
              to{" "}
              <strong>{new Date(selectedAd.endDate).toLocaleDateString()}</strong>.
            </p>
            <div className="mt-5 flex justify-around gap-3">
              <button
                className="px-4 py-2 bg-gray-400 text-white rounded-md shadow-md hover:bg-gray-500 transition"
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-green-500 text-white rounded-md shadow-md hover:bg-green-600 transition"
                onClick={confirmAdRequest}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
