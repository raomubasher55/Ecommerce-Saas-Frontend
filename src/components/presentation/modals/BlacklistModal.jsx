import React from "react";
import { useDispatch } from "react-redux";
import { blacklistProduct } from "../../../store/actions/blacklistActions";
import { fetchStoreProducts } from "../../../store/actions/storeActions";

const BlacklistModal = ({ product, setIsBlacklistModalOpen }) => {
  const dispatch = useDispatch();

  const handleBlacklist = () => {
    dispatch(blacklistProduct(product._id, product.seller));
    setIsBlacklistModalOpen(false); 
    dispatch(fetchStoreProducts());
  };

  const onClose = ()=>{
    setIsBlacklistModalOpen(false)
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-lg font-bold mb-4">Blacklist Product <span className="text-red-700 font-bold">{product.name}</span></h2>
        <p>Are you sure you want to blacklist this product?</p>
        <div className="flex justify-end mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded mr-2"
          >
            Cancel
          </button>
          <button
            onClick={handleBlacklist}
            className="px-4 py-2 bg-red-600 text-white rounded"
          >
            Yes, Blacklist
          </button>
        </div>
      </div>
    </div>
  );
};

export default BlacklistModal;
