import React, { useState } from "react";

const PaymentMethodModal = ({ showModal, onClose, onSave, userData }) => {
  const [editedPayment, setEditedPayment] = useState(userData);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedPayment({ ...editedPayment, [name]: value });
  };

  const handleSave = () => {
    onSave(editedPayment);
  };

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h3 className="text-xl font-semibold mb-4">Edit Payment Method</h3>
        
        <label className="block text-gray-600 mb-2">Method</label>
        <input
          type="text"
          name="method"
          value={editedPayment.method}
          onChange={handleChange}
          className="w-full px-4 py-2 rounded-lg bg-gray-200"
        />
        
        <label className="block text-gray-600 mb-2 mt-4">Card Number</label>
        <input
          type="text"
          name="cardNumber"
          value={editedPayment.cardNumber}
          onChange={handleChange}
          className="w-full px-4 py-2 rounded-lg bg-gray-200"
        />

        <label className="block text-gray-600 mb-2 mt-4">Expiry Date</label>
        <input
          type="text"
          name="expiryDate"
          value={editedPayment.expiryDate}
          onChange={handleChange}
          className="w-full px-4 py-2 rounded-lg bg-gray-200"
        />

        <div className="flex justify-end mt-4">
          <button
            onClick={handleSave}
            className="bg-[#4222C4] text-white px-6 py-2 rounded-md hover:bg-[#2e179b] transition"
          >
            Save Changes
          </button>
        </div>
        <button
          onClick={onClose}
          className="mt-4 text-red-500 hover:text-red-700"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default PaymentMethodModal;
